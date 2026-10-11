// Materi & Trik Olimpiade KMSI dan JSO Matematika Level 1–2 — disusun dari tipe soal pada paket
// KMSI 2024 (Penyisihan, Final Provinsi, Grand Final) dan JSO 2026 (Penyisihan, Final Provinsi, Grand Final).
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

const LEVEL_1 = 'Olimpiade KMSI & JSO: Level 1';
const LEVEL_2 = 'Olimpiade KMSI & JSO: Level 2';

/** Level 1 = kelas 1–2 (Fase A), juga berguna untuk kelas 3. */
export const matematikaKmsiJsoLevel1: SeedLesson[] = [
  {
    slug: 'kmsi-jso-l1-kata-kunci-soal-cerita',
    theme: LEVEL_1,
    emoji: '🔑',
    title: 'Kata Kunci Soal Cerita dan Urutan Hitung',
    titleId: 'Kapan ditambah, kapan dikurang, mana yang dikerjakan dulu',
    minutes: 6,
    intro: md(String.raw`
      Soal cerita KMSI dan JSO sering menyembunyikan tanda hitung di dalam kata.

      **Kata yang berarti ditambah ➕**
      membeli lagi, bonus, mendapat, naik, menang, melahirkan, seluruhnya

      **Kata yang berarti dikurang ➖**
      mati, hilang, diberikan, turun, kalah, dimakan, sisa, **selisih**

      **Urutan hitung**
      • Kali dan bagi dikerjakan **lebih dulu**.
      • Tambah dan kurang dikerjakan dari **kiri ke kanan**.
      $$17 + 5 \times 6 - 22 = 17 + 30 - 22 = 25$$
      $$62 + 45 : 5 = 62 + 9 = 71$$

      **Awas jebakan!**
      • "Melompat 12 cm **sebanyak dua kali**" → 12 + 12, bukan 12 saja.
      • "Ada 25 anak di depan Adi, Budi di belakang Adi, dan 8 anak di belakang Budi" → jangan lupa menghitung Adi dan Budi: $25 + 1 + 1 + 8 = 35$.
      • Bilangan apa pun dikali 0 hasilnya **0**: $123 \times 456 \times 0 = 0$.

      > Baca soal dua kali. Lingkari kata kuncinya sebelum menghitung.
    `),
    quiz: [
      ['30 + 21 − 5 = …', ['46', '56', '36'], 0, 'Dari kiri: 30 + 21 = 51, lalu 51 − 5 = 46.'],
      ['17 + 5 × 6 − 22 = …', ['110', '25', '30'], 1, 'Kali dulu: 5 × 6 = 30. Lalu 17 + 30 − 22 = 25.'],
      ['Erin punya 23 kelereng. Ia menang 5, lalu kalah 8, lalu memberi adiknya 10. Kelereng Erin sekarang …', ['10', '20', '15'], 0, '23 + 5 − 8 − 10 = 10.'],
      ['Dani punya 5 kucing. Seekor kucingnya melahirkan 3 anak. Kucing Dani sekarang …', ['5', '8', '6'], 1, 'Melahirkan berarti bertambah: 5 + 3 = 8.'],
      ['100 × 37 × 0 = …', ['3.700', '0', '137'], 1, 'Dikali 0 hasilnya selalu 0.'],
    ],
  },
  {
    slug: 'kmsi-jso-l1-trik-pasangan',
    theme: LEVEL_1,
    emoji: '🤝',
    title: 'Trik Pasangan dan Pengelompokan',
    titleId: 'Menghitung deret panjang dalam sekejap',
    minutes: 7,
    intro: md(String.raw`
      Soal final sering berbentuk deret panjang. Jangan dihitung satu per satu, **pasangkan**!

      **1. Tukar urutan agar mudah**
      $$46 - 57 + 199 = (46 + 199) - 57 = 245 - 57 = 188$$

      **2. Kumpulkan yang ditambah dan yang dikurang**
      $$39 - 16 + 8 - 11 + 4 - 23 = (39 + 8 + 4) - (16 + 11 + 23) = 51 - 50 = 1$$

      **3. Pasangan selisih 1**
      $$20 - 19 + 18 - 17 + 16 - 15 + 14 - 13 + 12 - 11$$
      Ada 5 pasangan yang masing-masing bernilai 1 → hasilnya **5**.
      $70 - 69 + 68 - 67 + \dots + 2 - 1$ → ada 35 pasangan → **35**.

      **4. Kurangkan berpasangan**
      $$(7 + 8 + 9 + 10) - (6 + 6 + 6 + 6) = 1 + 2 + 3 + 4 = 10$$

      **5. Pasangan ujung (trik Gauss)**
      $2 + 4 + 6 + 8 + 10 + 12$: pasangkan $(2 + 12), (4 + 10), (6 + 8)$ → $3 \times 14 = 42$.
      $1 + 2 + \dots + 19 = (1 + 19) \times 19 : 2 = 190$.

      > Kunci trik pasangan: cari dua bilangan yang hasilnya mudah (10, 100, atau 1).
    `),
    notes: [
      {
        title: 'Rumus Gauss',
        pattern: '1 + 2 + … + n = n × (n + 1) : 2',
        explanation: 'Pasangkan bilangan pertama dengan terakhir, kedua dengan kedua dari akhir, dan seterusnya.',
        examples: ['1 + 2 + … + 10 = 10 × 11 : 2 = 55', '1 + 2 + … + 2026 = 2.053.351'],
      },
    ],
    quiz: [
      ['50 − 49 + 48 − 47 + … + 2 − 1 = …', ['25', '50', '1'], 0, 'Ada 25 pasangan yang masing-masing bernilai 1.'],
      ['(9 + 10 + 11 + 12) − (8 + 8 + 8 + 8) = …', ['10', '42', '8'], 0, 'Pasangkan: 1 + 2 + 3 + 4 = 10.'],
      ['1 + 2 + 3 + … + 10 = …', ['50', '55', '45'], 1, '10 × 11 : 2 = 55.'],
      ['45 − 18 + 5 − 12 = …', ['20', '30', '10'], 0, '(45 + 5) − (18 + 12) = 50 − 30 = 20.'],
      ['204 − 8 − 8 − 8 − 8 − 8 − 8 − 8 − 8 = …', ['140', '196', '84'], 0, 'Ada 8 kali dikurangi 8 = 64. 204 − 64 = 140.'],
    ],
  },
  {
    slug: 'kmsi-jso-l1-menghitung-gambar',
    theme: LEVEL_1,
    emoji: '🔺',
    title: 'Trik Menghitung Gambar: Segitiga, Persegi, dan Titik',
    titleId: 'Menghitung tanpa terlewat',
    minutes: 7,
    intro: md(String.raw`
      Banyak soal final meminta kita menghitung bangun atau benda pada gambar.

      **1. Hitung per baris** lalu jumlahkan.
      Kelereng 5, 5, 5, 3 → $5 + 5 + 5 + 3 = 18$.

      **2. Segitiga kipas** (garis-garis keluar dari satu titik)
      Jika ada 4 segitiga kecil berjajar → $4 + 3 + 2 + 1 = 10$ segitiga.
      Jika ada 3 segitiga kecil → $3 + 2 + 1 = 6$ segitiga.

      **3. Persegi panjang dalam satu baris kotak**
      Baris berisi 3 kotak → $3 + 2 + 1 = 6$ persegi panjang.

      **4. Persegi berlubang** (lingkaran hanya di tepi) $n \times n$
      $$\text{banyak} = 4 \times (n - 1)$$
      Persegi berlubang 5 × 5 → $4 \times 4 = 16$.

      **5. Pola bintang segitiga**: 1, 3, 6, 10, … (tambah 2, 3, 4, …)
      Pola ke-10 = $1 + 2 + \dots + 10 = 55$.

      **6. Pola titik persegi**: 1, 4, 9, 16, … → pola ke-$n$ = $n \times n$.
      Pola ke-10 = 100.

      > Beri tanda pada yang sudah dihitung, supaya tidak ada yang terhitung dua kali.
    `),
    quiz: [
      ['Segitiga kipas berisi 3 segitiga kecil berjajar. Banyak semua segitiganya …', ['3', '6', '5'], 1, '3 + 2 + 1 = 6.'],
      ['Satu baris berisi 4 kotak. Banyak persegi panjang yang terlihat …', ['4', '10', '8'], 1, '4 + 3 + 2 + 1 = 10.'],
      ['Lingkaran disusun membentuk persegi berlubang 6 × 6. Banyak lingkarannya …', ['36', '20', '24'], 1, '4 × (6 − 1) = 20.'],
      ['Pola bintang segitiga: 1, 3, 6, 10, … Pola ke-6 berisi … bintang.', ['21', '15', '18'], 0, '1 + 2 + 3 + 4 + 5 + 6 = 21.'],
      ['Pola titik persegi: 1, 4, 9, … Pola ke-7 berisi … titik.', ['49', '14', '42'], 0, '7 × 7 = 49.'],
    ],
  },
  {
    slug: 'kmsi-jso-l1-pola-final',
    theme: LEVEL_1,
    emoji: '🔁',
    title: 'Pola Babak Final: Berulang, Selang-seling, dan Zigzag',
    titleId: 'Lima jenis pola yang paling sering keluar',
    minutes: 8,
    intro: md(String.raw`
      **1. Pola berulang** → cari panjang putarannya, lalu lihat **sisa bagi**.
      "JUJURITUJUARA" berulang (13 huruf). Huruf ke-30: $30 = 13 \times 2 + 4$ → huruf ke-4 = **U**.
      Jika sisanya 0, ambil huruf **terakhir**.

      **2. Pola tambah bergantian**: 1, 2, 4, 5, 7, 8, … (+1, +2, +1, +2) → berikutnya 10, 11.

      **3. Pola selisih bertambah**: 22, 23, 25, 28, ☐, 37 (+1, +2, +3, +4, +5) → ☐ = 32.

      **4. Pola dua barisan selang-seling**
      4, 2, 9, 6, 14, 10, …
      • Urutan ganjil: 4, 9, 14, … (tambah 5)
      • Urutan genap: 2, 6, 10, … (tambah 4)

      **5. Pola +1 lalu ×2**: 0, 1, 2, 3, 6, 7, 14, 15, 30, **31**, 62, 63

      **6. Tabel zigzag** (bilangan turun lalu naik di 5 baris A–E)
      Pola berulang setiap 10 bilangan, jadi cukup lihat **angka satuannya**: 1 dan 0 di baris A, 2 dan 9 di B, dan seterusnya. Bilangan 101 → satuan 1 → baris A.

      > Langkah cepat: tulis selisih antarsuku. Jika tidak teratur, coba pisahkan suku ganjil dan genap.
    `),
    quiz: [
      ['ABCABCABC… Huruf ke-20 adalah …', ['A', 'B', 'C'], 1, '20 : 3 = 6 sisa 2 → huruf ke-2 = B.'],
      ['10, 11, 13, 16, 20, … Bilangan berikutnya …', ['24', '25', '26'], 1, 'Selisih +1, +2, +3, +4, lalu +5 → 25.'],
      ['1, 10, 2, 20, 3, 30, … Bilangan berikutnya …', ['4', '40', '31'], 0, 'Suku ganjil: 1, 2, 3, lalu 4.'],
      ['1, 2, 4, 5, 10, 11, … Bilangan berikutnya …', ['12', '22', '20'], 1, 'Polanya +1 lalu ×2: 11 × 2 = 22.'],
      ['Pola 8, 3, 6, 7, 8, 3, 6, 7, … Suku ke-24 adalah …', ['8', '7', '6'], 1, '24 : 4 sisa 0 → suku terakhir dalam pola = 7.'],
    ],
  },
  {
    slug: 'kmsi-jso-l1-simbol-timbangan',
    theme: LEVEL_1,
    emoji: '⚖️',
    title: 'Simbol, Timbangan, dan Kerja Mundur',
    titleId: 'Menebak bilangan yang disembunyikan',
    minutes: 7,
    intro: md(String.raw`
      **1. Simbol yang diulang**
      ⊕ + ⊞ = 12 dan ⊕ + ⊕ + ⊞ + ⊞ + ⊞ = 32.
      Baris kedua = 2 kali (⊕ + ⊞) + ⊞ = 24 + ⊞ = 32 → ⊞ = 8, jadi ⊕ = 4.

      **2. Coba-coba pasangan perkalian**
      ⊗ × ⊝ = 27, ⊝ + 4 = ⊠, dan ⊗ + ⊝ + ⊠ = 19.
      Pasangan 27: 1 × 27 atau 3 × 9. Coba ⊝ = 3, ⊗ = 9 → ⊠ = 7 → 9 + 3 + 7 = 19 ✓.

      **3. Timbangan (tukar dengan yang sama berat)**
      1 nanas = 2 apel, dan 10 apel = 1 semangka + 2 nanas.
      2 nanas = 4 apel, jadi 1 semangka = $10 - 4 = 6$ apel.

      **4. Kerja mundur**
      "Aku ditambah 4 lalu dikali 5 hasilnya 30."
      Mundur dan balik operasinya: $30 : 5 = 6$, lalu $6 - 4 = 2$.

      **5. Jumlah dan selisih**
      Jumlah dua bilangan 80, selisihnya 12.
      $$\text{besar} = (80 + 12) : 2 = 46 \qquad \text{kecil} = (80 - 12) : 2 = 34$$
    `),
    quiz: [
      ['▲ + ▲ = 10 dan ▲ + ● = 8. Nilai ● = …', ['3', '5', '2'], 0, '▲ = 5, jadi ● = 8 − 5 = 3.'],
      ['1 anjing = 2 kucing dan 1 kucing = 3 tikus. 1 anjing = … tikus', ['5', '6', '3'], 1, '2 × 3 = 6 tikus.'],
      ['Aku dikali 3 lalu ditambah 4, hasilnya 19. Aku adalah …', ['5', '7', '4'], 0, 'Mundur: 19 − 4 = 15, lalu 15 : 3 = 5.'],
      ['Jumlah dua bilangan 20, selisihnya 4. Bilangan yang besar …', ['12', '8', '16'], 0, '(20 + 4) : 2 = 12.'],
      ['⊕ + ⊞ = 10 dan ⊕ + ⊕ + ⊞ = 16. Nilai ⊕ = …', ['6', '4', '5'], 0, 'Baris kedua dikurangi baris pertama: ⊕ = 16 − 10 = 6.'],
    ],
  },
  {
    slug: 'kmsi-jso-l1-waktu-kalender',
    theme: LEVEL_1,
    emoji: '🗓️',
    title: 'Waktu dan Kalender ala KMSI–JSO',
    titleId: 'Lusa, Februari, dan lama kegiatan',
    minutes: 6,
    intro: md(String.raw`
      **1. Kata waktu**
      • Kemarin = 1 hari lalu · Besok = 1 hari lagi · **Lusa** = 2 hari lagi
      • Jika lusa hari Kamis, hari ini adalah **Selasa**.

      **2. Hari ke-$n$** → sisa bagi 7.
      Rabu + 101 hari: $101 = 7 \times 14 + 3$ → Rabu + 3 = **Sabtu**.
      5 hari lalu Senin → hari ini Sabtu → 25 hari lagi: sisa 4 → **Rabu**.

      **3. Bulan Februari**
      • Biasanya 28 hari. Pada tahun **kabisat** (tahun habis dibagi 4) ada 29 hari.
      • 2024 kabisat (29 hari), 2026 bukan (28 hari).

      **4. Lama kegiatan** → hitung jam penuh dulu, lalu sisanya.
      18.15 sampai 19.51: 18.15 → 19.15 = 60 menit, 19.15 → 19.51 = 36 menit → **96 menit**.

      **5. Jam ke menit**: 26 jam 26 menit = $26 \times 60 + 26 = 1.586$ menit.

      **6. Satuan jumlah**: 1 lusin = 12, 1 gross = 144, 1 kodi = 20, 1 rim = 500 lembar.
      Tiga setengah lusin = $3 \times 12 + 6 = 42$.
    `),
    quiz: [
      ['Jika lusa hari Kamis, hari ini hari …', ['Rabu', 'Selasa', 'Senin'], 1, 'Lusa = 2 hari lagi. Kamis mundur 2 hari = Selasa.'],
      ['Banyak hari pada bulan Februari 2026 adalah …', ['28', '29', '30'], 0, '2026 tidak habis dibagi 4, bukan tahun kabisat.'],
      ['Intan belajar pukul 18.15 sampai 19.51. Lama belajarnya … menit.', ['96', '86', '76'], 0, '60 menit + 36 menit = 96 menit.'],
      ['Hari ini Rabu. 101 hari lagi hari …', ['Jumat', 'Sabtu', 'Minggu'], 1, '101 : 7 sisa 3 → Rabu + 3 = Sabtu.'],
      ['Tiga setengah lusin = … buah', ['36', '42', '35'], 1, '3 × 12 + 6 = 42.'],
    ],
  },
];

