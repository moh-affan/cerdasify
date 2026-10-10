# Panduan Pengembangan & Arsitektur Sistem Cerdasify 💻

Dokumen ini merupakan panduan teknis mendalam bagi para insinyur perangkat lunak (*software engineers*) dan agen AI yang bertugas memelihara, menguji, serta mengembangkan fitur-fitur baru pada platform **Cerdasify**.

---

## 📑 Daftar Isi
1. [Prinsip Arsitektur & Rekayasa](#1-prinsip-arsitektur--rekayasa)
2. [Tech Stack & Dependensi Inti](#2-tech-stack--dependensi-inti)
3. [Arsitektur Basis Data PostgreSQL & Drizzle ORM](#3-arsitektur-basis-data-postgresql--drizzle-orm)
4. [Protokol Keamanan Ujian (Anti-Leak Architecture)](#4-protokol-keamanan-ujian-anti-leak-architecture)
5. [Mekanisme State Jeda & Lanjut (Pause & Resume Engine)](#5-mekanisme-state-jeda--lanjut-pause--resume-engine)
6. [Arsitektur Rich Media & Penanganan Gambar](#6-arsitektur-rich-media--penanganan-gambar)
7. [Engine Notasi Matematika (KaTeX & Graceful Degradation)](#7-engine-notasi-matematika-katex--graceful-degradation)
8. [Referensi REST API & Route Handlers](#8-referensi-rest-api--route-handlers)
9. [Bank Soal & Seeder Kanonik](#9-bank-soal--seeder-kanonik)
10. [Perintah Pengembangan, Testing, & Deployment](#10-perintah-pengembangan-testing--deployment)

---

## 1. Prinsip Arsitektur & Rekayasa

Pengembangan Cerdasify berpijak pada empat pilar rekayasa perangkat lunak:
1. **Zero-Fluff, Maximum Speed:** Antarmuka harus instan, berukuran bundle kecil, dan mengutamakan **React Server Components (RSC)**. Hindari penggunaan library UI raksasa yang membebani CPU ponsel entry-level.
2. **Rock-Solid Exam Integrity:** Integritas ujian dijamin secara arsitektural. Kunci jawaban dan bobot penilaian **HARAM** dikirim ke browser client selama sesi ujian aktif berlangsung. Penilaian dilakukan 100% di server.
3. **Data Safety & Concurrency:** PostgreSQL (Supabase) diakses lewat satu koneksi singleton dengan pool terbatas; operasi multi-tabel selalu di dalam transaksi, dan auto-save jawaban memakai upsert atomik (`ON CONFLICT`) sehingga aman dari race condition.
4. **Strict Isolation & RBAC:** Hak akses antara Super Admin, Guru/Admin, dan Peserta/User dipisahkan secara ketat di tingkat middleware, route handlers, dan query database.

---

## 2. Tech Stack & Dependensi Inti

| Lapisan (Layer) | Teknologi | Versi / Keterangan |
|---|---|---|
| **Framework Utama** | [Next.js (App Router)](https://nextjs.org/) | Versi 16 (React 19, Server Components) |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | Strict Mode (`noImplicitAny`, `strictNullChecks`) |
| **Styling & Ikon** | [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) | Utility-first, mobile-first responsive |
| **Basis Data** | [PostgreSQL](https://www.postgresql.org/) (Supabase) via [`postgres`](https://github.com/porsager/postgres) + Drizzle ORM | `prepare: false` untuk connection pooler, SSL wajib |
| **ORM / Query Builder** | [Drizzle ORM](https://orm.drizzle.team/) | Zero-overhead, type-safe SQL schema |
| **Rendering Matematika** | [KaTeX](https://katex.org/) | SSR + Client fast rendering |
| **Autentikasi & Sesi** | Encrypted Session Cookies | HttpOnly, SameSite=Lax, AES-256 |
| **Spreadsheet Engine** | `xlsx` (SheetJS) & `csv-parse` | Impor/ekspor massal Excel dan CSV |

---

## 3. Arsitektur Basis Data PostgreSQL & Drizzle ORM

### 3.1 Koneksi & Migrasi
Koneksi diinisialisasi sekali (singleton) di [src/db/index.ts](src/db/index.ts):

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // wajib untuk Supabase connection pooler (transaction mode)
  ssl: 'require',
  max: 10,
});

export const db = drizzle(client, { schema });
```

> **Catatan Kritis:**
> - Skema tabel didefinisikan di `src/db/schema/index.ts` dan dibuat/diperbarui secara idempoten oleh `src/db/migrate.ts` (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`). Migrasi dijalankan otomatis oleh `npm run seed` dan `npm run seed:learning`.
> - `attempt_answers` memiliki unique index `(attempt_id, question_id)` sehingga auto-save jawaban selalu upsert, tidak pernah duplikat.

---

### 3.2 Diagram Skema Relasi Database

```
+----------------+       +-------------------+       +-----------------------+
|     USERS      |       |    CATEGORIES     |       |         TOPICS        |
+----------------+       +-------------------+       +-----------------------+
| id (PK)        |       | id (PK)           |       | id (PK)               |
| username (UQ)  |       | name              |       | category_id (FK)      |
| name           |       | slug (UQ)         |       | name                  |
| password_hash  |       | description       |       | slug                  |
| role           |       | order_index       |       +-----------------------+
| is_active      |       +-------------------+                   |
+----------------+                 |                             |
        |                          +-----------------------------+
        |                                                        |
        v                                                        v
+----------------+       +-------------------+       +-----------------------+
|    ATTEMPTS    |       |   EXAM_PACKAGES   |       |       QUESTIONS       |
+----------------+       +-------------------+       +-----------------------+
| id (PK)        |       | id (PK)           |       | id (PK)               |
| user_id (FK)   |<----->| category_id (FK)  |       | topic_id (FK)         |
| package_id (FK)|       | title             |       | type (SINGLE/SCALE)   |
| started_at     |       | type (SIM/PRACT)  |       | content_markdown      |
| finished_at    |       | duration_minutes  |       | image_url             |
| remaining_secs |       | shuffle_questions |       | explanation_markdown  |
| score_total    |       | is_published      |       | difficulty            |
| status         |       +-------------------+       +-----------------------+
+----------------+                 |                             |
        |                          v                             v
        |                +-------------------+       +-----------------------+
        |                | PACKAGE_QUESTIONS |       |   QUESTION_OPTIONS    |
        |                +-------------------+       +-----------------------+
        |                | package_id (FK)   |       | id (PK)               |
        |                | question_id (FK)  |       | question_id (FK)      |
        |                | order_index       |       | label (A, B, C, D, E) |
        |                +-------------------+       | content_markdown      |
        v                                            | image_url             |
+-------------------+                                | is_correct (BOOLEAN)  |
|  ATTEMPT_ANSWERS  |                                | score_value (INTEGER) |
+-------------------+                                +-----------------------+
| id (PK)           |
| attempt_id (FK)   |
| question_id (FK)  |
| selected_option_id|
| is_doubtful       |
+-------------------+
```

---

## 4. Protokol Keamanan Ujian (Anti-Leak Architecture)

### 4.1 Isolasi Data pada Endpoint Soal Aktif
Ketika peserta memulai atau melanjutkan sesi ujian melalui endpoint:
`GET /api/exam/attempt/[attemptId]`

Implementasi query database **secara ketat mengabaikan** field rahasia:
- ❌ **Dilarang dikembalikan:** `is_correct`, `score_value`, `explanation_markdown`, `explanation_image_url`.
- ✅ **Hanya boleh dikembalikan:**
  - `question_id`
  - `content_markdown`
  - `image_url`
  - `options`: array yang hanya berisi `{ id, label, content_markdown, image_url }`.

Dengan desain ini, peserta yang membuka DevTools / Network Tab pada browser **tidak akan pernah menemukan kunci jawaban**.

### 4.2 Penilaian Sisi Server (Server-Side Grading)
Seluruh kalkulasi skor dilakukan oleh `finalizeAttempt()` ([src/lib/exam-grading.ts](src/lib/exam-grading.ts)), dipanggil dari `POST /api/exam/submit` atau otomatis saat waktu habis:
1. Opsi yang dipilih dicocokkan dengan `question_options.is_correct` / `score_value`. Pilihan tunggal hanya benar bila **tepat satu** opsi dipilih; pilihan ganda kompleks harus sama persis dengan himpunan kunci; TKP memakai poin 1–5.
2. **Validasi waktu di server** ([src/lib/exam-time.ts](src/lib/exam-time.ts)): sisa waktu dihitung dari `remaining_seconds` dan `segment_started_at` (awal segmen berjalan). Auto-save setelah batas waktu (+30 detik toleransi) ditolak dan attempt ditutup sebagai `TIMED_OUT`.
3. `POST /api/exam/save-answer` hanya menerima soal milik paket tersebut dan opsi milik soal tersebut.
4. `POST /api/exam/start` memakai `pg_advisory_xact_lock` per (pengguna, paket) sehingga klik ganda / dua tab tidak membuat dua attempt aktif.
5. Halaman `/results/[attemptId]` baru menampilkan kunci & pembahasan setelah status `COMPLETED`/`TIMED_OUT`; selama attempt masih berjalan peserta diarahkan kembali ke ruang ujian.

**Aturan penilaian paket (`exam_packages.passing_grade_rules`, JSON).** Hanya kunci berikut yang dibaca `calculateScore()` ([src/lib/scoring.ts](src/lib/scoring.ts)); kunci lain (mis. `correctWeight`) diabaikan diam-diam:

| Kunci | Arti | Default bila tidak diisi |
|---|---|---|
| `correctScore` / `wrongScore` / `emptyScore` | Poin soal pilihan tunggal/kompleks yang benar / salah / kosong | `4` / `-1` / `0` |
| `passingScore` | Ambang lulus skor total | 60% skor maksimum |
| `twkPassingGrade`, `tiuPassingGrade`, `tkpPassingGrade` | Ambang per subtes CPNS (dicocokkan dari nama topik) | — |

Konvensi: paket latihan anak/olimpiade tanpa nilai minus memakai `wrongScore: 0`; simulasi yang meniru lomba bernilai minus (PRISMA, Sesi Simulasi) memakai `-1`; `emptyScore` tidak pernah lebih kecil dari 0. Soal `GRADED_SCALE` (SJT/TKP) selalu memakai poin opsi 1–5, jadi `correctScore`/`wrongScore` tidak berlaku. Tulis aturan secara eksplisit di setiap paket agar tidak jatuh ke default `-1`.

**Soal berbobot (`GRADED_SCALE`).** Untuk soal tanpa benar/salah mutlak (SJT ASN, TKP CPNS, atau soal sikap lainnya), setiap opsi punya bobot sendiri di `question_options.score_value` (bilangan bulat 1–5):
- Peserta memilih satu opsi dan memperoleh bobot opsi itu; tidak pernah ada nilai minus. Soal kosong mengikuti `emptyScore` (default 0).
- Skor maksimum soal = bobot tertinggi; opsi berbobot tertinggi ditandai `is_correct = true` dan dihitung sebagai "pilihan terbaik" pada statistik.
- Halaman hasil menampilkan "+X dari 5 poin" (bukan Benar/Salah) dan memberi warna kuning, bukan merah, untuk pilihan bernilai sebagian. Pada paket yang seluruhnya berbobot, kartu ringkasan berubah menjadi *Pilihan Terbaik / Bernilai Sebagian / Perolehan Poin*.
- Soal berbobot dibuat lewat editor (tipe "Soal Berbobot") atau impor dengan `tipe_soal = SCALE` dan kunci `A:3,B:5,C:2,D:4,E:1`.
- Satu paket boleh mencampur soal pilihan ganda dan soal berbobot; kelulusan CPNS memakai `twk/tiu/tkpPassingGrade` per topik.

---

## 5. Mekanisme State Jeda & Lanjut (Pause & Resume Engine)

Untuk mendukung **Mode Latihan Fleksibel**, sistem menyediakan mekanisme jeda waktu yang aman:

```
[ Peserta Klik "Jeda" ]
          │
          ▼
POST /api/exam/pause { attemptId, remainingSeconds }
          │
          ▼
[ Database Update ]: status = 'PAUSED', remaining_seconds = X
          │
          ▼
[ Client UI State ]: isPaused = true
  └─► Layar ditutupi Screen Privacy Overlay (Konten soal disembunyikan)
          │
          │ (Waktu istirahat peserta)
          ▼
[ Peserta Klik "Lanjutkan Pengerjaan" ]
          │
          ▼
POST /api/exam/resume { attemptId }
          │
          ▼
[ Database Update ]: status = 'IN_PROGRESS'
          │
          ▼
[ Client UI State ]: isPaused = false (Timer aktif kembali dari sisa detik)
```

**Aturan Rekayasa UI:**
- Saat `isPaused === true`, area soal di [halaman ujian](src/app/(exam)/exam/[packageId]/page.tsx) ditutupi overlay jeda dengan backdrop glassmorphism redup guna mencegah eksploitasi membaca soal tanpa menghitung waktu.

---

## 6. Arsitektur Rich Media & Penanganan Gambar

### 6.1 Penyimpanan & Upload
- **Lokasi Penyimpanan:** `public/uploads/`
- **Route Handler:** [src/app/api/admin/upload-image/route.ts](file:///home/affan/projects/cerdasify/src/app/api/admin/upload-image/route.ts)
- **Validasi Unggahan:**
  - Hanya menerima tipe MIME: `image/jpeg`, `image/png`, `image/webp`.
  - Ukuran file maksimal: **5 MB**.
  - Penamaan file otomatis: `upload-{Date.now()}-{random}.{ext}` untuk mencegah tabrakan nama dan serangan Path Traversal.

### 6.2 Lightbox Zoom Modal
Halaman ujian dan ulasan hasil ([results/[attemptId]/page.tsx](src/app/(dashboard)/results/[attemptId]/page.tsx), komponen [`ZoomableImage`](src/components/ui/ZoomableImage.tsx)) menyediakan modal Lightbox interaktif untuk gambar soal, opsi, dan pembahasan. Ketika gambar diklik:
- Gambar ditampilkan di tengah layar dalam resolusi aslinya.
- Latar belakang redup dengan animasi transisi halus (*backdrop fade*).
- Menutup dengan tombol ✕, tombol ESC, atau klik di luar area modal.

---

## 7. Engine Notasi Matematika (KaTeX & Graceful Degradation)

Komponen [MathRenderer.tsx](file:///home/affan/projects/cerdasify/src/components/katex/MathRenderer.tsx) bertugas memecah teks Markdown dan merender fragmen LaTeX:

### 7.1 Aturan Konfigurasi KaTeX
```typescript
katex.renderToString(formula, {
  displayMode: isBlock,
  throwOnError: false,       // Wajib: mencegah aplikasi crash jika ada typo formula
  errorColor: '#ef4444',     // Warna merah lembut untuk penanda sintaks salah
});
```

### 7.2 Mobile-Responsive Wrap
Untuk formula display block yang panjang, kontainer wajib dibungkus dengan:
```tsx
<div className="overflow-x-auto max-w-full py-1 scrollbar-thin">
  {/* Rendered KaTeX HTML */}
</div>
```
Ini memastikan pada layar ponsel selebar 360px–420px, rumus dapat di-scroll secara horizontal tanpa merusak layout kartu pertanyaan (*zero Cumulative Layout Shift*).

---

## 8. Referensi REST API & Route Handlers

### 8.1 Modul Autentikasi
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `POST` | `/api/auth/login` | Validasi kredensial & set cookie session HttpOnly | Publik |
| `POST` | `/api/auth/logout` | Menghapus cookie session | Terautentikasi |
| `GET` | `/api/auth/me` | Memeriksa user aktif dan perannya | Terautentikasi |

### 8.2 Modul Ujian (Exam Engine)
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET` | `/api/exam/attempt/[attemptId]` | Mengambil soal aktif (Kunci jawaban dihilangkan) | Pemilik Sesi |
| `POST` | `/api/exam/save-answer` | Auto-save pilihan jawaban per butir soal | Pemilik Sesi |
| `POST` | `/api/exam/pause` | Menghentikan sesi latihan & simpan sisa detik | Pemilik Sesi |
| `POST` | `/api/exam/resume` | Melanjutkan kembali sesi latihan yang dijeda | Pemilik Sesi |
| `POST` | `/api/exam/submit` | Finalisasi ujian & kalkulasi skor sisi server | Pemilik Sesi |

### 8.3 Modul Administrator
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET/POST`| `/api/admin/questions` | Ambil daftar soal terfilter / Tambah soal baru | Admin / Super Admin |
| `POST` | `/api/admin/upload-image` | Unggah file stimulus gambar ke `public/uploads/` | Admin / Super Admin |
| `GET/POST`| `/api/admin/packages` | Kelola paket ujian, durasi, dan butir soal | Admin / Super Admin |
| `POST` | `/api/admin/import` | Impor massal soal / peserta dari Excel & CSV | Super Admin |
| `GET/POST`| `/api/admin/users` | Kelola akun pengguna, reset password, & role | Super Admin |

---

## 9. Bank Soal & Seeder Kanonik

Bank soal (1.623 butir, 50 paket, 11 kategori, 67 topik per Oktober 2026) disimpan di repo sebagai **sumber kebenaran**:

```
src/db/seed-data/question-bank/
├── categories.json        # kategori
├── topics.json            # topik
├── packages.json          # paket: judul, tipe, durasi, aturan penilaian, status terbit, urutan id soal
└── questions/<paket>.json # soal + opsi; setiap soal disimpan sekali di berkas "paket rumah"-nya
```

| Kelompok | Paket |
|---|---|
| Olimpiade Matematika | PRISMA 2024/2025 L1–3, CEO 2025 L1–2, ORION 2025 A/B & 2026 A/B, IMOCSEA 2022, OSN (97 soal), Soal Cerita Tricky, Buku Soal Sesi 1–5/13/21, Aljabar Marathon 100 |
| Olimpiade Sains | PRISMA 2024 IPA L1–3, CEO 2025 Sains L1–3 |
| Olimpiade Bahasa Inggris | Level 1–2 Penyisihan/Provinsi, PRISMA 2025, CEO 2025, JSO 2025, KMSI 2024 |
| ASN/CPNS | SJT Manajerial, Sosio-Kultural BerAKHLAK, Potensi Kognitif, Literasi Digital, Mini CPNS SKD |

Paket `pkg_osn_buku_draft` (3 soal esai/duplikat) dan `pkg_ceo_2025_s1` (duplikat `pkg_ceo_2025_sains_1`) sengaja tidak diterbitkan.

### 9.1 Alur Kerja

```bash
npm run seed         # migrasi + Super Admin (bila belum ada) + sinkron seluruh bank soal (satu transaksi, idempoten)
npm run bank:export  # tulis isi database (setelah edit di panel admin) kembali ke berkas bank soal
```

- `npm run seed` memvalidasi berkas dulu (id unik, label opsi berurutan, tepat satu kunci untuk pilihan tunggal, bobot 1–5 untuk soal berbobot, semua id soal paket ada). Data di berkas **menimpa** baris dengan id yang sama; soal/paket yang belum ada di berkas tidak disentuh.
- **Setelah mengedit soal lewat panel admin, jalankan `npm run bank:export` lalu commit** agar seed berikutnya tidak menimpa perubahan tersebut.
- Ekspor → seed → ekspor menghasilkan berkas identik (diverifikasi dengan hash), sehingga diff git hanya memuat perubahan nyata.
- Akun demo tidak lagi memiliki password bawaan. Untuk membuatnya: `SEED_DEMO_USERS=true` dengan `DEMO_ADMIN_PASSWORD` dan `DEMO_USER_PASSWORD` (min. 8 karakter) di env.

### 9.2 Riwayat Audit (Oktober 2026)

Seluruh soal diperiksa ulang: jawaban dihitung ulang, setiap gambar dibuka, dan bila tersedia dicocokkan dengan naskah sumber (folder `olympiad/`: buku OSN, KMSI 2024, JSO 2025 beserta kunci resmi, Bahasa Inggris Level 1–2 beserta kunci, dan CEO 2025). Alasan setiap perubahan tercatat di [src/db/seed-data/audit/question_fixes_2026_10.jsonl](src/db/seed-data/audit/question_fixes_2026_10.jsonl) (satu baris per perbaikan, field `reason`). Skrip impor/perbaikan lama yang sudah tertanam dalam bank soal telah dihapus (tersedia di riwayat git).

Temuan yang perlu diingat saat menambah soal:
- Gambar sering terpasang di nomor yang salah atau wacana diganti cerita lain; selalu buka gambarnya dan bandingkan dengan naskah.
- Kunci/pembahasan dari dokumen sumber pun bisa keliru (mis. buku OSN no. 18, 65, 75; kunci JSO no. 9) — hitung sendiri.
- Soal berbobot (SJT/TKP): setiap opsi harus masuk akal, bobot 5 = tindakan tuntas & sesuai aturan, 1 = melanggar etika/hukum, dan pembahasan menjelaskan alasan kelima bobot.

---

## 10. Perintah Pengembangan, Testing, & Deployment

### 10.1 Perintah Esensial
```bash
# Instalasi pustaka dependensi
npm install

# Inisialisasi skema tabel & seed seluruh bank soal (src/db/seed-data/question-bank)
npm run seed

# Simpan perubahan soal dari panel admin ke berkas bank soal
npm run bank:export

# Menjalankan server pengembangan (development mode)
npm run dev

# Pengecekan tipe statis TypeScript
npx tsc --noEmit

# Menjalankan linter kode
npm run lint

# Membangun bundle produksi teroptimasi
npm run build

# Menjalankan server produksi
npm start
```

### 10.2 Checklist Pengujian Pra-Rilis
Sebelum melakukan *merge* kode atau *deploy* ke server produksi:
- [ ] Jalankan `npx tsc --noEmit` dan pastikan tidak ada error kompilasi.
- [ ] Jalankan `npm run build` dan pastikan seluruh 24 rute App Router ter-generate secara mulus (*clean static and dynamic generation*).
- [ ] Buka Network Tab di browser dan pastikan respon dari `/api/exam/attempt/*` tidak mengandung field `is_correct` atau `score_value`.
- [ ] Uji fitur jeda (*pause*) dan lanjutkan (*resume*) pada salah satu paket latihan, pastikan sisa detik tidak tereset.
- [ ] Uji klik pada gambar stimulus di soal dan pastikan modal Lightbox terbuka dengan tajam.

---

## 11. Pustaka Belajar (Learning Content)

Modul belajar mandiri di luar engine ujian, dirancang untuk dipakai dari SD hingga tingkat lanjut.

### 11.1 Sumbu Level
- Setiap konten memiliki rentang `phase_min`–`phase_max` mengikuti **Fase Kurikulum Merdeka**: A (SD 1–2), B (SD 3–4), C (SD 5–6), D (SMP), E (SMA 10), F (SMA 11–12), L (Lanjut).
- Konten bahasa Inggris juga memiliki `cefr_level` (`PRE_A1`, `A1`, `A2`, `B1`, ...).
- `users.grade_level` (1–13) diatur sendiri oleh pengguna lewat `POST /api/learn/profile`, lalu dipetakan ke fase oleh `gradeToPhase()` di `src/lib/learning.ts`.
- Fase A–B memakai **mode anak**: huruf besar, tombol audio & terjemahan per kalimat, label "Pola Kalimat" alih-alih istilah grammar teknis.

### 11.2 Skema
| Tabel | Keterangan |
|---|---|
| `subjects` | Mata pelajaran (Bahasa Inggris, Bahasa Indonesia, Matematika, IPA, PAI, Pengetahuan Umum) |
| `learning_contents` | Konten generik; `type` = `DAILY_READING`, `STORY`, `ENCYCLOPEDIA`, `COMIC`, `SPEECH`, `LESSON`. Teks disimpan di `segments_json` (array `{ en?, tx?, ar?, latin?, id?, n?, break? }`; `en` = kalimat Inggris, `tx` = teks Indonesia, `ar` = teks Arab) dan/atau `body_markdown` |
| `content_vocab` | Kata kunci + arti + emoji + `forms` (bentuk lain yang ikut di-highlight) |
| `content_grammar_notes` | Pola/analisis grammar beserta contoh kalimat dari bacaan |
| `content_quiz_items` | Kuis pemahaman; `correct_index` **tidak pernah** dikirim ke browser |
| `reading_progress` | PK (`user_id`, `content_id`); `read_date` (Asia/Jakarta) dipakai menghitung streak harian, skor kuis menyimpan nilai terbaik |

### 11.3 Rute
- `/belajar` — beranda pustaka: bacaan hari ini, streak, filter fase.
- `/belajar/[slug]` — pembaca interaktif (`src/components/learn/ReadingView.tsx`): audio Web Speech API, highlight kosakata, terjemahan, grammar, kuis.
- `POST /api/learn/complete` — menilai kuis di server dan menyimpan progres.
- `POST /api/learn/profile` — menyimpan kelas pengguna.
- `/orang-tua` — dasbor orang tua: membuat akun anak, mengatur kelas & password anak, memantau streak, bacaan selesai, ketepatan kuis, aktivitas 7 hari, dan ujian.
- `POST /api/parent/children` — membuat akun anak (`role = USER`, `parent_id` = orang tua). Akun anak tidak boleh membuat akun anak.
- `PATCH /api/parent/children/[id]` — mengubah nama/kelas/password, hanya untuk anak dengan `parent_id` = pengguna saat ini.

### 11.4 Menambah Konten
Konten ditulis sebagai data TypeScript di `src/db/seed-data/learning/` (format di `types.ts`), lalu dijalankan:

```bash
npm run seed:learning
```

Konten yang tersedia saat ini:
- `english-phase-a.ts` — 30 Daily Reading Fase A–B (Pre-A1).
- `english-phase-d.ts` — 4 Daily Reading Fase D (A2).
- `english-phase-b.ts` — 15 Daily Reading Fase B (A1): simple past, comparative, going to, should.
- `ipa-fase-ab.ts` — 8 materi IPA Fase A–B; `bahasa-indonesia-fase-ab.ts` — 6 materi Bahasa Indonesia (EYD V).
- `pidato.ts` — 6 contoh pidato (`SPEECH`) dengan segmen ber-`h` (Pembukaan/Isi/Penutup) + mode latihan teleprompter.
- `komik.ts` — 4 komik (`COMIC`): segmen `{ panel: { caption, scene, img?, bg, bubbles[] } }`; sampul di `public/learning/comics/` (ilustrasi AI, WebP 640px).
- `cerita-pendek.ts` — 8 cerita pendek berbahasa Indonesia (`STORY`, Fase A–B) dengan pesan moral.
- `ensiklopedia.ts` — 8 artikel ensiklopedia anak (`ENCYCLOPEDIA`, Fase A–C).
- `matematika-fase-a.ts` — 7 materi Matematika kelas 1–2 (`LESSON`) dalam Markdown + KaTeX.
- `islam.ts` — 11 Doa Harian & 7 Surat Pendek (`type = LESSON`, subjek PAI) dengan segmen `{ ar, latin, id, n }`. Teks Arab dirender dengan font Amiri (`next/font/google`, variabel `--font-arabic`); audio TTS sengaja tidak dipakai untuk teks Arab.

### 11.5 Editor Konten (Panel Admin)
- `/admin/konten` — daftar, filter, terbitkan/sembunyikan, hapus. `/admin/konten/baru` dan `/admin/konten/[id]` — editor lengkap: info, Markdown + toolbar rumus, segmen (Inggris, Indonesia, Arab, panel komik dengan pratinjau), tempel banyak baris (`||` sebagai pemisah kolom), kosakata, catatan, kuis, dan unggah gambar.
- API (Admin/Super Admin): `POST /api/admin/contents`, `PUT|PATCH|DELETE /api/admin/contents/[id]`. Validasi terpusat di `src/lib/content-admin.ts`.
- Setiap simpan dari editor mengisi `learning_contents.edited_at`; seeder **melewati** konten tersebut kecuali dijalankan dengan `npm run seed:learning -- --force`.
- Draf (`is_published = false`) hanya dapat dipratinjau admin di `/belajar/[slug]`.

Seeder bersifat idempoten (upsert berdasarkan slug), mengacak urutan opsi kuis secara deterministik, dan **tidak menghapus** progres baca pengguna.

---

*Cerdasify Engineering Team — High Performance, Clean Architecture, Uncompromised Integrity.*
