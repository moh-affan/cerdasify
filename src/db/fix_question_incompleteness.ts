import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

async function fixQuestions() {
  console.log('--- Applying targeted fixes for incomplete questions ---');

  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));
  sqlite.pragma('journal_mode = WAL');

  // =========================================================================
  // 1. Fix q_0486_matematika-leve (PRISMA 2024 Matematika Level 1 No. 26)
  // =========================================================================
  const q486Content = `Perhatikan teka-teki operasi hitung bergambar berikut!

Berdasarkan pola penjumlahan dan pengurangan pada gambar di atas, berapakah hasil dari:
$$\\text{Stroberi} + \\text{Apel} = \\dots \\text{ ?}$$`;

  const q486Img = '/uploads/prisma2024_m1_q26_lengkap.png';
  const q486Expl = `Mari kita cari nilai masing-masing buah langkah demi langkah:

1. **Menentukan nilai Apel:**
   $$\\text{Apel} + \\text{Apel} = 8$$
   $$2 \\times \\text{Apel} = 8 \\implies \\text{Apel} = \\frac{8}{2} = 4$$

2. **Menentukan nilai Stroberi:**
   $$\\text{Stroberi} - \\text{Apel} = 6$$
   $$\\text{Stroberi} - 4 = 6 \\implies \\text{Stroberi} = 6 + 4 = 10$$

3. **Menghitung hasil akhir ($\\text{Stroberi} + \\text{Apel}$):**
   $$\\text{Stroberi} + \\text{Apel} = 10 + 4 = 14$$

Jadi, hasil dari $\\text{Stroberi} + \\text{Apel}$ adalah **14** (Pilihan D).`;

  // Update in Postgres
  await client`
    UPDATE questions 
    SET content_markdown = ${q486Content},
        image_url = ${q486Img},
        explanation_markdown = ${q486Expl}
    WHERE id = 'q_0486_matematika-leve'
  `;

  // Fix correct option in Postgres: Option D is correct (14), not C (10)
  await client`
    UPDATE question_options
    SET is_correct = false, score_value = 0
    WHERE question_id = 'q_0486_matematika-leve' AND label = 'C'
  `;

  await client`
    UPDATE question_options
    SET is_correct = true, score_value = 4
    WHERE question_id = 'q_0486_matematika-leve' AND label = 'D'
  `;

  // Update in SQLite
  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, image_url = ?, explanation_markdown = ?
    WHERE id = 'q_0486_matematika-leve'
  `).run(q486Content, q486Img, q486Expl);

  sqlite.prepare(`
    UPDATE question_options
    SET is_correct = 0, score_value = 0
    WHERE question_id = 'q_0486_matematika-leve' AND label = 'C'
  `).run();

  sqlite.prepare(`
    UPDATE question_options
    SET is_correct = 1, score_value = 4
    WHERE question_id = 'q_0486_matematika-leve' AND label = 'D'
  `).run();

  console.log('✅ Fixed q_0486_matematika-leve (Content, diagram, key D=14, and explanation)');

  // =========================================================================
  // 2. Fix q_0475_matematika-leve (PRISMA 2024 Matematika Level 1 No. 11)
  // =========================================================================
  const q475Content = 'Ada berapa sisi pada bangun datar di bawah ini?';
  const q475Img = '/uploads/prisma2024_m1_q11_trapesium.png';
  const q475Expl = `Bangun datar pada gambar adalah bangun **trapesium sama kaki**. 
Trapesium merupakan bangun datar segi empat yang dibatasi oleh **4 sisi** (sisi atas, sisi alas bawah, dan dua sisi kaki miring).

Jadi, banyak sisi pada bangun datar tersebut adalah **4** (Pilihan B).`;

  await client`
    UPDATE questions 
    SET content_markdown = ${q475Content},
        image_url = ${q475Img},
        explanation_markdown = ${q475Expl}
    WHERE id = 'q_0475_matematika-leve'
  `;

  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, image_url = ?, explanation_markdown = ?
    WHERE id = 'q_0475_matematika-leve'
  `).run(q475Content, q475Img, q475Expl);

  console.log('✅ Fixed q_0475_matematika-leve (Trapezoid image and explanation)');

  // =========================================================================
  // 3. Fix q_ceo25_m2_19 (CEO Semifinal 2025 MTK Level 2 No. 19)
  // =========================================================================
  const q19Content = 'Banyaknya persegi pada gambar bangun di bawah ini adalah ....';
  const q19Img = '/uploads/ceo2025_m2_q19_grid.png';
  const q19Expl = `Mari kita hitung seluruh persegi berdasarkan ukurannya:

1. **Persegi ukuran $1 \\times 1$:**
   - Kolom vertikal tengah ($6 \\times 2$): $12$ persegi
   - Sayap horizontal kiri ($2 \\times 2$): $4$ persegi
   - Sayap horizontal kanan ($2 \\times 2$): $4$ persegi
   - Total persegi $1 \\times 1 = 12 + 4 + 4 = 20$ persegi.

2. **Persegi ukuran $2 \\times 2$:**
   - Pada bagian vertikal ($2 \\times 6$): terdapat $5$ persegi ukuran $2 \\times 2$.
   - Pada bagian horizontal ($6 \\times 2$): terdapat $5$ persegi ukuran $2 \\times 2$.
   - Persegi $2 \\times 2$ tepat di pusat dihitung dua kali (irisan), sehingga:
     $$\\text{Banyak persegi } 2 \\times 2 = 5 + 5 - 1 = 9 \\text{ persegi.}$$

3. **Persegi ukuran $3 \\times 3$ ke atas:**
   - Tidak ada, karena ketebalan sayap hanya 2 petak.

**Total seluruh persegi:**
$$20 + 9 = 29 \\text{ persegi}$$

Jadi, banyak persegi pada gambar adalah **29** (Pilihan C).`;

  await client`
    UPDATE questions 
    SET content_markdown = ${q19Content},
        image_url = ${q19Img},
        explanation_markdown = ${q19Expl}
    WHERE id = 'q_ceo25_m2_19'
  `;

  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, image_url = ?, explanation_markdown = ?
    WHERE id = 'q_ceo25_m2_19'
  `).run(q19Content, q19Img, q19Expl);

  console.log('✅ Fixed q_ceo25_m2_19 (Cross grid image, full content, and detailed proof)');

  // =========================================================================
  // 4. Fix q_ceo25_m2_24 (CEO Semifinal 2025 MTK Level 2 No. 24)
  // =========================================================================
  const q24Content = `Perhatikan diagram lingkaran berikut!

