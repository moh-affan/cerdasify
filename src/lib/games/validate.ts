// Validasi config & items set game. Dipakai seeder (npm run seed:games) dan editor admin,
// sehingga data yang masuk database selalu bisa dimainkan engine-nya.

import { buildCrosswordLayout, normalizeAnswer } from './crossword';
import {
  OPS,
  VOCAB_MODES,
  type CrossMathConfig,
  type CrosswordConfig,
  type CrosswordItems,
  type CrosswordWord,
  type CustomPair,
  type GameConfig,
  type GameEngine,
  type MathSprintConfig,
  type MemoryConfig,
  type Op,
  type VocabCard,
  type VocabConfig,
} from './types';

export class GameDataError extends Error {}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

function int(o: Obj, k: string, min: number, max: number, fallback?: number): number {
  const v = o[k] ?? fallback;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) {
    throw new GameDataError(`config.${k} harus bilangan bulat ${min}–${max}`);
  }
  return v;
}

function ops(o: Obj, fallback: Op[]): Op[] {
  const v = o.ops ?? fallback;
  if (!Array.isArray(v) || !v.length || !v.every((x) => (OPS as readonly unknown[]).includes(x))) {
    throw new GameDataError(`config.ops harus berisi operasi dari: ${OPS.join(' ')}`);
  }
  return v as Op[];
}

function oneOf<T extends string>(o: Obj, k: string, values: readonly T[], fallback?: T): T {
  const v = o[k] ?? fallback;
  if (typeof v !== 'string' || !values.includes(v as T)) throw new GameDataError(`config.${k} harus salah satu dari: ${values.join(', ')}`);
  return v as T;
}

function vocabCards(items: unknown, min: number): VocabCard[] {
  if (!Array.isArray(items)) throw new GameDataError('items harus berupa daftar kata');
  const cards = items.map((x, i) => {
    if (!isObj(x) || typeof x.word !== 'string' || !x.word.trim() || typeof x.meaning !== 'string' || !x.meaning.trim() || typeof x.emoji !== 'string' || !x.emoji.trim()) {
      throw new GameDataError(`Kata #${i + 1}: word, meaning, dan emoji wajib diisi`);
    }
    return { word: x.word.trim(), meaning: x.meaning.trim(), emoji: x.emoji.trim() };
  });
  const words = new Set<string>();
  for (const c of cards) {
    const k = c.word.toLowerCase();
    if (words.has(k)) throw new GameDataError(`Kata "${c.word}" ganda`);
    words.add(k);
  }
  if (cards.length < min) throw new GameDataError(`Minimal ${min} kata`);
  return cards;
}

export interface ValidatedSet {
  config: GameConfig;
  items: unknown;
  /** Peringatan non-fatal, mis. kata TTS yang tidak bisa disilangkan */
  warnings: string[];
}

