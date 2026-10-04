import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and, or } from 'drizzle-orm';
import { getAttemptQuestionsAndAnswers } from '@/lib/exam-data';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, packageId)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    // Check if there is already an active in-progress or paused attempt for this user & package
    const [existing] = await db
      .select()
      .from(attempts)
      .where(
        and(
          eq(attempts.userId, user.userId),
          eq(attempts.packageId, packageId),
          or(eq(attempts.status, 'IN_PROGRESS'), eq(attempts.status, 'PAUSED'))
        )
      )
      .limit(1);

    if (existing) {
      const { questions: questionsPayload, answers: answersMap } =
        await getAttemptQuestionsAndAnswers(pkg.id, existing.id);

      return NextResponse.json({
        attemptId: existing.id,
        attempt: {
          id: existing.id,
          packageId: existing.packageId,
          packageTitle: pkg.title,
          packageType: pkg.type,
          durationMinutes: pkg.durationMinutes,
          startedAt: existing.startedAt,
          status: existing.status,
          remainingSeconds: existing.remainingSeconds,
        },
        questions: questionsPayload,
        answers: answersMap,
        resumed: true,
      });
    }

    // Check that package has questions
    const [firstPkgQ] = await db
      .select({ questionId: packageQuestions.questionId })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, packageId))
      .limit(1);

    if (!firstPkgQ) {
      return NextResponse.json({ error: 'Paket ujian belum memiliki butir soal' }, { status: 400 });
    }

    const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    await db.insert(attempts)
      .values({
        id: newAttemptId,
        userId: user.userId,
        packageId: pkg.id,
        startedAt: nowIso,
        status: 'IN_PROGRESS',
        scoreTotal: 0,
      });

    const { questions: questionsPayload, answers: answersMap } =
      await getAttemptQuestionsAndAnswers(pkg.id, newAttemptId);

    return NextResponse.json({
      attemptId: newAttemptId,
      attempt: {
        id: newAttemptId,
        packageId: pkg.id,
        packageTitle: pkg.title,
        packageType: pkg.type,
        durationMinutes: pkg.durationMinutes,
        startedAt: nowIso,
        status: 'IN_PROGRESS',
        remainingSeconds: null,
      },
      questions: questionsPayload,
      answers: answersMap,
      resumed: false,
    });
  } catch (error: any) {
    console.error('Error starting exam:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
