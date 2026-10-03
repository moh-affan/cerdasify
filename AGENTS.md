# AGENTS.md — Development Guidelines for Cerdasify

Panduan ini ditujukan untuk setiap AI Agent maupun Software Engineer yang berkontribusi dalam perancangan, pengembangan, dan pemeliharaan codebase **Cerdasify**.

---

## 1. Identitas & Visi Proyek

- **Nama Proyek:** Cerdasify
- **Tujuan:** Platform latihan soal dan simulasi ujian (Olimpiade, TKA, CPNS, UTBK) yang cepat, ringan, aman, dan mobile-friendly.
- **Prinsip Utama:**
  1. **Zero-Fluff, Maximum Speed:** Antarmuka harus instan, ringan (*lightweight*), tidak menggunakan library berat yang memperlambat rendering ponsel kelas menengah ke bawah.
  2. **Rock-Solid Exam Integrity:** Kunci jawaban soal ujian **HARAM** dikirim ke client browser selama sesi ujian berlangsung.
  3. **Data Safety & Concurrency:** Database SQLite wajib dikonfigurasi dalam mode **WAL (Write-Ahead Logging)** dengan timeout yang aman.
  4. **Strict RBAC:** Super Admin, Admin, dan User terisolasi secara ketat di level API, Middleware, dan Database Query.

---

## 2. Arsitektur & Aturan Teknis Inti

### 2.1. Framework & Pola Komponen
- Gunakan **Next.js (App Router)** dengan **TypeScript (Strict Mode)**.
- Maksimalkan **React Server Components (RSC)** untuk rendering data statis/dashboard guna meminimalkan JavaScript bundle ke browser.
- Gunakan **Client Components (`'use client'`)** hanya untuk interaktivitas ujian (state timer, opsi terpilih, toggle navigasi soal, LaTeX preview input).
- Kelola state pengerjaan ujian secara lokal dengan sinkronisasi background (*optimistic auto-save*) ke server.

### 2.2. SQLite WAL Mode — Konfigurasi Wajib
Setiap inisialisasi koneksi basis data SQLite (via `better-sqlite3` dan `drizzle-orm`) **WAJIB** mengeksekusi PRAGMA berikut:

```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DATABASE_PATH || './data/cerdasify.db');

// Konfigurasi performa tinggi & anti database-lock
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('busy_timeout = 5000');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('cache_size = -64000'); // 64MB Cache

export const db = drizzle(sqlite, { schema });
```

> **Aturan Agen:** Jangan pernah menghapus `busy_timeout` atau mengubah `journal_mode` ke `DELETE` / `MEMORY` tanpa alasan kritis yang terdokumentasi.

### 2.3. Keamanan Sesi Ujian (Exam Session Anti-Leak)
- **Saat Mengambil Soal Ujian (Active Attempt):**
  - Endpoint API / Server Action **HANYA** boleh mengembalikan: `question_id`, `content_markdown`, `image_url`, dan opsi jawaban (`option_id`, `label`, `content_markdown`, `image_url`).
  - **DILARANG KERAS** menyertakan field `is_correct`, `score_value`, `explanation_markdown`, atau `explanation_image_url` pada payload soal ujian aktif.
- **Kalkulasi Nilai:**
  - Penilaian dilakukan **100% di server** saat event submit atau time-out terjadi.
  - Server memvalidasi timestamp pengerjaan (`started_at` vs `finished_at`) untuk mendeteksi manipulasi durasi.

