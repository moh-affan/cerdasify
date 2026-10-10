import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { finalizeAttempt } from '@/lib/exam-grading';
import { isPastDeadline } from '@/lib/exam-time';
import { isActive, loadAttempt } from '@/lib/exam-session';

// Menyelesaikan attempt & menilai 100% di server. Submit setelah batas waktu dicatat sebagai TIMED_OUT.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { attemptId } = await readJson<{ attemptId?: unknown }>(req);
    const { attempt, pkg } = await loadAttempt(attemptId, user);
    const redirectUrl = `/results/${attempt.id}`;

    if (!isActive(attempt)) return NextResponse.json({ success: true, redirectUrl });

    const status = isPastDeadline(attempt, pkg.durationMinutes) ? 'TIMED_OUT' : 'COMPLETED';
    const result = await finalizeAttempt(attempt.id, pkg, status);

    return NextResponse.json({ success: true, status, score: result.totalScore, isPassed: result.isPassed, redirectUrl });
  } catch (error) {
    return apiError(error, 'Error submitting exam');
  }
}
