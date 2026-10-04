import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

// =========================================================================
// DATA SOAL, KUNCI, & PEMBAHASAN RESMI KOMPETISI NASIONAL ORION (MTK A & B)
// =========================================================================

interface QuestionItem {
  num: number;
  question: string;
  image?: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
}

const ORION_MTK_LEVEL_A: QuestionItem[] = [
  {
    num: 1,
    question: "Bentuk panjang dari bilangan 145 adalah ....",
    options: {
      A: "100 + 4 + 5",
      B: "100 + 40 + 50",
      C: "100 + 40 + 5",
      D: "100 + 400 + 50"
    },
    correct: "C",
    explanation: "Nilai tempat bilangan 145 adalah 1 ratusan (100), 4 puluhan (40), dan 5 satuan (5). Jadi bentuk panjangnya adalah $100 + 40 + 5$.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Bu Siska membeli 500 gram gula. Ia lalu menggunakan 250 gram untuk membuat roti, dan 25 gram untuk membuat minuman. Berapakah sisa gula yang dibeli bu Siska?",
    options: {
      A: "200 gram",
      B: "175 gram",
      C: "225 gram",
      D: "215 gram"
    },
    correct: "C",
    explanation: "Sisa gula = $500 - 250 - 25 = 250 - 25 = 225\\text{ gram}$.",
    difficulty: "EASY"
  },
  {
    num: 3,
    question: "Perhatikan gambar kaleng susu di bawah ini!\n\nBenda pada gambar tersebut berbentuk bangun ruang ....",
    image: "/uploads/orion2025_mtka_q03_kaleng.png",
    options: {
      A: "Tabung (Silinder)",
      B: "Bola",
      C: "Balok",
      D: "Kerucut"
    },
    correct: "A",
    explanation: "Kaleng susu memiliki alas dan tutup berupa lingkaran sejajar yang dihubungkan sisi lengkung selimut, sehingga berbentuk bangun ruang tabung (silinder).",
    difficulty: "EASY"
  },
  {
    num: 4,
    question: "Perhatikan gambar bangun ruang berikut!\n\nNama bangun ruang pada gambar di atas adalah ....",
    image: "/uploads/orion2025_mtka_q04_kerucut.png",
    options: {
      A: "Kerucut",
      B: "Balok",
      C: "Kubus",
      D: "Bola"
    },
    correct: "A",
    explanation: "Bangun ruang dengan alas lingkaran dan satu titik puncak meruncing ke atas adalah kerucut.",
    difficulty: "EASY"
  },
  {
    num: 5,
    question: "Perhatikan gambar timbangan berikut ini!\n\nBerdasarkan posisi lengan timbangan pada gambar di atas, pernyataan yang tepat adalah ....",
    image: "/uploads/orion2025_mtka_q05_timbangan.png",
    options: {
      A: "Buku lebih berat dari buah jeruk",
      B: "Buku sama berat dengan buah jeruk",
      C: "Buku lebih ringan dari buah jeruk",
      D: "Buah jeruk lebih ringan dari buku"
    },
    correct: "B",
    explanation: "Kedua piringan timbangan berada pada posisi sejajar mendatar (seimbang), yang artinya berat buku sama dengan berat buah jeruk.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Di halaman parkir terdapat 10 buah mobil. Jika setiap mobil memiliki 4 roda, berapa jumlah seluruh roda mobil di tempat parkir tersebut?",
    options: {
      A: "14",
      B: "40",
      C: "34",
      D: "42"
    },
    correct: "B",
    explanation: "Jumlah roda = $10\\text{ mobil} \\times 4\\text{ roda} = 40\\text{ roda}$.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Ani bangun pagi pukul 06.30. Kak Mona bangun pagi 30 menit sebelum Ani bangun. Pukul berapa Kak Mona bangun pagi?",
    options: {
      A: "05.00",
      B: "05.30",
      C: "06.00",
      D: "07.00"
    },
    correct: "C",
    explanation: "30 menit sebelum pukul 06.30 adalah $06.30 - 00.30 = 06.00$.",
    difficulty: "EASY"
  },
  {
    num: 8,
    question: "Dalam sehari Ibu Rita mampu menjual kue donat sebanyak 50 buah. Berapa buah kue donat yang dapat dijual Ibu Rita selama 3 hari?",
    options: {
      A: "110",
      B: "150",
      C: "130",
      D: "100"
    },
    correct: "B",
    explanation: "Banyak donat = $50 \\times 3 = 150\\text{ buah}$.",
    difficulty: "EASY"
  },
  {
    num: 9,
    question: "Ayah akan pergi ke Surabaya pada hari Minggu. Jika hari ini adalah hari Senin, berapa hari lagi ayah akan berangkat ke Surabaya?",
    options: {
      A: "5 hari",
      B: "7 hari",
      C: "4 hari",
      D: "6 hari"
    },
    correct: "D",
    explanation: "Menghitung dari Senin: Selasa (1), Rabu (2), Kamis (3), Jumat (4), Sabtu (5), Minggu (6). Jadi 6 hari lagi ayah berangkat.",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Susan berlatih menggambar mulai dari pukul 15.00 dan selesai pukul 16.30. Berapa lama Susan berlatih menggambar?",
    options: {
      A: "1 jam 15 menit",
      B: "1 jam 45 menit",
      C: "1 jam 30 menit",
      D: "2 jam 30 menit"
    },
    correct: "C",
    explanation: "Selisih waktu = $16.30 - 15.00 = 1\\text{ jam } 30\\text{ menit}$.",
    difficulty: "EASY"
  },
  {
    num: 11,
    question: "Perhatikan gambar empat gelas air berikut!\n\nGelas yang berisi volume air paling sedikit adalah ....",
    image: "/uploads/orion2025_mtka_q11_gelas.png",
    options: {
      A: "Gelas 1",
      B: "Gelas 2",
      C: "Gelas 3",
      D: "Gelas 4"
    },
    correct: "C",
    explanation: "Berdasarkan ketinggian permukaan air pada gambar, gelas nomor 3 memiliki tinggi air yang paling rendah, sehingga volumenya paling sedikit.",
    difficulty: "EASY"
  },
  {
    num: 12,
    question: "Sebuah tiang bendera mempunyai tinggi 400 cm. Berapa meter tinggi tiang bendera tersebut?",
    options: {
      A: "40 m",
      B: "4 m",
      C: "0,4 m",
      D: "400 m"
    },
    correct: "B",
    explanation: "$1\\text{ meter} = 100\\text{ cm}$. Maka $400\\text{ cm} = 400 : 100 = 4\\text{ meter}$.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Hasil penjumlahan panjang dari $2\\text{ m} + 10\\text{ cm} = \\dots\\text{ cm}$.",
    options: {
      A: "12 cm",
      B: "20 cm",
      C: "210 cm",
      D: "201 cm"
    },
    correct: "C",
    explanation: "$2\\text{ m} = 200\\text{ cm}$. Maka $200\\text{ cm} + 10\\text{ cm} = 210\\text{ cm}$.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Diketahui tinggi pohon sebagai berikut:\n- Pohon pepaya = 2 m\n- Pohon jeruk = 75 cm\n- Pohon rambutan = 5 m\n\nUrutan pohon dari yang paling tinggi hingga terendah adalah ....",
    options: {
      A: "Pohon jeruk, pohon rambutan, pohon pepaya",
      B: "Pohon pepaya, pohon rambutan, pohon jeruk",
      C: "Pohon rambutan, pohon pepaya, pohon jeruk",
      D: "Pohon rambutan, pohon jeruk, pohon pepaya"
    },
    correct: "C",
    explanation: "Samakan satuan ke cm:\n- Rambutan: $5\\text{ m} = 500\\text{ cm}$\n- Pepaya: $2\\text{ m} = 200\\text{ cm}$\n- Jeruk: $75\\text{ cm}$\nUrutan tertinggi: Rambutan -> Pepaya -> Jeruk.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Rika mempunyai pita sepanjang 50 cm, Vita mempunyai pita sepanjang 1 meter, dan Rinda memiliki pita sepanjang 60 cm. Siapakah yang memiliki pita paling panjang?",
    options: {
      A: "Rika",
      B: "Vita",
      C: "Rinda",
      D: "Rinda dan Rika"
    },
    correct: "B",
    explanation: "Vita memiliki pita $1\\text{ m} = 100\\text{ cm}$, Rinda $60\\text{ cm}$, dan Rika $50\\text{ cm}$. Jadi yang paling panjang adalah pita milik Vita.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Perhatikan gambar jam dinding berikut ini!\n\nWaktu yang ditunjukkan oleh jarum jam pada gambar adalah ....",
    image: "/uploads/orion2025_mtka_q16_jam.png",
    options: {
      A: "Pukul 12.00",
      B: "Pukul 12.06",
      C: "Pukul 12.30",
      D: "Pukul 12.15"
    },
    correct: "C",
    explanation: "Jarum pendek berada di antara angka 12 dan 1, sedangkan jarum panjang tepat menunjuk ke angka 6 (30 menit). Jadi waktu menunjukkan pukul 12.30.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Kelapa mempunyai berat 2 kg, sedangkan semangka memiliki berat 4 kg. Maka buah kelapa .... daripada buah semangka.",
    options: {
      A: "Sama berat",
      B: "Lebih berat",
      C: "Lebih ringan",
      D: "Dua kali lebih berat"
    },
    correct: "C",
    explanation: "Karena $2\\text{ kg} < 4\\text{ kg}$, maka buah kelapa lebih ringan daripada buah semangka.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Bibi membeli buah melon yang beratnya 1 kg lebih 3 ons. Berapa ons berat melon tersebut? (Diketahui 1 kg = 10 ons)",
    options: {
      A: "13 ons",
      B: "15 ons",
      C: "150 ons",
      D: "8 ons"
    },
    correct: "A",
    explanation: "$1\\text{ kg} = 10\\text{ ons}$. Maka $10\\text{ ons} + 3\\text{ ons} = 13\\text{ ons}$.",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Anton mempunyai berat 40 kg, Sinta memiliki berat 35 kg, dan Rino mempunyai berat 45 kg. Di antara ketiga anak tersebut, yang memiliki berat badan paling berat adalah ....",
    options: {
      A: "Anton",
      B: "Sinta",
      C: "Rino",
      D: "Sinta dan Rino"
    },
    correct: "C",
    explanation: "Perbandingan berat badan: Rino (45 kg) > Anton (40 kg) > Sinta (35 kg). Jadi yang paling berat adalah Rino.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Perhatikan gambar berikut!\n\nBenda pada gambar di atas berbentuk bangun ruang ....",
    image: "/uploads/orion2025_mtka_q20_bola.png",
    options: {
      A: "Kubus",
      B: "Balok",
      C: "Kerucut",
      D: "Bola"
    },
    correct: "D",
    explanation: "Benda bulat pejal tanpa rusuk dan sudut tersebut adalah bangun ruang bola.",
    difficulty: "EASY"
  },
  {
    num: 21,
    question: "Saya tidur pada pukul 9 malam. Penulisan tanda waktu 24 jam untuk pukul 9 malam adalah ....",
    options: {
      A: "09.00",
      B: "21.00",
      C: "10.00",
      D: "12.00"
    },
    correct: "B",
    explanation: "Dalam format waktu 24 jam, setelah pukul 12 siang dihitung $12 + 9 = 21.00$.",
    difficulty: "EASY"
  },
  {
    num: 22,
    question: "Ayah mempunyai 135 lembar kertas. Dia menggunakan 86 lembar kertas untuk menulis surat. Kemudian ayah membeli lagi 125 lembar kertas. Berapa lembar kertas yang dimiliki Ayah sekarang?",
    options: {
      A: "176",
      B: "174",
      C: "185",
      D: "184"
    },
    correct: "B",
    explanation: "Jumlah kertas = $135 - 86 + 125 = 49 + 125 = 174\\text{ lembar}$.",
    difficulty: "EASY"
  },
  {
    num: 23,
    question: "Andi memiliki 29 balon. Doni mempunyai balon lebih banyak 25 buah dari balon Andi. Berapa jumlah seluruh balon Andi dan Doni jika digabungkan?",
    options: {
      A: "54",
      B: "84",
      C: "83",
      D: "93"
    },
    correct: "C",
    explanation: "Balon Andi = 29. Balon Doni = $29 + 25 = 54$. Total balon = $29 + 54 = 83\\text{ balon}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "Rini akan pergi ke Surabaya pukul 10.30 menaiki bus dari Kota Malang. Lama perjalanan adalah 2 jam. Pukul berapa Rini sampai di Surabaya?",
    options: {
      A: "12.30",
      B: "13.00",
      C: "14.30",
      D: "21.00"
    },
    correct: "A",
    explanation: "Waktu tiba = $10.30 + 02.00 = 12.30$.",
    difficulty: "EASY"
  },
  {
    num: 25,
    question: "Ahmad memiliki 87 butir kelereng. Dia membeli 16 butir kelereng lagi di toko. Ketika digunakan untuk bermain bersama teman-temannya, kelereng Ahmad hilang 15 butir. Berapa butir kelereng Ahmad sekarang?",
    options: {
      A: "87",
      B: "89",
      C: "88",
      D: "86"
    },
    correct: "C",
    explanation: "Kelereng Ahmad = $87 + 16 - 15 = 87 + 1 = 88\\text{ butir}$.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Kereta api berangkat pukul 08.30 dari Stasiun A dan tiba di Stasiun B pukul 10.30. Lama waktu tempuh perjalanan kereta api adalah ....",
    options: {
      A: "2 jam",
      B: "5 jam",
      C: "3 jam",
      D: "1 jam"
    },
    correct: "A",
    explanation: "Lama waktu tempuh = $10.30 - 08.30 = 2\\text{ jam}$.",
    difficulty: "EASY"
  },
  {
    num: 27,
    question: "Rika mempunyai pita sepanjang 275 cm, sedangkan Vita mempunyai pita lebih pendek 19 cm dari pita Rika. Panjang pita milik Vita adalah ....",
    options: {
      A: "255 cm",
      B: "257 cm",
      C: "256 cm",
      D: "294 cm"
    },
    correct: "C",
    explanation: "Panjang pita Vita = $275 - 19 = 256\\text{ cm}$.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Ibu mempunyai 148 butir telur. Dia menggunakan 99 butir telur untuk membuat kue pesanan. Kemudian Ibu membeli lagi 36 butir telur. Berapa butir telur yang dimiliki Ibu sekarang?",
    options: {
      A: "85 butir",
      B: "67 butir",
      C: "58 butir",
      D: "95 butir"
    },
    correct: "A",
    explanation: "Sisa telur = $148 - 99 + 36 = 49 + 36 = 85\\text{ butir}$.",
    difficulty: "EASY"
  },
  {
    num: 29,
    question: "Ani lahir pada bulan ke-3 (Maret). Sedangkan Riska lahir 5 bulan setelah Ani. Pada bulan apakah Riska lahir?",
    options: {
      A: "April",
      B: "Mei",
      C: "Agustus",
      D: "September"
    },
    correct: "C",
    explanation: "Bulan ke-3 adalah Maret. $3 + 5 = 8$, yaitu bulan ke-8 (Agustus).",
    difficulty: "EASY"
  },
  {
    num: 30,
    question: "Perhatikan gambar bangun datar nomor 2 berikut!\n\nNama bangun datar bernomor 2 pada gambar adalah ....",
    image: "/uploads/orion2025_mtka_q30_trapesium.png",
    options: {
      A: "Segitiga",
      B: "Trapesium",
      C: "Segienam",
      D: "Segilima"
    },
    correct: "B",
    explanation: "Bangun datar nomor 2 memiliki sepasang sisi sejajar yang tidak sama panjang, yaitu bangun datar trapesium.",
    difficulty: "EASY"
  },
  {
    num: 31,
    question: "Diketahui berat hewan ternak:\n- Kuda = 395 kg\n- Kambing = 59 kg\n- Sapi = 495 kg\n- Harimau = 359 kg\n\nHewan apakah yang memiliki bobot tubuh paling berat?",
    options: {
      A: "Kuda",
      B: "Sapi",
      C: "Kambing",
      D: "Harimau"
    },
    correct: "B",
    explanation: "Perbandingan: Sapi (495 kg) > Kuda (395 kg) > Harimau (359 kg) > Kambing (59 kg). Jadi yang paling berat adalah Sapi.",
    difficulty: "EASY"
  },
  {
    num: 32,
    question: "Berikut data waktu kelahiran empat orang anak:\n- Made lahir bulan Maret 2014\n- Nyoman lahir bulan Juli 2014\n- Ketut lahir bulan Februari 2014\n- Kadek lahir bulan Agustus 2014\n\nSiapakah anak yang paling muda dari keempat anak tersebut?",
    options: {
      A: "Made",
      B: "Nyoman",
      C: "Ketut",
      D: "Kadek"
    },
    correct: "D",
    explanation: "Anak yang paling muda adalah yang tanggal lahirnya paling akhir. Karena Kadek lahir pada bulan Agustus 2014 (paling akhir di antara keempatnya), maka Kadek adalah yang paling muda.",
    difficulty: "EASY"
  },
  {
    num: 33,
    question: "Nama bilangan lambang angka 745 yang benar adalah ....",
    options: {
      A: "Tujuh ratus empat puluh lima",
      B: "Tujuh ratus lima",
      C: "Tujuh ratus empat puluh dan lima",
      D: "Tujuh puluh empat ratus lima"
    },
    correct: "A",
    explanation: "Lambang 745 dibaca secara baku adalah 'tujuh ratus empat puluh lima'.",
    difficulty: "EASY"
  },
  {
    num: 34,
    question: "Sekarang waktu menunjukkan pukul 08.00. Dua puluh menit yang akan datang waktu menunjukkan pukul ....",
    options: {
      A: "08.10",
      B: "10.20",
      C: "08.20",
      D: "08.40"
    },
    correct: "C",
    explanation: "$08.00 + 00.20 = 08.20$.",
    difficulty: "EASY"
  },
  {
    num: 35,
    question: "Toni mempunyai 175 butir kelereng. Dia kehilangan 116 butir kelereng di perjalanan pulang sekolah. Berapa butir sisa kelereng yang dimiliki Toni sekarang?",
    options: {
      A: "58",
      B: "57",
      C: "56",
      D: "59"
    },
    correct: "D",
    explanation: "Sisa kelereng = $175 - 116 = 59\\text{ butir}$.",
    difficulty: "EASY"
  },
  {
    num: 36,
    question: "Perhatikan gambar pecahan uang kertas berikut!\n\nRini memiliki 1 lembar uang seribuan dan 1 lembar uang sepuluh ribuan. Berapa total nilai nominal uang Rini seluruhnya?",
    image: "/uploads/orion2025_mtka_q36_uang.png",
    options: {
      A: "Rp 7.000,00",
      B: "Rp 12.000,00",
      C: "Rp 11.000,00",
      D: "Rp 10.000,00"
    },
    correct: "C",
    explanation: "Total uang = $\\text{Rp } 1.000,00 + \\text{Rp } 10.000,00 = \\text{Rp } 11.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 37,
    question: "Ayah mempunyai 2 buah kolam ikan. Masing-masing kolam berisi 20 ekor ikan gurami. Berapa total seluruh ikan gurami milik ayah?",
    options: {
      A: "22 ekor",
      B: "24 ekor",
      C: "26 ekor",
      D: "40 ekor"
    },
    correct: "D",
    explanation: "Total ikan = $2\\text{ kolam} \\times 20\\text{ ekor} = 40\\text{ ekor}$.",
    difficulty: "EASY"
  },
  {
    num: 38,
    question: "Perhatikan gambar neraca timbangan berikut ini!\n\nBerdasarkan posisi lengan timbangan yang miring pada gambar, pernyataan yang benar adalah ....",
    image: "/uploads/orion2025_mtka_q38_radio.png",
    options: {
      A: "Radio sama berat dengan 3 buah apel",
      B: "Radio lebih berat dari 3 buah apel",
      C: "Radio lebih ringan dari 3 buah apel",
      D: "3 buah apel lebih berat dari radio"
    },
    correct: "B",
    explanation: "Piringan timbangan yang memuat radio berada di posisi lebih rendah (turun) ke bawah, yang membuktikan bahwa radio lebih berat daripada 3 buah apel.",
    difficulty: "EASY"
  },
  {
    num: 39,
    question: "Seekor ikan hasil tangkapan memiliki berat 3 kg. Berapa ons berat ikan tersebut? (Diketahui 1 kg = 10 ons)",
    options: {
      A: "13 ons",
      B: "16 ons",
      C: "30 ons",
      D: "33 ons"
    },
    correct: "C",
    explanation: "$1\\text{ kg} = 10\\text{ ons}$. Maka $3\\text{ kg} = 3 \\times 10 = 30\\text{ ons}$.",
    difficulty: "EASY"
  },
  {
    num: 40,
    question: "Perhatikan diagram batang hobi olahraga siswa berikut ini!\n\nBerdasarkan diagram di atas, berapakah jumlah seluruh anak yang menyukai olahraga sepak bola dan bola voli?",
    image: "/uploads/orion2025_mtka_q40_diagram.png",
    options: {
      A: "60 anak",
      B: "90 anak",
      C: "80 anak",
      D: "30 anak"
    },
    correct: "B",
    explanation: "Berdasarkan diagram batang:\n- Sepak bola = 60 anak\n- Bola voli = 30 anak\nJumlah total = $60 + 30 = 90\\text{ anak}$.",
    difficulty: "EASY"
  }
];

