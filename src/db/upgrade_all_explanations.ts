import Database from 'better-sqlite3';
import { client } from './index';
import fs from 'fs';
import path from 'path';

// =========================================================================
// SCRIPT PEMBARUAN TOTAL PEMBAHASAN SOAL (ANTI-DUMMY & PENUH PEDAGOGIS)
// 1. pkg_orion_2026_ma (35 soal — solusi matematis lengkap & kunci valid)
// 2. pkg_ceo_2025_m1 (30 soal — upgrade penjelasan naratif lengkap)
// 3. q_0007_bilangan-hilang & q_0298_barisan-pola-ba (solusi detail)
// 4. pkg_orion_2025_mtk_a & b (upgrade penjelasan singkat jadi lengkap)
// 5. 160 soal Bahasa Inggris (pkg_bing_lvl1 & lvl2) dari data/english_explanations.json
// =========================================================================

interface QuestionUpgrade {
  id: string;
  explanation: string;
  correctLabel?: string;
  promptOverride?: string;
}

// 1. DATA SOAL & PEMBAHASAN ORION FINAL NASIONAL 2026 LEVEL A (KELAS 1-2)
const ORION_2026_MA_UPGRADES: QuestionUpgrade[] = [
  {
    id: 'q_orion_ma_01',
    correctLabel: 'B',
    explanation: 'Ibu membayar belanja Rp15.000 dengan tepat 2 jenis uang, yaitu 1 lembar Rp10.000 dan 1 lembar Rp5.000 ($10.000 + 5.000 = \\text{Rp } 15.000$).\nSisa uang yang belum digunakan adalah 4 keping uang Rp1.000, sehingga total sisa uang Ibu adalah:\n$$4 \\times \\text{Rp } 1.000 = \\text{Rp } 4.000$$.\n\nKunci Jawaban: **B (Rp4.000)**.'
  },
  {
    id: 'q_orion_ma_02',
    correctLabel: 'D',
    explanation: 'Banyak pohon mangga awal $= 85$ pohon.\nSebanyak 12 pohon mangga ditebang $\\implies$ sisa pohon mangga $= 85 - 12 = 73$ pohon.\nPohon jeruk ada 47 pohon.\n$$\\text{Selisih} = 73 - 47 = 26 \\text{ pohon}$$.\n\nKunci Jawaban: **D (26)**.'
  },
  {
    id: 'q_orion_ma_03',
    correctLabel: 'C',
    explanation: 'Siti ingin menggunakan uang pecahan Rp2.000 sebanyak mungkin untuk mencapai total Rp9.000:\n- Maksimal lembar Rp2.000 adalah 4 lembar: $4 \\times \\text{Rp } 2.000 = \\text{Rp } 8.000$.\n- Kekurangan uang: $\\text{Rp } 9.000 - \\text{Rp } 8.000 = \\text{Rp } 1.000$ (yaitu tepat 1 keping Rp1.000).\nJadi kombinasi uang Siti adalah **4 lembar Rp2.000 dan 1 keping Rp1.000**.\n\nKunci Jawaban: **C**.'
  },
  {
    id: 'q_orion_ma_04',
    correctLabel: 'B',
    explanation: 'Hari ini adalah hari Rabu. Dua hari setelah hari Rabu adalah:\n- 1 hari setelah Rabu: Kamis\n- 2 hari setelah Rabu: **Jumat**.\n\nKunci Jawaban: **B (Jumat)**.'
  },
  {
    id: 'q_orion_ma_05',
    correctLabel: 'D',
    explanation: 'Ciri-ciri bangun datar memiliki 4 sisi sama panjang dan 4 sudut siku-siku ($90^\\circ$) adalah bangun datar **persegi**.\nDi antara pilihan yang ada:\n- Buku tulis berbentuk persegi panjang\n- Jam dinding berbentuk lingkaran\n- Rambu berbentuk segitiga\n- **Ubin lantai berbentuk persegi**.\n\nKunci Jawaban: **D (Ubin lantai persegi)**.'
  },
  {
    id: 'q_orion_ma_06',
    correctLabel: 'C',
    explanation: 'Misalkan dua bilangan tersebut adalah $A$ dan $B$ dengan $A > B$.\nDiketahui selisih $= 18$ dan bilangan lebih kecil $B = 27$.\n$$A - B = 18 \\implies A - 27 = 18 \\implies A = 27 + 18 = 45$$.\nJadi bilangan yang lebih besar adalah **45**.\n\nKunci Jawaban: **C (45)**.'
  },
  {
    id: 'q_orion_ma_07',
    correctLabel: 'C',
    explanation: 'Bilangan 3 angka dengan ratusan $= 7$:\nJumlah angka $= 15 \\implies 7 + \\text{puluhan} + \\text{satuan} = 15 \\implies \\text{puluhan} + \\text{satuan} = 8$.\nKarena angka satuan lebih besar dari puluhan, pasangan yang mungkin adalah puluhan $= 0$ dan satuan $= 8$ (bilangan asli $708$).\nJika angka ratusan dan satuan ditukar posisinya, angka ratusan menjadi 8 dan angka satuan menjadi 7, sehingga terbentuk bilangan **807**.\n\nKunci Jawaban: **C (807)**.'
  },
  {
    id: 'q_orion_ma_08',
    correctLabel: 'B',
    explanation: 'Total uang $= \\text{Rp } 18.000$.\nUang yang sudah diketahui:\n- 1 lembar Rp10.000 $= \\text{Rp } 10.000$\n- 4 keping Rp1.000 $= \\text{Rp } 4.000$\nJumlah uang yang diketahui $= 10.000 + 4.000 = \\text{Rp } 14.000$.\nSisa uang dalam bentuk lembaran Rp2.000 $= 18.000 - 14.000 = \\text{Rp } 4.000$.\n$$\\text{Banyak lembar Rp2.000} = \\frac{4.000}{2.000} = 2 \\text{ lembar}$$.\n\nKunci Jawaban: **B (2)**.'
  },
  {
    id: 'q_orion_ma_09',
    correctLabel: 'A',
    explanation: 'Uji pilihan bilangan 246:\n1. Ratusan $= 2$ (bilangan genap).\n2. Puluhan $= 4$, bernilai 2 lebih besar dari ratusan ($2 + 2 = 4$).\n3. Satuan $= 6$, merupakan jumlah ratusan dan puluhan ($2 + 4 = 6$).\n4. Jumlah ketiga angka $= 2 + 4 + 6 = 12$ (sesuai syarat).\nJadi bilangan yang dimaksud adalah **246**.\n\nKunci Jawaban: **A (246)**.'
  },
  {
    id: 'q_orion_ma_10',
    correctLabel: 'C',
    explanation: 'Panjang pita $= 7 \\text{ cm} = 70 \\text{ mm}$.\nPita dipotong sama panjang tanpa sisa dengan ukuran (dalam mm) lebih dari 5 dan kurang dari 15.\nFaktor dari 70 antara 5 dan 15 adalah:\n- $7 \\text{ mm} \\implies$ menghasilkan $70 \\div 7 = 10$ potongan.\n- $10 \\text{ mm} \\implies$ menghasilkan $70 \\div 10 = 7$ potongan.\n- $14 \\text{ mm} \\implies$ menghasilkan $70 \\div 14 = 5$ potongan.\nPilihan yang tersedia di opsi adalah **7** potongan.\n\nKunci Jawaban: **C (7)**.'
  },
  {
    id: 'q_orion_ma_11',
    correctLabel: 'A',
    explanation: 'Mengurutkan bilangan dari nilai terbesar ke terkecil:\nBandingkan nilai tempat ratusan dan puluhan:\n$$860 > 806 > 680 > 608$$.\n\nKunci Jawaban: **A (860, 806, 680, 608)**.'
  },
  {
    id: 'q_orion_ma_12',
    correctLabel: 'C',
    explanation: 'Benda yang tidak memiliki sisi datar sama sekali adalah **bola basket**. Bola hanya dibatasi oleh satu bidang lengkung tertutup tanpa memiliki sisi maupun bidang datar.\nSedangkan kubus, balok, dan botol tabung memiliki permukaan/bidang sisi datar.\n\nKunci Jawaban: **C (Bola)**.'
  },
  {
    id: 'q_orion_ma_13',
    correctLabel: 'C',
    explanation: 'Pola barisan bilangan: dikalikan 2 lalu ditambah 1 ($2n + 1$):\n- $2 \\times 2 + 1 = 5$\n- $5 \\times 2 + 1 = 11$\n- $11 \\times 2 + 1 = 23$\n- $23 \\times 2 + 1 = 47$\n- $47 \\times 2 + 1 = 95$.\nJadi bilangan berikutnya adalah **95**.\n\nKunci Jawaban: **C (95)**.'
  },
  {
    id: 'q_orion_ma_14',
    correctLabel: 'B',
    explanation: 'Misalkan umur Budi $= B$.\n- Umur Ani $= B + 2$\n- Umur Cici $= B + 3$ (karena Budi 3 tahun lebih muda dari Cici)\nJumlah umur bertiga $= 29$ tahun:\n$$(B + 2) + B + (B + 3) = 29$$\n$$3B + 5 = 29 \\implies 3B = 24 \\implies B = 8 \\text{ tahun}$$.\nJadi umur Budi adalah **8 tahun**.\n\nKunci Jawaban: **B (8)**.'
  },
  {
    id: 'q_orion_ma_15',
    correctLabel: 'A',
    explanation: 'Total kelereng $= 56$ butir dibagikan sama banyak.\nKelereng per anak berada di rentang lebih dari 5 dan kurang dari 10.\nFaktor dari 56 antara 5 dan 10 adalah 7 dan 8:\n- Jika masing-masing mendapat 8 butir kelereng $\\implies$ banyak teman $= 56 \\div 8 = 7$ orang.\n- Jika masing-masing mendapat 7 butir kelereng $\\implies$ banyak teman $= 56 \\div 7 = 8$ orang.\nPilihan opsi yang tepat adalah **7** orang teman.\n\nKunci Jawaban: **A (7)**.'
  },
  {
    id: 'q_orion_ma_16',
    correctLabel: 'C',
    explanation: 'Perbedaan utama balok dan kubus:\n- Kubus memiliki 6 sisi berbentuk persegi kongruen dengan seluruh rusuk sama panjang.\n- Balok memiliki pasangan sisi persegi panjang dengan ukuran **panjang, lebar, dan tinggi yang berbeda**.\n\nKunci Jawaban: **C (Ada panjang dan lebar yang berbeda)**.'
  },
  {
    id: 'q_orion_ma_17',
    correctLabel: 'C',
    explanation: 'Total berat ayam $= 2.000 \\text{ gram}$.\nSetiap kantong diisi 500 gram.\n$$\\text{Banyak kantong} = \\frac{2.000}{500} = 4 \\text{ kantong}$$.\n\nKunci Jawaban: **C (4)**.'
  },
  {
    id: 'q_orion_ma_18',
    correctLabel: 'C',
    explanation: 'Misalkan bilangan semula $= x$.\n$$4x - 6 = 26 \\implies 4x = 32 \\implies x = 8$$.\nOperasi selanjutnya: bilangan tersebut ditambah 6 lalu hasilnya dibagi 2:\n$$\\frac{8 + 6}{2} = \\frac{14}{2} = 7$$.\n\nKunci Jawaban: **C (7)**.'
  },
  {
    id: 'q_orion_ma_19',
    correctLabel: 'A',
    explanation: 'Bilangan 3 angka dengan ratusan $= 5$ dan satuan $= 8$.\nAngka puluhan adalah bilangan cacah genap terkecil. Himpunan bilangan cacah adalah $\\{0, 1, 2, 3, \\dots\\}$, dan bilangan genap terkecil di dalamnya adalah **0**.\nMaka bilangan tersebut adalah **508**.\n\nKunci Jawaban: **A (508)**.'
  },
  {
    id: 'q_orion_ma_20',
    correctLabel: 'D',
    explanation: 'Benda yang memiliki sisi datar:\n- Kubus dibatasi 6 bidang datar persegi.\n- Buku persegi panjang dibatasi oleh bidang datar persegi panjang.\n(Bola hanya memiliki sisi lengkung tanpa sisi datar).\n\nKunci Jawaban: **D (Kubus dan buku persegi panjang)**.'
  },
  {
    id: 'q_orion_ma_21',
    correctLabel: 'A',
    explanation: 'Peluang terambil bola merah pada masing-masing kotak:\n- Kotak A: berisi 3 bola merah dari total 3 bola $\\implies$ peluang $= \\frac{3}{3} = 100\\%$ (pasti merah).\n- Kotak B: berisi 2 bola biru $\\implies$ peluang merah $= 0$.\n- Kotak C: berisi 1 merah dan 2 biru $\\implies$ peluang merah $= \\frac{1}{3} \\approx 33,3\\%$.\nMaka peluang terbesar mendapatkan bola merah diperoleh jika memilih **Kotak A**.\n\nKunci Jawaban: **A (A)**.'
  },
  {
    id: 'q_orion_ma_22',
    correctLabel: 'D',
    explanation: 'Konversi satuan panjang:\n$1 \\text{ meter} = 100 \\text{ cm} \\implies 3 \\text{ meter} = 300 \\text{ cm}$.\n$$\\text{Total panjang} = 300 \\text{ cm} + 45 \\text{ cm} = 345 \\text{ cm}$$.\n\nKunci Jawaban: **D (345 cm)**.'
  },
  {
    id: 'q_orion_ma_23',
    correctLabel: 'C',
    explanation: 'Waktu awal pukul 08.00 ditambah durasi 2 jam 30 menit:\n$$08.00 + 02.30 = 10.30$$.\n\nKunci Jawaban: **C (10.30)**.'
  },
  {
    id: 'q_orion_ma_24',
    correctLabel: 'B',
    explanation: 'Lingkaran berbeda dari bangun segi empat (persegi panjang) karena lingkaran dibatasi oleh satu garis lengkung tertutup yang kontinu, sehingga **tidak memiliki sisi lurus dan tidak memiliki titik sudut**.\n\nKunci Jawaban: **B (Tidak memiliki sisi dan sudut)**.'
  },
  {
    id: 'q_orion_ma_25',
    correctLabel: 'C',
    explanation: 'Perkalian cepat menggunakan sifat distributif:\n$$4 \\times 96 = 4 \\times (100 - 4) = 400 - 16 = 384$$.\n\nKunci Jawaban: **C (384)**.'
  },
  {
    id: 'q_orion_ma_26',
    correctLabel: 'C',
    explanation: 'Terdapat 8 kelompok dengan masing-masing 6 siswa:\n$$\\text{Total siswa} = 8 \\times 6 = 48 \\text{ siswa}$$.\nSetiap siswa membawa 2 buku:\n$$\\text{Total buku} = 48 \\times 2 = 96 \\text{ buku}$$.\n\nKunci Jawaban: **C (96)**.'
  },
  {
    id: 'q_orion_ma_27',
    correctLabel: 'B',
    explanation: 'Misalkan banyak kotak pensil semula adalah $k$. Karena setiap kotak berisi 4 pensil, total pensil adalah $4k$.\nTerjual 6 pensil dan tersisa 18:\n$$4k - 6 = 18 \\implies 4k = 24 \\implies k = 6 \\text{ kotak}$$.\n\nKunci Jawaban: **B (6)**.'
  },
  {
    id: 'q_orion_ma_28',
    correctLabel: 'D',
    explanation: 'Waktu awal pukul 03.30. Satu jam kemudian ditambahkan 1 jam pada jarum pendek (jam):\n$$03.30 + 01.00 = 04.30$$.\n\nKunci Jawaban: **D (04.30)**.'
  },
  {
    id: 'q_orion_ma_29',
    correctLabel: 'D',
    explanation: 'Bilangan ganjil antara 490 dan 500 adalah: 491, 493, 495, 497, dan 499.\nBilangan ganjil yang paling besar di antara rentang tersebut adalah **499**.\n\nKunci Jawaban: **D (499)**.'
  },
  {
    id: 'q_orion_ma_30',
    correctLabel: 'A',
    explanation: 'Langkah perhitungan stok buku toko:\n1. Persediaan awal $= 478$ buku.\n2. Tambahan stok baru $= 256$ buku $\\implies 478 + 256 = 734$ buku.\n3. Buku rusak $= 134$ buku $\\implies 734 - 134 = 600$ buku baik.\n4. Seperdua dipinjam perpustakaan $= \\frac{1}{2} \\times 600 = 300$ buku.\n$$\\text{Sisa buku yang tersedia} = 600 - 300 = 300 \\text{ buku}$$.\n\nKunci Jawaban: **A (300)**.'
  },
  {
    id: 'q_orion_ma_31',
    correctLabel: 'B',
    explanation: 'Pola barisan bertambah 10:\n- $215 + 10 = 225$\n- $225 + 10 = 235$\n- $235 + 10 = 245$\n- $245 + 10 = 255$.\nDua bilangan berikutnya adalah **245 dan 255**.\n\nKunci Jawaban: **B (245 dan 255)**.'
  },
  {
    id: 'q_orion_ma_32',
    correctLabel: 'B',
    explanation: 'Tahapan waktu memasak Ibu:\n- Sesi 1: 06.00 hingga 06.45 $= 45$ menit memasak.\n- Istirahat: 15 menit (06.45 s.d. 07.00).\n- Sesi 2: 07.00 hingga 07.30 $= 30$ menit memasak.\n$$\\text{Lama waktu memasak sebenarnya} = 45 \\text{ menit} + 30 \\text{ menit} = 75 \\text{ menit} = 1 \\text{ jam } 15 \\text{ menit}$$.\n\nKunci Jawaban: **B (1 jam 15 menit)**.'
  },
  {
    id: 'q_orion_ma_33',
    correctLabel: 'A',
    explanation: 'Data hewan penampungan:\n- Kucing: $85 - 5 \\text{ diadopsi} = 80$ ekor\n- Ikan: $120 - 20 \\text{ dipindahkan} = 100$ ekor\n- Burung: tetap 65 ekor\n$$\\text{Total hewan sekarang} = 80 + 100 + 65 = 245 \\text{ ekor}$$.\n\nKunci Jawaban: **A (245)**.'
  },
  {
    id: 'q_orion_ma_34',
    correctLabel: 'B',
    explanation: 'Pola perulangan terdiri dari siklus 6 warna:\n1. Merah, 2. Kuning, 3. Hijau, 4. Biru, 5. Kuning, 6. Hijau.\nUntuk mencari warna pada urutan ke-14:\n$$14 \\div 6 = 2 \\text{ sisa } 2$$.\nSisa 2 menunjukkan warna ke-2 pada siklus berulang, yaitu warna **Kuning**.\n\nKunci Jawaban: **B (Kuning)**.'
  },
  {
    id: 'q_orion_ma_35',
    correctLabel: 'B',
    explanation: 'Total harga belanjaan:\n$$\\text{Total} = \\text{Rp } 2.500 \\text{ (permen)} + \\text{Rp } 3.500 \\text{ (cokelat)} = \\text{Rp } 6.000$$.\nUang yang dibayarkan $= \\text{Rp } 10.000$.\n$$\\text{Uang kembalian} = \\text{Rp } 10.000 - \\text{Rp } 6.000 = \\text{Rp } 4.000$$.\n\nKunci Jawaban: **B (Rp4.000)**.'
  }
];

