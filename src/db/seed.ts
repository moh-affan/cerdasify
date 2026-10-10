/**
 * Seeder utama Cerdasify (PostgreSQL/Supabase).
 *
 *   npm run seed
 *
 * 1. Menjalankan migrasi idempoten.
 * 2. Membuat akun Super Admin dari env (DEFAULT_ADMIN_USERNAME / DEFAULT_ADMIN_PASSWORD) bila belum ada.
 *    Akun demo hanya dibuat bila SEED_DEMO_USERS=true dan password-nya diberikan lewat env
 *    (DEMO_ADMIN_PASSWORD, DEMO_USER_PASSWORD) — tidak ada password bawaan yang tertulis di kode.
 * 3. Menyemai bank soal dari src/db/seed-data/question-bank/ (hasil `npm run bank:export`):
 *    kategori, topik, paket, soal, opsi, dan urutan soal per paket. Isi berkas adalah sumber kebenaran:
 *    data yang sama di database ditimpa, sedangkan soal/paket yang tidak ada di berkas (dibuat lewat panel
 *    admin dan belum diekspor) dibiarkan. Semua langkah bank soal berjalan dalam satu transaksi.
 *
 * Konten Pustaka Belajar disemai terpisah lewat `npm run seed:learning`.
 */
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { client } from './index';
import { runMigrations } from './migrate';
import { BANK_DIR, type BankCategory, type BankPackage, type BankQuestion, type BankTopic } from './export_question_bank';

const read = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(BANK_DIR, file), 'utf8')) as T;

