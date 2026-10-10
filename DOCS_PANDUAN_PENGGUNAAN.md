# Panduan Penggunaan Sistem Cerdasify 📖

Selamat datang di **Panduan Penggunaan Resmi Cerdasify**! Dokumen ini dirancang sebagai panduan komprehensif bagi **Peserta (Siswa)**, **Pengajar (Admin)**, maupun **Super Administrator** dalam memanfaatkan seluruh fitur latihan soal dan simulasi ujian pada platform Cerdasify.

---

## 📑 Daftar Isi
1. [Akun Bawaan untuk Pengujian](#1-akun-bawaan-untuk-pengujian)
2. [Panduan Peserta / Siswa](#2-panduan-peserta--siswa)
   - [2.1 Masuk ke Sistem (Login)](#21-masuk-ke-sistem-login)
   - [2.2 Menjelajahi Katalog & Memilih Paket Soal](#22-menjelajahi-katalog--memilih-paket-soal)
   - [2.3 Perbedaan Mode Simulasi vs Mode Latihan](#23-perbedaan-mode-simulasi-vs-mode-latihan)
   - [2.4 Antarmuka Pengerjaan Ujian](#24-antarmuka-pengerjaan-ujian)
   - [2.5 Menggunakan Fitur Jeda (Pause) & Lanjutkan (Resume)](#25-menggunakan-fitur-jeda-pause--lanjutkan-resume)
   - [2.6 Memperbesar Stimulus Gambar Soal (Lightbox Zoom)](#26-memperbesar-stimulus-gambar-soal-lightbox-zoom)
   - [2.7 Menyimpan & Mengumpulkan Jawaban (Submit)](#27-menyimpan--mengumpulkan-jawaban-submit)
   - [2.8 Menelaah Hasil Ujian & Pembahasan Rumus KaTeX](#28-menelaah-hasil-ujian--pembahasan-rumus-katex)
3. [Panduan Pengajar / Admin](#3-panduan-pengajar--admin)
   - [3.1 Akses Panel Admin](#31-akses-panel-admin)
   - [3.2 Mengelola Bank Soal](#32-mengelola-bank-soal)
   - [3.3 Membuat Soal Baru Manual & Math Toolbar](#33-membuat-soal-baru-manual--math-toolbar)
   - [3.4 Mengunggah Gambar Stimulus Soal](#34-mengunggah-gambar-stimulus-soal)
   - [3.5 Mengatur Paket Ujian (Packages)](#35-mengatur-paket-ujian-packages)
   - [3.6 Impor Massal Soal & Peserta (Excel & CSV)](#36-impor-massal-soal--peserta-excel--csv)
4. [Tanya Jawab & Tips Kelancaran Ujian (FAQ)](#4-tanya-jawab--tips-kelancaran-ujian-faq)

---

## 1. Akun Pengguna

Cerdasify memiliki tiga peran:

| Peran (Role) | Cara Mendapatkan Akun | Wewenang |
|---|---|---|
| **Super Admin** | Dibuat dari pengaturan server (`DEFAULT_ADMIN_USERNAME`/`DEFAULT_ADMIN_PASSWORD`) | Akses penuh: bank soal, paket ujian, impor massal, dan akun pengguna. |
| **Admin / Guru** | Dibuat Super Admin di menu **Pengguna** | Kelola bank soal, buat paket latihan, dan periksa statistik soal. |
| **Peserta / Siswa** | Dibuat Super Admin (atau impor massal), atau akun anak dari menu **Orang Tua** | Mengerjakan latihan/ujian, jeda waktu, ulasan nilai, dan Pustaka Belajar. |

Tidak ada akun demo dengan password bawaan. Simpan password setiap akun dengan aman dan ganti bila pernah dibagikan.

---

## 2. Panduan Peserta / Siswa

### 2.1 Masuk ke Sistem (Login)
1. Buka browser pada smartphone, tablet, atau komputer desktop Anda.
2. Akses alamat web Cerdasify (misal: `http://localhost:3000` atau URL domain instansi).
3. Jika belum masuk, Anda akan diarahkan ke halaman **Login**.
4. Masukkan **Username** dan **Password** yang telah didaftarkan oleh Administrator.
5. Klik tombol **Masuk ke Akun**.

---

### 2.2 Menjelajahi Katalog & Memilih Paket Soal
Setelah berhasil masuk, Anda akan disambut oleh halaman **Katalog Paket Ujian**:
- **Statistik Cepat:** Di bagian atas layar, Anda dapat melihat total paket yang tersedia, paket yang telah Anda selesaikan, dan rata-rata skor Anda.
- **Filter Kategori:** Gunakan tombol filter di bagian atas untuk menyaring paket soal berdasarkan kategori:
  - *Semua Kategori*
  - *Olimpiade Sains (PRISMA 2024–2025 Level 1, 2, 3)*
  - *Buku Soal Sesi 40 Butir (Sesi 1, 2, 3, 4, 5, 13, 21)*
  - *Aljabar & Matematika Lanjut (100 Butir HOTS)*
  - *CPNS SKD (Simulasi TWK, TIU, TKP)*
- **Informasi Kartu Paket:** Setiap kartu memuat judul, deskripsi, jumlah butir butir soal, estimasi durasi menit, serta label penanda khusus:
  - 🟢 **Mode Latihan (Bisa Dijeda)**: Paket latihan fleksibel yang bisa dihentikan sementara.
  - 🔵 **Soal Bergambar**: Paket yang memuat stimulus diagram, geometri arsiran, atau kurva.

---

### 2.3 Perbedaan Mode Simulasi vs Mode Latihan

| Fitur | Mode Simulasi (Ujian Resmi) | Mode Latihan (Self-Study) |
|---|---|---|
| **Batas Waktu** | Hitung mundur ketat (*Strict Countdown*). | Waktu berjalan santai (*Flexible Timer*). |
| **Fitur Jeda (Pause)** | ❌ Tidak tersedia (waktu terus berjalan). | ✅ **Tersedia**: dapat dijeda dan dilanjutkan kapan saja. |
| **Auto-Submit Saat Habis** | ✅ Ya, otomatis tersubmit saat waktu habis. | ⚠️ Timer memberi notifikasi namun pengerjaan tetap dapat diselesaikan. |
| **Tujuan Utama** | Menguji kesiapan mental & kecepatan seperti CAT BKN / UTBK. | Mempelajari konsep materi, mengasah pemahaman, dan evaluasi berkala. |

---

### 2.4 Antarmuka Pengerjaan Ujian
Antarmuka pengerjaan Cerdasify didesain bersih, modern, dan bebas distraksi (*distraction-free testing interface*):

```
+-------------------------------------------------------------------------+
| [Cerdasify Logo]     Paket: PRISMA 2025 Level 2     [ ⏸ Jeda ] [⏱ 58:24] |
+-------------------------------------------------------------------------+
| [Nomor Soal 1 dari 40]  [Topik: Geometri]                [Ragu-ragu 🔲] |
|                                                                         |
| Perhatikan gambar lingkaran dan persegi di bawah ini.                   |
| Luas daerah yang diarsir adalah ...                                     |
| [  GAMBAR STIMULUS GEOMETRI - KLIK UNTUK ZOOM  ]                         |
|                                                                         |
| (A) $14\pi - 28\text{ cm}^2$                                            |
| (B) $28\pi - 14\text{ cm}^2$                                            |
| (C) $56 - 14\pi\text{ cm}^2$                                            |
| (D) $112 - 28\pi\text{ cm}^2$                                           |
+-------------------------------------------------------------------------+
| [ < Sebelumnya ]       [ 1 ][ 2 ][ 3* ][ 4 ]...        [ Selanjutnya > ]|
|                                                     [ 📤 Kumpulkan ]    |
+-------------------------------------------------------------------------+
```

1. **Header Atas:**
   - Nama paket soal yang sedang dikerjakan.
   - Indikator Timer waktu pengerjaan.
   - Tombol **Jeda** (pada mode latihan).
2. **Kartu Stimulus Soal Cerita / Teks Bacaan (Jika Ada):**
   - Untuk soal-soal berbasis wacana, cerita, dialog, atau petunjuk arah yang berlaku untuk lebih dari 1 soal (seperti pada *Olimpiade Bahasa Inggris Soal No. 1–5*), teks cerita ditampilkan dalam **Kotak Stimulus Bacaan** berlatar lembut dengan badge *Stimulus Bacaan*.
   - **Tampilan Konsisten Multi-Nomor:** Kotak bacaan ini **otomatis tetap tampil di atas setiap nomor soal yang relevan** (misalnya saat peserta berada di nomor 1, 2, 3, 4, maupun 5), sehingga peserta dapat langsung merujuk ke teks tanpa perlu bolak-balik menekan tombol kembali ke nomor 1.
3. **Kartu Pertanyaan:**
   - Teks pertanyaan yang mendukung penuh simbol matematika dan sains (KaTeX).
   - Area gambar stimulus (jika soal memiliki gambar).
   - Opsi jawaban pilihan ganda (A sampai E).
4. **Navigasi Grid Nomor Soal:**
   - **Desktop:** Panel nomor soal di sebelah kanan layar.
   - **Smartphone:** Tombol drawer di kanan atas untuk memunculkan daftar nomor tanpa menutupi soal.
   - **Indikator Warna Tombol Nomor:**
     - 🟦 *Biru solid*: Soal yang sedang aktif dibuka.
     - 🟩 *Hijau*: Soal yang sudah Anda jawab.
     - 🟨 *Kuning*: Soal yang Anda tandai "Ragu-ragu".
     - ⬜ *Abu-abu*: Soal yang belum dijawab.
5. **Auto-Save Otomatis:**
   - Setiap kali Anda mengeklik opsi jawaban, sistem secara otomatis mengirimkan jawaban Anda ke server di latar belakang (*background auto-save*). Anda tidak perlu khawatir kehilangan jawaban jika koneksi internet mendadak lambat.

---

### 2.5 Menggunakan Fitur Jeda (Pause) & Lanjutkan (Resume)
Pada paket bertipe **Mode Latihan**, Anda dapat menghentikan waktu sementara ketika perlu beristirahat, menjawab panggilan penting, atau beribadah:
1. Klik tombol **Jeda (Pause)** yang terletak di bilah atas samping timer atau di panel navigasi bawah.
2. **Layar Pelindung Privasi (Privacy Overlay):**
   - Layar ujian akan seketika ditutupi oleh tirai pelindung redup (*screen blackout overlay*) bertuliskan:
     > *"Sesi Latihan Dijeda — Timer dihentikan sementara. Sisa waktu Anda tersimpan aman."*
   - Konten pertanyaan disembunyikan untuk menjaga fokus serta sportivitas latihan mandiri.
3. Sisa waktu pengerjaan dihitung dan disimpan oleh server, sehingga tidak bisa dimanipulasi dari browser.
4. Ketika Anda sudah siap kembali, cukup klik tombol hijau besar: **Lanjutkan Pengerjaan (Resume)**. Layar akan terbuka seketika dan timer kembali berjalan persis dari detik terakhir.

---

### 2.6 Memperbesar Stimulus Gambar Soal (Lightbox Zoom)
Jika Anda menjumpai soal yang memuat gambar arsiran geometri, diagram alur, grafik koordinat kartesius, atau tabel data:
1. Cukup klik langsung pada gambar tersebut di kartu soal.
2. Gambar akan terbuka dalam mode **Lightbox Layar Penuh**.
3. Gambar dapat dicermati dengan resolusi jernih tanpa terdistorsi.
4. Klik tombol **Tutup (✕)** di sudut kanan atas atau klik area redup di luar gambar untuk kembali ke pengerjaan.

---

### 2.7 Menyimpan & Mengumpulkan Jawaban (Submit)
1. Setelah memeriksa seluruh nomor (pastikan tidak ada nomor yang tertinggal atau berstatus ragu-ragu), klik tombol **Kumpulkan Ujian / Selesai**.
2. Sistem akan menampilkan jendela dialog konfirmasi yang merangkum:
   - Jumlah soal yang sudah dijawab.
   - Jumlah soal yang masih ragu-ragu.
   - Jumlah soal yang belum diisi.
3. Klik **Ya, Kumpulkan Jawaban**.
4. Server akan memvalidasi jawaban Anda, menghitung total skor, dan mengarahkan Anda langsung ke halaman ulasan hasil.

---

### 2.8 Menelaah Hasil Ujian & Pembahasan Rumus KaTeX
Pada halaman hasil:
1. **Ringkasan Skor:**
   - Total nilai akhir dan persentase kelulusan.
   - Status kelulusan (*LULUS / TIDAK LULUS* berdasarkan passing grade paket).
   - Rincian jumlah soal benar, salah, dan kosong.
2. **Pembahasan Butir per Butir:**
   - Anda dapat menelusuri lembar jawaban Anda satu per satu.
   - Setiap nomor menampilkan opsi jawaban yang Anda pilih, kunci jawaban resmi yang benar, dan kotak penjelasan pembahasan lengkap yang dirender dengan formula matematika KaTeX yang tajam dan mudah dipahami.
3. **Mengerjakan Ulang (Retake):**
   - Anda dapat mengulang paket soal tersebut kapan saja untuk mengukur peningkatan kemampuan Anda.

---

### 2.9 Soal Berbobot (SJT ASN & TKP CPNS)
Pada soal berbobot tidak ada jawaban yang sekadar benar atau salah. Setiap pilihan bernilai **1 sampai 5 poin** sesuai kepatutan tindakannya, dan tidak ada nilai minus.
- Di ruang ujian, soal ini bertanda **"Soal Berbobot — setiap pilihan bernilai 1–5"**. Pilih tindakan yang paling tepat menurut Anda.
- Di halaman hasil, setiap soal menampilkan perolehan **"+X dari 5 poin"**. Pilihan terbaik ditandai hijau, sedangkan pilihan Anda yang bernilai sebagian ditandai kuning, bukan merah.
- Pembahasan menjelaskan urutan bobot kelima pilihan beserta alasannya, sehingga Anda bisa memahami mengapa sebuah tindakan dinilai lebih baik.

---

## 3. Panduan Pengajar / Admin

### 3.1 Akses Panel Admin
1. Masuk menggunakan akun ber-role `ADMIN` atau `SUPER_ADMIN` (misal: akun Super Admin atau akun guru).
2. Klik tombol **Panel Admin** di menu navigasi utama.
3. Dashboard admin akan menampilkan statistik bank soal, total paket, peserta aktif, dan riwayat aktivitas.

---

### 3.2 Mengelola Bank Soal
1. Masuk ke menu **Bank Soal** (`/admin/bank-soal`).
2. Anda dapat melihat seluruh butir soal (1.623 soal per Oktober 2026) yang telah terindeks rapi.
3. Gunakan filter pencarian untuk menyaring soal berdasarkan:
   - Kategori (misal: *Olimpiade Matematika*, *Buku Soal*, *CPNS SKD*)
   - Topik (misal: *Geometri*, *Aljabar*, *TIU*, *TKP*)
   - Tingkat Kesulitan (*Mudah*, *Sedang*, *Sulit*, *HOTS*)
4. Setiap butir soal dapat disunting (*edit*), diduplikasi, atau dihapus.

---

### 3.3 Membuat Soal Baru Manual & Math Toolbar
1. Klik tombol **+ Tambah Soal Baru** di menu Bank Soal.
2. Isi informasi dasar: Kategori, Topik, Tipe Soal (`SINGLE_CHOICE`, `MULTI_CHOICE`, atau `GRADED_SCALE`), dan Tingkat Kesulitan.
3. **Menggunakan Math Editor Toolbar:**
   - Di atas area input teks pertanyaan, tersedia toolbar pintas rumus KaTeX:
     - `\frac{a}{b}` : Menyisipkan pecahan bertingkat
     - `\sqrt{x}` : Menyisipkan simbol akar
     - `x^2` & `x_1` : Menyisipkan pangkat dan indeks bawah
     - `\sum` & `\int` : Menyisipkan simbol sigma deret dan integral
     - `\begin{pmatrix}` : Menyisipkan template matriks
     - `\alpha, \pi, \theta` : Menyisipkan simbol Yunani
4. **Toolbar Stimulus & Soal Cerita (Multi-Soal):**
   - Jika satu wacana atau cerita digunakan untuk lebih dari 1 butir pertanyaan (misalnya wacana teks untuk soal nomor 1 sampai 5), gunakan format blok `:::passage[...]`:
     ```markdown
     :::passage[Teks Bacaan (Soal No. 1 – 5)]
     Tuliskan cerita, narasi, petunjuk, atau dialog percakapan di sini.
     :::

     Pertanyaan spesifik untuk butir soal ini...
     ```
   - Di toolbar editor terdapat tombol pintas **📖 Kotak Cerita / Bacaan** dan **💬 Dialog Percakapan** untuk menyisipkan template blok ini secara instan.
   - Cantumkan blok `:::passage[...]` yang sama pada setiap butir soal di dalam rentang tersebut agar peserta selalu dapat membaca stimulus wacana tanpa harus berpindah ke nomor sebelumnya.
5. **Live Preview Panel:**
   - Saat Anda mengetik formula (contoh: `$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$`) atau menyisipkan blok cerita `:::passage`, panel pratinjau langsung merender wacana dan formula secara instan.
6. Masukkan pilihan jawaban (A sampai E) dan tandai jawaban yang benar.
7. Tuliskan langkah pembahasan soal di kolom Pembahasan.

---

### 3.4 Mengunggah Gambar Stimulus Soal
1. Pada form pembuatan/pengeditan soal, temukan area **Gambar Stimulus Pertanyaan (Opsional)**.
2. Anda dapat:
   - Menyeret dan melepas (*drag and drop*) berkas gambar (format `.jpg`, `.jpeg`, `.png`, atau `.webp`, ukuran maks 5MB).
   - Atau klik tombol **Pilih Berkas** untuk memilih dari komputer Anda.
3. Gambar akan diunggah ke server secara instan dan pratinjau gambar akan langsung muncul di form.
4. Anda juga dapat menyematkan gambar pada opsi pilihan jawaban atau gambar pembahasan jika diperlukan.

---

### 3.5 Mengatur Paket Ujian (Packages)
1. Masuk ke menu **Paket Ujian** (`/admin/packages`).
2. Klik **+ Buat Paket Baru**.
3. Tentukan konfigurasi paket:
   - **Judul Paket:** Misal *"Olimpiade Matematika PRISMA 2026 - Babak Penyisihan"*
   - **Tipe Paket:** Pilih **Mode Simulasi** (berbatas waktu ketat) atau **Mode Latihan** (bisa dijeda & santai).
   - **Durasi (Menit):** Misal 60 menit atau 90 menit.
   - **Pengacakan:** Aktifkan opsi acak urutan soal dan acak urutan pilihan jawaban jika diperlukan.
   - **Ambang Batas Kelulusan (Passing Grade):** Tentukan skor minimum untuk dinyatakan lulus.
4. Pilih butir-butir soal dari bank soal yang ingin dimasukkan ke dalam paket ini.
5. Simpan dan publikasikan paket agar langsung tampil di katalog dashboard siswa.

---

### 3.6 Impor Massal Soal & Peserta (Excel & CSV)
Jika Anda memiliki ratusan butir soal atau daftar ratusan siswa dari berkas spreadsheet:
1. Buka menu **Impor Data** (`/admin/import`).
2. **Unduh Template Resmi:**
   - Klik tautan unduh **Template Impor Soal (.xlsx / .csv)** atau **Template Impor Peserta**.
   - Berkas template telah disesuaikan dengan header kolom yang valid.
3. **Format Kolom Impor Soal:**
   - `kategori` : Kategori besar soal (contoh: `Olimpiade Matematika`)
   - `topik` : Sub-materi (contoh: `Aljabar`)
   - `tipe_soal` : `SINGLE`, `MULTI`, atau `SCALE` (soal berbobot: setiap opsi 1–5 poin, mis. TKP/SJT)
   - `pertanyaan` : Teks soal, mendukung rumus `$...$` atau `$$...$$`
   - `opsi_a` s/d `opsi_e` : Teks untuk tiap opsi jawaban
   - `kunci_jawaban` : Huruf kunci (`A`, `B`, `C`, `D`, `E`) atau bobot `A:5,B:4,C:3,D:2,E:1`
   - `pembahasan` : Penjelasan cara pengerjaan
   - `tingkat_kesulitan` : `MUDAH`, `SEDANG`, `SULIT`, atau `HOTS`
4. **Unggah & Validasi:**
   - Unggah file Excel atau CSV yang telah diisi.
   - Sistem akan memvalidasi setiap baris data. Jika terdapat format kunci yang salah atau kolom kosong, sistem akan menampilkan laporan baris yang bermasalah secara spesifik.
   - Data yang valid akan disimpan ke dalam database secara otomatis dalam satu transaksi aman.

---

## 4. Tanya Jawab & Tips Kelancaran Ujian (FAQ)

### Q: Apa yang terjadi jika koneksi internet terputus saat sedang mengerjakan ujian?
**A:** Cerdasify menerapkan sistem penyimpanan otomatis (*background auto-save*). Setiap kali Anda memilih opsi jawaban, jawaban tersebut langsung tercatat di server. Jika koneksi terputus sesaat, Anda dapat menyegarkan (*refresh*) halaman peramban atau masuk kembali, dan seluruh jawaban serta sisa waktu pengerjaan akan terpanggil kembali secara utuh.

### Q: Mengapa saat mode latihan dijeda, soal tidak bisa dibaca?
**A:** Ini adalah fitur keamanan integritas (*anti-cheat by design*). Ketika tombol jeda ditekan, layar sengaja ditutup dengan tirai pengaman (*privacy blackout overlay*) agar peserta tidak menghentikan timer sembari membuka buku atau mencari jawaban soal di internet.

### Q: Mengapa rumus matematika tampak rapi dan tidak memotong layar ponsel?
**A:** Seluruh formula matematika dirender menggunakan engine **KaTeX** dengan pembungkus responsif horizontal (`overflow-x: auto`). Pada smartphone berlayar sempit (360px–420px), rumus panjang dapat digeser mendatar secara halus tanpa merusak struktur kartu pertanyaan.

### Q: Apakah ada batasan berapa kali siswa dapat mengulang paket latihan?
**A:** Tidak ada batasan. Siswa dapat mengulang (*retake*) paket latihan sesering mungkin untuk melatih daya ingat dan penguasaan konsep, di mana riwayat nilai tiap percobaan tersimpan terpisah di menu Riwayat Ujian.

---

*Cerdasify — Platform Latihan Soal & Simulasi Ujian Cerdas, Cepat, dan Terpercaya.*
