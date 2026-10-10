import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { getAttemptQuestionsAndAnswers } from '@/lib/exam-data';
import { attemptSummary, closeIfOverdue, isStaff } from '@/lib/exam-session';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { isPastDeadline } from '@/lib/exam-time';

// Memulai attempt baru atau melanjutkan attempt yang masih aktif.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { packageId } = await readJson<{ packageId?: unknown }>(req);
    if (typeof packageId !== 'string' || !packageId) throw new ApiError('packageId wajib diisi');

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, packageId)).limit(1);
    // Paket draf hanya bisa dicoba staf
    if (!pkg || (!pkg.isPublished && !isStaff(user))) throw new ApiError('Paket ujian tidak ditemukan', 404);

    const [firstPkgQ] = await db
      .select({ questionId: packageQuestions.questionId })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, packageId))
      .limit(1);

    // Kunci per (pengguna, paket) di dalam transaksi: permintaan start bersamaan (klik ganda, dua tab)
    // diproses berurutan sehingga tidak pernah membuat dua attempt aktif.
    const { attempt, resumed } = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`exam-start:${user.userId}:${packageId}`}))`);

      const [existing] = await tx
        .select()
        .from(attempts)
        .where(
          and(
            eq(attempts.userId, user.userId),
            eq(attempts.packageId, packageId),
            inArray(attempts.status, ['IN_PROGRESS', 'PAUSED'])
          )
        )
        .orderBy(desc(attempts.startedAt))
        .limit(1);

      if (existing && !isPastDeadline(existing, pkg.durationMinutes)) {
        return { attempt: existing, resumed: true };
      }
      if (!firstPkgQ) throw new ApiError('Paket ujian belum memiliki butir soal');

      const nowIso = new Date().toISOString();
      const [created] = await tx
        .insert(attempts)
        .values({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: user.userId,
          packageId: pkg.id,
          startedAt: nowIso,
          segmentStartedAt: nowIso,
          remainingSeconds: pkg.durationMinutes * 60,
          status: 'IN_PROGRESS',
          scoreTotal: 0,
        })
        .returning();
      return { attempt: created, resumed: false, expired: existing };
    }).then(async (r) => {
      // Attempt lama yang waktunya sudah habis dinilai di luar transaksi kunci
      if ('expired' in r && r.expired) await closeIfOverdue(r.expired, pkg);
      return r;
    });

    const { questions, answers } = await getAttemptQuestionsAndAnswers(pkg, attempt.id);
    return NextResponse.json({
      attemptId: attempt.id,
      attempt: attemptSummary(attempt, pkg),
      questions,
      answers,
      resumed,
    });
  } catch (error) {
    return apiError(error, 'Error starting exam');
  }
}
