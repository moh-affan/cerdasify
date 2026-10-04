import { db, client } from './index';
import { runMigrations } from './migrate';
import {
  users,
  categories,
  examPackages,
} from './schema';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function seedDatabase() {
  console.log('--- Starting Cerdasify Database Seeding (PostgreSQL Supabase) ---');
  await runMigrations();

  // 1. Seed Users
  const passwordAdminHash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'SuperPassword123!', 10);
  const passwordTeacherHash = await bcrypt.hash('GuruPassword123!', 10);
  const passwordUserHash = await bcrypt.hash('Peserta123!', 10);

  const initialUsers = [
    {
      id: 'usr_superadmin',
      username: process.env.DEFAULT_ADMIN_USERNAME || 'superadmin',
      name: 'Super Administrator',
      passwordHash: passwordAdminHash,
      role: 'SUPER_ADMIN' as const,
      isActive: true,
    },
    {
      id: 'usr_admin',
      username: 'guru_olimpiade',
      name: 'Pembina Tim Olimpiade',
      passwordHash: passwordTeacherHash,
      role: 'ADMIN' as const,
      isActive: true,
    },
    {
      id: 'usr_student',
      username: 'peserta_budi',
      name: 'Budi Siswa Berprestasi',
      passwordHash: passwordUserHash,
      role: 'USER' as const,
      isActive: true,
    },
  ];

  const existingUsers = await db.select().from(users);
  for (const u of initialUsers) {
    const existing = existingUsers.find((x) => x.username === u.username);
    if (!existing) {
      await db.insert(users).values(u);
      console.log(`Seeded user: ${u.username} (${u.role})`);
    }
  }

  // 2. Load Seed Data JSON (Questions extracted from PDFs)
  const seedJsonPath = path.resolve(process.cwd(), 'data/seed_data.json');
  if (!fs.existsSync(seedJsonPath)) {
    console.error(`Seed data not found at ${seedJsonPath}`);
    return;
  }

  const rawQuestions = JSON.parse(fs.readFileSync(seedJsonPath, 'utf-8'));
  console.log(`Found ${rawQuestions.length} questions to seed.`);

  // Setup Categories & Topics in memory
  const categoryMap = new Map<string, string>(); // name -> id
  const topicMap = new Map<string, string>(); // categoryName + topicName -> id

  // Ensure default categories
  const initialCategories = [
    { id: 'cat_olimpiade_sd', name: 'Olimpiade Matematika SD', desc: 'Bank soal resmi latihan dan simulasi olimpiade sains tingkat SD.' },
    { id: 'cat_olimpiade_prisma', name: 'Olimpiade PRISMA', desc: 'Soal penyisihan resmi Olimpiade PRISMA Matematika & Sains dengan soal bergambar.' },
    { id: 'cat_cpns_skd', name: 'CPNS SKD', desc: 'Simulasi Seleksi Kompetensi Dasar CPNS (TWK, TIU, TKP skala 1-5).' },
  ];

  const existingCategories = await db.select().from(categories);
  for (const c of initialCategories) {
    const existingCat = existingCategories.find((x) => x.name === c.name);
    if (!existingCat) {
      await db.insert(categories).values({
        id: c.id,
        name: c.name,
        slug: slugify(c.name),
        description: c.desc,
      });
      categoryMap.set(c.name, c.id);
    } else {
      categoryMap.set(c.name, existingCat.id);
    }
  }

  // 3. Define Exam Packages
  const packagesToSeed = [
    {
      id: 'pkg_prisma_2025_m1',
      title: 'Olimpiade PRISMA 2025 — Penyisihan Matematika Level 1',
      slug: 'prisma-2025-matematika-level-1',
      categoryId: categoryMap.get('Olimpiade PRISMA') || 'cat_olimpiade_prisma',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 60 }),
      isPublished: true,
    },
    {
      id: 'pkg_prisma_2025_m2',
      title: 'Olimpiade PRISMA 2025 — Penyisihan Matematika Level 2 (Soal Bergambar)',
      slug: 'prisma-2025-matematika-level-2-bergambar',
      categoryId: categoryMap.get('Olimpiade PRISMA') || 'cat_olimpiade_prisma',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 70 }),
      isPublished: true,
    },
    {
      id: 'pkg_prisma_2025_m3',
      title: 'Olimpiade PRISMA 2025 — Penyisihan Matematika Level 3 (Soal Bergambar)',
      slug: 'prisma-2025-matematika-level-3-bergambar',
      categoryId: categoryMap.get('Olimpiade PRISMA') || 'cat_olimpiade_prisma',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 70 }),
      isPublished: true,
    },
    {
      id: 'pkg_prisma_2024_m1',
      title: 'Mode Latihan PRISMA 2024 — Matematika Level 1 (Soal Bergambar)',
      slug: 'latihan-prisma-2024-matematika-level-1',
      categoryId: categoryMap.get('Olimpiade PRISMA') || 'cat_olimpiade_prisma',
      type: 'PRACTICE' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: 0, emptyScore: 0, passingScore: 50 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_1',
      title: 'Simulasi Olimpiade SD — Sesi 1: Aritmetika Bagian 1 (40 Soal)',
      slug: 'simulasi-olimpiade-sd-sesi-1-aritmetika-1',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: -1, maxScore: 160, passingScore: 100 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_2',
      title: 'Mode Latihan Olimpiade SD — Sesi 2: Aritmetika Bagian 2 (40 Soal)',
      slug: 'latihan-olimpiade-sd-sesi-2-aritmetika-2',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'PRACTICE' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: 0, emptyScore: 0, maxScore: 160, passingScore: 90 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_3',
      title: 'Simulasi Olimpiade SD — Sesi 3: Aljabar & Persamaan Bagian 1 (40 Soal)',
      slug: 'simulasi-olimpiade-sd-sesi-3-aljabar-1',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: -1, maxScore: 160, passingScore: 100 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_4',
      title: 'Mode Latihan Olimpiade SD — Sesi 4: Aljabar & Persamaan Bagian 2 (40 Soal)',
      slug: 'latihan-olimpiade-sd-sesi-4-aljabar-2',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'PRACTICE' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: 0, emptyScore: 0, maxScore: 160, passingScore: 90 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_5',
      title: 'Simulasi Olimpiade SD — Sesi 5: Barisan & Pola (40 Soal)',
      slug: 'simulasi-olimpiade-sd-sesi-5-barisan-pola',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: -1, maxScore: 160, passingScore: 100 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_13',
      title: 'Mode Latihan Olimpiade SD — Sesi 13: Geometri & Bangun Datar (40 Soal)',
      slug: 'latihan-olimpiade-sd-sesi-13-geometri',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'PRACTICE' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: 0, emptyScore: 0, maxScore: 160, passingScore: 90 }),
      isPublished: true,
    },
    {
      id: 'pkg_sesi_21',
      title: 'Simulasi Akbar Olimpiade SD — Sesi 21: Paket Campuran (40 Soal)',
      slug: 'simulasi-olimpiade-sd-sesi-21-campuran',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'SIMULATION' as const,
      durationMinutes: 60,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: -1, maxScore: 160, passingScore: 110 }),
      isPublished: true,
    },
    {
      id: 'pkg_aljabar_100',
      title: 'Simulasi Olimpiade SD — Paket 100 Soal Aljabar Marathon',
      slug: 'simulasi-olimpiade-sd-aljabar-100',
      categoryId: categoryMap.get('Olimpiade Matematika SD') || 'cat_olimpiade_sd',
      type: 'SIMULATION' as const,
      durationMinutes: 100,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ correctScore: 4, wrongScore: -1, emptyScore: -1, maxScore: 400, passingScore: 240 }),
      isPublished: true,
    },
    {
      id: 'pkg_cpns_skd_mini',
      title: 'Simulasi Mini CPNS SKD (TWK, TIU, TKP Skala 1-5)',
      slug: 'simulasi-mini-cpns-skd',
      categoryId: categoryMap.get('CPNS SKD') || 'cat_cpns_skd',
      type: 'SIMULATION' as const,
      durationMinutes: 15,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingGradeRules: JSON.stringify({ twkPassingGrade: 65, tiuPassingGrade: 80, tkpPassingGrade: 166 }),
      isPublished: true,
    },
  ];

  // Clear previous exam content to reload fresh data
  await client.unsafe(`
    DELETE FROM attempt_answers;
    DELETE FROM attempts;
    DELETE FROM package_questions;
    DELETE FROM exam_packages;
    DELETE FROM question_options;
    DELETE FROM questions;
  `);

  for (const pkg of packagesToSeed) {
    await db.insert(examPackages).values(pkg);
    console.log(`Seeded package: ${pkg.title} [${pkg.type}]`);
  }

  console.log('Inserting questions, options, and packages in PostgreSQL...');

  let qCount = 0;
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    const catName = q.category || 'Olimpiade Matematika SD';
    const topicName = q.topic || 'Umum';

    // 1. Get or create category
    let catId = categoryMap.get(catName);
    if (!catId) {
      catId = `cat_${slugify(catName)}`;
      await client`
        INSERT INTO categories (id, name, slug, description)
        VALUES (${catId}, ${catName}, ${slugify(catName)}, ${`Kategori ${catName}`})
        ON CONFLICT (id) DO NOTHING
      `;
      categoryMap.set(catName, catId);
    }

    // 2. Get or create topic
    const topicKey = `${catName}:::${topicName}`;
    let topicId = topicMap.get(topicKey);
    if (!topicId) {
      topicId = `top_${slugify(catName)}_${slugify(topicName)}`.slice(0, 40);
      await client`
        INSERT INTO topics (id, category_id, name, slug)
        VALUES (${topicId}, ${catId}, ${topicName}, ${slugify(topicName)})
        ON CONFLICT (id) DO NOTHING
      `;
      topicMap.set(topicKey, topicId);
    }

    // 3. Insert question with imageUrl
    const questionId = `q_${String(i + 1).padStart(4, '0')}_${slugify(topicName).slice(0, 15)}`;
    const qType = q.type || 'SINGLE_CHOICE';
    const difficulty = q.difficulty || 'MEDIUM';
    const imageUrl = q.image_url || null;

    await client`
      INSERT INTO questions (id, topic_id, type, content_markdown, image_url, explanation_markdown, difficulty)
      VALUES (${questionId}, ${topicId}, ${qType}, ${q.question}, ${imageUrl}, ${q.explanation || ''}, ${difficulty})
    `;

    // 4. Insert options
    let scaleMap: Record<string, number> = {};
    if (qType === 'GRADED_SCALE' && q.correct_answer.includes(':')) {
      for (const pair of q.correct_answer.split(',')) {
        const [lbl, val] = pair.split(':');
        if (lbl && val) scaleMap[lbl.trim().toUpperCase()] = parseInt(val.trim(), 10) || 0;
      }
    }

    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
      const opt = q.options[optIdx];
      const optId = `opt_${questionId}_${optIdx}_${opt.label}`;
      const isCorrect = qType === 'GRADED_SCALE' ? true : opt.label.toUpperCase() === q.correct_answer.toUpperCase();
      const scoreValue = qType === 'GRADED_SCALE' ? scaleMap[opt.label.toUpperCase()] || 1 : isCorrect ? 4 : 0;

      await client`
        INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
        VALUES (${optId}, ${questionId}, ${opt.label}, ${opt.content}, ${isCorrect}, ${scoreValue}, ${optIdx})
      `;
    }

    // 5. Link to exam package
    const targetPkgId = q.package_key || 'pkg_aljabar_100';
    await client`
      INSERT INTO package_questions (package_id, question_id, order_index)
      VALUES (${targetPkgId}, ${questionId}, ${i})
      ON CONFLICT (package_id, question_id) DO NOTHING
    `;

    qCount++;
    if (qCount % 100 === 0) {
      console.log(`Seeded ${qCount}/${rawQuestions.length} questions...`);
    }
  }

  console.log(`Successfully seeded ${qCount} questions and options!`);
  console.log('--- Cerdasify Database Seeding Completed Successfully ---');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}
