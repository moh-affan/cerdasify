// Logika server fitur Bermain: memuat set game, menilai log sesi, batas waktu harian, dan streak gabungan.
// Hanya diimpor dari Server Components / Route Handlers.

import { db } from '@/db';
import { contentVocab, gameSessions, gameSets, learningContents, readingProgress, users } from '@/db/schema';
import { and, asc, eq, isNotNull } from 'drizzle-orm';
import { jakartaDateString } from '@/lib/learning';
import { publicCrossword, gradeCrossword, type CrosswordFill } from './crossword';
import { buildMemoryBoard, replayMemory, type MemoryLogEntry } from './memory';
import { replaySprint, sprintLogPlausible, type SprintLogEntry } from './math-sprint';
import { replayCrossMath, type CrossMathRoundLog } from './crossmath';
import { gradeVocab, type VocabAnswer, type VocabRoundItem } from './vocab';
import {
  balloonResult,
  buildDefenseSchedule,
  buildFallingSchedule,
  buildRunnerSchedule,
  catcherEnd,
  catcherResult,
  defenseEnd,
  defenseResult,
  replayBalloon,
  replayCatcher,
  replayDefense,
  replayRunner,
  runnerEnd,
  runnerResult,
  validAnswerLog,
  validLaneLog,
  validMoveLog,
  type DefenseConfig,
  type FallingConfig,
  type RunnerConfig,
  type TapLog,
} from './arcade';
import type {
  CrossMathConfig,
  CrosswordItems,
  GameConfig,
  GameEngine,
  GameResult,
  MathSprintConfig,
  MemoryConfig,
  PlayableSet,
  VocabCard,
} from './types';

export type GameSetRow = typeof gameSets.$inferSelect;

export const MIN_CONTENT_VOCAB = 4;

export function parseConfig(row: Pick<GameSetRow, 'configJson'>): GameConfig {
  return JSON.parse(row.configJson) as GameConfig;
}

export function parseItems(row: Pick<GameSetRow, 'itemsJson'>): unknown {
  return row.itemsJson ? JSON.parse(row.itemsJson) : null;
}

export const isContentVocabSet = (row: Pick<GameSetRow, 'engine' | 'configJson'>) =>
  row.engine === 'MEMORY_MATCH' && (parseConfig(row) as MemoryConfig).source === 'CONTENT_VOCAB';

/** Kosakata bergambar milik satu bacaan (untuk "Main Kartu Kembar dengan kosakata bacaan ini"). */
export async function loadContentVocabCards(contentSlug: string): Promise<{ title: string; cards: VocabCard[] } | null> {
  const [content] = await db
    .select({ id: learningContents.id, title: learningContents.title, isPublished: learningContents.isPublished })
    .from(learningContents)
    .where(eq(learningContents.slug, contentSlug))
    .limit(1);
  if (!content || !content.isPublished) return null;
  const rows = await db
    .select({ word: contentVocab.word, meaning: contentVocab.meaning, emoji: contentVocab.emoji })
    .from(contentVocab)
    .where(and(eq(contentVocab.contentId, content.id), isNotNull(contentVocab.emoji)))
    .orderBy(asc(contentVocab.orderIndex));
  const seenWord = new Set<string>();
  const seenEmoji = new Set<string>();
  const cards: VocabCard[] = [];
  for (const r of rows) {
    const emoji = r.emoji?.trim();
    if (!emoji) continue;
    const w = r.word.toLowerCase();
    if (seenWord.has(w) || seenEmoji.has(emoji)) continue;
    seenWord.add(w);
    seenEmoji.add(emoji);
    cards.push({ word: r.word, meaning: r.meaning, emoji });
  }
  return { title: content.title, cards };
}

/** Item lengkap (termasuk jawaban) untuk penilaian di server. */
export async function resolveItems(row: GameSetRow, context: string | null): Promise<unknown> {
  if (isContentVocabSet(row)) {
    if (!context) return null;
    return (await loadContentVocabCards(context))?.cards ?? null;
  }
  return parseItems(row);
}

