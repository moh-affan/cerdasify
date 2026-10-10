import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { requireSuperAdmin, hashPassword, isUserRole } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { apiError, readJson } from '@/lib/api';

export async function GET() {
  try {
    await requireSuperAdmin();
    const list = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: list });
  } catch (error) {
    return apiError(error, 'Admin API error');
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const { username, name, password, role = 'USER' } = await readJson<{
      username?: string;
      name?: string;
      password?: string;
      role?: string;
    }>(req);

    if (!username?.trim() || !name?.trim() || !password) {
      return NextResponse.json({ error: 'Username, Nama, dan Password wajib diisi' }, { status: 400 });
    }
    if (!isUserRole(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const [existing] = await db.select().from(users).where(eq(users.username, username.trim())).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await db.insert(users)
      .values({
        id: userId,
        username: username.trim(),
        name: name.trim(),
        passwordHash,
        role,
        isActive: true,
      });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return apiError(error, 'Error creating user');
  }
}
