import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';
import * as schema from './schema';

loadEnvConfig(process.cwd());

let databaseUrl = process.env.DATABASE_URL || '';

// Auto-fix tenant ID format for Supabase pooler if needed
try {
  if (databaseUrl) {
    const u = new URL(databaseUrl);
    if (u.hostname.includes('pooler.supabase.com') && u.username === 'postgres') {
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]
        : 'slpncrcjzsgicopwudsd';
      u.username = `postgres.${projectRef}`;
      databaseUrl = u.toString();
    }
  }
} catch {}

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL environment variable is required in production.');
}

// Fallback dummy for build time if DATABASE_URL is not yet provided
const client = postgres(databaseUrl || 'postgresql://postgres:postgres@localhost:5432/cerdasify', {
  prepare: false, // Wajib false untuk Supabase connection pooler (transaction mode)
  ssl: databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com') ? 'require' : undefined,
  max: 10,
});

export const db = drizzle(client, { schema });
export { client };
