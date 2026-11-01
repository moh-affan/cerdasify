/**
 * Daftar kandidat kosakata bergambar dari bacaan bahasa Inggris (tanpa akses database).
 * Hanya kata tunggal huruf a–z yang punya emoji dan belum ada di dek game mana pun.
 * Hasilnya WAJIB ditinjau manual (kecocokan emoji & arti) sebelum disalin ke seed-data/games/vocab-decks.ts.
 *   npm run games:vocab-candidates [-- --min=2]
 */
import * as decks from './seed-data/games/vocab-decks';
import type { SeedReading } from './seed-data/learning/types';
import { englishPhaseA } from './seed-data/learning/english-phase-a';
import { englishPhaseAYear1 } from './seed-data/learning/english-phase-a-year-1';
import { englishPhaseAYear2 } from './seed-data/learning/english-phase-a-year-2';
import { englishPhaseAYear3 } from './seed-data/learning/english-phase-a-year-3';
import { englishPhaseAYear4 } from './seed-data/learning/english-phase-a-year-4';
import { englishPhaseAYear5 } from './seed-data/learning/english-phase-a-year-5';
import { englishPhaseAYear6 } from './seed-data/learning/english-phase-a-year-6';
import { englishPhaseAYear7 } from './seed-data/learning/english-phase-a-year-7';
import { englishPhaseB } from './seed-data/learning/english-phase-b';
import { englishPhaseD } from './seed-data/learning/english-phase-d';

const minArg = process.argv.find((a) => a.startsWith('--min='));
const MIN = minArg ? Number(minArg.slice(6)) : 1;

const readings: SeedReading[] = [
  ...englishPhaseA,
  ...englishPhaseAYear1,
  ...englishPhaseAYear2,
  ...englishPhaseAYear3,
  ...englishPhaseAYear4,
  ...englishPhaseAYear5,
  ...englishPhaseAYear6,
  ...englishPhaseAYear7,
  ...englishPhaseB,
  ...englishPhaseD,
];

const inDecks = new Set(Object.values(decks).flatMap((d) => d.map((c) => c.word.toLowerCase())));
const found = new Map<string, { meaning: string; emoji: string; pos?: string; count: number }>();
for (const r of readings) {
  for (const [word, meaning, emoji, pos] of r.vocab) {
    const w = word.trim().toLowerCase();
    if (!emoji || !/^[a-z]+$/.test(w) || inDecks.has(w)) continue;
    const prev = found.get(w);
    if (prev) prev.count++;
    else found.set(w, { meaning, emoji, pos, count: 1 });
  }
}

const rows = [...found.entries()].filter(([, v]) => v.count >= MIN).sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
for (const [w, v] of rows) console.log(`${String(v.count).padStart(3)}  ${v.emoji}  ${w.padEnd(14)} ${v.meaning}${v.pos ? `  (${v.pos})` : ''}`);
console.log(`\n${rows.length} kandidat (muncul ≥ ${MIN}×). Tinjau manual sebelum dipakai.`);
