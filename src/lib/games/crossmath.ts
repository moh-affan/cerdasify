// Silang Angka: 9 angka di grid 3×3 membentuk 3 persamaan mendatar dan 3 menurun.
//
//   c0 r0 c1 = c2        indeks sel:  0 1 2
//   r?    r?    r?                    3 4 5
//   c3 r1 c4 = c5                     6 7 8
//   =     =     =
//   c6 r2 c7 = c8
//
// Baris r: cells[3r] rowOps[r] cells[3r+1] = cells[3r+2]
// Kolom c: cells[c]  colOps[c] cells[3+c]  = cells[6+c]
// Jawaban dinilai dari kebenaran SEMUA persamaan (solusi alternatif yang sah tetap diterima).

import { rngFor, randInt, pick, shuffle, type Rng } from './rng';
import type { CrossMathConfig, GameResult, Op } from './types';

export type CrossOp = '+' | '-' | '×' | '÷';

export interface CrossMathPuzzle {
  cells: number[];
  rowOps: CrossOp[];
  colOps: CrossOp[];
  hidden: number[];
  /** Angka yang tersedia di bank (nilai sel tersembunyi, diacak) */
  bank: number[];
}

/** Isian pemain per puzzle: indeks sel → angka */
export type CrossMathAnswer = Record<string, number>;

export interface CrossMathRoundLog {
  /** Setiap kali menekan "Cek" */
  attempts: CrossMathAnswer[];
}

export const ROW_EQ = [0, 1, 2].map((r) => [3 * r, 3 * r + 1, 3 * r + 2]);
export const COL_EQ = [0, 1, 2].map((c) => [c, 3 + c, 6 + c]);

export function applyOp(a: number, op: CrossOp, b: number): number | null {
  let v: number;
  switch (op) {
    case '+':
      v = a + b;
      break;
    case '-':
      v = a - b;
      break;
    case '×':
      v = a * b;
      break;
    case '÷':
      if (b === 0 || a % b !== 0) return null;
      v = a / b;
      break;
  }
  return v === 0 ? 0 : v; // hindari -0
}

const crossOps = (ops: Op[]): CrossOp[] => {
  const list = ops.filter((o): o is CrossOp => o === '+' || o === '-' || o === '×' || o === '÷');
  return list.length ? list : ['+'];
};

function inRange(v: number | null, cfg: CrossMathConfig): v is number {
  if (v === null || !Number.isInteger(v)) return false;
  const lo = cfg.allowNegative ? -cfg.max : 0;
  return v >= lo && v <= cfg.max;
}

function operand(rng: Rng, cfg: CrossMathConfig, ops: CrossOp[]): number {
  const hasMul = ops.includes('×') || ops.includes('÷');
  const hi = hasMul ? Math.max(3, Math.min(cfg.max, Math.round(Math.sqrt(cfg.max)) + 3)) : Math.max(2, Math.floor(cfg.max / 2));
  const lo = cfg.allowNegative ? -hi : hasMul ? 2 : 1;
  let v = randInt(rng, lo, hi);
  // Hindari operand 0 / ±1 yang membuat persamaan terlalu sepele
  if (Math.abs(v) <= 1) v = v < 0 ? -2 : 2;
  return v;
}

function tryGenerate(rng: Rng, cfg: CrossMathConfig, ops: CrossOp[]): Omit<CrossMathPuzzle, 'hidden' | 'bank'> | null {
  const [a, b, d, e] = [0, 0, 0, 0].map(() => operand(rng, cfg, ops));
  const r0 = pick(rng, ops);
  const r1 = pick(rng, ops);
  const c0 = pick(rng, ops);
  const c1 = pick(rng, ops);
  const c = applyOp(a, r0, b);
  const f = applyOp(d, r1, e);
  const g = applyOp(a, c0, d);
  const h = applyOp(b, c1, e);
  if (![c, f, g, h].every((v) => inRange(v, cfg))) return null;
  const options: [CrossOp, CrossOp, number][] = [];
  for (const r2 of ops) {
    for (const c2 of ops) {
      const viaRow = applyOp(g!, r2, h!);
      const viaCol = applyOp(c!, c2, f!);
      if (viaRow !== null && viaRow === viaCol && inRange(viaRow, cfg)) options.push([r2, c2, viaRow]);
    }
  }
  if (!options.length) return null;
  const [r2, c2, i] = pick(rng, options);
  return { cells: [a, b, c!, d, e, f!, g!, h!, i], rowOps: [r0, r1, r2], colOps: [c0, c1, c2] };
}

