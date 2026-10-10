# Cerdasify 🎓

> **Platform Web Latihan Soal & Simulasi Ujian Profesional (Olimpiade, TKA, CPNS, UTBK-SNBT)**
> Cepat, Ringan (*Lightweight*), Mobile-Friendly, Aman, dan Siap Digunakan.

---

## 📌 Sekilas Tentang Cerdasify

**Cerdasify** adalah sistem aplikasi web fullstack modern berbasis **Next.js 16 (App Router)** dan **PostgreSQL (Supabase)** yang dirancang untuk kebutuhan latihan soal mandiri serta simulasi ujian berskala profesional. Platform ini dilengkapi **1.623 butir soal** dalam **50 paket** (olimpiade Matematika, Sains, dan Bahasa Inggris; OSN; profiling ASN; dan simulasi CPNS SKD), ditambah Pustaka Belajar untuk anak.

Cerdasify berfokus pada pengalaman pengguna yang **bersih, elegan, dan tanpa distraksi**, dengan performa instan di ponsel pintar (smartphone) maupun komputer desktop tanpa memberatkan kuota internet atau memori perangkat.

---

## ✨ Fitur Unggulan

### 1. Bank Soal & Konten Lengkap (1.623 Soal, 50 Paket)
- **Olimpiade Matematika:** PRISMA 2024/2025, CEO 2025, ORION 2025/2026, IMOCSEA, OSN SD (97 soal hasil rekonstruksi dari buku sumber), Buku Soal Sesi 1–5/13/21, Aljabar Marathon 100.
- **Olimpiade Sains & Bahasa Inggris:** PRISMA, CEO, JSO 2025, KMSI 2024, dan latihan Level 1–2 (penyisihan & provinsi), lengkap dengan gambar asli naskah.
- **ASN/CPNS:** SJT Manajerial, Sosio-Kultural BerAKHLAK, Potensi Kognitif, Literasi Digital, Mini CPNS SKD.
- Seluruh bank soal disimpan di repo (`src/db/seed-data/question-bank/`) dan diaudit ulang Oktober 2026 (kunci dihitung ulang, gambar & wacana dicocokkan dengan naskah sumber).
- **Dukungan Soal Bergambar (Rich Media & Lightbox):**
  - Gambar pada teks pertanyaan, opsi jawaban, dan penjelasan pembahasan.
  - Fitur **Lightbox Zoom**: klik gambar pada soal untuk memperbesar secara interaktif tanpa merusak tata letak.
  - Endpoint upload gambar mandiri di panel admin (`/api/admin/upload-image`) dengan validasi tipe file dan ukuran.
- **Formula Matematika & Sains (LaTeX, KaTeX, AsciiMath):**
  - Formula sebaris (`$...$`) dan formula blok (`$$...$$`).
  - Mendukung pecahan kompleks, akar bertingkat, matriks, limit, integral, serta notasi kimia/fisika.
  - Editor Admin dilengkapi **Live Math Preview** dan **Toolbar Rumus Cepat**.
  - Responsif di layar HP dengan auto-scroll mendatar (*no layout blowout*).
- **Pilihan Ganda & Soal Berbobot:**
  - Pilihan ganda standar (A–E) dan pilihan ganda kompleks.
  - **Soal berbobot** (SJT/TKP): tidak ada benar/salah mutlak, setiap opsi bernilai 1–5 poin; hasil menampilkan perolehan poin dan alasan setiap bobot.

### 1b. Pustaka Belajar (Daily English Reading)
- Bacaan harian bahasa Inggris berjenjang mengikuti Fase Kurikulum Merdeka (SD → SMP → lanjut) dengan level CEFR.
- Kosakata yang bisa diketuk, audio per kalimat (Web Speech API), terjemahan, analisis grammar, dan kuis pemahaman yang dinilai di server.
- Pendidikan Agama Islam: 11 doa harian & 7 surat pendek dengan teks Arab berharakat, latin, dan terjemahan.
- Cerita pendek berpesan moral, ensiklopedia anak, dan materi Matematika kelas 1–2 (dengan suara pembaca bahasa Indonesia).
- Bacaan Fase B, materi IPA & Bahasa Indonesia, contoh pidato dengan mode latihan teleprompter, dan komik edukasi.
- Editor konten di panel admin (`/admin/konten`): tulis/ubah bacaan, materi, pidato, dan komik tanpa menyentuh kode.
- Dasbor Orang Tua (`/orang-tua`): buat akun anak dan pantau streak, bacaan, skor kuis, serta aktivitas 7 hari terakhir.
- Streak membaca harian & progres per pengguna. Seed konten: `npm run seed:learning`.

