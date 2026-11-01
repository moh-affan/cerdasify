// TTS Kata: generator tata letak (dijalankan saat seeding / admin menyimpan, bukan di browser),
// versi publik tanpa jawaban, serta pemeriksaan jawaban di server.

import type {
  CrosswordEntry,
  CrosswordItems,
  CrosswordLayout,
  CrosswordWord,
  GameResult,
  PublicCrossword,
} from './types';
import { rngFor, shuffle } from './rng';

export const normalizeAnswer = (s: string) =>
  s
    .toUpperCase()
    .normalize('NFD')
    .replace(/[^A-Z]/g, '');

interface Placed {
  word: CrosswordWord;
  answer: string;
  row: number;
  col: number;
  dir: 'A' | 'D';
}

const key = (r: number, c: number) => `${r},${c}`;

class Grid {
  cells = new Map<string, { ch: string; across: boolean; down: boolean }>();
  placed: Placed[] = [];

  get(r: number, c: number) {
    return this.cells.get(key(r, c));
  }

  /** Jumlah persilangan bila valid, -1 bila tidak bisa ditempatkan. */
  score(answer: string, row: number, col: number, dir: 'A' | 'D'): number {
    const dr = dir === 'D' ? 1 : 0;
    const dc = dir === 'A' ? 1 : 0;
    if (this.get(row - dr, col - dc) || this.get(row + dr * answer.length, col + dc * answer.length)) return -1;
    let crossings = 0;
    for (let i = 0; i < answer.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const cell = this.get(r, c);
      if (cell) {
        if (cell.ch !== answer[i]) return -1;
        if ((dir === 'A' && cell.across) || (dir === 'D' && cell.down)) return -1;
        crossings++;
      } else {
        // Sel baru tidak boleh bersebelahan dengan huruf lain di arah tegak lurus
        if (this.get(r + dc, c + dr) || this.get(r - dc, c - dr)) return -1;
      }
    }
    return crossings;
  }

  place(word: CrosswordWord, answer: string, row: number, col: number, dir: 'A' | 'D') {
    const dr = dir === 'D' ? 1 : 0;
    const dc = dir === 'A' ? 1 : 0;
    for (let i = 0; i < answer.length; i++) {
      const k = key(row + dr * i, col + dc * i);
      const cell = this.cells.get(k) ?? { ch: answer[i], across: false, down: false };
      if (dir === 'A') cell.across = true;
      else cell.down = true;
      this.cells.set(k, cell);
    }
    this.placed.push({ word, answer, row, col, dir });
  }

  bounds() {
    let minR = Infinity;
    let maxR = -Infinity;
    let minC = Infinity;
    let maxC = -Infinity;
    for (const k of this.cells.keys()) {
      const [r, c] = k.split(',').map(Number);
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }
    return { minR, maxR, minC, maxC };
  }
}

function attempt(words: CrosswordWord[], order: number[]): Grid {
  const grid = new Grid();
  const queue = order.map((i) => words[i]);
  const first = queue.shift()!;
  grid.place(first, normalizeAnswer(first.answer), 0, 0, 'A');
  let progress = true;
  let pending = queue;
  // Ulangi selama masih ada kata yang berhasil ditempatkan (kata yang gagal dicoba lagi di putaran berikutnya)
  while (pending.length && progress) {
    progress = false;
    const next: CrosswordWord[] = [];
    for (const word of pending) {
      const answer = normalizeAnswer(word.answer);
      let best: { row: number; col: number; dir: 'A' | 'D'; value: number } | null = null;
      for (const p of grid.placed) {
        for (let i = 0; i < p.answer.length; i++) {
          for (let j = 0; j < answer.length; j++) {
            if (p.answer[i] !== answer[j]) continue;
            const dir: 'A' | 'D' = p.dir === 'A' ? 'D' : 'A';
            const cr = p.row + (p.dir === 'D' ? i : 0);
            const cc = p.col + (p.dir === 'A' ? i : 0);
            const row = dir === 'D' ? cr - j : cr;
            const col = dir === 'A' ? cc - j : cc;
            const crossings = grid.score(answer, row, col, dir);
            if (crossings < 1) continue;
            const b = grid.bounds();
            const w = Math.max(b.maxC, col + (dir === 'A' ? answer.length - 1 : 0)) - Math.min(b.minC, col) + 1;
            const h = Math.max(b.maxR, row + (dir === 'D' ? answer.length - 1 : 0)) - Math.min(b.minR, row) + 1;
            // Utamakan banyak persilangan, lalu grid yang mendekati persegi & kecil
            const value = crossings * 100 - Math.max(w, h) * 4 - w * h * 0.1;
            if (!best || value > best.value) best = { row, col, dir, value };
          }
        }
      }
      if (best) {
        grid.place(word, answer, best.row, best.col, best.dir);
        progress = true;
      } else next.push(word);
    }
    pending = next;
  }
  return grid;
}

