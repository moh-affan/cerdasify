import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import {
  learningContents,
  contentVocab,
  contentGrammarNotes,
  contentQuizItems,
  readingProgress,
  users,
} from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import ReadingView from '@/components/learn/ReadingView';
import { MathRenderer } from '@/components/katex/MathRenderer';
import {
  CONTENT_TYPE_LABEL,
  PHASE_INFO,
  gradeToPhase,
  isKidsPhase,
  parseJsonArray,
  parseSegments,
  contentMatchesPhase,
} from '@/lib/learning';
import { and, asc, eq } from 'drizzle-orm';
import { ArrowLeft, Clock } from 'lucide-react';
import { Amiri } from 'next/font/google';

const NOTES_HEADING: Record<string, string | undefined> = {
  STORY: 'Pesan Moral',
  COMIC: 'Pesan Moral',
  SPEECH: 'Tips Berpidato',
  ENCYCLOPEDIA: 'Tahukah Kamu?',
  LESSON: 'Catatan Penting',
};

const arabicFont = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic', display: 'swap' });

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const [content] = await db.select().from(learningContents).where(eq(learningContents.slug, slug)).limit(1);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  // Draf hanya bisa dipratinjau admin
  if (!content || (!content.isPublished && !isAdmin)) notFound();

  const [vocabRows, grammarRows, quizRows, progressRows, userRows] = await Promise.all([
    db.select().from(contentVocab).where(eq(contentVocab.contentId, content.id)).orderBy(asc(contentVocab.orderIndex)),
    db
      .select()
      .from(contentGrammarNotes)
      .where(eq(contentGrammarNotes.contentId, content.id))
      .orderBy(asc(contentGrammarNotes.orderIndex)),
    // Hanya prompt & opsi — kunci jawaban dinilai di server lewat /api/learn/complete
    db
      .select({ prompt: contentQuizItems.prompt, options: contentQuizItems.options })
      .from(contentQuizItems)
      .where(eq(contentQuizItems.contentId, content.id))
      .orderBy(asc(contentQuizItems.orderIndex)),
    user
      ? db
          .select()
          .from(readingProgress)
          .where(and(eq(readingProgress.userId, user.userId), eq(readingProgress.contentId, content.id)))
          .limit(1)
      : Promise.resolve([]),
    user
      ? db.select({ gradeLevel: users.gradeLevel }).from(users).where(eq(users.id, user.userId)).limit(1)
      : Promise.resolve([]),
  ]);

  // Mode anak mengikuti fase pengguna bila cocok dengan rentang konten, selain itu fase minimum konten
  const userPhase = gradeToPhase(userRows[0]?.gradeLevel);
  const displayPhase =
    userPhase && contentMatchesPhase(userPhase, content.phaseMin, content.phaseMax) ? userPhase : content.phaseMin;
  const kids = isKidsPhase(displayPhase);
  const progress = progressRows[0];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col ${arabicFont.variable}`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/belajar" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Kembali ke pustaka">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-slate-700 truncate">{content.title}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {!content.isPublished && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-2">
            Pratinjau draf — konten ini belum diterbitkan dan hanya terlihat oleh admin.
          </div>
        )}
        <div className="text-center space-y-2">
          {content.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.coverImageUrl}
              alt={content.title}
              className="w-full max-w-sm mx-auto rounded-3xl border-[3px] border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
            />
          ) : (
            <div className={kids ? 'text-7xl' : 'text-5xl'}>{content.coverEmoji || '📖'}</div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {content.type === 'LESSON' && content.theme ? content.theme : CONTENT_TYPE_LABEL[content.type]}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {PHASE_INFO[content.phaseMin].label}
              {content.phaseMax !== content.phaseMin && `–${content.phaseMax}`}
            </span>
            {content.cefrLevel && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                CEFR {content.cefrLevel.replace('_', '-')}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {content.readingMinutes} mnt
            </span>
          </div>
          <h1 className={kids ? 'text-3xl sm:text-4xl font-extrabold' : 'text-2xl sm:text-3xl font-extrabold'}>
            {content.title}
          </h1>
          {content.titleTranslation && <p className="text-slate-500">{content.titleTranslation}</p>}
        </div>

        {content.bodyMarkdown && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 text-slate-800">
            <MathRenderer content={content.bodyMarkdown} className={kids ? 'text-lg leading-loose' : ''} />
          </div>
        )}

        <ReadingView
          contentId={content.id}
          segments={parseSegments(content.segmentsJson)}
          vocab={vocabRows.map((v) => ({
            word: v.word,
            forms: parseJsonArray(v.forms),
            partOfSpeech: v.partOfSpeech,
            meaning: v.meaning,
            example: v.example,
            emoji: v.emoji,
          }))}
          grammar={grammarRows.map((g) => ({
            title: g.title,
            pattern: g.pattern,
            explanation: g.explanation,
            examples: parseJsonArray(g.examples),
          }))}
          quiz={quizRows.map((q) => ({ prompt: q.prompt, options: parseJsonArray(q.options) }))}
          kidsMode={kids}
          notesHeading={NOTES_HEADING[content.type]}
          practiceMode={content.type === 'SPEECH'}
          isLoggedIn={!!user}
          previousScore={progress ? { score: progress.quizScore, total: progress.quizTotal } : null}
        />
      </main>
    </div>
  );
}