/** Data set yang aman dikirim ke browser. Jawaban TTS Kata tidak ikut dikirim. */
export async function toPlayableSet(row: GameSetRow, context: string | null): Promise<PlayableSet | null> {
  const config = parseConfig(row);
  let items = await resolveItems(row, context);
  if (isContentVocabSet(row)) {
    const cards = items as VocabCard[] | null;
    if (!cards || cards.length < MIN_CONTENT_VOCAB) return null;
    const pairs = Math.min((config as MemoryConfig).pairs, cards.length);
    return {
      id: row.id,
      slug: row.slug,
      engine: row.engine,
      title: row.title,
      description: row.description,
      coverEmoji: row.coverEmoji,
      config: { ...(config as MemoryConfig), pairs },
      items: cards,
      context,
    };
  }
  if (row.engine === 'CROSSWORD') items = publicCrossword(items as CrosswordItems);
  return {
    id: row.id,
    slug: row.slug,
    engine: row.engine,
    title: row.title,
    description: row.description,
    coverEmoji: row.coverEmoji,
    config,
    items,
    context: null,
  };
}

export interface SessionState {
  /** Ronde Kosakata Bergambar yang disusun server */
  round?: VocabRoundItem[];
  /** Jumlah bantuan huruf TTS Kata */
  hints?: number;
}

export function parseState(json: string | null): SessionState {
  try {
    return json ? (JSON.parse(json) as SessionState) : {};
  } catch {
    return {};
  }
}

export type GradeOutcome =
  | { ok: true; result: GameResult; review?: unknown }
  | { ok: false; reason: string };

/**
 * Nilai ulang log sesi di server. Log yang tidak sah/tidak wajar ditolak (status REJECTED).
 * `elapsedMs` = waktu dinding sejak sesi dimulai.
 */
export function gradeLog(params: {
  engine: GameEngine;
  config: GameConfig;
  items: unknown;
  seed: number;
  state: SessionState;
  log: unknown;
  elapsedMs: number;
}): GradeOutcome {
  const { engine, config, items, seed, state, log, elapsedMs } = params;
  switch (engine) {
    case 'MATH_SPRINT': {
      const cfg = config as MathSprintConfig;
      if (!Array.isArray(log) || !log.every((e) => Array.isArray(e) && e.length === 2 && (e[0] === null || Number.isInteger(e[0])) && Number.isFinite(e[1]))) {
        return { ok: false, reason: 'Format log tidak valid' };
      }
      const entries = log as SprintLogEntry[];
      if (!sprintLogPlausible(cfg, entries)) return { ok: false, reason: 'Log tidak wajar' };
      const totalMs = entries.reduce((s, [, ms]) => s + ms, 0);
      if (totalMs > elapsedMs + 5000) return { ok: false, reason: 'Durasi melebihi waktu sesi' };
      const { mistakes, ...result } = replaySprint(seed, cfg, entries);
      return { ok: true, result, review: { mistakes: mistakes.slice(0, 20) } };
    }
    case 'MEMORY_MATCH': {
      if (!Array.isArray(log)) return { ok: false, reason: 'Format log tidak valid' };
      if (!items && (config as MemoryConfig).pairMode !== 'EXPR_RESULT' && (config as MemoryConfig).pairMode !== 'NUMBER_DOTS') {
        return { ok: false, reason: 'Data kartu tidak ditemukan' };
      }
      const cfg = { ...(config as MemoryConfig) };
      if (Array.isArray(items)) cfg.pairs = Math.min(cfg.pairs, items.length);
      const board = buildMemoryBoard(seed, cfg, items);
      const result = replayMemory(board, log as MemoryLogEntry[]);
      if (!result) return { ok: false, reason: 'Urutan kartu tidak sah' };
      if (elapsedMs + 5000 < result.total * 300) return { ok: false, reason: 'Log tidak wajar' };
      return { ok: true, result };
    }
    case 'CROSSMATH': {
      const result = replayCrossMath(seed, config as CrossMathConfig, log as CrossMathRoundLog[]);
      if (!result) return { ok: false, reason: 'Jawaban tidak lengkap atau tidak sah' };
      return { ok: true, result };
    }
    case 'CROSSWORD': {
      if (typeof log !== 'object' || log === null || Array.isArray(log)) return { ok: false, reason: 'Format log tidak valid' };
      const fill = (log as { fill?: unknown }).fill;
      if (typeof fill !== 'object' || fill === null) return { ok: false, reason: 'Format log tidak valid' };
      const result = gradeCrossword((items as CrosswordItems).layout, fill as CrosswordFill, state.hints ?? 0);
      return { ok: true, result };
    }
    // ── Arcade: replay log aksi terhadap jadwal deterministik dari seed ──
    // Selain log harus sah, lama permainan (menurut jadwal) tidak boleh melebihi waktu dinding sesi.
    case 'BALLOON_POP': {
      const cfg = config as FallingConfig;
      if (!Array.isArray(log) || log.length > 500) return { ok: false, reason: 'Format log tidak valid' };
      const schedule = buildFallingSchedule(seed, cfg, 'balloon');
      const st = replayBalloon(schedule, log as TapLog);
      if (!st) return { ok: false, reason: 'Ketukan tidak sesuai jadwal balon' };
      if (schedule.durationMs > elapsedMs + 5000) return { ok: false, reason: 'Durasi melebihi waktu sesi' };
      return { ok: true, result: balloonResult(schedule, st) };
    }
    case 'CATCHER': {
      const cfg = config as FallingConfig;
      if (!validMoveLog(log)) return { ok: false, reason: 'Format log tidak valid' };
      const schedule = buildFallingSchedule(seed, cfg, 'catcher');
      const st = replayCatcher(schedule, log);
      if (catcherEnd(schedule, st) > elapsedMs + 5000) return { ok: false, reason: 'Durasi melebihi waktu sesi' };
      if (log.length && log[log.length - 1][0] > catcherEnd(schedule, st) + 2000) return { ok: false, reason: 'Log melewati akhir permainan' };
      return { ok: true, result: catcherResult(schedule, st) };
    }
    case 'LANE_RUNNER': {
      const cfg = config as RunnerConfig;
      if (!validLaneLog(log)) return { ok: false, reason: 'Format log tidak valid' };
      if (cfg.source === 'VOCAB' && !Array.isArray(items)) return { ok: false, reason: 'Data kosakata tidak ditemukan' };
      const gates = buildRunnerSchedule(seed, cfg, cfg.source === 'VOCAB' ? (items as VocabCard[]) : null);
      const st = replayRunner(gates, cfg, log);
      if (runnerEnd(gates, st) > elapsedMs + 5000) return { ok: false, reason: 'Durasi melebihi waktu sesi' };
      return {
        ok: true,
        result: runnerResult(gates, st),
        review: { mistakes: gates.filter((g) => st.results.get(g.i)?.ok === false).map((g) => ({ question: g.question, answer: g.options[g.correct] })) },
      };
    }
    case 'TOWER_DEFENSE': {
      const cfg = config as DefenseConfig;
      if (!validAnswerLog(log)) return { ok: false, reason: 'Format log tidak valid' };
      const robots = buildDefenseSchedule(seed, cfg);
      const st = replayDefense(robots, cfg, log);
      if (defenseEnd(robots, st) > elapsedMs + 5000) return { ok: false, reason: 'Durasi melebihi waktu sesi' };
      return { ok: true, result: defenseResult(robots, cfg, st) };
    }
    case 'VOCAB_PICTURE': {
      const round = state.round;
      if (!round || !Array.isArray(log) || log.length !== round.length) return { ok: false, reason: 'Jawaban tidak sesuai ronde' };
      const deck = items as VocabCard[];
      const { results, ...result } = gradeVocab(round, deck, log as VocabAnswer[]);
      return { ok: true, result, review: { results } };
    }
  }
}

