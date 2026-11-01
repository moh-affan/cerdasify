import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gameSessions, gameSets } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { checkRateLimit, recordFailure } from '@/lib/rate-limit';
import { checkCrossword, solutionLetter, type CrosswordFill } from '@/lib/games/crossword';
import { parseItems, parseState } from '@/lib/games/server';
import type { CrosswordItems } from '@/lib/games/types';
import { and, eq } from 'drizzle-orm';

// TTS Kata: jawaban tidak pernah dikirim utuh ke browser. "check" hanya memberi tahu kata mana yang sudah benar;
// "hint" membuka satu huruf dan (untuk pengguna masuk) dicatat di sesi sehingga mengurangi bintang.
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rateKey = `crossword:${user?.userId ?? ip}`;
    if (!checkRateLimit(rateKey, 600).allowed) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 });
    }
    recordFailure(rateKey, 60 * 60 * 1000);

    const body = await readJson<{ slug?: unknown; action?: unknown; fill?: unknown; row?: unknown; col?: unknown; sessionId?: unknown }>(req);
    if (typeof body.slug !== 'string') throw new ApiError('slug wajib diisi');

    const [set] = await db.select().from(gameSets).where(eq(gameSets.slug, body.slug)).limit(1);
    const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    if (!set || set.engine !== 'CROSSWORD' || (!set.isPublished && !isStaff)) throw new ApiError('Permainan tidak ditemukan', 404);
    const { layout } = parseItems(set) as CrosswordItems;

    if (body.action === 'check') {
      if (typeof body.fill !== 'object' || body.fill === null) throw new ApiError('fill wajib diisi');
      return NextResponse.json({ correct: checkCrossword(layout, body.fill as CrosswordFill) });
    }

    if (body.action === 'hint') {
      const row = Number(body.row);
      const col = Number(body.col);
      const letter = Number.isInteger(row) && Number.isInteger(col) ? solutionLetter(layout, row, col) : null;
      if (!letter) throw new ApiError('Kotak tidak valid');

      let hints: number | null = null;
      if (user && typeof body.sessionId === 'string') {
        hints = await db.transaction(async (tx) => {
          const [session] = await tx
            .select()
            .from(gameSessions)
            .where(
              and(
                eq(gameSessions.id, body.sessionId as string),
                eq(gameSessions.userId, user.userId),
                eq(gameSessions.gameSetId, set.id),
                eq(gameSessions.status, 'IN_PROGRESS')
              )
            )
            .for('update')
            .limit(1);
          if (!session) return null;
          const state = parseState(session.stateJson);
          state.hints = (state.hints ?? 0) + 1;
          await tx.update(gameSessions).set({ stateJson: JSON.stringify(state) }).where(eq(gameSessions.id, session.id));
          return state.hints;
        });
      }
      return NextResponse.json({ letter, hints });
    }

    throw new ApiError('action harus check atau hint');
  } catch (error) {
    return apiError(error, 'Error crossword action');
  }
}