### 2.4. Penanganan Soal Bergambar & Rich Media
- **Penyimpanan Berkas:** Gambar yang diunggah disimpan di folder `public/uploads/` dengan nama unik acak (`timestamp-random.ext`) untuk menghindari benturan nama.
- **Validasi Unggahan (`/api/admin/upload-image`):** Wajib memvalidasi MIME type (`image/jpeg`, `image/png`, `image/webp`) dan batasan ukuran berkas (maksimal 5MB).
- **Lightbox Zoom:** Komponen kartu soal ([QuestionCard.tsx](file:///home/affan/projects/cerdasify/src/components/exam/QuestionCard.tsx)) dan halaman ulasan hasil ([results/[attemptId]/page.tsx](file:///home/affan/projects/cerdasify/src/app/(dashboard)/results/[attemptId]/page.tsx)) wajib membungkus gambar dengan interaksi klik pembesar (Lightbox Modal) untuk memudahkan membaca diagram/geometri di layar smartphone.

### 2.5. Mekanisme State Pause & Resume (Mode Latihan)
- **Tujuan:** Memberikan fleksibilitas pada peserta latihan mandiri tanpa mengorbankan integritas soal.
- **Implementasi Database:**
  - Skema tabel `attempts` memiliki kolom `remaining_seconds: integer('remaining_seconds')` dan status `'PAUSED'`.
- **Rute API:**
  - `POST /api/exam/pause`: Menerima `attemptId` dan `remainingSeconds`, memverifikasi kepemilikan attempt, lalu mengupdate status ke `'PAUSED'`.
  - `POST /api/exam/resume`: Mengembalikan status attempt ke `'IN_PROGRESS'` dan mengembalikan sisa detik pengerjaan.
- **Proteksi Tampilan (Screen Privacy Overlay):** Saat state `isPaused` bernilai `true`, konten soal di antarmuka browser **WAJIB** disembunyikan di balik backdrop overlay (*screen blackout*) sehingga peserta tidak dapat membaca soal sambil menghentikan timer.

### 2.6. Struktur Paket Soal (13 Paket Bawaan)
- **Paket Berkas PRISMA:** Mengelompokkan soal per berkas kompetisi (PRISMA 2025 Level 1, 2, 3 dan PRISMA 2024 Level 1) lengkap dengan aset gambar asli.
- **Paket Standar 40 Butir:** Mengelompokkan soal per sesi latihan berisi tepat 40 butir (Buku Soal Sesi 1, 2, 3, 4, 5, 13, 21).
- **Paket Tematik:** Aljabar Marathon 100 Soal dan Mini CPNS SKD 2026.
- Total terdapat 492 butir soal terdistribusi yang dikelola secara atomic via `src/db/seed.ts`.

---

## 3. Aturan Manajemen Kode & Struktur Direktori

Struktur proyek standar yang harus dipatuhi:

```
cerdasify/
├── data/                      # Lokasi file SQLite (*.db, *.db-wal, *.db-shm) - gitignored
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
│   │   ├── exam/              # Timer, GridNav, QuestionCard, PauseOverlay, Lightbox
│   │   ├── katex/             # MathRenderer (LaTeX)
│   │   ├── ui/                # Button, Modal, Drawer, Badge, Input
│   │   └── admin/             # MathEditorToolbar, FileUploader, Table, StatsCard
│   ├── db/                    # Drizzle schema, migrations, connection singleton
│   │   ├── schema/
│   │   ├── index.ts
│   │   └── seed.ts            # Seeder 492 butir soal & 13 paket
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Hashing, token/session management, RBAC checks
│   │   ├── import-parser.ts   # Parser & validator Excel/CSV
│   │   ├── scoring.ts         # Logic penilaian (Standard, CPNS TKP scale 1-5)
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
   - Sediakan panel Live Preview berdampingan secara instan saat admin mengetik soal.

---

## 5. Alur Validasi Impor Massal (CSV & Excel)

Ketika mengimplementasikan atau memodifikasi modul import (`import-parser.ts`):
1. **Validasi Skema:** Periksa keberadaan header wajib.
2. **Validasi Baris:**
   - Kolom teks soal tidak boleh kosong.
   - Kolom kategori dan topik harus valid (buat otomatis jika belum ada).
   - Tipe soal `SINGLE`: wajib memiliki opsi yang sesuai dengan kunci (`A` sampai `E`).
   - Tipe soal `SCALE` (TKP): format kunci harus memetakan poin valid (contoh: `A:3,B:5,C:2,D:4,E:1`), pastikan tidak ada opsi yang terlewat.
3. **Transaction Safety:** Gunakan transaksi SQLite (`db.transaction(...)`) sehingga jika terjadi kesalahan fatal pada baris ke-X, seluruh transaksi dibatalkan atau dikumpulkan ke dalam log laporan error yang jelas per nomor baris untuk Super Admin.

---

## 6. Checklist Verifikasi Sebelum Menandai Tugas Selesai

Setiap agen yang menyelesaikan tugas wajib memverifikasi:
- [ ] `npm run lint` / TypeScript check (`npx tsc --noEmit`) lolos tanpa error tipe.
- [ ] Fitur berjalan dengan responsif pada resolusi layar mobile (360px–420px) dan desktop.
- [ ] Tidak ada kunci jawaban yang bocor di network tab / response JSON pada rute ujian aktif.
- [ ] Fitur Pause & Resume mode latihan berfungsi presisi dan menutup tampilan soal saat dijeda.
- [ ] Soal bergambar dapat di-zoom melalui modal Lightbox.
- [ ] Error database SQLite ditangani dengan try-catch yang informatif dan tidak crash pada server.
- [ ] File template impor (`.csv` dan `.xlsx`) tetap sinkron dengan skema validasi.
- [ ] Dokumentasi (`README.md`, `PRD.md`, `AGENTS.md`, `DOCS_PANDUAN_PENGGUNAAN.md`, `DOCS_DEVELOPMENT.md`) tetap mutakhir.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
