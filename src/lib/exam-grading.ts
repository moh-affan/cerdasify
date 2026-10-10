import { db } from '@/db';
import { attempts, attemptAnswers, packageQuestions, questionOptions, questions, topics } from '@/db/schema';
import { calculateScore, type QuestionGradingData, type ScoringRule, type UserAnswerData } from '@/lib/scoring';
import { and, eq, inArray } from 'drizzle-orm';

export function parseScoringRules(raw: string | null): ScoringRule {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function parseSelectedIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Menilai attempt sepenuhnya di server lalu menutupnya (COMPLETED atau TIMED_OUT).
 * Hanya attempt yang masih IN_PROGRESS/PAUSED yang diproses; pemanggilan ganda aman.
 */
export async function finalizeAttempt(
  attemptId: string,
  pkg: { id: string; passingGradeRules: string | null },
  status: 'COMPLETED' | 'TIMED_OUT'
) {
  const pkgQs = await db
    .select({ questionId: packageQuestions.questionId })
    .from(packageQuestions)
    .where(eq(packageQuestions.packageId, pkg.id));
  const qIds = pkgQs.map((p) => p.questionId);

  const gradingQuestions: QuestionGradingData[] = [];
  if (qIds.length > 0) {
    const [questionsDb, optsDb] = await Promise.all([
      db
        .select({ id: questions.id, topicName: topics.name, type: questions.type })
        .from(questions)
        .leftJoin(topics, eq(questions.topicId, topics.id))
        .where(inArray(questions.id, qIds)),
      db
        .select({
          id: questionOptions.id,
          questionId: questionOptions.questionId,
          label: questionOptions.label,
          isCorrect: questionOptions.isCorrect,
          scoreValue: questionOptions.scoreValue,
        })
        .from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)),
    ]);

    const questionsMap = new Map(questionsDb.map((q) => [q.id, q]));
    const optsMap = new Map<string, typeof optsDb>();
    for (const opt of optsDb) {
      if (!optsMap.has(opt.questionId)) optsMap.set(opt.questionId, []);
      optsMap.get(opt.questionId)!.push(opt);
    }

    for (const qId of qIds) {
      const q = questionsMap.get(qId);
      if (!q) continue;
      gradingQuestions.push({
        questionId: q.id,
        topicName: q.topicName || 'Umum',
        type: q.type,
        options: (optsMap.get(q.id) || []).map((o) => ({
          id: o.id,
          label: o.label,
          isCorrect: Boolean(o.isCorrect),
          scoreValue: o.scoreValue || 0,
        })),
      });
    }
  }

  const userAnswersDb = await db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, attemptId));
  const answersData: UserAnswerData[] = userAnswersDb.map((a) => ({
    questionId: a.questionId,
    selectedOptionIds: parseSelectedIds(a.selectedOptionIds),
    isDoubtful: Boolean(a.isDoubtful),
  }));

  const scoreResult = calculateScore(gradingQuestions, answersData, parseScoringRules(pkg.passingGradeRules));

  await db.transaction(async (tx) => {
    for (const graded of scoreResult.scoreBreakdown.answersGraded) {
      await tx
        .update(attemptAnswers)
        .set({ scoreAwarded: graded.scoreAwarded })
        .where(and(eq(attemptAnswers.attemptId, attemptId), eq(attemptAnswers.questionId, graded.questionId)));
    }
    await tx
      .update(attempts)
      .set({
        finishedAt: new Date().toISOString(),
        scoreTotal: scoreResult.totalScore,
        scoreBreakdown: JSON.stringify(scoreResult),
        isPassed: scoreResult.isPassed,
        status,
        remainingSeconds: status === 'TIMED_OUT' ? 0 : null,
        segmentStartedAt: null,
      })
      .where(and(eq(attempts.id, attemptId), inArray(attempts.status, ['IN_PROGRESS', 'PAUSED'])));
  });

  return scoreResult;
}
