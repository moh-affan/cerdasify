import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examPackages } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });
    }

    const nextState = !pkg.isPublished;
    await db.update(examPackages).set({ isPublished: nextState }).where(eq(examPackages.id, id));

    return NextResponse.json({ success: true, isPublished: nextState });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
