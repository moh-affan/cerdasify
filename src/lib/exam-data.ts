import { db } from '@/db';
import { packageQuestions, questions, questionOptions, attemptAnswers, topics } from '@/db/schema';
import { eq, asc, inArray } from 'drizzle-orm';
import { parseSelectedIds } from '@/lib/exam-grading';

export interface PublicQuestionOption {
  id: string;
  label: string;
  contentMarkdown: string;
  imageUrl?: string | null;
}

export interface PublicQuestion {
  id: string;
  topicName: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
  difficulty: string;
  contentMarkdown: string;
  imageUrl?: string | null;
  options: PublicQuestionOption[];
}

export interface AnswerStateMap {
  [questionId: string]: {
    selectedOptionIds: string[];
    isDoubtful: boolean;
  };
}

export interface ShuffleConfig {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

/** Pengacakan deterministik (Fisher–Yates + PRNG mulberry32) berdasarkan seed string. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;
  const rand = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Urutan soal untuk satu attempt (stabil saat dimuat ulang & sama di halaman pembahasan). */
export function orderQuestionsForAttempt<T>(items: T[], attemptId: string, cfg: ShuffleConfig): T[] {
  return cfg.shuffleQuestions ? seededShuffle(items, `${attemptId}:q`) : items;
}

/** Urutan opsi satu soal untuk satu attempt; label ditulis ulang A, B, C… sesuai posisi tampil. */
export function orderOptionsForAttempt<T extends { label: string }>(
  options: T[],
  attemptId: string,
  questionId: string,
  cfg: ShuffleConfig
): T[] {
  if (!cfg.shuffleOptions) return options;
  return seededShuffle(options, `${attemptId}:${questionId}`).map((o, i) => ({ ...o, label: String.fromCharCode(65 + i) }));
}

/**
 * Loads exam questions and answers in bulk (O(1) queries instead of N+1).
 * Strictly enforces Anti-Leak: no is_correct, score_value, or explanation are exposed.
 */
export async function getAttemptQuestionsAndAnswers(
  pkg: { id: string } & ShuffleConfig,
  attemptId: string
): Promise<{
  questions: PublicQuestion[];
  answers: AnswerStateMap;
}> {
  // 1. Get package questions ordered
  const pkgQs = await db
    .select({
      questionId: packageQuestions.questionId,
      orderIndex: packageQuestions.orderIndex,
    })
    .from(packageQuestions)
    .where(eq(packageQuestions.packageId, pkg.id))
    .orderBy(asc(packageQuestions.orderIndex));

  if (pkgQs.length === 0) {
    return { questions: [], answers: {} };
  }

  const questionIds = orderQuestionsForAttempt(
    pkgQs.map((p) => p.questionId),
    attemptId,
    pkg
  );

  // 2. Batch fetch questions with their topic names in a single query
  const questionsDb = await db
    .select({
      id: questions.id,
      topicName: topics.name,
      type: questions.type,
      difficulty: questions.difficulty,
      contentMarkdown: questions.contentMarkdown,
      imageUrl: questions.imageUrl,
    })
    .from(questions)
    .leftJoin(topics, eq(questions.topicId, topics.id))
    .where(inArray(questions.id, questionIds));

  const questionsMap = new Map(questionsDb.map((q) => [q.id, q]));

  // 3. Batch fetch options for all questions in a single query
  // ANTI-LEAK: Only public fields, no answers or explanation
  const optionsDb = await db
    .select({
      id: questionOptions.id,
      questionId: questionOptions.questionId,
      label: questionOptions.label,
      contentMarkdown: questionOptions.contentMarkdown,
      imageUrl: questionOptions.imageUrl,
      orderIndex: questionOptions.orderIndex,
    })
    .from(questionOptions)
    .where(inArray(questionOptions.questionId, questionIds))
    .orderBy(asc(questionOptions.orderIndex));

  const optionsMap = new Map<string, PublicQuestionOption[]>();
  for (const opt of optionsDb) {
    if (!optionsMap.has(opt.questionId)) {
      optionsMap.set(opt.questionId, []);
    }
    optionsMap.get(opt.questionId)!.push({
      id: opt.id,
      label: opt.label,
      contentMarkdown: opt.contentMarkdown,
      imageUrl: opt.imageUrl,
    });
  }

  // 4. Construct payload maintaining package questions orderIndex
  const questionsPayload: PublicQuestion[] = [];
  for (const questionId of questionIds) {
    const q = questionsMap.get(questionId);
    if (!q) continue;
    questionsPayload.push({
      id: q.id,
      topicName: q.topicName || 'Umum',
      type: q.type as PublicQuestion['type'],
      difficulty: q.difficulty,
      contentMarkdown: q.contentMarkdown,
      imageUrl: q.imageUrl,
      options: orderOptionsForAttempt(optionsMap.get(q.id) || [], attemptId, q.id, pkg),
    });
  }

  // 5. Batch fetch user answers for this attempt
  const existingAnswers = await db
    .select()
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attemptId));

  const answersMap: AnswerStateMap = {};
  for (const ans of existingAnswers) {
    answersMap[ans.questionId] = {
      selectedOptionIds: parseSelectedIds(ans.selectedOptionIds),
      isDoubtful: ans.isDoubtful || false,
    };
  }

  return { questions: questionsPayload, answers: answersMap };
}
