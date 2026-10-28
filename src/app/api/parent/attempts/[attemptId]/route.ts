import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, users } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError } from '@/lib/api';
import { and, eq, isNotNull } from 'drizzle-orm';

// Orang tua meninjau hasil ujian yang dibuang anaknya ke sampah:
// DELETE = setujui (hapus permanen), PATCH = tolak (pulihkan). Hanya untuk anak milik orang tua ini.
async function loadTrashedChildAttempt(attemptId: string, parentUserId: string) {
  const [row] = await db
    .select({ id: attempts.id })
    .from(attempts)
    .innerJoin(users, eq(attempts.userId, users.id))
    .where(and(eq(attempts.id, attemptId), eq(users.parentId, parentUserId), isNotNull(attempts.deletedAt)))
    .limit(1);
  if (!row) throw new ApiError('Hasil ujian di sampah tidak ditemukan', 404);
  return row;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const user = await requireUser();
    const { attemptId } = await params;
    const row = await loadTrashedChildAttempt(attemptId, user.userId);

    await db.delete(attempts).where(eq(attempts.id, row.id));
    console.info('Attempt anak dihapus permanen oleh orang tua:', { attemptId: row.id, by: user.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error confirming child attempt deletion');
  }
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const user = await requireUser();
    const { attemptId } = await params;
    const row = await loadTrashedChildAttempt(attemptId, user.userId);

    await db.update(attempts).set({ deletedAt: null }).where(eq(attempts.id, row.id));
    console.info('Attempt anak dipulihkan oleh orang tua:', { attemptId: row.id, by: user.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error restoring child attempt');
  }
}
