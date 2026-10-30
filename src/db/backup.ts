/**
 * Cadangan penuh database Cerdasify (semua tabel skema public) ke data/backups/<timestamp>/.
 *
 *   npm run db:backup            # tabel + berkas gambar Supabase Storage yang dirujuk
 *   npm run db:backup -- --no-files
 *
 * Isi folder cadangan:
 *   manifest.json      waktu, jumlah baris, urutan tabel (sesuai foreign key), checksum tiap berkas
 *   tables/<tabel>.json baris tabel, urut berdasarkan primary key (stabil, mudah dibandingkan)
 *   files/...           salinan gambar dari Supabase Storage (URL http) yang disebut di data
 *
 * Pulihkan dengan `npm run db:restore -- data/backups/<timestamp> --confirm`.
 * Berisi data pribadi (hash password, hasil ujian): jangan di-commit; folder ini ada di .gitignore.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { client } from './index';

export const BACKUP_ROOT = path.join(process.cwd(), 'data/backups');

/** Daftar tabel public, diurutkan agar tabel induk (yang dirujuk foreign key) muncul lebih dulu. */
export async function tablesInDependencyOrder(): Promise<string[]> {
  const tables = (await client`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`).map((r) => r.table_name as string);
  const fks = await client`
    SELECT DISTINCT tc.table_name AS child, ccu.table_name AS parent
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'`;
  const deps = new Map(tables.map((t) => [t, new Set<string>()]));
  for (const r of fks) if (r.child !== r.parent && deps.has(r.child)) deps.get(r.child)!.add(r.parent);
  const order: string[] = [];
  const visit = (t: string, stack = new Set<string>()) => {
    if (order.includes(t) || stack.has(t)) return;
    stack.add(t);
    for (const p of deps.get(t) ?? []) visit(p, stack);
    order.push(t);
  };
  tables.forEach((t) => visit(t));
  return order;
}

async function primaryKey(table: string): Promise<string[]> {
  const rows = await client`
    SELECT a.attname FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = ${'public.' + table}::regclass AND i.indisprimary ORDER BY a.attnum`;
  return rows.map((r) => r.attname as string);
}

const sha256 = (buf: Buffer | string) => crypto.createHash('sha256').update(buf).digest('hex');
const STORAGE_URL = /https?:\/\/[^\s"'()<>]+\/storage\/v1\/object\/public\/[^\s"'()<>]+/g;

async function main() {
  const withFiles = !process.argv.includes('--no-files');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('Z', '');
  const dir = path.join(BACKUP_ROOT, stamp);
  fs.mkdirSync(path.join(dir, 'tables'), { recursive: true });

  const order = await tablesInDependencyOrder();
  const manifest: {
    createdAt: string; tables: { name: string; rows: number; sha256: string }[]; files: { url: string; path: string; sha256?: string; error?: string }[];
  } = { createdAt: new Date().toISOString(), tables: [], files: [] };
  const urls = new Set<string>();

  for (const table of order) {
    const pk = await primaryKey(table);
    const orderBy = pk.length ? ` ORDER BY ${pk.map((c) => `"${c}"`).join(', ')}` : '';
    const rows = await client.unsafe(`SELECT * FROM "${table}"${orderBy}`);
    const json = JSON.stringify(rows, null, 1) + '\n';
    fs.writeFileSync(path.join(dir, 'tables', `${table}.json`), json);
    manifest.tables.push({ name: table, rows: rows.length, sha256: sha256(json) });
    if (withFiles) for (const m of json.matchAll(STORAGE_URL)) urls.add(m[0].replace(/\\+$/, ''));
    console.log(`  ${table}: ${rows.length} baris`);
  }

  for (const url of urls) {
    const rel = path.join('files', decodeURIComponent(new URL(url).pathname.split('/storage/v1/object/public/')[1]));
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
      fs.writeFileSync(path.join(dir, rel), buf);
      manifest.files.push({ url, path: rel, sha256: sha256(buf) });
    } catch (e) {
      manifest.files.push({ url, path: rel, error: e instanceof Error ? e.message : String(e) });
    }
  }

  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const failed = manifest.files.filter((f) => f.error).length;
  console.log(`Cadangan selesai: ${path.relative(process.cwd(), dir)} (${manifest.tables.length} tabel, ${manifest.files.length - failed} berkas${failed ? `, ${failed} gagal diunduh` : ''})`);
}

if (require.main === module) {
  main()
    .then(() => client.end())
    .catch(async (err) => {
      console.error('Backup gagal:', err instanceof Error ? err.message : err);
      await client.end();
      process.exit(1);
    });
}
