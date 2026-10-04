import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examPackages, packageQuestions, categories, attempts } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { desc, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const categoryId = url.searchParams.get('categoryId') || '';
    const type = url.searchParams.get('type') || '';
    const status = url.searchParams.get('status') || ''; // 'published' | 'draft'

    const allPkgs = await db.select().from(examPackages).orderBy(desc(examPackages.createdAt));
    const allCats = await db.select().from(categories).orderBy(asc(categories.orderIndex));
    const catMap = new Map(allCats.map((c) => [c.id, c.name]));

    // Question counts per package
    const allPkgQuestions = await db.select().from(packageQuestions);
    const pkgQuestionCountMap = new Map<string, number>();
    for (const pq of allPkgQuestions) {
      pkgQuestionCountMap.set(pq.packageId, (pkgQuestionCountMap.get(pq.packageId) || 0) + 1);
    }

    // Attempts and performance per package
    const allAttempts = await db.select().from(attempts);
    const pkgAttemptsMap = new Map<string, { total: number; completed: number; scoreSum: number; passCount: number }>();
    for (const att of allAttempts) {
      if (!pkgAttemptsMap.has(att.packageId)) {
        pkgAttemptsMap.set(att.packageId, { total: 0, completed: 0, scoreSum: 0, passCount: 0 });
      }
      const stat = pkgAttemptsMap.get(att.packageId)!;
      stat.total += 1;
      if (att.status === 'COMPLETED' || att.status === 'TIMED_OUT') {
        stat.completed += 1;
        stat.scoreSum += att.scoreTotal || 0;
        if (att.isPassed) stat.passCount += 1;
      }
    }

    let filtered = allPkgs.map((pkg) => {
      const stats = pkgAttemptsMap.get(pkg.id) || { total: 0, completed: 0, scoreSum: 0, passCount: 0 };
      const avgScore = stats.completed > 0 ? Math.round(stats.scoreSum / stats.completed) : null;
      const passRate = stats.completed > 0 ? Math.round((stats.passCount / stats.completed) * 100) : null;

      return {
        ...pkg,
        categoryName: catMap.get(pkg.categoryId) || 'Umum',
        questionCount: pkgQuestionCountMap.get(pkg.id) || 0,
        attemptCount: stats.total,
        completedCount: stats.completed,
        avgScore,
        passRate,
      };
    });

    if (categoryId) {
      filtered = filtered.filter((p) => p.categoryId === categoryId);
    }
    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }
    if (status === 'published') {
      filtered = filtered.filter((p) => p.isPublished === true);
    } else if (status === 'draft') {
      filtered = filtered.filter((p) => p.isPublished === false);
    }
    if (search) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search) ||
        p.slug.toLowerCase().includes(search) ||
        p.categoryName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ packages: filtered, categories: allCats });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      categoryId,
      durationMinutes = 60,
      type = 'SIMULATION',
      shuffleQuestions = false,
      shuffleOptions = false,
      passingGradeRules = null,
      isPublished = true,
    } = body;

    if (!title?.trim() || !categoryId) {
      return NextResponse.json({ error: 'Judul dan Kategori wajib diisi' }, { status: 400 });
    }

    const pkgId = `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const baseSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
    const finalSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

    let passingRulesStr = null;
    if (passingGradeRules) {
      passingRulesStr = typeof passingGradeRules === 'string'
        ? passingGradeRules
        : JSON.stringify(passingGradeRules);
    } else {
      passingRulesStr = JSON.stringify({
        correctScore: 4,
        wrongScore: -1,
        emptyScore: 0,
        passingScore: 70,
      });
    }

    await db.insert(examPackages).values({
      id: pkgId,
      title: title.trim(),
      slug: finalSlug,
      categoryId,
      type: type === 'PRACTICE' ? 'PRACTICE' : 'SIMULATION',
      durationMinutes: Math.max(1, parseInt(durationMinutes, 10) || 60),
      shuffleQuestions: Boolean(shuffleQuestions),
      shuffleOptions: Boolean(shuffleOptions),
      passingGradeRules: passingRulesStr,
      isPublished: Boolean(isPublished),
    });

    return NextResponse.json({
      success: true,
      packageId: pkgId,
      slug: finalSlug,
    });
  } catch (error: unknown) {
    console.error('Error creating package:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
