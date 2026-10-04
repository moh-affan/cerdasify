import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { questions, questionOptions } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

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
  } catch (error: any) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
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

    const {
      topicId,
      type = 'SINGLE_CHOICE',
      difficulty = 'MEDIUM',
      imageUrl = null,
      contentMarkdown,
      explanationMarkdown = '',
      options,
    } = body;

    if (!topicId || !contentMarkdown || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Topik, teks pertanyaan, dan minimal 2 opsi jawaban wajib diisi' },
        { status: 400 }
      );
    }

    // Check if question exists
    const [existing] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    // Execute atomic update
    await client.begin(async (sql) => {
      // 1. Update questions table
      await sql`
        UPDATE questions 
        SET topic_id = ${topicId}, type = ${type}, content_markdown = ${contentMarkdown}, 
            image_url = ${imageUrl || null}, explanation_markdown = ${explanationMarkdown || ''}, difficulty = ${difficulty}
        WHERE id = ${id}
      `;

      // 2. Delete existing options
      await sql`DELETE FROM question_options WHERE question_id = ${id}`;

      // 3. Re-insert updated options
      for (let idx = 0; idx < options.length; idx++) {
        const opt = options[idx];
        const optId = `opt_${id}_${idx}_${opt.label || String.fromCharCode(65 + idx)}`;
        await sql`
          INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
          VALUES (
            ${optId},
            ${id},
            ${opt.label || String.fromCharCode(65 + idx)},
            ${opt.contentMarkdown},
            ${Boolean(opt.isCorrect)},
            ${opt.scoreValue ?? (opt.isCorrect ? 4 : 0)},
            ${idx}
          )
        `;
      }
    });

    return NextResponse.json({ success: true, message: 'Soal berhasil diperbarui' });
  } catch (error: any) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
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
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
