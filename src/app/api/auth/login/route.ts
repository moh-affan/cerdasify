import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.username, username.trim())).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Username atau password tidak cocok' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Akun Anda dinonaktifkan. Hubungi Super Admin' }, { status: 403 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Username atau password tidak cocok' }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role as any,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
