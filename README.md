# Cerdasify 🎓

> **Platform Web Latihan Soal & Simulasi Ujian Profesional (Olimpiade, TKA, CPNS, UTBK-SNBT)**
> Cepat, Ringan (*Lightweight*), Mobile-Friendly, Aman, dan Siap Digunakan.

---

## 📌 Sekilas Tentang Cerdasify

**Cerdasify** adalah sistem aplikasi web fullstack modern berbasis **Next.js 16 (App Router)** dan **SQLite (WAL Mode)** yang dirancang untuk kebutuhan latihan soal mandiri serta simulasi ujian berskala profesional. Platform ini telah dilengkapi dengan **492 butir soal nyata** yang terbagi ke dalam **13 paket soal siap pakai** (Olimpiade Sains PRISMA 2024 & 2025, Buku Soal Sesi 40 butir, Aljabar Marathon, dan Simulasi CPNS SKD).

Cerdasify berfokus pada pengalaman pengguna yang **bersih, elegan, dan tanpa distraksi**, dengan performa instan di ponsel pintar (smartphone) maupun komputer desktop tanpa memberatkan kuota internet atau memori perangkat.

---

## ✨ Fitur Unggulan

### 1. Bank Soal & Konten Lengkap (492 Soal, 13 Paket)
- **13 Paket Soal Siap Pakai:**
  - **PRISMA Olimpiade Matematika 2025 (Level 1, 2, 3)** — Dilengkapi soal geometri bergambar arsiran & lingkaran.
  - **PRISMA Olimpiade Matematika 2024 (Level 1)** — Dilengkapi diagram soal bergambar.
  - **Buku Soal Sesi 1, 2, 3, 4, 5, 13, 21** — Format standar paket 40 butir soal per sesi.
  - **Aljabar Marathon 100 Soal** — Kumpulan soal aljabar komprehensif dari tingkat dasar hingga HOTS.
  - **Mini CPNS SKD 2026** — Simulasi gabungan TWK, TIU, dan TKP bertingkat.
- **Dukungan Soal Bergambar (Rich Media & Lightbox):**
  - Gambar pada teks pertanyaan, opsi jawaban, dan penjelasan pembahasan.
  - Fitur **Lightbox Zoom**: klik gambar pada soal untuk memperbesar secara interaktif tanpa merusak tata letak.
  - Endpoint upload gambar mandiri di panel admin (`/api/admin/upload-image`) dengan validasi tipe file dan ukuran.
- **Formula Matematika & Sains (LaTeX, KaTeX, AsciiMath):**
  - Formula sebaris (`$...$`) dan formula blok (`$$...$$`).
  - Mendukung pecahan kompleks, akar bertingkat, matriks, limit, integral, serta notasi kimia/fisika.
  - Editor Admin dilengkapi **Live Math Preview** dan **Toolbar Rumus Cepat**.
  - Responsif di layar HP dengan auto-scroll mendatar (*no layout blowout*).
- **Format Pilihan Ganda & Skala Bobot:**
  - Pilihan ganda standar (A–E).
  - Soal skala bobot bertingkat khusus **TKP CPNS** (nilai opsi 1–5).

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

### 5. Arsitektur Ringan & SQLite WAL Mode
- Basis data **SQLite** dengan mode **WAL (Write-Ahead Logging)**:
  - Konkurensi tinggi, bebas database lock (`busy_timeout = 5000`).
  - Cache memori 64MB dan transaksi atomic aman.
  - Sangat hemat RAM & CPU, siap dijalankan di server lokal, Raspberry Pi, maupun VPS minimalis.

---

## 🔑 Akun Bawaan (Default Accounts)

Untuk mempermudah pengujian, sistem telah menyediakan 3 akun awal dengan berbagai peran:

| Peran (Role) | Username | Password | Hak Akses |
|---|---|---|---|
| **Super Admin** | `superadmin` | `SuperPassword123!` | Akses penuh: Admin, Bank Soal, Paket, Users, Import |
| **Admin / Guru** | `guru_matematika` | `GuruPassword123!` | Kelola Bank Soal, Buat Soal Baru, Buat Paket |
| **Peserta / Siswa** | `siswa_budi` | `SiswaPassword123!` | Mengerjakan Ujian, Mode Latihan, Riwayat & Hasil |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Math Engine:** [KaTeX](https://katex.org/)
- **Database:** SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (WAL Mode)
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
DEFAULT_ADMIN_PASSWORD="SuperPassword123!"
```

### 4. Migrasi Skema & Seeding Data Lengkap (492 Soal & 13 Paket)
```bash
# Buat tabel dan seed 492 butir soal (PRISMA + Buku Soal + CPNS)
npm run seed
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
├── data/                      # File database SQLite (cerdasify.db, cerdasify.db-wal)
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
│   │   ├── exam/              # ExamTimer, GridNav, QuestionCard, PauseOverlay
│   │   ├── katex/             # MathRenderer (LaTeX parser aman)
│   │   └── ui/                # Button, Modal, Card, Input
│   ├── db/                    # Drizzle ORM Schema, Koneksi SQLite WAL, & Seeder
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
- **[Panduan Pengembangan & Arsitektur (Developer Guide)](file:///home/affan/projects/cerdasify/DOCS_DEVELOPMENT.md)** — Arsitektur sistem, skema SQLite, pola anti-leak, dan referensi REST API.
- **[Product Requirements Document (PRD)](file:///home/affan/projects/cerdasify/PRD.md)** — Spesifikasi produk, kebutuhan fungsional, dan skema data.
- **[Development Guidelines (AGENTS.md)](file:///home/affan/projects/cerdasify/AGENTS.md)** — Standar pengkodean, konvensi KaTeX, dan checklist verifikasi.

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Bebas digunakan dan dikembangkan untuk kepentingan bimbingan belajar, sekolah, dan komunitas pendidikan.

