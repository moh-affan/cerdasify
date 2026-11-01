// Tipe bersama fitur Bermain (game edukasi). Game = engine (kode) + set (data di tabel game_sets).

export const GAME_ENGINES = ['MATH_SPRINT', 'MEMORY_MATCH', 'CROSSMATH', 'CROSSWORD', 'VOCAB_PICTURE'] as const;
export type GameEngine = (typeof GAME_ENGINES)[number];

export const isGameEngine = (v: unknown): v is GameEngine =>
  typeof v === 'string' && (GAME_ENGINES as readonly string[]).includes(v);

export const ENGINE_INFO: Record<GameEngine, { label: string; emoji: string; howTo: string[] }> = {
  MATH_SPRINT: {
    label: 'Kilat Hitung',
    emoji: '⚡',
    howTo: [
      'Jawab soal sebanyak mungkin sebelum waktu habis.',
      'Ketik jawaban dengan tombol angka, lalu tekan ✓.',
      'Benar 3 kali berturut-turut, soal jadi lebih menantang!',
    ],
  },
  MEMORY_MATCH: {
    label: 'Kartu Kembar',
    emoji: '🃏',
    howTo: [
      'Buka dua kartu untuk mencari pasangannya.',
      'Kartu berpasangan tetap terbuka.',
      'Semakin sedikit langkah, semakin banyak bintang.',
    ],
  },
  CROSSMATH: {
    label: 'Silang Angka',
    emoji: '✖️',
    howTo: [
      'Isi kotak kosong agar semua persamaan mendatar dan menurun benar.',
      'Ketuk angka di bawah, lalu ketuk kotak kosong.',
      'Tekan "Cek" bila semua kotak sudah terisi.',
    ],
  },
  CROSSWORD: {
    label: 'TTS Kata',
    emoji: '🧩',
    howTo: [
      'Ketuk kotak, lalu ketik huruf jawaban sesuai petunjuk.',
      'Ketuk kotak yang sama sekali lagi untuk ganti arah (mendatar/menurun).',
      'Gunakan bantuan huruf bila buntu, tapi bintangmu berkurang.',
    ],
  },
  VOCAB_PICTURE: {
    label: 'Kosakata Bergambar',
    emoji: '🖼️',
    howTo: [
      'Kenali kata baru beserta gambar dan suaranya.',
      'Jawab tantangan: pilih kata, pilih gambar, atau susun hurufnya.',
      'Kata yang sering salah akan muncul lagi agar cepat hafal.',
    ],
  },
};

export type Op = '+' | '-' | '×' | '÷' | '²' | '√';
export const OPS: readonly Op[] = ['+', '-', '×', '÷', '²', '√'];

/** Satu kata bergambar (dek kosakata / kartu). */
export interface VocabCard {
  word: string;
  meaning: string;
  emoji: string;
}

/** Pasangan bebas untuk Kartu Kembar mode CUSTOM. */
export interface CustomPair {
  a: string;
  b: string;
}

// ─── Konfigurasi per engine ─────────────────────────────────────────────────

export interface MathSprintConfig {
  /** ARITH = operasi hitung; MAKE_TARGET = pasangan jumlah target; COMPARE = <,=,>; TIU = persen & pecahan */
  mode: 'ARITH' | 'MAKE_TARGET' | 'COMPARE' | 'TIU';
  durationSec: number;
  ops: Op[];
  /** Batas hasil +/− pada level 1 dan level 5 */
  max: number;
  maxCap: number;
  /** Batas faktor ×/÷/²/√ pada level 1 dan level 5 */
  factorMax?: number;
  factorCap?: number;
  allowNegative?: boolean;
  target?: number;
  /** Ambang jumlah benar untuk ★, ★★, ★★★ (★★★ juga butuh akurasi ≥ 80%) */
  stars: [number, number, number];
}

export interface MemoryConfig {
  pairMode: 'WORD_EMOJI' | 'WORD_MEANING' | 'EXPR_RESULT' | 'NUMBER_DOTS' | 'CUSTOM';
  pairs: number;
  /** Ucapkan kata Inggris saat kartu dibuka */
  speak?: boolean;
  ops?: Op[];
  max?: number;
  /** CONTENT_VOCAB = kartu diambil dari kosakata satu bacaan (?konten=slug) */
  source?: 'ITEMS' | 'CONTENT_VOCAB';
}

export interface CrossMathConfig {
  rounds: number;
  ops: Op[];
  max: number;
  /** Jumlah kotak kosong per puzzle (dari 9 angka) */
  hidden: number;
  /** true = tersedia bank angka (tanpa keypad) */
  bank: boolean;
  allowNegative?: boolean;
}

export interface CrosswordConfig {
  lang: 'en' | 'id';
  speak?: boolean;
}

export const VOCAB_MODES = ['LOOK_PICK', 'LISTEN_PICK', 'SPELL', 'TYPE'] as const;
export type VocabMode = (typeof VOCAB_MODES)[number];

export interface VocabConfig {
  roundSize: number;
  newPerRound: number;
  modes: VocabMode[];
  /** Jumlah pilihan pada mode pilih (3 atau 4) */
  options: number;
  speak: boolean;
}

export type GameConfig = MathSprintConfig | MemoryConfig | CrossMathConfig | CrosswordConfig | VocabConfig;

// ─── TTS Kata ───────────────────────────────────────────────────────────────

export interface CrosswordWord {
  answer: string;
  clue: string;
  emoji?: string;
}

export interface CrosswordEntry {
  num: number;
  dir: 'A' | 'D';
  row: number;
  col: number;
  answer: string;
  clue: string;
  emoji?: string;
}

export interface CrosswordLayout {
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
}

/** items_json engine CROSSWORD: daftar kata sumber + tata letak hasil generator. */
export interface CrosswordItems {
  words: CrosswordWord[];
  layout: CrosswordLayout;
}

/** Versi tata letak yang aman dikirim ke browser (tanpa jawaban). */
export interface PublicCrosswordEntry {
  num: number;
  dir: 'A' | 'D';
  row: number;
  col: number;
  length: number;
  clue: string;
  emoji?: string;
}

export interface PublicCrossword {
  rows: number;
  cols: number;
  entries: PublicCrosswordEntry[];
}

// ─── Hasil ──────────────────────────────────────────────────────────────────

export interface GameResult {
  score: number;
  correct: number;
  total: number;
  stars: number;
}

/** Data set game yang dikirim ke halaman main. */
export interface PlayableSet {
  id: string;
  slug: string;
  engine: GameEngine;
  title: string;
  description: string | null;
  coverEmoji: string | null;
  config: GameConfig;
  /** Isi sesuai engine; untuk CROSSWORD berupa PublicCrossword (tanpa jawaban) */
  items: unknown;
  /** Konteks tambahan (slug bacaan untuk kartu kosakata bacaan) */
  context: string | null;
}