/** Puzzle ke-`round` dalam satu sesi. */
export function generateCrossMath(seed: number, round: number, cfg: CrossMathConfig): CrossMathPuzzle {
  const rng = rngFor(seed, 'crossmath', round);
  const ops = crossOps(cfg.ops);
  // Kumpulkan beberapa kandidat sah, utamakan yang operasinya paling beragam
  // (kombinasi dengan × / ÷ lebih sering gagal batas, sehingga tanpa ini puzzle didominasi "+")
  let base: Omit<CrossMathPuzzle, 'hidden' | 'bank'> | null = null;
  let bestVariety = -1;
  let found = 0;
  for (let i = 0; i < 4000 && found < 30; i++) {
    const candidate = tryGenerate(rng, cfg, ops);
    if (!candidate) continue;
    found++;
    const all = [...candidate.rowOps, ...candidate.colOps];
    const variety = new Set(all).size * 10 + all.filter((o) => o !== '+').length + rng();
    if (variety > bestVariety) {
      base = candidate;
      bestVariety = variety;
    }
  }
  if (!base) {
    // Cadangan pasti valid: semua operasi penjumlahan dengan angka kecil
    const [a, b, d, e] = [1, 2, 2, 1].map((x) => x + randInt(rng, 0, 2));
    base = { cells: [a, b, a + b, d, e, d + e, a + d, b + e, a + b + d + e], rowOps: ['+', '+', '+'], colOps: ['+', '+', '+'] };
  }

  // Pilih sel tersembunyi; tidak ada persamaan yang ketiga selnya kosong semua
  const want = Math.max(1, Math.min(cfg.hidden, 6));
  let hidden: number[] = [];
  for (let i = 0; i < 200; i++) {
    const candidate = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, want).sort((x, y) => x - y);
    const set = new Set(candidate);
    if ([...ROW_EQ, ...COL_EQ].every((eq) => eq.some((cell) => !set.has(cell)))) {
      hidden = candidate;
      break;
    }
  }
  if (!hidden.length) hidden = [1, 5, 6].slice(0, want);
  const bank = shuffle(rng, hidden.map((idx) => base!.cells[idx]));
  return { ...base, hidden, bank };
}

export interface CrossMathCheck {
  complete: boolean;
  ok: boolean;
  badRows: number[];
  badCols: number[];
}

export function checkCrossMath(p: CrossMathPuzzle, answer: CrossMathAnswer): CrossMathCheck {
  const values = p.cells.map((v, idx) => (p.hidden.includes(idx) ? answer[String(idx)] : v));
  const complete = values.every((v) => typeof v === 'number' && Number.isInteger(v) && Math.abs(v) <= 100000);
  const evalEq = (cells: number[], op: CrossOp) => {
    const [x, y, z] = cells.map((idx) => values[idx]);
    if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') return false;
    return applyOp(x, op, y) === z;
  };
  const badRows = ROW_EQ.map((eq, r) => (evalEq(eq, p.rowOps[r]) ? -1 : r)).filter((r) => r >= 0);
  const badCols = COL_EQ.map((eq, c) => (evalEq(eq, p.colOps[c]) ? -1 : c)).filter((c) => c >= 0);
  return { complete, ok: complete && !badRows.length && !badCols.length, badRows, badCols };
}

/**
 * Skor sesi: per puzzle yang selesai benar → 100 − 25 × (cek gagal), minimal 25.
 * Bintang: rata-rata cek gagal per puzzle (0 → ★★★, ≤ 1 → ★★, selain itu ★).
 */
export function replayCrossMath(seed: number, cfg: CrossMathConfig, rounds: CrossMathRoundLog[]): GameResult | null {
  if (!Array.isArray(rounds) || rounds.length !== cfg.rounds) return null;
  let score = 0;
  let solved = 0;
  let failedChecks = 0;
  for (let r = 0; r < rounds.length; r++) {
    const attempts = rounds[r]?.attempts;
    if (!Array.isArray(attempts) || attempts.length === 0 || attempts.length > 50) return null;
    const puzzle = generateCrossMath(seed, r, cfg);
    const results = attempts.map((a) => checkCrossMath(puzzle, a ?? {}));
    if (!results[results.length - 1].ok) return null;
    const failed = results.slice(0, -1).filter((x) => !x.ok).length;
    failedChecks += failed;
    solved++;
    score += Math.max(25, 100 - 25 * failed);
  }
  const avg = failedChecks / Math.max(1, solved);
  return { score, correct: solved, total: cfg.rounds, stars: avg === 0 ? 3 : avg <= 1 ? 2 : 1 };
}
