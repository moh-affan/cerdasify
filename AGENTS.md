# AGENTS.md — Development Guidelines for Cerdasify

Panduan ini ditujukan untuk setiap AI Agent maupun Software Engineer yang berkontribusi dalam perancangan, pengembangan, dan pemeliharaan codebase **Cerdasify**.

---

## 1. Identitas & Visi Proyek

- **Nama Proyek:** Cerdasify
- **Tujuan:** Platform latihan soal dan simulasi ujian (Olimpiade, TKA, CPNS, UTBK) yang cepat, ringan, aman, dan mobile-friendly.
- **Prinsip Utama:**
  1. **Zero-Fluff, Maximum Speed:** Antarmuka harus instan, ringan (*lightweight*), tidak menggunakan library berat yang memperlambat rendering ponsel kelas menengah ke bawah.
  2. **Rock-Solid Exam Integrity:** Kunci jawaban soal ujian **HARAM** dikirim ke client browser selama sesi ujian berlangsung.
  3. **Data Safety & Concurrency:** Basis data PostgreSQL (Supabase) diakses lewat satu koneksi singleton; operasi multi-tabel wajib di dalam transaksi.
  4. **Strict RBAC:** Super Admin, Admin, dan User terisolasi secara ketat di level API, Middleware, dan Database Query.
  5. **Environment & Secret Privacy:** Kredensial, password, JWT secret, dan connection string (`.env`, `.env.local`) **HARAM** diekspos atau dicetak ke output chat maupun log terminal. Eksekusi skrip wajib me-load berkas environment secara internal tanpa melakukan echo/print rahasia ke stdout.

---

## 2. Arsitektur & Aturan Teknis Inti

### 2.1. Framework & Pola Komponen
- Gunakan **Next.js (App Router)** dengan **TypeScript (Strict Mode)**.
- Maksimalkan **React Server Components (RSC)** untuk rendering data statis/dashboard guna meminimalkan JavaScript bundle ke browser.
- Gunakan **Client Components (`'use client'`)** hanya untuk interaktivitas ujian (state timer, opsi terpilih, toggle navigasi soal, LaTeX preview input).
- Kelola state pengerjaan ujian secara lokal dengan sinkronisasi background (*optimistic auto-save*) ke server.

### 2.2. PostgreSQL (Supabase) — Konfigurasi Wajib
Koneksi basis data diinisialisasi **sekali** di `src/db/index.ts` memakai `postgres` (postgres-js) dan `drizzle-orm/postgres-js`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // WAJIB untuk Supabase connection pooler (transaction mode)
  ssl: 'require',
  max: 10,
});

export const db = drizzle(client, { schema });
```

- Operasi yang menyentuh lebih dari satu tabel/baris yang saling bergantung **wajib** memakai `db.transaction(...)`.
- Perubahan skema ditulis di `src/db/schema/index.ts` **dan** `src/db/migrate.ts` secara idempoten (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`).
- Error API dikembalikan lewat `apiError()` (`src/lib/api.ts`): detail error database hanya dicatat di log server, klien menerima pesan umum.

> **Aturan Agen:** Jangan pernah mencetak `DATABASE_URL`/kredensial ke output, dan jangan menjalankan migrasi atau seed ke database produksi tanpa izin eksplisit pemilik proyek.

### 2.3. Keamanan Sesi Ujian (Exam Session Anti-Leak)
- **Saat Mengambil Soal Ujian (Active Attempt):**
  - Endpoint API / Server Action **HANYA** boleh mengembalikan: `question_id`, `content_markdown`, `image_url`, dan opsi jawaban (`option_id`, `label`, `content_markdown`, `image_url`).
  - **DILARANG KERAS** menyertakan field `is_correct`, `score_value`, `explanation_markdown`, atau `explanation_image_url` pada payload soal ujian aktif.
- **Kalkulasi Nilai:**
  - Penilaian dilakukan **100% di server** (`finalizeAttempt` di `src/lib/exam-grading.ts`) saat submit atau saat waktu habis.
  - Soal pilihan tunggal hanya benar bila **tepat satu** opsi dipilih dan itu kuncinya; pilihan ganda kompleks harus sama persis dengan himpunan kunci.
  - Aturan paket (`passing_grade_rules`) hanya mengenal `correctScore`, `wrongScore`, `emptyScore`, `passingScore`, dan `twk/tiu/tkpPassingGrade`. Tulis secara eksplisit di setiap paket (tanpa aturan, salah = −1); paket latihan anak memakai `wrongScore: 0` dan `emptyScore` tidak boleh negatif.
