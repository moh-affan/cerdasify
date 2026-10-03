# Cerdasify 🎓

> **Platform Web Latihan Soal & Simulasi Ujian Profesional (Olimpiade, TKA, CPNS, UTBK-SNBT)**
> Cepat, Ringan (*Lightweight*), Mobile-Friendly, dan Aman.

---

## 📌 Sekilas Tentang Cerdasify

**Cerdasify** adalah sistem aplikasi web fullstack modern berbasis **Next.js** dan **SQLite (WAL Mode)** yang dirancang untuk kebutuhan latihan soal mandiri serta simulasi ujian berskala profesional. Cocok digunakan oleh bimbingan belajar (bimbel), sekolah, instansi, maupun komunitas pejuang ujian kompetitif seperti CPNS, Olimpiade Sains, dan Seleksi Masuk Perguruan Tinggi.

Cerdasify berfokus pada pengalaman pengguna yang **bersih, elegan, dan tanpa distraksi**, dengan performa muat sangat cepat di seluruh perangkat seluler (smartphone) maupun komputer desktop.

---

## ✨ Fitur Unggulan

### 1. Bank Soal & Manajemen Konten
- **Kategori & Topik Bertingkat:** Pengelompokan soal terstruktur (contoh: CPNS SKD ➔ TWK, TIU, TKP; Olimpiade ➔ Matematika Diskrit, Fisika Mekanika).
- **Multi-Format Soal:**
  - Pilihan ganda standar (A–E) 1 jawaban benar.
  - Pilihan ganda kompleks / multi-jawaban (model AKM/SNBT).
  - Soal skala bobot bertingkat (khusus **TKP CPNS** dengan skor opsi bernilai 1–5).
- **Dukungan Penuh Rumus Matematika & Sains (LaTeX, KaTeX, AsciiMath):**
  - Rendering formula inline (`$...$`) dan display block (`$$...$$`).
  - Mendukung pecahan kompleks, akar bertingkat, integral, limit, matriks, deret/sigma, serta notasi fisika & kimia.
  - Editor Admin dilengkapi **Live Math Preview** dan **Toolbar Rumus Cepat**.
  - Responsif di layar smartphone dengan *horizontal auto-scroll* agar rumus panjang tidak memotong tampilan.
- **Media Gambar:** Dukungan gambar pada teks pertanyaan, opsi pilihan jawaban, dan penjelasan pembahasan.
- **Pengacakan Soal & Opsi:** Soal dan pilihan jawaban dapat diacak secara otomatis saat paket ujian dimulai.

### 2. Impor Massal Soal & Peserta (Excel & CSV)
- Unggah ratusan soal sekaligus menggunakan file format **Excel (`.xlsx`)** atau **CSV (`.csv`)**.
- Mesin validasi cerdas: mendeteksi baris rusak, opsi kosong, atau kesalahan format kunci jawaban sebelum data disimpan.
- Halaman panduan format interaktif lengkap dengan tombol unduh berkas template resmi.
- Fitur impor akun peserta massal untuk kemudahan Super Admin.

### 3. Engine Ujian & Pengalaman CAT BKN / UTBK
- **Mode Ujian Fleksibel:**
  - **Mode Simulasi / Ujian Resmi:** Batas waktu (countdown timer anti-manipulasi server time), layout grid nomor soal, indikator status (Sudah Dijawab, Ragu-ragu, Kosong), dan auto-save otomatis setiap memilih jawaban.
  - **Mode Latihan Mandiri:** Bebas batas waktu, hasil dan pembahasan dapat langsung diperiksa per soal, serta dapat diulang (*retake*) berkali-kali tanpa batas.
- **Integritas & Keamanan Ujian:** Kunci jawaban dan bobot nilai **tidak pernah dikirim ke browser client** sebelum ujian selesai disubmit ke server.

### 4. Sistem Penilaian (Scoring Engine) & Analisis
- Penilaian otomatis instan dengan kalkulasi persentase dan passing grade (ambang batas kelulusan).
- Perhitungan khusus CPNS (Passing Grade terpisah untuk TWK, TIU, dan TKP).
- Riwayat pengerjaan lengkap dengan kurva statistik perkembangan nilai peserta.

