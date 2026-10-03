import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions, questions, questionOptions, attemptAnswers, topics } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId } = await params;
    const attempt = db.select().from(attempts).where(eq(attempts.id, attemptId)).get();

    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const pkg = db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).get();
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    // Load questions ordered by package_questions.order_index
    const pkgQs = db
      .select({
        questionId: packageQuestions.questionId,
        orderIndex: packageQuestions.orderIndex,
      })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, pkg.id))
      .orderBy(asc(packageQuestions.orderIndex))
      .all();

    const questionsPayload = [];

    for (const pq of pkgQs) {
      const q = db.select().from(questions).where(eq(questions.id, pq.questionId)).get();
      if (!q) continue;

      const topic = db.select().from(topics).where(eq(topics.id, q.topicId)).get();

      // Fetch options ordered by orderIndex
      const opts = db
        .select({
          id: questionOptions.id,
          label: questionOptions.label,
          contentMarkdown: questionOptions.contentMarkdown,
          imageUrl: questionOptions.imageUrl,
          orderIndex: questionOptions.orderIndex,
        })
        .from(questionOptions)
        .where(eq(questionOptions.questionId, q.id))
        .orderBy(asc(questionOptions.orderIndex))
        .all();

      // ANTI-LEAK: Notice NO is_correct, NO score_value, NO explanation!
      questionsPayload.push({
        id: q.id,
        topicName: topic ? topic.name : 'Umum',
        type: q.type,
        difficulty: q.difficulty,
        contentMarkdown: q.contentMarkdown,
        imageUrl: q.imageUrl,
        options: opts.map((o) => ({
          id: o.id,
          label: o.label,
          contentMarkdown: o.contentMarkdown,
          imageUrl: o.imageUrl,
        })),
      });
    }

    // Load existing user answers
    const existingAnswers = db
      .select()
      .from(attemptAnswers)
      .where(eq(attemptAnswers.attemptId, attempt.id))
      .all();

    const answersMap: Record<string, { selectedOptionIds: string[]; isDoubtful: boolean }> = {};
    for (const ans of existingAnswers) {
      answersMap[ans.questionId] = {
        selectedOptionIds: ans.selectedOptionIds ? JSON.parse(ans.selectedOptionIds) : [],
        isDoubtful: ans.isDoubtful || false,
      };
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        packageId: attempt.packageId,
        packageTitle: pkg.title,
        packageType: pkg.type,
        durationMinutes: pkg.durationMinutes,
        startedAt: attempt.startedAt,
        status: attempt.status,
        remainingSeconds: attempt.remainingSeconds,
      },
      questions: questionsPayload,
      answers: answersMap,
    });
  } catch (error: any) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