export function validateGameData(engine: GameEngine, rawConfig: unknown, rawItems: unknown): ValidatedSet {
  const c = isObj(rawConfig) ? rawConfig : {};
  const warnings: string[] = [];

  switch (engine) {
    case 'MATH_SPRINT': {
      const stars = c.stars;
      if (!Array.isArray(stars) || stars.length !== 3 || !stars.every((s) => Number.isInteger(s) && s > 0) || !(stars[0] <= stars[1] && stars[1] <= stars[2])) {
        throw new GameDataError('config.stars harus [★, ★★, ★★★] menaik, mis. [8, 15, 22]');
      }
      const config: MathSprintConfig = {
        mode: oneOf(c, 'mode', ['ARITH', 'MAKE_TARGET', 'COMPARE', 'TIU'] as const, 'ARITH'),
        durationSec: int(c, 'durationSec', 20, 300, 60),
        ops: ops(c, ['+']),
        max: int(c, 'max', 2, 10000, 20),
        maxCap: int(c, 'maxCap', 2, 100000, (c.max as number) ?? 20),
        ...(c.factorMax !== undefined ? { factorMax: int(c, 'factorMax', 2, 100) } : {}),
        ...(c.factorCap !== undefined ? { factorCap: int(c, 'factorCap', 2, 100) } : {}),
        ...(c.allowNegative ? { allowNegative: true } : {}),
        ...(c.target !== undefined ? { target: int(c, 'target', 3, 1000) } : {}),
        stars: stars as [number, number, number],
      };
      if (config.maxCap < config.max) throw new GameDataError('config.maxCap tidak boleh lebih kecil dari max');
      return { config, items: null, warnings };
    }
    case 'MEMORY_MATCH': {
      const config: MemoryConfig = {
        pairMode: oneOf(c, 'pairMode', ['WORD_EMOJI', 'WORD_MEANING', 'EXPR_RESULT', 'NUMBER_DOTS', 'CUSTOM'] as const),
        pairs: int(c, 'pairs', 3, 12, 6),
        ...(c.speak ? { speak: true } : {}),
        ...(c.ops !== undefined ? { ops: ops(c, ['+']) } : {}),
        ...(c.max !== undefined ? { max: int(c, 'max', 3, 1000) } : {}),
        ...(c.source === 'CONTENT_VOCAB' ? { source: 'CONTENT_VOCAB' as const } : {}),
      };
      let items: unknown = null;
      if (config.source === 'CONTENT_VOCAB') {
        items = null;
      } else if (config.pairMode === 'WORD_EMOJI' || config.pairMode === 'WORD_MEANING') {
        items = vocabCards(rawItems, config.pairs);
      } else if (config.pairMode === 'CUSTOM') {
        if (!Array.isArray(rawItems)) throw new GameDataError('items harus berupa daftar pasangan { a, b }');
        const pairs: CustomPair[] = rawItems.map((x, i) => {
          if (!isObj(x) || typeof x.a !== 'string' || !x.a.trim() || typeof x.b !== 'string' || !x.b.trim()) {
            throw new GameDataError(`Pasangan #${i + 1}: a dan b wajib diisi`);
          }
          return { a: x.a.trim(), b: x.b.trim() };
        });
        if (pairs.length < config.pairs) throw new GameDataError(`Minimal ${config.pairs} pasangan`);
        items = pairs;
      } else if (config.pairMode === 'NUMBER_DOTS' && config.pairs > 10) {
        throw new GameDataError('Mode NUMBER_DOTS maksimal 10 pasang');
      }
      return { config, items, warnings };
    }
    case 'CROSSMATH': {
      const config: CrossMathConfig = {
        rounds: int(c, 'rounds', 1, 10, 3),
        ops: ops(c, ['+', '-']).filter((o) => o === '+' || o === '-' || o === '×' || o === '÷'),
        max: int(c, 'max', 5, 1000, 20),
        hidden: int(c, 'hidden', 1, 6, 3),
        bank: c.bank !== false,
        ...(c.allowNegative ? { allowNegative: true } : {}),
      };
      if (!config.ops.length) throw new GameDataError('Silang Angka hanya mendukung operasi + − × ÷');
      return { config, items: null, warnings };
    }
    case 'CROSSWORD': {
      const config: CrosswordConfig = {
        lang: oneOf(c, 'lang', ['en', 'id'] as const, 'id'),
        ...(c.speak ? { speak: true } : {}),
      };
      const source = isObj(rawItems) ? rawItems.words : rawItems;
      if (!Array.isArray(source)) throw new GameDataError('items.words harus berupa daftar { answer, clue, emoji? }');
      const words: CrosswordWord[] = source.map((x, i) => {
        if (!isObj(x) || typeof x.answer !== 'string' || typeof x.clue !== 'string' || !x.clue.trim()) {
          throw new GameDataError(`Kata #${i + 1}: answer dan clue wajib diisi`);
        }
        const answer = normalizeAnswer(x.answer);
        if (answer.length < 2 || answer.length > 15) throw new GameDataError(`Kata "${x.answer}": 2–15 huruf A–Z tanpa spasi`);
        return { answer, clue: x.clue.trim(), ...(typeof x.emoji === 'string' && x.emoji.trim() ? { emoji: x.emoji.trim() } : {}) };
      });
      if (words.length < 3) throw new GameDataError('Minimal 3 kata');
      if (new Set(words.map((w) => w.answer)).size !== words.length) throw new GameDataError('Ada jawaban ganda');
      const { layout, unplaced } = buildCrosswordLayout(words);
      if (unplaced.length) warnings.push(`Tidak bisa disilangkan & dilewati: ${unplaced.join(', ')}`);
      if (layout.entries.length < 3) throw new GameDataError('Kurang dari 3 kata yang bisa disilangkan');
      if (layout.rows > 15 || layout.cols > 15) throw new GameDataError(`Grid terlalu besar (${layout.rows}×${layout.cols}); kurangi kata`);
      const items: CrosswordItems = { words, layout };
      return { config, items, warnings };
    }
    case 'VOCAB_PICTURE': {
      const modes = c.modes ?? ['LOOK_PICK', 'LISTEN_PICK'];
      if (!Array.isArray(modes) || !modes.length || !modes.every((m) => (VOCAB_MODES as readonly unknown[]).includes(m))) {
        throw new GameDataError(`config.modes harus berisi: ${VOCAB_MODES.join(', ')}`);
      }
      const config: VocabConfig = {
        roundSize: int(c, 'roundSize', 4, 20, 10),
        newPerRound: int(c, 'newPerRound', 1, 20, 3),
        modes: modes as VocabConfig['modes'],
        options: int(c, 'options', 2, 6, 4),
        speak: c.speak !== false,
      };
      const items = vocabCards(rawItems, Math.max(config.options, 4));
      if (config.modes.some((m) => m === 'SPELL' || m === 'TYPE')) {
        const bad = items.filter((w) => !/^[a-z]+$/i.test(w.word)).map((w) => w.word);
        if (bad.length) throw new GameDataError(`Mode SPELL/TYPE butuh kata satu kata huruf saja: ${bad.join(', ')}`);
      }
      return { config, items, warnings };
    }
  }
}