Kelas 3B terdiri dari 30 siswa. Jika 15 siswa (50%) menyukai warna merah, maka banyak siswa yang menyukai warna hijau (20%) adalah ....`;
  const q24Img = '/uploads/ceo2025_m2_q24_pie.png';
  const q24Expl = `Berdasarkan diagram lingkaran:
- Persentase penyuka warna hijau = $20\\%$
- Jumlah seluruh siswa kelas 3B = $30$ anak

Banyak siswa yang menyukai warna hijau:
$$\\text{Banyak siswa} = 20\\% \\times 30 = \\frac{20}{100} \\times 30 = 6 \\text{ siswa}$$

Jadi, siswa yang menyukai warna hijau adalah **6 orang** (Pilihan B).`;

  await client`
    UPDATE questions 
    SET content_markdown = ${q24Content},
        image_url = ${q24Img},
        explanation_markdown = ${q24Expl}
    WHERE id = 'q_ceo25_m2_24'
  `;

  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, image_url = ?, explanation_markdown = ?
    WHERE id = 'q_ceo25_m2_24'
  `).run(q24Content, q24Img, q24Expl);

  console.log('✅ Fixed q_ceo25_m2_24 (Pie chart image and full question text)');

  // =========================================================================
  // 5. Fix q_ceo25_m2_25 (CEO Semifinal 2025 MTK Level 2 No. 25)
  // =========================================================================
  const q25Content = 'Selisih nilai angka 7 dan angka 8 dari bilangan 786 adalah ....';
  const q25Expl = `Pada bilangan 786:
- Angka 7 menempati nilai tempat ratusan, sehingga bernilai $700$.
- Angka 8 menempati nilai tempat puluhan, sehingga bernilai $80$.
- Angka 6 menempati nilai tempat satuan, sehingga bernilai $6$.

Maka selisih nilai angka 7 dan angka 8 adalah:
$$700 - 80 = 620$$

Jadi, selisih nilai angka 7 dan 8 adalah **620** (Pilihan C).`;

  await client`
    UPDATE questions 
    SET content_markdown = ${q25Content},
        explanation_markdown = ${q25Expl}
    WHERE id = 'q_ceo25_m2_25'
  `;

  // Fix key to C (620)
  await client`
    UPDATE question_options
    SET is_correct = false, score_value = 0
    WHERE question_id = 'q_ceo25_m2_25'
  `;
  await client`
    UPDATE question_options
    SET is_correct = true, score_value = 4
    WHERE question_id = 'q_ceo25_m2_25' AND label = 'C'
  `;

  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, explanation_markdown = ?
    WHERE id = 'q_ceo25_m2_25'
  `).run(q25Content, q25Expl);

  sqlite.prepare(`
    UPDATE question_options
    SET is_correct = 0, score_value = 0
    WHERE question_id = 'q_ceo25_m2_25'
  `).run();
  sqlite.prepare(`
    UPDATE question_options
    SET is_correct = 1, score_value = 4
    WHERE question_id = 'q_ceo25_m2_25' AND label = 'C'
  `).run();

  console.log('✅ Fixed q_ceo25_m2_25 (Full text, key C=620, and explanation)');

  // =========================================================================
  // 6. Fix q_ceo25_m2_26 (CEO Semifinal 2025 MTK Level 2 No. 26)
  // =========================================================================
  const q26Content = `Perhatikan gambar petak di bawah ini!

Daerah petak yang diarsir pada gambar menunjukkan nilai pecahan ....`;
  const q26Img = '/uploads/ceo2025_m2_q26_arsir.png';
  const q26Expl = `Pada gambar petak persegi panjang:
- Terdapat 4 baris dan 5 kolom, sehingga total kotak = $4 \\times 5 = 20$ petak.
- Banyak petak yang diarsir arsiran silang = $7$ petak.

Maka nilai pecahannya adalah:
$$\\frac{\\text{Banyak petak diarsir}}{\\text{Total petak}} = \\frac{7}{20}$$

Jadi, pecahan yang ditunjukkan adalah **$\\frac{7}{20}$** (Pilihan B).`;

  await client`
    UPDATE questions 
    SET content_markdown = ${q26Content},
        image_url = ${q26Img},
        explanation_markdown = ${q26Expl}
    WHERE id = 'q_ceo25_m2_26'
  `;

  sqlite.prepare(`
    UPDATE questions 
    SET content_markdown = ?, image_url = ?, explanation_markdown = ?
    WHERE id = 'q_ceo25_m2_26'
  `).run(q26Content, q26Img, q26Expl);

  console.log('✅ Fixed q_ceo25_m2_26 (Shaded grid image, question text, and explanation)');

  sqlite.close();
  console.log('🎉 All targeted question fixes applied successfully!');
  process.exit(0);
}

fixQuestions().catch(err => {
  console.error('Fix error:', err);
  process.exit(1);
});
