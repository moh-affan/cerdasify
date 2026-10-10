import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { computeRemainingSeconds } from '@/lib/exam-time';
import { closeIfOverdue, loadAttempt } from '@/lib/exam-session';
import { eq } from 'drizzle-orm';

// Menjeda attempt Mode Latihan. Sisa waktu dihitung server (nilai dari klien hanya boleh mengurangi).
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await readJson<{ attemptId?: unknown; remainingSeconds?: unknown }>(req);
    const { attempt, pkg } = await loadAttempt(body.attemptId, user);

    if (pkg.type !== 'PRACTICE') throw new ApiError('Simulasi resmi tidak dapat dijeda', 403);
    if (await closeIfOverdue(attempt, pkg)) {
      throw new ApiError('Waktu ujian telah habis', 409, { redirectUrl: `/results/${attempt.id}` });
    }
    if (attempt.status === 'PAUSED') {
      return NextResponse.json({ success: true, status: 'PAUSED', remainingSeconds: attempt.remainingSeconds });
    }
    if (attempt.status !== 'IN_PROGRESS') throw new ApiError('Sesi ujian sudah selesai', 409);

    const serverRemaining = computeRemainingSeconds(attempt, pkg.durationMinutes);
    const clientRemaining = typeof body.remainingSeconds === 'number' && body.remainingSeconds >= 0 ? body.remainingSeconds : Infinity;
    const remainingSeconds = Math.floor(Math.min(serverRemaining, clientRemaining));

    await db
      .update(attempts)
      .set({ status: 'PAUSED', remainingSeconds, segmentStartedAt: null })
      .where(eq(attempts.id, attempt.id));

    return NextResponse.json({ success: true, status: 'PAUSED', remainingSeconds });
  } catch (error) {
    return apiError(error, 'Error pausing exam');
  }
}
