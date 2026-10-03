import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { attempts, examPackages, questions, questionOptions, attemptAnswers, topics, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw, ArrowLeft, Clock, BarChart3, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { attemptId } = await params;
  const attempt = db.select().from(attempts).where(eq(attempts.id, attemptId)).get();

  if (!attempt) {
    notFound();
  }

  if (attempt.userId !== user.userId && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    redirect('/');
  }

  const pkg = db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).get();
  if (!pkg) {
    notFound();
  }

  const cat = db.select().from(categories).where(eq(categories.id, pkg.categoryId)).get();

  // Parse breakdown
  let breakdown: any = {};
  try {
    breakdown = attempt.scoreBreakdown ? JSON.parse(attempt.scoreBreakdown) : {};
  } catch {}

  // Load answers and full questions with explanations
  const answersDb = db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, attempt.id)).all();
  const answersMap = new Map(answersDb.map((a) => [a.questionId, a]));

  const allQuestions = db
    .select({
      id: questions.id,
      topicId: questions.topicId,
      type: questions.type,
      contentMarkdown: questions.contentMarkdown,
      explanationMarkdown: questions.explanationMarkdown,
      difficulty: questions.difficulty,
    })
    .from(questions)
    .all();

  // Filter questions belonging to this package
  const packageQuestionsList = db.query?.packageQuestions
    ? await db.query.packageQuestions.findMany({
        where: eq(examPackages.id, pkg.id),
      })
    : [];

  // If using direct select for package_questions
  const rawPkgQs = db
    .select()
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attempt.id))
    .all();

  // Load detailed question cards
  const detailedQuestions = answersDb.map((ans, idx) => {
    const q = db.select().from(questions).where(eq(questions.id, ans.questionId)).get();
    const topic = q ? db.select().from(topics).where(eq(topics.id, q.topicId)).get() : null;
    const opts = q ? db.select().from(questionOptions).where(eq(questionOptions.questionId, q.id)).orderBy(asc(questionOptions.orderIndex)).all() : [];

    const selectedIds = ans.selectedOptionIds ? JSON.parse(ans.selectedOptionIds) : [];
    const correctOption = opts.find((o) => o.isCorrect);

    const isGradedScale = q?.type === 'GRADED_SCALE';
    const isCorrect = isGradedScale ? ans.scoreAwarded === 5 : correctOption ? selectedIds.includes(correctOption.id) : false;

    return {
      index: idx + 1,
      question: q,
      topicName: topic ? topic.name : 'Umum',
      options: opts,
      selectedIds,
      isCorrect,
      scoreAwarded: ans.scoreAwarded,
      isDoubtful: ans.isDoubtful,
    };
  });

  // Calculate durations
  const startTime = new Date(attempt.startedAt).getTime();
  const finishTime = attempt.finishedAt ? new Date(attempt.finishedAt).getTime() : Date.now();
  const durationMinutes = Math.max(1, Math.round((finishTime - startTime) / 60000));

  const correctCount = detailedQuestions.filter((q) => q.isCorrect).length;
  const answeredCount = detailedQuestions.filter((q) => q.selectedIds.length > 0).length;
  const wrongCount = answeredCount - correctCount;
  const emptyCount = detailedQuestions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/exam/${pkg.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Ujian</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Score Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-indigo-500/20 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold">
                <span>{cat?.name || 'Simulasi Ujian'}</span>
                <span>•</span>
                <span>{detailedQuestions.length} Soal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {pkg.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-indigo-200 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Waktu Pengerjaan: {durationMinutes} Menit
                </span>
                <span>•</span>
                <span>Disubmit pada {new Date(attempt.finishedAt || attempt.startedAt).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <div className="text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-0.5">
                  Skor Perolehan
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {attempt.scoreTotal}
                </span>
              </div>

              <div className="h-12 w-[1px] bg-white/20" />

              <div className="space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                    attempt.isPassed
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-rose-500 text-white shadow-sm'
                  }`}
                >
                  {attempt.isPassed ? 'LULUS AMBANG BATAS' : 'BELUM LULUS'}
                </span>
                <p className="text-[11px] text-indigo-200">
                  {attempt.isPassed
                    ? 'Selamat! Nilai Anda memenuhi standar passing grade.'
                    : 'Terus berlatih untuk meningkatkan penguasaan materi.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Jawaban Benar</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {correctCount}
              <span className="text-xs font-normal text-slate-400 ml-1">soal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Jawaban Salah</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-rose-500 font-mono">
              {wrongCount}
              <span className="text-xs font-normal text-slate-400 ml-1">soal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Tidak Dijawab</span>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-700 font-mono">
              {emptyCount}
              <span className="text-xs font-normal text-slate-400 ml-1">soal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Akurasi Jawaban</span>
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600 font-mono">
              {detailedQuestions.length > 0
                ? Math.round((correctCount / detailedQuestions.length) * 100)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Topic Breakdown if available */}
        {breakdown?.byTopic && Object.keys(breakdown.byTopic).length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Analisis Performa Per Topik Soal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(breakdown.byTopic).map(([tName, tData]: [string, any]) => {
                const pct = tData.total > 0 ? Math.round((tData.correct / tData.total) * 100) : 0;
                return (
                  <div key={tName} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-800 line-clamp-1">{tName}</span>
                      <span className="text-xs font-bold text-indigo-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Benar {tData.correct} dari {tData.total} soal</span>
                      <span>Poin: {tData.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Question Review & Pembahasan */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Review Jawaban & Pembahasan Lengkap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pelajari kunci jawaban resmi dan langkah pembahasan KaTeX untuk setiap soal
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {detailedQuestions.map((item) => (
              <div
                key={item.index}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
              >
                {/* Question Item Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                      {item.index}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-indigo-600">{item.topicName}</span>
                      <span className="text-xs text-slate-400 mx-1.5">•</span>
                      <span className="text-xs text-slate-500 uppercase">{item.question?.difficulty}</span>
                    </div>
                  </div>

                  <div>
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Benar (+{item.scoreAwarded})
                      </span>
                    ) : item.selectedIds.length === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Kosong ({item.scoreAwarded})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Salah ({item.scoreAwarded})
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text with KaTeX */}
                <div className="text-slate-900 text-base leading-relaxed select-text space-y-3">
                  <MathRenderer content={item.question?.contentMarkdown || ''} />
                  {item.question?.imageUrl && (
                    <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
                      <img
                        src={item.question.imageUrl}
                        alt="Gambar Soal"
                        className="max-h-64 w-auto object-contain rounded-xl border border-slate-200 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {item.options.map((opt) => {
                    const isSelected = item.selectedIds.includes(opt.id);
                    const isCorrect = opt.isCorrect;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    let badgeStyle = 'bg-slate-100 text-slate-600';

                    if (isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50/60 text-rose-950 ring-1 ring-rose-400';
                      badgeStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 text-sm leading-relaxed transition ${optStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}>
                          {opt.label}
                        </span>

                        <div className="flex-1 pt-0.5">
                          <MathRenderer content={opt.contentMarkdown} />
                        </div>

                        {isCorrect && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                            Kunci Benar
                          </span>
                        )}

                        {isSelected && !isCorrect && (
                          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">
                            Jawaban Anda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-step Pembahasan */}
                {item.question?.explanationMarkdown && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-800 text-sm space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Pembahasan & Langkah Solusi:</span>
                    </div>
                    <div className="leading-relaxed text-slate-800 select-text">
                      <MathRenderer content={item.question.explanationMarkdown} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
