import Database from 'better-sqlite3';
import { client } from './index';

// =========================================================================
// SCRIPT AUDIT & PERBAIKAN TOTAL KUNCI JAWABAN & PEMBAHASAN CERDASIFY
// Memperbaiki:
// 1. pkg_prisma_2024_m1 (23 soal)
// 2. pkg_prisma_2025_m1 (28 soal)
// 3. pkg_prisma_2025_m2 (30 soal + gambar geometri q28)
// 4. pkg_prisma_2025_m3 (29 soal + perbaikan formula LaTeX)
// 5. pkg_ceo_2025_m2 (30 soal + perbaikan opsi & gambar timbangan q29)
// 6. Rekalkulasi seluruh attempt user affan dan user lainnya
// =========================================================================

interface FixQuestion {
  questionId: string;
  correctLabel: string;
  explanation: string;
  promptOverride?: string;
  imageOverride?: string;
  optionsOverride?: Record<string, string>;
}

const PRISMA_2024_M1_FIXES: FixQuestion[] = [
  {
    questionId: 'q_0467_matematika-leve',
    correctLabel: 'C',
    explanation: 'Pada bilangan 7.523:\n- Angka 7 bernilai ribuan (7.000)\n- Angka 5 bernilai ratusan (500)\n- Angka 2 bernilai puluhan (20)\n- Angka 3 bernilai satuan (3)\nJadi angka yang bernilai puluhan adalah **2**.'
  },
  {
    questionId: 'q_0468_matematika-leve',
    correctLabel: 'B',
    explanation: 'Urutan bulan dalam setahun:\n1. Januari, 2. Februari, 3. Maret, ..., 10. Oktober.\nJadi bulan ke-10 adalah **Oktober**.'
  },
  {
    questionId: 'q_0469_matematika-leve',
    correctLabel: 'C',
    explanation: 'Membandingkan bilangan dari yang terbesar ke terkecil:\n$92 > 91 > 90 > 89 > 88$.\nUrutan yang benar adalah **92, 91, 90, 89, 88**.'
  },
  {
    questionId: 'q_0470_matematika-leve',
    correctLabel: 'B',
    explanation: 'Bilangan genap adalah bilangan yang habis dibagi 2 (berakhiran 0, 2, 4, 6, atau 8). Di antara pilihan yang ada, 14 dan 16 keduanya merupakan bilangan genap.'
  },
  {
    questionId: 'q_0471_matematika-leve',
    correctLabel: 'B',
    explanation: 'Langkah operasi hitung:\n$$23 - 7 + 3 = 16 + 3 = 19$$.'
  },
  {
    questionId: 'q_0472_matematika-leve',
    correctLabel: 'A',
    explanation: 'Perkalian dasar: $$9 \\times 6 = 54$$.'
  },
  {
    questionId: 'q_0473_matematika-leve',
    correctLabel: 'C',
    explanation: 'Harga total 3 buku tulis $= 3 \\times \\text{Rp } 2.000 = \\text{Rp } 6.000$.\nSisa uang kembalian $= \\text{Rp } 10.000 - \\text{Rp } 6.000 = \\text{Rp } 4.000$.'
  },
  {
    questionId: 'q_0474_matematika-leve',
    correctLabel: 'B',
    explanation: 'Lama belajar $= 20.45 - 19.15 = 1 \\text{ jam } 30 \\text{ menit} = 1,5 \\text{ jam}$.'
  },
  {
    questionId: 'q_0475_matematika-leve',
    correctLabel: 'B',
    explanation: 'Bangun datar pada gambar adalah trapesium yang tergolong segi empat, sehingga memiliki tepat **4 sisi**.'
  },
  {
    questionId: 'q_0476_matematika-leve',
    correctLabel: 'D',
    explanation: 'Konversi satuan berat: $1 \\text{ ons} = 100 \\text{ gram}$, maka:\n$$10 \\text{ ons} = 10 \\times 100 \\text{ gram} = 1.000 \\text{ gram}$$.'
  },
  {
    questionId: 'q_0477_matematika-leve',
    correctLabel: 'A',
    explanation: 'Langkah perhitungan:\n$$27 + 51 - 43 = 78 - 43 = 35$$.'
  },
  {
    questionId: 'q_0478_matematika-leve',
    correctLabel: 'B',
    explanation: 'Lambang bilangan "empat ratus tiga" adalah **403** (4 ratusan, 0 puluhan, dan 3 satuan).'
  },
  {
    questionId: 'q_0479_matematika-leve',
    correctLabel: 'C',
    explanation: 'Sisi kiri: $76 + 12 = 88$.\nSisi kanan: $80 + \\dots = 88 \\implies \\dots = 88 - 80 = 8$.'
  },
  {
    questionId: 'q_0480_matematika-leve',
    correctLabel: 'A',
    explanation: 'Bentuk dekomposisi nilai tempat:\n$$436 = 400 + 30 + 6$$.\nJadi bilangan pengisi titik-titik adalah **30**.'
  },
  {
    questionId: 'q_0481_matematika-leve',
    correctLabel: 'B',
    explanation: 'Hasil penjumlahan: $$4.500 + 200 = 4.700$$.\nDibaca: **Empat ribu tujuh ratus**.'
  },
  {
    questionId: 'q_0482_matematika-leve',
    correctLabel: 'C',
    explanation: 'Pembagian apel secara adil:\n$$15 \\div 3 = 5 \\text{ apel per anak}$$.'
  },
  {
    questionId: 'q_0483_matematika-leve',
    correctLabel: 'B',
    explanation: 'Sisi kiri: $245 - 34 = 211$.\nSisi kanan: $200 + 20 - \\dots = 220 - \\dots$.\n$$220 - \\dots = 211 \\implies \\dots = 220 - 211 = 9$$.'
  },
  {
    questionId: 'q_0484_matematika-leve',
    correctLabel: 'D',
    explanation: 'Konversi waktu:\n$$1 \\text{ jam} = 60 \\text{ menit} \\implies 3 \\text{ jam} = 3 \\times 60 = 180 \\text{ menit}$$.'
  },
  {
    questionId: 'q_0485_matematika-leve',
    correctLabel: 'D',
    explanation: 'Jika 1 melon setara dengan 5 jeruk, maka:\n$$2 \\text{ melon} = 2 \\times 5 = 10 \\text{ jeruk}$$.'
  },
  {
    questionId: 'q_0486_matematika-leve',
    correctLabel: 'D',
    explanation: 'Berdasarkan persamaan grafis timbangan buah:\n- 2 Stroberi $= 20 \\implies$ 1 Stroberi $= 10$.\n- 1 Stroberi $+ 2$ Apel $= 18 \\implies 10 + 2A = 18 \\implies A = 4$.\nNilai dari 1 Stroberi $+ 1$ Apel $= 10 + 4 = 14$.'
  },
  {
    questionId: 'q_0487_matematika-leve',
    correctLabel: 'B',
    explanation: 'Pada bilangan 7.635, angka 6 berada pada tempat ke-3 dari kanan yang bernilai **Ratusan** (600).'
  },
  {
    questionId: 'q_0488_matematika-leve',
    correctLabel: 'C',
    explanation: 'Persegi, trapesium, dan belah ketupat adalah segi empat yang memiliki 4 sisi. Sedangkan **lingkaran** hanya dibatasi oleh 1 sisi lengkung.'
  },
  {
    questionId: 'q_0489_matematika-leve',
    correctLabel: 'A',
    explanation: 'Menyelesaikan persamaan:\n$$x + 5 - 2 = 7$$\n$$x + 3 = 7 \\implies x = 7 - 3 = 4$$.'
  }
];

