// Kilat Hitung: soal dibuat prosedural dari (seed, nomor soal, level). Level naik/turun adaptif
// berdasarkan jawaban, sehingga server bisa memutar ulang log dan mendapatkan deret soal yang sama.

import { rngFor, randInt, pick, type Rng } from './rng';
import type { GameResult, MathSprintConfig, Op } from './types';

export const SPRINT_MAX_LEVEL = 5;

export interface SprintProblem {
  text: string;
  answer: number;
  /** CMP = jawab dengan tombol <, =, > (nilai −1, 0, 1) */
  kind: 'NUM' | 'CMP';
}

/** [jawaban (null = lewati), lama menjawab dalam ms] */
export type SprintLogEntry = [answer: number | null, ms: number];

export interface SprintState {
  level: number;
  rightStreak: number;
  wrongStreak: number;
}

export const initialSprintState = (): SprintState => ({ level: 1, rightStreak: 0, wrongStreak: 0 });

/** Aturan adaptif: 3 benar beruntun → naik level, 2 salah beruntun → turun level. */
export function sprintStep(state: SprintState, ok: boolean): SprintState {
  if (ok) {
    const rightStreak = state.rightStreak + 1;
    if (rightStreak >= 3 && state.level < SPRINT_MAX_LEVEL) return { level: state.level + 1, rightStreak: 0, wrongStreak: 0 };
    return { ...state, rightStreak, wrongStreak: 0 };
  }
  const wrongStreak = state.wrongStreak + 1;
  if (wrongStreak >= 2 && state.level > 1) return { level: state.level - 1, rightStreak: 0, wrongStreak: 0 };
  return { ...state, rightStreak: 0, wrongStreak };
}

const scale = (lo: number, hi: number, level: number) =>
  Math.round(lo + ((hi - lo) * (Math.min(level, SPRINT_MAX_LEVEL) - 1)) / (SPRINT_MAX_LEVEL - 1));

const fmt = (n: number) => (n < 0 ? `(${n})` : String(n));

function arith(rng: Rng, op: Op, cfg: MathSprintConfig, level: number): SprintProblem {
  const hi = Math.max(2, scale(cfg.max, cfg.maxCap, level));
  const fhi = Math.max(2, scale(cfg.factorMax ?? 10, cfg.factorCap ?? cfg.factorMax ?? 10, level));
  switch (op) {
    case '+': {
      if (cfg.allowNegative) {
        const a = randInt(rng, -hi, hi);
        const b = randInt(rng, -hi, hi);
        return { text: `${fmt(a)} + ${fmt(b)}`, answer: a + b, kind: 'NUM' };
      }
      const a = randInt(rng, 1, hi - 1);
      const b = randInt(rng, 1, hi - a);
      return { text: `${a} + ${b}`, answer: a + b, kind: 'NUM' };
    }
    case '-': {
      if (cfg.allowNegative) {
        const a = randInt(rng, -hi, hi);
        const b = randInt(rng, -hi, hi);
        return { text: `${fmt(a)} − ${fmt(b)}`, answer: a - b, kind: 'NUM' };
      }
      const a = randInt(rng, 2, hi);
      const b = randInt(rng, 1, a);
      return { text: `${a} − ${b}`, answer: a - b, kind: 'NUM' };
    }
    case '×': {
      const a = randInt(rng, 2, fhi);
      const b = randInt(rng, 2, fhi);
      if (cfg.allowNegative && rng() < 0.4) return { text: `${fmt(-a)} × ${b}`, answer: -a * b, kind: 'NUM' };
      return { text: `${a} × ${b}`, answer: a * b, kind: 'NUM' };
    }
    case '÷': {
      const b = randInt(rng, 2, fhi);
      const q = randInt(rng, 1, fhi);
      return { text: `${b * q} ÷ ${b}`, answer: q, kind: 'NUM' };
    }
    case '²': {
      const a = randInt(rng, 2, Math.max(3, fhi + 2));
      return { text: `${a}²`, answer: a * a, kind: 'NUM' };
    }
    case '√': {
      const a = randInt(rng, 2, Math.max(3, fhi + 2));
      return { text: `√${a * a}`, answer: a, kind: 'NUM' };
    }
  }
}