### 5. Multi-User & Role-Based Access Control (RBAC)
- **Closed Registration System:** Akun peserta dikelola terpusat oleh Super Admin (manual atau via impor CSV/Excel) demi menjaga eksklusivitas dan ketertiban sistem.
- Tiga tingkatan hak akses:
  - **Super Admin:** Akses penuh ke seluruh sistem, bank soal, manajemen akun, impor/ekspor, dan konfigurasi ujian.
  - **Admin / Pengajar:** Kontributor pembuat & pemeriksa bank soal dan peninjau statistik.
  - **User / Peserta:** Mengakses paket latihan, mengerjakan ujian, dan memantau riwayat progres belajar pribadi.

### 6. Arsitektur Ringan & SQLite WAL Mode
- Menggunakan basis data **SQLite** dengan konfigurasi **WAL (Write-Ahead Logging)**:
  - Eksekusi query baca dan tulis konkuren sangat cepat tanpa lock database.
  - Penggunaan resource memori dan CPU yang sangat hemat, siap di-deploy pada VPS hemat biaya.

---

## 📋 Panduan Format Impor Soal

Template berkas impor soal dapat diunduh langsung melalui panel Super Admin di menu **Bank Soal ➔ Impor Soal**.

### Format Kolom Spreadsheet (Excel / CSV)

| Nama Kolom | Wajib | Keterangan & Contoh Nilai |
|---|---|---|
| `kategori` | Ya | Nama kategori besar, contoh: `CPNS SKD` atau `Olimpiade Matematika` |
| `topik` | Ya | Sub-materi, contoh: `TIU`, `TWK`, `TKP`, atau `Aljabar` |
| `tipe_soal` | Ya | `SINGLE` (Pilihan Ganda Biasa) atau `SCALE` (Skala Bobot 1-5 TKP) |
| `pertanyaan` | Ya | Isi pertanyaan. Mendukung LaTeX, contoh: `Berapakah nilai dari $\sqrt{144}$?` |
| `opsi_a` | Ya | Teks untuk pilihan jawaban A |
| `opsi_b` | Ya | Teks untuk pilihan jawaban B |
| `opsi_c` | Ya | Teks untuk pilihan jawaban C |
| `opsi_d` | Ya | Teks untuk pilihan jawaban D |
| `opsi_e` | Tidak | Teks untuk pilihan jawaban E (opsional jika soal hanya 4 opsi) |
| `kunci_jawaban` | Ya | Untuk tipe `SINGLE`: Masukkan huruf kunci, misal `C`.<br>Untuk tipe `SCALE` (TKP): Masukkan bobot opsi, misal: `A:3,B:5,C:1,D:4,E:2` |
| `pembahasan` | Ya | Teks penjelasan materi dan cara pengerjaan soal |
| `tingkat_kesulitan` | Tidak | `MUDAH`, `SEDANG`, `SULIT`, atau `HOTS` (Default: `SEDANG`) |

---

## 📐 Panduan Penulisan Notasi Matematika & Sains (LaTeX)

Cerdasify mendukung penuh notasi matematis standar LaTeX dan notasi sains di seluruh teks soal, opsi jawaban (A–E), dan pembahasan:

### 1. Formula Sebaris (Inline Math)
Gunakan tanda dollar tunggal (`$...$`) untuk rumus yang menyatu dengan kalimat:
```markdown
Tentukan himpunan penyelesaian dari persamaan $2x^2 - 5x + 3 = 0$.
```

