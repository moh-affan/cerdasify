// Validasi & penyimpanan soal dari Bank Soal admin (dipakai rute POST dan PUT).

import crypto from 'crypto';
import { db } from '@/db';
import { questionOptions, questions, topics } from '@/db/schema';
import { ApiError } from '@/lib/api';
import { eq } from 'drizzle-orm';

export const QUESTION_TYPES = ['SINGLE_CHOICE', 'MULTI_CHOICE', 'GRADED_SCALE'] as const;
export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'HOTS'] as const;

export interface OptionPayload {
  id?: string;
  label: string;
  contentMarkdown: string;
  imageUrl?: string | null;
  isCorrect: boolean;
  scoreValue: number;
}

export interface QuestionPayload {
  topicId: string;
  type: (typeof QUESTION_TYPES)[number];
  difficulty: (typeof DIFFICULTIES)[number];
  imageUrl: string | null;
  contentMarkdown: string;
  explanationMarkdown: string;
  options: OptionPayload[];
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function parseQuestionPayload(body: unknown): Promise<QuestionPayload> {
  const b = (body ?? {}) as Record<string, unknown>;

  const topicId = str(b.topicId);
  const contentMarkdown = str(b.contentMarkdown);
  const rawOptions = Array.isArray(b.options) ? b.options : [];
  if (!topicId || !contentMarkdown || rawOptions.length < 2) {
    throw new ApiError('Topik, teks pertanyaan, dan minimal 2 opsi jawaban wajib diisi');
  }
  if (rawOptions.length > 5) throw new ApiError('Maksimal 5 opsi jawaban (A–E)');

  const type = (str(b.type) || 'SINGLE_CHOICE') as QuestionPayload['type'];
  if (!QUESTION_TYPES.includes(type)) throw new ApiError('Tipe soal tidak valid');
  const difficulty = (str(b.difficulty) || 'MEDIUM') as QuestionPayload['difficulty'];
  if (!DIFFICULTIES.includes(difficulty)) throw new ApiError('Tingkat kesulitan tidak valid');

  const [topic] = await db.select({ id: topics.id }).from(topics).where(eq(topics.id, topicId)).limit(1);
  if (!topic) throw new ApiError('Topik tidak ditemukan');

  const options: OptionPayload[] = rawOptions.map((raw, idx) => {
    const o = (raw ?? {}) as Record<string, unknown>;
    const label = String.fromCharCode(65 + idx); // label selalu urut A, B, C…
    const contentMarkdown = str(o.contentMarkdown);
    const imageUrl = typeof o.imageUrl === 'string' ? o.imageUrl.trim() || null : undefined;
    if (!contentMarkdown && !imageUrl) throw new ApiError(`Opsi ${label} tidak boleh kosong`);

    const isCorrect = Boolean(o.isCorrect);
    let scoreValue: number;
    if (type === 'GRADED_SCALE') {
      scoreValue = Number(o.scoreValue);
      if (!Number.isInteger(scoreValue) || scoreValue < 1 || scoreValue > 5) {
        throw new ApiError(`Bobot opsi ${label} untuk soal berbobot harus bilangan bulat 1–5`);
      }
    } else {
      scoreValue = isCorrect ? 4 : 0;
    }
    return { id: str(o.id) || undefined, label, contentMarkdown, imageUrl, isCorrect: type === 'GRADED_SCALE' ? false : isCorrect, scoreValue };
  });
  if (type === 'GRADED_SCALE') {
    // opsi berbobot tertinggi ditandai sebagai pilihan terbaik (dipakai statistik & halaman pembahasan)
    const top = Math.max(...options.map((o) => o.scoreValue));
    for (const o of options) o.isCorrect = o.scoreValue === top;
  }

  const correctCount = options.filter((o) => o.isCorrect).length;
  if (type === 'SINGLE_CHOICE' && correctCount !== 1) throw new ApiError('Soal pilihan tunggal harus memiliki tepat satu kunci jawaban');
  if (type === 'MULTI_CHOICE' && correctCount < 1) throw new ApiError('Soal pilihan ganda kompleks minimal memiliki satu kunci jawaban');

  return {
    topicId,
    type,
    difficulty,
    imageUrl: str(b.imageUrl) || null,
    contentMarkdown,
    explanationMarkdown: typeof b.explanationMarkdown === 'string' ? b.explanationMarkdown.trim() : '',
    options,
  };
}

const newOptionId = (questionId: string) => `opt_${questionId}_${crypto.randomBytes(4).toString('hex')}`;

export async function createQuestion(p: QuestionPayload): Promise<string> {
  const questionId = `q_adm_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  await db.transaction(async (tx) => {
    await tx.insert(questions).values({
      id: questionId,
      topicId: p.topicId,
      type: p.type,
      difficulty: p.difficulty,
      contentMarkdown: p.contentMarkdown,
      imageUrl: p.imageUrl,
      explanationMarkdown: p.explanationMarkdown || null,
    });
    await tx.insert(questionOptions).values(
      p.options.map((o, idx) => ({
        id: newOptionId(questionId),
        questionId,
        label: o.label,
        contentMarkdown: o.contentMarkdown,
        imageUrl: o.imageUrl ?? null,
        isCorrect: o.isCorrect,
        scoreValue: o.scoreValue,
        orderIndex: idx,
      }))
    );
  });
  return questionId;
}

/**
 * Perbarui soal. Opsi yang sudah ada diperbarui berdasarkan ID-nya (bukan dihapus-buat ulang),
 * sehingga jawaban peserta di attempt lama tetap merujuk opsi yang benar.
 */
export async function updateQuestion(questionId: string, p: QuestionPayload) {
  await db.transaction(async (tx) => {
    await tx
      .update(questions)
      .set({
        topicId: p.topicId,
        type: p.type,
        difficulty: p.difficulty,
        contentMarkdown: p.contentMarkdown,
        imageUrl: p.imageUrl,
        explanationMarkdown: p.explanationMarkdown || null,
      })
      .where(eq(questions.id, questionId));

    const existing = await tx.select({ id: questionOptions.id }).from(questionOptions).where(eq(questionOptions.questionId, questionId));
    const existingIds = new Set(existing.map((o) => o.id));
    const keptIds = new Set<string>();

    for (const [idx, o] of p.options.entries()) {
      const values = {
        label: o.label,
        contentMarkdown: o.contentMarkdown,
        isCorrect: o.isCorrect,
        scoreValue: o.scoreValue,
        orderIndex: idx,
        // imageUrl hanya diubah bila dikirim klien, agar gambar opsi lama tidak terhapus
        ...(o.imageUrl !== undefined ? { imageUrl: o.imageUrl } : {}),
      };
      if (o.id && existingIds.has(o.id)) {
        await tx.update(questionOptions).set(values).where(eq(questionOptions.id, o.id));
        keptIds.add(o.id);
      } else {
        await tx.insert(questionOptions).values({ id: newOptionId(questionId), questionId, ...values });
      }
    }

    for (const id of existingIds) {
      if (!keptIds.has(id)) await tx.delete(questionOptions).where(eq(questionOptions.id, id));
    }
  });
}