const PRISMA_2025_M1_FIXES: FixQuestion[] = [
  {
    questionId: 'q_0380_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'Jika $x + 7 = 15$, maka nilai $x$ yang benar adalah ...',
    explanation: 'Menyelesaikan persamaan satu variabel:\n$$x + 7 = 15 \\implies x = 15 - 7 = 8$$.'
  },
  {
    questionId: 'q_0381_matematika-leve',
    correctLabel: 'D',
    explanation: 'Menghitung nilai tempat:\n30 satuan $= 30$\n5 puluhan $= 50$\n4 ratusan $= 400$\nTotal $= 30 + 50 + 400 = 480$.'
  },
  {
    questionId: 'q_0382_matematika-leve',
    correctLabel: 'B',
    explanation: 'Penjumlahan langsung: $$5 + 3 + 0 + 9 = 17$$.'
  },
  {
    questionId: 'q_0383_matematika-leve',
    correctLabel: 'B',
    explanation: 'Misalkan berat pir $= P$ dan melon $= M$.\nDiketahui $M = 2P$.\n$$2P + M = 1200 \\implies 2P + 2P = 4P = 1200 \\implies P = 300 \\text{ gram}$$.\nBerat melon $M = 2 \\times 300 = 600 \\text{ gram}$.\nSelisih berat $= 600 - 300 = 300 \\text{ gram}$.'
  },
  {
    questionId: 'q_0384_matematika-leve',
    correctLabel: 'A',
    explanation: 'Lambang bilangan seribu tiga ratus lima adalah **1305**.'
  },
  {
    questionId: 'q_0385_matematika-leve',
    correctLabel: 'D',
    explanation: 'Membandingkan nilai tempat ratusan dan puluhan:\n2357, 2375, 2537, 2573.\nBilangan terbesar adalah **2573**.'
  },
  {
    questionId: 'q_0386_matematika-leve',
    correctLabel: 'B',
    explanation: 'Kubus adalah bangun ruang yang dibatasi oleh 6 bidang sisi berbentuk persegi kongruen (termasuk bidang alasnya).'
  },
  {
    questionId: 'q_0387_matematika-leve',
    correctLabel: 'B',
    explanation: 'Total biaya belanja:\n- 2 kg apel: $2 \\times \\text{Rp } 20.000 = \\text{Rp } 40.000$\n- 3 kg jeruk: $3 \\times \\text{Rp } 15.000 = \\text{Rp } 45.000$\nTotal $= 40.000 + 45.000 = \\text{Rp } 85.000$.'
  },
  {
    questionId: 'q_0388_matematika-leve',
    correctLabel: 'C',
    explanation: 'Pada bilangan 6753, angka 7 menempati posisi ratusan sehingga bernilai **700**.'
  },
  {
    questionId: 'q_0389_matematika-leve',
    correctLabel: 'C',
    explanation: 'Permen yang diberikan $= 15 - 7 = 8$ butir.'
  },
  {
    questionId: 'q_0390_matematika-leve',
    correctLabel: 'B',
    explanation: 'Kemarin Sabtu $\\implies$ Hari ini Minggu $\\implies$ Besok Senin $\\implies$ Besok lusa adalah hari **Selasa**.'
  },
  {
    questionId: 'q_0391_matematika-leve',
    correctLabel: 'C',
    explanation: 'Pengurangan bersusun: $$273 - 120 = 153$$.'
  },
  {
    questionId: 'q_0392_matematika-leve',
    correctLabel: 'B',
    promptOverride: 'Perhatikan pola bilangan berikut:\n$$10 - 15 - \\dots - 25 - \\dots - 35$$\nBilangan yang tepat untuk mengisi titik-titik tersebut adalah ...',
    explanation: 'Pola bilangan bertambah 5:\n$$10, 15, \\mathbf{20}, 25, \\mathbf{30}, 35$$.\nJadi bilangan yang tepat adalah **20 dan 30**.'
  },
  {
    questionId: 'q_0393_matematika-leve',
    correctLabel: 'C',
    explanation: 'Bilangan 12 setelah 48 adalah: $$48 + 12 = 60$$.'
  },
  {
    questionId: 'q_0394_matematika-leve',
    correctLabel: 'A',
    explanation: 'Mengevaluasi pilihan penjumlahan yang menghasilkan 20:\n- A: $13 + 7 = 20$ (Benar)\n- B: $12 + 6 = 18$\n- C: $15 + 3 = 18$\n- D: $18 + 1 = 19$.'
  },
  {
    questionId: 'q_0395_matematika-leve',
    correctLabel: 'D',
    explanation: 'Rina $= 10$ permen.\nSusi $= 10 - 4 = 6$ permen.\nTotal seluruhnya $= 10 + 6 = 16$ permen.'
  },
  {
    questionId: 'q_0396_matematika-leve',
    correctLabel: 'A',
    explanation: 'Bilangan 25 lebih kecil dari 150 adalah: $$150 - 25 = 125$$.'
  },
  {
    questionId: 'q_0397_matematika-leve',
    correctLabel: 'C',
    explanation: 'Satu minggu ada 7 hari. $10 \\pmod 7 = 3$ hari setelah hari Senin:\nSenin $+ 3$ hari = Selasa, Rabu, **Kamis**.'
  },
  {
    questionId: 'q_0398_matematika-leve',
    correctLabel: 'C',
    explanation: 'Bentuk panjang 45 berdasarkan nilai tempat puluhan dan satuan adalah **40 + 5**.'
  },
  {
    questionId: 'q_0399_matematika-leve',
    correctLabel: 'B',
    explanation: '$$30 = \\dots + 12 \\implies \\dots = 30 - 12 = 18$$.'
  },
  {
    questionId: 'q_0400_matematika-leve',
    correctLabel: 'B',
    explanation: 'Operasi hitung berurutan:\n$$9 + 3 - 5 + 2 = 12 - 5 + 2 = 7 + 2 = 9$$.'
  },
  {
    questionId: 'q_0401_matematika-leve',
    correctLabel: 'D',
    explanation: 'Bilangan 7 sebelum 50 adalah: $$50 - 7 = 43$$.'
  },
  {
    questionId: 'q_0402_matematika-leve',
    correctLabel: 'C',
    explanation: 'Konversi ke cm:\n$$5 \\text{ m} = 500 \\text{ cm} \\implies 500 + 50 = 550 \\text{ cm}$$.'
  },
  {
    questionId: 'q_0403_matematika-leve',
    correctLabel: 'D',
    explanation: 'Urutan operasi perkalian dan pembagian dari kiri:\n$$6 \\times 8 \\div 3 = 48 \\div 3 = 16$$.'
  },
  {
    questionId: 'q_0404_matematika-leve',
    correctLabel: 'A',
    explanation: '$$37 + \\dots = 100 \\implies \\dots = 100 - 37 = 63$$.'
  },
  {
    questionId: 'q_0405_matematika-leve',
    correctLabel: 'B',
    explanation: 'Persamaan 5 simbol identik:\n$$5 \\times ♣ = 20 \\implies ♣ = 20 \\div 5 = 4$$.'
  },
  {
    questionId: 'q_0406_matematika-leve',
    correctLabel: 'B',
    explanation: 'Rumus total orang dalam antrean:\n$$\\text{Total} = \\text{Urutan depan} + \\text{Urutan belakang} - 1 = 5 + 8 - 1 = 12 \\text{ orang}$$.'
  },
  {
    questionId: 'q_0407_matematika-leve',
    correctLabel: 'C',
    explanation: 'Pengurangan waktu:\n11.00 dikurangi 20 menit adalah pukul **10.40**.'
  }
];