### 2. Engine Ujian & Mode Pengerjaan Fleksibel
- **Mode Latihan Mandiri (Bisa Dijeda / Pausable Practice Mode):**
  - Dilengkapi tombol **Jeda (Pause)** dan **Lanjutkan (Resume)**.
  - Saat jeda diaktifkan, sisa waktu tersimpan aman di database dan konten soal ditutup tirai pelindung (*screen blackout overlay*) guna menjaga fokus dan integritas latihan.
  - Pembahasan dan status jawaban dapat ditelaah secara mendalam.
- **Mode Simulasi / Ujian CAT BKN & UTBK:**
  - Countdown timer dengan sinkronisasi waktu server anti-manipulasi.
  - Grid navigasi nomor soal cepat dengan penanda status (Dijawab, Ragu-ragu, Kosong).
  - Sinkronisasi otomatis (*optimistic background auto-save*) setiap opsi dipilih.
  - Konfirmasi submit akhir dan proteksi auto-submit saat waktu habis.
- **Integritas & Keamanan Ujian (Anti-Leak):**
  - Kunci jawaban dan bobot skor **DILARANG KERAS dan TIDAK PERNAH dikirim ke browser client** selama sesi ujian aktif.
  - Penilaian dilakukan 100% di server (*server-side grading*).

### 3. Impor Massal Soal & Peserta (Excel & CSV)
- Unggah ratusan soal sekaligus menggunakan file format **Excel (`.xlsx`)** atau **CSV (`.csv`)**.
- Validasi cerdas: mendeteksi baris rusak, opsi kosong, atau kesalahan format kunci sebelum tersimpan.
- Dilengkapi template resmi yang dapat diunduh langsung dari menu admin.

### 4. Multi-User & Role-Based Access Control (RBAC)
- **Super Admin:** Akses penuh seluruh sistem, bank soal, manajemen paket, manajemen user, dan impor/ekspor.
- **Admin / Pengajar:** Kurasi bank soal, pembuatan soal baru, dan peninjauan statistik.
- **User / Siswa:** Mengakses katalog paket, mengerjakan ujian/latihan, dan memantau riwayat progres.

### 5. Arsitektur Ringan & Aman
- Basis data **PostgreSQL (Supabase)** dengan Drizzle ORM dan transaksi atomik.
- Penilaian 100% di server, validasi waktu ujian di server, kunci jawaban tidak pernah dikirim ke browser selama ujian berlangsung.
- Unggahan gambar tervalidasi (JPEG/PNG/WebP, maks. 5MB, cek isi file) dan tersimpan di Supabase Storage.

---

## 🔑 Akun

