import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { requireSuperAdmin, hashPassword } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireSuperAdmin();
    const list = db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .all();

    return NextResponse.json({ users: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const body = await req.json();
    const { username, name, password, role = 'USER' } = body;

    if (!username || !name || !password) {
      return NextResponse.json({ error: 'Username, Nama, dan Password wajib diisi' }, { status: 400 });
    }

    const existing = db.select().from(users).where(eq(users.username, username.trim())).get();
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    db.insert(users)
      .values({
        id: userId,
        username: username.trim(),
        name: name.trim(),
        passwordHash,
        role,
        isActive: true,
      })
      .run();

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
