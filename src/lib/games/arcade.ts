// Game arcade: Balon Hitung, Tangkap Benda, Lari Jawaban, Jaga Benteng.
//
// Prinsip: semua benda (balon, benda jatuh, gerbang, robot) dijadwalkan DETERMINISTIK dari seed —
// waktu muncul, posisi, isi, dan benar/salahnya tidak bergantung pada aksi pemain. Log hanya berisi aksi
// pemain bercap waktu permainan (ms, tanpa jeda). Tampilan klien dan penilaian server memakai fungsi
// replay yang sama, sehingga hasilnya selalu identik dan skor tidak pernah dipercaya dari klien.

import { rngFor, randInt, pick, shuffle, type Rng } from './rng';
import { sprintProblem } from './math-sprint';
import type { GameResult, MathSprintConfig, Op, VocabCard } from './types';

// ─── Aturan (Balon Hitung & Tangkap Benda) ──────────────────────────────────

export type ArcadeRule =
  | { type: 'MULTIPLE'; n: number; max: number }
  | { type: 'EVEN' | 'ODD'; max: number }
  | { type: 'EQUALS'; target: number; ops: ('+' | '-' | '×')[] }
  | { type: 'GREATER' | 'LESS'; than: number; max: number }
  | { type: 'CATEGORY'; prompt: string; good: string[]; bad: string[] };

export function rulePrompt(rule: ArcadeRule): string {
  switch (rule.type) {
    case 'MULTIPLE':
      return `Kelipatan ${rule.n}`;
    case 'EVEN':
      return 'Bilangan genap';
    case 'ODD':
      return 'Bilangan ganjil';
    case 'EQUALS':
      return `Hasilnya ${rule.target}`;
    case 'GREATER':
      return `Lebih dari ${rule.than}`;
    case 'LESS':
      return `Kurang dari ${rule.than}`;
    case 'CATEGORY':
      return rule.prompt;
  }
}

function expressionFor(rng: Rng, value: number, ops: ('+' | '-' | '×')[]): string {
  const op = pick(rng, ops.length ? ops : (['+'] as const));
  if (op === '×') {
    const factors: number[] = [];
    for (let d = 2; d * d <= value; d++) if (value % d === 0) factors.push(d);
    if (factors.length) {
      const d = pick(rng, factors);
      return rng() < 0.5 ? `${d} × ${value / d}` : `${value / d} × ${d}`;
    }
  }
  if (op === '-' || (op === '×' && value < 2)) {
    const b = randInt(rng, 1, 9);
    return `${value + b} − ${b}`;
  }
  const a = randInt(rng, 0, value);
  return `${a} + ${value - a}`;
}

/** Label benda untuk aturan tertentu; `good` = sesuai aturan. */
export function ruleLabel(rng: Rng, rule: ArcadeRule, good: boolean): string {
  switch (rule.type) {
    case 'MULTIPLE': {
      if (good) return String(rule.n * randInt(rng, 1, Math.max(1, Math.floor(rule.max / rule.n))));
      for (let i = 0; i < 50; i++) {
        const v = randInt(rng, 1, rule.max);
        if (v % rule.n !== 0) return String(v);
      }
      return String(rule.n * 2 + 1);
    }
    case 'EVEN':
    case 'ODD': {
      const wantEven = (rule.type === 'EVEN') === good;
      const v = randInt(rng, 1, Math.max(2, Math.floor(rule.max / 2))) * 2 - (wantEven ? 0 : 1);
      return String(v);
    }
    case 'GREATER':
      return String(good ? randInt(rng, rule.than + 1, rule.max) : randInt(rng, 0, rule.than));
    case 'LESS':
      return String(good ? randInt(rng, 0, Math.max(0, rule.than - 1)) : randInt(rng, rule.than, rule.max));
    case 'EQUALS': {
      const value = good ? rule.target : Math.max(0, rule.target + pick(rng, [-3, -2, -1, 1, 2, 3]));
      return expressionFor(rng, value === rule.target && !good ? rule.target + 1 : value, rule.ops);
    }
    case 'CATEGORY':
      return pick(rng, good ? rule.good : rule.bad);
  }
}

export const isEmojiLabel = (label: string) => /^\p{Extended_Pictographic}/u.test(label);

