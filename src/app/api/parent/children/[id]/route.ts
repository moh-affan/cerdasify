import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { and, eq } from 'drizzle-orm';

// Orang tua mengubah kelas / nama / password akun anaknya.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [child] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, id), eq(users.parentId, user.userId)))
      .limit(1);
    if (!child) {
      return NextResponse.json({ error: 'Akun anak tidak ditemukan' }, { status: 404 });
    }

    const { name, password, gradeLevel } = await readJson<{ name?: unknown; password?: unknown; gradeLevel?: number }>(req);
    const updates: Partial<typeof users.$inferInsert> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 });
      }
      updates.name = name.trim();
    }
    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
      }
      updates.passwordHash = await hashPassword(password);
    }
    if (gradeLevel !== undefined) {
      if (!Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13) {
        return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
      }
      updates.gradeLevel = gradeLevel;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Tidak ada perubahan' }, { status: 400 });
    }

    await db.update(users).set(updates).where(eq(users.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error updating child account');
  }
}
