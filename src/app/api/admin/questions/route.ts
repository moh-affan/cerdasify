import { NextRequest, NextResponse } from 'next/server';
import { db, sqlite } from '@/db';
import { questions, questionOptions, topics, categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      topicId,
      type = 'SINGLE_CHOICE',
      difficulty = 'MEDIUM',
      imageUrl = null,
      contentMarkdown,
      explanationMarkdown,
      options,
    } = body;

    if (!topicId || !contentMarkdown || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Topik, teks pertanyaan, dan minimal 2 opsi jawaban wajib diisi' },
        { status: 400 }
      );
    }

    const qId = `q_adm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const insertTx = sqlite.transaction(() => {
      sqlite
        .prepare(
          `INSERT INTO questions (id, topic_id, type, content_markdown, image_url, explanation_markdown, difficulty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(qId, topicId, type, contentMarkdown, imageUrl, explanationMarkdown || '', difficulty);

      for (let idx = 0; idx < options.length; idx++) {
        const opt = options[idx];
        const optId = `opt_${qId}_${idx}_${opt.label}`;
        sqlite
          .prepare(
            `INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .run(
            optId,
            qId,
            opt.label,
            opt.contentMarkdown,
            opt.isCorrect ? 1 : 0,
            opt.scoreValue || (opt.isCorrect ? 4 : 0),
            idx
          );
      }
    });

    insertTx();

    return NextResponse.json({ success: true, questionId: qId });
  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
