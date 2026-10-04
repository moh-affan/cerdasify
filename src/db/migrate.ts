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