// ─── Jadwal benda (balon naik / benda jatuh) ────────────────────────────────

export type Pace = 'slow' | 'normal' | 'fast';

export interface FallingConfig {
  durationSec: number;
  /** Aturan berganti setiap waveSec detik (urutan aturan diacak per sesi) */
  waveSec: number;
  rules: ArcadeRule[];
  pace: Pace;
}

export interface FallingItem {
  id: number;
  /** Waktu muncul (ms permainan) */
  t: number;
  /** Lama terlihat: balon naik dari bawah ke atas / benda jatuh sampai garis keranjang */
  life: number;
  /** Posisi mendatar 0–1 */
  x: number;
  label: string;
  good: boolean;
  wave: number;
}

export interface FallingSchedule {
  items: FallingItem[];
  /** Indeks aturan untuk gelombang ke-w = waveOrder[w % panjang] */
  waveOrder: number[];
  durationMs: number;
}

const PACE: Record<'balloon' | 'catcher', Record<Pace, { interval: [number, number]; life: [number, number] }>> = {
  balloon: {
    slow: { interval: [1300, 900], life: [6000, 4600] },
    normal: { interval: [1100, 700], life: [5200, 3800] },
    fast: { interval: [900, 550], life: [4500, 3200] },
  },
  catcher: {
    slow: { interval: [1800, 1250], life: [4400, 3300] },
    normal: { interval: [1500, 1000], life: [3800, 2800] },
    fast: { interval: [1250, 850], life: [3300, 2400] },
  },
};

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const CATCHER_COLUMNS = [0.1, 0.3, 0.5, 0.7, 0.9];

export function buildFallingSchedule(seed: number, cfg: FallingConfig, kind: 'balloon' | 'catcher'): FallingSchedule {
  const rng = rngFor(seed, 'falling', kind);
  const D = cfg.durationSec * 1000;
  const waveMs = cfg.waveSec * 1000;
  const waveOrder = shuffle(
    rng,
    cfg.rules.map((_, i) => i)
  );
  const pace = PACE[kind][cfg.pace] ?? PACE[kind].normal;
  const items: FallingItem[] = [];
  let t = 1500;
  let lastX = 0.5;
  for (let guard = 0; guard < 1000; guard++) {
    const f = Math.min(1, t / D);
    const life = Math.round(lerp(pace.life[0], pace.life[1], f));
    if (t + life > D) break;
    const wave = Math.floor(t / waveMs);
    const waveEnd = (wave + 1) * waveMs;
    // Layar dikosongkan sebelum aturan berganti agar anak tidak bingung
    if (t + life > waveEnd - 300) {
      if (waveEnd >= D) break;
      t = waveEnd + 1500;
      continue;
    }
    const rule = cfg.rules[waveOrder[wave % waveOrder.length]];
    const good = rng() < 0.5;
    const label = ruleLabel(rng, rule, good);
    let x: number;
    if (kind === 'catcher') {
      x = pick(rng, CATCHER_COLUMNS);
    } else {
      x = 0.12 + rng() * 0.76;
      if (Math.abs(x - lastX) < 0.18) x = x > 0.5 ? x - 0.36 : x + 0.36;
    }
    lastX = x;
    items.push({ id: items.length, t: Math.round(t), life, x: Math.round(x * 1000) / 1000, label, good, wave });
    t += lerp(pace.interval[0], pace.interval[1], f) * (0.8 + rng() * 0.4);
  }
  return { items, waveOrder, durationMs: D };
}

export function ruleAt(cfg: FallingConfig, schedule: FallingSchedule, ms: number): ArcadeRule {
  const wave = Math.floor(Math.max(0, ms) / (cfg.waveSec * 1000));
  return cfg.rules[schedule.waveOrder[wave % schedule.waveOrder.length]];
}

/** Pengali combo: ×2 mulai 5 beruntun, ×3 mulai 10 beruntun. */
export const comboMultiplier = (combo: number) => (combo >= 10 ? 3 : combo >= 5 ? 2 : 1);

const TOLERANCE_MS = 250;

// ─── Balon Hitung ───────────────────────────────────────────────────────────

/** [ms, id balon yang diketuk] */
export type TapLog = [ms: number, id: number][];

