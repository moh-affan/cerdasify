import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { eq } from 'drizzle-orm';

// Mengatur kelas (grade level) milik pengguna yang sedang masuk.
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gradeLevel } = await readJson<{ gradeLevel?: number }>(req);
    if (typeof gradeLevel !== 'number' || !Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13) {
      return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
    }

    await db.update(users).set({ gradeLevel }).where(eq(users.id, user.userId));
    return NextResponse.json({ success: true, gradeLevel });
  } catch (error) {
    return apiError(error, 'Error updating grade level');
  }
}