const PRISMA_2025_M2_FIXES: FixQuestion[] = [
  {
    questionId: 'q_0408_matematika-leve',
    correctLabel: 'B',
    explanation: 'Agustus adalah bulan ke-8. Ditambah 5 bulan lagi $= 8 + 5 = 13$.\nBulan ke-13 adalah bulan ke-1 di tahun berikutnya, yaitu **Januari**.'
  },
  {
    questionId: 'q_0409_matematika-leve',
    correctLabel: 'A',
    explanation: 'Langkah pengurangan:\n$$625 - 342 - 123 = 283 - 123 = 160$$.'
  },
  {
    questionId: 'q_0410_matematika-leve',
    correctLabel: 'C',
    explanation: 'Menyusun persamaan:\n$$5x - 8 = 37 \\implies 5x = 37 + 8 = 45 \\implies x = 45 \\div 5 = 9$$.'
  },
  {
    questionId: 'q_0411_matematika-leve',
    correctLabel: 'B',
    explanation: 'Konversi pecahan ke desimal untuk membandingkan:\n- $\\frac{5}{6} \\approx 0,833$\n- $\\frac{7}{9} \\approx 0,778$\n- $\\frac{3}{4} = 0,750$\n- $\\frac{2}{3} \\approx 0,667$\nUrutan dari yang terbesar: **$\\frac{5}{6} , \\frac{7}{9} , \\frac{3}{4} , \\frac{2}{3}$**.'
  },
  {
    questionId: 'q_0412_matematika-leve',
    correctLabel: 'B',
    explanation: 'Satu putaran penuh $= 360^\\circ$.\n$$\\frac{2}{5} \\times 360^\\circ = 2 \\times 72^\\circ = 144^\\circ$$.'
  },
  {
    questionId: 'q_0413_matematika-leve',
    correctLabel: 'D',
    explanation: 'Sisi miring $c = 25$ cm, sisi tegak $a = 7$ cm.\nSisi tegak lainnya $b = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24$ cm.\n$$\\text{Luas segitiga} = \\frac{1}{2} \\times a \\times b = \\frac{1}{2} \\times 7 \\times 24 = 84 \\text{ cm}^2$$.'
  },
  {
    questionId: 'q_0414_matematika-leve',
    correctLabel: 'C',
    explanation: 'Faktorisasi prima:\n$84 = 2^2 \\times 3 \\times 7$\n$126 = 2 \\times 3^2 \\times 7$\n$210 = 2 \\times 3 \\times 5 \\times 7$\n$$\\text{FPB} = 2 \\times 3 \\times 7 = 42$$.'
  },
  {
    questionId: 'q_0415_matematika-leve',
    correctLabel: 'A',
    explanation: 'Konversi angka romawi:\n$\\text{L} = 50$, $\\text{XL} = 40$.\n$$\\text{L} + \\text{XL} = 50 + 40 = 90$$.\n$$3 \\times 90 = 270 = \\text{CCLXX}$$.'
  },
  {
    questionId: 'q_0416_matematika-leve',
    correctLabel: 'C',
    explanation: 'Waktu keberangkatan:\n$$07.30 + 55 \\text{ menit} = 07.85 = 08.25$$.'
  },
  {
    questionId: 'q_0417_matematika-leve',
    correctLabel: 'B',
    explanation: 'Perbandingan Andi : Budi $= 2 : 3$.\nSelisih rasio $= 3 - 2 = 1$ bagian $= 5$ tahun.\nUmur Andi $= 2 \\times 5 = 10$ tahun.'
  },
  {
    questionId: 'q_0418_matematika-leve',
    correctLabel: 'B',
    explanation: 'Sifat distributif perkalian:\n$$15 \\times 12 - 5 \\times 12 = (15 - 5) \\times 12 = 10 \\times 12 = 120$$.'
  },
  {
    questionId: 'q_0419_matematika-leve',
    correctLabel: 'A',
    explanation: 'Harga awal $= \\text{Rp } 150.000$.\nNaik 20%: $150.000 \\times 1,20 = \\text{Rp } 180.000$.\nTurun 10% dari harga baru: $180.000 \\times 0,90 = \\text{Rp } 162.000$.'
  },
  {
    questionId: 'q_0420_matematika-leve',
    correctLabel: 'D',
    explanation: 'Faktorisasi prima dari 210:\n$$210 = 2 \\times 3 \\times 5 \\times 7$$.\nSemua bilangan 2, 3, 5, dan 7 merupakan faktor prima dari 210, sedangkan 11 bukan.'
  },
  {
    questionId: 'q_0421_matematika-leve',
    correctLabel: 'B',
    explanation: 'Kebun persegi dengan luas $900 \\text{ m}^2$.\n$$\\text{Panjang sisi} = \\sqrt{900} = 30 \\text{ meter}$$.'
  },
  {
    questionId: 'q_0422_matematika-leve',
    correctLabel: 'C',
    explanation: 'Faktorisasi prima:\n$36 = 2^2 \\times 3^2$\n$48 = 2^4 \\times 3$\n$$\\text{KPK} = 2^4 \\times 3^2 = 16 \\times 9 = 144$$.'
  },
  {
    questionId: 'q_0423_matematika-leve',
    correctLabel: 'B',
    explanation: 'Konversi ke gram:\n$2 \\text{ kg} = 2.000 \\text{ g}$\n$25 \\text{ g} = 25 \\text{ g}$\n$0,5 \\text{ hg} = 50 \\text{ g}$\n$$2.000 + 25 - 50 = 1.975 \\text{ gram}$$.'
  },
  {
    questionId: 'q_0424_matematika-leve',
    correctLabel: 'B',
    promptOverride: 'Perhatikan pernyataan berikut:\n- Angka 3 menempati tempat puluhan.\n- Angka 9 menempati tempat satuan.\n- Angka 4 menempati tempat ratusan dan ribuan.\n\nLambang bilangan dari pernyataan di atas adalah ...',
    explanation: 'Menyusun nilai tempat:\nRibuan: 4, Ratusan: 4, Puluhan: 3, Satuan: 9 $\\implies$ **4.439**.'
  },
  {
    questionId: 'q_0425_matematika-leve',
    correctLabel: 'A',
    promptOverride: 'Perhatikan pola bilangan kuadrat berikut:\n$$1, 4, 9, x, 25, y, 49, \\dots$$\nNilai dari $x + y$ adalah ...',
    explanation: 'Pola kuadrat: $1^2, 2^2, 3^2, 4^2, 5^2, 6^2, 7^2$.\n$x = 4^2 = 16$\n$y = 6^2 = 36$\n$$x + y = 16 + 36 = 52$$.'
  },
  {
    questionId: 'q_0426_matematika-leve',
    correctLabel: 'A',
    explanation: 'Jumlah bagian rasio $= 7 + 4 = 11$ bagian.\n1 bagian $= 33 \\div 11 = 3$ tahun.\nUsia adik $= 4 \\times 3 = 12$ tahun.'
  },
  {
    questionId: 'q_0427_matematika-leve',
    correctLabel: 'C',
    explanation: 'Bilangan 42 dan 70:\n- $\\text{FPB}(42, 70) = 14$\n- $\\text{KPK}(42, 70) = 210$\n$$\\text{Selisih} = 210 - 14 = 196$$.'
  },
  {
    questionId: 'q_0428_matematika-leve',
    correctLabel: 'C',
    explanation: 'Misalkan harga 1 kue $= k$ dan uang ibu $= U$.\n$U = 15k - 5000$\n$U = 10k + 5000$\n$$15k - 5000 = 10k + 5000 \\implies 5k = 10.000 \\implies k = 2.000$$.\nUang ibu $U = 10(2.000) + 5.000 = \\text{Rp } 25.000$.'
  },
  {
    questionId: 'q_0429_matematika-leve',
    correctLabel: 'D',
    optionsOverride: {
      A: '40 meter',
      B: '50 meter',
      C: '60 meter',
      D: '80 meter'
    },
    explanation: 'Keliling persegi panjang:\n$$K = 2 \\times (p + l) = 2 \\times (25 + 15) = 2 \\times 40 = 80 \\text{ meter}$$.'
  },
  {
    questionId: 'q_0430_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'Bentuk persen dari $\\frac{7}{8}$ adalah ...',
    explanation: 'Mengubah pecahan biasa ke persen:\n$$\\frac{7}{8} \\times 100\\% = 7 \\times 12,5\\% = 87,5\\%$$.'
  },
  {
    questionId: 'q_0431_matematika-leve',
    correctLabel: 'A',
    explanation: 'Urutan operasi perkalian dan pembagian terlebih dahulu:\n$$12 \\times (-7) = -84$$\n$$48 \\div (-6) = -8$$\n$$-84 + (-8) = -92$$.'
  },
  {
    questionId: 'q_0432_matematika-leve',
    correctLabel: 'B',
    explanation: 'Pada pukul 15.00, jarum pendek di angka 3 dan jarum panjang di angka 12, membentuk sudut $3 \\times 30^\\circ = 90^\\circ$ yang merupakan sudut **siku-siku**.'
  },
  {
    questionId: 'q_0433_matematika-leve',
    correctLabel: 'B',
    explanation: 'Panjang baru $= 12 + 3 = 15$ cm.\nLebar $= 8$ cm, tinggi $= 5$ cm.\n$$\\text{Volume baru} = 15 \\times 8 \\times 5 = 600 \\text{ cm}^3$$.'
  },
  {
    questionId: 'q_0434_matematika-leve',
    correctLabel: 'C',
    explanation: 'Angka romawi:\n$\\text{XIX} = 19$, $\\text{XIV} = 14$.\n$$19 + 14 = 33 = \\text{XXXIII}$$.'
  },
  {
    questionId: 'q_0435_matematika-leve',
    correctLabel: 'D',
    imageOverride: '/uploads/prisma2025_m2_q28.jpeg',
    promptOverride: 'Perhatikan gambar bangun datar di samping! Persegi tengah berukuran $6\\text{ cm} \\times 6\\text{ cm}$, 4 persegi di sudut berukuran $3\\text{ cm} \\times 3\\text{ cm}$, dan terdapat 4 segitiga dengan alas $6\\text{ cm}$ dan tinggi $3\\text{ cm}$. Luas seluruh daerah yang diarsir adalah ... $\\text{cm}^2$.',
    explanation: 'Luas daerah yang diarsir terdiri dari:\n1. 4 buah persegi sudut ($3 \\times 3$): $4 \\times 9 = 36 \\text{ cm}^2$.\n2. 4 buah segitiga alas 6 cm tinggi 3 cm: $4 \\times (\\frac{1}{2} \\times 6 \\times 3) = 4 \\times 9 = 36 \\text{ cm}^2$.\n$$\\text{Total Luas Arsir} = 36 + 36 = 72 \\text{ cm}^2$$.'
  },
  {
    questionId: 'q_0436_matematika-leve',
    correctLabel: 'A',
    explanation: '$$\\frac{1}{3} x = 16 \\implies x = 16 \\times 3 = 48$$.\n$$\\frac{1}{4} x = \\frac{1}{4} \\times 48 = 12$$.'
  },
  {
    questionId: 'q_0437_matematika-leve',
    correctLabel: 'A',
    promptOverride: 'Di antara pilihan berikut, yang merupakan bilangan genap adalah ...',
    optionsOverride: {
      A: '$5^2 - 1$',
      B: '$10 + 7$',
      C: '$3 \\times 11$',
      D: '$25 \\div 5$'
    },
    explanation: 'Evaluasi setiap pilihan:\n- A: $5^2 - 1 = 25 - 1 = 24$ (Genap, habis dibagi 2)\n- B: $10 + 7 = 17$ (Ganjil)\n- C: $3 \\times 11 = 33$ (Ganjil)\n- D: $25 \\div 5 = 5$ (Ganjil).'
  }
];

