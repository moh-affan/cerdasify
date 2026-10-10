import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession, hashPassword, safeEqual } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { checkRateLimit, recordFailure, resetLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';

const LOGIN_MAX_FAILURES = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await readJson<{ username?: unknown; password?: unknown }>(req);

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const trimmedUsername = username.trim();

    // Batasi tebak-password: 10 kegagalan per 15 menit per kombinasi IP + username
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const limitKey = `login:${ip}:${trimmedUsername.toLowerCase()}`;
    const limit = checkRateLimit(limitKey, LOGIN_MAX_FAILURES);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil(limit.retryAfterSec / 60)} menit.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }
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
      safeEqual(password, envAdminPassword)
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

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      recordFailure(limitKey, LOGIN_WINDOW_MS);
      return NextResponse.json({ error: 'Username atau password tidak cocok' }, { status: 401 });
    }

    // Status nonaktif baru diungkap setelah password terbukti benar (mencegah enumerasi akun)
    if (!user.isActive) {
      return NextResponse.json({ error: 'Akun Anda dinonaktifkan. Hubungi Super Admin' }, { status: 403 });
    }
    resetLimit(limitKey);

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
  } catch (error) {
    return apiError(error, 'Login error');
  }
}
