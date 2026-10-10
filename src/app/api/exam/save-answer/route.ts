import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attemptAnswers, packageQuestions, questionOptions, questions } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { closeIfOverdue, loadAttempt } from '@/lib/exam-session';
import { and, eq } from 'drizzle-orm';

// Auto-save satu jawaban. Ditolak bila ujian dijeda, selesai, atau waktunya habis.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await readJson<{ attemptId?: unknown; questionId?: unknown; selectedOptionIds?: unknown; isDoubtful?: unknown }>(req);
    const { attempt, pkg } = await loadAttempt(body.attemptId, user);

    if (await closeIfOverdue(attempt, pkg)) {
      throw new ApiError('Waktu ujian telah habis. Jawaban Anda sudah dinilai.', 409, { redirectUrl: `/results/${attempt.id}` });
    }
    if (attempt.status === 'PAUSED') throw new ApiError('Ujian sedang dijeda. Lanjutkan ujian untuk menjawab.', 409);
    if (attempt.status !== 'IN_PROGRESS') {
      throw new ApiError('Ujian sudah diselesaikan', 409, { redirectUrl: `/results/${attempt.id}` });
    }

    const questionId = body.questionId;
    if (typeof questionId !== 'string' || !questionId) throw new ApiError('questionId wajib diisi');

    // Soal harus bagian dari paket ini
    const [q] = await db
      .select({ type: questions.type })
      .from(packageQuestions)
      .innerJoin(questions, eq(packageQuestions.questionId, questions.id))
      .where(and(eq(packageQuestions.packageId, pkg.id), eq(packageQuestions.questionId, questionId)))
      .limit(1);
    if (!q) throw new ApiError('Soal tidak termasuk dalam paket ujian ini');

    // Opsi harus milik soal ini; soal non-MULTI_CHOICE maksimal satu pilihan
    const rawSelected = Array.isArray(body.selectedOptionIds) ? body.selectedOptionIds : [];
    const selected = [...new Set(rawSelected.filter((x): x is string => typeof x === 'string'))];
    if (selected.length > 0) {
      const validIds = new Set(
        (await db.select({ id: questionOptions.id }).from(questionOptions).where(eq(questionOptions.questionId, questionId))).map(
          (o) => o.id
        )
      );
      if (selected.some((id) => !validIds.has(id))) throw new ApiError('Pilihan jawaban tidak valid');
      if (q.type !== 'MULTI_CHOICE' && selected.length > 1) throw new ApiError('Soal ini hanya boleh satu jawaban');
    }

    const values = {
      selectedOptionIds: JSON.stringify(selected),
      isDoubtful: Boolean(body.isDoubtful),
      answeredAt: new Date().toISOString(),
    };
    await db
      .insert(attemptAnswers)
      .values({ id: `ans_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, attemptId: attempt.id, questionId, ...values })
      .onConflictDoUpdate({ target: [attemptAnswers.attemptId, attemptAnswers.questionId], set: values });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error saving answer');
  }
}