const ORION_MTK_LEVEL_B: QuestionItem[] = [
  {
    num: 1,
    question: "Sudut yang dibentuk antara kedua jarum pendek dan jarum panjang pada pukul 16.00 membentuk sudut jenis ....",
    options: {
      A: "Tumpul",
      B: "Siku-siku",
      C: "Lancip",
      D: "Lurus (180°)"
    },
    correct: "A",
    explanation: "Pada pukul 16.00, jarum panjang menunjuk ke angka 12 dan jarum pendek ke angka 4. Sudut yang terbentuk = $4 \\times 30^\\circ = 120^\\circ$. Karena besarnya antara $90^\\circ$ dan $180^\\circ$, sudut tersebut adalah sudut tumpul.",
    difficulty: "EASY"
  },
  {
    num: 2,
    question: "Andini sedang membaca buku untuk membuat tugas sekolah. Ternyata dua halaman yang terbuka dan saling berhadapan jika dijumlahkan bernilai 125. Berapakah nomor halaman berikutnya setelah halaman yang terbuka tersebut?",
    options: {
      A: "64",
      B: "66",
      C: "65",
      D: "67"
    },
    correct: "A",
    explanation: "Dua halaman berhadapan bernomor $x$ dan $x+1$. Maka $x + (x+1) = 125 \\Rightarrow 2x = 124 \\Rightarrow x = 62$. Jadi halaman yang terbuka adalah 62 dan 63. Nomor halaman berikutnya setelah 63 adalah 64.",
    difficulty: "MEDIUM"
  },
  {
    num: 3,
    question: "Sepanjang jalan 'Madura' setiap rumah diberi nomor urut dari 1 sampai 150. Berapa banyak nomor rumah yang memuat angka 8?",
    options: {
      A: "27",
      B: "25",
      C: "26",
      D: "24"
    },
    correct: "D",
    explanation: "Nomor yang memuat angka 8:\n- Satuan 8: 8, 18, 28, 38, 48, 58, 68, 78, 88, 98, 108, 118, 128, 138, 148 (15 nomor)\n- Puluhan 8: 80, 81, 82, 83, 84, 85, 86, 87, 89 (9 nomor baru, 88 sudah dihitung)\nTotal = $15 + 9 = 24$ nomor.",
    difficulty: "HARD"
  },
  {
    num: 4,
    question: "Jumlah dua bilangan sama dengan 21. Salah satu bilangan tersebut 3 kurangnya dari bilangan yang lebih besar. Hasil kali kedua bilangan tersebut adalah ....",
    options: {
      A: "162",
      B: "86",
      C: "108",
      D: "68"
    },
    correct: "C",
    explanation: "Misalkan kedua bilangan adalah $a$ dan $b$ ($a > b$).\n$a + b = 21$ dan $a - b = 3$.\nJumlahkan: $2a = 24 \\Rightarrow a = 12, b = 9$.\nHasil kali = $12 \\times 9 = 108$.",
    difficulty: "MEDIUM"
  },
  {
    num: 5,
    question: "Dita mempunyai pensil sebanyak 12 kotak. Setiap kotak berisi 36 pensil. Jumlah seluruh pensil milik Dita adalah ....",
    options: {
      A: "24 pensil",
      B: "144 pensil",
      C: "72 pensil",
      D: "432 pensil"
    },
    correct: "D",
    explanation: "Total pensil = $12 \\times 36 = 432\\text{ pensil}$.",
    difficulty: "EASY"
  },
  {
    num: 6,
    question: "Jumlah kelereng Bima ($B$) adalah 5 butir lebih sedikit dari dua kali jumlah kelereng milik Anton ($A$). Bentuk persamaan matematika yang benar dari pernyataan tersebut adalah ....",
    options: {
      A: "$B = 2A - 10$",
      B: "$B = 2A - 5$",
      C: "$2A = 5 - B$",
      D: "$B = 5 - 2A$"
    },
    correct: "B",
    explanation: "Dua kali kelereng Anton = $2A$. Lima lebih sedikit dari dua kali Anton = $2A - 5$. Maka $B = 2A - 5$.",
    difficulty: "EASY"
  },
  {
    num: 7,
    question: "Waktu yang diperlukan Reza untuk berlari mengelilingi lapangan adalah 7 menit 13 detik, sedangkan Jonathan membutuhkan waktu 6 menit 35 detik. Berapa detik lebih cepat waktu tempuh Jonathan dibandingkan Reza?",
    options: {
      A: "38 detik",
      B: "42 detik",
      C: "48 detik",
      D: "22 detik"
    },
    correct: "A",
    explanation: "Ubah ke detik:\n- Reza = $(7 \\times 60) + 13 = 433\\text{ detik}$\n- Jonathan = $(6 \\times 60) + 35 = 395\\text{ detik}$\nSelisih = $433 - 395 = 38\\text{ detik}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 8,
    question: "Sebuah trapesium mempunyai luas $28\\text{ cm}^2$. Jika jumlah panjang kedua sisi yang sejajar adalah $4\\text{ cm}$, maka tinggi trapesium tersebut adalah ....",
    options: {
      A: "12 cm",
      B: "13 cm",
      C: "14 cm",
      D: "15 cm"
    },
    correct: "C",
    explanation: "Rumus luas trapesium: $L = \\frac{(a+b) \\times t}{2}$.\n$28 = \\frac{4 \\times t}{2} \\Rightarrow 28 = 2t \\Rightarrow t = 14\\text{ cm}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 9,
    question: "Bentuk persentase dari pecahan $\\frac{2}{5}$ adalah ....",
    options: {
      A: "20%",
      B: "30%",
      C: "40%",
      D: "50%"
    },
    correct: "C",
    explanation: "$\\frac{2}{5} \\times 100\\% = \\frac{200}{5}\\% = 40\\%$.",
    difficulty: "EASY"
  },
  {
    num: 10,
    question: "Dhani memiliki seutas senar pancing. Sepanjang $\\frac{1}{8}$ bagian berwarna biru, $\\frac{2}{3}$ bagian berwarna merah, dan sisanya sepanjang 5 cm tidak berwarna. Berapakah panjang total senar tersebut?",
    options: {
      A: "16 cm",
      B: "14 cm",
      C: "21 cm",
      D: "24 cm"
    },
    correct: "D",
    explanation: "Bagian berwarna = $\\frac{1}{8} + \\frac{2}{3} = \\frac{3}{24} + \\frac{16}{24} = \\frac{19}{24}$.\nSisa bagian = $1 - \\frac{19}{24} = \\frac{5}{24}$.\n$\\frac{5}{24} \\times L = 5\\text{ cm} \\Rightarrow L = 5 \\times \\frac{24}{5} = 24\\text{ cm}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 11,
    question: "Ibu berbelanja kebutuhan dapur: 2 liter minyak goreng @ Rp 12.500,00; 3 kg telur @ Rp 11.750,00; 5 kg beras @ Rp 9.500,00; dan 2 kg gula pasir @ Rp 14.700,00. Jika Ibu membayar dengan 4 lembar uang lima puluh ribuan, berapa rupiah uang kembalian yang diterima Ibu?",
    options: {
      A: "Rp 200.000,00",
      B: "Rp 137.150,00",
      C: "Rp 62.850,00",
      D: "Rp 25.000,00"
    },
    correct: "C",
    explanation: "Total belanja:\n- Minyak: $2 \\times 12.500 = 25.000$\n- Telur: $3 \\times 11.750 = 35.250$\n- Beras: $5 \\times 9.500 = 47.500$\n- Gula: $2 \\times 14.700 = 29.400$\nTotal belanja = Rp 137.150,00.\nUang Ibu = $4 \\times 50.000 = \\text{Rp } 200.000,00$.\nKembalian = $200.000 - 137.150 = \\text{Rp } 62.850,00$.",
    difficulty: "MEDIUM"
  },
  {
    num: 12,
    question: "Faktor Persekutuan Terbesar (FPB) dari bilangan 125, 240, dan 375 adalah ....",
    options: {
      A: "10",
      B: "25",
      C: "5",
      D: "15"
    },
    correct: "C",
    explanation: "Faktorisasi prima:\n- $125 = 5^3$\n- $240 = 2^4 \\times 3 \\times 5$\n- $375 = 3 \\times 5^3$\nFaktor prima yang sama berpangkat terkecil adalah 5. Jadi $\\text{FPB} = 5$.",
    difficulty: "EASY"
  },
  {
    num: 13,
    question: "Besar sudut satu per lima ($\\frac{1}{5}$) putaran penuh adalah ....",
    options: {
      A: "60°",
      B: "72°",
      C: "45°",
      D: "90°"
    },
    correct: "B",
    explanation: "Satu putaran penuh = $360^\\circ$.\n$\\frac{1}{5} \\times 360^\\circ = 72^\\circ$.",
    difficulty: "EASY"
  },
  {
    num: 14,
    question: "Aku adalah sebuah bilangan. Jika aku dikalikan 12 kemudian hasilnya dikurangi 8 menghasilkan bilangan 64. Bilangan berapakah aku?",
    options: {
      A: "5",
      B: "6",
      C: "7",
      D: "8"
    },
    correct: "B",
    explanation: "$12x - 8 = 64 \\Rightarrow 12x = 72 \\Rightarrow x = \\frac{72}{12} = 6$.",
    difficulty: "EASY"
  },
  {
    num: 15,
    question: "Jumlah ayam Paman adalah $\\frac{3}{5}$ dari jumlah ayam Ayah. Jika Ayah memiliki 60 ekor ayam, berapakah jumlah ayam milik Paman?",
    options: {
      A: "30 ekor",
      B: "60 ekor",
      C: "36 ekor",
      D: "12 ekor"
    },
    correct: "C",
    explanation: "Ayam Paman = $\\frac{3}{5} \\times 60 = 3 \\times 12 = 36\\text{ ekor}$.",
    difficulty: "EASY"
  },
  {
    num: 16,
    question: "Usia seekor bayi kelinci sekarang adalah 154 hari. Berapa minggu yang lalu bayi kelinci tersebut dilahirkan?",
    options: {
      A: "22 minggu",
      B: "23 minggu",
      C: "21 minggu",
      D: "20 minggu"
    },
    correct: "A",
    explanation: "1 minggu = 7 hari.\n$154 : 7 = 22\\text{ minggu}$.",
    difficulty: "EASY"
  },
  {
    num: 17,
    question: "Ibu mengatakan akan kembali ke rumah setelah 4 jam 15 menit. Jika Ibu berangkat pada pukul 07.30, maka Ibu diperkirakan pulang pada pukul ....",
    options: {
      A: "10.30",
      B: "11.45",
      C: "12.00",
      D: "12.30"
    },
    correct: "B",
    explanation: "Waktu tiba = $07.30 + 04.15 = 11.45$.",
    difficulty: "EASY"
  },
  {
    num: 18,
    question: "Ibu membeli gula sebanyak 5 kg, lalu Bibi memberi Ibu tambahan gula sebanyak 15 kg. Berapa ons total seluruh gula yang dimiliki Ibu sekarang?",
    options: {
      A: "0,2 ons",
      B: "2 ons",
      C: "20 ons",
      D: "200 ons"
    },
    correct: "D",
    explanation: "Total gula = $5\\text{ kg} + 15\\text{ kg} = 20\\text{ kg}$.\nKarena $1\\text{ kg} = 10\\text{ ons}$, maka $20\\text{ kg} = 20 \\times 10 = 200\\text{ ons}$.",
    difficulty: "EASY"
  },
  {
    num: 19,
    question: "Ibu membeli 3 kg telur dan 2 kg tepung. Harga 1 kg telur adalah Rp 21.000,00 dan harga 1 kg tepung adalah Rp 9.000,00. Total uang yang harus dibayarkan Ibu adalah ....",
    options: {
      A: "Rp 51.000,00",
      B: "Rp 61.000,00",
      C: "Rp 71.000,00",
      D: "Rp 81.000,00"
    },
    correct: "D",
    explanation: "Total belanja = $(3 \\times 21.000) + (2 \\times 9.000) = 63.000 + 18.000 = \\text{Rp } 81.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 20,
    question: "Pernyataan perbandingan antarpecahan berikut bernilai benar, KECUALI ....",
    options: {
      A: "$\\frac{4}{9}$ lebih besar dari $\\frac{4}{7}$",
      B: "$\\frac{5}{10}$ lebih kecil dari $\\frac{5}{8}$",
      C: "$\\frac{6}{12}$ lebih besar dari $\\frac{6}{16}$",
      D: "$\\frac{9}{25}$ lebih kecil dari $\\frac{9}{2}$"
    },
    correct: "A",
    explanation: "Untuk pembilang yang sama, pecahan dengan penyebut lebih kecil bernilai lebih besar. Jadi $\\frac{4}{7} > \\frac{4}{9}$. Pernyataan A yang menyatakan $\\frac{4}{9} > \\frac{4}{7}$ adalah salah.",
    difficulty: "MEDIUM"
  },
  {
    num: 21,
    question: "Diketahui sebuah bangun balok memiliki panjang total seluruh rusuknya 152 cm. Jika perbandingan ukuran panjang : lebar : tingginya adalah $8 : 6 : 5$, berapakah luas permukaan balok tersebut?",
    options: {
      A: "$488\\text{ cm}^2$",
      B: "$522\\text{ cm}^2$",
      C: "$672\\text{ cm}^2$",
      D: "$944\\text{ cm}^2$"
    },
    correct: "D",
    explanation: "Panjang seluruh rusuk balok: $4(p + l + t) = 152 \\Rightarrow p + l + t = 38\\text{ cm}$.\nTotal bagian rasio: $8 + 6 + 5 = 19$.\nNilai 1 bagian = $38 : 19 = 2\\text{ cm}$.\n- $p = 8 \\times 2 = 16\\text{ cm}$\n- $l = 6 \\times 2 = 12\\text{ cm}$\n- $t = 5 \\times 2 = 10\\text{ cm}$\nLuas permukaan = $2(pl + pt + lt) = 2(16\\times 12 + 16\\times 10 + 12\\times 10) = 2(192 + 160 + 120) = 2(472) = 944\\text{ cm}^2$.",
    difficulty: "HARD"
  },
  {
    num: 22,
    question: "Kakek memiliki kolam lele berbentuk balok yang diisi air dengan debit $160\\text{ m}^3/\\text{jam}$. Setelah 30 menit, kolam tersebut terisi penuh. Jika lebar kolam 4 meter dan tinggi kolam 2 meter (atau terisi air), maka panjang kolam kakek adalah .... meter.",
    options: {
      A: "6",
      B: "8",
      C: "10",
      D: "12"
    },
    correct: "C",
    explanation: "Waktu = 30 menit = 0,5 jam.\nVolume total = $160\\text{ m}^3/\\text{jam} \\times 0,5\\text{ jam} = 80\\text{ m}^3$.\n$V = p \\times l \\times t \\Rightarrow 80 = p \\times 4 \\times 2 \\Rightarrow 80 = 8p \\Rightarrow p = 10\\text{ meter}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 23,
    question: "Monika memiliki 48 pisang, 32 apel, dan 56 jeruk. Buah tersebut akan dibagikan ke tetangganya sama rata ke dalam sejumlah parsel buah identik. Banyak buah pisang, apel, dan jeruk dalam setiap parsel adalah ....",
    options: {
      A: "Pisang 6 buah; apel 4 buah; jeruk 7 buah",
      B: "Pisang 4 buah; apel 6 buah; jeruk 7 buah",
      C: "Pisang 6 buah; apel 4 buah; jeruk 9 buah",
      D: "Pisang 8 buah; apel 6 buah; jeruk 4 buah"
    },
    correct: "A",
    explanation: "Cari FPB(48, 32, 56) = 8 parsel.\nIsi tiap parsel:\n- Pisang: $48 : 8 = 6\\text{ buah}$\n- Apel: $32 : 8 = 4\\text{ buah}$\n- Jeruk: $56 : 8 = 7\\text{ buah}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 24,
    question: "Perhatikan gambar wadah kerucut di dalam tabung berikut ini!\n\nSebuah wadah kerucut berdiameter 42 cm dimasukkan ke dalam tabung berdiameter sama (tinggi 50 cm). Lalu ruang kosong di luar kerucut diisi pasir hingga penuh. Jika tiap $1\\text{ cm}^3$ pasir berbobot 2 gram, maka total berat pasir dalam tabung adalah ....",
    image: "/uploads/orion2025_mtkb_q24_tabung_kerucut.png",
    options: {
      A: "78,6 kg",
      B: "86,7 kg",
      C: "92,4 kg",
      D: "102,6 kg"
    },
    correct: "C",
    explanation: "Jari-jari $r = 21\\text{ cm}$, tinggi $t = 50\\text{ cm}$.\nVolume ruang kosong = Volume tabung - Volume kerucut = $\\frac{2}{3} \\pi r^2 t$.\n$V = \\frac{2}{3} \\times \\frac{22}{7} \\times 21 \\times 21 \\times 50 = \\frac{2}{3} \\times 66 \\times 21 \\times 50 = 44 \\times 1.050 = 46.200\\text{ cm}^3$.\nBerat pasir = $46.200 \\times 2\\text{ gram} = 92.400\\text{ gram} = 92,4\\text{ kg}$.",
    difficulty: "HARD"
  },
  {
    num: 25,
    question: "Kiki membeli perlengkapan sekolah: sepatu seharga Rp 98.500,00; tas sekolah Rp 73.000,00; dan kaos kaki Rp 15.500,00. Taksiran uang ke puluhan ribu terdekat yang harus dibawa Ibu untuk membeli perlengkapan tersebut adalah ....",
    options: {
      A: "Rp 170.000,00",
      B: "Rp 180.000,00",
      C: "Rp 190.000,00",
      D: "Rp 200.000,00"
    },
    correct: "C",
    explanation: "Total harga belanjaan = $98.500 + 73.000 + 15.500 = \\text{Rp } 187.000,00$. Taksiran pembulatan ke puluhan ribu terdekat di atasnya agar cukup membeli adalah Rp 190.000,00.",
    difficulty: "EASY"
  },
  {
    num: 26,
    question: "Sekelompok pendaki gunung terdiri dari 40 pria dan 28 wanita. Mereka akan dibagi menjadi beberapa kelompok dengan komposisi pria dan wanita yang sama banyak. Jumlah pendaki putri pada setiap kelompok adalah ....",
    options: {
      A: "4 orang",
      B: "7 orang",
      C: "10 orang",
      D: "14 orang"
    },
    correct: "B",
    explanation: "FPB(40, 28) = 4 kelompok.\nBanyak pendaki putri tiap kelompok = $28 : 4 = 7\\text{ orang}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 27,
    question: "Bilangan yang memiliki bentuk faktorisasi prima $2^4 \\times 3^2 \\times 5 \\times 7$ adalah ....",
    options: {
      A: "420",
      B: "1.680",
      C: "3.780",
      D: "5.040"
    },
    correct: "D",
    explanation: "$2^4 \\times 3^2 \\times 5 \\times 7 = 16 \\times 9 \\times 35 = 144 \\times 35 = 5.040$.",
    difficulty: "EASY"
  },
  {
    num: 28,
    question: "Nilai akar kuadrat dari $\\sqrt{2.916}$ adalah ....",
    options: {
      A: "34",
      B: "44",
      C: "54",
      D: "64"
    },
    correct: "C",
    explanation: "Karena $50^2 = 2.500$ dan $60^2 = 3.600$, serta angka satuan 6 berasal dari $4^2$ atau $6^2$, kita uji $54 \\times 54 = 2.916$. Jadi $\\sqrt{2.916} = 54$.",
    difficulty: "MEDIUM"
  },
  {
    num: 29,
    question: "Hasil perhitungan dari $(15 + 14)^3 - 19^2 - \\sqrt[3]{15.625}$ adalah ....",
    options: {
      A: "24.000",
      B: "24.003",
      C: "30.006",
      D: "30.007"
    },
    correct: "B",
    explanation: "- $(15+14)^3 = 29^3 = 24.389$\n- $19^2 = 361$\n- $\\sqrt[3]{15.625} = 25$\nHasil = $24.389 - 361 - 25 = 24.003$.",
    difficulty: "HARD"
  },
  {
    num: 30,
    question: "Hasil operasi hitung pecahan $4\\frac{3}{4} - 3\\frac{3}{5} + \\frac{5}{6}$ adalah ....",
    options: {
      A: "$2\\frac{7}{30}$",
      B: "$3\\frac{7}{30}$",
      C: "$4\\frac{7}{15}$",
      D: "$1\\frac{59}{60}$"
    },
    correct: "D",
    explanation: "Samakan penyebut ke KPK(4, 5, 6) = 60:\n$4\\frac{45}{60} - 3\\frac{36}{60} + \\frac{50}{60} = (4-3) + \\frac{45 - 36 + 50}{60} = 1 + \\frac{59}{60} = 1\\frac{59}{60}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 31,
    question: "Jika $\\frac{3}{8} + \\frac{1}{5} = n - \\frac{1}{5}$, maka nilai $n$ yang memenuhi adalah ....",
    options: {
      A: "$\\frac{27}{40}$",
      B: "$\\frac{29}{40}$",
      C: "$\\frac{31}{40}$",
      D: "$1\\frac{3}{40}$"
    },
    correct: "C",
    explanation: "$n = \\frac{3}{8} + \\frac{1}{5} + \\frac{1}{5} = \\frac{3}{8} + \\frac{2}{5} = \\frac{15 + 16}{40} = \\frac{31}{40}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 32,
    question: "Pak Kurdi mempunyai sepetak tanah. Sebanyak $\\frac{3}{8}$ bagian ditanami bayam, $\\frac{1}{4}$ bagian ditanami cabai, dan sisanya ditanami ketela pohon. Bagian tanah yang ditanami ketela pohon adalah ....",
    options: {
      A: "$\\frac{1}{8}$ bagian",
      B: "$\\frac{1}{4}$ bagian",
      C: "$\\frac{3}{8}$ bagian",
      D: "$\\frac{1}{2}$ bagian"
    },
    correct: "C",
    explanation: "Tanah terpakai = $\\frac{3}{8} + \\frac{1}{4} = \\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}$ bagian.\nSisa untuk ketela pohon = $1 - \\frac{5}{8} = \\frac{3}{8}$ bagian.",
    difficulty: "EASY"
  },
  {
    num: 33,
    question: "Eki membeli pita merah sepanjang 1,75 meter, pita kuning $1\\frac{1}{2}$ meter, dan pita hijau sepanjang 0,5 meter. Setelah selesai membuat prakarya, ternyata masih tersisa pita merah sepanjang 0,3 meter. Total panjang pita yang terpakai untuk prakarya adalah ....",
    options: {
      A: "3,72 meter",
      B: "3,45 meter",
      C: "2,72 meter",
      D: "2,45 meter"
    },
    correct: "B",
    explanation: "- Pita merah terpakai = $1,75 - 0,3 = 1,45\\text{ m}$\n- Pita kuning terpakai = $1,5\\text{ m}$\n- Pita hijau terpakai = $0,5\\text{ m}$\nTotal = $1,45 + 1,5 + 0,5 = 3,45\\text{ meter}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 34,
    question: "Urutan pecahan berikut dari yang terbesar adalah:\n$$\\frac{11}{25};\\; 0,72;\\; 83\\%;\\; 0,627$$",
    options: {
      A: "$83\\%;\\; 0,72;\\; 0,627;\\; \\frac{11}{25}$",
      B: "$\\frac{11}{25};\\; 0,72;\\; 83\\%;\\; 0,627$",
      C: "$\\frac{11}{25};\\; 0,627;\\; 0,72;\\; 83\\%$",
      D: "$0,627;\\; \\frac{11}{25};\\; 0,72;\\; 83\\%$"
    },
    correct: "A",
    explanation: "Ubah semua pecahan ke desimal:\n- $83\\% = 0,830$\n- $0,72 = 0,720$\n- $0,627$\n- $\\frac{11}{25} = 0,440$\nUrutan dari yang terbesar: $83\\% > 0,72 > 0,627 > \\frac{11}{25}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 35,
    question: "Gadhisa membeli tas baru seharga Rp 150.000,00. Di rak toko tertera potongan diskon sebesar 20%. Uang yang harus dibayarkan Gadhisa ke kasir adalah ....",
    options: {
      A: "Rp 140.000,00",
      B: "Rp 135.000,00",
      C: "Rp 130.000,00",
      D: "Rp 120.000,00"
    },
    correct: "D",
    explanation: "Besar diskon = $20\\% \\times 150.000 = \\text{Rp } 30.000,00$.\nUang yang dibayar = $150.000 - 30.000 = \\text{Rp } 120.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 36,
    question: "Prita membeli sekotak pensil seharga Rp 25.000,00. Pensil tersebut dijual kembali dan ia memperoleh keuntungan 20%. Besar keuntungan uang yang didapatkan Prita adalah ....",
    options: {
      A: "Rp 500,00",
      B: "Rp 1.500,00",
      C: "Rp 3.000,00",
      D: "Rp 5.000,00"
    },
    correct: "D",
    explanation: "Keuntungan = $20\\% \\times 25.000 = \\frac{20}{100} \\times 25.000 = \\text{Rp } 5.000,00$.",
    difficulty: "EASY"
  },
  {
    num: 37,
    question: "Perbandingan panjang pita merah dengan biru adalah $3 : 4$, sedangkan perbandingan panjang pita biru dan kuning adalah $5 : 7$. Jika panjang pita kuning adalah 224 meter, maka panjang pita merah adalah .... meter.",
    options: {
      A: "90",
      B: "110",
      C: "120",
      D: "150"
    },
    correct: "C",
    explanation: "Samakan perbandingan pita biru (KPK 4 dan 5 = 20):\n- Merah : Biru = $15 : 20$\n- Biru : Kuning = $20 : 28$\nMerah : Biru : Kuning = $15 : 20 : 28$.\nPanjang kuning = 224 m $\\Rightarrow 1\\text{ bagian} = 224 : 28 = 8\\text{ meter}$.\nPanjang merah = $15 \\times 8 = 120\\text{ meter}$.",
    difficulty: "HARD"
  },
  {
    num: 38,
    question: "Perbandingan persediaan gula pasir, beras, dan tepung di Toko Sempurna adalah $4 : 8 : 7$. Jika jumlah beras dan tepung adalah 75 kg, maka banyak stok gula pasir adalah .... kg.",
    options: {
      A: "5",
      B: "10",
      C: "15",
      D: "20"
    },
    correct: "D",
    explanation: "Perbandingan Beras + Tepung = $8 + 7 = 15\\text{ bagian}$.\nNilai 1 bagian = $75 : 15 = 5\\text{ kg}$.\nBanyak gula pasir = $4 \\times 5 = 20\\text{ kg}$.",
    difficulty: "MEDIUM"
  },
  {
    num: 39,
    question: "Jarum jam yang membentuk sudut lancip (kurang dari 90°) terbentuk pada waktu ....",
    options: {
      A: "Pukul 10.05",
      B: "Pukul 09.05",
      C: "Pukul 08.05",
      D: "Pukul 07.05"
    },
    correct: "A",
    explanation: "Pada pukul 10.05, jarum panjang berada di angka 1 ($30^\\circ$). Jarum pendek di angka $10 + \\frac{5}{60} = 10\\frac{1}{12}$, membentuk sudut $302,5^\\circ$. Selisih sudut kecil = $360^\\circ - 302,5^\\circ + 30^\\circ = 87,5^\\circ$. Karena $87,5^\\circ < 90^\\circ$, sudut yang terbentuk adalah sudut lancip.",
    difficulty: "HARD"
  },
  {
    num: 40,
    question: "Besar sudut perputaran jarum menit jam dinding dari pukul 11.05 sampai dengan 11.24 adalah ....",
    options: {
      A: "120°",
      B: "119°",
      C: "115°",
      D: "114°"
    },
    correct: "D",
    explanation: "Lama perputaran menit = $24 - 5 = 19\\text{ menit}$.\nSetiap 1 menit perputaran sudut jarum menit adalah $\\frac{360^\\circ}{60} = 6^\\circ$.\nBesar sudut = $19 \\times 6^\\circ = 114^\\circ$.",
    difficulty: "MEDIUM"
  }
];

