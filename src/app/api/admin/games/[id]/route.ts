import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gameSets } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { parseGameSetPayload, toRow } from '@/lib/games/admin';
import { eq } from 'drizzle-orm';

type Params = { params: Promise<{ id: string }> };

async function findSet(id: string) {
  const [row] = await db.select({ id: gameSets.id }).from(gameSets).where(eq(gameSets.id, id)).limit(1);
  return row;
}

// Menyimpan perubahan set game (seluruh isi diganti payload editor). Tata letak TTS dihitung ulang.
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findSet(id))) return NextResponse.json({ error: 'Set game tidak ditemukan' }, { status: 404 });
    const payload = await parseGameSetPayload(await readJson(req), id);
    await db.update(gameSets).set(toRow(payload)).where(eq(gameSets.id, id));
    return NextResponse.json({ success: true, id, warnings: payload.warnings });
  } catch (error) {
    return apiError(error, 'Error updating game set');
  }
}

// Mengubah status terbit saja.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findSet(id))) return NextResponse.json({ error: 'Set game tidak ditemukan' }, { status: 404 });
    const { isPublished } = await readJson(req);
    if (typeof isPublished !== 'boolean') return NextResponse.json({ error: 'isPublished wajib boolean' }, { status: 400 });
    await db.update(gameSets).set({ isPublished, editedAt: new Date().toISOString() }).where(eq(gameSets.id, id));
    return NextResponse.json({ success: true, isPublished });
  } catch (error) {
    return apiError(error, 'Error toggling game set');
  }
}

// Menghapus set game beserta sesi & progres bermainnya (cascade).
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findSet(id))) return NextResponse.json({ error: 'Set game tidak ditemukan' }, { status: 404 });
    await db.delete(gameSets).where(eq(gameSets.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error deleting game set');
  }
}
