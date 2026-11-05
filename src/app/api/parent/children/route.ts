import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser, hashPassword, validateUsername } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { eq, sql } from 'drizzle-orm';

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

    if (!cleanName || typeof password !== 'string') {
      return NextResponse.json({ error: 'Nama, username, dan password wajib diisi' }, { status: 400 });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json({ error: usernameValidation.error }, { status: 400 });
    }
    const cleanUsername = usernameValidation.normalized;

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }
    if (gradeLevel !== undefined && gradeLevel !== null && (!Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13)) {
      return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`LOWER(${users.username}) = ${cleanUsername}`)
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const childId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const passwordHash = await hashPassword(password);

    await client.begin(async (sqlClient) => {
      await sqlClient`
        INSERT INTO users (id, username, name, password_hash, role, is_active, is_parent, grade_level, parent_id, token_version)
        VALUES (${childId}, ${cleanUsername}, ${cleanName}, ${passwordHash}, 'USER', true, false, ${gradeLevel ?? null}, ${user.userId}, 1)
      `;
      // Pastikan orang tua memiliki flag is_parent = true
      await sqlClient`
        UPDATE users SET is_parent = true WHERE id = ${user.userId}
      `;
    });

    return NextResponse.json({ success: true, childId });
  } catch (error) {
    return apiError(error, 'Error creating child account');
  }
}
