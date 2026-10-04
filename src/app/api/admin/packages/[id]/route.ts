import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { examPackages, packageQuestions, questions, questionOptions, categories, topics, attempts, users } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { eq, asc, desc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    const [cat] = await db.select().from(categories).where(eq(categories.id, pkg.categoryId)).limit(1);

    // Get assigned questions in package ordered by orderIndex
    const assignedRows = await db
      .select({
        packageId: packageQuestions.packageId,
        questionId: packageQuestions.questionId,
        orderIndex: packageQuestions.orderIndex,
        question: questions,
        topic: topics,
      })
      .from(packageQuestions)
      .innerJoin(questions, eq(packageQuestions.questionId, questions.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .where(eq(packageQuestions.packageId, id))
      .orderBy(asc(packageQuestions.orderIndex));

    // Get options for these questions
    const questionIds = assignedRows.map((r) => r.questionId);
    type OptionRow = typeof questionOptions.$inferSelect;
    let allOptions: OptionRow[] = [];
    if (questionIds.length > 0) {
      allOptions = await db
        .select()
        .from(questionOptions)
        .orderBy(asc(questionOptions.orderIndex));
    }

    const optionsByQId = new Map<string, OptionRow[]>();
    for (const opt of allOptions) {
      if (!optionsByQId.has(opt.questionId)) {
        optionsByQId.set(opt.questionId, []);
      }
      optionsByQId.get(opt.questionId)!.push(opt);
    }

    const questionsList = assignedRows.map((r) => ({
      ...r.question,
      orderIndex: r.orderIndex,
      topicName: r.topic?.name || 'Umum',
      options: optionsByQId.get(r.questionId) || [],
    }));

    // Get attempts statistics and recent attempts
    const pkgAttempts = await db
      .select({
        id: attempts.id,
        userId: attempts.userId,
        userName: users.name,
        userUsername: users.username,
        startedAt: attempts.startedAt,
        finishedAt: attempts.finishedAt,
        scoreTotal: attempts.scoreTotal,
        isPassed: attempts.isPassed,
        status: attempts.status,
        remainingSeconds: attempts.remainingSeconds,
      })
      .from(attempts)
      .leftJoin(users, eq(attempts.userId, users.id))
      .where(eq(attempts.packageId, id))
      .orderBy(desc(attempts.startedAt));

    const totalAttempts = pkgAttempts.length;
    const completedAttempts = pkgAttempts.filter((a) => a.status === 'COMPLETED' || a.status === 'TIMED_OUT');
    const completedCount = completedAttempts.length;
    const scoreSum = completedAttempts.reduce((acc, a) => acc + (a.scoreTotal || 0), 0);
    const passCount = completedAttempts.filter((a) => a.isPassed).length;

    const scores = completedAttempts.map((a) => a.scoreTotal || 0);
    const highestScore = scores.length > 0 ? Math.max(...scores) : null;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : null;
    const avgScore = completedCount > 0 ? Math.round(scoreSum / completedCount) : null;
    const passRate = completedCount > 0 ? Math.round((passCount / completedCount) * 100) : null;

    return NextResponse.json({
      package: {
        ...pkg,
        categoryName: cat?.name || 'Umum',
      },
      questions: questionsList,
      stats: {
        totalAttempts,
        completedCount,
        passCount,
        passRate,
        avgScore,
        highestScore,
        lowestScore,
      },
      recentAttempts: pkgAttempts.slice(0, 20),
    });
  } catch (error: unknown) {
    console.error('Error fetching package detail:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });
    }

    const {
      title,
      slug: customSlug,
      categoryId,
      durationMinutes,
      type,
      shuffleQuestions,
      shuffleOptions,
      passingGradeRules,
      isPublished,
    } = body;

    const updates: Partial<typeof examPackages.$inferInsert> = {};

    if (title !== undefined && title.trim()) {
      updates.title = title.trim();
    }
    if (customSlug !== undefined && customSlug.trim()) {
      updates.slug = slugify(customSlug);
    }
    if (categoryId !== undefined && categoryId.trim()) {
      updates.categoryId = categoryId.trim();
    }
    if (durationMinutes !== undefined) {
      updates.durationMinutes = Math.max(1, parseInt(durationMinutes, 10) || 60);
    }
    if (type !== undefined) {
      updates.type = type === 'PRACTICE' ? 'PRACTICE' : 'SIMULATION';
    }
    if (shuffleQuestions !== undefined) {
      updates.shuffleQuestions = Boolean(shuffleQuestions);
    }
    if (shuffleOptions !== undefined) {
      updates.shuffleOptions = Boolean(shuffleOptions);
    }
    if (isPublished !== undefined) {
      updates.isPublished = Boolean(isPublished);
    }
    if (passingGradeRules !== undefined) {
      updates.passingGradeRules = typeof passingGradeRules === 'string'
        ? passingGradeRules
        : JSON.stringify(passingGradeRules);
    }

    if (Object.keys(updates).length > 0) {
      await db.update(examPackages).set(updates).where(eq(examPackages.id, id));
    }

    const [updatedPkg] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);

    return NextResponse.json({ success: true, package: updatedPkg });
  } catch (error: unknown) {
    console.error('Error updating package:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
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

    // Delete transactionally (cascade will also trigger on Postgres level)
    await client.begin(async (sql) => {
      await sql`DELETE FROM package_questions WHERE package_id = ${id}`;
      await sql`DELETE FROM exam_packages WHERE id = ${id}`;
    });

    return NextResponse.json({ success: true, message: 'Paket berhasil dihapus' });
  } catch (error: unknown) {
    console.error('Error deleting package:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
