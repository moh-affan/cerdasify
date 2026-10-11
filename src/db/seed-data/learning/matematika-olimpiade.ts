// Materi & Trik Olimpiade Matematika SD — dipetakan dari tipe soal di bank soal:
// Babak Penyisihan (PRISMA), Semifinal & Final Provinsi (CEO, sesi latihan), Final Nasional (ORION, OSN SD, IMOCSEA).
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

const PENYISIHAN = 'Olimpiade: Babak Penyisihan';
const SEMIFINAL = 'Olimpiade: Semifinal & Final Provinsi';
const FINAL = 'Olimpiade: Final Nasional & OSN';

export const matematikaOlimpiade: SeedLesson[] = [
  // ───────────── Babak Penyisihan ─────────────
  {
    slug: 'olim-antrean-dan-soal-jebakan',
    theme: PENYISIHAN,
    emoji: '🧍',
    title: 'Trik Soal Antrean dan Soal Cerita Jebakan',
    titleId: 'Urutan dari depan–belakang, tiang pagar, dan kata kunci',
    minutes: 6,
    phaseMin: 'A',
    intro: md(String.raw`
      Soal antrean hampir selalu muncul di babak penyisihan. Hafalkan rumusnya!

      **1. Urutan dari depan dan dari belakang**
      Budi urutan ke-5 dari depan dan ke-8 dari belakang.
      $$\text{banyak orang} = 5 + 8 - 1 = 12$$
      Dikurangi 1 karena **Budi terhitung dua kali**.

      **2. Mencari urutan dari belakang**
      Ada 40 orang. Rina urutan ke-15 dari depan.
      $$\text{dari belakang} = 40 - 15 + 1 = 26$$

      **3. Orang di antara dua orang**
      15 anak berbaris. Ben ke-4 dari depan, Carlo ke-3 dari belakang (= ke-13 dari depan).
      $$\text{di antara} = 13 - 4 - 1 = 8 \text{ anak}$$

      **4. Tiang pagar dan memotong**
      • Jalan 20 m, pohon tiap 5 m, **di kedua ujung** ada pohon → $20 : 5 + 1 = 5$ pohon.
      • Memotong kayu menjadi 4 bagian hanya butuh **3 kali** potong.

      **5. Awas kata jebakan!**
      • "Satu piring **kosong**" → piring itu tidak berisi kue.
      • "4 lebih **sedikit** dari Rina (10)" → Susi punya 6. Total mereka $10 + 6 = 16$.
      • "**Tidak** dihitung" → kurangi dari jumlah.

      > Baca soal dua kali. Garis bawahi kata: kosong, tidak, lebih sedikit, seluruhnya, sisa.
    `),
    notes: [
      {
        title: 'Rumus Kilat Antrean',
        pattern: 'Total = depan + belakang − 1',
        explanation: 'Dari belakang = total − dari depan + 1. Di antara A dan B = selisih urutan − 1.',
        examples: ['Ke-7 dari depan & ke-12 dari belakang → 18 orang', 'Pohon di kedua ujung: jarak : selang + 1'],
      },
    ],
    quiz: [
      ['Rudi urutan ke-7 dari depan dan ke-12 dari belakang. Banyak anak dalam barisan …', ['19', '18', '17'], 1, '7 + 12 − 1 = 18.'],
      ['Ada 30 orang mengantre. Ani urutan ke-12 dari depan. Dari belakang, Ani urutan ke …', ['18', '19', '20'], 1, '30 − 12 + 1 = 19.'],
      ['Jalan sepanjang 100 m ditanami pohon setiap 10 m, termasuk di kedua ujung. Banyak pohon …', ['10', '11', '9'], 1, '100 : 10 + 1 = 11.'],
      ['Memotong kayu sekali butuh 2 menit. Waktu memotong kayu menjadi 6 bagian …', ['12 menit', '10 menit', '6 menit'], 1, '6 bagian butuh 5 kali potong → 5 × 2 = 10 menit.'],
      ['Rina punya 10 permen. Susi punya 4 permen lebih sedikit dari Rina. Banyak permen mereka seluruhnya …', ['14', '16', '6'], 1, 'Susi 10 − 4 = 6. Seluruhnya 10 + 6 = 16.'],
    ],
  },
  {
    slug: 'olim-hari-jam-dan-satuan',
    theme: PENYISIHAN,
    emoji: '📅',
    title: 'Trik Hari, Jam, dan Satuan Unik',
    titleId: 'Sisa bagi 7, windu–lustrum, lusin–gross–kodi–rim',
    minutes: 7,
    phaseMin: 'A',
    intro: md(String.raw`
      **1. Menghitung hari** → hari berulang setiap **7 hari**. Cukup lihat **sisa bagi 7**.
      • Hari ini Senin. 10 hari lagi? $10 : 7$ sisa **3** → Senin + 3 = **Kamis**.
      • 4 hari lalu Kamis → hari ini Senin. 2024 hari lagi? $2024 = 7 \times 289 + 1$ → Senin + 1 = **Selasa**.
      • Kemarin Sabtu → hari ini Minggu → **besok lusa** (2 hari lagi) = **Selasa**.

      **2. Menghitung tanggal**: 8 Februari hari Rabu. 28 Februari? Selisih 20 hari, $20 : 7$ sisa 6 → Rabu + 6 = **Selasa**.

      **3. Satuan waktu**
      • 1 windu = 8 tahun · 1 lustrum = 5 tahun · 1 dasawarsa = 10 tahun
      • 1 abad = 100 tahun · 1 milenium = 1.000 tahun
      Contoh: 4 dasawarsa + 5 lustrum + 72 bulan $= 40 + 25 + 6 = 71$ tahun.

      **4. Satuan jumlah**
      • 1 lusin = 12 · 1 gross = 144 (12 lusin) · 1 kodi = 20 · 1 rim = 500 lembar
      Contoh: 5 gross − 13 lusin + 25 buah $= 720 - 156 + 25 = 589$ buah.

      **5. Tangga satuan**
      • Panjang: km → hm → dam → m → dm → cm → mm (turun 1 anak tangga = ×10)
      • Berat: kg → hg (ons) → dag → g, dan 1 kuintal = 100 kg, 1 ton = 1.000 kg
      Contoh: 146 dam = 1,46 km · 20 kg = 200 ons.

      **6. Jam**: 19.15 + 3 jam 50 menit → 22.65 = **23.05** (60 menit = 1 jam).

      > Sisa bagi 0 berarti harinya **sama** dengan hari ini.
    `),
    quiz: [
      ['Hari ini Selasa. 34 hari lagi hari …', ['Senin', 'Selasa', 'Rabu'], 0, '34 : 7 sisa 6 → Selasa + 6 = Senin.'],
      ['2 windu + 3 lustrum = … tahun', ['31', '25', '26'], 0, '16 + 15 = 31 tahun.'],
      ['3 gross = … buah', ['36', '432', '300'], 1, '3 × 144 = 432.'],
      ['Kakak membeli 2 rim kertas. Terpakai 650 lembar. Sisa kertas … lembar', ['350', '1.350', '150'], 0, '2 rim = 1.000 lembar. 1.000 − 650 = 350.'],
      ['Ibu berangkat pukul 07.30 dan kembali 4 jam 15 menit kemudian, yaitu pukul …', ['11.15', '11.45', '12.45'], 1, '07.30 + 4.15 = 11.45.'],
    ],
  },
  {
    slug: 'olim-simbol-dan-operasi-baru',
    theme: PENYISIHAN,
    emoji: '🔣',
    title: 'Trik Soal Simbol dan Operasi Baru',
    titleId: 'Kotak, segitiga, timbangan, dan operasi buatan',
    minutes: 7,
    phaseMin: 'A',
    intro: md(String.raw`
      Simbol seperti ☐, ▲, ● hanyalah **bilangan yang disembunyikan**.

      **1. Jumlah dan selisih**
      ☐ + ▲ = 18 dan ☐ − ▲ = 14.
      $$\square = \frac{18 + 14}{2} = 16 \qquad \blacktriangle = \frac{18 - 14}{2} = 2$$

      **2. Trik menjumlahkan semua persamaan**
      △ + △ + ☐ = 32 dan △ + ☐ + ☐ = 22. Berapa △ + ☐?
      Jumlahkan kedua baris: 3 △ + 3 ☐ = 54 → **△ + ☐ = 18**. Tidak perlu mencari satu per satu!

      **3. Timbangan (substitusi)**
      1 kucing = 2 kelinci, 1 kelinci = 3 tikus → 1 kucing = $2 \times 3 = 6$ tikus.

      **4. Operasi buatan** → ganti huruf dengan angka, kerjakan **kurung dulu**.
      • $a \star b = a + b + (a \times b)$ → $2 \star 5 = 2 + 5 + 10 = 17$
      • $a \oplus b = (a + b) : 2$ → $12 \oplus (8 \oplus 4) = 12 \oplus 6 = 9$

      **5. Pola operasi tersembunyi** (sering di final!)
      $$3 \oplus 2 = 51 \qquad 5 \oplus 1 = 64 \qquad 6 \oplus 4 = 102$$
      Coba-coba: angka depan = $a + b$, angka belakang = $a - b$.
      $3 + 2 = 5$ dan $3 - 2 = 1$ → 51 ✓. Jadi $4 \oplus 2$ → 6 dan 2 → **62**.

      > Untuk pola tersembunyi, coba berurutan: jumlah, selisih, kali, lalu gabungan angka.
    `),
    notes: [
      {
        title: 'Rumus Jumlah–Selisih',
        pattern: 'Besar = (jumlah + selisih) : 2 · Kecil = (jumlah − selisih) : 2',
        explanation: 'Berlaku untuk semua soal "jumlah dua bilangan … selisihnya …", termasuk harga dan umur.',
        examples: ['Bola + pemukul = 210.000, pemukul lebih mahal 50.000 → bola = 160.000 : 2 = 80.000'],
      },
    ],
    quiz: [
      ['Jika a ★ b = 2a − b, maka 5 ★ 3 = …', ['7', '13', '4'], 0, '2 × 5 − 3 = 7.'],
      ['▲ + ▲ + ● = 25 dan ▲ + ● + ● = 20. Nilai ▲ + ● = …', ['15', '45', '10'], 0, 'Jumlahkan: 3▲ + 3● = 45 → ▲ + ● = 15.'],
      ['☐ + ▲ = 30 dan ▲ = ☐ + 6. Nilai ☐ = …', ['12', '18', '24'], 0, '☐ + ☐ + 6 = 30 → ☐ = 12.'],
      ['Jika 3 ⊕ 2 = 51, 5 ⊕ 1 = 64, dan 6 ⊕ 4 = 102, maka 4 ⊕ 2 = …', ['62', '86', '42'], 0, 'Angka depan a + b = 6, angka belakang a − b = 2 → 62.'],
      ['1 apel = 2 jeruk dan 1 jeruk = 4 anggur. 3 apel = … anggur', ['24', '12', '9'], 0, '1 apel = 8 anggur, jadi 3 apel = 24 anggur.'],
    ],
  },
  {
    slug: 'olim-pola-berulang-dan-barisan',
    theme: PENYISIHAN,
    emoji: '🔁',
    title: 'Trik Pola Berulang dan Barisan Bilangan',
    titleId: 'Huruf ke-n, sisa bagi, dan pola korek api',
    minutes: 7,
    phaseMin: 'A',
    intro: md(String.raw`
      **1. Pola berulang** → cari panjang satu putaran, lalu lihat **sisa bagi**.
      BELAJARBELAJAR… Huruf ke-520?
      • Satu putaran "BELAJAR" = 7 huruf.
      • $520 = 7 \times 74 + 2$ → sisa **2** → huruf ke-2 = **E**.
      • Jika sisanya **0**, ambil huruf **terakhir** dalam putaran.
      Contoh: 8, 3, 6, 7, 8, 3, 6, 7, … suku ke-1536 → $1536 : 4$ sisa 0 → **7**.

      **2. Barisan selisih tetap** (aritmetika)
      $$U_n = a + (n - 1) \times b$$
      Korek api: 4, 6, 8, … → $U_n = 4 + (n - 1) \times 2 = 2n + 2$. Gambar ke-10 butuh 22 batang.

      **3. Barisan selisih bertambah**
      • 1, 3, 6, 10, 15 (bilangan segitiga) → $U_n = \frac{n(n + 1)}{2}$, suku ke-8 = 36.
      • 2, 6, 12, 20, 30 → $U_n = n(n + 1)$, suku ke-8 = 72.
      • 1, 4, 9, 16, … (bilangan kuadrat) → $U_n = n^2$.

      **4. Barisan dikali** (rasio)
      6, 12, 24, 48, … → $U_n = 6 \times 2^{n-1}$, suku ke-6 = 192.

      **5. Pola campuran**
      2, 5, 11, 23, 47, … → setiap suku **dikali 2 lalu ditambah 1** → 95, 191.

      > Langkah cepat: tulis selisih antarsuku. Jika selisihnya belum tetap, tulis selisih dari selisihnya.
    `),
    quiz: [
      ['CERDASCERDAS… Huruf ke-75 adalah …', ['C', 'E', 'R'], 2, '75 = 6 × 12 + 3 → huruf ke-3 = R.'],
      ['Suku ke-25 dari 3, 7, 11, 15, … adalah …', ['99', '103', '95'], 0, '3 + 24 × 4 = 99.'],
      ['Suku ke-12 dari 1, 4, 9, 16, … adalah …', ['144', '121', '132'], 0, 'Bilangan kuadrat: 12² = 144.'],
      ['Bilangan berikutnya dari 3, 7, 15, 31, … adalah …', ['47', '63', '62'], 1, 'Dikali 2 lalu ditambah 1: 31 × 2 + 1 = 63.'],
      ['Pola 1, 2, 3, 1, 2, 3, … Suku ke-100 adalah …', ['1', '2', '3'], 0, '100 : 3 sisa 1 → suku pertama = 1.'],
    ],
  },

  // ───────────── Semifinal & Final Provinsi ─────────────
  {
    slug: 'olim-metode-andaikan',
    theme: SEMIFINAL,
    emoji: '🐔',
    title: 'Metode Andaikan: Ayam–Kambing dan Bagi-Bagi',
    titleId: 'Soal kaki hewan, kantong isi berbeda, kurang–sisa',
    minutes: 8,
    intro: md(String.raw`
      **1. Ayam–kambing (andaikan semuanya sama)**
      35 hewan (bebek dan kambing), jumlah kaki 100.
      • **Andaikan** semua bebek → kakinya $35 \times 2 = 70$.
      • Kurang $100 - 70 = 30$ kaki.
      • Setiap bebek diganti kambing, kaki bertambah $4 - 2 = 2$.
      • Banyak kambing $= 30 : 2 = 15$, bebek $= 20$.
      $$\text{kambing} = \frac{\text{kaki} - 2 \times \text{hewan}}{4 - 2}$$

      **2. Kantong isi berbeda** (metode yang sama!)
      39 jeruk dalam 9 kantong, isi 3 atau 5. Andaikan semua isi 3 → 27. Kurang 12, setiap ganti +2 → **6 kantong isi 5**, 3 kantong isi 3.

      **3. Skor benar–salah**: andaikan semua benar, lalu hitung berapa poin "hilang" untuk setiap jawaban salah.

      **4. Soal kurang–sisa**
      Nenek membagi rambutan. Setiap cucu 4 buah → **sisa 4**. Setiap cucu 6 buah → **kurang 2**.
      $$\text{banyak cucu} = \frac{\text{sisa} + \text{kurang}}{\text{selisih pembagian}} = \frac{4 + 2}{6 - 4} = 3$$
      Rambutan $= 3 \times 4 + 4 = 16$.

      **5. Uang kurang–sisa**
      Beli 26 mawar uangnya kurang Rp3.000. Beli 16 mawar uangnya sisa Rp2.000.
      Selisih 10 tangkai = Rp5.000 → 1 tangkai = Rp500. Uang ayah $= 16 \times 500 + 2.000 = \text{Rp}10.000$.

      > Sisa dan kurang **dijumlahkan**. Jika keduanya sisa (atau keduanya kurang), **dikurangkan**.
    `),
    quiz: [
      ['30 ekor ayam dan sapi memiliki 80 kaki. Banyak sapi …', ['10', '20', '15'], 0, 'Semua ayam: 60 kaki. Kurang 20, tiap sapi +2 → 10 sapi.'],
      ['Ada 15 sepeda dan becak dengan 38 roda. Banyak becak …', ['7', '8', '9'], 1, 'Semua sepeda: 30 roda. Kurang 8, tiap becak +1 → 8 becak.'],
      ['20 soal semua dijawab. Benar +5, salah −2. Skor Andi 72. Banyak jawaban salah …', ['4', '6', '3'], 0, 'Semua benar = 100. Tiap salah kehilangan 7 poin. 28 : 7 = 4.'],
      ['Kelereng dibagikan: tiap anak 5 sisa 3, tiap anak 7 kurang 5. Banyak kelereng …', ['23', '28', '20'], 0, 'Anak = (3 + 5) : (7 − 5) = 4. Kelereng = 4 × 5 + 3 = 23.'],
      ['Jumlah dua bilangan 21, selisihnya 3. Hasil kali kedua bilangan …', ['108', '110', '90'], 0, 'Besar (21 + 3) : 2 = 12, kecil 9. 12 × 9 = 108.'],
    ],
  },
  {
    slug: 'olim-umur-dan-perbandingan',
    theme: SEMIFINAL,
    emoji: '👴',
    title: 'Trik Soal Umur dan Perbandingan Berantai',
    titleId: 'Selisih umur tetap, menyamakan perbandingan',
    minutes: 8,
    phaseMax: 'D',
    intro: md(String.raw`
      **Teori 1: selisih umur dua orang selalu tetap.**
      Umur kakek 7 kali umur cucu. Lima tahun lalu selisihnya 54 tahun → sekarang pun selisihnya 54.
      $$7\text{ bagian} - 1\text{ bagian} = 6\text{ bagian} = 54 \Rightarrow 1\text{ bagian} = 9$$
      Cucu 9 tahun, kakek 63 tahun, jumlah **72**.

      **Teori 2: jumlah umur bertambah sebanyak orangnya.**
      Jumlah umur Ani dan Budi 34. Empat tahun lagi → $34 + 2 \times 4 = 42$.

      **Teori 3: kerjakan "saat itu" dulu.**
      Dodi sekarang 14. Delapan tahun lalu umur ayah 4 kali umur Dodi saat itu → $4 \times 6 = 24$ → ayah sekarang **32**.

      **Perbandingan berantai** → samakan bagian yang sama dengan KPK.
      Merah : biru = 3 : 4 dan biru : kuning = 5 : 7. Biru disamakan menjadi 20:
      $$\text{merah} : \text{biru} : \text{kuning} = 15 : 20 : 28$$

      **Perbandingan dengan jumlah**
      Gula : beras : tepung = 4 : 8 : 7, beras + tepung = 75 kg.
      $$8 + 7 = 15\text{ bagian} = 75 \Rightarrow 1\text{ bagian} = 5 \Rightarrow \text{gula} = 20\text{ kg}$$

      **Contoh final**: A : B = 2 : 3, B : C = 6 : 5, rata-rata ketiganya 60.
      A : B : C = 4 : 6 : 5 (15 bagian). Total $= 3 \times 60 = 180$ → 1 bagian = 12 → **A = 48**.
    `),
    quiz: [
      ['Umur ayah 4 kali umur anak. 20 tahun lagi umur ayah 2 kali umur anak. Umur ayah sekarang …', ['40', '36', '48'], 0, '4x + 20 = 2(x + 20) → x = 10, ayah 40.'],
      ['Selisih umur kakak dan adik 5 tahun. Selisih umur mereka 10 tahun lagi …', ['15', '5', '10'], 1, 'Selisih umur selalu tetap.'],
      ['A : B = 2 : 3 dan B : C = 4 : 5. Maka A : B : C = …', ['2 : 3 : 5', '8 : 12 : 15', '8 : 12 : 20'], 1, 'B disamakan menjadi 12: 8 : 12 : 15.'],
      ['Uang Ani : Budi = 3 : 5, jumlahnya Rp64.000. Uang Budi …', ['Rp40.000', 'Rp24.000', 'Rp38.400'], 0, '8 bagian = 64.000 → 1 bagian 8.000 → Budi 5 × 8.000 = 40.000.'],
      ['Jumlah umur 3 bersaudara sekarang 30 tahun. Jumlah umur mereka 5 tahun lagi …', ['35', '45', '40'], 1, 'Setiap orang bertambah 5: 30 + 3 × 5 = 45.'],
    ],
  },
  {
    slug: 'olim-kpk-fpb-dan-bilangan-prima',
    theme: SEMIFINAL,
    emoji: '⏰',
    title: 'KPK, FPB, dan Bilangan Prima Tingkat Olimpiade',
    titleId: 'Bersamaan pada hari apa, sisa sama, banyak faktor',
    minutes: 9,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Bersama lagi pada hari apa?** → KPK lalu sisa bagi 7.
      Ani berenang tiap 2 hari, Dina tiap 3 hari, Yanti tiap 4 hari, bersama hari Selasa.
      KPK(2, 3, 4) = 12 → $12 : 7$ sisa 5 → Selasa + 5 = **Minggu**.

      **2. Habis dibagi beberapa bilangan** → kelipatan KPK-nya.
      Bilangan antara 100 dan 140 yang habis dibagi 4, 6, dan 9: KPK = 36 → kelipatan 36: 36, 72, **108**, 144.

      **3. Sisa sama** → KPK + sisa.
      Bilangan terkecil (> 1) yang dibagi 4, 5, dan 6 bersisa 1 → $60 + 1 = 61$.

      **4. Parsel identik** → FPB.
      48 pisang, 32 apel, 56 jeruk → FPB = 8 parsel, tiap parsel 6 pisang, 4 apel, 7 jeruk.

      **5. Banyak faktor** — tulis faktorisasi prima, tambah 1 pada setiap pangkat, lalu kalikan.
      $$n = p^a \times q^b \Rightarrow \text{banyak faktor} = (a + 1)(b + 1)$$
      $72 = 2^3 \times 3^2$ → $(3 + 1)(2 + 1) = 12$ faktor.

      **6. Bilangan prima**
      • Prima < 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 (15 bilangan)
      • Jumlah dua prima = 44 dengan selisih terbesar → pilih prima terkecil yang mungkin: $3 + 41$.
      • Cek prima: coba bagi dengan prima ≤ √n. Untuk 97 cukup coba 2, 3, 5, 7 → 97 prima.

      > Jumlah dua prima bernilai ganjil → salah satunya pasti **2**.
    `),
    quiz: [
      ['FPB dari 125, 240, dan 375 adalah …', ['5', '25', '15'], 0, '125 = 5³, 240 = 2⁴ × 3 × 5, 375 = 3 × 5³. Faktor sama: 5.'],
      ['Banyak faktor dari 36 adalah …', ['6', '9', '8'], 1, '36 = 2² × 3² → (2 + 1)(2 + 1) = 9.'],
      ['Bilangan terkecil lebih dari 1 yang dibagi 2, 3, atau 4 selalu bersisa 1 adalah …', ['13', '25', '7'], 0, 'KPK(2, 3, 4) = 12, ditambah 1 = 13.'],
      ['40 pria dan 28 wanita dibagi ke kelompok-kelompok dengan komposisi sama. Paling banyak ada … kelompok', ['4', '8', '7'], 0, 'FPB(40, 28) = 4.'],
      ['Banyak bilangan prima antara 20 dan 40 adalah …', ['4', '5', '3'], 0, '23, 29, 31, 37.'],
    ],
  },
  {
    slug: 'olim-jumlah-cerdik-gauss-teleskopik',
    theme: SEMIFINAL,
    emoji: '➕',
    title: 'Jumlah Cerdik: Gauss, Teleskopik, dan Selisih Kuadrat',
    titleId: 'Menjumlah ratusan bilangan dalam sekejap',
    minutes: 9,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Banyak suku**
      $$\text{banyak suku} = \frac{\text{akhir} - \text{awal}}{\text{beda}} + 1$$

      **2. Rumus Gauss** (barisan selisih tetap)
      $$\text{jumlah} = \frac{\text{awal} + \text{akhir}}{2} \times \text{banyak suku}$$
      Jumlah bilangan genap 1–400: $2 + 4 + \dots + 400$ → 200 suku → $\frac{2 + 400}{2} \times 200 = 40.200$.

      **3. Trik memasangkan**
      Jumlah ganjil 21–41 dikurangi jumlah genap 22–40:
      $21 + (23 - 22) + (25 - 24) + \dots + (41 - 40) = 21 + 10 = 31$.

      **4. Teleskopik** (saling mencoret)
      $$\frac{1}{n(n + 1)} = \frac{1}{n} - \frac{1}{n + 1}$$
      $$\frac{1}{2} + \frac{1}{6} + \frac{1}{12} + \frac{1}{20} + \frac{1}{30} = \left(1 - \tfrac{1}{2}\right) + \left(\tfrac{1}{2} - \tfrac{1}{3}\right) + \dots + \left(\tfrac{1}{5} - \tfrac{1}{6}\right) = \frac{5}{6}$$

      **5. Selisih kuadrat**
      $$a^2 - b^2 = (a + b)(a - b) \Rightarrow \frac{2019^2 - 2017^2}{2019 - 2017} = 2019 + 2017 = 4.036$$

      **6. Pola kuadrat tersembunyi**
      $6 \times 8 + 1 = 49 = 7^2$, $8 \times 12 + 4 = 100 = 10^2$, $12 \times 18 + 9 = 225 = 15^2$, $18 \times 26 + 16 = 484 = 22^2$.
      Jadi $\sqrt{6 \times 8 + 1} + \sqrt{8 \times 12 + 4} + \sqrt{12 \times 18 + 9} + \sqrt{18 \times 26 + 16} = 7 + 10 + 15 + 22 = 54$.

      **7. Kalikan dulu, baru jumlahkan**
      $[0{,}5 + 0{,}5^2 + 0{,}5^3 + 0{,}5^4] \times 16 = 8 + 4 + 2 + 1 = 15$
    `),
    quiz: [
      ['1 + 2 + 3 + … + 40 = …', ['820', '800', '840'], 0, '(1 + 40) : 2 × 40 = 820.'],
      ['5 + 10 + 15 + … + 100 = …', ['1.050', '1.000', '2.100'], 0, '20 suku: (5 + 100) : 2 × 20 = 1.050.'],
      ['1/(1×2) + 1/(2×3) + … + 1/(9×10) = …', ['9/10', '1/10', '10/9'], 0, 'Teleskopik: 1 − 1/10 = 9/10.'],
      ['2026² − 2024² = …', ['8.100', '4.050', '8.000'], 0, '(2026 + 2024)(2026 − 2024) = 4.050 × 2 = 8.100.'],
      ['Banyak suku barisan 7, 11, 15, …, 99 adalah …', ['23', '24', '25'], 1, '(99 − 7) : 4 + 1 = 24.'],
      ['1 − 2 + 3 − 4 + … + 99 − 100 = …', ['−50', '50', '−100'], 0, 'Ada 50 pasangan (1 − 2), masing-masing −1 → −50.'],
    ],
  },

  // ───────────── Final Nasional & OSN ─────────────
  {
    slug: 'olim-membilang-dan-sarang-merpati',
    theme: FINAL,
    emoji: '🔢',
    title: 'Membilang: Banyak Persegi, Angka, dan Prinsip Sarang Merpati',
    titleId: 'Menghitung tanpa terlewat dan tanpa dobel',
    minutes: 10,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Banyak persegi pada papan $n \times n$**
      $$1^2 + 2^2 + \dots + n^2$$
      Papan 3×3: $9 + 4 + 1 = 14$ persegi. Papan 4×4: $16 + 9 + 4 + 1 = 30$.

      **2. Banyak segitiga "kipas"**: dari satu puncak ditarik garis ke alas sehingga alas terbagi $n$ ruas → $\frac{n(n + 1)}{2}$ segitiga. Alas 4 ruas → 10 segitiga.

      **3. Banyak angka tertentu muncul** (misalnya nomor rumah 1–150 yang memuat angka 8)
      • Satuan 8: 8, 18, …, 148 → 15 nomor
      • Puluhan 8: 80–89 → 10 nomor
      • Dihitung dua kali: 88 → 1
      $$15 + 10 - 1 = 24 \text{ nomor}$$

      **4. Halaman berhadapan** jumlahnya 125 → dua bilangan berurutan: $\frac{125 - 1}{2} = 62$ dan 63.

      **5. Menyusun bilangan (kaidah perkalian)**
      Bilangan 2 angka > 60 dari angka 3, 7, 4, 6, 9 (tanpa berulang): puluhan 6, 7, atau 9 (3 cara) × satuan sisanya (4 cara) = **12**.
      Berfoto 3 orang berjajar: $3 \times 2 \times 1 = 6$ susunan.

      **6. Mendaftar sistematis** — 75 sen dari koin 5, 25, dan 50 sen:
      • Pakai 50: (50 + 25), (50 + 5×5) → 2 cara
      • Tanpa 50: 25 sebanyak 3, 2, 1, 0 kali, sisanya koin 5 → 4 cara
      • Total **6 cara**

      **7. Prinsip sarang merpati (kasus terburuk)**
      Kantong berisi 6 bola biru, 5 hijau, dan 3 merah. Agar **pasti** mendapat bola merah, bayangkan kamu sangat sial: ambil semua biru dan hijau dulu → $6 + 5 + 1 = 12$ bola.
      Agar pasti mendapat 2 bola sewarna: $3 + 1 = 4$ bola (satu tiap warna, lalu satu lagi pasti kembar).

      > Kunci membilang: buat kasus, daftar berurutan dari kecil ke besar, dan cek yang terhitung dua kali.
    `),
    quiz: [
      ['Banyak persegi pada papan catur 4×4 adalah …', ['16', '30', '20'], 1, '16 + 9 + 4 + 1 = 30.'],
      ['Banyak nomor 1–100 yang memuat angka 5 adalah …', ['19', '20', '10'], 0, 'Satuan 5: 10 nomor, puluhan 5: 10 nomor, 55 dihitung dua kali → 19.'],
      ['Dua halaman buku yang berhadapan berjumlah 85. Nomor halaman yang lebih kecil …', ['42', '43', '41'], 0, '(85 − 1) : 2 = 42, pasangannya 43.'],
      ['Laci gelap berisi 5 kaus kaki merah dan 5 biru. Paling sedikit diambil … agar pasti dapat sepasang warna sama', ['3', '2', '6'], 0, 'Terburuk: merah, biru, lalu yang ketiga pasti kembar.'],
      ['Banyak bilangan 3 angka berbeda yang disusun dari angka 1, 2, 3, 4 adalah …', ['24', '64', '12'], 0, '4 × 3 × 2 = 24.'],
    ],
  },
  {
    slug: 'olim-sudut-jarum-jam-dan-segitiga',
    theme: FINAL,
    emoji: '🕓',
    title: 'Sudut Jarum Jam dan Teka-Teki Sudut Segitiga',
    titleId: 'Rumus |30h − 5,5m| dan segitiga sama kaki',
    minutes: 9,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Rumus sudut dua jarum jam** (jam $h$, menit $m$)
      $$\theta = |30h - 5{,}5m|$$
      Jika hasilnya lebih dari $180^\circ$, sudut kecilnya $360^\circ - \theta$.
      • Pukul 04.15: $|120 - 82{,}5| = 37{,}5^\circ$
      • Pukul 16.00 (= jam 4): $120^\circ$ → sudut **tumpul**

      **Mengapa?** Jarum menit bergerak $6^\circ$ per menit; jarum jam bergerak $30^\circ$ per jam = $0{,}5^\circ$ per menit.
      Jarum menit dari 11.05 sampai 11.24 (19 menit) berputar $19 \times 6^\circ = 114^\circ$.

      **2. Pecahan putaran**: 1 putaran = $360^\circ$ → $\frac{1}{5}$ putaran $= 72^\circ$, $\frac{1}{4}$ putaran $= 90^\circ$.

      **3. Kunci sudut segitiga**
      • Jumlah sudut segitiga $180^\circ$; sudut luar = jumlah dua sudut dalam yang jauh.
      • **Segitiga sama kaki** → dua sudut alas sama besar. Cari sisi yang sama panjang!

      **Contoh tingkat OSN**: segitiga $ABC$ siku-siku di $A$, $\angle C = 34^\circ$. Titik $D$ pada $BC$ dengan $CD = CA$.
      • Segitiga $CAD$ sama kaki → $\angle CAD = \angle CDA = \frac{180^\circ - 34^\circ}{2} = 73^\circ$
      • $\angle DAB = 90^\circ - 73^\circ = 17^\circ$

      **4. Sudut siku-siku dibagi**: $(6x + 4) + (5x + 9) = 90$ → $11x = 77$ → $x = 7$, sudut pertama $46^\circ$.

      > Tandai setiap sisi yang sama panjang di gambar. Hampir semua soal sudut final memakai segitiga sama kaki tersembunyi.
    `),
    quiz: [
      ['Sudut terkecil kedua jarum jam pada pukul 02.30 adalah …', ['105°', '90°', '120°'], 0, '|30 × 2 − 5,5 × 30| = |60 − 165| = 105°.'],
      ['Sudut terkecil kedua jarum jam pada pukul 08.20 adalah …', ['130°', '120°', '140°'], 0, '|240 − 110| = 130°.'],
      ['Dalam 20 menit, jarum menit berputar sebesar …', ['120°', '100°', '20°'], 0, '20 × 6° = 120°.'],
      ['Sudut puncak segitiga sama kaki 40°. Besar setiap sudut alasnya …', ['70°', '140°', '50°'], 0, '(180° − 40°) : 2 = 70°.'],
      ['Sudut ⅕ putaran penuh adalah …', ['72°', '60°', '36°'], 0, '360° : 5 = 72°.'],
    ],
  },
  {
    slug: 'olim-luas-arsiran-dan-bangun-gabungan',
    theme: FINAL,
    emoji: '⬛',
    title: 'Luas Arsiran, Persegi dalam Lingkaran, dan Bangun Gabungan',
    titleId: 'Potong–tempel dan trik luas tingkat final',
    minutes: 10,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Persegi di dalam lingkaran** (titik sudutnya pada lingkaran, jari-jari $r$)
      Diagonal persegi = diameter $= 2r$. Luas persegi = $\frac{\text{diagonal}^2}{2}$:
      $$L = \frac{(2r)^2}{2} = 2r^2$$
      Jari-jari 4 cm → luas persegi $= 32$ cm².

      **2. Lingkaran di dalam persegi** (sisi $s$): $r = \frac{s}{2}$, luas lingkaran $= \frac{\pi s^2}{4}$.
      Sisi 14 → lingkaran 154 cm², arsiran di pojok $= 196 - 154 = 42$ cm².

      **3. Luas arsiran = besar − kecil**
      Tembereng (seperempat lingkaran dikurangi segitiga), $r = 14$:
      $$\tfrac{1}{4} \times 616 - \tfrac{1}{2} \times 14 \times 14 = 154 - 98 = 56 \text{ cm}^2$$

      **4. Teori segitiga dalam persegi panjang**
      Segitiga dengan alas sisi persegi panjang dan puncak di sisi seberangnya → luasnya **selalu setengah** persegi panjang, di mana pun puncaknya.

      **5. Diagonal membagi sama besar**: titik pada diagonal persegi panjang membuat dua persegi panjang "pojok" yang sama luas.

      **6. Keliling bangun tangga** (persegi-persegi berdampingan) = keliling persegi panjang pembungkusnya.
      Tangga selebar 10 cm dan setinggi 6 cm → keliling $= 2(10 + 6) = 32$ cm.

      **7. Kerucut di dalam tabung** (alas dan tinggi sama): volume kerucut $= \frac{1}{3}$ tabung, jadi ruang kosongnya $= \frac{2}{3}$ volume tabung.

      > Jika soal terlihat rumit, potong dan pindahkan bagian arsiran sampai menjadi bangun yang kamu kenal.
    `),
    quiz: [
      ['Persegi terletak di dalam lingkaran berjari-jari 7 cm (titik sudutnya pada lingkaran). Luas persegi …', ['98 cm²', '49 cm²', '196 cm²'], 0, 'L = 2r² = 2 × 49 = 98 cm².'],
      ['Lingkaran tepat di dalam persegi bersisi 14 cm. Luas daerah persegi di luar lingkaran …', ['42 cm²', '154 cm²', '56 cm²'], 0, '196 − 154 = 42 cm².'],
      ['Persegi panjang 12 cm × 9 cm. Segitiga beralas sisi 12 cm dengan puncak di sisi seberangnya memiliki luas …', ['54 cm²', '108 cm²', '36 cm²'], 0, 'Selalu setengah persegi panjang: 108 : 2 = 54 cm².'],
      ['Luas tembereng (seperempat lingkaran r = 14 cm dikurangi segitiga siku-sikunya) adalah …', ['56 cm²', '154 cm²', '98 cm²'], 0, '154 − 98 = 56 cm².'],
      ['Bangun tangga dari persegi-persegi memiliki lebar total 10 cm dan tinggi total 6 cm. Kelilingnya …', ['32 cm', '60 cm', '16 cm'], 0, 'Sama dengan keliling persegi panjang 10 × 6 = 32 cm.'],
    ],
  },
  {
    slug: 'olim-logika-dan-teka-teki',
    theme: FINAL,
    emoji: '🧠',
    title: 'Logika dan Teka-Teki: Venn, Persegi Ajaib, Dadu, dan Satu Goresan',
    titleId: 'Penalaran yang sering keluar di final',
    minutes: 10,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Diagram Venn**
      $$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$
      40 siswa: 25 suka Matematika, 20 suka IPA, 8 suka keduanya. Tidak suka keduanya $= 40 - (25 + 20 - 8) = 3$.

      **2. Persegi ajaib 3×3** (angka 1–9)
      • Jumlah semua angka $= 45$ → jumlah tiap baris $= 45 : 3 = 15$.
      • Angka di tengah **selalu 5**; angka genap di pojok.

      **3. Urutan dan posisi** → gambar garis lalu letakkan nama satu per satu.
      Dina tepat sebelum Eka, Lina setelah Eka tetapi sebelum Wati → Dina, Eka, Lina, Wati → **Wati** terakhir.

      **4. Skor benar–salah–kosong**
      40 soal: 28 benar (+4), 7 salah (−1), 5 kosong (0) → $112 - 7 = 105$.

      **5. Dadu standar** → sisi berhadapan berjumlah 7: (1, 6), (2, 5), (3, 4).

      **6. Gambar satu goresan (Euler)**
      Hitung titik yang memiliki banyak cabang garis **ganjil** (titik ganjil).
      • 0 titik ganjil → bisa, mulai dari mana saja
      • 2 titik ganjil → bisa, mulai dari salah satu titik ganjil
      • Lebih dari 2 → **tidak bisa**

      **7. Keluarga minimal**: setiap anak punya sedikitnya 2 saudara laki-laki dan 2 saudara perempuan → 3 laki-laki + 3 perempuan = **6 anak** (seorang anak tidak menghitung dirinya sendiri).

      > Pada teka-teki logika, mulailah dari petunjuk yang paling pasti, lalu coret kemungkinan yang mustahil.
    `),
    quiz: [
      ['30 anak: 18 suka sepak bola, 15 suka renang, 6 suka keduanya. Banyak anak yang tidak suka keduanya …', ['3', '6', '9'], 0, '30 − (18 + 15 − 6) = 3.'],
      ['Pada persegi ajaib 3×3 berisi angka 1–9, jumlah setiap baris adalah …', ['15', '18', '45'], 0, '45 : 3 = 15.'],
      ['Pada dadu standar, sisi yang berhadapan dengan mata 2 adalah …', ['5', '4', '6'], 0, '2 + 5 = 7.'],
      ['40 soal: 28 benar (+4), 7 salah (−1), sisanya kosong (0). Skornya …', ['105', '112', '98'], 0, '112 − 7 = 105.'],
      ['Sebuah gambar bisa dibuat dengan satu goresan jika banyak titik ganjilnya …', ['0 atau 2', 'Tepat 3', 'Lebih dari 4'], 0, 'Teori Euler: hanya 0 atau 2 titik ganjil.'],
    ],
  },
  {
    slug: 'olim-aljabar-cerdik-final',
    theme: FINAL,
    emoji: '🏆',
    title: 'Aljabar Cerdik Tingkat Final',
    titleId: 'Jumlah berantai, kerja mundur, tukar angka, rata-rata timbangan',
    minutes: 10,
    phaseMax: 'D',
    intro: md(String.raw`
      **1. Jumlah berantai** → tambah–kurang persamaan tanpa mencari tiap huruf.
      A + B = 12, B + C = 10, C + D = 16.
      $$A + D = (A + B) - (B + C) + (C + D) = 12 - 10 + 16 = 18$$
      Rata-rata (a, b) = 50, (b, c) = 75, (c, d) = 70 → $a + d = 100 - 150 + 140 = 90$ → rata-rata (a, d) = 45.

      **2. Nyatakan dalam satu huruf**
      A + B + C = 210, A = 4B, A = ¼C → B = ¼A, C = 4A.
      $$A + \tfrac{1}{4}A + 4A = 210 \Rightarrow \tfrac{21}{4}A = 210 \Rightarrow A = 40$$

      **3. Kerja mundur** → balik urutan dan balik operasinya.
      X dikali 4, ditambah 8, dibagi 8, hasilnya 6: $6 \times 8 = 48$, $48 - 8 = 40$, $40 : 4 = 10$.

      **4. Bilangan dua angka ditukar**
      $\overline{ab}$ ditukar menjadi $\overline{ba}$ → selisihnya **9 × selisih angka**.
      Bertambah 27 dan jumlah angkanya 9 → selisih angka 3, jumlah 9 → angkanya 3 dan 6 → bilangan **36**.

      **5. Identitas $x + y$ dan $xy$**
      $x + y = 4$, $xy = -12$:
      $$x^2 + 5xy + y^2 = (x + y)^2 + 3xy = 16 - 36 = -20$$

      **6. Rata-rata dengan anggota baru**
      3 pekerja rata-rata Rp432.000 (total 1.296.000). Setelah 1 orang masuk, rata-rata Rp373.500 (total 1.494.000). Gaji orang baru $= 1.494.000 - 1.296.000 = \text{Rp}198.000$.

      **7. Trik timbangan rata-rata gabungan**
      Rata-rata kelas 92, laki-laki 90, perempuan 95.
      $$\text{laki-laki} : \text{perempuan} = (95 - 92) : (92 - 90) = 3 : 2$$
      (jarak ke rata-rata gabungan ditukar)
    `),
    quiz: [
      ['P + Q = 15, Q + R = 11, R + S = 9. Nilai P + S = …', ['13', '35', '5'], 0, '(P + Q) − (Q + R) + (R + S) = 15 − 11 + 9 = 13.'],
      ['Suatu bilangan dikali 3, dikurangi 5, lalu dibagi 2, hasilnya 11. Bilangan itu …', ['9', '7', '11'], 0, 'Mundur: 11 × 2 = 22, + 5 = 27, : 3 = 9.'],
      ['Bilangan dua angka bertambah 45 jika angkanya ditukar, dan jumlah angkanya 7. Bilangan itu …', ['16', '61', '25'], 0, 'Selisih angka 45 : 9 = 5, jumlah 7 → angka 1 dan 6 → 16.'],
      ['Jika x + y = 5 dan xy = 4, maka x² + y² = …', ['17', '25', '9'], 0, '25 − 2 × 4 = 17.'],
      ['Rata-rata kelas 78, rata-rata putra 75, putri 80. Perbandingan banyak putra : putri …', ['2 : 3', '3 : 2', '1 : 1'], 0, '(80 − 78) : (78 − 75) = 2 : 3.'],
    ],
  },
];
