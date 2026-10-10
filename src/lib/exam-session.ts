import { db } from '@/db';
import { attempts, examPackages } from '@/db/schema';
import type { SessionPayload } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { finalizeAttempt } from '@/lib/exam-grading';
import { computeRemainingSeconds, isPastDeadline } from '@/lib/exam-time';
import { eq } from 'drizzle-orm';

export type AttemptRow = typeof attempts.$inferSelect;
export type PackageRow = typeof examPackages.$inferSelect;

export const isStaff = (user: SessionPayload) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

/** Ambil attempt + paketnya dan pastikan milik pengguna (staf boleh membaca milik orang lain bila diizinkan). */
export async function loadAttempt(
  attemptId: unknown,
  user: SessionPayload,
  { allowStaff = false } = {}
): Promise<{ attempt: AttemptRow; pkg: PackageRow }> {
  if (typeof attemptId !== 'string' || !attemptId) throw new ApiError('attemptId wajib diisi', 400);

  const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
  if (!attempt) throw new ApiError('Sesi ujian tidak ditemukan', 404);
  if (attempt.userId !== user.userId && !(allowStaff && isStaff(user))) throw new ApiError('Anda tidak memiliki akses', 403);

  const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).limit(1);
  if (!pkg) throw new ApiError('Paket ujian tidak ditemukan', 404);

  return { attempt, pkg };
}

/**
 * Jika waktu attempt yang berjalan sudah habis (melewati toleransi), nilai & tutup sebagai TIMED_OUT.
 * @returns true bila attempt baru saja ditutup
 */
export async function closeIfOverdue(attempt: AttemptRow, pkg: PackageRow): Promise<boolean> {
  if (!isPastDeadline(attempt, pkg.durationMinutes)) return false;
  await finalizeAttempt(attempt.id, pkg, 'TIMED_OUT');
  attempt.status = 'TIMED_OUT';
  return true;
}

export const isActive = (attempt: AttemptRow) => attempt.status === 'IN_PROGRESS' || attempt.status === 'PAUSED';

/** Ringkasan attempt untuk klien; sisa waktu selalu dihitung server. */
export function attemptSummary(attempt: AttemptRow, pkg: PackageRow) {
  return {
    id: attempt.id,
    packageId: attempt.packageId,
    packageTitle: pkg.title,
    packageType: pkg.type,
    durationMinutes: pkg.durationMinutes,
    startedAt: attempt.startedAt,
    status: attempt.status,
    remainingSeconds: isActive(attempt) ? computeRemainingSeconds(attempt, pkg.durationMinutes) : 0,
  };
}
