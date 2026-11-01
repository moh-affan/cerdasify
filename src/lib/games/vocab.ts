// Kosakata Bergambar: penyusunan ronde (kata jatuh tempo + kata baru), penilaian, dan jadwal Leitner.

import { rngFor, shuffle, pick } from './rng';
import type { GameResult, VocabCard, VocabConfig, VocabMode } from './types';

export const LEITNER_INTERVALS = [1, 2, 4, 7, 14]; // hari, untuk kotak 1–5
export const MASTERED_BOX = 4;

export const wordKey = (word: string, lang = 'en') => `${lang}:${word.trim().toLowerCase()}`;

export interface MasteryInfo {
  box: number;
  dueDate: string;
}

export interface VocabRoundItem {
  /** Indeks kata di dek */
  idx: number;
  mode: VocabMode;
  isNew: boolean;
  /** Indeks kata pilihan (mode LOOK_PICK / LISTEN_PICK) */
  options?: number[];
  /** Huruf acak (mode SPELL) */
  letters?: string[];
}

/** Jawaban per butir: indeks kata yang dipilih, atau teks untuk SPELL/TYPE */
export type VocabAnswer = number | string | null;

const normalizeWord = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

function modeFor(box: number, isNew: boolean, allowed: VocabMode[], rng: () => number): VocabMode {
  const prefer: VocabMode[] = isNew
    ? ['LOOK_PICK', 'LISTEN_PICK']
    : box <= 1
      ? ['LOOK_PICK', 'LISTEN_PICK']
      : box === 2
        ? ['LISTEN_PICK', 'SPELL', 'LOOK_PICK']
        : ['SPELL', 'TYPE', 'LISTEN_PICK'];
  const candidates = prefer.filter((m) => allowed.includes(m));
  return pick(rng, candidates.length ? candidates.slice(0, 2) : allowed.length ? allowed : ['LOOK_PICK']);
}

/**
 * Ronde: kata jatuh tempo (urut tanggal, lalu kotak terendah) + maksimal `newPerRound` kata baru,
 * sisa diisi kata yang paling lemah. Tamu: mastery kosong → semua kata dianggap baru.
 */
export function buildVocabRound(
  seed: number,
  deck: VocabCard[],
  cfg: VocabConfig,
  mastery: Map<string, MasteryInfo>,
  today: string
): VocabRoundItem[] {
  const rng = rngFor(seed, 'vocab-round');
  const size = Math.min(cfg.roundSize, deck.length);
  const indexed = deck.map((card, idx) => ({ idx, card, m: mastery.get(wordKey(card.word)) }));
  const fresh = shuffle(rng, indexed.filter((x) => !x.m));
  const known = indexed.filter((x) => x.m);
  const due = known
    .filter((x) => x.m!.dueDate <= today)
    .sort((a, b) => a.m!.dueDate.localeCompare(b.m!.dueDate) || a.m!.box - b.m!.box);
  const notDue = known.filter((x) => x.m!.dueDate > today).sort((a, b) => a.m!.box - b.m!.box);

  const chosen: typeof indexed = [];
  const take = (list: typeof indexed, n: number) => {
    for (const x of list) {
      if (chosen.length >= size || n <= 0) break;
      if (chosen.includes(x)) continue;
      chosen.push(x);
      n--;
    }
  };
  take(fresh, Math.min(cfg.newPerRound, size));
  take(due, size);
  take(fresh, size);
  take(notDue, size);

  const optionCount = Math.max(2, Math.min(cfg.options || 4, deck.length));
  return shuffle(rng, chosen).map(({ idx, card, m }) => {
    const isNew = !m;
    const mode = modeFor(m?.box ?? 1, isNew, cfg.modes, rng);
    const item: VocabRoundItem = { idx, mode, isNew };
    if (mode === 'LOOK_PICK' || mode === 'LISTEN_PICK') {
      const distractors = shuffle(
        rng,
        deck
          .map((_, i) => i)
          .filter((i) => i !== idx && deck[i].emoji !== card.emoji && normalizeWord(deck[i].word) !== normalizeWord(card.word))
      ).slice(0, optionCount - 1);
      item.options = shuffle(rng, [idx, ...distractors]);
    } else if (mode === 'SPELL') {
      const letters = card.word.toLowerCase().split('');
      let scrambled = shuffle(rng, letters);
      for (let i = 0; i < 5 && letters.length > 1 && scrambled.join('') === letters.join(''); i++) scrambled = shuffle(rng, letters);
      item.letters = scrambled;
    }
    return item;
  });
}

export function isVocabAnswerCorrect(item: VocabRoundItem, deck: VocabCard[], answer: VocabAnswer): boolean {
  if (item.mode === 'LOOK_PICK' || item.mode === 'LISTEN_PICK') return answer === item.idx;
  if (typeof answer !== 'string') return false;
  return normalizeWord(answer) === normalizeWord(deck[item.idx].word);
}

export function gradeVocab(round: VocabRoundItem[], deck: VocabCard[], answers: VocabAnswer[]): GameResult & { results: boolean[] } {
  const results = round.map((item, i) => isVocabAnswerCorrect(item, deck, answers[i] ?? null));
  const correct = results.filter(Boolean).length;
  const ratio = round.length ? correct / round.length : 0;
  return {
    score: correct * 10,
    correct,
    total: round.length,
    stars: ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0,
    results,
  };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Leitner: benar → naik satu kotak, salah → kembali ke kotak 1 (diulang besok). */
export function nextMastery(prev: MasteryInfo | undefined, ok: boolean, today: string): MasteryInfo {
  const box = ok ? Math.min(5, (prev?.box ?? 0) + 1) : 1;
  return { box, dueDate: addDays(today, ok ? LEITNER_INTERVALS[box - 1] : 1) };
}