- **Soal Berbobot (`GRADED_SCALE`):** setiap opsi berbobot 1–5 (SJT/TKP), tanpa nilai minus; bobot 5 = tindakan tuntas & sesuai aturan, 1 = melanggar etika/hukum. Setiap opsi harus masuk akal dan pembahasan menjelaskan alasan kelima bobot.
- **Perbaikan Isi Soal:** kunci, pembahasan, dan gambar wajib diverifikasi ulang (hitung sendiri, buka berkas gambarnya, cocokkan dengan naskah sumber) — jangan percaya teks hasil ekstraksi PDF maupun kunci sumber begitu saja. Simpan hasil akhirnya ke bank soal (lihat §2.6).
- **Validasi Waktu di Server (`src/lib/exam-time.ts`):**
  - Sisa waktu dihitung server dari `remaining_seconds` + `segment_started_at`; nilai dari klien hanya boleh *mengurangi* sisa waktu.
  - Jawaban yang dikirim setelah batas waktu (+ toleransi 30 detik) ditolak dan attempt otomatis dinilai sebagai `TIMED_OUT`.
  - Halaman hasil/pembahasan **tidak boleh** menampilkan kunci selama attempt masih `IN_PROGRESS`/`PAUSED`.
- **Acak Soal/Opsi:** bila `shuffle_questions`/`shuffle_options` aktif, urutan diacak deterministik per attempt (`orderQuestionsForAttempt`/`orderOptionsForAttempt`) dan dipakai sama di halaman pembahasan.

### 2.4. Penanganan Soal Bergambar & Rich Media
- **Penyimpanan Berkas:** Gambar diunggah ke Supabase Storage (bucket `uploads`); saat pengembangan lokal jatuh ke `public/uploads/`. Nama file selalu dibuat ulang server dengan format `timestamp-random.ext`.
- **Validasi Unggahan (`/api/admin/upload-image`):** Hanya `image/jpeg`, `image/png`, `image/webp`, maksimal 5MB, dan isi file wajib cocok dengan *magic bytes* formatnya (Content-Type dari klien tidak dipercaya).
- **Lightbox Zoom:** Gambar soal di halaman ujian ([exam/[packageId]/page.tsx](src/app/(exam)/exam/[packageId]/page.tsx)) dan seluruh gambar soal/opsi/pembahasan di halaman hasil ([results/[attemptId]/page.tsx](src/app/(dashboard)/results/[attemptId]/page.tsx), komponen `ZoomableImage`) wajib bisa diklik untuk diperbesar.

### 2.5. Mekanisme State Pause & Resume (Mode Latihan)
- **Tujuan:** Memberikan fleksibilitas pada peserta latihan mandiri tanpa mengorbankan integritas soal.
- **Implementasi Database:**
  - Skema tabel `attempts` memiliki kolom `remaining_seconds: integer('remaining_seconds')` dan status `'PAUSED'`.
- **Rute API:**
  - `POST /api/exam/pause`: Menerima `attemptId` dan `remainingSeconds`, memverifikasi kepemilikan attempt, lalu mengupdate status ke `'PAUSED'`.
  - `POST /api/exam/resume`: Mengembalikan status attempt ke `'IN_PROGRESS'` dan mengembalikan sisa detik pengerjaan.
- **Proteksi Tampilan (Screen Privacy Overlay):** Saat state `isPaused` bernilai `true`, konten soal di antarmuka browser **WAJIB** disembunyikan di balik backdrop overlay (*screen blackout*) sehingga peserta tidak dapat membaca soal sambil menghentikan timer.

### 2.6. Bank Soal Kanonik (`src/db/seed-data/question-bank/`)
- Seluruh kategori, topik, 50 paket, dan 1.623 soal (Oktober 2026) disimpan sebagai JSON di repo dan menjadi **sumber kebenaran** `npm run seed` (idempoten, satu transaksi, validasi sebelum menulis).
- Setelah soal/paket diubah lewat panel admin, **wajib** `npm run bank:export` lalu commit, agar seed berikutnya tidak menimpa perubahan.
- Jangan menambah skrip impor/perbaikan sekali-jalan yang menulis langsung ke database tanpa memperbarui bank soal. Riwayat alasan perbaikan audit ada di `src/db/seed-data/audit/question_fixes_2026_10.jsonl`.
- Gambar soal disimpan di `public/uploads/` dan ikut di-deploy; pastikan setiap `imageUrl` di bank soal ada berkasnya.
- Akun demo tidak memiliki password bawaan; hanya dibuat bila `SEED_DEMO_USERS=true` dengan password dari env.

