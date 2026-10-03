import { NextRequest, NextResponse } from 'next/server';
import { db, sqlite } from '@/db';
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
import { eq, and } from 'drizzle-orm';

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

    const attempt = db.select().from(attempts).where(eq(attempts.id, attemptId)).get();
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

    const pkg = db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).get();
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    // 1. Gather all questions and options for grading
    const pkgQs = db.select().from(packageQuestions).where(eq(packageQuestions.packageId, pkg.id)).all();
    const gradingQuestions: QuestionGradingData[] = [];

    for (const pq of pkgQs) {
      const q = db.select().from(questions).where(eq(questions.id, pq.questionId)).get();
      if (!q) continue;

      const topic = db.select().from(topics).where(eq(topics.id, q.topicId)).get();
      const opts = db.select().from(questionOptions).where(eq(questionOptions.questionId, q.id)).all();

      gradingQuestions.push({
        questionId: q.id,
        topicName: topic ? topic.name : 'Umum',
        type: q.type as any,
        options: opts.map((o) => ({
          id: o.id,
          label: o.label,
          isCorrect: o.isCorrect || false,
          scoreValue: o.scoreValue || 0,
        })),
      });
    }

    // 2. Gather user answers
    const userAnswersDb = db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, attemptId)).all();
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
    const submitTx = sqlite.transaction(() => {
      // Update individual answer scores
      for (const gradedAns of scoreResult.scoreBreakdown.answersGraded) {
        sqlite
          .prepare(
            `UPDATE attempt_answers SET score_awarded = ? WHERE attempt_id = ? AND question_id = ?`
          )
          .run(gradedAns.scoreAwarded, attemptId, gradedAns.questionId);
      }

      // Update attempt
      sqlite
        .prepare(
          `UPDATE attempts
           SET finished_at = ?,
               score_total = ?,
               score_breakdown = ?,
               is_passed = ?,
               status = 'COMPLETED'
           WHERE id = ?`
        )
        .run(
          nowIso,
          scoreResult.totalScore,
          JSON.stringify(scoreResult),
          scoreResult.isPassed ? 1 : 0,
          attemptId
        );
    });

    submitTx();

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