// =========================================================================
// RUNNER IMPORT KE SUPABASE (POSTGRESQL) & SQLITE BACKUP
// =========================================================================

async function importBatch5() {
  console.log('--- Starting Import Batch 5: Kompetisi Nasional ORION Matematika (Level A & B) ---');

  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  // 1. Ensure Category & Topics
  const categoryId = 'cat_olimpiade_orion';
  const categoryName = 'Olimpiade Nasional ORION';
  const categoryDesc = 'Simulasi dan naskah resmi babak Final Nasional kompetisi ORION';

  await client`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (${categoryId}, ${categoryName}, 'olimpiade-nasional-orion', ${categoryDesc}, 6)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
  `;

  sqlite.prepare(`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET name = excluded.name, description = excluded.description
  `).run(categoryId, categoryName, 'olimpiade-nasional-orion', categoryDesc, 6);

  const topics = [
    { id: 'top_orion_mtk_la', name: 'Matematika Level A Final ORION', slug: 'matematika-level-a-final-orion' },
    { id: 'top_orion_mtk_lb', name: 'Matematika Level B Final ORION', slug: 'matematika-level-b-final-orion' }
  ];

  for (const t of topics) {
    await client`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (${t.id}, ${categoryId}, ${t.name}, ${t.slug})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
    `;

    sqlite.prepare(`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET name = excluded.name, slug = excluded.slug
    `).run(t.id, categoryId, t.name, t.slug);
  }

  // 2. Define Packages
  const packages = [
    {
      pkgId: 'pkg_orion_2025_mtk_a',
      pkgTitle: 'Final Nasional ORION 2025 — Matematika Level A (Bergambar)',
      duration: 60,
      topicId: 'top_orion_mtk_la',
      questions: ORION_MTK_LEVEL_A
    },
    {
      pkgId: 'pkg_orion_2025_mtk_b',
      pkgTitle: 'Final Nasional ORION 2025 — Matematika Level B (Bergambar)',
      duration: 60,
      topicId: 'top_orion_mtk_lb',
      questions: ORION_MTK_LEVEL_B
    }
  ];

  let totalQuestionsCount = 0;

  for (const batch of packages) {
    console.log(`Processing ${batch.pkgTitle}...`);

    const pkgSlug = batch.pkgId.replace(/_/g, '-');
    const rules = JSON.stringify({ passingScore: 70, correctWeight: 4, incorrectWeight: 0, emptyWeight: 0 });

    // Insert Package to Supabase Postgres
    await client`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (${batch.pkgId}, ${batch.pkgTitle}, ${pkgSlug}, ${categoryId}, 'SIMULATION', ${batch.duration}, false, false, ${rules}, true)
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        duration_minutes = EXCLUDED.duration_minutes
    `;

    // Insert Package to SQLite
    sqlite.prepare(`
      INSERT INTO exam_packages (id, title, slug, category_id, type, duration_minutes, shuffle_questions, shuffle_options, passing_grade_rules, is_published)
      VALUES (?, ?, ?, ?, 'SIMULATION', ?, 0, 0, ?, 1)
      ON CONFLICT (id) DO UPDATE SET title = excluded.title
    `).run(batch.pkgId, batch.pkgTitle, pkgSlug, categoryId, batch.duration, rules);

    const questionsToInsert: any[] = [];
    const optionsToInsert: any[] = [];
    const pkgQuestionsToInsert: any[] = [];

    batch.questions.forEach((q, idx) => {
      totalQuestionsCount++;
      const qId = `${batch.pkgId}_q${String(q.num).padStart(2, '0')}`;

      questionsToInsert.push({
        id: qId,
        topic_id: batch.topicId,
        type: 'SINGLE_CHOICE',
        content_markdown: q.question,
        image_url: q.image || null,
        explanation_markdown: q.explanation,
        explanation_image_url: null,
        difficulty: q.difficulty,
        created_at: new Date().toISOString()
      });

      pkgQuestionsToInsert.push({
        package_id: batch.pkgId,
        question_id: qId,
        order_index: idx + 1
      });

      const optLabels = ['A', 'B', 'C', 'D'];
      optLabels.forEach((label, optIdx) => {
        const isCorrect = label === q.correct;
        const optText = q.options[label] || '';
        optionsToInsert.push({
          id: `${qId}_opt_${label.toLowerCase()}`,
          question_id: qId,
          label: label,
          content_markdown: optText,
          image_url: null,
          is_correct: isCorrect,
          score_value: isCorrect ? 4 : 0,
          order_index: optIdx + 1
        });
      });
    });

    // Ingest to Supabase Postgres
    await client`
      INSERT INTO questions ${client(questionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown, 
        image_url = EXCLUDED.image_url,
        explanation_markdown = EXCLUDED.explanation_markdown
    `;

    await client`
      INSERT INTO question_options ${client(optionsToInsert)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown,
        is_correct = EXCLUDED.is_correct
    `;

    await client`
      INSERT INTO package_questions ${client(pkgQuestionsToInsert)}
      ON CONFLICT (package_id, question_id) DO UPDATE SET 
        order_index = EXCLUDED.order_index
    `;

    // Also Insert to SQLite backup
    for (const q of questionsToInsert) {
      sqlite.prepare(`
        INSERT INTO questions (id, topic_id, type, content_markdown, image_url, explanation_markdown, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET 
          content_markdown = excluded.content_markdown,
          image_url = excluded.image_url
      `).run(q.id, q.topic_id, q.type, q.content_markdown, q.image_url, q.explanation_markdown, q.difficulty);
    }

    for (const opt of optionsToInsert) {
      sqlite.prepare(`
        INSERT INTO question_options (id, question_id, label, content_markdown, image_url, is_correct, score_value, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET content_markdown = excluded.content_markdown
      `).run(opt.id, opt.question_id, opt.label, opt.content_markdown, opt.image_url, opt.is_correct ? 1 : 0, opt.score_value, opt.order_index);
    }

    for (const pq of pkgQuestionsToInsert) {
      sqlite.prepare(`
        INSERT INTO package_questions (package_id, question_id, order_index)
        VALUES (?, ?, ?)
        ON CONFLICT (package_id, question_id) DO UPDATE SET order_index = excluded.order_index
      `).run(pq.package_id, pq.question_id, pq.order_index);
    }

    console.log(`Successfully ingested ${batch.questions.length} questions for ${batch.pkgTitle}!`);
  }

  sqlite.close();
  console.log(`\n🎉 ALL DONE! Successfully imported ${totalQuestionsCount} questions across 2 packages with complete verified keys & explanations.`);
  process.exit(0);
}

importBatch5().catch((err) => {
  console.error('Import error:', err);
  process.exit(1);
});
