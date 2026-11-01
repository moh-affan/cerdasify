import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gameProgress, gameSessions, gameSets, vocabMastery } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ApiError, apiError, readJson } from '@/lib/api';
import { jakartaDateString } from '@/lib/learning';
import { gradeLog, parseConfig, parseState, resolveItems } from '@/lib/games/server';
import { isVocabAnswerCorrect, nextMastery, wordKey, type VocabAnswer } from '@/lib/games/vocab';
import type { VocabCard } from '@/lib/games/types';
import { and, eq, inArray, sql } from 'drizzle-orm';

/** Hasil offline boleh dikirim belakangan, maksimal 7 hari setelah sesi dimulai. */
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Menyelesaikan sesi: server memutar ulang log jawaban dengan seed sesi, lalu menyimpan skor & progres.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { sessionId, log, durationMs } = await readJson<{ sessionId?: unknown; log?: unknown; durationMs?: unknown }>(req);
    if (typeof sessionId !== 'string' || !sessionId) throw new ApiError('sessionId wajib diisi');

    const [session] = await db
      .select()
      .from(gameSessions)
      .where(and(eq(gameSessions.id, sessionId), eq(gameSessions.userId, user.userId)))
      .limit(1);
    if (!session) throw new ApiError('Sesi permainan tidak ditemukan', 404);

    if (session.status === 'COMPLETED') {
      // Idempoten: kiriman ulang (mis. antrean offline) mendapat hasil yang sama
      const [progress] = await db
        .select()
        .from(gameProgress)
        .where(and(eq(gameProgress.userId, user.userId), eq(gameProgress.gameSetId, session.gameSetId)))
        .limit(1);
      return NextResponse.json({
        result: { score: session.score, correct: session.correct, total: session.total, stars: session.stars },
        isNewBest: false,
        bestStars: progress?.bestStars ?? session.stars,
        duplicate: true,
      });
    }
    if (session.status !== 'IN_PROGRESS') throw new ApiError('Sesi permainan sudah ditutup', 409);

    const now = Date.now();
    const elapsedMs = now - new Date(session.startedAt).getTime();
    if (elapsedMs > MAX_SESSION_AGE_MS) throw new ApiError('Sesi permainan sudah kedaluwarsa', 410);

    const [set] = await db.select().from(gameSets).where(eq(gameSets.id, session.gameSetId)).limit(1);
    if (!set) throw new ApiError('Permainan tidak ditemukan', 404);

    const items = await resolveItems(set, session.context);
    const state = parseState(session.stateJson);
    const outcome = gradeLog({
      engine: set.engine,
      config: parseConfig(set),
      items,
      seed: session.seed,
      state,
      log,
      elapsedMs,
    });

    const finishedAt = new Date(now).toISOString();
    if (!outcome.ok) {
      await db
        .update(gameSessions)
        .set({ status: 'REJECTED', finishedAt })
        .where(and(eq(gameSessions.id, session.id), eq(gameSessions.status, 'IN_PROGRESS')));
      console.warn(`Game session ${session.id} rejected: ${outcome.reason}`);
      throw new ApiError('Hasil permainan tidak dapat diverifikasi', 422);
    }

    const { result } = outcome;
    const duration = Math.max(0, Math.min(typeof durationMs === 'number' && Number.isFinite(durationMs) ? Math.round(durationMs) : elapsedMs, elapsedMs));

    const { isNewBest, bestStars } = await db.transaction(async (tx) => {
      const updated = await tx
        .update(gameSessions)
        .set({
          status: 'COMPLETED',
          finishedAt,
          score: result.score,
          correct: result.correct,
          total: result.total,
          stars: result.stars,
          durationMs: duration,
        })
        .where(and(eq(gameSessions.id, session.id), eq(gameSessions.status, 'IN_PROGRESS')))
        .returning({ id: gameSessions.id });
      if (!updated.length) throw new ApiError('Sesi permainan sudah diselesaikan', 409);

      const [prev] = await tx
        .select()
        .from(gameProgress)
        .where(and(eq(gameProgress.userId, user.userId), eq(gameProgress.gameSetId, set.id)))
        .limit(1);
      await tx
        .insert(gameProgress)
        .values({
          userId: user.userId,
          gameSetId: set.id,
          bestScore: result.score,
          bestStars: result.stars,
          plays: 1,
          lastPlayedAt: finishedAt,
        })
        .onConflictDoUpdate({
          target: [gameProgress.userId, gameProgress.gameSetId],
          set: {
            bestScore: sql`GREATEST(${gameProgress.bestScore}, ${result.score})`,
            bestStars: sql`GREATEST(${gameProgress.bestStars}, ${result.stars})`,
            plays: sql`${gameProgress.plays} + 1`,
            lastPlayedAt: finishedAt,
          },
        });

      // Kosakata Bergambar: perbarui jadwal hafalan (Leitner) per kata
      if (set.engine === 'VOCAB_PICTURE' && state.round && Array.isArray(log)) {
        const deck = items as VocabCard[];
        const today = jakartaDateString();
        const keys = state.round.map((it) => wordKey(deck[it.idx].word));
        const existing = await tx
          .select()
          .from(vocabMastery)
          .where(and(eq(vocabMastery.userId, user.userId), inArray(vocabMastery.wordKey, keys)));
        const byKey = new Map(existing.map((r) => [r.wordKey, r]));
        for (const [i, item] of state.round.entries()) {
          const key = keys[i];
          const ok = isVocabAnswerCorrect(item, deck, (log as VocabAnswer[])[i] ?? null);
          const prevRow = byKey.get(key);
          const next = nextMastery(prevRow ? { box: prevRow.box, dueDate: prevRow.dueDate } : undefined, ok, today);
          const row = {
            box: next.box,
            dueDate: next.dueDate,
            correctCount: (prevRow?.correctCount ?? 0) + (ok ? 1 : 0),
            wrongCount: (prevRow?.wrongCount ?? 0) + (ok ? 0 : 1),
            lastSeenAt: finishedAt,
          };
          await tx
            .insert(vocabMastery)
            .values({ userId: user.userId, wordKey: key, ...row })
            .onConflictDoUpdate({ target: [vocabMastery.userId, vocabMastery.wordKey], set: row });
        }
      }

      return {
        isNewBest: !prev || result.score > prev.bestScore,
        bestStars: Math.max(prev?.bestStars ?? 0, result.stars),
      };
    });

    return NextResponse.json({ result, review: outcome.review ?? null, isNewBest, bestStars });
  } catch (error) {
    return apiError(error, 'Error finishing game');
  }
}
