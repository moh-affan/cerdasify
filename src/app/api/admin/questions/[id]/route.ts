import { NextRequest, NextResponse } from 'next/server';
import { db, sqlite } from '@/db';
import { questions, questionOptions, topics } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const question = db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .get();

    if (!question) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    const options = db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.questionId, id))
      .orderBy(asc(questionOptions.orderIndex))
      .all();

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
    const existing = db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .get();

    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    // Execute atomic update
    const updateTx = sqlite.transaction(() => {
      // 1. Update questions table
      sqlite
        .prepare(
          `UPDATE questions 
           SET topic_id = ?, type = ?, content_markdown = ?, image_url = ?, explanation_markdown = ?, difficulty = ?
           WHERE id = ?`
        )
        .run(
          topicId,
          type,
          contentMarkdown,
          imageUrl || null,
          explanationMarkdown || '',
          difficulty,
          id
        );

      // 2. Delete existing options
      sqlite
        .prepare(`DELETE FROM question_options WHERE question_id = ?`)
        .run(id);

      // 3. Re-insert updated options
      for (let idx = 0; idx < options.length; idx++) {
        const opt = options[idx];
        const optId = `opt_${id}_${idx}_${opt.label || String.fromCharCode(65 + idx)}`;
        sqlite
          .prepare(
            `INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .run(
            optId,
            id,
            opt.label || String.fromCharCode(65 + idx),
            opt.contentMarkdown,
            opt.isCorrect ? 1 : 0,
            opt.scoreValue ?? (opt.isCorrect ? 4 : 0),
            idx
          );
      }
    });

    updateTx();

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

    const existing = db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .get();

    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
    }

    const deleteTx = sqlite.transaction(() => {
      sqlite.prepare(`DELETE FROM question_options WHERE question_id = ?`).run(id);
      sqlite.prepare(`DELETE FROM package_questions WHERE question_id = ?`).run(id);
      sqlite.prepare(`DELETE FROM attempt_answers WHERE question_id = ?`).run(id);
      sqlite.prepare(`DELETE FROM questions WHERE id = ?`).run(id);
    });

    deleteTx();

    return NextResponse.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