- **Super Admin** dibuat dari env `DEFAULT_ADMIN_USERNAME` dan `DEFAULT_ADMIN_PASSWORD` saat `npm run seed` bila belum ada; login dengan kredensial env selalu berhasil dan menyinkronkan akun tersebut (gunakan password kuat, jangan di-commit).
- Akun guru dan peserta dibuat oleh Super Admin lewat menu **Pengguna** atau impor massal (password acak dibuat sistem).
- Akun demo (`guru_olimpiade`, `peserta_budi`) **tidak** memiliki password bawaan. Untuk lingkungan uji, jalankan seed dengan `SEED_DEMO_USERS=true`, `DEMO_ADMIN_PASSWORD`, dan `DEMO_USER_PASSWORD` di env.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Math Engine:** [KaTeX](https://katex.org/)
- **Database:** PostgreSQL (Supabase) via [`postgres`](https://github.com/porsager/postgres) + Drizzle ORM
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Session & Auth:** Encrypted HttpOnly Cookies
- **Data Parser:** `xlsx` (SheetJS) & `csv-parse`

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Prasyarat
- Node.js versi 18.18.0 atau lebih baru
- npm / pnpm / yarn

### 2. Instalasi Dependensi
```bash
git clone https://github.com/username/cerdasify.git
cd cerdasify
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi konfigurasi pada `.env.local`:
```env
# Database
DATABASE_PATH="./data/cerdasify.db"

# Session & Security (Gunakan string acak minimal 32 karakter)
SESSION_SECRET="cerdasify_super_secret_session_key_production_2026_xyz"

# Akun Super Admin Awal
DEFAULT_ADMIN_USERNAME="superadmin"
DEFAULT_ADMIN_PASSWORD="<password-kuat-anda>"
```

### 4. Migrasi Skema & Seeding Bank Soal
```bash
# Buat/perbarui tabel dan semai seluruh bank soal (1.623 soal, 50 paket) dari src/db/seed-data/question-bank
npm run seed

# Setelah mengedit soal di panel admin: simpan kembali ke berkas bank soal, lalu commit
npm run bank:export

# Konten Pustaka Belajar
npm run seed:learning
```

### 5. Menjalankan Server
```bash
# Menjalankan dalam mode development
npm run dev

# Atau build untuk mode production
npm run build
npm start
```
Buka browser dan buka alamat **`http://localhost:3000`**.

---

## 📂 Struktur Direktori Proyek

```
cerdasify/
├── data/                      # Berkas lokal (cadangan) - tidak di-commit
├── public/                    # Aset statis publik
│   ├── templates/             # Berkas template resmi impor (.xlsx, .csv)
│   └── uploads/               # Berkas gambar stimulus soal & opsi
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/login/      # Halaman Autentikasi / Login
│   │   ├── (dashboard)/       # Katalog Paket Soal, Riwayat, & Telaah Hasil
│   │   ├── (exam)/            # Antarmuka Ujian Khusus (Fokus Bebas Distraksi)
│   │   ├── admin/             # Panel Super Admin & Pengajar
│   │   │   ├── bank-soal/     # Bank Soal, Form Tambah Soal, KaTeX Toolbar
│   │   │   ├── packages/      # Pengaturan Paket Ujian & Waktu
│   │   │   ├── import/        # Impor Massal Soal & Peserta
│   │   │   └── users/         # Manajemen Akun Pengguna
│   │   └── api/               # Server Route Handlers (Auth, Exam, Admin, Upload)
│   ├── components/            # Komponen UI Reusable
│   │   ├── admin/             # MathEditorToolbar, FileUploader, Form Controls
│   │   ├── exam/              # ExamTimer, ExamGridNav, OptionItem, ExamConfirmModal
│   │   ├── katex/             # MathRenderer (LaTeX parser aman)
│   │   └── ui/                # Button, Modal, Card, Input
│   ├── db/                    # Drizzle ORM Schema, koneksi PostgreSQL, migrasi & seeder
│   ├── lib/                   # Autentikasi Session, Parser Spreadsheet, Engine Skor
│   └── types/                 # Definisi Tipe TypeScript Global
├── DOCS_PANDUAN_PENGGUNAAN.md # Panduan Lengkap Pengguna & Operator
├── DOCS_DEVELOPMENT.md        # Panduan Arsitektur & Rekayasa Developer
├── PRD.md                     # Product Requirements Document
├── AGENTS.md                  # Panduan Teknis & Standar Agen AI
└── README.md                  # Dokumentasi Ringkas Proyek Ini
```

---

## 📚 Dokumentasi Lanjutan

Untuk panduan mendalam, silakan baca dokumentasi pendukung berikut:
- **[Panduan Penggunaan Lengkap (User Guide)](file:///home/affan/projects/cerdasify/DOCS_PANDUAN_PENGGUNAAN.md)** — Panduan langkah demi langkah bagi Peserta, Pengajar, dan Super Admin.
- **[Panduan Pengembangan & Arsitektur (Developer Guide)](file:///home/affan/projects/cerdasify/DOCS_DEVELOPMENT.md)** — Arsitektur sistem, skema PostgreSQL, pola anti-leak, dan referensi REST API.
- **[Product Requirements Document (PRD)](file:///home/affan/projects/cerdasify/PRD.md)** — Spesifikasi produk, kebutuhan fungsional, dan skema data.
- **[Development Guidelines (AGENTS.md)](file:///home/affan/projects/cerdasify/AGENTS.md)** — Standar pengkodean, konvensi KaTeX, dan checklist verifikasi.

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Bebas digunakan dan dikembangkan untuk kepentingan bimbingan belajar, sekolah, dan komunitas pendidikan.

