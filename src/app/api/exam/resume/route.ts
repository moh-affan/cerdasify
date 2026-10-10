import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { loadAttempt } from '@/lib/exam-session';
import { eq } from 'drizzle-orm';

// Melanjutkan attempt yang dijeda; waktu mulai berjalan lagi dari sekarang.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { attemptId } = await readJson<{ attemptId?: unknown }>(req);
    const { attempt, pkg } = await loadAttempt(attemptId, user);

    if (attempt.status === 'IN_PROGRESS') {
      return NextResponse.json({ success: true, status: 'IN_PROGRESS' });
    }
    if (attempt.status !== 'PAUSED') throw new ApiError('Sesi ujian sudah selesai', 409, { redirectUrl: `/results/${attempt.id}` });

    const remainingSeconds = Math.max(0, attempt.remainingSeconds ?? pkg.durationMinutes * 60);
    await db
      .update(attempts)
      .set({ status: 'IN_PROGRESS', remainingSeconds, segmentStartedAt: new Date().toISOString() })
      .where(eq(attempts.id, attempt.id));

    return NextResponse.json({ success: true, status: 'IN_PROGRESS', remainingSeconds });
  } catch (error) {
    return apiError(error, 'Error resuming exam');
  }
}
