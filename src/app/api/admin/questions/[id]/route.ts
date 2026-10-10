import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { questions, questionOptions } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';
import { apiError, readJson } from '@/lib/api';
import { parseQuestionPayload, updateQuestion } from '@/lib/question-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!question) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    const options = await db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.questionId, id))
      .orderBy(asc(questionOptions.orderIndex));

    return NextResponse.json({
      question,
      options,
    });
  } catch (error) {
    return apiError(error, 'Error fetching question');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [existing] = await db.select({ id: questions.id }).from(questions).where(eq(questions.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    const payload = await parseQuestionPayload(await readJson(req));
    await updateQuestion(id, payload);
    return NextResponse.json({ success: true, message: 'Soal berhasil diperbarui' });
  } catch (error) {
    return apiError(error, 'Error updating question');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    await client.begin(async (sql) => {
      await sql`DELETE FROM question_options WHERE question_id = ${id}`;
      await sql`DELETE FROM package_questions WHERE question_id = ${id}`;
      await sql`DELETE FROM attempt_answers WHERE question_id = ${id}`;
      await sql`DELETE FROM questions WHERE id = ${id}`;
    });

    return NextResponse.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (error) {
    return apiError(error, 'Error deleting question');
  }
}
