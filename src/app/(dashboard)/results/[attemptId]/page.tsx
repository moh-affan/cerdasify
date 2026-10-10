import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions, questions, questionOptions, attemptAnswers, topics, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { finalizeAttempt, parseSelectedIds } from '@/lib/exam-grading';
import { orderOptionsForAttempt, orderQuestionsForAttempt } from '@/lib/exam-data';
import { isPastDeadline } from '@/lib/exam-time';
import type { ScoreResult } from '@/lib/scoring';
import ZoomableImage from '@/components/ui/ZoomableImage';
import { eq, asc, inArray } from 'drizzle-orm';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowLeft, Clock, BarChart3, BookOpen } from 'lucide-react';
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
  const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);

  if (!attempt) {
    notFound();
  }

  if (attempt.userId !== user.userId && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    redirect('/');
  }

  const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, attempt.packageId)).limit(1);
  if (!pkg) {
    notFound();
  }

  // Kunci jawaban & pembahasan TIDAK boleh tampil selama attempt masih berjalan (anti-leak)
  if (attempt.status === 'IN_PROGRESS' || attempt.status === 'PAUSED') {
    if (isPastDeadline(attempt, pkg.durationMinutes)) {
      await finalizeAttempt(attempt.id, pkg, 'TIMED_OUT');
      redirect(`/results/${attempt.id}`);
    }
    if (attempt.userId === user.userId) redirect(`/exam/${pkg.id}`);
    // Staf yang melihat attempt orang lain yang masih berjalan
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-sm text-slate-600">
        Attempt ini masih berlangsung. Hasil dan pembahasan tersedia setelah peserta menyelesaikan ujian.
      </div>
    );
  }

  const [cat] = await db.select().from(categories).where(eq(categories.id, pkg.categoryId)).limit(1);

  let breakdown: Partial<ScoreResult> = {};
  try {
    breakdown = attempt.scoreBreakdown ? JSON.parse(attempt.scoreBreakdown) : {};
  } catch {
    breakdown = {};
  }
  // Status benar/salah mengikuti hasil penilaian server yang tersimpan
  const gradedMap = new Map((breakdown.scoreBreakdown?.answersGraded ?? []).map((g) => [g.questionId, g]));

  const [answersDb, pkgQs, allTopics] = await Promise.all([
    db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, attempt.id)),
    db
      .select({ questionId: packageQuestions.questionId })
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, pkg.id))
      .orderBy(asc(packageQuestions.orderIndex)),
    db.select().from(topics),
  ]);
  const answersMap = new Map(answersDb.map((a) => [a.questionId, a]));
  const topicMap = new Map(allTopics.map((t) => [t.id, t.name]));

  // Urutan sama seperti saat ujian (termasuk bila soal/opsi diacak)
  const relevantQIds = orderQuestionsForAttempt(
    pkgQs.length > 0 ? pkgQs.map((pq) => pq.questionId) : answersDb.map((a) => a.questionId),
    attempt.id,
    pkg
  );

  const [relevantQuestions, relevantOpts] =
    relevantQIds.length > 0
      ? await Promise.all([
          db.select().from(questions).where(inArray(questions.id, relevantQIds)),
          db
            .select()
            .from(questionOptions)
            .where(inArray(questionOptions.questionId, relevantQIds))
            .orderBy(asc(questionOptions.orderIndex)),
        ])
      : [[], []];
  const qMap = new Map(relevantQuestions.map((q) => [q.id, q]));
  const optsMap = new Map<string, typeof relevantOpts>();
  for (const opt of relevantOpts) {
    if (!optsMap.has(opt.questionId)) optsMap.set(opt.questionId, []);
    optsMap.get(opt.questionId)!.push(opt);
  }

  const detailedQuestions = relevantQIds
    .map((qId) => qMap.get(qId))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q, idx) => {
      const ans = answersMap.get(q.id);
      const graded = gradedMap.get(q.id);
      const selectedIds = graded?.selectedOptionIds ?? parseSelectedIds(ans?.selectedOptionIds ?? null);
      const opts = orderOptionsForAttempt(optsMap.get(q.id) || [], attempt.id, q.id, pkg);
      const correctIds = opts.filter((o) => o.isCorrect).map((o) => o.id);
      const isGradedScale = q.type === 'GRADED_SCALE';
      const topScale = Math.max(0, ...opts.map((o) => o.scoreValue));
      const isCorrect =
        graded?.isCorrect ??
        (isGradedScale
          ? (ans?.scoreAwarded ?? 0) === topScale
          : selectedIds.length === correctIds.length && correctIds.length > 0 && correctIds.every((id) => selectedIds.includes(id)));

      return {
        index: idx + 1,
        question: q,
        topicName: topicMap.get(q.topicId) || 'Umum',
        options: opts,
        isGradedScale,
        topScale,
        selectedIds,
        isCorrect,
        scoreAwarded: graded?.scoreAwarded ?? ans?.scoreAwarded ?? 0,
        isDoubtful: Boolean(ans?.isDoubtful),
      };
    });

  // Calculate durations
  const startTime = new Date(attempt.startedAt).getTime();
  // Attempt di halaman ini selalu sudah selesai, jadi finishedAt tersedia
  const finishTime = new Date(attempt.finishedAt ?? attempt.startedAt).getTime();
  const durationMinutes = Math.max(1, Math.round((finishTime - startTime) / 60000));

  const correctCount = detailedQuestions.filter((q) => q.isCorrect).length;
  const answeredCount = detailedQuestions.filter((q) => q.selectedIds.length > 0).length;
  const wrongCount = answeredCount - correctCount;
  const emptyCount = detailedQuestions.length - answeredCount;
  // Paket yang seluruhnya soal berbobot (SJT/TKP) tidak mengenal benar/salah
  const allWeighted = detailedQuestions.length > 0 && detailedQuestions.every((q) => q.isGradedScale);
  const weightedEarned = detailedQuestions.reduce((sum, q) => sum + (q.isGradedScale ? q.scoreAwarded : 0), 0);
  const weightedMax = detailedQuestions.reduce((sum, q) => sum + (q.isGradedScale ? q.topScale : 0), 0);
  // Topik yang seluruh soalnya berbobot: persentase dihitung dari poin, bukan jumlah benar
  const topicWeightedMax = new Map<string, number>();
  for (const name of new Set(detailedQuestions.map((q) => q.topicName))) {
    const inTopic = detailedQuestions.filter((q) => q.topicName === name);
    if (inTopic.every((q) => q.isGradedScale)) topicWeightedMax.set(name, inTopic.reduce((sum, q) => sum + q.topScale, 0));
  }

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
                <span>
                  {attempt.status === 'TIMED_OUT' ? 'Waktu habis pada' : 'Disubmit pada'}{' '}
                  {new Date(attempt.finishedAt || attempt.startedAt).toLocaleString('id-ID')}
                </span>
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
              <span>{allWeighted ? 'Pilihan Terbaik' : 'Jawaban Benar'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {correctCount}
              <span className="text-xs font-normal text-slate-400 ml-1">soal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>{allWeighted ? 'Pilihan Bernilai Sebagian' : 'Jawaban Salah'}</span>
              {allWeighted ? <BarChart3 className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className={`text-2xl font-extrabold font-mono ${allWeighted ? 'text-amber-600' : 'text-rose-500'}`}>
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
              <span>{allWeighted ? 'Perolehan Poin' : 'Akurasi Jawaban'}</span>
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600 font-mono">
              {allWeighted
                ? weightedMax > 0
                  ? Math.round((weightedEarned / weightedMax) * 100)
                  : 0
                : detailedQuestions.length > 0
                  ? Math.round((correctCount / detailedQuestions.length) * 100)
                  : 0}
              %
            </div>
          </div>
        </div>

        {/* Topic Breakdown if available */}
        {breakdown.scoreBreakdown?.byTopic && Object.keys(breakdown.scoreBreakdown.byTopic).length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Analisis Performa Per Topik Soal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(breakdown.scoreBreakdown?.byTopic ?? {}).map(([tName, tData]) => {
                const weightedMaxTopic = topicWeightedMax.get(tName);
                const pct = weightedMaxTopic
                  ? Math.round((tData.score / weightedMaxTopic) * 100)
                  : tData.total > 0
                    ? Math.round((tData.correct / tData.total) * 100)
                    : 0;
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
                      {weightedMaxTopic ? (
                        <>
                          <span>Terbaik {tData.correct} dari {tData.total} soal</span>
                          <span>Poin: {tData.score} dari {weightedMaxTopic}</span>
                        </>
                      ) : (
                        <>
                          <span>Benar {tData.correct} dari {tData.total} soal</span>
                          <span>Poin: {tData.score}</span>
                        </>
                      )}
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
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="text-xs font-semibold text-indigo-600">{item.topicName}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 uppercase">{item.question.difficulty}</span>
                      {item.question.contentMarkdown?.includes(':::passage') && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Soal Cerita
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    {item.isGradedScale && item.selectedIds.length > 0 ? (
                      // Soal berbobot: tidak ada benar/salah, yang ada perolehan poin
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          item.isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {item.isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}+{item.scoreAwarded} dari {item.topScale} poin
                      </span>
                    ) : item.isCorrect ? (
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
                  <MathRenderer content={item.question.contentMarkdown || ''} />
                  {item.question.imageUrl && (
                    <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
                      <ZoomableImage
                        src={item.question.imageUrl}
                        alt={`Gambar soal nomor ${item.index}`}
                        className="max-h-64 w-auto object-contain rounded-xl border border-slate-200 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {item.options.map((opt) => {
                    const isSelected = item.selectedIds.includes(opt.id);
                    // TKP: opsi bernilai tertinggi ditandai sebagai jawaban terbaik
                    const isCorrect = item.isGradedScale ? opt.scoreValue === item.topScale : opt.isCorrect;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    let badgeStyle = 'bg-slate-100 text-slate-600';

                    if (isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isSelected && item.isGradedScale) {
                      // pilihan bernilai sebagian, bukan jawaban salah
                      optStyle = 'border-amber-400 bg-amber-50/60 text-amber-950 ring-1 ring-amber-400';
                      badgeStyle = 'bg-amber-500 text-white';
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

                        <div className="flex-1 pt-0.5 space-y-2">
                          <MathRenderer content={opt.contentMarkdown} />
                          {opt.imageUrl && (
                            <ZoomableImage
                              src={opt.imageUrl}
                              alt={`Gambar opsi ${opt.label}`}
                              className="max-h-40 w-auto object-contain rounded-lg border border-slate-200"
                            />
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {item.isGradedScale && (
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                              {opt.scoreValue} poin
                            </span>
                          )}

                          {isCorrect && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                              {item.isGradedScale ? 'Terbaik' : 'Kunci Benar'}
                            </span>
                          )}

                          {isSelected && !isCorrect && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
                                item.isGradedScale ? 'text-amber-800 bg-amber-100' : 'text-rose-700 bg-rose-100'
                              }`}
                            >
                              Jawaban Anda
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-step Pembahasan */}
                {(item.question.explanationMarkdown || item.question.explanationImageUrl) && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-800 text-sm space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Pembahasan & Langkah Solusi:</span>
                    </div>
                    <div className="leading-relaxed text-slate-800 select-text">
                      <MathRenderer content={item.question.explanationMarkdown ?? ''} />
                    </div>
                    {item.question.explanationImageUrl && (
                      <ZoomableImage
                        src={item.question.explanationImageUrl}
                        alt={`Gambar pembahasan nomor ${item.index}`}
                        className="mt-2 max-h-64 w-auto object-contain rounded-xl border border-indigo-100 bg-white"
                      />
                    )}
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
