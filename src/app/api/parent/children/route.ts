import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { eq } from 'drizzle-orm';

const USERNAME_RE = /^[a-z0-9_.]{3,30}$/;

// Orang tua membuat akun anak (role USER, parent_id = orang tua).
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [me] = await db.select({ parentId: users.parentId }).from(users).where(eq(users.id, user.userId)).limit(1);
    if (me?.parentId) {
      return NextResponse.json({ error: 'Akun anak tidak dapat membuat akun anak lain' }, { status: 403 });
    }

    const { name, username, password, gradeLevel } = await readJson<{
      name?: unknown;
      username?: unknown;
      password?: unknown;
      gradeLevel?: number | null;
    }>(req);
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanUsername = typeof username === 'string' ? username.trim().toLowerCase() : '';

    if (!cleanName || !cleanUsername || typeof password !== 'string') {
      return NextResponse.json({ error: 'Nama, username, dan password wajib diisi' }, { status: 400 });
    }
    if (!USERNAME_RE.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username 3–30 karakter: huruf kecil, angka, titik, atau garis bawah' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }
    if (gradeLevel !== undefined && gradeLevel !== null && (!Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13)) {
      return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
    }

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, cleanUsername)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const childId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(users).values({
      id: childId,
      username: cleanUsername,
      name: cleanName,
      passwordHash: await hashPassword(password),
      role: 'USER',
      isActive: true,
      gradeLevel: gradeLevel ?? null,
      parentId: user.userId,
    });

    return NextResponse.json({ success: true, childId });
  } catch (error) {
    return apiError(error, 'Error creating child account');
  }
}
