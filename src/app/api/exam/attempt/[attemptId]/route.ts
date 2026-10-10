import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api';
import { getAttemptQuestionsAndAnswers } from '@/lib/exam-data';
import { attemptSummary, closeIfOverdue, isActive, loadAttempt } from '@/lib/exam-session';

// Memuat ulang soal & jawaban attempt (tanpa kunci jawaban).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const user = await requireUser();
    const { attemptId } = await params;
    const { attempt, pkg } = await loadAttempt(attemptId, user, { allowStaff: true });
    await closeIfOverdue(attempt, pkg);

    // Attempt yang sudah selesai tidak perlu soal lagi; klien akan diarahkan ke halaman hasil.
    if (!isActive(attempt)) {
      return NextResponse.json({ attempt: attemptSummary(attempt, pkg), questions: [], answers: {} });
    }

    const { questions, answers } = await getAttemptQuestionsAndAnswers(pkg, attempt.id);
    return NextResponse.json({ attempt: attemptSummary(attempt, pkg), questions, answers });
  } catch (error) {
    return apiError(error, 'Error fetching attempt');
  }
}
