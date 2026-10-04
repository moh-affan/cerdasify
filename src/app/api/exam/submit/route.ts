import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import {
  attempts,
  examPackages,
  packageQuestions,
  questions,
  questionOptions,
  attemptAnswers,
  topics,
} from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { calculateScore, QuestionGradingData, UserAnswerData } from '@/lib/scoring';
import { eq, inArray } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { attemptId } = body;

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId is required' }, { status: 400 });
    }

    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      return NextResponse.json({
        success: true,
        redirectUrl: `/results/${attemptId}`,
      });
    }

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    // 1. Gather all questions and options for grading in batch
    const pkgQs = await db
      .select({ questionId: packageQuestions.questionId })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, pkg.id));

    const gradingQuestions: QuestionGradingData[] = [];

    if (pkgQs.length > 0) {
      const qIds = pkgQs.map((p) => p.questionId);

      const questionsDb = await db
        .select({
          id: questions.id,
          topicName: topics.name,
          type: questions.type,
        })
        .from(questions)
        .leftJoin(topics, eq(questions.topicId, topics.id))
        .where(inArray(questions.id, qIds));

      const questionsMap = new Map(questionsDb.map((q) => [q.id, q]));

      const optsDb = await db
        .select({
          id: questionOptions.id,
          questionId: questionOptions.questionId,
          label: questionOptions.label,
          isCorrect: questionOptions.isCorrect,
          scoreValue: questionOptions.scoreValue,
        })
        .from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds));

      const optsMap = new Map<string, typeof optsDb>();
      for (const opt of optsDb) {
        if (!optsMap.has(opt.questionId)) {
          optsMap.set(opt.questionId, []);
        }
        optsMap.get(opt.questionId)!.push(opt);
      }

      for (const pq of pkgQs) {
        const q = questionsMap.get(pq.questionId);
        if (!q) continue;
        const opts = optsMap.get(q.id) || [];
        gradingQuestions.push({
          questionId: q.id,
          topicName: q.topicName || 'Umum',
          type: q.type as QuestionGradingData['type'],
          options: opts.map((o) => ({
            id: o.id,
            label: o.label,
            isCorrect: o.isCorrect || false,
            scoreValue: o.scoreValue || 0,
          })),
        });
      }
    }

    // 2. Gather user answers
    const userAnswersDb = await db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, attemptId));
    const answersData: UserAnswerData[] = userAnswersDb.map((a) => ({
      questionId: a.questionId,
      selectedOptionIds: a.selectedOptionIds ? JSON.parse(a.selectedOptionIds) : [],
      isDoubtful: a.isDoubtful || false,
    }));

    // 3. Parse scoring rules
    let rules = {};
    if (pkg.passingGradeRules) {
      try {
        rules = JSON.parse(pkg.passingGradeRules);
      } catch {}
    }

    // 4. Calculate score
    const scoreResult = calculateScore(gradingQuestions, answersData, rules);
    const nowIso = new Date().toISOString();

    // 5. Update database transactionally
    await client.begin(async (sql) => {
      // Update individual answer scores
      for (const gradedAns of scoreResult.scoreBreakdown.answersGraded) {
        await sql`
          UPDATE attempt_answers 
          SET score_awarded = ${gradedAns.scoreAwarded} 
          WHERE attempt_id = ${attemptId} AND question_id = ${gradedAns.questionId}
        `;
      }

      // Update attempt
      await sql`
        UPDATE attempts
        SET finished_at = ${nowIso},
            score_total = ${scoreResult.totalScore},
            score_breakdown = ${JSON.stringify(scoreResult)},
            is_passed = ${scoreResult.isPassed},
            status = 'COMPLETED'
        WHERE id = ${attemptId}
      `;
    });

    return NextResponse.json({
      success: true,
      score: scoreResult.totalScore,
      isPassed: scoreResult.isPassed,
      redirectUrl: `/results/${attemptId}`,
    });
  } catch (error: any) {
    console.error('Error submitting exam:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
