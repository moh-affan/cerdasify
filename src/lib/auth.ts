import crypto from 'crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COOKIE_NAME = 'cerdasify_session';
const DEV_FALLBACK_SECRET = 'cerdasify-dev-only-secret-do-not-use-in-production';

/** Secret penandatangan sesi. Wajib diset (≥ 32 karakter) di produksi agar sesi tidak bisa dipalsukan. */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET wajib diisi minimal 32 karakter pada environment produksi.');
  }
  return DEV_FALLBACK_SECRET;
}

export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const isUserRole = (v: unknown): v is UserRole => typeof v === 'string' && (USER_ROLES as readonly string[]).includes(v);

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  expiresAt: number;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Perbandingan string yang tidak bocor lewat waktu eksekusi (untuk rahasia dari environment). */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function signPayload(payloadString: string): string {
  const hmac = crypto.createHmac('sha256', getSessionSecret());
  hmac.update(payloadString);
  return hmac.digest('base64url');
}

export function createToken(payload: Omit<SessionPayload, 'expiresAt'>, maxAgeDays = 7): string {
  const expiresAt = Date.now() + maxAgeDays * 24 * 60 * 60 * 1000;
  const fullPayload: SessionPayload = { ...payload, expiresAt };
  const jsonStr = JSON.stringify(fullPayload);
  const base64Data = Buffer.from(jsonStr).toString('base64url');
  const signature = signPayload(base64Data);
  return `${base64Data}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    const expectedSignature = signPayload(base64Data);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr) as SessionPayload;

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
  const token = createToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie?.value) return null;

  const session = verifyToken(tokenCookie.value);
  if (!session) return null;

  // Verify user is still active in database
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || !user.isActive) return null;

  return {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    expiresAt: session.expiresAt,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
