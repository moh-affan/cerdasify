import { db } from '@/db';
import { packageQuestions, questions, questionOptions, attemptAnswers, topics } from '@/db/schema';
import { eq, asc, inArray } from 'drizzle-orm';

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

/**
 * Loads exam questions and answers in bulk (O(1) queries instead of N+1).
 * Strictly enforces Anti-Leak: no is_correct, score_value, or explanation are exposed.
 */
export async function getAttemptQuestionsAndAnswers(packageId: string, attemptId: string): Promise<{
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
    .where(eq(packageQuestions.packageId, packageId))
    .orderBy(asc(packageQuestions.orderIndex));

  if (pkgQs.length === 0) {
    return { questions: [], answers: {} };
  }

  const questionIds = pkgQs.map((p) => p.questionId);

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
  for (const pq of pkgQs) {
    const q = questionsMap.get(pq.questionId);
    if (!q) continue;
    questionsPayload.push({
      id: q.id,
      topicName: q.topicName || 'Umum',
      type: q.type as PublicQuestion['type'],
      difficulty: q.difficulty,
      contentMarkdown: q.contentMarkdown,
      imageUrl: q.imageUrl,
      options: optionsMap.get(q.id) || [],
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
      selectedOptionIds: ans.selectedOptionIds ? JSON.parse(ans.selectedOptionIds) : [],
      isDoubtful: ans.isDoubtful || false,
    };
  }

  return { questions: questionsPayload, answers: answersMap };
}
