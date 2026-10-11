// Materi Matematika — Fase B–C (SD Kelas 3–6): rumus, trik berhitung, dan teori bilangan.
// Isi materi ditulis dalam Markdown + KaTeX (dirender MathRenderer); kuis & catatan berupa teks biasa.
// Di dalam rumus KaTeX pakai ^\circ, bukan simbol °, karena ° di luar rumus otomatis dikonversi.

import type { SeedLesson } from './types';

/** Template String.raw → baris Markdown tanpa indentasi. Hindari `${` di dalam teks. */
const md = (s: string) =>
  s
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();

export const matematikaFaseBC: SeedLesson[] = [
  {
    slug: 'mtk-trik-perkalian-9',
    theme: 'Matematika: Trik Berhitung',
    emoji: '🖐️',
    title: 'Trik Perkalian 9',
    titleId: 'Menghitung kali 9 dengan jari dan pola angka',
    minutes: 5,
    intro: md(String.raw`
      Perkalian 9 punya trik yang seru. Kamu cukup memakai **10 jari tangan**!

      **Trik jari**
      • Bentangkan 10 jari. Beri nomor 1 sampai 10 dari kiri ke kanan.
      • Untuk $9 \times 4$, lipat jari **ke-4**.
      • Jari di kiri jari terlipat ada **3** → puluhan.
      • Jari di kanan jari terlipat ada **6** → satuan.
      • Jadi $9 \times 4 = 36$.

      **Trik pola angka**
      Perhatikan hasil kali 9:
      $$9,\ 18,\ 27,\ 36,\ 45,\ 54,\ 63,\ 72,\ 81,\ 90$$
      • Angka puluhan = bilangan pengali **dikurangi 1**.
      • Jumlah kedua angka hasilnya selalu **9**.
      • Contoh $9 \times 7$: puluhan $7 - 1 = 6$, satuan $9 - 6 = 3$. Hasilnya **63**.

      **Trik kali 10 lalu kurangi**
      $$9 \times n = 10 \times n - n$$
      Contoh: $9 \times 8 = 80 - 8 = 72$.

      > Cek jawabanmu: jumlahkan angka-angka hasilnya. Untuk $9 \times 1$ sampai $9 \times 10$, jumlahnya selalu 9.
    `),
    notes: [
      {
        title: 'Ingat Polanya',
        pattern: '9 × n = (n − 1) puluhan + (10 − n) satuan',
        explanation: 'Trik ini berlaku untuk 9 × 1 sampai 9 × 10.',
        examples: ['9 × 6 → puluhan 5, satuan 4 → 54', '9 × 9 → puluhan 8, satuan 1 → 81'],
      },
    ],
    quiz: [
      ['9 × 6 = …', ['54', '56', '45'], 0, 'Puluhan 6 − 1 = 5, satuan 9 − 5 = 4. Hasilnya 54.'],
      ['Dengan trik jari, jari ke-8 dilipat. Hasil 9 × 8 adalah …', ['81', '72', '64'], 1, 'Di kiri ada 7 jari, di kanan ada 2 jari → 72.'],
      ['9 × 12 bisa dihitung dengan …', ['120 − 12', '120 + 12', '90 − 12'], 0, '9 × 12 = 10 × 12 − 12 = 120 − 12 = 108.'],
      ['Jumlah angka-angka pada hasil 9 × 3 adalah …', ['6', '9', '12'], 1, '9 × 3 = 27, dan 2 + 7 = 9.'],
    ],
  },
  {
    slug: 'mtk-trik-kali-11-kali-5-kuadrat',
    theme: 'Matematika: Trik Berhitung',
    emoji: '⚡',
    title: 'Trik Kali 11, Kali 5, dan Kuadrat Berakhiran 5',
    titleId: 'Hitung cepat tanpa bersusun',
    minutes: 7,
    phaseMin: 'C',
    phaseMax: 'L',
    intro: md(String.raw`
      Trik-trik ini membuatmu bisa berhitung cepat di kepala, tanpa menulis bersusun.

      **1. Kali 11 (bilangan dua angka)**
      Tulis angka pertama, lalu **jumlah kedua angka**, lalu angka terakhir.
      $$43 \times 11 = 4\ \underbrace{(4+3)}_{7}\ 3 = 473$$
      Jika jumlahnya lebih dari 9, simpan 1 ke depan:
      $$78 \times 11 = 7\ (15)\ 8 = 858$$
      (puluhan 15 → tulis 5, simpan 1 sehingga 7 menjadi 8)

      **2. Kali 5 = kali 10 lalu dibagi 2**
      $$n \times 5 = \frac{n \times 10}{2}$$
      Contoh: $48 \times 5 = 480 : 2 = 240$.

      **3. Kali 25 = kali 100 lalu dibagi 4**
      Contoh: $36 \times 25 = 3.600 : 4 = 900$.

      **4. Kuadrat bilangan berakhiran 5**
      Kalikan angka depan dengan **angka berikutnya**, lalu tulis **25** di belakang.
      $$35^2 = \underbrace{3 \times 4}_{12}\ \underbrace{25} = 1.225$$
      • $65^2$: $6 \times 7 = 42$ → **4.225**
      • $85^2$: $8 \times 9 = 72$ → **7.225**

      > Mengapa trik kuadrat ini benar? $(10a + 5)^2 = 100a(a + 1) + 25$.
    `),
    notes: [
      {
        title: 'Kapan Memakai Trik Ini?',
        explanation:
          'Trik ini sangat berguna untuk soal hitungan cepat seperti TKA, olimpiade, dan TIU CPNS. Selalu cek jawaban dengan perkiraan kasar.',
        examples: ['52 × 11 → 5 (7) 2 = 572', '64 × 5 → 640 : 2 = 320', '45² → 4 × 5 = 20 → 2.025'],
      },
    ],
    quiz: [
      ['52 × 11 = …', ['562', '572', '5.211'], 1, 'Tulis 5, lalu 5 + 2 = 7, lalu 2 → 572.'],
      ['96 × 11 = …', ['1.056', '9.156', '1.066'], 0, '9 (15) 6 → tulis 5, simpan 1 ke 9 → 1.056.'],
      ['45² = …', ['1.625', '2.025', '2.045'], 1, '4 × 5 = 20, tulis 25 di belakang → 2.025.'],
      ['64 × 5 = …', ['320', '300', '345'], 0, '64 × 10 = 640, dibagi 2 = 320.'],
      ['44 × 25 = …', ['1.000', '1.100', '1.025'], 1, '4.400 : 4 = 1.100.'],
    ],
  },
  {
    slug: 'mtk-ciri-habis-dibagi',
    theme: 'Matematika: Teori Bilangan',
    emoji: '🔍',
    title: 'Ciri-Ciri Bilangan Habis Dibagi',
    titleId: 'Cek pembagian tanpa membagi',
    minutes: 6,
    phaseMin: 'B',
    phaseMax: 'D',
    intro: md(String.raw`
      Kita bisa tahu sebuah bilangan **habis dibagi** atau tidak, tanpa melakukan pembagian!

      • **Habis dibagi 2** → angka terakhirnya genap (0, 2, 4, 6, 8).
      • **Habis dibagi 3** → **jumlah semua angkanya** habis dibagi 3.
      • **Habis dibagi 4** → **dua angka terakhir** habis dibagi 4.
      • **Habis dibagi 5** → angka terakhirnya 0 atau 5.
      • **Habis dibagi 6** → habis dibagi 2 **dan** 3.
      • **Habis dibagi 8** → **tiga angka terakhir** habis dibagi 8.
      • **Habis dibagi 9** → jumlah semua angkanya habis dibagi 9.
      • **Habis dibagi 10** → angka terakhirnya 0.
      • **Habis dibagi 11** → selisih jumlah angka di posisi ganjil dan posisi genap habis dibagi 11.

      **Contoh**
      • 2.418: $2 + 4 + 1 + 8 = 15$ → habis dibagi 3 ($2.418 : 3 = 806$), tetapi tidak habis dibagi 9.
      • 4.716: $4 + 7 + 1 + 6 = 18$ → habis dibagi 9 ($4.716 : 9 = 524$).
      • 1.324: dua angka terakhir 24 habis dibagi 4 → 1.324 habis dibagi 4.
      • 2.574: $(2 + 7) - (5 + 4) = 0$ → habis dibagi 11 ($2.574 : 11 = 234$).

      > Bilangan yang habis dibagi 9 pasti habis dibagi 3, tetapi belum tentu sebaliknya.
    `),
    quiz: [
      ['Bilangan yang habis dibagi 3 adalah …', ['1.235', '1.236', '2.014'], 1, '1 + 2 + 3 + 6 = 12, dan 12 habis dibagi 3.'],
      ['Bilangan yang habis dibagi 4 adalah …', ['3.514', '3.522', '3.516'], 2, 'Dua angka terakhir 16 habis dibagi 4.'],
      ['Bilangan yang habis dibagi 6 adalah …', ['1.134', '1.135', '1.144'], 0, '1.134 genap dan 1 + 1 + 3 + 4 = 9 habis dibagi 3.'],
      ['Bilangan yang habis dibagi 9 adalah …', ['5.104', '5.103', '5.113'], 1, '5 + 1 + 0 + 3 = 9, habis dibagi 9.'],
    ],
  },
  {
    slug: 'mtk-kpk-fpb',
    theme: 'Matematika: Teori Bilangan',
    emoji: '🧩',
    title: 'KPK dan FPB',
    titleId: 'Faktorisasi prima dan soal cerita',
    minutes: 8,
    phaseMin: 'C',
    phaseMax: 'D',
    intro: md(String.raw`
      **Bilangan prima** adalah bilangan yang hanya punya dua faktor: 1 dan dirinya sendiri.
      $$2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19,\ 23,\ 29,\ \dots$$
      (1 **bukan** bilangan prima, dan 2 adalah satu-satunya prima genap.)

      **Faktorisasi prima** = menulis bilangan sebagai perkalian bilangan prima.
      $$12 = 2^2 \times 3 \qquad 18 = 2 \times 3^2$$

      **Rumus FPB (Faktor Persekutuan Terbesar)**
      Ambil faktor prima yang **sama**, pilih pangkat **terkecil**.
      $$\text{FPB}(12, 18) = 2 \times 3 = 6$$

      **Rumus KPK (Kelipatan Persekutuan Terkecil)**
      Ambil **semua** faktor prima, pilih pangkat **terbesar**.
      $$\text{KPK}(12, 18) = 2^2 \times 3^2 = 36$$

      **Teori penting** untuk dua bilangan:
      $$\text{FPB}(a, b) \times \text{KPK}(a, b) = a \times b$$
      Cek: $6 \times 36 = 216 = 12 \times 18$ ✓

      **Trik membedakan soal cerita**
      • **KPK** → kata kunci *bersamaan lagi*, *bertemu lagi*, *berbunyi bersama*.
      Lampu A berkedip tiap 4 detik, lampu B tiap 6 detik. Keduanya berkedip bersama lagi setelah KPK(4, 6) = **12 detik**.
      • **FPB** → kata kunci *dibagi sama banyak*, *sebanyak-banyaknya*.
      24 apel dan 36 jeruk dibagikan sama rata ke kantong sebanyak-banyaknya. FPB(24, 36) = **12 kantong**, setiap kantong berisi 2 apel dan 3 jeruk.
    `),
    notes: [
      {
        title: 'Jembatan Keledai',
        pattern: 'FPB: sama & terkecil · KPK: semua & terbesar',
        explanation: 'FPB tidak mungkin lebih besar dari bilangan terkecil, dan KPK tidak mungkin lebih kecil dari bilangan terbesar.',
        examples: ['FPB(16, 24) = 8', 'KPK(6, 8) = 24'],
      },
    ],
    quiz: [
      ['FPB dari 16 dan 24 adalah …', ['4', '8', '48'], 1, '16 = 2⁴, 24 = 2³ × 3. Faktor sama dengan pangkat terkecil: 2³ = 8.'],
      ['KPK dari 6 dan 8 adalah …', ['48', '24', '2'], 1, '6 = 2 × 3, 8 = 2³. KPK = 2³ × 3 = 24.'],
      ['Faktorisasi prima dari 60 adalah …', ['2 × 30', '2² × 3 × 5', '4 × 15'], 1, '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5.'],
      ['Andi berenang setiap 3 hari, Budi setiap 4 hari. Hari ini mereka berenang bersama. Mereka bersama lagi setelah … hari.', ['7', '12', '1'], 1, 'Soal "bersama lagi" memakai KPK(3, 4) = 12.'],
      ['30 pensil dan 45 buku dibagikan sama banyak kepada sebanyak-banyaknya anak. Banyak anak adalah …', ['15', '5', '90'], 0, 'Soal "dibagi sama banyak, sebanyak-banyaknya" memakai FPB(30, 45) = 15.'],
    ],
  },
  {
    slug: 'mtk-rumus-bangun-datar',
    theme: 'Matematika: Rumus Geometri',
    emoji: '📐',
    title: 'Rumus Keliling dan Luas Bangun Datar',
    titleId: 'Persegi sampai lingkaran',
    minutes: 8,
    phaseMin: 'B',
    phaseMax: 'D',
    intro: md(String.raw`
      **Keliling** = panjang seluruh tepi bangun. **Luas** = besar daerah di dalam bangun (satuannya persegi, misalnya cm²).

      🟥 **Persegi** (sisi $s$)
      $$K = 4s \qquad L = s \times s = s^2$$

      ▭ **Persegi panjang** (panjang $p$, lebar $l$)
      $$K = 2(p + l) \qquad L = p \times l$$

      🔺 **Segitiga** (alas $a$, tinggi $t$)
      $$L = \frac{1}{2} \times a \times t$$

      ▱ **Jajargenjang**
      $$L = a \times t$$

      ⏢ **Trapesium** (sisi sejajar $a$ dan $b$)
      $$L = \frac{1}{2} \times (a + b) \times t$$

      🔶 **Belah ketupat & layang-layang** (diagonal $d_1$ dan $d_2$)
      $$L = \frac{1}{2} \times d_1 \times d_2$$

      ⚪ **Lingkaran** (jari-jari $r$, diameter $d = 2r$)
      $$K = 2\pi r = \pi d \qquad L = \pi r^2$$
      Pakai $\pi = \frac{22}{7}$ jika jari-jari kelipatan 7, selain itu $\pi = 3{,}14$.

      **Contoh**
      • Lingkaran $r = 7$ cm: $K = 2 \times \frac{22}{7} \times 7 = 44$ cm, $L = \frac{22}{7} \times 49 = 154$ cm².
      • Trapesium $a = 6$, $b = 10$, $t = 4$: $L = \frac{1}{2} \times 16 \times 4 = 32$ cm².

      > Trik: segitiga adalah **setengah** persegi panjang, jadi luasnya setengah dari alas × tinggi.
    `),
    notes: [
      {
        title: 'Kesalahan yang Sering Terjadi',
        explanation:
          'Tinggi segitiga dan jajargenjang harus tegak lurus dengan alasnya, bukan sisi miringnya. Jangan tertukar memakai diameter sebagai jari-jari.',
        examples: ['Diameter 14 cm → jari-jari 7 cm', 'Satuan luas: cm², m²; satuan keliling: cm, m'],
      },
    ],
    quiz: [
      ['Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah …', ['26 cm²', '40 cm²', '13 cm²'], 1, 'L = 8 × 5 = 40 cm².'],
      ['Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah …', ['60 cm²', '30 cm²', '16 cm²'], 1, 'L = ½ × 10 × 6 = 30 cm².'],
      ['Keliling lingkaran berdiameter 14 cm adalah … (π = 22/7)', ['44 cm', '154 cm', '88 cm'], 0, 'K = π × d = 22/7 × 14 = 44 cm.'],
      ['Luas lingkaran berjari-jari 10 cm adalah … (π = 3,14)', ['31,4 cm²', '62,8 cm²', '314 cm²'], 2, 'L = 3,14 × 10 × 10 = 314 cm².'],
      ['Belah ketupat dengan diagonal 12 cm dan 8 cm memiliki luas …', ['96 cm²', '48 cm²', '20 cm²'], 1, 'L = ½ × 12 × 8 = 48 cm².'],
    ],
  },
  {
    slug: 'mtk-rumus-bangun-ruang',
    theme: 'Matematika: Rumus Geometri',
    emoji: '🧊',
    title: 'Rumus Volume dan Luas Permukaan Bangun Ruang',
    titleId: 'Kubus, balok, prisma, limas, tabung, kerucut, bola',
    minutes: 9,
    phaseMin: 'C',
    phaseMax: 'D',
    intro: md(String.raw`
      **Volume** = isi bangun ruang (cm³). **Luas permukaan** = jumlah luas semua sisinya (cm²).

      🧊 **Kubus** (rusuk $s$)
      $$V = s^3 \qquad LP = 6s^2$$

      📦 **Balok** (panjang $p$, lebar $l$, tinggi $t$)
      $$V = p \times l \times t \qquad LP = 2(pl + pt + lt)$$

      🔷 **Prisma** dan 🥫 **Tabung**
      $$V = \text{luas alas} \times t \qquad V_{\text{tabung}} = \pi r^2 t$$
      $$LP_{\text{tabung}} = 2\pi r(r + t)$$

      🔺 **Limas** dan 🍦 **Kerucut**
      $$V = \frac{1}{3} \times \text{luas alas} \times t \qquad V_{\text{kerucut}} = \frac{1}{3}\pi r^2 t$$
      $$LP_{\text{kerucut}} = \pi r(r + s), \quad s = \sqrt{r^2 + t^2}$$

      ⚽ **Bola**
      $$V = \frac{4}{3}\pi r^3 \qquad LP = 4\pi r^2$$

      **Contoh**
      • Balok $10 \times 6 \times 4$ cm: $V = 240$ cm³, $LP = 2(60 + 40 + 24) = 248$ cm².
      • Tabung $r = 7$, $t = 10$: $V = \frac{22}{7} \times 49 \times 10 = 1.540$ cm³.

      **Teori penting**
      > Volume limas = ⅓ volume prisma, dan volume kerucut = ⅓ volume tabung, jika alas dan tingginya sama. Tiga kerucut air tepat memenuhi satu tabung!
    `),
    notes: [
      {
        title: 'Satuan Volume',
        pattern: '1 liter = 1 dm³ = 1.000 cm³',
        explanation: 'Satuan volume naik atau turun satu tingkat berarti dikali atau dibagi 1.000.',
        examples: ['1 m³ = 1.000 dm³ = 1.000 liter', '1 mL = 1 cm³'],
      },
    ],
    quiz: [
      ['Volume kubus dengan rusuk 5 cm adalah …', ['25 cm³', '125 cm³', '150 cm³'], 1, 'V = 5 × 5 × 5 = 125 cm³.'],
      ['Luas permukaan kubus dengan rusuk 5 cm adalah …', ['150 cm²', '125 cm²', '100 cm²'], 0, 'LP = 6 × 5² = 150 cm².'],
      ['Volume balok 8 cm × 5 cm × 3 cm adalah …', ['16 cm³', '120 cm³', '158 cm³'], 1, 'V = 8 × 5 × 3 = 120 cm³.'],
      ['Volume kerucut dengan r = 7 cm dan t = 12 cm adalah … (π = 22/7)', ['1.848 cm³', '616 cm³', '264 cm³'], 1, 'V = ⅓ × 22/7 × 49 × 12 = 616 cm³.'],
      ['Sebuah kubus bervolume 64 cm³. Panjang rusuknya …', ['8 cm', '4 cm', '16 cm'], 1, '4 × 4 × 4 = 64, jadi rusuknya 4 cm.'],
    ],
  },
  {
    slug: 'mtk-pecahan-desimal-persen',
    theme: 'Matematika: Pecahan & Persen',
    emoji: '🍕',
    title: 'Pecahan, Desimal, dan Persen',
    titleId: 'Operasi pecahan dan trik persen',
    minutes: 8,
    phaseMin: 'C',
    phaseMax: 'D',
    intro: md(String.raw`
      **Penjumlahan & pengurangan pecahan** → samakan penyebutnya dulu (pakai KPK).
      $$\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}$$

      **Perkalian** → pembilang × pembilang, penyebut × penyebut.
      $$\frac{2}{3} \times \frac{3}{5} = \frac{6}{15} = \frac{2}{5}$$

      **Pembagian** → kalikan dengan **kebalikan** pecahan kedua.
      $$\frac{2}{3} : \frac{4}{5} = \frac{2}{3} \times \frac{5}{4} = \frac{10}{12} = \frac{5}{6}$$

      **Persen** artinya per seratus: $25\% = \frac{25}{100} = \frac{1}{4} = 0{,}25$.

      **Hafalkan pasangan ini, hitunganmu jadi cepat:**
      • $50\% = \frac{1}{2}$, $25\% = \frac{1}{4}$, $75\% = \frac{3}{4}$
      • $20\% = \frac{1}{5}$, $10\% = \frac{1}{10}$, $12{,}5\% = \frac{1}{8}$
      • $33\frac{1}{3}\% = \frac{1}{3}$

      **Contoh diskon**
      Harga tas Rp80.000, diskon 25%. Potongan $= \frac{1}{4} \times 80.000 = 20.000$. Bayar **Rp60.000**.

      **Trik tukar persen**
      $$a\% \text{ dari } b = b\% \text{ dari } a$$
      8% dari 50 sulit? Hitung 50% dari 8 = **4**. Hasilnya sama!
    `),
    notes: [
      {
        title: 'Mengubah Bentuk',
        pattern: 'Pecahan → Persen: kalikan 100%',
        explanation: 'Desimal ke persen: geser koma dua langkah ke kanan. Persen ke desimal: geser dua langkah ke kiri.',
        examples: ['3/5 = 3/5 × 100% = 60%', '0,35 = 35%', '7% = 0,07'],
      },
    ],
    quiz: [
      ['1/4 + 2/3 = …', ['3/7', '11/12', '3/12'], 1, '3/12 + 8/12 = 11/12.'],
      ['3/4 : 1/2 = …', ['3/8', '3/2', '2/3'], 1, '3/4 × 2/1 = 6/4 = 3/2.'],
      ['Bentuk pecahan dari 0,75 adalah …', ['3/4', '7/5', '1/75'], 0, '0,75 = 75/100 = 3/4.'],
      ['30% dari 150 adalah …', ['45', '50', '35'], 0, '10% dari 150 = 15, jadi 30% = 45.'],
      ['Harga sepatu Rp120.000 diskon 20%. Harga yang dibayar …', ['Rp100.000', 'Rp96.000', 'Rp24.000'], 1, 'Potongan 20% × 120.000 = 24.000. Bayar 120.000 − 24.000 = 96.000.'],
      ['16% dari 25 = …', ['4', '40', '1,6'], 0, 'Tukar persen: 25% dari 16 = ¼ × 16 = 4.'],
    ],
  },
  {
    slug: 'mtk-kecepatan-debit-skala',
    theme: 'Matematika: Rumus Pengukuran',
    emoji: '🚗',
    title: 'Rumus Kecepatan, Debit, dan Skala',
    titleId: 'Jarak–waktu, aliran air, dan peta',
    minutes: 8,
    phaseMin: 'C',
    phaseMax: 'D',
    intro: md(String.raw`
      **Kecepatan** ($v$) = jarak ($s$) dibagi waktu ($t$).
      $$v = \frac{s}{t} \qquad s = v \times t \qquad t = \frac{s}{v}$$
      Contoh: mobil menempuh 180 km dalam 3 jam → $v = 180 : 3 = 60$ km/jam.

      **Kecepatan rata-rata** = total jarak : total waktu (bukan rata-rata dua kecepatan!).
      Pergi 120 km dalam 2 jam, pulang 120 km dalam 3 jam → $v = \frac{240}{5} = 48$ km/jam.

      **Berpapasan** (berangkat bersamaan dari dua kota, saling mendekat):
      $$t = \frac{\text{jarak}}{v_1 + v_2}$$

      **Debit** ($D$) = volume ($V$) dibagi waktu.
      $$D = \frac{V}{t}$$
      Contoh: 60 liter air keluar dalam 5 menit → $D = 12$ liter/menit.

      **Skala** = jarak pada peta : jarak sebenarnya.
      $$\text{jarak sebenarnya} = \frac{\text{jarak peta}}{\text{skala}}$$
      Skala 1 : 500.000, jarak peta 4 cm → $4 \times 500.000 = 2.000.000$ cm = **20 km**.

      > Ingat konversi: 1 km = 100.000 cm, 1 jam = 60 menit, 1 liter = 1 dm³.
    `),
    notes: [
      {
        title: 'Segitiga Ajaib JKW',
        pattern: 'J di atas, K × W di bawah',
        explanation:
          'Tutup besaran yang dicari. Jika J (jarak) yang ditutup, sisanya K × W. Jika K ditutup, sisanya J : W. Jika W ditutup, sisanya J : K.',
        examples: ['J = K × W', 'K = J : W', 'W = J : K'],
      },
    ],
    quiz: [
      ['Sepeda motor menempuh 150 km dalam 2,5 jam. Kecepatannya …', ['50 km/jam', '60 km/jam', '75 km/jam'], 1, 'v = 150 : 2,5 = 60 km/jam.'],
      ['Mobil melaju 45 km/jam selama 4 jam. Jarak yang ditempuh …', ['180 km', '49 km', '11,25 km'], 0, 's = 45 × 4 = 180 km.'],
      ['Skala peta 1 : 200.000. Jarak pada peta 5 cm. Jarak sebenarnya …', ['1 km', '10 km', '100 km'], 1, '5 × 200.000 = 1.000.000 cm = 10 km.'],
      ['Debit keran 20 liter/menit. Waktu untuk mengisi bak 300 liter …', ['15 menit', '6.000 menit', '280 menit'], 0, 't = V : D = 300 : 20 = 15 menit.'],
      ['Kota A dan B berjarak 210 km. Mobil dari A melaju 40 km/jam, dari B 30 km/jam, berangkat bersamaan. Mereka berpapasan setelah …', ['7 jam', '3 jam', '5 jam'], 1, 't = 210 : (40 + 30) = 3 jam.'],
    ],
  },
  {
    slug: 'mtk-rata-rata-median-modus',
    theme: 'Matematika: Statistika',
    emoji: '📊',
    title: 'Rata-Rata, Median, dan Modus',
    titleId: 'Mengolah data dan trik rata-rata gabungan',
    minutes: 8,
    phaseMin: 'C',
    phaseMax: 'D',
    intro: md(String.raw`
      Data nilai ulangan: **7, 9, 5, 9, 6, 8, 9, 7** (8 data).

      **Rata-rata (mean)** = jumlah data : banyak data.
      $$\bar{x} = \frac{7 + 9 + 5 + 9 + 6 + 8 + 9 + 7}{8} = \frac{60}{8} = 7{,}5$$

      **Median** = nilai tengah setelah data **diurutkan**.
      Urutkan: 5, 6, 7, **7, 8**, 9, 9, 9
      Banyak data genap → median = rata-rata dua data tengah $= \frac{7 + 8}{2} = 7{,}5$.

      **Modus** = data yang **paling sering** muncul → **9** (muncul 3 kali).

      **Trik rata-rata gabungan**
      $$\bar{x}_{\text{gab}} = \frac{n_1 \bar{x}_1 + n_2 \bar{x}_2}{n_1 + n_2}$$
      Kelas A: 20 siswa, rata-rata 70. Kelas B: 30 siswa, rata-rata 80.
      $$\bar{x}_{\text{gab}} = \frac{1.400 + 2.400}{50} = 76$$

      **Trik nilai yang dibutuhkan**
      Rata-rata 4 ulangan = 75. Agar rata-rata 5 ulangan menjadi 78, nilai ulangan ke-5:
      $$5 \times 78 - 4 \times 75 = 390 - 300 = 90$$

      > Rata-rata gabungan selalu lebih dekat ke kelompok yang anggotanya lebih banyak.
    `),
    quiz: [
      ['Rata-rata dari 4, 6, 8, 10, 12 adalah …', ['8', '10', '6'], 0, '(4 + 6 + 8 + 10 + 12) : 5 = 40 : 5 = 8.'],
      ['Median dari 3, 9, 4, 7, 5 adalah …', ['4', '5', '7'], 1, 'Urutkan: 3, 4, 5, 7, 9. Nilai tengahnya 5.'],
      ['Modus dari 2, 3, 3, 4, 4, 4, 5 adalah …', ['3', '4', '5'], 1, 'Angka 4 muncul paling sering (3 kali).'],
      ['10 anak memiliki rata-rata nilai 60, dan 15 anak lain rata-ratanya 70. Rata-rata gabungannya …', ['65', '66', '64'], 1, '(600 + 1.050) : 25 = 66.'],
      ['Rata-rata 3 ulangan Sari 80. Agar rata-rata 4 ulangan menjadi 82, nilai ulangan ke-4 harus …', ['84', '88', '90'], 1, '4 × 82 − 3 × 80 = 328 − 240 = 88.'],
    ],
  },
];
