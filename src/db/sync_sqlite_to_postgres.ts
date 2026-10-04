import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

async function syncAll() {
  console.log('--- Starting Ultra-Fast Sync from SQLite to PostgreSQL Supabase ---');
  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));

  // 1. Categories
  const sqliteCategories = sqlite.prepare('SELECT * FROM categories').all() as any[];
  console.log(`Syncing ${sqliteCategories.length} categories...`);
  for (const c of sqliteCategories) {
    await client`
      INSERT INTO categories (id, name, slug, description, order_index)
      VALUES (${c.id}, ${c.name}, ${c.slug}, ${c.description || null}, ${c.order_index || 0})
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name, 
        slug = EXCLUDED.slug, 
        description = EXCLUDED.description, 
        order_index = EXCLUDED.order_index
    `;
  }

  // 2. Topics
  const sqliteTopics = sqlite.prepare('SELECT * FROM topics').all() as any[];
  console.log(`Syncing ${sqliteTopics.length} topics...`);
  for (const t of sqliteTopics) {
    await client`
      INSERT INTO topics (id, category_id, name, slug)
      VALUES (${t.id}, ${t.category_id}, ${t.name}, ${t.slug})
      ON CONFLICT (id) DO UPDATE SET 
        category_id = EXCLUDED.category_id, 
        name = EXCLUDED.name, 
        slug = EXCLUDED.slug
    `;
  }

  // 3. Exam Packages
  const sqlitePackages = sqlite.prepare('SELECT * FROM exam_packages').all() as any[];
  console.log(`Syncing ${sqlitePackages.length} packages...`);
  for (const p of sqlitePackages) {
    await client`
      INSERT INTO exam_packages (
        id, title, slug, category_id, type, duration_minutes, 
        shuffle_questions, shuffle_options, passing_grade_rules, is_published, created_at
      )
      VALUES (
        ${p.id}, ${p.title}, ${p.slug}, ${p.category_id}, ${p.type || 'SIMULATION'}, 
        ${p.duration_minutes || 60}, ${Boolean(p.shuffle_questions)}, ${Boolean(p.shuffle_options)}, 
        ${p.passing_grade_rules || null}, ${Boolean(p.is_published)}, ${p.created_at || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        duration_minutes = EXCLUDED.duration_minutes,
        passing_grade_rules = EXCLUDED.passing_grade_rules
    `;
  }

  // 4. Questions (Multi-row inserts)
  const sqliteQuestions = sqlite.prepare('SELECT * FROM questions').all() as any[];
  console.log(`Syncing ${sqliteQuestions.length} questions...`);

  const formattedQuestions = sqliteQuestions.map((q) => ({
    id: q.id,
    topic_id: q.topic_id,
    type: q.type || 'SINGLE_CHOICE',
    content_markdown: q.content_markdown,
    image_url: q.image_url || null,
    explanation_markdown: q.explanation_markdown || '',
    explanation_image_url: q.explanation_image_url || null,
    difficulty: q.difficulty || 'MEDIUM',
    created_at: q.created_at || new Date().toISOString(),
  }));

  for (let i = 0; i < formattedQuestions.length; i += 100) {
    const chunk = formattedQuestions.slice(i, i + 100);
    await client`
      INSERT INTO questions ${client(chunk)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown,
        image_url = EXCLUDED.image_url,
        explanation_markdown = EXCLUDED.explanation_markdown,
        difficulty = EXCLUDED.difficulty
    `;
  }
  console.log(`Questions synced successfully (${formattedQuestions.length}).`);

  // 5. Question Options (Multi-row inserts)
  const sqliteOptions = sqlite.prepare('SELECT * FROM question_options').all() as any[];
  console.log(`Syncing ${sqliteOptions.length} question options in multi-row batches...`);

  const formattedOptions = sqliteOptions.map((opt) => ({
    id: opt.id,
    question_id: opt.question_id,
    label: opt.label,
    content_markdown: opt.content_markdown,
    image_url: opt.image_url || null,
    is_correct: Boolean(opt.is_correct),
    score_value: opt.score_value || 0,
    order_index: opt.order_index || 0,
  }));

  for (let i = 0; i < formattedOptions.length; i += 150) {
    const chunk = formattedOptions.slice(i, i + 150);
    await client`
      INSERT INTO question_options ${client(chunk)}
      ON CONFLICT (id) DO UPDATE SET 
        content_markdown = EXCLUDED.content_markdown,
        is_correct = EXCLUDED.is_correct,
        score_value = EXCLUDED.score_value
    `;
    if ((i + 150) % 600 === 0 || i + 150 >= formattedOptions.length) {
      console.log(`Synced options: ${Math.min(i + 150, formattedOptions.length)} / ${formattedOptions.length}`);
    }
  }

  // 6. Package Questions (Multi-row inserts)
  const sqlitePkgQuestions = sqlite.prepare('SELECT * FROM package_questions').all() as any[];
  console.log(`Syncing ${sqlitePkgQuestions.length} package_questions...`);

  const formattedPkgQuestions = sqlitePkgQuestions.map((pq) => ({
    package_id: pq.package_id,
    question_id: pq.question_id,
    order_index: pq.order_index || 0,
  }));

  for (let i = 0; i < formattedPkgQuestions.length; i += 200) {
    const chunk = formattedPkgQuestions.slice(i, i + 200);
    await client`
      INSERT INTO package_questions ${client(chunk)}
      ON CONFLICT (package_id, question_id) DO UPDATE SET 
        order_index = EXCLUDED.order_index
    `;
  }

  console.log('--- Ultra-Fast Sync Completed Successfully! ---');
  sqlite.close();
  process.exit(0);
}

syncAll().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