export interface BalloonState {
  score: number;
  combo: number;
  goodHits: number;
  badHits: number;
  hits: Map<number, { ms: number; good: boolean; points: number }>;
}

/** null = log tidak sah (balon tidak ada / di luar waktu tampil / diketuk dua kali / waktu mundur). */
export function replayBalloon(schedule: FallingSchedule, log: TapLog, until = Infinity): BalloonState | null {
  const state: BalloonState = { score: 0, combo: 0, goodHits: 0, badHits: 0, hits: new Map() };
  let last = 0;
  for (const entry of log) {
    if (!Array.isArray(entry) || entry.length !== 2) return null;
    const [ms, id] = entry;
    if (ms > until) break;
    const item = Number.isInteger(id) ? schedule.items[id] : undefined;
    if (!item || !Number.isFinite(ms) || ms < last || state.hits.has(id)) return null;
    if (ms < item.t - TOLERANCE_MS || ms > item.t + item.life + TOLERANCE_MS) return null;
    last = ms;
    if (item.good) {
      state.combo++;
      const points = 10 * comboMultiplier(state.combo);
      state.score += points;
      state.goodHits++;
      state.hits.set(id, { ms, good: true, points });
    } else {
      state.combo = 0;
      state.badHits++;
      state.hits.set(id, { ms, good: false, points: 0 });
    }
  }
  return state;
}

function fallingStars(goodHits: number, goodTotal: number, badHits: number): number {
  const ratio = goodTotal ? goodHits / goodTotal : 0;
  const accuracy = goodHits + badHits ? goodHits / (goodHits + badHits) : 0;
  if (ratio >= 0.7 && accuracy >= 0.85) return 3;
  if (ratio >= 0.45 && accuracy >= 0.7) return 2;
  if (ratio >= 0.2) return 1;
  return 0;
}

export function balloonResult(schedule: FallingSchedule, state: BalloonState): GameResult {
  const goodTotal = schedule.items.filter((i) => i.good).length;
  return { score: state.score, correct: state.goodHits, total: goodTotal, stars: fallingStars(state.goodHits, goodTotal, state.badHits) };
}

// ─── Tangkap Benda ──────────────────────────────────────────────────────────

/** [ms, posisi keranjang 0–1] — dicatat saat keranjang bergerak */
export type MoveLog = [ms: number, x: number][];

export const CATCH_RADIUS = 0.13;
export const CATCHER_HEARTS = 3;

export function basketAt(log: MoveLog, t: number): number {
  let lo = 0;
  let hi = log.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (log[mid][0] <= t) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found >= 0 ? log[found][1] : 0.5;
}

export interface CatcherState {
  score: number;
  combo: number;
  goodHits: number;
  badHits: number;
  missedGood: number;
  hearts: number;
  resolved: Map<number, { caught: boolean; good: boolean; points: number }>;
  overAt: number | null;
}

export function validMoveLog(log: unknown): log is MoveLog {
  if (!Array.isArray(log) || log.length > 6000) return false;
  let last = 0;
  for (const e of log) {
    if (!Array.isArray(e) || e.length !== 2) return false;
    const [ms, x] = e;
    if (!Number.isFinite(ms) || ms < last || !Number.isFinite(x) || x < 0 || x > 1) return false;
    last = ms;
  }
  return true;
}

export function replayCatcher(schedule: FallingSchedule, log: MoveLog, until = Infinity): CatcherState {
  const state: CatcherState = { score: 0, combo: 0, goodHits: 0, badHits: 0, missedGood: 0, hearts: CATCHER_HEARTS, resolved: new Map(), overAt: null };
  const byCatch = [...schedule.items].sort((a, b) => a.t + a.life - (b.t + b.life) || a.id - b.id);
  for (const item of byCatch) {
    const at = item.t + item.life;
    if (at > until || state.overAt !== null) break;
    const caught = Math.abs(basketAt(log, at) - item.x) <= CATCH_RADIUS;
    let points = 0;
    if (caught && item.good) {
      state.combo++;
      points = 10 * comboMultiplier(state.combo);
      state.score += points;
      state.goodHits++;
    } else if (caught) {
      state.combo = 0;
      state.badHits++;
      state.hearts--;
      if (state.hearts <= 0) state.overAt = at;
    } else if (item.good) {
      state.combo = 0;
      state.missedGood++;
    }
    state.resolved.set(item.id, { caught, good: item.good, points });
  }
  return state;
}

