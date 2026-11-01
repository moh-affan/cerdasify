/**
 * Ekspor set game yang dibuat/diedit lewat panel admin ke src/db/seed-data/games/admin-overrides.json,
 * agar `npm run seed:games` berikutnya tidak menimpa perubahan tersebut:
 *   npm run games:export
 */
import fs from 'fs';
import { db, client } from './index';
import { gameSets } from './schema';
import { asc, isNotNull } from 'drizzle-orm';
import { OVERRIDES_FILE, type OverrideSet } from './seed_games';

async function main() {
  const rows = await db.select().from(gameSets).where(isNotNull(gameSets.editedAt)).orderBy(asc(gameSets.slug));
  const out: OverrideSet[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    engine: r.engine,
    subjectId: r.subjectId,
    phaseMin: r.phaseMin,
    phaseMax: r.phaseMax,
    title: r.title,
    description: r.description,
    coverEmoji: r.coverEmoji,
    config: JSON.parse(r.configJson),
    // TTS Kata: cukup simpan daftar kata; tata letak dihitung ulang saat seeding
    items: r.engine === 'CROSSWORD' && r.itemsJson ? { words: JSON.parse(r.itemsJson).words } : r.itemsJson ? JSON.parse(r.itemsJson) : null,
    orderIndex: r.orderIndex,
    isPublished: r.isPublished,
    editedAt: r.editedAt,
  }));
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`Diekspor ${out.length} set game ke ${OVERRIDES_FILE}`);
}

main()
  .then(async () => {
    await client.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Ekspor set game gagal:', err);
    await client.end();
    process.exit(1);
  });
