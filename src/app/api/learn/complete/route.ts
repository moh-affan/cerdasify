import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learningContents, contentQuizItems, readingProgress } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { jakartaDateString } from '@/lib/learning';
import { and, asc, eq } from 'drizzle-orm';

// Menandai bacaan selesai & menilai kuis pemahaman di server.
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Silakan masuk akun untuk menyimpan progres' }, { status: 401 });
    }

    const { contentId, answers } = await readJson<{ contentId?: unknown; answers?: unknown }>(req);
    if (typeof contentId !== 'string' || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'contentId dan answers wajib diisi' }, { status: 400 });
    }

    const [content] = await db
      .select({ id: learningContents.id, isPublished: learningContents.isPublished })
      .from(learningContents)
      .where(eq(learningContents.id, contentId))
      .limit(1);
    if (!content || !content.isPublished) {
      return NextResponse.json({ error: 'Bacaan tidak ditemukan' }, { status: 404 });
    }

    const items = await db
      .select()
      .from(contentQuizItems)
      .where(eq(contentQuizItems.contentId, contentId))
      .orderBy(asc(contentQuizItems.orderIndex));

    const results = items.map((item, i) => {
      const selected = typeof answers[i] === 'number' ? answers[i] : null;
      return {
        selected,
        correctIndex: item.correctIndex,
        isCorrect: selected === item.correctIndex,
        explanation: item.explanation,
      };
    });
    const score = results.filter((r) => r.isCorrect).length;

    const [existing] = await db
      .select()
      .from(readingProgress)
      .where(and(eq(readingProgress.userId, user.userId), eq(readingProgress.contentId, contentId)))
      .limit(1);

    if (!existing) {
      await db.insert(readingProgress).values({
        userId: user.userId,
        contentId,
        completedAt: new Date().toISOString(),
        readDate: jakartaDateString(),
        quizScore: score,
        quizTotal: items.length,
      });
    } else if (score > existing.quizScore) {
      // Simpan skor terbaik; tanggal baca pertama dipertahankan untuk streak.
      await db
        .update(readingProgress)
        .set({ quizScore: score, quizTotal: items.length })
        .where(and(eq(readingProgress.userId, user.userId), eq(readingProgress.contentId, contentId)));
    }

    return NextResponse.json({ success: true, score, total: items.length, results });
  } catch (error) {
    return apiError(error, 'Error completing reading');
  }
}