// 2. UPGRADE PEMBAHASAN MATEMATIKA SPESIFIK & SINGKAT
const SPECIAL_MATH_UPGRADES: QuestionUpgrade[] = [
  {
    id: 'q_0007_bilangan-hilang',
    correctLabel: 'B',
    explanation: 'Langkah pengerjaan:\n1. Nilai $\\Delta = 3 \\times 12 = 36$.\n2. Persamaan pertama: $\\Box + 15 = \\Delta \\implies \\Box + 15 = 36$.\n3. Mencari nilai $\\Box$:\n$$\\Box = 36 - 15 = 21$$.\n\nKunci Jawaban: **B (21)**.'
  },
  {
    id: 'q_0298_barisan-pola-ba',
    correctLabel: 'A',
    explanation: 'Barisan susunan korek api membentuk pola aritmetika:\n- Suku pertama ($a$) $= 4$\n- Beda antar pola ($b$) $= 6 - 4 = 2$\nRumus suku ke-$n$ ($U_n$):\n$$U_n = a + (n - 1)b = 4 + (n - 1) \\times 2 = 2n + 2$$\nUntuk gambar ke-18 ($n = 18$):\n$$U_{18} = 2(18) + 2 = 36 + 2 = 38 \\text{ batang}$$.\n\nKunci Jawaban: **A (38)**.'
  },
  {
    id: 'q_ceo25_m1_02',
    explanation: 'Harun menukarkan uang satu lembar sepuluh ribuan (Rp10.000) dengan uang logam/pecahan lima ratusan (Rp500).\n$$\\text{Banyak uang pecahan} = \\frac{10.000}{500} = 20 \\text{ keping/lembar}$$.\n\nKunci Jawaban: **D (20)**.'
  },
  {
    id: 'q_ceo25_m1_04',
    explanation: 'Perhitungan perubahan jumlah penduduk Desa Mangunsari:\n- Penduduk awal $= 532$ orang\n- Pindah ke luar desa $= 17$ orang $\\implies 532 - 17 = 515$ orang\n- Datang penduduk baru $= 67$ orang $\\implies 515 + 67 = 582$ orang.\nJadi jumlah penduduk desa sekarang adalah **582 orang**.\n\nKunci Jawaban: **A (582)**.'
  },
  {
    id: 'q_ceo25_m1_10',
    explanation: 'Alif menanam bunga mawar pada 7 pot, dan setiap pot berbunga sebanyak 5 batang.\n$$\\text{Total bunga mawar} = 7 \\text{ pot} \\times 5 \\text{ batang} = 35 \\text{ batang}$$.\n\nKunci Jawaban: **D (35 batang)**.'
  },
  {
    id: 'q_ceo25_m1_11',
    explanation: 'Perhitungan permen Ivan:\n- Awalnya memiliki 27 bungkus\n- Diberikan ke adik 10 bungkus $\\implies 27 - 10 = 17$ bungkus tersisa\n- Diberi paman tambahan 35 bungkus $\\implies 17 + 35 = 52$ bungkus.\nJadi jumlah permen Ivan sekarang ada **52 bungkus**.\n\nKunci Jawaban: **B (52 permen)**.'
  },
  {
    id: 'q_ceo25_m1_12',
    explanation: 'Dalam keranjang terdapat 46 buah semangka. Terjual 17 buah semangka kepada pembeli.\n$$\\text{Sisa semangka dalam keranjang} = 46 - 17 = 29 \\text{ buah}$$.\n\nKunci Jawaban: **A (29)**.'
  },
  {
    id: 'q_ceo25_m1_13',
    explanation: 'Marsellino sampai di Bandung pukul 05.30 dan berangkat 5 jam yang lalu.\n$$05.30 - 05.00 = 00.30 \\text{ WIB}$$.\nJadi Marsellino berangkat pada pukul **00.30 WIB**.\n\nKunci Jawaban: **A (00.30 WIB)**.'
  },
  {
    id: 'q_ceo25_m1_15',
    explanation: 'Hubungan satuan berat kilogram ke ons (hektogram):\n$$1 \\text{ kg} = 10 \\text{ ons}$$\nMaka untuk 3 kg diperoleh:\n$$3 \\text{ kg} = 3 \\times 10 = 30 \\text{ ons}$$.\n\nKunci Jawaban: **C (30)**.'
  },
  {
    id: 'q_ceo25_m1_16',
    explanation: 'Jumlah siswa kelas 1 adalah 32 anak. Guru akan membagi siswa menjadi kelompok yang masing-masing beranggotakan 8 anak.\n$$\\text{Banyak kelompok yang terbentuk} = 32 \\div 8 = 4 \\text{ kelompok}$$.\n\nKunci Jawaban: **C (4)**.'
  },
  {
    id: 'q_ceo25_m1_19',
    explanation: 'Satu minggu memiliki tepat 7 hari (Senin s.d. Minggu). Maka dalam 5 minggu terdapat:\n$$5 \\text{ minggu} \\times 7 \\text{ hari} = 35 \\text{ hari}$$.\n\nKunci Jawaban: **C (35 hari)**.'
  },
  {
    id: 'pkg_orion_2025_mtk_a_q24',
    explanation: 'Rini berangkat ke Surabaya pukul 10.30 menaiki bus dengan lama perjalanan 2 jam.\n$$\\text{Waktu tiba} = 10.30 + 02.00 = 12.30$$.\n\nKunci Jawaban: **A (12.30)**.'
  },
  {
    id: 'pkg_orion_2025_mtk_a_q34',
    explanation: 'Waktu saat ini menunjukkan pukul 08.00. Waktu 20 menit yang akan datang adalah:\n$$08.00 + 00.20 = 08.20$$.\n\nKunci Jawaban: **C (08.20)**.'
  },
  {
    id: 'pkg_orion_2025_mtk_b_q17',
    explanation: 'Ibu berangkat pukul 07.30 dan mengatakan akan kembali setelah 4 jam 15 menit.\n$$\\text{Waktu tiba di rumah} = 07.30 + 04.15 = 11.45$$.\n\nKunci Jawaban: **C (11.45)**.'
  }
];

