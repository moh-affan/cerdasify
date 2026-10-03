# Panduan Pengembangan & Arsitektur Sistem Cerdasify 💻

Dokumen ini merupakan panduan teknis mendalam bagi para insinyur perangkat lunak (*software engineers*) dan agen AI yang bertugas memelihara, menguji, serta mengembangkan fitur-fitur baru pada platform **Cerdasify**.

---

## 📑 Daftar Isi
1. [Prinsip Arsitektur & Rekayasa](#1-prinsip-arsitektur--rekayasa)
2. [Tech Stack & Dependensi Inti](#2-tech-stack--dependensi-inti)
3. [Arsitektur Basis Data SQLite WAL & Drizzle ORM](#3-arsitektur-basis-data-sqlite-wal--drizzle-orm)
4. [Protokol Keamanan Ujian (Anti-Leak Architecture)](#4-protokol-keamanan-ujian-anti-leak-architecture)
5. [Mekanisme State Jeda & Lanjut (Pause & Resume Engine)](#5-mekanisme-state-jeda--lanjut-pause--resume-engine)
6. [Arsitektur Rich Media & Penanganan Gambar](#6-arsitektur-rich-media--penanganan-gambar)
7. [Engine Notasi Matematika (KaTeX & Graceful Degradation)](#7-engine-notasi-matematika-katex--graceful-degradation)
8. [Referensi REST API & Route Handlers](#8-referensi-rest-api--route-handlers)
9. [Struktur Paket Soal & Dataset 492 Butir](#9-struktur-paket-soal--dataset-492-butir)
10. [Perintah Pengembangan, Testing, & Deployment](#10-perintah-pengembangan-testing--deployment)

---

## 1. Prinsip Arsitektur & Rekayasa

Pengembangan Cerdasify berpijak pada empat pilar rekayasa perangkat lunak:
1. **Zero-Fluff, Maximum Speed:** Antarmuka harus instan, berukuran bundle kecil, dan mengutamakan **React Server Components (RSC)**. Hindari penggunaan library UI raksasa yang membebani CPU ponsel entry-level.
2. **Rock-Solid Exam Integrity:** Integritas ujian dijamin secara arsitektural. Kunci jawaban dan bobot penilaian **HARAM** dikirim ke browser client selama sesi ujian aktif berlangsung. Penilaian dilakukan 100% di server.
3. **Data Safety & High-Concurrency WAL:** SQLite dikonfigurasi dengan Write-Ahead Logging (WAL) dan timeout busy yang aman agar mampu melayani puluhan koneksi auto-save jawaban peserta secara simultan tanpa database lock.
4. **Strict Isolation & RBAC:** Hak akses antara Super Admin, Guru/Admin, dan Peserta/User dipisahkan secara ketat di tingkat middleware, route handlers, dan query database.

---

## 2. Tech Stack & Dependensi Inti

| Lapisan (Layer) | Teknologi | Versi / Keterangan |
|---|---|---|
| **Framework Utama** | [Next.js (App Router)](https://nextjs.org/) | Versi 16 (React 19, Server Components) |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | Strict Mode (`noImplicitAny`, `strictNullChecks`) |
| **Styling & Ikon** | [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) | Utility-first, mobile-first responsive |
| **Basis Data** | [SQLite](https://sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) | Mode WAL, Synchronous NORMAL, Busy Timeout 5000ms |
| **ORM / Query Builder** | [Drizzle ORM](https://orm.drizzle.team/) | Zero-overhead, type-safe SQL schema |
| **Rendering Matematika** | [KaTeX](https://katex.org/) | SSR + Client fast rendering |
| **Autentikasi & Sesi** | Encrypted Session Cookies | HttpOnly, SameSite=Lax, AES-256 |
| **Spreadsheet Engine** | `xlsx` (SheetJS) & `csv-parse` | Impor/ekspor massal Excel dan CSV |

---

## 3. Arsitektur Basis Data SQLite WAL & Drizzle ORM

### 3.1 Konfigurasi PRAGMA Wajib
Koneksi basis data SQLite diinisialisasi melalui singleton di [src/db/index.ts](file:///home/affan/projects/cerdasify/src/db/index.ts). Setiap inisialisasi **WAJIB** mengeksekusi parameter PRAGMA berikut:

```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DATABASE_PATH || './data/cerdasify.db');

// Konfigurasi performa tinggi & pencegahan database-lock
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('busy_timeout = 5000');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('cache_size = -64000'); // 64MB In-Memory Cache

export const db = drizzle(sqlite, { schema });
```

> **Catatan Kritis:**
> - `journal_mode = WAL` memisahkan operasi baca (read) dan tulis (write) sehingga pembaca tidak pernah memblokir penulis dan sebaliknya.
> - `busy_timeout = 5000` memberikan toleransi hingga 5 detik bagi proses tulis untuk mengantre sebelum melempar error `database is locked`.
> - **Jangan pernah mengubah parameter ini** tanpa pengujian beban (*load testing*) menyeluruh.

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
Seluruh kalkulasi skor dilakukan pada `POST /api/exam/submit`:
1. Server mencocokkan `selected_option_id` dari tabel `attempt_answers` dengan `question_options.is_correct` atau `question_options.score_value`.
2. Validasi durasi: Server memeriksa selisih waktu antara `started_at` dan waktu submit untuk mendeteksi manipulasi timer client.
3. Setelah status berubah menjadi `'COMPLETED'`, barulah ulasan pembahasan dan kunci jawaban dapat diakses oleh peserta di halaman ulasan hasil (`/results/[attemptId]`).

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
- Saat `isPaused === true`, komponen [QuestionCard.tsx](file:///home/affan/projects/cerdasify/src/components/exam/QuestionCard.tsx) ditutupi oleh [PauseOverlay](file:///home/affan/projects/cerdasify/src/app/(exam)/exam/[packageId]/page.tsx) dengan backdrop glassmorphism redup guna mencegah eksploitasi membaca soal tanpa menghitung waktu.

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
Komponen kartu soal ([QuestionCard.tsx](file:///home/affan/projects/cerdasify/src/components/exam/QuestionCard.tsx)) dan ulasan hasil ([results/[attemptId]/page.tsx](file:///home/affan/projects/cerdasify/src/app/(dashboard)/results/[attemptId]/page.tsx)) menyediakan modal Lightbox interaktif. Ketika gambar diklik:
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

## 9. Struktur Paket Soal & Dataset 492 Butir

Database sistem dilengkapi dengan 492 butir soal nyata yang terbagi ke dalam 13 paket:

1. **Paket Olimpiade PRISMA (1 Paket per Berkas):**
   - `prisma-2025-level-1` : Soal Matematika PRISMA 2025 Level 1 (SD/MI Pemula).
   - `prisma-2025-level-2` : Soal Matematika PRISMA 2025 Level 2 (SD/MI Lanjutan, dilengkapi gambar geometri arsiran).
   - `prisma-2025-level-3` : Soal Matematika PRISMA 2025 Level 3 (SMP/MTs, dilengkapi gambar lingkaran & garis singgung).
   - `prisma-2024-level-1` : Soal Matematika PRISMA 2024 Level 1 (Dilengkapi diagram soal bergambar).
2. **Paket Standar 40 Butir per Sesi (Buku Soal):**
   - `buku-soal-sesi-1` s/d `buku-soal-sesi-5` : Masing-masing memuat tepat 40 butir soal latihan.
   - `buku-soal-sesi-13` & `buku-soal-sesi-21` : Masing-masing memuat tepat 40 butir soal latihan pengayaan.
3. **Paket Tematik Komprehensif:**
   - `aljabar-marathon-100` : 100 butir soal aljabar berjenjang dari dasar hingga tingkat tinggi.
   - `cpns-skd-mini` : Simulasi terpadu TWK, TIU, dan TKP berbobot skala 1–5.

Seluruh data disemai secara atomic melalui skrip [src/db/seed.ts](file:///home/affan/projects/cerdasify/src/db/seed.ts).

---

## 10. Perintah Pengembangan, Testing, & Deployment

### 10.1 Perintah Esensial
```bash
# Instalasi pustaka dependensi
npm install

# Inisialisasi skema tabel & seed 492 butir soal lengkap
npm run seed

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

*Cerdasify Engineering Team — High Performance, Clean Architecture, Uncompromised Integrity.*
