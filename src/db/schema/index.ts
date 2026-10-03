import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['SUPER_ADMIN', 'ADMIN', 'USER'] }).notNull().default('USER'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
});

export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  topicId: text('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['SINGLE_CHOICE', 'MULTI_CHOICE', 'GRADED_SCALE'] })
    .notNull()
    .default('SINGLE_CHOICE'),
  contentMarkdown: text('content_markdown').notNull(),
  imageUrl: text('image_url'),
  explanationMarkdown: text('explanation_markdown'),
  explanationImageUrl: text('explanation_image_url'),
  difficulty: text('difficulty', { enum: ['EASY', 'MEDIUM', 'HARD', 'HOTS'] })
    .notNull()
    .default('MEDIUM'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const questionOptions = sqliteTable('question_options', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  label: text('label').notNull(), // A, B, C, D, E
  contentMarkdown: text('content_markdown').notNull(),
  imageUrl: text('image_url'),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
  scoreValue: integer('score_value').notNull().default(0),
  orderIndex: integer('order_index').notNull().default(0),
});

export const examPackages = sqliteTable('exam_packages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['SIMULATION', 'PRACTICE'] })
    .notNull()
    .default('SIMULATION'),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  shuffleQuestions: integer('shuffle_questions', { mode: 'boolean' }).notNull().default(false),
  shuffleOptions: integer('shuffle_options', { mode: 'boolean' }).notNull().default(false),
  passingGradeRules: text('passing_grade_rules'), // JSON string
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const packageQuestions = sqliteTable(
  'package_questions',
  {
    packageId: text('package_id')
      .notNull()
      .references(() => examPackages.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.packageId, table.questionId] }),
  ]
);

export const attempts = sqliteTable('attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  packageId: text('package_id')
    .notNull()
    .references(() => examPackages.id, { onDelete: 'cascade' }),
  startedAt: text('started_at').notNull(),
  finishedAt: text('finished_at'),
  scoreTotal: integer('score_total').notNull().default(0),
  scoreBreakdown: text('score_breakdown'), // JSON string
  isPassed: integer('is_passed', { mode: 'boolean' }).notNull().default(false),
  status: text('status', { enum: ['IN_PROGRESS', 'PAUSED', 'COMPLETED', 'TIMED_OUT'] })
    .notNull()
    .default('IN_PROGRESS'),
  remainingSeconds: integer('remaining_seconds'),
});

export const attemptAnswers = sqliteTable('attempt_answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id')
    .notNull()
    .references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  selectedOptionIds: text('selected_option_ids'), // JSON array of string IDs e.g. ["opt_id"]
  scoreAwarded: integer('score_awarded').notNull().default(0),
  isDoubtful: integer('is_doubtful', { mode: 'boolean' }).notNull().default(false),
  answeredAt: text('answered_at').notNull().default(sql`(datetime('now'))`),
});