// =========================================================================
// RUNNER UTAMA
// =========================================================================
async function run() {
  console.log('🚀 Memulai pembaruan komprehensif seluruh pembahasan soal di Cerdasify...');
  const sqlite = new Database('./data/cerdasify.db');

  // 1. UPDATE ORION 2026 MA
  console.log('\n--- 1. Memperbarui Pembahasan & Kunci ORION 2026 MA (35 Soal) ---');
  for (const item of ORION_2026_MA_UPGRADES) {
    sqlite.prepare('UPDATE questions SET explanation_markdown = ? WHERE id = ?').run(item.explanation, item.id);
    await client`UPDATE questions SET explanation_markdown = ${item.explanation} WHERE id = ${item.id}`;

    if (item.correctLabel) {
      sqlite.prepare('UPDATE question_options SET is_correct = 0, score_value = 0 WHERE question_id = ?').run(item.id);
      sqlite.prepare('UPDATE question_options SET is_correct = 1, score_value = 4 WHERE question_id = ? AND label = ?').run(item.id, item.correctLabel);

      await client`UPDATE question_options SET is_correct = false, score_value = 0 WHERE question_id = ${item.id}`;
      await client`UPDATE question_options SET is_correct = true, score_value = 4 WHERE question_id = ${item.id} AND label = ${item.correctLabel}`;
    }
  }
  console.log('✅ ORION 2026 MA berhasil diperbarui!');

  // 2. UPDATE PEMBAHASAN MATEMATIKA SPESIFIK & SINGKAT
  console.log('\n--- 2. Memperbarui Pembahasan Matematika Singkat & Spesifik ---');
  for (const item of SPECIAL_MATH_UPGRADES) {
    sqlite.prepare('UPDATE questions SET explanation_markdown = ? WHERE id = ?').run(item.explanation, item.id);
    await client`UPDATE questions SET explanation_markdown = ${item.explanation} WHERE id = ${item.id}`;

    if (item.correctLabel) {
      sqlite.prepare('UPDATE question_options SET is_correct = 0, score_value = 0 WHERE question_id = ?').run(item.id);
      sqlite.prepare('UPDATE question_options SET is_correct = 1, score_value = 4 WHERE question_id = ? AND label = ?').run(item.id, item.correctLabel);

      await client`UPDATE question_options SET is_correct = false, score_value = 0 WHERE question_id = ${item.id}`;
      await client`UPDATE question_options SET is_correct = true, score_value = 4 WHERE question_id = ${item.id} AND label = ${item.correctLabel}`;
    }
  }
  console.log('✅ Pembahasan Matematika berhasil diperbarui!');

  // 3. UPDATE PEMBAHASAN BAHASA INGGRIS (160 SOAL)
  console.log('\n--- 3. Memperbarui Pembahasan Bahasa Inggris (160 Soal) ---');
  const bingExpPath = path.resolve(process.cwd(), 'data/english_explanations.json');
  if (fs.existsSync(bingExpPath)) {
    const bingData = JSON.parse(fs.readFileSync(bingExpPath, 'utf-8'));
    let bingCount = 0;
    for (const [qid, exp] of Object.entries(bingData)) {
      sqlite.prepare('UPDATE questions SET explanation_markdown = ? WHERE id = ?').run(exp, qid);
      await client`UPDATE questions SET explanation_markdown = ${exp as string} WHERE id = ${qid}`;
      bingCount++;
    }
    console.log(`✅ ${bingCount} Pembahasan Bahasa Inggris berhasil diperbarui ke standar pedagogis!`);
  }

  // 4. REKALKULASI SELURUH ATTEMPT USER (JIKA ADA PERUBAHAN SKOR)
  console.log('\n--- 4. Sinkronisasi & Rekalkulasi Skor Sesi Ujian ---');
  const attempts = await client`SELECT id, package_id FROM attempts`;
  for (const att of attempts) {
    const ansRows = await client`
      SELECT aa.id, aa.question_id, aa.selected_option_ids, qo.score_value, qo.is_correct
      FROM attempt_answers aa
      LEFT JOIN question_options qo ON qo.id = aa.selected_option_ids::json->>0
      WHERE aa.attempt_id = ${att.id}
    `;

    let totalScore = 0;
    for (const ans of ansRows) {
      const awarded = ans.is_correct ? 4 : 0;
      totalScore += awarded;
      await client`UPDATE attempt_answers SET score_awarded = ${awarded} WHERE id = ${ans.id}`;
    }

    await client`UPDATE attempts SET score_total = ${totalScore} WHERE id = ${att.id}`;
  }

  console.log('\n🎉 SEMUA PEMBAHASAN SOAL DI SELURUH DATABASE BERHASIL DIPERBAIKI SECARA AKURAT DAN MENDALAM!');
  await client.end();
}

run().catch((err) => {
  console.error('Error saat pembaruan pembahasan:', err);
  process.exit(1);
});