### 2. Formula Blok (Display Math)
Gunakan tanda double dollar (`$$...$$`) untuk rumus utama yang berdiri sendiri di baris baru:
```markdown
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 3. Contoh Formula Umum
| Kategori Rumus | Contoh Kode LaTeX | Hasil Tampilan |
|---|---|---|
| **Pecahan & Akar** | `$\frac{3x + 1}{\sqrt{x^2 - 4}}$` | Pecahan aljabar dengan bentuk akar |
| **Pangkat & Indeks** | `$a_n = a_1 \cdot r^{n-1}$` | Rumus barisan geometri |
| **Kalkulus (Integral & Limit)** | `$$\int_0^\pi \sin(x) \,dx = 2$$` | Integral tentu dengan batas |
| **Matriks & Determinan** | `$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$` | Matriks 2x2 |
| **Persamaan Bercabang** | `$$f(x) = \begin{cases} -x, & x < 0 \\ x, & x \ge 0 \end{cases}$$` | Fungsi nilai mutlak piecewise |
| **Kimia & Fisika** | `$\text{H}_2\text{SO}_4$`, `$v = v_0 + at$` | Notasi molekul dan GLBB |

> 💡 **Tips Penggunaan di Excel / CSV:**
> - Simbol backslash `\` pada formula (seperti `\frac` atau `\sqrt`) didukung penuh.
> - Jika menggunakan berkas CSV, teks yang mengandung tanda koma di dalam formula wajib diapit dengan tanda petik ganda (`"..."`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Math Rendering:** KaTeX
- **Database:** SQLite dengan WAL Mode via `better-sqlite3`
- **ORM:** Drizzle ORM
- **Authentication:** Enkripsi Session Cookie HttpOnly (Zero third-party vendor lock-in)
- **Data Parser:** `xlsx` & `csv-parse`

---

## 🚀 Panduan Memulai (Instalasi Lokal)

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
Salin berkas contoh `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi konfigurasi pada `.env.local`:
```env
# Database
DATABASE_PATH="./data/cerdasify.db"

# Session & Security
SESSION_SECRET="ganti-dengan-kunci-rahasia-minimal-32-karakter-acak"

# Super Admin Akun Awal
DEFAULT_ADMIN_USERNAME="superadmin"
DEFAULT_ADMIN_PASSWORD="SuperPassword123!"
```

### 4. Inisialisasi Database & Seeding
```bash
# Jalankan migrasi skema SQLite WAL & seed data awal
npm run db:push
npm run db:seed
```

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat `http://localhost:3000`.

---

## 📂 Struktur Direktori Proyek

```
cerdasify/
├── data/                      # File database SQLite (cerdasify.db)
├── public/                    # Aset statis & template Excel/CSV
│   └── templates/             # Unduhan template import soal & peserta
├── src/
│   ├── app/                   # App Router Next.js
│   │   ├── (auth)/login/      # Halaman Login
│   │   ├── (dashboard)/       # Dashboard Peserta & Riwayat Latihan
│   │   ├── (exam)/            # Antarmuka Ujian Khusus (Fokus Bebas Distraksi)
│   │   └── admin/             # Panel Super Admin (Bank Soal, Import, Users, Analisis)
│   ├── components/            # Komponen UI Reusable (Timer, Grid Navigasi, KaTeX Renderer)
│   ├── db/                    # Drizzle ORM Schema, Konfigurasi SQLite WAL
│   ├── lib/                   # Autentikasi, Parser Spreadsheet, Engine Penilaian
│   └── types/                 # Definisi Tipe TypeScript
├── PRD.md                     # Dokumen Spesifikasi Produk Lengkap
├── AGENTS.md                  # Panduan Teknis untuk Agen AI & Developer
└── README.md                  # Dokumentasi Proyek Ini
```

---

## 🛡️ Keamanan & Integritas Ujian

1. **Anti-Leak Kunci Jawaban:** Pada paket ujian yang sedang berlangsung, payload API hanya berisi ID soal dan opsi teks tanpa menyertakan status jawaban benar.
2. **Kalkulasi Server-Side:** Seluruh perhitungan skor dan status kelulusan (passing grade) dihitung di server.
3. **Session Cookie HttpOnly:** Melindungi kredensial pengguna dari serangan Cross-Site Scripting (XSS).
4. **Proteksi Concurrency WAL:** SQLite dikonfigurasi dengan mode WAL dan `busy_timeout` 5000ms untuk menjamin kelancaran transaksi tulis auto-save secara simultan.

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Bebas digunakan dan dikembangkan untuk kepentingan edukasi dan komersial.