### 2.7. Pustaka Belajar (Learning Content)
- Konten belajar (Daily Reading, cerita, ensiklopedia, komik, pidato, materi) memakai **satu model generik** `learning_contents` dengan rentang Fase Kurikulum Merdeka (`phase_min`/`phase_max`: A–F, L). Jangan membuat tabel terpisah per jenis konten.
- Kunci kuis bacaan (`content_quiz_items.correct_index`) **HARAM** dikirim ke browser sebelum submit; penilaian dilakukan di `POST /api/learn/complete`.
- Konten untuk Fase A–B wajib ramah anak: kalimat pendek, terjemahan per kalimat, kosakata dengan emoji, tanpa istilah grammar teknis.
- Teks Arab (doa/ayat) disimpan di segmen `{ ar, latin, id }` dan wajib diverifikasi terhadap mushaf/sumber terpercaya sebelum di-seed.
- Konten baru ditambahkan via `src/db/seed-data/learning/` + `npm run seed:learning` (idempoten, tidak menghapus `reading_progress`).
- Konten yang diedit lewat panel admin (`edited_at` terisi) **tidak boleh** ditimpa seeder tanpa `--force`.
- Gambar konten (sampul/panel komik) wajib ringan: WebP/JPEG ≤ 640px untuk aset bawaan di `public/learning/`, dan hanya gambar orisinal, berlisensi bebas, atau hasil AI — jangan menyalin gambar berhak cipta.
- **RBAC Orang Tua–Anak:** relasi lewat `users.parent_id`. Setiap rute `/api/parent/*` wajib memfilter `parent_id = user.userId`; akun yang memiliki `parent_id` (akun anak) tidak boleh mengakses `/orang-tua` maupun membuat akun anak.

---

## 3. Aturan Manajemen Kode & Struktur Direktori

Struktur proyek standar yang harus dipatuhi:

```
cerdasify/
├── data/                      # Berkas lokal (cadangan, catatan kerja) - tidak di-commit
├── public/                    # Aset statis, template import (.csv, .xlsx), logo
│   ├── templates/             # File template import resmi untuk diunduh user
│   └── uploads/               # Berkas gambar stimulus soal & opsi
├── src/
│   ├── app/                   # App Router Next.js
│   │   ├── (auth)/            # Login & session checkpoint
│   │   ├── (dashboard)/       # Dashboard user/peserta & ulasan hasil
│   │   ├── (exam)/            # Halaman pengerjaan ujian (Distraction-free)
│   │   ├── admin/             # Panel Super Admin & Admin
│   │   │   ├── bank-soal/     # Manajemen Soal, Kategori & Topik
│   │   │   ├── import/        # Fitur Import Soal & Peserta
│   │   │   ├── users/         # Manajemen Pengguna
│   │   │   └── packages/      # Manajemen Paket Soal & Ujian
│   │   └── api/               # Route Handlers (Auth, Exam, Admin, Upload)
│   ├── components/            # Reusable UI components
│   │   ├── exam/              # ExamTimer, ExamGridNav, OptionItem, ExamConfirmModal
│   │   ├── katex/             # MathRenderer (LaTeX)
│   │   ├── ui/                # Button, Modal, Drawer, Badge, Input
│   │   └── admin/             # MathEditorToolbar, FileUploader, Table, StatsCard
│   ├── db/                    # Drizzle schema, migrations, connection singleton
│   │   ├── schema/
│   │   ├── index.ts
│   │   ├── seed-data/question-bank/  # Bank soal kanonik (JSON)
│   │   ├── export_question_bank.ts   # npm run bank:export
│   │   └── seed.ts            # Seeder bank soal + Super Admin
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Hashing, token/session management, RBAC checks
│   │   ├── import-parser.ts   # Parser & validator Excel/CSV
│   │   ├── scoring.ts         # Logic penilaian (pilihan ganda & soal berbobot 1-5)
│   │   └── utils.ts
│   └── types/                 # Shared TypeScript interfaces & types
├── DOCS_PANDUAN_PENGGUNAAN.md # Panduan Lengkap Pengguna & Operator
├── DOCS_DEVELOPMENT.md        # Panduan Arsitektur & Rekayasa Developer
├── PRD.md                     # Product Requirements Document
├── AGENTS.md                  # File petunjuk ini
└── README.md                  # Dokumentasi proyek & panduan deployment
```

---

## 4. Konvensi Penulisan Soal & Math Formula (KaTeX & Notasi Sains)

1. **Format Penyimpanan:** Teks soal, opsi jawaban (A–E), dan pembahasan disimpan dalam format **Markdown** dengan dukungan formula matematika/sains.
2. **Notasi Formula yang Wajib Didukung:**
   - **Inline Formula:** `$E = mc^2$` atau `$\frac{a}{b}$` atau `\( x^2 + y^2 = r^2 \)`.
   - **Display / Block Formula:**
     ```markdown
     $$
     x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
     $$
     ```
   - **Multi-line & Environments:** Persamaan majemuk seperti `\begin{aligned} ... \end{aligned}` dan `\begin{cases} ... \end{cases}`.
   - **Matriks & Vektor:** `\begin{pmatrix} a & b \\ c & d \end{pmatrix}`.
   - **Simbol Sains & Notasi Kimia:** Subscript/superscript (`H_2O`, `Fe^{2+}`), derajat celcius, panah reaksi (`\rightarrow`), dan simbol Yunani.
   - **Shorthand / AsciiMath Support:** Konversi otomatis notasi umum yang ditulis cepat (seperti `sqrt(x)` atau `x^2`) melalui utilitas `src/lib/math-parser.ts`.