export function catcherEnd(schedule: FallingSchedule, state: CatcherState): number {
  return state.overAt ?? schedule.durationMs;
}

export function catcherResult(schedule: FallingSchedule, state: CatcherState): GameResult {
  const goodTotal = schedule.items.filter((i) => i.good).length;
  const stars = fallingStars(state.goodHits, goodTotal, state.badHits);
  return { score: state.score, correct: state.goodHits, total: goodTotal, stars: state.overAt !== null ? Math.min(1, stars) : stars };
}

// ─── Soal matematika bersama (Lari Jawaban & Jaga Benteng) ──────────────────

/** Bagian konfigurasi Kilat Hitung yang dipakai ulang untuk membuat soal. */
export interface ArcadeMath {
  mode: 'ARITH' | 'MAKE_TARGET' | 'TIU';
  ops: Op[];
  max: number;
  maxCap: number;
  factorMax?: number;
  factorCap?: number;
  allowNegative?: boolean;
  target?: number;
}

export const toSprintConfig = (m: ArcadeMath): MathSprintConfig => ({ ...m, durationSec: 60, stars: [1, 2, 3] });

const NAMES = ['Ani', 'Budi', 'Sari', 'Dodi', 'Rina', 'Tono', 'Putri', 'Raka'];

/** Soal cerita untuk robot bos. Jawaban selalu bilangan bulat. */
export function wordProblem(rng: Rng, level: number, math: ArcadeMath): { text: string; answer: number } {
  const name = pick(rng, NAMES);
  if (math.mode === 'TIU') {
    if (rng() < 0.5) {
      const price = 20 * randInt(rng, 5, 10 + level * 5);
      const p = pick(rng, [10, 20, 25, 50]);
      return { text: `Harga tas Rp${price} ribu, diskon ${p}%. Berapa ribu yang dibayar?`, answer: (price * (100 - p)) / 100 };
    }
    // Perbandingan berbalik nilai: tukang × hari tetap
    const workers = pick(rng, [2, 3, 4, 6]);
    const more = pick(rng, [2, 3]);
    const days = more * randInt(rng, 2, 6 + level);
    return {
      text: `${workers} tukang menyelesaikan rumah dalam ${days} hari. Jika tukangnya ${workers * more} orang, berapa hari?`,
      answer: days / more,
    };
  }
  if (math.allowNegative) {
    const a = randInt(rng, -5, 10 + level * 2);
    const b = randInt(rng, 3, 8 + level * 2);
    return { text: `Suhu siang ${a}°C, malamnya turun ${b}°C. Berapa °C suhu malam?`, answer: a - b };
  }
  const hi = Math.max(10, Math.round(math.max + ((math.maxCap - math.max) * (level - 1)) / 4));
  const f = Math.max(3, Math.round((math.factorMax ?? 6) + (((math.factorCap ?? math.factorMax ?? 9) - (math.factorMax ?? 6)) * (level - 1)) / 4));
  const op = pick(rng, math.ops.filter((o) => o === '+' || o === '-' || o === '×' || o === '÷').length ? math.ops.filter((o) => o === '+' || o === '-' || o === '×' || o === '÷') : (['+'] as Op[]));
  if (op === '+') {
    const a = randInt(rng, 2, Math.max(3, hi - 2));
    const b = randInt(rng, 1, Math.max(1, hi - a));
    return { text: `${name} punya ${a} kelereng, lalu diberi ${b} lagi. Berapa kelerengnya sekarang?`, answer: a + b };
  }
  if (op === '-') {
    const a = randInt(rng, 5, Math.max(6, hi));
    const b = randInt(rng, 1, a - 1);
    return { text: `Di bus ada ${a} penumpang. Di halte, ${b} orang turun. Berapa penumpang yang tersisa?`, answer: a - b };
  }
  if (op === '×') {
    const a = randInt(rng, 2, f);
    const b = randInt(rng, 2, f);
    return { text: `${name} membeli ${a} kotak pensil. Setiap kotak berisi ${b} pensil. Berapa pensil semuanya?`, answer: a * b };
  }
  const b = randInt(rng, 2, f);
  const q = randInt(rng, 2, f);
  return { text: `Ada ${b * q} kue dibagi rata kepada ${b} anak. Berapa kue yang didapat setiap anak?`, answer: q };
}