/** Menit bermain hari ini (sesi selesai) untuk batas waktu dari orang tua. */
export async function minutesPlayedToday(userId: string): Promise<number> {
  const rows = await db
    .select({ durationMs: gameSessions.durationMs })
    .from(gameSessions)
    .where(and(eq(gameSessions.userId, userId), eq(gameSessions.playDate, jakartaDateString()), eq(gameSessions.status, 'COMPLETED')));
  return Math.floor(rows.reduce((s, r) => s + (r.durationMs ?? 0), 0) / 60000);
}

export async function gameLimitStatus(userId: string): Promise<{ limit: number | null; played: number; remaining: number | null }> {
  const [row] = await db.select({ limit: users.dailyGameMinutes }).from(users).where(eq(users.id, userId)).limit(1);
  const limit = row?.limit ?? null;
  const played = limit ? await minutesPlayedToday(userId) : 0;
  return { limit, played, remaining: limit ? Math.max(0, limit - played) : null };
}

/** Tanggal aktif belajar (membaca ATAU bermain) untuk streak gabungan. */
export async function activityDates(userId: string): Promise<string[]> {
  const [reads, plays] = await Promise.all([
    db.select({ d: readingProgress.readDate }).from(readingProgress).where(eq(readingProgress.userId, userId)),
    db
      .selectDistinct({ d: gameSessions.playDate })
      .from(gameSessions)
      .where(and(eq(gameSessions.userId, userId), eq(gameSessions.status, 'COMPLETED'))),
  ]);
  return [...new Set([...reads.map((r) => r.d), ...plays.map((p) => p.d)])];
}