/** Level 2 = kelas 3–4 (Fase B), juga berguna untuk kelas 5–6. */
export const matematikaKmsiJsoLevel2: SeedLesson[] = [
  {
    slug: 'kmsi-jso-l2-keliling-luas',
    theme: LEVEL_2,
    emoji: '📐',
    title: 'Keliling dan Luas: Persegi Panjang, Segitiga, Keramik',
    titleId: 'Tipe soal geometri Final Provinsi',
    minutes: 8,
    intro: md(String.raw`
      **Rumus dasar persegi panjang**
      $$K = 2 \times (p + l) \qquad L = p \times l$$
      • Mencari panjang dari keliling: $p = K : 2 - l$. Contoh $K = 164$, $l = 31$ → $p = 82 - 31 = 51$.
      • Mencari lebar dari luas: $l = L : p$. Contoh $L = 187$, $p = 17$ → $l = 11$.

      **Segitiga**
      $$L = \frac{1}{2} \times \text{alas} \times \text{tinggi}$$
      Segitiga siku-siku memakai **tripel**: 3–4–5, 6–8–10, 9–12–15, 5–12–13.
      Sisi 9 dan 12 → sisi miring 15 → keliling $9 + 12 + 15 = 36$.

      **Keramik** → bagi luas lantai dengan luas satu keramik (samakan satuannya!).
      Lantai $4\text{ m} \times 3\text{ m} = 400 \times 300 = 120.000\text{ cm}^2$, keramik $40 \times 40 = 1.600\text{ cm}^2$ → 75 keramik.

      **Pohon di sekeliling taman** (bangun tertutup) → banyak jarak = banyak pohon.
      Taman persegi sisi 54 m, 27 pohon → jarak $= 216 : 27 = 8$ m.

      **Trik bangun tangga** → keliling sama dengan persegi panjang pembungkusnya.
      Tangga selebar 60 dan setinggi 70 → $K = 2 \times (60 + 70) = 260$.

      **Bangun dari persegi-persegi kecil** → hitung banyak sisi luar, lalu cari panjang satu sisi dari keliling.
    `),
    quiz: [
      ['Keliling persegi panjang 50 cm dan lebarnya 10 cm. Luasnya …', ['150 cm²', '500 cm²', '250 cm²'], 0, 'p = 25 − 10 = 15. L = 15 × 10 = 150 cm².'],
      ['Luas persegi panjang 48 cm² dan panjangnya 8 cm. Kelilingnya …', ['28 cm', '56 cm', '14 cm'], 0, 'l = 48 : 8 = 6. K = 2 × (8 + 6) = 28 cm.'],
      ['Lantai 3 m × 2 m dipasang keramik 50 cm × 50 cm. Banyak keramik …', ['6', '24', '12'], 1, '300 × 200 = 60.000 cm², keramik 2.500 cm². 60.000 : 2.500 = 24.'],
      ['Taman persegi bersisi 20 m ditanami 16 pohon di sekelilingnya dengan jarak sama. Jarak antarpohon …', ['5 m', '4 m', '8 m'], 0, 'Keliling 80 m, bangun tertutup: 80 : 16 = 5 m.'],
      ['Segitiga siku-siku dengan sisi siku 6 cm dan 8 cm. Kelilingnya …', ['24 cm', '14 cm', '48 cm'], 0, 'Sisi miring 10 (tripel 6–8–10). 6 + 8 + 10 = 24 cm.'],
    ],
  },
  {
    slug: 'kmsi-jso-l2-bilangan-digit',
    theme: LEVEL_2,
    emoji: '🔢',
    title: 'Bilangan: FPB–KPK, Prima, Habis Dibagi 11, dan Digit Terakhir',
    titleId: 'Teori bilangan tingkat final',
    minutes: 9,
    intro: md(String.raw`
      **1. Hubungan FPB dan KPK** (untuk dua bilangan)
      $$\text{FPB} \times \text{KPK} = a \times b$$
      KPK(126, x) = 882 dan FPB = 21 → $x = 21 \times 882 : 126 = 147$.

      **2. Dua bilangan prima**: jumlah 40, selisih 6 → $(40 + 6) : 2 = 23$ dan $17$ → hasil kali 391.

      **3. Habis dibagi 5 dan 11**
      • Habis dibagi 5 → angka terakhir 0 atau 5.
      • Habis dibagi 11 → (jumlah angka urutan ganjil) − (jumlah angka urutan genap) = 0 atau kelipatan 11.
      $\overline{32ab}$ kelipatan 5 dan 11 → 3245 (karena $(3 + 4) - (2 + 5) = 0$).

      **4. Digit terakhir bilangan berpangkat** → angka satuannya berulang.
      • 2: 2, 4, 8, 6 · 3: 3, 9, 7, 1 · 7: 7, 9, 3, 1 (setiap 4)
      • 4: 4, 6 · 9: 9, 1 (setiap 2) · 5 dan 6: selalu sama
      $3^{2026}$: $2026 : 4$ sisa 2 → angka kedua = **9**. $2026^{2026}$ berakhiran **6**.

      **5. Desimal berulang**
      $\frac{20}{13} = 1{,}538461\,538461\dots$ (berulang 6 angka). Digit ke-2025: sisa 3 → **8**.

      **6. Pembagian bersisa**: 2026 dibagi p hasilnya 26 sisa 24 → $26p = 2026 - 24 = 2002$ → $p = 77$.
    `),
    quiz: [
      ['FPB dua bilangan 12 dan KPK-nya 72. Jika salah satu bilangan 24, bilangan lainnya …', ['36', '48', '18'], 0, '12 × 72 : 24 = 36.'],
      ['Angka satuan dari 7¹⁰ adalah …', ['7', '9', '3'], 1, 'Pola 7, 9, 3, 1. 10 : 4 sisa 2 → 9.'],
      ['Angka satuan dari 2¹⁰⁰ adalah …', ['2', '6', '4'], 1, 'Pola 2, 4, 8, 6. 100 : 4 sisa 0 → angka terakhir pola = 6.'],
      ['Jumlah dua bilangan prima 30 dan selisihnya 4. Hasil kalinya …', ['221', '209', '200'], 0, '17 dan 13. 17 × 13 = 221.'],
      ['1/7 = 0,142857142857… Digit ke-10 setelah koma adalah …', ['4', '8', '2'], 1, 'Berulang 6 angka. 10 : 6 sisa 4 → angka ke-4 = 8.'],
    ],
  },
  {
    slug: 'kmsi-jso-l2-menghitung-dan-menyusun-angka',
    theme: LEVEL_2,
    emoji: '🧮',
    title: 'Menghitung Angka yang Muncul dan Menyusun Angka',
    titleId: 'Angka 0, 2, 4 dalam barisan dan susunan terbaik',
    minutes: 8,
    intro: md(String.raw`
      **1. Banyak angka tertentu** → hitung per posisi (satuan, puluhan, ratusan).
      Angka 2 dalam 1–24: satuan (2, 12, 22) = 3, puluhan (20–24) = 5 → **8**.
      Angka 0 dalam 1–251: 1–99 ada 9, 100–199 ada 20, 200–251 ada 16 → **45**.
      Angka 2 dalam 1–1000: setiap posisi 100 kali → **300**.

      **2. Jumlah terbesar** → angka besar di tempat puluhan.
      Angka 2, 3, 4, 5 pada ☐☐ + ☐☐: $53 + 42 = 95$.

      **3. Selisih terkecil** → angka depan berurutan, sisanya dibuat "atas kecil, bawah besar".
      Angka 1–6 pada ☐☐☐ − ☐☐☐: $412 - 365 = 47$.

      **4. Jumlah tepat 100** dengan angka 1–7 (3 kotak puluhan, 4 kotak satuan)
      Jumlah semua angka = 28. Jika jumlah angka puluhan = T: $10T + (28 - T) = 100$ → $9T = 72$ → $T = 8$.

      **5. Bilangan dua angka dengan syarat**
      $\overline{ab}$ dengan $a < b$ (a ≥ 1): pilih 2 angka berbeda dari 1–9, susunannya hanya satu → $9 \times 8 : 2 = 36$.
    `),
    quiz: [
      ['Banyak angka 3 saat menulis 1 sampai 50 adalah …', ['15', '14', '5'], 0, 'Satuan 3: 5 kali. Puluhan 3: 30–39 = 10. Total 15.'],
      ['Banyak angka 0 saat menulis 1 sampai 100 adalah …', ['10', '11', '9'], 1, '10, 20, …, 90 (9 angka) + 100 (2 angka) = 11.'],
      ['Angka 1, 2, 3, 4 disusun menjadi ☐☐ + ☐☐. Jumlah terbesar …', ['73', '77', '64'], 0, '41 + 32 = 73 (4 dan 3 di puluhan).'],
      ['Angka 1, 2, 3, 4 disusun menjadi ☐☐ − ☐☐ (hasil positif). Selisih terkecil …', ['9', '7', '11'], 1, '31 − 24 = 7.'],
      ['Banyak bilangan dua angka ab dengan a lebih besar dari b (b boleh 0) …', ['36', '45', '90'], 1, 'Pilih 2 angka berbeda dari 0–9: 10 × 9 : 2 = 45, susunannya satu cara.'],
    ],
  },
  {
    slug: 'kmsi-jso-l2-soal-cerita-final',
    theme: LEVEL_2,
    emoji: '🚆',
    title: 'Soal Cerita Final: Andaikan, Menyusul, dan Rata-Rata',
    titleId: 'Koin, skor, kereta, dan data yang salah',
    minutes: 9,
    intro: md(String.raw`
      **1. Metode andaikan**
      250 keping koin Rp200 dan Rp500 berjumlah Rp56.000.
      Andaikan semua Rp200 → Rp50.000. Kurang Rp6.000, setiap ganti ke Rp500 bertambah Rp300 → 20 keping Rp500, **230** keping Rp200.
      Skor: 20 soal, benar +5, salah −3, nilai 60 → semua benar 100, setiap salah hilang 8 poin → $40 : 8 = 5$ salah.

      **2. Menyusul** (arah sama) → jarak awal : selisih kecepatan.
      Kereta A (60 km/jam) berangkat 1 jam lebih dulu → unggul 60 km. Kereta B (75 km/jam): $60 : 15 = 4$ jam.
      **Berpapasan** (arah berlawanan) → jarak : jumlah kecepatan.

      **3. Rata-rata**
      • Setiap data ditambah 12 lalu dibagi 5 → rata-rata juga: $(42 + 12) : 5 = 10{,}8$.
      • Salah baca: nilai 77 terbaca 79 pada 30 murid → rata-rata turun $2 : 30$.
      • Mobil yang dihitung dua kali: rata-rata A, B, C = 198 dan C, D, E = 203, rata-rata kelima mobil 200 → $C = 594 + 609 - 1.000 = 203$.

      **4. Perbandingan berantai** → samakan bagian tengah dengan KPK.
      Dina : Dani = 2 : 3 dan Dani : Dutra = 5 : 7 → 10 : 15 : 21.
    `),
    quiz: [
      ['20 keping koin Rp500 dan Rp1.000 berjumlah Rp14.000. Banyak koin Rp1.000 …', ['8', '12', '10'], 0, 'Semua Rp500 = Rp10.000. Kurang Rp4.000, tiap ganti +Rp500 → 8 keping Rp1.000.'],
      ['Kereta A (50 km/jam) berangkat 2 jam lebih dulu. Kereta B (70 km/jam) menyusul dalam …', ['5 jam', '2 jam', '7 jam'], 0, 'Unggul 100 km, selisih kecepatan 20 → 100 : 20 = 5 jam.'],
      ['Rata-rata 10 data adalah 20. Setiap data dikali 2 lalu ditambah 1. Rata-rata baru …', ['41', '40', '21'], 0, '20 × 2 + 1 = 41.'],
      ['Rata-rata nilai 5 anak 30. Ternyata nilai 42 terbaca 24. Rata-rata yang benar …', ['33,6', '26,4', '30'], 0, 'Kurang 18, dibagi 5 anak = 3,6. 30 + 3,6 = 33,6.'],
      ['Uang A : B = 2 : 3 dan B : C = 6 : 5. Perbandingan A : C …', ['4 : 5', '2 : 5', '12 : 15'], 0, 'A : B : C = 4 : 6 : 5, jadi A : C = 4 : 5.'],
    ],
  },
  {
    slug: 'kmsi-jso-l2-membilang',
    theme: LEVEL_2,
    emoji: '🤝',
    title: 'Membilang: Jabat Tangan, Titik pada Lingkaran, dan Grid',
    titleId: 'Kombinasi sederhana untuk babak final',
    minutes: 8,
    intro: md(String.raw`
      **1. Jabat tangan** (setiap orang sekali dengan semua orang)
      $$\text{banyak} = n \times (n - 1) : 2$$
      20 anak → $20 \times 19 : 2 = 190$.
      Jika berdiri **melingkar** dan hanya bersalaman dengan sebelahnya → banyaknya = $n$ (99 siswa → 99).

      **2. Segitiga dari titik-titik pada lingkaran**
      Dari 5 titik: $5 \times 4 \times 3 : 6 = 10$ segitiga.
      "Memuat A atau B" → semua dikurangi yang tanpa A dan B: $10 - 1 = 9$.

      **3. Segi empat dari titik pada dua garis**
      4 titik di garis atas, 3 di garis bawah → pilih 2 di atas dan 2 di bawah:
      $(4 \times 3 : 2) \times (3 \times 2 : 2) = 6 \times 3 = 18$.

      **4. Persegi panjang pada grid** → pilih 2 garis tegak dan 2 garis datar.
      Grid 3 × 3 (4 garis tiap arah) → $6 \times 6 = 36$.

      **5. Segitiga tak kongruen pada segi delapan** → tulis cara membagi 8 menjadi 3 bagian: (1,1,6), (1,2,5), (1,3,4), (2,2,4), (2,3,3) → **5** bentuk.

      > Kata kunci: "setiap pasangan" → n × (n − 1) : 2. "Bersebelahan saja" → n.
    `),
    quiz: [
      ['8 orang saling berjabat tangan sekali. Banyak jabat tangan …', ['28', '56', '16'], 0, '8 × 7 : 2 = 28.'],
      ['Banyak segitiga dari 6 titik pada lingkaran …', ['20', '15', '18'], 0, '6 × 5 × 4 : 6 = 20.'],
      ['3 titik di garis atas dan 3 titik di garis bawah. Banyak segi empat …', ['9', '6', '12'], 0, '3 × 3 = 9.'],
      ['Banyak persegi panjang pada grid 2 baris × 3 kolom …', ['18', '12', '9'], 0, 'Garis datar 3 (pilih 2 = 3 cara), garis tegak 4 (pilih 2 = 6 cara). 3 × 6 = 18.'],
      ['12 anak berdiri melingkar, masing-masing bersalaman sekali dengan anak di sebelahnya. Banyak salaman …', ['12', '66', '24'], 0, 'Pada lingkaran, banyak pasangan bersebelahan = banyak anak = 12.'],
    ],
  },
  {
    slug: 'kmsi-jso-l2-geometri-final',
    theme: LEVEL_2,
    emoji: '🕚',
    title: 'Geometri Final: Sudut Segi-n, Jarum Jam, dan Persegi ⅕',
    titleId: 'Teori geometri yang sering keluar',
    minutes: 8,
    intro: md(String.raw`
      **1. Sudut segi-$n$ beraturan**
      $$\text{satu sudut dalam} = \frac{(n - 2) \times 180^\circ}{n}$$
      Segi-8 → $1.080^\circ : 8 = 135^\circ$. Segi-6 → $120^\circ$.

      **2. Sudut dua jarum jam**
      $$\theta = |30 \times \text{jam} - 5{,}5 \times \text{menit}|$$
      Pukul 11.45 → $|330 - 247{,}5| = 82{,}5^\circ$.

      **3. Persegi di dalam persegi**
      • Menghubungkan **titik tengah** keempat sisi → luasnya **½** persegi besar.
      • Garis dari titik sudut ke titik tengah sisi (berputar) membentuk persegi kecil dengan luas **⅕** persegi besar. Jika arsiran 4 cm², persegi besar 20 cm².

      **4. Perbandingan luas dua segitiga** dengan tinggi sama → sebanding alasnya.
      Segitiga hitam dan putih pada soal JSO memberi perbandingan $a^2 : b^2$.

      **5. Keliling lingkaran**: $K = 2 \times \frac{22}{7} \times r$. Taman $r = 14$ m → 88 m. Berlari 6 km butuh minimal $6.000 : 88 \approx 68{,}2$ → **69** putaran.
    `),
    quiz: [
      ['Besar satu sudut dalam segi-6 beraturan …', ['120°', '108°', '135°'], 0, '(6 − 2) × 180° : 6 = 120°.'],
      ['Sudut terkecil kedua jarum jam pada pukul 03.30 …', ['75°', '90°', '105°'], 0, '|90 − 165| = 75°.'],
      ['Titik tengah keempat sisi persegi seluas 100 cm² dihubungkan. Luas persegi kecil …', ['50 cm²', '25 cm²', '20 cm²'], 0, 'Menghubungkan titik tengah menghasilkan ½ luas.'],
      ['Persegi kecil (⅕ dari persegi besar) luasnya 9 cm². Luas persegi besar …', ['45 cm²', '36 cm²', '18 cm²'], 0, '5 × 9 = 45 cm².'],
      ['Jumlah semua sudut dalam segi-5 …', ['540°', '360°', '720°'], 0, '(5 − 2) × 180° = 540°.'],
    ],
  },
];