function numberDistractors(rng: Rng, answer: number, allowNegative: boolean, count: number): number[] {
  const spread = Math.max(2, Math.round(Math.abs(answer) * 0.15));
  const candidates = shuffle(rng, [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10, answer - 10, answer + spread, answer - spread, answer * 2]);
  const out: number[] = [];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c === answer || out.includes(c) || (!allowNegative && c < 0)) continue;
    out.push(c);
  }
  for (let k = 3; out.length < count; k++) if (!out.includes(answer + k)) out.push(answer + k);
  return out;
}

// ─── Lari Jawaban ───────────────────────────────────────────────────────────

export interface RunnerConfig {
  gates: number;
  hearts: number;
  /** Jarak antar-gerbang (ms) di awal dan paling cepat */
  startInterval: number;
  minInterval: number;
  source: 'MATH' | 'VOCAB';
  math?: ArcadeMath;
  /** VOCAB: EMOJI_TO_WORD (lihat gambar → pilih kata), WORD_TO_MEANING (kata → arti), LISTEN (dengar → pilih gambar) */
  vocabMode?: 'EMOJI_TO_WORD' | 'WORD_TO_MEANING' | 'LISTEN';
}

export interface RunnerGate {
  i: number;
  /** Waktu gerbang mencapai pelari */
  T: number;
  /** Lama gerbang terlihat sebelum sampai */
  approach: number;
  question: string;
  /** Kata Inggris yang diucapkan (mode kosakata) */
  speak?: string;
  questionKind: 'text' | 'emoji' | 'listen';
  options: string[];
  correct: number;
}

export function buildRunnerSchedule(seed: number, cfg: RunnerConfig, deck: VocabCard[] | null): RunnerGate[] {
  const rng = rngFor(seed, 'runner');
  const gates: RunnerGate[] = [];
  const step = (cfg.startInterval - cfg.minInterval) / Math.max(1, cfg.gates * 0.6);
  const order = deck ? shuffle(rng, deck.map((_, i) => i)) : [];
  let T = 3800;
  for (let i = 0; i < cfg.gates; i++) {
    const interval = Math.round(Math.max(cfg.minInterval, cfg.startInterval - i * step));
    const approach = Math.min(3200, interval - 250);
    let question: string;
    let questionKind: RunnerGate['questionKind'] = 'text';
    let speak: string | undefined;
    let answer: string;
    let others: string[];
    if (cfg.source === 'VOCAB' && deck && deck.length >= 3) {
      const card = deck[order[i % order.length]];
      const pool = shuffle(
        rng,
        deck.filter((c) => c !== card && c.emoji !== card.emoji && c.meaning !== card.meaning)
      ).slice(0, 2);
      const mode = cfg.vocabMode ?? 'EMOJI_TO_WORD';
      speak = card.word;
      if (mode === 'WORD_TO_MEANING') {
        question = card.word;
        answer = card.meaning;
        others = pool.map((c) => c.meaning);
      } else if (mode === 'LISTEN') {
        question = card.word;
        questionKind = 'listen';
        answer = card.emoji;
        others = pool.map((c) => c.emoji);
      } else {
        question = card.emoji;
        questionKind = 'emoji';
        answer = card.word;
        others = pool.map((c) => c.word);
      }
    } else {
      const math = cfg.math ?? { mode: 'ARITH', ops: ['+'], max: 10, maxCap: 20 };
      const level = Math.min(5, 1 + Math.floor((i * 5) / Math.max(1, cfg.gates)));
      const p = sprintProblem(seed, i, level, toSprintConfig(math));
      question = p.text.includes('?') ? p.text : `${p.text} = ?`;
      answer = String(p.answer);
      others = numberDistractors(rng, p.answer, !!math.allowNegative, 2).map(String);
    }
    const options = shuffle(rng, [answer, ...others]);
    gates.push({ i, T, approach, question, questionKind, speak, options, correct: options.indexOf(answer) });
    T += interval;
  }
  return gates;
}

/** [ms, jalur 0–2] — dicatat setiap pindah jalur; awal di jalur tengah (1) */
export type LaneLog = [ms: number, lane: number][];

