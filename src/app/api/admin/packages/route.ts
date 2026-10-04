import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examPackages, packageQuestions, categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    const pkgs = await db.select().from(examPackages).orderBy(desc(examPackages.createdAt));
    return NextResponse.json({ packages: pkgs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { title, categoryId, durationMinutes = 60, type = 'SIMULATION' } = body;

    if (!title || !categoryId) {
      return NextResponse.json({ error: 'Judul dan Kategori wajib diisi' }, { status: 400 });
    }

    const pkgId = `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const pkgSlug = `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

    await db.insert(examPackages)
      .values({
        id: pkgId,
        title,
        slug: pkgSlug,
        categoryId,
        type,
        durationMinutes: parseInt(durationMinutes, 10) || 60,
        isPublished: true,
      });

    return NextResponse.json({ success: true, packageId: pkgId });
  } catch (error: any) {
    console.error('Error creating package:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
