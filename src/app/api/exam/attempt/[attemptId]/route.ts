import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import { requireAdmin, requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { getAttemptQuestionsAndAnswers } from '@/lib/exam-data';
import { finalizeAttempt } from '@/lib/exam-grading';
import { attemptSummary, closeIfOverdue, isActive, isStaff, loadAttempt } from '@/lib/exam-session';
import { isPastDeadline } from '@/lib/exam-time';
import { eq } from 'drizzle-orm';

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

// Menghapus hasil ujian (mis. hanya coba-coba): pemilik attempt atau Admin/Super Admin.
// - Akun anak (punya parent_id): hasil masuk sampah, menunggu konfirmasi orang tua/admin.
// - Pengguna lain & staf: permanen; jawaban ikut terhapus lewat FK ON DELETE CASCADE.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const user = await requireUser();
    const { attemptId } = await params;
    const { attempt, pkg } = await loadAttempt(attemptId, user, { allowStaff: true });

    if (attempt.userId === user.userId && user.parentId && !isStaff(user)) {
      // Tutup dulu pengerjaan yang masih berjalan: hanya boleh ada satu attempt aktif per paket,
      // dan attempt di sampah tidak boleh menghalangi anak memulai ulang.
      if (isActive(attempt)) {
        await finalizeAttempt(attempt.id, pkg, isPastDeadline(attempt, pkg.durationMinutes) ? 'TIMED_OUT' : 'COMPLETED');
      }
      await db.update(attempts).set({ deletedAt: new Date().toISOString() }).where(eq(attempts.id, attempt.id));
      console.info('Attempt dipindah ke sampah:', { attemptId: attempt.id, by: user.userId });
      return NextResponse.json({ success: true, trashed: true });
    }

    await db.delete(attempts).where(eq(attempts.id, attempt.id));
    console.info('Attempt dihapus:', { attemptId: attempt.id, ownerId: attempt.userId, by: user.userId, role: user.role });

    return NextResponse.json({ success: true, trashed: false });
  } catch (error) {
    return apiError(error, 'Error deleting attempt');
  }
}

// Admin/Super Admin memulihkan hasil dari sampah (menolak permintaan hapus anak).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const user = await requireAdmin();
    const { attemptId } = await params;
    const { action } = await readJson<{ action?: unknown }>(req);
    if (action !== 'restore') throw new ApiError('Aksi tidak dikenal');

    const { attempt } = await loadAttempt(attemptId, user, { allowStaff: true });
    if (!attempt.deletedAt) throw new ApiError('Hasil ujian ini tidak ada di sampah', 409);

    await db.update(attempts).set({ deletedAt: null }).where(eq(attempts.id, attempt.id));
    console.info('Attempt dipulihkan dari sampah:', { attemptId: attempt.id, by: user.userId, role: user.role });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error restoring attempt');
  }
}
