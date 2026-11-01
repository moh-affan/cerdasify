// Kartu Kembar: papan dibuat deterministik dari seed + data set. Log = urutan pasangan kartu yang dibuka.

import { rngFor, randInt, pick, shuffle } from './rng';
import type { CustomPair, GameResult, MemoryConfig, Op, VocabCard } from './types';

export interface MemoryCard {
  pair: number;
  /** 0 = sisi pertama (kata / soal), 1 = sisi kedua (gambar / arti / hasil) */
  side: 0 | 1;
  label: string;
  kind: 'word' | 'emoji' | 'text' | 'expr' | 'num' | 'dots';
  /** Teks yang diucapkan TTS saat kartu dibuka */
  speak?: string;
}

export type MemoryLogEntry = [first: number, second: number];

export const MEMORY_DOT_EMOJI = ['🍎', '⭐', '🐟', '🌸', '🎈', '🍪', '🐞', '⚽', '🍓', '🦋'];

function uniqueBy<T>(items: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((t) => {
    const k = key(t);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function exprPairs(seed: number, count: number, ops: Op[], max: number): [string, number][] {
  const rng = rngFor(seed, 'memory-expr');
  const out: [string, number][] = [];
  const used = new Set<number>();
  for (let tries = 0; out.length < count && tries < 500; tries++) {
    const op = pick(rng, ops.length ? ops : (['+'] as Op[]));
    let text = '';
    let value = 0;
    if (op === '+') {
      const a = randInt(rng, 1, max - 1);
      const b = randInt(rng, 1, max - a);
      text = `${a} + ${b}`;
      value = a + b;
    } else if (op === '-') {
      const a = randInt(rng, 2, max);
      const b = randInt(rng, 1, a - 1);
      text = `${a} − ${b}`;
      value = a - b;
    } else if (op === '×') {
      const f = Math.max(2, Math.floor(Math.sqrt(max)) + 2);
      const a = randInt(rng, 2, f);
      const b = randInt(rng, 2, f);
      text = `${a} × ${b}`;
      value = a * b;
    } else {
      const b = randInt(rng, 2, 9);
      const q = randInt(rng, 1, 9);
      text = `${b * q} ÷ ${b}`;
      value = q;
    }
    if (used.has(value)) continue;
    used.add(value);
    out.push([text, value]);
  }
  return out;
}

/** Susun papan. `items` = VocabCard[] untuk mode kata, CustomPair[] untuk CUSTOM. */
export function buildMemoryBoard(seed: number, cfg: MemoryConfig, items: unknown): MemoryCard[] {
  const rng = rngFor(seed, 'memory-board');
  const cards: MemoryCard[] = [];
  const pairs = Math.max(2, Math.min(cfg.pairs, 12));

  if (cfg.pairMode === 'WORD_EMOJI' || cfg.pairMode === 'WORD_MEANING') {
    const pool = uniqueBy(
      uniqueBy((items as VocabCard[]) ?? [], (v) => v.word.toLowerCase()),
      (v) => (cfg.pairMode === 'WORD_EMOJI' ? v.emoji : v.meaning.toLowerCase())
    );
    shuffle(rng, pool)
      .slice(0, pairs)
      .forEach((v, i) => {
        cards.push({ pair: i, side: 0, label: v.word, kind: 'word', speak: cfg.speak ? v.word : undefined });
        cards.push(
          cfg.pairMode === 'WORD_EMOJI'
            ? { pair: i, side: 1, label: v.emoji, kind: 'emoji', speak: cfg.speak ? v.word : undefined }
            : { pair: i, side: 1, label: v.meaning, kind: 'text' }
        );
      });
  } else if (cfg.pairMode === 'CUSTOM') {
    shuffle(rng, (items as CustomPair[]) ?? [])
      .slice(0, pairs)
      .forEach((p, i) => {
        cards.push({ pair: i, side: 0, label: p.a, kind: 'text' });
        cards.push({ pair: i, side: 1, label: p.b, kind: /^\p{Extended_Pictographic}/u.test(p.b) ? 'emoji' : 'text' });
      });
  } else if (cfg.pairMode === 'EXPR_RESULT') {
    exprPairs(seed, pairs, cfg.ops ?? ['+'], cfg.max ?? 10).forEach(([text, value], i) => {
      cards.push({ pair: i, side: 0, label: text, kind: 'expr' });
      cards.push({ pair: i, side: 1, label: String(value), kind: 'num' });
    });
  } else {
    const max = Math.min(10, Math.max(pairs, cfg.max ?? 10));
    const numbers = shuffle(
      rng,
      Array.from({ length: max }, (_, i) => i + 1)
    ).slice(0, pairs);
    numbers.forEach((n, i) => {
      cards.push({ pair: i, side: 0, label: String(n), kind: 'num' });
      cards.push({ pair: i, side: 1, label: pick(rng, MEMORY_DOT_EMOJI).repeat(n), kind: 'dots' });
    });
  }
  return shuffle(rng, cards);
}

export function memoryStars(moves: number, pairs: number): number {
  if (pairs <= 0) return 0;
  const ratio = moves / pairs;
  if (ratio <= 1.5) return 3;
  if (ratio <= 2.2) return 2;
  return 1;
}

/** Putar ulang log. Mengembalikan null bila log tidak sah (indeks salah / papan belum tuntas). */
export function replayMemory(board: MemoryCard[], log: MemoryLogEntry[]): GameResult | null {
  const pairs = board.length / 2;
  const matched = new Set<number>();
  for (const entry of log) {
    if (!Array.isArray(entry) || entry.length !== 2) return null;
    const [a, b] = entry;
    if (!Number.isInteger(a) || !Number.isInteger(b) || a === b) return null;
    if (a < 0 || b < 0 || a >= board.length || b >= board.length) return null;
    if (matched.has(a) || matched.has(b)) return null;
    if (board[a].pair === board[b].pair) {
      matched.add(a);
      matched.add(b);
    }
  }
  if (matched.size !== board.length) return null;
  const moves = log.length;
  return {
    score: Math.round((1000 * pairs) / Math.max(moves, pairs)),
    correct: pairs,
    total: moves,
    stars: memoryStars(moves, pairs),
  };
}
