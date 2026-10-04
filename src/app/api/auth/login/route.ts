import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession, hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const trimmedUsername = username.trim();
    let [user] = await db.select().from(users).where(eq(users.username, trimmedUsername)).limit(1);

    // Auto-sync mechanism: If environment variables for superadmin are defined in Vercel (.env),
    // and the submitted credentials match DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD,
    // automatically update the database so changes made in environment variables take effect immediately.
    const envAdminUsername = process.env.DEFAULT_ADMIN_USERNAME?.trim();
    const envAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

    if (
      envAdminUsername &&
      envAdminPassword &&
      trimmedUsername === envAdminUsername &&
      password === envAdminPassword
    ) {
      const newHash = await hashPassword(envAdminPassword);

      // Search by fixed ID 'usr_superadmin' or by role 'SUPER_ADMIN'
      let [superAdminRecord] = await db.select().from(users).where(eq(users.id, 'usr_superadmin')).limit(1);
      if (!superAdminRecord) {
        const [byRole] = await db.select().from(users).where(eq(users.role, 'SUPER_ADMIN')).limit(1);
        superAdminRecord = byRole;
      }

      if (superAdminRecord) {
        await db
          .update(users)
          .set({
            username: envAdminUsername,
            passwordHash: newHash,
            isActive: true,
          })
          .where(eq(users.id, superAdminRecord.id));

        user = {
          ...superAdminRecord,
          username: envAdminUsername,
          passwordHash: newHash,
          isActive: true,
        };
      } else {
        const newRecord = {
          id: 'usr_superadmin',
          username: envAdminUsername,
          name: 'Super Administrator',
          passwordHash: newHash,
          role: 'SUPER_ADMIN' as const,
          isActive: true,
        };
        await db.insert(users).values(newRecord);
        user = newRecord as typeof users.$inferSelect;
      }
    }

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
      role: user.role as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
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
  } catch (error: unknown) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
