import { loadEnvConfig } from '@next/env';
import postgres from 'postgres';

loadEnvConfig(process.cwd());

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di environment (.env.local).');
  process.exit(1);
}

// Auto-fix tenant ID format for Supabase pooler if needed
try {
  const u = new URL(databaseUrl);
  if (u.hostname.includes('pooler.supabase.com') && u.username === 'postgres') {
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]
      : 'slpncrcjzsgicopwudsd';
    u.username = `postgres.${projectRef}`;
    databaseUrl = u.toString();
  }
} catch {}

async function testConnection() {
  console.log('Menghubungi database PostgreSQL...');
  let sql: any;
  try {
    sql = postgres(databaseUrl!, {
      max: 1,
      connect_timeout: 10,
      ssl: 'require',
    });

    const result = await sql`SELECT 1 + 1 AS result, version()`;
    if (result && result.length > 0) {
      console.log('STATUS: KONEKSI BERHASIL!');
      console.log('Database PostgreSQL Supabase terhubung dengan aman dan lancar.');
    } else {
      console.error('STATUS: GAGAL, tidak ada respon dari database.');
    }
  } catch (error: any) {
    console.error('STATUS: KONEKSI GAGAL');
    console.error('Pesan Error:', error.message || error);
  } finally {
    if (sql) {
      await sql.end();
    }
    process.exit(0);
  }
}

testConnection();
