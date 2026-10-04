import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, attemptAnswers } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { attemptId, questionId, selectedOptionIds, isDoubtful } = body;

    if (!attemptId || !questionId) {
      return NextResponse.json({ error: 'attemptId and questionId are required' }, { status: 400 });
    }

    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      return NextResponse.json({ error: 'Ujian sudah diselesaikan atau waktu telah habis' }, { status: 400 });
    }

    // Check if an answer record already exists
    const [existing] = await db
      .select()
      .from(attemptAnswers)
      .where(and(eq(attemptAnswers.attemptId, attemptId), eq(attemptAnswers.questionId, questionId)))
      .limit(1);

    const selectedJson = JSON.stringify(selectedOptionIds || []);

    if (existing) {
      await db.update(attemptAnswers)
        .set({
          selectedOptionIds: selectedJson,
          isDoubtful: Boolean(isDoubtful),
        })
        .where(eq(attemptAnswers.id, existing.id));
    } else {
      const answerId = `ans_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(attemptAnswers)
        .values({
          id: answerId,
          attemptId,
          questionId,
          selectedOptionIds: selectedJson,
          isDoubtful: Boolean(isDoubtful),
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