function tiu(rng: Rng, level: number): SprintProblem {
  const kind = randInt(rng, 0, level >= 3 ? 3 : 2);
  if (kind === 0) {
    // Persen dari bilangan, hasil selalu bulat
    const p = pick(rng, level >= 3 ? [5, 10, 15, 20, 25, 30, 40, 60, 75, 80, 120, 150] : [10, 20, 25, 50, 75]);
    const unit = 100 / gcd(p, 100);
    const base = unit * randInt(rng, 1, Math.max(2, Math.floor((level >= 3 ? 400 : 200) / unit)));
    return { text: `${p}% dari ${base}`, answer: (p * base) / 100, kind: 'NUM' };
  }
  if (kind === 1) {
    // Pecahan dari bilangan
    const [n, d] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [3, 8], [5, 6], [4, 9]] as const);
    const base = d * randInt(rng, 2, 6 + level * 3);
    return { text: `${n}/${d} × ${base}`, answer: (n * base) / d, kind: 'NUM' };
  }
  if (kind === 2) {
    const a = randInt(rng, 11, 9 + level * 6);
    const b = randInt(rng, 3, 9 + level * 2);
    return { text: `${a} × ${b}`, answer: a * b, kind: 'NUM' };
  }
  // Bentuk desimal sederhana: 0,5 × 48
  const [dec, mul] = pick(rng, [['0,5', 0.5], ['0,25', 0.25], ['1,5', 1.5], ['0,2', 0.2], ['2,5', 2.5]] as const);
  const step = mul === 0.25 ? 4 : mul === 0.2 ? 5 : 2;
  const base = step * randInt(rng, 2, 25);
  return { text: `${dec} × ${base}`, answer: mul * base, kind: 'NUM' };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function sprintProblem(seed: number, index: number, level: number, cfg: MathSprintConfig): SprintProblem {
  const rng = rngFor(seed, 'sprint', index, level);
  const hi = Math.max(2, scale(cfg.max, cfg.maxCap, level));
  switch (cfg.mode) {
    case 'MAKE_TARGET': {
      const t = cfg.target ?? 10;
      const a = randInt(rng, 1, t - 1);
      return { text: `${a} + ? = ${t}`, answer: t - a, kind: 'NUM' };
    }
    case 'COMPARE': {
      const b = randInt(rng, 0, hi);
      let leftText: string;
      let left: number;
      if (level >= 3 && rng() < 0.6) {
        const x = randInt(rng, 0, Math.max(1, b));
        const y = randInt(rng, 0, Math.max(1, hi - x));
        leftText = `${x} + ${y}`;
        left = x + y;
      } else {
        left = rng() < 0.2 ? b : randInt(rng, 0, hi);
        leftText = String(left);
      }
      return { text: `${leftText}  ▢  ${b}`, answer: Math.sign(left - b), kind: 'CMP' };
    }
    case 'TIU':
      return tiu(rng, level);
    default:
      return arith(rng, pick(rng, cfg.ops.length ? cfg.ops : (['+'] as Op[])), cfg, level);
  }
}

export function sprintStars(correct: number, total: number, cfg: MathSprintConfig): number {
  const accuracy = total > 0 ? correct / total : 0;
  if (correct >= cfg.stars[2] && accuracy >= 0.8) return 3;
  if (correct >= cfg.stars[1]) return 2;
  if (correct >= cfg.stars[0]) return 1;
  return 0;
}

/** Putar ulang log (dipakai server). Skor = jumlah level soal yang dijawab benar × 10. */
export function replaySprint(seed: number, cfg: MathSprintConfig, log: SprintLogEntry[]): GameResult & { mistakes: { text: string; answer: number; given: number | null }[] } {
  let state = initialSprintState();
  let correct = 0;
  let score = 0;
  const mistakes: { text: string; answer: number; given: number | null }[] = [];
  log.forEach(([given], i) => {
    const p = sprintProblem(seed, i, state.level, cfg);
    const ok = given === p.answer;
    if (ok) {
      correct++;
      score += state.level * 10;
    } else {
      mistakes.push({ text: p.text, answer: p.answer, given });
    }
    state = sprintStep(state, ok);
  });
  return { score, correct, total: log.length, stars: sprintStars(correct, log.length, cfg), mistakes };
}

/** Pemeriksaan kewajaran waktu: total waktu tidak melebihi durasi dan tidak ada "jawaban kilat" beruntun. */
export function sprintLogPlausible(cfg: MathSprintConfig, log: SprintLogEntry[]): boolean {
  if (log.length > cfg.durationSec * 5) return false;
  const total = log.reduce((s, [, ms]) => s + Math.max(0, ms), 0);
  if (total > (cfg.durationSec + 5) * 1000) return false;
  const tooFast = log.filter(([, ms]) => ms < 250).length;
  return tooFast <= Math.max(2, log.length * 0.2);
}
