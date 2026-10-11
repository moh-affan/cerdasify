// Materi Matematika — Fase D (SMP Kelas 7–9): rumus, teorema, dan trik hitung cepat.
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

export const matematikaFaseD: SeedLesson[] = [
  {
    slug: 'mtk-teorema-pythagoras',
    theme: 'Matematika: Teorema Geometri',
    emoji: '📏',
    title: 'Teorema Pythagoras dan Tripel Pythagoras',
    titleId: 'Sisi miring segitiga siku-siku',
    minutes: 8,
    phaseMax: 'L',
    intro: md(String.raw`
      **Teorema Pythagoras**: pada segitiga siku-siku, kuadrat sisi miring ($c$) sama dengan jumlah kuadrat kedua sisi siku-sikunya ($a$ dan $b$).
      $$c^2 = a^2 + b^2$$

      **Mengapa benar? (bukti susun ulang)**
      Susun 4 segitiga siku-siku yang sama di dalam persegi bersisi $(a + b)$, sehingga di tengahnya terbentuk persegi bersisi $c$.
      $$(a + b)^2 = 4 \cdot \tfrac{1}{2}ab + c^2 \;\Rightarrow\; a^2 + 2ab + b^2 = 2ab + c^2 \;\Rightarrow\; a^2 + b^2 = c^2$$

      **Tripel Pythagoras** (hafalkan, soal jadi kilat!)
      • $3, 4, 5$ dan kelipatannya: $6, 8, 10$ · $9, 12, 15$ · $15, 20, 25$
      • $5, 12, 13$ · $8, 15, 17$ · $7, 24, 25$ · $20, 21, 29$

      **Menentukan jenis segitiga** ($c$ = sisi terpanjang)
      • $c^2 = a^2 + b^2$ → siku-siku
      • $c^2 < a^2 + b^2$ → lancip
      • $c^2 > a^2 + b^2$ → tumpul

      **Segitiga istimewa**
      • Sudut $30^\circ$–$60^\circ$–$90^\circ$ → perbandingan sisi $1 : \sqrt{3} : 2$
      • Sudut $45^\circ$–$45^\circ$–$90^\circ$ → perbandingan sisi $1 : 1 : \sqrt{2}$

      > Diagonal persegi bersisi $s$ adalah $s\sqrt{2}$; diagonal ruang kubus bersisi $s$ adalah $s\sqrt{3}$.
    `),
    notes: [
      {
        title: 'Trik Kelipatan',
        explanation: 'Jika semua sisi punya faktor sama, bagi dulu, kenali tripelnya, lalu kalikan kembali.',
        examples: ['Sisi 30 dan 40 → bagi 10 → 3, 4, 5 → sisi miring 50', 'Sisi 10 dan 24 → bagi 2 → 5, 12, 13 → sisi miring 26'],
      },
    ],
    quiz: [
      ['Sisi siku-siku sebuah segitiga 9 cm dan 12 cm. Sisi miringnya …', ['15 cm', '21 cm', '13 cm'], 0, '9, 12, 15 adalah kelipatan 3 dari 3, 4, 5.'],
      ['Sisi siku-siku 10 cm dan 24 cm. Sisi miringnya …', ['34 cm', '26 cm', '25 cm'], 1, '10, 24, 26 = 2 × (5, 12, 13).'],
      ['Segitiga dengan sisi 4, 5, dan 7 termasuk segitiga …', ['Siku-siku', 'Lancip', 'Tumpul'], 2, '7² = 49 > 4² + 5² = 41, jadi tumpul.'],
      ['Tangga sepanjang 13 m bersandar di tembok. Kaki tangga berjarak 5 m dari tembok. Tinggi ujung tangga …', ['12 m', '8 m', '18 m'], 0, 'Tripel 5, 12, 13 → tingginya 12 m.'],
      ['Panjang diagonal persegi bersisi 5 cm adalah …', ['10 cm', '5√2 cm', '5√3 cm'], 1, 'Diagonal persegi = s√2 = 5√2 cm.'],
    ],
  },
  {
    slug: 'mtk-identitas-aljabar',
    theme: 'Matematika: Aljabar',
    emoji: '🔣',
    title: 'Rumus Aljabar Istimewa',
    titleId: 'Kuadrat sempurna, selisih kuadrat, dan trik hitung',
    minutes: 8,
    phaseMax: 'L',
    intro: md(String.raw`
      **Rumus-rumus wajib hafal**
      $$(a + b)^2 = a^2 + 2ab + b^2$$
      $$(a - b)^2 = a^2 - 2ab + b^2$$
      $$a^2 - b^2 = (a + b)(a - b)$$
      $$a^2 + b^2 = (a + b)^2 - 2ab$$
      $$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$
      $$a^3 + b^3 = (a + b)(a^2 - ab + b^2) \qquad a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$

      **Trik hitung cepat memakai rumus**
      • $99^2 = (100 - 1)^2 = 10.000 - 200 + 1 = 9.801$
      • $103^2 = (100 + 3)^2 = 10.000 + 600 + 9 = 10.609$
      • $51 \times 49 = (50 + 1)(50 - 1) = 2.500 - 1 = 2.499$
      • $1.001^2 - 999^2 = (2.000)(2) = 4.000$

      **Trik soal "tanpa mencari nilai a dan b"**
      Jika $a + b = 7$ dan $ab = 12$, maka
      $$a^2 + b^2 = 7^2 - 2(12) = 25$$

      > Selisih kuadrat adalah rumus paling sering keluar di soal olimpiade dan TKA. Setiap melihat bentuk $\square^2 - \square^2$, langsung faktorkan!
    `),
    quiz: [
      ['102 × 98 = …', ['9.996', '10.004', '9.986'], 0, '(100 + 2)(100 − 2) = 10.000 − 4 = 9.996.'],
      ['Bentuk faktor dari x² − 49 adalah …', ['(x − 7)²', '(x + 7)(x − 7)', '(x − 49)(x + 1)'], 1, 'Selisih kuadrat: x² − 7² = (x + 7)(x − 7).'],
      ['Jika a + b = 5 dan ab = 6, maka a² + b² = …', ['13', '25', '19'], 0, 'a² + b² = 5² − 2(6) = 25 − 12 = 13.'],
      ['201² = …', ['40.401', '40.201', '4.401'], 0, '(200 + 1)² = 40.000 + 400 + 1 = 40.401.'],
      ['Hasil dari (x + 3)² adalah …', ['x² + 9', 'x² + 3x + 9', 'x² + 6x + 9'], 2, '(x + 3)² = x² + 2·3·x + 9 = x² + 6x + 9.'],
    ],
  },
  {
    slug: 'mtk-persamaan-linear-spldv',
    theme: 'Matematika: Aljabar',
    emoji: '⚖️',
    title: 'Persamaan Linear dan SPLDV',
    titleId: 'Substitusi, eliminasi, dan trik koefisien simetris',
    minutes: 9,
    intro: md(String.raw`
      **Persamaan linear satu variabel**: pindahkan suku sejenis ke satu ruas (tanda berubah saat pindah ruas).
      $$3x - 7 = 2x + 5 \;\Rightarrow\; 3x - 2x = 5 + 7 \;\Rightarrow\; x = 12$$

      **Sistem Persamaan Linear Dua Variabel (SPLDV)**
      $$\begin{cases} x + 2y = 11 \\ 3x - y = 5 \end{cases}$$

      **Cara substitusi**: dari persamaan kedua, $y = 3x - 5$. Masukkan ke persamaan pertama:
      $$x + 2(3x - 5) = 11 \Rightarrow 7x = 21 \Rightarrow x = 3,\ y = 4$$

      **Cara eliminasi**: kalikan persamaan kedua dengan 2, lalu jumlahkan:
      $$\begin{array}{r} x + 2y = 11 \\ 6x - 2y = 10 \\ \hline 7x = 21 \end{array} \;+$$

      **Trik koefisien simetris**
      $$\begin{cases} 3x + 2y = 12 \\ 2x + 3y = 13 \end{cases}$$
      • Jumlahkan: $5x + 5y = 25 \Rightarrow x + y = 5$
      • Kurangkan: $x - y = -1$
      • Jadi $x = 2$, $y = 3$.

      **Soal cerita**
      2 buku + 3 pensil = Rp19.000, dan 1 buku + 2 pensil = Rp11.000.
      Kalikan persamaan kedua dengan 2: 2 buku + 4 pensil = Rp22.000. Kurangkan → **1 pensil = Rp3.000**, lalu 1 buku = Rp11.000 − Rp6.000 = **Rp5.000**.

      > Selalu cek jawaban dengan memasukkannya ke **kedua** persamaan.
    `),
    quiz: [
      ['Penyelesaian dari 3x − 7 = 2x + 5 adalah …', ['x = 2', 'x = 12', 'x = −2'], 1, '3x − 2x = 5 + 7, jadi x = 12.'],
      ['Jika x + y = 12 dan x − y = 4, maka x = …', ['8', '4', '6'], 0, 'Jumlahkan: 2x = 16, x = 8.'],
      ['Jika 4x + 3y = 24 dan 3x + 4y = 25, maka x + y = …', ['7', '49', '1'], 0, 'Jumlahkan: 7x + 7y = 49, jadi x + y = 7.'],
      ['Umur ayah 3 kali umur anaknya. Jumlah umur mereka 48 tahun. Umur anak …', ['16 tahun', '12 tahun', '36 tahun'], 1, 'a + 3a = 48 → 4a = 48 → a = 12.'],
    ],
  },
  {
    slug: 'mtk-gradien-persamaan-garis',
    theme: 'Matematika: Aljabar',
    emoji: '📈',
    title: 'Gradien dan Persamaan Garis Lurus',
    titleId: 'Kemiringan, garis sejajar, dan tegak lurus',
    minutes: 8,
    phaseMax: 'E',
    intro: md(String.raw`
      **Gradien** ($m$) = kemiringan garis = perubahan $y$ dibagi perubahan $x$.

      **Rumus gradien**
      • Melalui dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:
      $$m = \frac{y_2 - y_1}{x_2 - x_1}$$
      • Dari $y = mx + c$ → gradiennya $m$.
      • Dari $ax + by + c = 0$ → $m = -\frac{a}{b}$.

      **Persamaan garis**
      • Melalui titik $(x_1, y_1)$ dengan gradien $m$:
      $$y - y_1 = m(x - x_1)$$

      **Contoh**: garis melalui $(1, 2)$ dan $(3, 8)$.
      $$m = \frac{8 - 2}{3 - 1} = 3, \qquad y - 2 = 3(x - 1) \Rightarrow y = 3x - 1$$

      **Teori hubungan dua garis**
      • **Sejajar** → $m_1 = m_2$
      • **Tegak lurus** → $m_1 \times m_2 = -1$
      Contoh: garis yang tegak lurus $y = 3x + 2$ bergradien $-\frac{1}{3}$.

      > Gradien positif → garis naik dari kiri ke kanan; gradien negatif → turun; gradien 0 → mendatar.
    `),
    quiz: [
      ['Gradien garis 2x + 4y − 8 = 0 adalah …', ['2', '−1/2', '1/2'], 1, 'm = −a/b = −2/4 = −1/2.'],
      ['Gradien garis yang melalui (2, 5) dan (4, 9) adalah …', ['2', '4', '1/2'], 0, 'm = (9 − 5)/(4 − 2) = 4/2 = 2.'],
      ['Garis tegak lurus dengan garis bergradien 3 memiliki gradien …', ['3', '−3', '−1/3'], 2, 'm₁ × m₂ = −1 → m₂ = −1/3.'],
      ['Persamaan garis bergradien 2 yang melalui (1, 3) adalah …', ['y = 2x + 1', 'y = 2x + 3', 'y = x + 2'], 0, 'y − 3 = 2(x − 1) → y = 2x + 1.'],
    ],
  },
  {
    slug: 'mtk-pangkat-dan-akar',
    theme: 'Matematika: Aljabar',
    emoji: '🚀',
    title: 'Sifat Bilangan Berpangkat dan Bentuk Akar',
    titleId: 'Eksponen, akar, dan merasionalkan penyebut',
    minutes: 9,
    phaseMax: 'E',
    intro: md(String.raw`
      **Sifat-sifat pangkat** ($a \neq 0$)
      $$a^m \times a^n = a^{m+n} \qquad \frac{a^m}{a^n} = a^{m-n} \qquad (a^m)^n = a^{mn}$$
      $$(ab)^n = a^n b^n \qquad a^0 = 1 \qquad a^{-n} = \frac{1}{a^n} \qquad a^{\frac{m}{n}} = \sqrt[n]{a^m}$$

      **Contoh**
      • $2^3 \times 2^4 = 2^7 = 128$
      • $8^{\frac{2}{3}} = (\sqrt[3]{8})^2 = 2^2 = 4$
      • $5^{-2} = \frac{1}{25}$

      **Sifat bentuk akar**
      $$\sqrt{a} \times \sqrt{b} = \sqrt{ab} \qquad p\sqrt{a} + q\sqrt{a} = (p + q)\sqrt{a}$$
      **Menyederhanakan**: cari faktor kuadrat terbesar.
      $$\sqrt{48} = \sqrt{16 \times 3} = 4\sqrt{3}$$

      **Merasionalkan penyebut**
      $$\frac{a}{\sqrt{b}} = \frac{a\sqrt{b}}{b} \qquad \frac{c}{\sqrt{a} + \sqrt{b}} = \frac{c(\sqrt{a} - \sqrt{b})}{a - b}$$
      Contoh: $\frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}$

      > Trik: samakan basis dulu! $4^3 \times 8 = (2^2)^3 \times 2^3 = 2^9 = 512$.
    `),
    notes: [
      {
        title: 'Kesalahan yang Sering Terjadi',
        explanation: 'Akar tidak bisa dipecah pada penjumlahan, dan pangkat tidak bisa dipecah pada penjumlahan.',
        examples: ['√(9 + 16) = √25 = 5, bukan 3 + 4 = 7', '(a + b)² ≠ a² + b²', '2³ × 3² ≠ 6⁵ (basis berbeda)'],
      },
    ],
    quiz: [
      ['3⁴ × 3² : 3³ = …', ['9', '27', '81'], 1, '3^(4 + 2 − 3) = 3³ = 27.'],
      ['27^(2/3) = …', ['9', '18', '3'], 0, '(∛27)² = 3² = 9.'],
      ['√50 + √18 = …', ['√68', '8√2', '2√17'], 1, '√50 = 5√2, √18 = 3√2, jumlahnya 8√2.'],
      ['2⁻³ = …', ['−8', '1/8', '−6'], 1, '2⁻³ = 1/2³ = 1/8.'],
      ['Bentuk rasional dari 10/√5 adalah …', ['2√5', '10√5', '√5/2'], 0, '10√5/5 = 2√5.'],
    ],
  },
  {
    slug: 'mtk-teori-sudut',
    theme: 'Matematika: Teorema Geometri',
    emoji: '📐',
    title: 'Teori Sudut: Garis Sejajar, Segitiga, dan Lingkaran',
    titleId: 'Hubungan antarsudut yang wajib dikuasai',
    minutes: 9,
    intro: md(String.raw`
      **Sudut dasar**
      • Sudut berpelurus jumlahnya $180^\circ$; sudut berpenyiku jumlahnya $90^\circ$.
      • Sudut bertolak belakang besarnya sama.

      **Dua garis sejajar dipotong garis lain**
      • Sudut **sehadap** → sama besar
      • Sudut **dalam berseberangan** dan **luar berseberangan** → sama besar
      • Sudut **dalam sepihak** dan **luar sepihak** → jumlahnya $180^\circ$

      **Segitiga**
      • Jumlah sudut dalam segitiga $= 180^\circ$.
      • **Sudut luar** segitiga = jumlah dua sudut dalam yang tidak bersisian dengannya.

      **Segi-$n$**
      $$\text{Jumlah sudut dalam} = (n - 2) \times 180^\circ$$
      $$\text{Sudut dalam segi-}n\text{ beraturan} = \frac{(n - 2) \times 180^\circ}{n} \qquad \text{Sudut luar} = \frac{360^\circ}{n}$$
      Contoh: segi-6 → $4 \times 180^\circ = 720^\circ$, tiap sudutnya $120^\circ$.

      **Teorema sudut pada lingkaran**
      • Sudut pusat $= 2 \times$ sudut keliling yang menghadap busur yang sama.
      • Sudut keliling yang menghadap **diameter** selalu $90^\circ$.
      • Sudut keliling yang menghadap busur yang sama besarnya sama.
      • Sudut yang berhadapan pada segi empat tali busur jumlahnya $180^\circ$.

      > Jumlah semua sudut luar segi-$n$ apa pun selalu $360^\circ$.
    `),
    quiz: [
      ['Dua sudut segitiga besarnya 50° dan 60°. Sudut ketiganya …', ['70°', '80°', '110°'], 0, '180° − 50° − 60° = 70°.'],
      ['Jumlah sudut dalam segi-6 adalah …', ['540°', '720°', '1.080°'], 1, '(6 − 2) × 180° = 720°.'],
      ['Besar setiap sudut dalam segi-8 beraturan adalah …', ['120°', '135°', '145°'], 1, '(8 − 2) × 180° : 8 = 1.080° : 8 = 135°.'],
      ['Sudut pusat suatu lingkaran 80°. Sudut keliling yang menghadap busur yang sama …', ['160°', '80°', '40°'], 2, 'Sudut keliling = ½ × sudut pusat = 40°.'],
      ['Salah satu sudut dalam sepihak besarnya 110°. Pasangannya …', ['110°', '70°', '90°'], 1, 'Sudut dalam sepihak berjumlah 180°, jadi 180° − 110° = 70°.'],
    ],
  },
  {
    slug: 'mtk-peluang-dasar',
    theme: 'Matematika: Statistika & Peluang',
    emoji: '🎲',
    title: 'Peluang dan Kaidah Pencacahan Dasar',
    titleId: 'Ruang sampel, peluang, dan frekuensi harapan',
    minutes: 8,
    phaseMax: 'E',
    intro: md(String.raw`
      **Ruang sampel** ($S$) = semua hasil yang mungkin. **Kejadian** ($A$) = hasil yang diharapkan.
      $$P(A) = \frac{n(A)}{n(S)} \qquad 0 \le P(A) \le 1$$

      **Peluang komplemen** (kejadian *tidak* terjadi):
      $$P(A^c) = 1 - P(A)$$

      **Frekuensi harapan** (percobaan diulang $N$ kali):
      $$F_h = P(A) \times N$$

      **Ruang sampel yang sering keluar**
      • 1 dadu → 6 · 2 dadu → 36 · 1 koin → 2 · 3 koin → $2^3 = 8$
      • 1 set kartu bridge → 52 kartu (4 jenis × 13 kartu, 4 kartu As)

      **Kaidah perkalian**: jika ada 3 baju dan 4 celana, banyak pasangan pakaian $= 3 \times 4 = 12$.

      **Contoh**: dua dadu dilempar, peluang jumlah mata dadu 7:
      $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ → $P = \frac{6}{36} = \frac{1}{6}$

      > Trik dua dadu: banyak pasangan berjumlah $k$ adalah $k - 1$ (untuk $k \le 7$) dan $13 - k$ (untuk $k \ge 7$).
    `),
    quiz: [
      ['Sebuah dadu dilempar. Peluang muncul mata dadu genap …', ['1/6', '1/2', '1/3'], 1, 'Genap: 2, 4, 6 → 3/6 = 1/2.'],
      ['Dua dadu dilempar. Peluang jumlah mata dadu 10 …', ['1/12', '1/6', '1/36'], 0, '(4,6), (5,5), (6,4) → 3/36 = 1/12.'],
      ['Satu kartu diambil dari 52 kartu bridge. Peluang terambil kartu As …', ['1/52', '1/13', '1/4'], 1, 'Ada 4 kartu As → 4/52 = 1/13.'],
      ['Sebuah koin dilempar 200 kali. Frekuensi harapan muncul angka …', ['50', '100', '200'], 1, 'F = ½ × 200 = 100.'],
      ['Peluang besok hujan 0,3. Peluang besok tidak hujan …', ['0,3', '0,7', '1,3'], 1, '1 − 0,3 = 0,7.'],
    ],
  },
  {
    slug: 'mtk-barisan-dan-deret',
    theme: 'Matematika: Barisan & Deret',
    emoji: '🔗',
    title: 'Pola Bilangan, Barisan, dan Deret',
    titleId: 'Aritmetika, geometri, dan trik Gauss',
    minutes: 9,
    phaseMax: 'F',
    intro: md(String.raw`
      **Barisan aritmetika** (selisih tetap $b$), suku pertama $a$:
      $$U_n = a + (n - 1)b \qquad S_n = \frac{n}{2}(2a + (n - 1)b) = \frac{n}{2}(a + U_n)$$
      Contoh: $3, 7, 11, \dots$ → $U_{20} = 3 + 19 \times 4 = 79$, $S_{20} = 10 \times (3 + 79) = 820$.

      **Barisan geometri** (rasio tetap $r$):
      $$U_n = a r^{n-1} \qquad S_n = \frac{a(r^n - 1)}{r - 1}$$
      Contoh: $2, 6, 18, \dots$ → $U_6 = 2 \times 3^5 = 486$.

      **Deret geometri tak hingga** (syarat $-1 < r < 1$):
      $$S_\infty = \frac{a}{1 - r}$$
      Contoh: $8 + 4 + 2 + 1 + \dots = \frac{8}{1 - \frac{1}{2}} = 16$

      **Trik Gauss**: $1 + 2 + 3 + \dots + 100$ = pasangkan ujung-ujungnya $(1 + 100) + (2 + 99) + \dots$ → 50 pasang × 101 = **5.050**.
      $$1 + 2 + \dots + n = \frac{n(n + 1)}{2}$$

      **Pola bilangan istimewa**
      • Bilangan persegi: $1, 4, 9, 16, \dots$ → $U_n = n^2$
      • Bilangan segitiga: $1, 3, 6, 10, \dots$ → $U_n = \frac{n(n + 1)}{2}$
      • Jumlah $n$ bilangan ganjil pertama: $1 + 3 + 5 + \dots = n^2$

      > Pada barisan aritmetika, suku tengah = rata-rata suku pertama dan terakhir.
    `),
    quiz: [
      ['Suku ke-15 dari barisan 5, 8, 11, … adalah …', ['47', '50', '45'], 0, 'U₁₅ = 5 + 14 × 3 = 47.'],
      ['1 + 3 + 5 + … + 19 = …', ['100', '81', '110'], 0, 'Ada 10 bilangan ganjil pertama → 10² = 100.'],
      ['Suku ke-7 dari barisan 3, 6, 12, … adalah …', ['96', '192', '384'], 1, 'U₇ = 3 × 2⁶ = 3 × 64 = 192.'],
      ['12 + 6 + 3 + … (tak hingga) = …', ['21', '24', '36'], 1, 'S∞ = 12 / (1 − ½) = 24.'],
      ['1 + 2 + 3 + … + 50 = …', ['1.275', '2.550', '1.250'], 0, '50 × 51 / 2 = 1.275.'],
    ],
  },
  {
    slug: 'mtk-perbandingan-aritmetika-sosial',
    theme: 'Matematika: Trik Berhitung',
    emoji: '🧮',
    title: 'Perbandingan dan Aritmetika Sosial',
    titleId: 'Senilai, berbalik nilai, kerja bersama, untung-rugi, bunga',
    minutes: 9,
    phaseMax: 'L',
    intro: md(String.raw`
      **Perbandingan senilai** (satu naik, yang lain ikut naik):
      $$\frac{a_1}{a_2} = \frac{b_1}{b_2}$$
      5 buku seharga Rp20.000 → 8 buku seharga $\frac{8}{5} \times 20.000 = \text{Rp}32.000$.

      **Perbandingan berbalik nilai** (satu naik, yang lain turun):
      $$a_1 \times b_1 = a_2 \times b_2$$
      12 pekerja selesai dalam 10 hari → 8 pekerja selesai dalam $\frac{12 \times 10}{8} = 15$ hari.

      **Trik kerja bersama**
      Jika A selesai dalam $t_1$ jam dan B dalam $t_2$ jam, bersama-sama:
      $$t = \frac{t_1 \times t_2}{t_1 + t_2}$$
      A: 6 jam, B: 3 jam → $t = \frac{18}{9} = 2$ jam.

      **Untung & rugi**
      $$\%\,\text{untung} = \frac{\text{harga jual} - \text{harga beli}}{\text{harga beli}} \times 100\%$$
      Beli Rp50.000, jual Rp60.000 → untung 20%.

      **Bunga tunggal** (modal $M$, bunga $p\%$ per tahun, selama $n$ bulan):
      $$B = M \times p\% \times \frac{n}{12}$$
      Rp2.000.000 dengan bunga 6% per tahun selama 8 bulan → $B = 2.000.000 \times 0{,}06 \times \frac{8}{12} = \text{Rp}80.000$.

      > Persentase untung/rugi selalu dihitung terhadap **harga beli**, bukan harga jual.
    `),
    quiz: [
      ['4 kg beras seharga Rp52.000. Harga 7 kg beras …', ['Rp91.000', 'Rp84.000', 'Rp78.000'], 0, '52.000 : 4 = 13.000 per kg; 7 × 13.000 = 91.000.'],
      ['15 pekerja menyelesaikan proyek dalam 12 hari. Jika 20 pekerja, proyek selesai dalam …', ['16 hari', '9 hari', '10 hari'], 1, 'Berbalik nilai: 15 × 12 = 180, 180 : 20 = 9 hari.'],
      ['Keran A mengisi bak dalam 4 jam, keran B dalam 12 jam. Jika dibuka bersama, bak penuh dalam …', ['3 jam', '8 jam', '16 jam'], 0, 't = (4 × 12)/(4 + 12) = 48/16 = 3 jam.'],
      ['Pedagang membeli barang Rp80.000 dan menjualnya Rp100.000. Persentase untungnya …', ['20%', '25%', '80%'], 1, '20.000/80.000 × 100% = 25%.'],
      ['Tabungan Rp1.000.000 dengan bunga tunggal 12% per tahun. Bunga setelah 6 bulan …', ['Rp120.000', 'Rp60.000', 'Rp72.000'], 1, '1.000.000 × 12% × 6/12 = 60.000.'],
    ],
  },
];