function chunk<T>(items: T[], size = 400): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function seedUsers() {
  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  if (adminUsername && adminPassword) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await client`
      INSERT INTO users (id, username, name, password_hash, role, is_active)
      VALUES ('usr_superadmin', ${adminUsername}, 'Super Administrator', ${hash}, 'SUPER_ADMIN', true)
      ON CONFLICT (id) DO NOTHING`;
    // Akun yang sudah ada tidak ditimpa; login dengan kredensial env tetap menyinkronkannya (lihat /api/auth/login).
    console.log('Akun Super Admin dipastikan ada.');
  } else {
    console.log('DEFAULT_ADMIN_USERNAME/DEFAULT_ADMIN_PASSWORD tidak diisi: akun Super Admin tidak diubah.');
  }

  if (process.env.SEED_DEMO_USERS === 'true') {
    const demo = [
      { id: 'usr_admin', username: 'guru_olimpiade', name: 'Pembina Tim Olimpiade', role: 'ADMIN', password: process.env.DEMO_ADMIN_PASSWORD },
      { id: 'usr_student', username: 'peserta_budi', name: 'Budi Siswa Berprestasi', role: 'USER', password: process.env.DEMO_USER_PASSWORD },
    ];
    for (const u of demo) {
      if (!u.password || u.password.length < 8) {
        console.warn(`Akun demo ${u.username} dilewati: password env belum diisi (min. 8 karakter).`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await client`
        INSERT INTO users (id, username, name, password_hash, role, is_active)
        VALUES (${u.id}, ${u.username}, ${u.name}, ${hash}, ${u.role}, true)
        ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true`;
      console.log(`Akun demo ${u.username} siap.`);
    }
  }
}

async function seedQuestionBank() {
  const categories = read<BankCategory[]>('categories.json');
  const topics = read<BankTopic[]>('topics.json');
  const packages = read<BankPackage[]>('packages.json');
  const questions: BankQuestion[] = fs
    .readdirSync(path.join(BANK_DIR, 'questions'))
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => read<BankQuestion[]>(`questions/${f}`));

  // Validasi sebelum menulis apa pun
  const qIds = new Set(questions.map((q) => q.id));
  const errors: string[] = [];
  if (qIds.size !== questions.length) errors.push('ada id soal ganda di berkas bank soal');
  for (const q of questions) {
    const labels = q.options.map((o) => o.label).join('');
    if (labels !== 'ABCDE'.slice(0, q.options.length)) errors.push(`${q.id}: label opsi tidak berurutan (${labels})`);
    if (q.type === 'SINGLE_CHOICE' && q.options.filter((o) => o.isCorrect).length !== 1) errors.push(`${q.id}: harus tepat satu kunci`);
    if (q.type === 'GRADED_SCALE' && q.options.some((o) => o.scoreValue < 1 || o.scoreValue > 5)) errors.push(`${q.id}: bobot opsi harus 1–5`);
  }
  for (const p of packages) for (const id of p.questions) if (!qIds.has(id)) errors.push(`${p.id}: soal ${id} tidak ada di bank soal`);
  if (errors.length) throw new Error('Bank soal tidak valid:\n' + errors.slice(0, 30).join('\n'));

  await client.begin(async (tx) => {
    for (const part of chunk(categories)) {
      await tx`
        INSERT INTO categories ${tx(part.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, order_index: c.orderIndex })))}
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, order_index = EXCLUDED.order_index`;
    }
    for (const part of chunk(topics)) {
      await tx`
        INSERT INTO topics ${tx(part.map((t) => ({ id: t.id, category_id: t.categoryId, name: t.name, slug: t.slug })))}
        ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, slug = EXCLUDED.slug`;
    }
    for (const part of chunk(packages)) {
      await tx`
        INSERT INTO exam_packages ${tx(
          part.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category_id: p.categoryId,
            type: p.type,
            duration_minutes: p.durationMinutes,
            shuffle_questions: p.shuffleQuestions,
            shuffle_options: p.shuffleOptions,
            passing_grade_rules: p.passingGradeRules ? JSON.stringify(p.passingGradeRules) : null,
            is_published: p.isPublished,
          }))
        )}
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
          type = EXCLUDED.type, duration_minutes = EXCLUDED.duration_minutes, shuffle_questions = EXCLUDED.shuffle_questions,
          shuffle_options = EXCLUDED.shuffle_options, passing_grade_rules = EXCLUDED.passing_grade_rules, is_published = EXCLUDED.is_published`;
    }
    for (const part of chunk(questions)) {
      await tx`
        INSERT INTO questions ${tx(
          part.map((q) => ({
            id: q.id,
            topic_id: q.topicId,
            type: q.type,
            difficulty: q.difficulty,
            content_markdown: q.content,
            image_url: q.imageUrl,
            explanation_markdown: q.explanation,
            explanation_image_url: q.explanationImageUrl,
          }))
        )}
        ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, type = EXCLUDED.type, difficulty = EXCLUDED.difficulty,
          content_markdown = EXCLUDED.content_markdown, image_url = EXCLUDED.image_url,
          explanation_markdown = EXCLUDED.explanation_markdown, explanation_image_url = EXCLUDED.explanation_image_url`;
    }

    const options = questions.flatMap((q) =>
      q.options.map((o) => ({
        id: o.id,
        question_id: q.id,
        label: o.label,
        content_markdown: o.content,
        image_url: o.imageUrl,
        is_correct: o.isCorrect,
        score_value: o.scoreValue,
        order_index: o.order,
      }))
    );
    // Opsi lama milik soal bank yang sudah tidak ada di berkas dihapus (kecuali masih dirujuk jawaban peserta).
    const optionIds = options.map((o) => o.id);
    const stale = await tx`
      SELECT o.id FROM question_options o
      WHERE o.question_id IN ${tx([...qIds])} AND o.id NOT IN ${tx(optionIds)}
        AND NOT EXISTS (SELECT 1 FROM attempt_answers a WHERE a.selected_option_ids LIKE '%' || o.id || '%')`;
    if (stale.length) await tx`DELETE FROM question_options WHERE id IN ${tx(stale.map((r) => r.id as string))}`;
    for (const part of chunk(options, 800)) {
      await tx`
        INSERT INTO question_options ${tx(part)}
        ON CONFLICT (id) DO UPDATE SET question_id = EXCLUDED.question_id, label = EXCLUDED.label,
          content_markdown = EXCLUDED.content_markdown, image_url = EXCLUDED.image_url, is_correct = EXCLUDED.is_correct,
          score_value = EXCLUDED.score_value, order_index = EXCLUDED.order_index`;
    }

    // Keanggotaan & urutan soal per paket mengikuti berkas
    const bankPackageIds = packages.map((p) => p.id);
    await tx`DELETE FROM package_questions WHERE package_id IN ${tx(bankPackageIds)}`;
    const links = packages.flatMap((p) => p.questions.map((q, i) => ({ package_id: p.id, question_id: q, order_index: i })));
    for (const part of chunk(links, 800)) {
      await tx`INSERT INTO package_questions ${tx(part)}`;
    }
  });

  console.log(
    `Bank soal disemai: ${categories.length} kategori, ${topics.length} topik, ${packages.length} paket, ${questions.length} soal.`
  );
}

export async function seedDatabase() {
  console.log('--- Seeding Cerdasify ---');
  await runMigrations();
  await seedUsers();
  await seedQuestionBank();
  console.log('--- Seeding selesai ---');
}

if (require.main === module) {
  seedDatabase()
    .then(() => client.end())
    .catch(async (err) => {
      console.error('Seeding gagal:', err instanceof Error ? err.message : err);
      await client.end();
      process.exit(1);
    });
}
