import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { examPackages, packageQuestions } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { eq, asc } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [original] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);
    if (!original) {
      return NextResponse.json({ error: 'Paket sumber tidak ditemukan' }, { status: 404 });
    }

    const newId = `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newTitle = `${original.title} (Salinan)`;
    const newSlug = `${slugify(original.slug || original.title)}-salinan-${Date.now().toString(36).slice(-4)}`;

    // Fetch existing package questions
    const existingQuestions = await db
      .select()
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, id))
      .orderBy(asc(packageQuestions.orderIndex));

    await client.begin(async (sql) => {
      // 1. Insert duplicated package (draft by default)
      await sql`
        INSERT INTO exam_packages (
          id, title, slug, category_id, type, duration_minutes,
          shuffle_questions, shuffle_options, passing_grade_rules, is_published
        )
        VALUES (
          ${newId},
          ${newTitle},
          ${newSlug},
          ${original.categoryId},
          ${original.type},
          ${original.durationMinutes},
          ${original.shuffleQuestions},
          ${original.shuffleOptions},
          ${original.passingGradeRules},
          false
        )
      `;

      // 2. Insert copy of all questions
      for (const pq of existingQuestions) {
        await sql`
          INSERT INTO package_questions (package_id, question_id, order_index)
          VALUES (${newId}, ${pq.questionId}, ${pq.orderIndex})
        `;
      }
    });

    return NextResponse.json({
      success: true,
      newPackageId: newId,
      newTitle,
      questionCount: existingQuestions.length,
    });
  } catch (error: unknown) {
    console.error('Error cloning package:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