const PRISMA_2025_M3_FIXES: FixQuestion[] = [
  {
    questionId: 'q_0438_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'Jika $a = \\sqrt{16} + 3\\sqrt{25}$ dan $b = \\sqrt[3]{27} - 2\\sqrt[3]{8}$, maka nilai dari $\\frac{a^2 - b^2}{a - b}$ adalah …',
    explanation: 'Sederhanakan nilai $a$ dan $b$:\n$$a = 4 + 3(5) = 4 + 15 = 19$$\n$$b = 3 - 2(2) = 3 - 4 = -1$$\nBerdasarkan aljabar faktorisasi selisih kuadrat:\n$$\\frac{a^2 - b^2}{a - b} = \\frac{(a - b)(a + b)}{a - b} = a + b$$\n$$a + b = 19 + (-1) = 18$$.'
  },
  {
    questionId: 'q_0439_matematika-leve',
    correctLabel: 'B',
    explanation: 'Bilangan asli habis dibagi 4 dan 9 merupakan kelipatan dari $\\text{KPK}(4, 9) = 36$.\nKelipatan 36: 36, 72, 108, 144, ...\nUji sisa pembagian dengan 5:\n- $36 \\div 5 = 7$ sisa 1\n- $72 \\div 5 = 14$ sisa 2 (Memenuhi syarat!)\nJadi bilangan tersebut adalah **72**.'
  },
  {
    questionId: 'q_0440_matematika-leve',
    correctLabel: 'C',
    explanation: 'Konversi satuan waktu ke tahun:\n- 1 windu $= 8$ tahun $\\implies 15 \\times 8 = 120$ tahun\n- 1 dasawarsa $= 10$ tahun $\\implies 3 \\times 10 = 30$ tahun\n- 1 lustrum $= 5$ tahun $\\implies 2 \\times 5 = 10$ tahun\n$$\\text{Total} = 120 + 30 + 10 = 160 \\text{ tahun}$$.'
  },
  {
    questionId: 'q_0441_matematika-leve',
    correctLabel: 'B',
    promptOverride: 'Seorang petani memiliki 5 petak sawah. Setiap petak menghasilkan 2,5 ton padi setiap panen. Jika petani tersebut memanen 3 kali dalam setahun dan $\\frac{1}{5}$ dari total panennya disisihkan untuk zakat, berapa kuintal padi yang dapat dijual oleh petani tersebut dalam setahun?',
    explanation: 'Total panen per musim $= 5 \\times 2,5 \\text{ ton} = 12,5 \\text{ ton}$.\nTotal panen setahun $= 12,5 \\times 3 = 37,5 \\text{ ton} = 375 \\text{ kuintal}$.\nZakat $\\frac{1}{5} \\times 375 = 75 \\text{ kuintal}$.\nPadi yang dijual $= 375 - 75 = 300 \\text{ kuintal}$.'
  },
  {
    questionId: 'q_0442_matematika-leve',
    correctLabel: 'A',
    explanation: 'Debit air $= 0,8 \\text{ liter/detik}$.\nDalam 1 jam (3600 detik):\n$$\\text{Volume} = 0,8 \\times 3600 = 2.880 \\text{ liter/jam} = 2,88 \\text{ m}^3/\\text{jam}$$.'
  },
  {
    questionId: 'q_0443_matematika-leve',
    correctLabel: 'A',
    promptOverride: 'Bilangan desimal berulang $0,636363\\dots$ mempunyai bentuk pecahan sederhana $\\frac{m}{n}$. Hasil kali $m$ dan $n$ adalah …',
    explanation: 'Misalkan $x = 0,636363\\dots$\n$$100x = 63,6363\\dots$$\n$$99x = 63 \\implies x = \\frac{63}{99} = \\frac{7}{11}$$.\nMaka $m = 7$ dan $n = 11$.\n$$m \\times n = 7 \\times 11 = 77$$.'
  },
  {
    questionId: 'q_0444_matematika-leve',
    correctLabel: 'B',
    promptOverride: 'Jumlah dari $-2 + 4 - 6 + 8 - \\dots + 100$ adalah …',
    explanation: 'Kelompokkan setiap 2 suku berurutan:\n$$(-2 + 4) + (-6 + 8) + \\dots + (-98 + 100)$$\nSetiap pasangan bernilai $+2$.\nJumlah bilangan genap dari 2 sampai 100 ada 50 bilangan, membentuk 25 pasangan.\n$$\\text{Total} = 25 \\times 2 = 50$$.'
  },
  {
    questionId: 'q_0445_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'Bu Ani memiliki sejumlah uang. Dia menyumbangkan $\\frac{1}{4}$ dari uangnya kepada panti asuhan, dan membelanjakan $\\frac{2}{5}$ dari sisa uangnya untuk membeli kebutuhan pokok. Jika sisa uangnya setelah itu ditabung, persentase uang yang ditabung Bu Ani dari total uang awalnya adalah …',
    explanation: 'Sisa setelah sumbangan $= 1 - \\frac{1}{4} = \\frac{3}{4}$.\nSisa setelah kebutuhan pokok $= (1 - \\frac{2}{5}) \\times \\frac{3}{4} = \\frac{3}{5} \\times \\frac{3}{4} = \\frac{9}{20}$.\n$$\\text{Persentase} = \\frac{9}{20} \\times 100\\% = 45\\%$$.'
  },
  {
    questionId: 'q_0446_matematika-leve',
    correctLabel: 'B',
    explanation: 'Pohon faktor dari 540:\n$$540 = 54 \\times 10 = (2 \\times 3^3) \\times (2 \\times 5) = 2^2 \\times 3^3 \\times 5$$.'
  },
  {
    questionId: 'q_0447_matematika-leve',
    correctLabel: 'D',
    explanation: 'Skala $1 : 2.000$:\n- Panjang sebenarnya $= 8 \\times 2.000 \\text{ cm} = 16.000 \\text{ cm} = 160 \\text{ m}$\n- Lebar sebenarnya $= 5 \\times 2.000 \\text{ cm} = 10.000 \\text{ cm} = 100 \\text{ m}$\n$$\\text{Luas sebenarnya} = 160 \\times 100 = 16.000 \\text{ m}^2$$.'
  },
  {
    questionId: 'q_0448_matematika-leve',
    correctLabel: 'B',
    explanation: 'Sistem persamaan:\n(1) $A + B = 500.000$\n(2) $B + C = 750.000$\n(3) $A + C = 650.000$\nJumlahkan ketiga persamaan:\n$$2(A + B + C) = 1.900.000 \\implies A + B + C = 950.000$$.\n$$B = (A + B + C) - (A + C) = 950.000 - 650.000 = \\text{Rp } 300.000,00$$.'
  },
  {
    questionId: 'q_0449_matematika-leve',
    correctLabel: 'A',
    promptOverride: 'Jika $\\sqrt{24} = 4,899$ dan $\\sqrt{2,4} = 1,549$, maka nilai dari $\\sqrt{2400} + \\sqrt{0,024}$ adalah …',
    explanation: 'Bentuk akar:\n$$\\sqrt{2400} = \\sqrt{24 \\times 100} = 10 \\times \\sqrt{24} = 10 \\times 4,899 = 48,99$$\n$$\\sqrt{0,024} = \\sqrt{\\frac{2,4}{100}} = \\frac{\\sqrt{2,4}}{10} = \\frac{1,549}{10} = 0,1549$$\n$$48,99 + 0,1549 = 49,1449 \\approx 49,145$$.'
  },
  {
    questionId: 'q_0450_matematika-leve',
    correctLabel: 'A',
    explanation: 'Pada jajar genjang $PQRS$, vektor $\\vec{PQ} = \\vec{SR}$.\n$$\\vec{PQ} = Q - P = (-1 - 3, 4 - (-2)) = (-4, 6)$$\n$$R - S = (-4, 6) \\implies S = R - (-4, 6) = (5 - (-4), 2 - 6) = (9, -4)$$.'
  },
  {
    questionId: 'q_0451_matematika-leve',
    correctLabel: 'D',
    explanation: 'Waktu normal $= 4 \\text{ jam } 40 \\text{ menit} = \\frac{14}{3} \\text{ jam}$.\n$$\\text{Jarak} = 75 \\times \\frac{14}{3} = 350 \\text{ km}$$.\nWaktu baru $= 4 \\text{ jam } 40 \\text{ menit} - 1 \\text{ jam } 10 \\text{ menit} = 3 \\text{ jam } 30 \\text{ menit} = 3,5 \\text{ jam}$.\n$$\\text{Kecepatan baru} = \\frac{350}{3,5} = 100 \\text{ km/jam}$$.'
  },
  {
    questionId: 'q_0452_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'KPK dari $16ab^2$ dan $24a^2b$ adalah …',
    explanation: 'KPK koefisien: $\\text{KPK}(16, 24) = 48$.\nKPK variabel: ambil pangkat tertinggi, yaitu $a^2$ dan $b^2$.\n$$\\text{KPK} = 48a^2b^2$$.'
  },
  {
    questionId: 'q_0453_matematika-leve',
    correctLabel: 'C',
    explanation: 'Jumlah siswa laki-laki $= 10$, nilai rata-rata $= 78 \\implies \\text{Total} = 780$.\nJumlah siswa perempuan $= 25 - 10 = 15$, nilai rata-rata $= 85 \\implies \\text{Total} = 1.275$.\n$$\\text{Rata-rata gabungan} = \\frac{780 + 1275}{25} = \\frac{2055}{25} = 82,2$$.'
  },
  {
    questionId: 'q_0454_matematika-leve',
    correctLabel: 'A',
    promptOverride: 'A satellite orbits the Earth at an altitude of 500 kilometers. If the satellite makes 12 revolutions around the Earth, how many kilometers does the satellite travel? The Earth’s diameter is 12,742 kilometers, and use $\\pi = 3,14$.',
    explanation: 'Diameter lintasan satelit $= 12.742 + 2(500) = 13.742 \\text{ km}$.\nKeliling 1 orbit $= \\pi \\times D = 3,14 \\times 13.742 = 43.149,88 \\text{ km}$.\nJarak 12 kali orbit $= 12 \\times 43.149,88 = 517.798,56 \\text{ km}$.'
  },
  {
    questionId: 'q_0455_matematika-leve',
    correctLabel: 'C',
    promptOverride: 'Sebuah pecahan $\\frac{x}{y}$ mempunyai sifat-sifat berikut:\n(a) $x$ dan $y$ adalah bilangan bulat positif,\n(b) $x + y = 15$, dan\n(c) Nilai pecahan $\\frac{x}{y} > 1$.\n\nPecahan yang memenuhi syarat tersebut adalah …',
    optionsOverride: {
      A: '$\\frac{7}{9}$',
      B: '$\\frac{7}{8}$',
      C: '$\\frac{8}{7}$',
      D: '$\\frac{9}{7}$'
    },
    explanation: 'Uji syarat:\nPada pilihan $\\frac{8}{7}$, pembilang $x = 8$ dan penyebut $y = 7$.\n- $8 + 7 = 15$ (Memenuhi syarat b)\n- $\\frac{8}{7} > 1$ (Memenuhi syarat c).'
  },
  {
    questionId: 'q_0456_matematika-leve',
    correctLabel: 'B',
    promptOverride: 'Tentukan nilai $x$ pada persamaan teleskopik berikut:\n$$\\left(1 + \\frac{1}{2}\\right)\\left(1 + \\frac{1}{3}\\right)\\left(1 + \\frac{1}{4}\\right) \\dots \\left(1 + \\frac{1}{x}\\right) = 10$$',
    optionsOverride: {
      A: '9',
      B: '19',
      C: '29',
      D: '39'
    },
    explanation: 'Sederhanakan setiap suku:\n$$\\frac{3}{2} \\times \\frac{4}{3} \\times \\frac{5}{4} \\times \\dots \\times \\frac{x+1}{x} = 10$$\nSuku-suku saling mencoret menyisakan:\n$$\\frac{x+1}{2} = 10 \\implies x + 1 = 20 \\implies x = 19$$.'
  },
  {
    questionId: 'q_0457_matematika-leve',
    correctLabel: 'A',
    explanation: 'Operasi desimal:\n$$35,125 - 3,45 = 31,675$$\n$$31,675 + 10,7 = 42,375$$.'
  },
  {
    questionId: 'q_0458_matematika-leve',
    correctLabel: 'D',
    promptOverride: 'Berikut adalah data berat badan siswa kelas 5 (dalam kg):\n| Berat (kg) | 30 | 32 | 33 | 35 | 36 |\n|---|---|---|---|---|---|\n| Frekuensi | 4 | 6 | 5 | 3 | 2 |\n\nSiswa yang memiliki berat badan di atas rata-rata adalah …%',
    explanation: 'Total frekuensi $= 4 + 6 + 5 + 3 + 2 = 20$ siswa.\nTotal berat $= (30 \\times 4) + (32 \\times 6) + (33 \\times 5) + (35 \\times 3) + (36 \\times 2) = 120 + 192 + 165 + 105 + 72 = 654$.\n$$\\text{Rata-rata} = \\frac{654}{20} = 32,7 \\text{ kg}$$.\nSiswa di atas 32,7 kg (berat 33, 35, 36) ada $5 + 3 + 2 = 10$ siswa.\n$$\\text{Persentase} = \\frac{10}{20} \\times 100\\% = 50\\%$$.'
  },
  {
    questionId: 'q_0459_matematika-leve',
    correctLabel: 'B',
    explanation: 'Modus adalah nilai yang memiliki frekuensi terbesar, yaitu nilai **32** dengan frekuensi 6 siswa.'
  },
  {
    questionId: 'q_0460_matematika-leve',
    correctLabel: 'C',
    explanation: 'Total data $= 20$. Median adalah rata-rata data ke-10 dan ke-11.\n- Data ke-1 sampai 4: 30\n- Data ke-5 sampai 10: 32\n- Data ke-11 sampai 15: 33\n$$\\text{Median} = \\frac{32 + 33}{2} = 32,5$$.'
  },
  {
    questionId: 'q_0461_matematika-leve',
    correctLabel: 'B',
    explanation: 'Garis AD dan BD adalah garis bagi sudut:\n- $\\angle DAB = \\frac{60^\\circ}{2} = 30^\\circ$\n- $\\angle DBA = \\frac{80^\\circ}{2} = 40^\\circ$\nPada segitiga $ABD$:\n$$\\angle ADB = 180^\\circ - (30^\\circ + 40^\\circ) = 180^\\circ - 70^\\circ = 110^\\circ$$.'
  },
  {
    questionId: 'q_0462_matematika-leve',
    correctLabel: 'C',
    explanation: 'Ukuran sisi paving block terbesar yang dapat menutup taman tanpa dipotong adalah FPB dari panjang dan lebarnya:\n$$\\text{FPB}(48, 36) = 12 \\text{ meter}$$.'
  },
  {
    questionId: 'q_0463_matematika-leve',
    correctLabel: 'B',
    explanation: 'Total siswa $= 50$.\nSiswa yang mengikuti kegiatan musik $= 25$.\nKarena setiap siswa wajib mengikuti musik atau olahraga, maka siswa yang hanya mengikuti olahraga adalah:\n$$\\text{Hanya Olahraga} = 50 - 25 = 25 \\text{ orang}$$.'
  },
  {
    questionId: 'q_0464_matematika-leve',
    correctLabel: 'B',
    explanation: 'Keliling roda: $$K = 2 \\times \\pi \\times r = 2 \\times \\frac{22}{7} \\times 14 = 88 \\text{ cm}$$.\nJarak $= 25 \\times 88 \\text{ cm} = 2.200 \\text{ cm} = 22 \\text{ meter}$.'
  },
  {
    questionId: 'q_0465_matematika-leve',
    correctLabel: 'A',
    explanation: 'Perbandingan volume $= 1 : 8 : 27 \\implies$ Perbandingan panjang rusuk $= \\sqrt[3]{1} : \\sqrt[3]{8} : \\sqrt[3]{27} = 1 : 2 : 3$.\nMisalkan panjang rusuk masing-masing adalah $x, 2x, 3x$.\nSetiap kubus memiliki 12 rusuk:\n$$12(x + 2x + 3x) = 144 \\implies 12(6x) = 72x = 144 \\implies x = 2 \\text{ cm}$$.\nRusuk terbesar $= 3x = 6$ cm, terkecil $= x = 2$ cm.\n$$\\text{Selisih} = 6 - 2 = 4 \\text{ cm}$$.'
  },
  {
    questionId: 'q_0466_matematika-leve',
    correctLabel: 'B',
    explanation: 'Mobil A berangkat 07.00 ($v_A = 60 \\text{ km/jam}$). Pada 07.30 (30 menit $= 0,5$ jam), Mobil A sudah menempuh $60 \\times 0,5 = 30$ km.\nSelisih kecepatan $= 80 - 60 = 20 \\text{ km/jam}$.\n$$\\text{Waktu menyusul} = \\frac{30}{20} = 1,5 \\text{ jam} = 1 \\text{ jam } 30 \\text{ menit}$$.\nMobil B menyusul pada pukul: $$07.30 + 01.30 = 09.00$$.'
  }
];

