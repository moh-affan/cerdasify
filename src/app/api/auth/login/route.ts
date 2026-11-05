import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession, hashPassword, safeEqual, normalizeUsername } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { checkRateLimit, recordFailure, resetLimit } from '@/lib/rate-limit';
import { eq, sql } from 'drizzle-orm';

const LOGIN_MAX_FAILURES = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await readJson<{ username?: unknown; password?: unknown }>(req);

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const cleanUsername = normalizeUsername(username);

    // Batasi tebak-password: 10 kegagalan per 15 menit per kombinasi IP + username
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const limitKey = `login:${ip}:${cleanUsername}`;
    const limit = checkRateLimit(limitKey, LOGIN_MAX_FAILURES);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil(limit.retryAfterSec / 60)} menit.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    // Pencarian case-insensitive agar konsisten antara huruf besar/kecil
    let [user] = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = ${cleanUsername}`)
      .limit(1);

    // Auto-sync mechanism: If environment variables for superadmin are defined in Vercel (.env),
    // and the submitted credentials match DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD,
    // automatically update the database so changes made in environment variables take effect immediately.
    const envAdminUsername = normalizeUsername(process.env.DEFAULT_ADMIN_USERNAME);
    const envAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

    if (
      envAdminUsername &&
      envAdminPassword &&
      cleanUsername === envAdminUsername &&
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
          isParent: false,
          tokenVersion: 1,
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
      parentId: user.parentId,
      isParent: Boolean(user.isParent),
      tokenVersion: user.tokenVersion ?? 1,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        isParent: Boolean(user.isParent),
      },
    });
  } catch (error) {
    return apiError(error, 'Login error');
  }
}