/** Hasilkan tata letak deterministik. Kata yang tidak bisa disilangkan dikembalikan di `unplaced`. */
export function buildCrosswordLayout(words: CrosswordWord[], tries = 400): { layout: CrosswordLayout; unplaced: string[] } {
  const valid = words.filter((w) => normalizeAnswer(w.answer).length >= 2);
  if (!valid.length) return { layout: { rows: 0, cols: 0, entries: [] }, unplaced: words.map((w) => w.answer) };

  const byLength = valid.map((_, i) => i).sort((a, b) => normalizeAnswer(valid[b].answer).length - normalizeAnswer(valid[a].answer).length);
  let best: Grid | null = null;
  let bestValue = -Infinity;
  for (let t = 0; t < tries; t++) {
    const order = t === 0 ? byLength : [byLength[0], ...shuffle(rngFor('crossword', t), byLength.slice(1))];
    const grid = attempt(valid, order);
    const b = grid.bounds();
    const h = b.maxR - b.minR + 1;
    const w = b.maxC - b.minC + 1;
    // Semua kata tersusun lebih penting; lalu sisi terpanjang sekecil mungkin (muat di layar ponsel)
    const value = grid.placed.length * 10000 - Math.max(w, h) * 40 - w * h;
    if (value > bestValue) {
      best = grid;
      bestValue = value;
    }
  }
  const grid = best!;
  const { minR, maxR, minC, maxC } = grid.bounds();

  // Penomoran standar: urut baris lalu kolom; mendatar & menurun yang mulai di sel sama berbagi nomor
  const starts = [...grid.placed]
    .map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }))
    .sort((a, b) => a.row - b.row || a.col - b.col || (a.dir === 'A' ? -1 : 1));
  const numbers = new Map<string, number>();
  const entries: CrosswordEntry[] = starts.map((p) => {
    const k = key(p.row, p.col);
    if (!numbers.has(k)) numbers.set(k, numbers.size + 1);
    return {
      num: numbers.get(k)!,
      dir: p.dir,
      row: p.row,
      col: p.col,
      answer: p.answer,
      clue: p.word.clue,
      ...(p.word.emoji ? { emoji: p.word.emoji } : {}),
    };
  });
  const placedSet = new Set(grid.placed.map((p) => p.word));
  return {
    layout: { rows: maxR - minR + 1, cols: maxC - minC + 1, entries },
    unplaced: valid.filter((w) => !placedSet.has(w)).map((w) => w.answer),
  };
}

export function publicCrossword(items: CrosswordItems): PublicCrossword {
  const { rows, cols, entries } = items.layout;
  return {
    rows,
    cols,
    entries: entries.map((e) => ({
      num: e.num,
      dir: e.dir,
      row: e.row,
      col: e.col,
      length: e.answer.length,
      clue: e.clue,
      ...(e.emoji ? { emoji: e.emoji } : {}),
    })),
  };
}

export const entryId = (e: { num: number; dir: 'A' | 'D' }) => `${e.num}${e.dir}`;

export function entryCells(e: { row: number; col: number; dir: 'A' | 'D'; length?: number; answer?: string }) {
  const len = e.length ?? e.answer?.length ?? 0;
  return Array.from({ length: len }, (_, i) => (e.dir === 'A' ? [e.row, e.col + i] : [e.row + i, e.col]) as [number, number]);
}

/** Isian pemain: "r,c" → huruf */
export type CrosswordFill = Record<string, string>;

export function solutionLetter(layout: CrosswordLayout, row: number, col: number): string | null {
  for (const e of layout.entries) {
    const idx = entryCells(e).findIndex(([r, c]) => r === row && c === col);
    if (idx >= 0) return e.answer[idx];
  }
  return null;
}

export function checkCrossword(layout: CrosswordLayout, fill: CrosswordFill): string[] {
  return layout.entries
    .filter((e) => entryCells(e).every(([r, c], i) => normalizeAnswer(fill[key(r, c)] ?? '') === e.answer[i]))
    .map(entryId);
}

export function gradeCrossword(layout: CrosswordLayout, fill: CrosswordFill, hints: number): GameResult {
  const correct = checkCrossword(layout, fill).length;
  const total = layout.entries.length;
  const all = correct === total && total > 0;
  const stars = all ? (hints === 0 ? 3 : hints <= 3 ? 2 : 1) : correct / Math.max(1, total) >= 0.8 ? 1 : 0;
  return { score: Math.max(0, correct * 10 - hints * 3), correct, total, stars };
}