const CEO_2025_M2_FIXES: FixQuestion[] = [
  {
    questionId: 'q_ceo25_m2_01',
    correctLabel: 'A',
    explanation: 'Jumlah kaleng yang dibutuhkan adalah FPB dari 45 dan 50:\n$45 = 3^2 \\times 5$, $50 = 2 \\times 5^2 \\implies \\text{FPB} = 5$ kaleng.'
  },
  {
    questionId: 'q_ceo25_m2_02',
    correctLabel: 'C',
    optionsOverride: {
      A: '15/25',
      B: '95/120',
      C: '90/150',
      D: '85/150'
    },
    explanation: 'Sederhanakan pecahan $\\frac{90}{150} = \\frac{90 \\div 30}{150 \\div 30} = \\frac{3}{5}$.'
  },
  {
    questionId: 'q_ceo25_m2_03',
    correctLabel: 'B',
    explanation: 'Konversi tangga satuan panjang:\n$1 \\text{ dam} = 0,01 \\text{ km} \\implies 146 \\text{ dam} = 1,46 \\text{ km}$.'
  },
  {
    questionId: 'q_ceo25_m2_04',
    correctLabel: 'C',
    explanation: 'Analisis pilihan: 83 adalah bilangan ganjil murni.'
  },
  {
    questionId: 'q_ceo25_m2_05',
    correctLabel: 'B',
    explanation: 'Pada bilangan 49.768, angka puluhan adalah 6 ($\\ge 5$), sehingga dibulatkan ke atas menjadi **49.800**.'
  },
  {
    questionId: 'q_ceo25_m2_06',
    correctLabel: 'B',
    explanation: '$1 \\text{ rim} = 500 \\text{ lembar} \\implies 35 \\text{ rim} = 17.500 \\text{ lembar}$.\n$$\\text{Sisa kertas} = 17.500 - 6.799 = 10.701 \\text{ lembar}$$.'
  },
  {
    questionId: 'q_ceo25_m2_07',
    correctLabel: 'C',
    explanation: 'Total berat jambu $= 15 \\times 3,5 = 52,5 \\text{ kg}$.\nBanyak kantong penuh $= 52,5 \\div 0,8 = 65$ kantong sisa $0,5$ kg.\n$0,625$ bagian kantong setara dengan $6,25$ ons.'
  },
  {
    questionId: 'q_ceo25_m2_08',
    correctLabel: 'A',
    explanation: 'Akar pangkat tiga dan akar kuadrat:\n$$\\sqrt[3]{343} \\times \\sqrt{529} = 7 \\times 23 = 161$$.'
  },
  {
    questionId: 'q_ceo25_m2_09',
    correctLabel: 'C',
    explanation: 'Waktu selesai konser:\n$$19.15 + 3 \\text{ jam } 50 \\text{ menit} = 22.65 = 23.05$$.'
  },
  {
    questionId: 'q_ceo25_m2_10',
    correctLabel: 'A',
    explanation: 'Hasil $12 \\times 7 = 84$.\nPilihan A: $4 + (10 \\times 8) = 4 + 80 = 84$.'
  },
  {
    questionId: 'q_ceo25_m2_11',
    correctLabel: 'C',
    explanation: 'KPK(4, 6, 9) $= 36$.\nKelipatan 36 antara 100 dan 150 adalah $36 \\times 4 = 144$.'
  },
  {
    questionId: 'q_ceo25_m2_12',
    correctLabel: 'C',
    explanation: 'Deret 21 sampai 41:\nBilangan ganjil: $21, 23, \\dots, 41$ (11 bilangan)\nBilangan genap: $22, 24, \\dots, 40$ (10 bilangan)\nSetiap pasang $(21-22) + (23-24) + \\dots + (39-40) = 10 \\times (-1) = -10$.\nDitambah bilangan terakhir $41$: $$-10 + 41 = 31$$.'
  },
  {
    questionId: 'q_ceo25_m2_13',
    correctLabel: 'A',
    optionsOverride: {
      A: '95 dan 191',
      B: '96 dan 191',
      C: '95 dan 192',
      D: '97 dan 195'
    },
    explanation: 'Pola barisan: dikalikan 2 lalu ditambah 1 ($2n + 1$):\n$2 \\times 2 + 1 = 5$\n$5 \\times 2 + 1 = 11$\n$11 \\times 2 + 1 = 23$\n$23 \\times 2 + 1 = 47$\n$47 \\times 2 + 1 = 95$\n$95 \\times 2 + 1 = 191$.'
  },
  {
    questionId: 'q_ceo25_m2_14',
    correctLabel: 'B',
    explanation: 'Selisih umur selalu tetap: $K - C = 54$.\nKarena $K = 7C$, maka $7C - C = 6C = 54 \\implies C = 9$ tahun.\nUmur kakek $K = 63$ tahun.\n$$\\text{Total umur} = 63 + 9 = 72 \\text{ tahun}$$.'
  },
  {
    questionId: 'q_ceo25_m2_15',
    correctLabel: 'C',
    explanation: 'Keliling $= 2(p + l) = 42 \\implies 12 + l = 21 \\implies l = 9 \\text{ m}$.\n$$\\text{Luas} = 12 \\times 9 = 108 \\text{ m}^2 = 1.080.000 \\text{ cm}^2$$.'
  },
  {
    questionId: 'q_ceo25_m2_16',
    correctLabel: 'B',
    explanation: 'Limas segi-enam memiliki:\n- Sisi (bidang) $= 1 \\text{ alas} + 6 \\text{ tegak} = 7$\n- Titik sudut $= 1 \\text{ puncak} + 6 \\text{ alas} = 7$\n- Rusuk $= 6 \\text{ alas} + 6 \\text{ tegak} = 12$\n$$\\text{Total} = 7 + 7 + 12 = 26$$.'
  },
  {
    questionId: 'q_ceo25_m2_17',
    correctLabel: 'C',
    explanation: 'Urutan dari belakang $= 40 - 15 + 1 = 26$.'
  },
  {
    questionId: 'q_ceo25_m2_18',
    correctLabel: 'A',
    optionsOverride: {
      A: '12',
      B: '14',
      C: '16',
      D: '18'
    },
    explanation: 'Jumlah murid terbanyak adalah FPB dari 60, 48, dan 36:\n$$\\text{FPB}(60, 48, 36) = 12 \\text{ murid}$$.'
  },
  {
    questionId: 'q_ceo25_m2_19',
    correctLabel: 'C',
    optionsOverride: {
      A: '20',
      B: '25',
      C: '29',
      D: '35'
    },
    explanation: 'Berdasarkan pola palang persegi berarsir: total ada **29** persegi.'
  },
  {
    questionId: 'q_ceo25_m2_20',
    correctLabel: 'C',
    explanation: 'KPK dari 12, 20, dan 30 menit adalah 60 menit (1 jam).\nBerbunyi bersama lagi: $$08.45 + 01.00 = 09.45$$.'
  },
  {
    questionId: 'q_ceo25_m2_21',
    correctLabel: 'A',
    explanation: 'Dua bilangan prima yang berjumlah 44 adalah 3 dan 41 ($3 + 41 = 44$).\n$P_1 = 41$ dan $P_2 = 3$.\n$$P_1 - P_2 = 41 - 3 = 38$$.'
  },
  {
    questionId: 'q_ceo25_m2_22',
    correctLabel: 'C',
    optionsOverride: {
      A: '16',
      B: '18',
      C: '20',
      D: '22'
    },
    promptOverride: 'Di dalam sebuah peternakan terdapat total 35 ekor hewan yang terdiri dari bebek dan kambing. Jika dihitung jumlah seluruh kaki hewan adalah 100. Berapakah jumlah bebek yang ada di peternakan tersebut?',
    explanation: 'Misalkan bebek $= B$ (2 kaki) dan kambing $= K$ (4 kaki).\n$B + K = 35 \\implies 2B + 2K = 70$\n$2B + 4K = 100$\nKurangkan kedua persamaan: $2K = 30 \\implies K = 15$ kambing.\nJumlah bebek $B = 35 - 15 = 20$ ekor.'
  },
  {
    questionId: 'q_ceo25_m2_23',
    correctLabel: 'B',
    explanation: 'Konversi satuan waktu:\n- 3 abad $= 300$ tahun\n- 4 windu $= 32$ tahun\n- 2 lustrum $= 10$ tahun\n$$\\text{Total} = 300 + 32 + 10 = 342 \\text{ tahun}$$.'
  },
  {
    questionId: 'q_ceo25_m2_24',
    correctLabel: 'B',
    optionsOverride: {
      A: '9',
      B: '6',
      C: '15',
      D: '5'
    },
    explanation: 'Berdasarkan diagram lingkaran:\nPersentase hijau $= 20\\%$.\nBanyak siswa $= 20\\% \\times 30 = 6$ siswa.'
  },
  {
    questionId: 'q_ceo25_m2_25',
    correctLabel: 'C',
    optionsOverride: {
      A: '520',
      B: '560',
      C: '620',
      D: '64'
    },
    explanation: 'Pada bilangan 786:\n- Nilai angka 7 adalah 700\n- Nilai angka 8 adalah 80\n$$\\text{Selisih} = 700 - 80 = 620$$.'
  },
  {
    questionId: 'q_ceo25_m2_26',
    correctLabel: 'B',
    optionsOverride: {
      A: '8/20',
      B: '7/20',
      C: '8/12',
      D: '3/5'
    },
    explanation: 'Petak memiliki 20 kotak dengan 7 kotak yang diarsir, menunjukkan pecahan **$\\frac{7}{20}$**.'
  },
  {
    questionId: 'q_ceo25_m2_27',
    correctLabel: 'B',
    explanation: 'Rata-rata penggunaan air:\n$$\\text{Rata-rata} = \\frac{10 + 13 + 15 + 14}{4} = \\frac{52}{4} = 13 \\text{ liter}$$.'
  },
  {
    questionId: 'q_ceo25_m2_28',
    correctLabel: 'D',
    optionsOverride: {
      A: '245',
      B: '246',
      C: '252',
      D: '240'
    },
    explanation: 'Lukisan P dan A harus berdampingan, anggap sebagai 1 kelompok. Maka ada 5 unsur: $5! = 120$ susunan.\nDi dalam kelompok, P dan A dapat bertukar posisi ($2! = 2$ cara).\n$$\\text{Banyak cara} = 120 \\times 2 = 240 \\text{ cara}$$.'
  },
  {
    questionId: 'q_ceo25_m2_29',
    correctLabel: 'A',
    imageOverride: '/uploads/ceo2025_m2_q29_timbangan.png',
    explanation: 'Sistem persamaan dari 3 timbangan:\n1) Lingkaran ($L$) + Segitiga ($S$) = 11 kg $\\implies S = 11 - L$\n2) $2S + P = 19 \\implies 2(11 - L) + P = 19 \\implies P = 2L - 3$\n3) $P + 2L = 17 \\implies (2L - 3) + 2L = 17 \\implies 4L = 20 \\implies L = 5 \\text{ kg}$.\nJadi berat 1 lingkaran adalah **5 kg**.'
  },
  {
    questionId: 'q_ceo25_m2_30',
    correctLabel: 'D',
    explanation: 'Bangun datar yang memiliki 4 sisi, 4 sudut siku-siku ($90^\\circ$), dan 2 pasang sisi sejajar sama panjang adalah **persegi panjang**.'
  }
];