export function validLaneLog(log: unknown): log is LaneLog {
  if (!Array.isArray(log) || log.length > 2000) return false;
  let last = 0;
  for (const e of log) {
    if (!Array.isArray(e) || e.length !== 2) return false;
    const [ms, lane] = e;
    if (!Number.isFinite(ms) || ms < last || ![0, 1, 2].includes(lane)) return false;
    last = ms;
  }
  return true;
}

export function laneAt(log: LaneLog, t: number): number {
  let lane = 1;
  for (const [ms, l] of log) {
    if (ms > t) break;
    lane = l;
  }
  return lane;
}

export interface RunnerState {
  score: number;
  streak: number;
  correct: number;
  passed: number;
  hearts: number;
  results: Map<number, { ok: boolean; chosen: number }>;
  overAt: number | null;
}

export function replayRunner(gates: RunnerGate[], cfg: RunnerConfig, log: LaneLog, until = Infinity): RunnerState {
  const state: RunnerState = { score: 0, streak: 0, correct: 0, passed: 0, hearts: cfg.hearts, results: new Map(), overAt: null };
  for (const g of gates) {
    if (g.T > until || state.overAt !== null) break;
    const chosen = laneAt(log, g.T);
    const ok = chosen === g.correct;
    state.passed++;
    if (ok) {
      state.correct++;
      state.streak++;
      state.score += 10 * comboMultiplier(state.streak);
    } else {
      state.streak = 0;
      state.hearts--;
      if (state.hearts <= 0) state.overAt = g.T;
    }
    state.results.set(g.i, { ok, chosen });
  }
  return state;
}

export const runnerEnd = (gates: RunnerGate[], state: RunnerState) => state.overAt ?? (gates.length ? gates[gates.length - 1].T + 600 : 0);

export function runnerResult(gates: RunnerGate[], state: RunnerState): GameResult {
  const ratio = gates.length ? state.correct / gates.length : 0;
  let stars = ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;
  if (state.overAt !== null) stars = Math.min(1, stars);
  return { score: state.score, correct: state.correct, total: gates.length, stars };
}

// ─── Jaga Benteng ───────────────────────────────────────────────────────────

export interface DefenseConfig {
  waves: number;
  /** Nyawa benteng */
  hp: number;
  math: ArcadeMath;
  boss: boolean;
  /** Lama robot berjalan sampai benteng (ms) di gelombang pertama dan paling cepat */
  startLife: number;
  minLife: number;
}

export interface Robot {
  id: number;
  t: number;
  life: number;
  x: number;
  wave: number;
  text: string;
  answer: number;
  boss: boolean;
  level: number;
  damage: number;
}

export function buildDefenseSchedule(seed: number, cfg: DefenseConfig): Robot[] {
  const rng = rngFor(seed, 'defense');
  const sprintCfg = toSprintConfig(cfg.math);
  const robots: Robot[] = [];
  const lanes = [0.2, 0.5, 0.8];
  let t = 2000;
  for (let w = 0; w < cfg.waves; w++) {
    const level = Math.min(5, 1 + w);
    const count = 3 + w;
    const life = Math.round(Math.max(cfg.minLife, cfg.startLife - w * ((cfg.startLife - cfg.minLife) / Math.max(1, cfg.waves - 1))));
    const gap = Math.max(1500, Math.round(life / 3.2));
    let laneIdx = randInt(rng, 0, 2);
    for (let k = 0; k < count; k++) {
      const id = robots.length;
      const p = sprintProblem(seed, 1000 + id, level, sprintCfg);
      laneIdx = (laneIdx + randInt(rng, 1, 2)) % 3;
      robots.push({ id, t, life, x: lanes[laneIdx], wave: w, text: p.text.includes('?') ? p.text : `${p.text} = ?`, answer: p.answer, boss: false, level, damage: 1 });
      t += Math.round(gap * (0.85 + rng() * 0.3));
    }
    if (cfg.boss) {
      t += 1200;
      const wp = wordProblem(rng, level, cfg.math);
      robots.push({ id: robots.length, t, life: Math.round(life * 2.2), x: 0.5, wave: w, text: wp.text, answer: wp.answer, boss: true, level, damage: 2 });
      t += Math.round(life * 0.9);
    }
    t += 3500;
  }
  return robots;
}

