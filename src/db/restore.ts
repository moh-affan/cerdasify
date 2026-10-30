/**
 * Memulihkan database dari folder cadangan `npm run db:backup`.
 *
 *   npm run db:restore -- data/backups/<timestamp>            # cek saja (dry run)
 *   npm run db:restore -- data/backups/<timestamp> --confirm  # TIMPA seluruh isi tabel
 *
 * Langkah: migrasi idempoten → dalam satu transaksi: TRUNCATE semua tabel yang ada di cadangan,
 * lalu isi ulang sesuai urutan foreign key. Checksum tiap berkas diverifikasi lebih dulu.
 * Gambar di files/ tidak diunggah ulang otomatis; unggah manual ke bucket `uploads` bila bucket hilang.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { client } from './index';
import { runMigrations } from './migrate';

type Manifest = { createdAt: string; tables: { name: string; rows: number; sha256: string }[] };

async function main() {
  const dirArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!dirArg) throw new Error('Sebutkan folder cadangan, mis. data/backups/2026-10-30T10-00-00-000');
  const dir = path.resolve(dirArg);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')) as Manifest;

  const data = manifest.tables.map((t) => {
    const raw = fs.readFileSync(path.join(dir, 'tables', `${t.name}.json`), 'utf8');
    if (crypto.createHash('sha256').update(raw).digest('hex') !== t.sha256) throw new Error(`Checksum ${t.name}.json tidak cocok`);
    const rows = JSON.parse(raw) as Record<string, unknown>[];
    if (rows.length !== t.rows) throw new Error(`Jumlah baris ${t.name} tidak cocok`);
    return { name: t.name, rows };
  });
  console.log(`Cadangan ${manifest.createdAt}: ${data.map((d) => `${d.name}=${d.rows.length}`).join(', ')}`);
  if (!process.argv.includes('--confirm')) {
    console.log('Dry run: tidak ada yang diubah. Tambahkan --confirm untuk menimpa database.');
    return;
  }

  await runMigrations();
  await client.begin(async (tx) => {
    await tx.unsafe(`TRUNCATE ${data.map((d) => `"${d.name}"`).join(', ')} CASCADE`);
    for (const { name, rows } of data) {
      for (let i = 0; i < rows.length; i += 500) {
        const part = JSON.stringify(rows.slice(i, i + 500));
        await tx.unsafe(`INSERT INTO "${name}" SELECT * FROM json_populate_recordset(NULL::"${name}", $1::json)`, [part]);
      }
      console.log(`  ${name}: ${rows.length} baris dipulihkan`);
    }
  });
  console.log('Pemulihan selesai.');
}

if (require.main === module) {
  main()
    .then(() => client.end())
    .catch(async (err) => {
      console.error('Restore gagal:', err instanceof Error ? err.message : err);
      await client.end();
      process.exit(1);
    });
}