// =========================================================================
// RUNNER UTAMA
// =========================================================================
async function run() {
  console.log('🚀 Memulai audit & perbaikan kunci jawaban di SQLite & PostgreSQL...');
  const sqlite = new Database('./data/cerdasify.db');

  const allFixes = [
    ...PRISMA_2024_M1_FIXES,
    ...PRISMA_2025_M1_FIXES,
    ...PRISMA_2025_M2_FIXES,
    ...PRISMA_2025_M3_FIXES,
    ...CEO_2025_M2_FIXES
  ];

  console.log(`Total butir soal yang diaudit dan diperbaiki: ${allFixes.length}`);

  // 1. UPDATE DI SQLITE
  console.log('\n--- 1. Memperbarui SQLite ---');
  for (const fix of allFixes) {
    if (fix.promptOverride) {
      sqlite.prepare('UPDATE questions SET content_markdown = ? WHERE id = ?').run(fix.promptOverride, fix.questionId);
    }
    if (fix.imageOverride) {
      sqlite.prepare('UPDATE questions SET image_url = ? WHERE id = ?').run(fix.imageOverride, fix.questionId);
    }
    sqlite.prepare('UPDATE questions SET explanation_markdown = ? WHERE id = ?').run(fix.explanation, fix.questionId);

    if (fix.optionsOverride) {
      for (const [label, text] of Object.entries(fix.optionsOverride)) {
        sqlite.prepare('UPDATE question_options SET content_markdown = ? WHERE question_id = ? AND label = ?').run(text, fix.questionId, label);
      }
    }

    // Set semua opsi salah dulu
    sqlite.prepare('UPDATE question_options SET is_correct = 0, score_value = 0 WHERE question_id = ?').run(fix.questionId);
    // Set opsi yang benar
    sqlite.prepare('UPDATE question_options SET is_correct = 1, score_value = 4 WHERE question_id = ? AND label = ?').run(fix.questionId, fix.correctLabel);
  }
  console.log('✅ SQLite berhasil diperbarui!');

  // 2. UPDATE DI POSTGRESQL (PRODUCTION)
  console.log('\n--- 2. Memperbarui PostgreSQL (Production) ---');
  for (const fix of allFixes) {
    if (fix.promptOverride) {
      await client`UPDATE questions SET content_markdown = ${fix.promptOverride} WHERE id = ${fix.questionId}`;
    }
    if (fix.imageOverride) {
      await client`UPDATE questions SET image_url = ${fix.imageOverride} WHERE id = ${fix.questionId}`;
    }
    await client`UPDATE questions SET explanation_markdown = ${fix.explanation} WHERE id = ${fix.questionId}`;

    if (fix.optionsOverride) {
      for (const [label, text] of Object.entries(fix.optionsOverride)) {
        await client`UPDATE question_options SET content_markdown = ${text} WHERE question_id = ${fix.questionId} AND label = ${label}`;
      }
    }

    await client`UPDATE question_options SET is_correct = false, score_value = 0 WHERE question_id = ${fix.questionId}`;
    await client`UPDATE question_options SET is_correct = true, score_value = 4 WHERE question_id = ${fix.questionId} AND label = ${fix.correctLabel}`;
  }
  console.log('✅ PostgreSQL berhasil diperbarui!');

  // 3. REKALKULASI SELURUH ATTEMPT USER
  console.log('\n--- 3. Rekalkulasi Skor Attempt User ---');
  const attempts = await client`SELECT id, package_id, user_id FROM attempts`;
  console.log(`Menemukan ${attempts.length} attempt untuk direkalkulasi...`);

  for (const att of attempts) {
    // Ambil jawaban yang dipilih user
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
    console.log(`-> Attempt ${att.id} (${att.package_id}): Skor baru = ${totalScore}`);
  }

  // Rekalkulasi di SQLite juga
  const sqliteAttempts = sqlite.prepare('SELECT id, package_id FROM attempts').all() as any[];
  for (const att of sqliteAttempts) {
    const ansRows = sqlite.prepare(`
      SELECT aa.id, aa.question_id, aa.selected_option_ids, qo.score_value, qo.is_correct
      FROM attempt_answers aa
      LEFT JOIN question_options qo ON qo.id = json_extract(aa.selected_option_ids, '$[0]')
      WHERE aa.attempt_id = ?
    `).all(att.id) as any[];

    let totalScore = 0;
    for (const ans of ansRows) {
      const awarded = ans.is_correct ? 4 : 0;
      totalScore += awarded;
      sqlite.prepare('UPDATE attempt_answers SET score_awarded = ? WHERE id = ?').run(awarded, ans.id);
    }
    sqlite.prepare('UPDATE attempts SET score_total = ? WHERE id = ?').run(totalScore, att.id);
  }

  console.log('\n🎉 SEMUA KUNCI JAWABAN & ATTEMPT BERHASIL DI-EVALUASI DAN DIPERBAIKI SECARA AKURAT!');
  await client.end();
}

run().catch((err) => {
  console.error('Error saat eksekusi:', err);
  process.exit(1);
});
