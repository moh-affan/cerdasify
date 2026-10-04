import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, examPackages } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { getAttemptQuestionsAndAnswers } from '@/lib/exam-data';

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
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);

    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    const { questions: questionsPayload, answers: answersMap } =
      await getAttemptQuestionsAndAnswers(pkg.id, attempt.id);

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