3. **Aturan Komponen `MathRenderer` (`src/components/katex/MathRenderer.tsx`):**
   - Wajib menyetel konfigurasi KaTeX: `{ throwOnError: false, errorColor: '#ef4444', displayMode: boolean }`.
   - **Graceful Fallback:** Jangan biarkan salah ketik LaTeX membuat seluruh layar crash (*No React White-Screen of Death*). Tangkap error dan tampilkan teks aslinya dengan border lembut.
   - **Mobile-Responsive Wrap:** Bungkus formula block dalam container `<div className="overflow-x-auto max-w-full py-1">` agar rumus panjang pada smartphone dapat digeser mendatar secara halus tanpa merusak tata letak kartu soal.
4. **Editor Soal Admin (`src/components/admin/MathEditorToolbar.tsx`):**
   - Sediakan tombol pintas (*quick-insert toolbar*) untuk menyisipkan template rumus umum: Pecahan (`\frac{}{}`), Akar (`\sqrt{}`), Pangkat (`x^2`), Subskrip (`x_1`), Integral (`\int`), Sigma (`\sum`), Matriks, dan Simbol Yunani.
   - Sediakan tombol pintas Stimulus & Cerita (`📖 Kotak Cerita / Bacaan` dan `💬 Dialog Percakapan`).
   - Sediakan panel Live Preview berdampingan secara instan saat admin mengetik soal.
5. **Penanganan Soal Cerita & Wacana Multi-Nomor (Reading Passages):**
   - Gunakan format blok `:::passage[Judul Wacana]\nIsi wacana/dialog/cerita...\n:::\n\nPertanyaan...`.
   - Ketika 1 wacana/cerita berlaku untuk lebih dari 1 butir soal (misal Soal No. 1–5), blok wacana ini **WAJIB disertakan pada seluruh butir soal di rentang tersebut** agar peserta ujian selalu memiliki akses langsung ke teks bacaan di nomor manapun tanpa kehilangan konteks.
   - `MathRenderer` merender blok wacana ini menjadi kartu wacana visual elegan dengan ikon `BookOpen` dan badge *Stimulus Bacaan*.

---

## 5. Alur Validasi Impor Massal (CSV & Excel)

Ketika mengimplementasikan atau memodifikasi modul import (`import-parser.ts`):
1. **Validasi Skema:** Periksa keberadaan header wajib.
2. **Validasi Baris:**
   - Kolom teks soal tidak boleh kosong.
   - Kolom kategori dan topik harus valid (buat otomatis jika belum ada).
   - Tipe soal `SINGLE`: wajib memiliki opsi yang sesuai dengan kunci (`A` sampai `E`).
   - Tipe soal `SCALE` (TKP): format kunci harus memetakan poin valid (contoh: `A:3,B:5,C:2,D:4,E:1`), pastikan tidak ada opsi yang terlewat.
3. **Transaction Safety:** Gunakan transaksi PostgreSQL (`db.transaction(...)` / `client.begin(...)`) sehingga jika terjadi kesalahan fatal pada baris ke-X, seluruh transaksi dibatalkan atau dikumpulkan ke dalam log laporan error yang jelas per nomor baris untuk Super Admin.

---

## 6. Checklist Verifikasi Sebelum Menandai Tugas Selesai

Setiap agen yang menyelesaikan tugas wajib memverifikasi:
- [ ] `npm run lint` (0 error) dan TypeScript check (`npx tsc --noEmit`) lolos tanpa error tipe.
- [ ] Fitur berjalan dengan responsif pada resolusi layar mobile (360px–420px) dan desktop.
- [ ] Tidak ada kunci jawaban yang bocor di network tab / response JSON pada rute ujian aktif.
- [ ] Fitur Pause & Resume mode latihan berfungsi presisi dan menutup tampilan soal saat dijeda.
- [ ] Soal bergambar dapat di-zoom melalui modal Lightbox.
- [ ] Error database ditangani dengan `apiError()` (log informatif di server, pesan aman ke klien) dan tidak membuat server crash.
- [ ] File template impor (`.csv` dan `.xlsx`) tetap sinkron dengan skema validasi.
- [ ] Dokumentasi (`README.md`, `PRD.md`, `AGENTS.md`, `DOCS_PANDUAN_PENGGUNAAN.md`, `DOCS_DEVELOPMENT.md`) tetap mutakhir.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