/** [ms, angka yang dikirim] */
export type AnswerLog = [ms: number, value: number][];

export function validAnswerLog(log: unknown): log is AnswerLog {
  if (!Array.isArray(log) || log.length > 1000) return false;
  let last = 0;
  for (const e of log) {
    if (!Array.isArray(e) || e.length !== 2) return false;
    const [ms, v] = e;
    if (!Number.isFinite(ms) || ms < last || !Number.isInteger(v) || Math.abs(v) > 1e7) return false;
    last = ms;
  }
  return true;
}

export interface DefenseState {
  score: number;
  combo: number;
  hp: number;
  destroyed: Map<number, number>;
  leaked: Set<number>;
  mistakes: number;
  /** Jawaban yang dikirim dan robot yang dihancurkannya (null = tidak ada robot dengan jawaban itu) */
  answers: { ms: number; value: number; hit: number | null }[];
  overAt: number | null;
  /** Waktu robot terakhir selesai (hancur / sampai) bila semua sudah selesai */
  doneAt: number | null;
}

export function replayDefense(robots: Robot[], cfg: DefenseConfig, log: AnswerLog, until = Infinity): DefenseState {
  const state: DefenseState = { score: 0, combo: 0, hp: cfg.hp, destroyed: new Map(), leaked: new Set(), mistakes: 0, answers: [], overAt: null, doneAt: null };
  const arrivals = [...robots].sort((a, b) => a.t + a.life - (b.t + b.life) || a.id - b.id);
  let ai = 0;
  let si = 0;
  let lastResolution = 0;
  const arrive = (r: Robot) => {
    const at = r.t + r.life;
    if (!state.destroyed.has(r.id)) {
      state.leaked.add(r.id);
      state.hp -= r.damage;
      state.combo = 0;
      lastResolution = at;
      if (state.hp <= 0) state.overAt = at;
    }
  };
  while (state.overAt === null) {
    const nextArrival = ai < arrivals.length ? arrivals[ai].t + arrivals[ai].life : Infinity;
    const nextSubmit = si < log.length ? log[si][0] : Infinity;
    if (nextArrival === Infinity && nextSubmit === Infinity) break;
    // Robot yang sampai tepat pada saat jawaban dikirim dianggap sudah sampai
    if (nextArrival <= nextSubmit) {
      if (nextArrival > until) break;
      arrive(arrivals[ai++]);
      continue;
    }
    if (nextSubmit > until) break;
    const [ms, value] = log[si++];
    let target: Robot | null = null;
    for (const r of robots) {
      if (r.t > ms || ms >= r.t + r.life || state.destroyed.has(r.id) || r.answer !== value) continue;
      if (!target || r.t + r.life < target.t + target.life) target = r;
    }
    if (target) {
      state.destroyed.set(target.id, ms);
      state.combo++;
      state.score += (target.boss ? 50 : 10 * target.level) * comboMultiplier(state.combo);
      lastResolution = Math.max(lastResolution, ms);
    } else {
      state.mistakes++;
      state.combo = 0;
    }
    state.answers.push({ ms, value, hit: target?.id ?? null });
  }
  if (state.overAt === null && state.destroyed.size + state.leaked.size === robots.length) state.doneAt = lastResolution;
  return state;
}

export function defenseEnd(robots: Robot[], state: DefenseState): number {
  return state.overAt ?? state.doneAt ?? Math.max(0, ...robots.map((r) => r.t + r.life));
}

export function defenseResult(robots: Robot[], cfg: DefenseConfig, state: DefenseState): GameResult {
  const ratio = robots.length ? state.destroyed.size / robots.length : 0;
  // Ketepatan menahan "spam" angka acak: jawaban yang tidak mengenai robot ikut dihitung
  const accuracy = state.destroyed.size + state.mistakes ? state.destroyed.size / (state.destroyed.size + state.mistakes) : 0;
  let stars = state.hp === cfg.hp && ratio >= 0.9 && accuracy >= 0.8 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
  if (accuracy < 0.6) stars = Math.min(1, stars);
  if (state.overAt !== null) stars = Math.min(1, stars);
  return { score: state.score, correct: state.destroyed.size, total: robots.length, stars };
}
