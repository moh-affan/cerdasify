import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { examPackages, packageQuestions, questions } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

export async function POST(
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

    let targetQuestionIds: string[] = [];

    // If bulk by topicId
    if (body.topicId) {
      const topicQs = await db
        .select({ id: questions.id })
        .from(questions)
        .where(eq(questions.topicId, body.topicId));
      targetQuestionIds = topicQs.map((q) => q.id);
    } else if (Array.isArray(body.questionIds) && body.questionIds.length > 0) {
      targetQuestionIds = body.questionIds;
    } else if (body.questionId) {
      targetQuestionIds = [body.questionId];
    }

    if (targetQuestionIds.length === 0) {
      return NextResponse.json({ error: 'Tidak ada soal yang dipilih untuk ditambahkan' }, { status: 400 });
    }

    // Get existing questions in package to prevent duplicates
    const existing = await db
      .select({ questionId: packageQuestions.questionId, orderIndex: packageQuestions.orderIndex })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, id))
      .orderBy(asc(packageQuestions.orderIndex));

    const existingIdSet = new Set(existing.map((e) => e.questionId));
    const idsToInsert = targetQuestionIds.filter((qid) => !existingIdSet.has(qid));

    if (idsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Semua butir soal yang dipilih sudah ada di paket ini',
        addedCount: 0,
      });
    }

    let maxOrder = existing.reduce((max, e) => Math.max(max, e.orderIndex), -1);

    await client.begin(async (sql) => {
      for (const qid of idsToInsert) {
        maxOrder += 1;
        await sql`
          INSERT INTO package_questions (package_id, question_id, order_index)
          VALUES (${id}, ${qid}, ${maxOrder})
          ON CONFLICT (package_id, question_id) DO NOTHING
        `;
      }
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil menambahkan ${idsToInsert.length} butir soal ke paket`,
      addedCount: idsToInsert.length,
    });
  } catch (error: unknown) {
    console.error('Error adding questions to package:', error);
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
    const url = new URL(req.url);
    const questionId = url.searchParams.get('questionId');

    let targetIds: string[] = [];
    if (questionId) {
      targetIds = [questionId];
    } else {
      try {
        const body = await req.json();
        if (body.questionId) targetIds = [body.questionId];
        else if (Array.isArray(body.questionIds)) targetIds = body.questionIds;
      } catch {}
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ error: 'Question ID wajib disertakan' }, { status: 400 });
    }

    await client.begin(async (sql) => {
      for (const qid of targetIds) {
        await sql`DELETE FROM package_questions WHERE package_id = ${id} AND question_id = ${qid}`;
      }

      // Re-index remaining questions
      const remaining = await db
        .select({ questionId: packageQuestions.questionId })
        .from(packageQuestions)
        .where(eq(packageQuestions.packageId, id))
        .orderBy(asc(packageQuestions.orderIndex));

      for (let i = 0; i < remaining.length; i++) {
        await sql`
          UPDATE package_questions 
          SET order_index = ${i} 
          WHERE package_id = ${id} AND question_id = ${remaining[i].questionId}
        `;
      }
    });

    return NextResponse.json({ success: true, message: 'Soal berhasil dihapus dari paket' });
  } catch (error: unknown) {
    console.error('Error removing questions from package:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
