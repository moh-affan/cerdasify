import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gameSets } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { parseGameSetPayload, toRow } from '@/lib/games/admin';

// Membuat set game baru (Admin & Super Admin). Ingat `npm run games:export` agar tersimpan di repo.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const payload = await parseGameSetPayload(await readJson(req));
    const id = `game_${payload.slug}`;
    await db.insert(gameSets).values({ id, ...toRow(payload) });
    return NextResponse.json({ success: true, id, warnings: payload.warnings });
  } catch (error) {
    return apiError(error, 'Error creating game set');
  }
}
