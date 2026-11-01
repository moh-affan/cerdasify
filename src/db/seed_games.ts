// Seeder fitur Bermain: set game bawaan (seed-data/games) + set hasil edit admin (admin-overrides.json).
// - Semua set divalidasi dulu (validateGameData) sebelum ada yang ditulis; tata letak TTS dihitung di sini.
// - Idempoten, satu transaksi. Set yang sudah diedit lewat panel admin (edited_at terisi) dilewati kecuali --force.
// - Progres & sesi bermain pengguna tidak tersentuh; set yang tidak ada di sumber tidak dihapus.

import fs from 'fs';
import path from 'path';
import { db, client } from './index';
import { runMigrations } from './migrate';
import { gameSets, subjects } from './schema';
import { inArray } from 'drizzle-orm';
import { SUBJECTS } from './seed-data/subjects';
import { GAME_SETS, type SeedGameSet } from './seed-data/games';
import { validateGameData } from '../lib/games/validate';
import { isPhase, phaseIndex } from '../lib/learning';
import type { GameEngine } from '../lib/games/types';

const FORCE = process.argv.includes('--force');
export const OVERRIDES_FILE = path.join(__dirname, 'seed-data/games/admin-overrides.json');

/** Bentuk satu set di admin-overrides.json (hasil `npm run games:export`). */
export interface OverrideSet {
  id: string;
  slug: string;
  engine: GameEngine;
  subjectId: string;
  phaseMin: string;
  phaseMax: string;
  title: string;
  description: string | null;
  coverEmoji: string | null;
  config: unknown;
  items: unknown;
  orderIndex: number;
  isPublished: boolean;
  editedAt: string | null;
}

function loadOverrides(): OverrideSet[] {
  if (!fs.existsSync(OVERRIDES_FILE)) return [];
  return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8')) as OverrideSet[];
}

export async function seedGames() {
  console.log('--- Seeding Bermain (game edukasi) ---');
  await runMigrations();

  const overrides = loadOverrides();
  const overrideSlugs = new Set(overrides.map((o) => o.slug));
  const subjectIds = new Set(SUBJECTS.map((s) => s.id));

  type Row = typeof gameSets.$inferInsert;
  const rows: Row[] = [];
  const problems: string[] = [];
  const addRow = (src: SeedGameSet | OverrideSet, orderIndex: number, extra: Partial<Row>) => {
    try {
      if (!isPhase(src.phaseMin) || !isPhase(src.phaseMax) || phaseIndex(src.phaseMin) > phaseIndex(src.phaseMax)) {
        throw new Error('rentang fase tidak valid');
      }
      if (!subjectIds.has(src.subjectId)) throw new Error(`mapel ${src.subjectId} tidak dikenal`);
      const { config, items, warnings } = validateGameData(src.engine, src.config, src.items ?? null);
      warnings.forEach((w) => console.warn(`  ⚠️  ${src.slug}: ${w}`));
      rows.push({
        id: `game_${src.slug}`,
        slug: src.slug,
        engine: src.engine,
        subjectId: src.subjectId,
        phaseMin: src.phaseMin,
        phaseMax: src.phaseMax,
        title: src.title,
        description: 'description' in src ? src.description : null,
        coverEmoji: 'emoji' in src ? src.emoji : src.coverEmoji,
        configJson: JSON.stringify(config),
        itemsJson: items === null || items === undefined ? null : JSON.stringify(items),
        orderIndex,
        isPublished: true,
        editedAt: null,
        ...extra,
      });
    } catch (err) {
      problems.push(`${src.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  GAME_SETS.forEach((s, i) => {
    if (!overrideSlugs.has(s.slug)) addRow(s, 100 + i, {});
  });
  for (const o of overrides) {
    addRow(o, o.orderIndex, { id: o.id, isPublished: o.isPublished, editedAt: o.editedAt ?? new Date().toISOString() });
  }
  if (new Set(rows.map((r) => r.slug)).size !== rows.length) problems.push('Ada slug set game ganda');
  if (problems.length) throw new Error(`Data set game tidak valid:\n- ${problems.join('\n- ')}`);

  const skipped: string[] = [];
  await db.transaction(async (tx) => {
    for (const s of SUBJECTS) {
      await tx.insert(subjects).values(s).onConflictDoNothing();
    }
    const existing = await tx
      .select({ id: gameSets.id, slug: gameSets.slug, editedAt: gameSets.editedAt })
      .from(gameSets)
      .where(inArray(gameSets.slug, rows.map((r) => r.slug)));
    const edited = new Map(existing.map((e) => [e.slug, e]));
    for (const row of rows) {
      const current = edited.get(row.slug);
      if (current?.editedAt && !FORCE && !overrideSlugs.has(row.slug)) {
        skipped.push(row.slug);
        continue;
      }
      // Pertahankan id lama bila slug sudah ada (progres pengguna merujuk id)
      const values = current ? { ...row, id: current.id } : row;
      const { id: _id, ...update } = values;
      void _id;
      await tx.insert(gameSets).values(values).onConflictDoUpdate({ target: gameSets.slug, set: update });
    }
  });

  const byEngine = new Map<string, number>();
  for (const r of rows) byEngine.set(r.engine, (byEngine.get(r.engine) ?? 0) + 1);
  console.log(`Set game: ${rows.length} (${[...byEngine].map(([e, n]) => `${e} ${n}`).join(', ')})`);
  if (overrides.length) console.log(`Termasuk ${overrides.length} set dari admin-overrides.json`);
  if (skipped.length) console.log(`Dilewati karena sudah diedit di panel admin (jalankan games:export lalu seed, atau pakai --force): ${skipped.join(', ')}`);
}

if (require.main === module) {
  seedGames()
    .then(async () => {
      await client.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seeding Bermain gagal:', err);
      await client.end();
      process.exit(1);
    });
}
