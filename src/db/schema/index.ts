import { pgTable, text, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['SUPER_ADMIN', 'ADMIN', 'USER'] }).notNull().default('USER'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP::text`),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
});

export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
});

export const questions = pgTable('questions', {
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
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP::text`),
});

export const questionOptions = pgTable('question_options', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  label: text('label').notNull(), // A, B, C, D, E
  contentMarkdown: text('content_markdown').notNull(),
  imageUrl: text('image_url'),
  isCorrect: boolean('is_correct').notNull().default(false),
  scoreValue: integer('score_value').notNull().default(0),
  orderIndex: integer('order_index').notNull().default(0),
});

export const examPackages = pgTable('exam_packages', {
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
  shuffleQuestions: boolean('shuffle_questions').notNull().default(false),
  shuffleOptions: boolean('shuffle_options').notNull().default(false),
  passingGradeRules: text('passing_grade_rules'), // JSON string
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP::text`),
});

export const packageQuestions = pgTable(
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

export const attempts = pgTable('attempts', {
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
  isPassed: boolean('is_passed').notNull().default(false),
  status: text('status', { enum: ['IN_PROGRESS', 'PAUSED', 'COMPLETED', 'TIMED_OUT'] })
    .notNull()
    .default('IN_PROGRESS'),
  remainingSeconds: integer('remaining_seconds'),
});

export const attemptAnswers = pgTable('attempt_answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id')
    .notNull()
    .references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  selectedOptionIds: text('selected_option_ids'), // JSON array of string IDs e.g. ["opt_id"]
  scoreAwarded: integer('score_awarded').notNull().default(0),
  isDoubtful: boolean('is_doubtful').notNull().default(false),
  answeredAt: text('answered_at').notNull().default(sql`CURRENT_TIMESTAMP::text`),
});
