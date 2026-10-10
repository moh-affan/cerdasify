import { client } from './index';

export async function runMigrations() {
  console.log('Running PostgreSQL migrations...');

  await client.unsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'SINGLE_CHOICE',
      content_markdown TEXT NOT NULL,
      image_url TEXT,
      explanation_markdown TEXT,
      explanation_image_url TEXT,
      difficulty TEXT NOT NULL DEFAULT 'MEDIUM',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    );

    CREATE TABLE IF NOT EXISTS question_options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      content_markdown TEXT NOT NULL,
      image_url TEXT,
      is_correct BOOLEAN NOT NULL DEFAULT FALSE,
      score_value INTEGER NOT NULL DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exam_packages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'SIMULATION',
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
      shuffle_options BOOLEAN NOT NULL DEFAULT FALSE,
      passing_grade_rules TEXT,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    );

    CREATE TABLE IF NOT EXISTS package_questions (
      package_id TEXT NOT NULL REFERENCES exam_packages(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      order_index INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (package_id, question_id)
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id TEXT NOT NULL REFERENCES exam_packages(id) ON DELETE CASCADE,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      score_total INTEGER NOT NULL DEFAULT 0,
      score_breakdown TEXT,
      is_passed BOOLEAN NOT NULL DEFAULT FALSE,
      status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
      remaining_seconds INTEGER
    );

    CREATE TABLE IF NOT EXISTS attempt_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      selected_option_ids TEXT,
      score_awarded INTEGER NOT NULL DEFAULT 0,
      is_doubtful BOOLEAN NOT NULL DEFAULT FALSE,
      answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    );

    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
    CREATE INDEX IF NOT EXISTS idx_options_question ON question_options(question_id);
    CREATE INDEX IF NOT EXISTS idx_pkg_questions_pkg ON package_questions(package_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_package ON attempts(package_id);
    CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON attempt_answers(attempt_id);

    -- Validasi waktu ujian di server & satu jawaban per soal per attempt
    ALTER TABLE attempts ADD COLUMN IF NOT EXISTS segment_started_at TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS uq_attempt_answers_attempt_question ON attempt_answers(attempt_id, question_id);

    -- Maksimal satu attempt aktif per (pengguna, paket). Duplikat lama (klik ganda sebelum advisory lock)
    -- dibersihkan dulu: yang kosong dihapus, yang sudah berisi jawaban ditutup.
    WITH ranked AS (
      SELECT id, row_number() OVER (PARTITION BY user_id, package_id ORDER BY started_at) AS rn
      FROM attempts WHERE status IN ('IN_PROGRESS', 'PAUSED')
    )
    DELETE FROM attempts a USING ranked r
    WHERE a.id = r.id AND r.rn > 1 AND NOT EXISTS (SELECT 1 FROM attempt_answers x WHERE x.attempt_id = a.id);
    WITH ranked AS (
      SELECT id, row_number() OVER (PARTITION BY user_id, package_id ORDER BY started_at) AS rn
      FROM attempts WHERE status IN ('IN_PROGRESS', 'PAUSED')
    )
    UPDATE attempts a SET status = 'TIMED_OUT', finished_at = CURRENT_TIMESTAMP::text, remaining_seconds = 0, segment_started_at = NULL
    FROM ranked r WHERE a.id = r.id AND r.rn > 1;
    CREATE UNIQUE INDEX IF NOT EXISTS uq_attempts_one_active ON attempts(user_id, package_id)
      WHERE status IN ('IN_PROGRESS', 'PAUSED');

    -- Pustaka Belajar
    ALTER TABLE users ADD COLUMN IF NOT EXISTS grade_level INTEGER;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_id TEXT REFERENCES users(id) ON DELETE SET NULL;

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS learning_contents (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      phase_min TEXT NOT NULL,
      phase_max TEXT NOT NULL,
      cefr_level TEXT,
      theme TEXT,
      title TEXT NOT NULL,
      title_translation TEXT,
      summary TEXT,
      cover_emoji TEXT,
      cover_image_url TEXT,
      segments_json TEXT,
      body_markdown TEXT,
      reading_minutes INTEGER NOT NULL DEFAULT 3,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    );

    CREATE TABLE IF NOT EXISTS content_vocab (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
      word TEXT NOT NULL,
      forms TEXT,
      part_of_speech TEXT,
      meaning TEXT NOT NULL,
      example TEXT,
      emoji TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS content_grammar_notes (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      pattern TEXT,
      explanation TEXT NOT NULL,
      examples TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS content_quiz_items (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content_id TEXT NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
      completed_at TEXT NOT NULL,
      read_date TEXT NOT NULL,
      quiz_score INTEGER NOT NULL DEFAULT 0,
      quiz_total INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, content_id)
    );

    ALTER TABLE learning_contents ADD COLUMN IF NOT EXISTS edited_at TEXT;

    CREATE INDEX IF NOT EXISTS idx_contents_subject ON learning_contents(subject_id);
    CREATE INDEX IF NOT EXISTS idx_contents_type_phase ON learning_contents(type, phase_min);
    CREATE INDEX IF NOT EXISTS idx_vocab_content ON content_vocab(content_id);
    CREATE INDEX IF NOT EXISTS idx_grammar_content ON content_grammar_notes(content_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_content ON content_quiz_items(content_id);
    CREATE INDEX IF NOT EXISTS idx_progress_user_date ON reading_progress(user_id, read_date);
  `);

  console.log('PostgreSQL database tables and indexes verified and ready.');
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
