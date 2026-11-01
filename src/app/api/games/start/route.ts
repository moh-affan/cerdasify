import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { gameSessions, gameSets, vocabMastery } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { checkRateLimit, recordFailure } from '@/lib/rate-limit';
import { jakartaDateString } from '@/lib/learning';
import { newSeed } from '@/lib/games/rng';
import { buildVocabRound, wordKey, type MasteryInfo } from '@/lib/games/vocab';
import { gameLimitStatus, isContentVocabSet, parseConfig, resolveItems, MIN_CONTENT_VOCAB, type SessionState } from '@/lib/games/server';
import type { VocabCard, VocabConfig } from '@/lib/games/types';
import { and, eq, inArray } from 'drizzle-orm';

const START_LIMIT_PER_HOUR = 120;

// Memulai sesi game: membuat seed di server (dan ronde kosakata) agar skor bisa dinilai ulang saat selesai.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const rateKey = `game-start:${user.userId}`;
    const rate = checkRateLimit(rateKey, START_LIMIT_PER_HOUR);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Terlalu sering memulai permainan. Istirahat sebentar, ya!' }, { status: 429 });
    }

    const { slug, context } = await readJson<{ slug?: unknown; context?: unknown }>(req);
    if (typeof slug !== 'string' || !slug) throw new ApiError('slug wajib diisi');

    const [set] = await db.select().from(gameSets).where(eq(gameSets.slug, slug)).limit(1);
    const isStaff = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if (!set || (!set.isPublished && !isStaff)) throw new ApiError('Permainan tidak ditemukan', 404);

    const ctx = isContentVocabSet(set) && typeof context === 'string' ? context : null;
    const items = await resolveItems(set, ctx);
    if (isContentVocabSet(set) && (!Array.isArray(items) || items.length < MIN_CONTENT_VOCAB)) {
      throw new ApiError('Bacaan ini belum punya cukup kosakata bergambar', 404);
    }

    const limit = await gameLimitStatus(user.userId);
    if (limit.remaining !== null && limit.remaining <= 0) {
      throw new ApiError(`Waktu bermain hari ini (${limit.limit} menit) sudah habis. Yuk lanjut membaca!`, 403, { code: 'LIMIT' });
    }

    const seed = newSeed();
    const today = jakartaDateString();
    const state: SessionState = {};

    if (set.engine === 'VOCAB_PICTURE') {
      const deck = items as VocabCard[];
      const keys = deck.map((c) => wordKey(c.word));
      const rows = keys.length
        ? await db
            .select({ wordKey: vocabMastery.wordKey, box: vocabMastery.box, dueDate: vocabMastery.dueDate })
            .from(vocabMastery)
            .where(and(eq(vocabMastery.userId, user.userId), inArray(vocabMastery.wordKey, keys)))
        : [];
      const mastery = new Map<string, MasteryInfo>(rows.map((r) => [r.wordKey, { box: r.box, dueDate: r.dueDate }]));
      state.round = buildVocabRound(seed, deck, parseConfig(set) as VocabConfig, mastery, today);
    }

    const sessionId = `gs_${randomUUID()}`;
    await db.insert(gameSessions).values({
      id: sessionId,
      userId: user.userId,
      gameSetId: set.id,
      seed,
      context: ctx,
      stateJson: Object.keys(state).length ? JSON.stringify(state) : null,
      startedAt: new Date().toISOString(),
      playDate: today,
    });
    recordFailure(rateKey, 60 * 60 * 1000);

    return NextResponse.json({ sessionId, seed, round: state.round ?? null, remainingMinutes: limit.remaining });
  } catch (error) {
    return apiError(error, 'Error starting game');
  }
}
