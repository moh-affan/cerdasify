import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learningContents } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { parseContentPayload, saveContent } from '@/lib/content-admin';
import { apiError, readJson } from '@/lib/api';
import { eq } from 'drizzle-orm';

type Params = { params: Promise<{ id: string }> };

async function findContent(id: string) {
  const [row] = await db.select({ id: learningContents.id }).from(learningContents).where(eq(learningContents.id, id)).limit(1);
  return row;
}

// Menyimpan perubahan konten (seluruh isi diganti dengan payload editor).
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findContent(id))) return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });

    const payload = await parseContentPayload(await readJson(req), id);
    await saveContent(id, payload, false);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return apiError(error, 'Error updating content');
  }
}

// Mengubah status terbit tanpa mengirim seluruh isi konten.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findContent(id))) return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });

    const { isPublished } = await readJson(req);
    if (typeof isPublished !== 'boolean') return NextResponse.json({ error: 'isPublished wajib boolean' }, { status: 400 });

    await db
      .update(learningContents)
      .set({ isPublished, editedAt: new Date().toISOString() })
      .where(eq(learningContents.id, id));
    return NextResponse.json({ success: true, isPublished });
  } catch (error) {
    return apiError(error, 'Error toggling content');
  }
}

// Menghapus konten beserta kosakata, catatan, kuis, dan progres baca (cascade).
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!(await findContent(id))) return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });

    await db.delete(learningContents).where(eq(learningContents.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Error deleting content');
  }
}
