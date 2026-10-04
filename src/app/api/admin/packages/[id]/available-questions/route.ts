import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questions, questionOptions, packageQuestions, topics, categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);

    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const categoryId = url.searchParams.get('categoryId') || '';
    const topicId = url.searchParams.get('topicId') || '';
    const difficulty = url.searchParams.get('difficulty') || '';
    const type = url.searchParams.get('type') || '';
    const hideAssigned = url.searchParams.get('hideAssigned') === 'true';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(5, Math.min(100, parseInt(url.searchParams.get('limit') || '20', 10)));

    // Get current package questions
    const pkgQs = await db
      .select({ questionId: packageQuestions.questionId })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, id));
    const assignedSet = new Set(pkgQs.map((p) => p.questionId));

    // Get topics and categories for metadata lookup
    const allTopics = await db.select().from(topics);
    const topicMap = new Map(allTopics.map((t) => [t.id, t]));

    const allCategories = await db.select().from(categories);
    const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

    // Query all questions
    const allQuestions = await db
      .select()
      .from(questions)
      .orderBy(desc(questions.createdAt));

    let filtered = allQuestions.map((question) => {
      const top = topicMap.get(question.topicId);
      const isAlready = assignedSet.has(question.id);
      return {
        ...question,
        topicName: top?.name || 'Umum',
        categoryId: top?.categoryId || '',
        categoryName: top?.categoryId ? catMap.get(top.categoryId) || 'Umum' : 'Umum',
        isAlreadyInPackage: isAlready,
      };
    });

    if (hideAssigned) {
      filtered = filtered.filter((qItem) => !qItem.isAlreadyInPackage);
    }
    if (categoryId) {
      filtered = filtered.filter((qItem) => qItem.categoryId === categoryId);
    }
    if (topicId) {
      filtered = filtered.filter((qItem) => qItem.topicId === topicId);
    }
    if (difficulty) {
      filtered = filtered.filter((qItem) => qItem.difficulty === difficulty);
    }
    if (type) {
      filtered = filtered.filter((qItem) => qItem.type === type);
    }
    if (q) {
      filtered = filtered.filter((qItem) =>
        qItem.contentMarkdown.toLowerCase().includes(q) ||
        (qItem.explanationMarkdown || '').toLowerCase().includes(q) ||
        qItem.topicName.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Fetch options for paginated questions
    const pQIds = paginated.map((p) => p.id);
    type OptionRow = typeof questionOptions.$inferSelect;
    let optionsList: OptionRow[] = [];
    if (pQIds.length > 0) {
      optionsList = await db.select().from(questionOptions).orderBy(asc(questionOptions.orderIndex));
    }
    const optMap = new Map<string, OptionRow[]>();
    for (const opt of optionsList) {
      if (!optMap.has(opt.questionId)) optMap.set(opt.questionId, []);
      optMap.get(opt.questionId)!.push(opt);
    }

    const results = paginated.map((p) => ({
      ...p,
      options: optMap.get(p.id) || [],
    }));

    return NextResponse.json({
      questions: results,
      total,
      page,
      totalPages,
      assignedCount: assignedSet.size,
    });
  } catch (error: unknown) {
    console.error('Error fetching available questions:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
