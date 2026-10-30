import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions, questions, questionOptions, attemptAnswers, topics, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { finalizeAttempt, parseSelectedIds } from '@/lib/exam-grading';
import { orderOptionsForAttempt, orderQuestionsForAttempt } from '@/lib/exam-data';
import { isPastDeadline } from '@/lib/exam-time';
import type { ScoreResult } from '@/lib/scoring';
import { DeleteAttemptButton } from '@/components/exam/DeleteAttemptButton';
import { TrashReviewActions } from '@/components/exam/TrashReviewActions';
import { ExamReviewList } from '@/components/exam/ExamReviewList';
import { eq, asc, inArray } from 'drizzle-orm';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowLeft, Clock, BarChart3 } from 'lucide-react';
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

  const isStaffViewer = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
  if (attempt.userId !== user.userId && !isStaffViewer) {
    redirect('/');
  }
  // Hasil di sampah sudah "dihapus" bagi pemiliknya; staf masih bisa meninjau sebelum mengonfirmasi
  if (attempt.deletedAt && !isStaffViewer) {
    notFound();
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
      const matchesCurrentKey =
        selectedIds.length === correctIds.length && correctIds.length > 0 && correctIds.every((id) => selectedIds.includes(id));
      const isCorrect = graded?.isCorrect ?? (isGradedScale ? (ans?.scoreAwarded ?? 0) === topScale : matchesCurrentKey);
      // Nilai dibekukan saat submit; bila kunci diperbaiki sesudahnya, sorotan kunci di bawah bisa berbeda dari status
      const keyChangedAfterGrading = !isGradedScale && Boolean(graded) && graded!.isCorrect !== matchesCurrentKey;

      return {
        index: idx + 1,
        question: q,
        topicName: topicMap.get(q.topicId) || 'Umum',
        options: opts,
        isGradedScale,
        topScale,
        selectedIds,
        isCorrect,
        keyChangedAfterGrading,
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
            {attempt.deletedAt && isStaffViewer ? (
              <TrashReviewActions
                endpoint={`/api/exam/attempt/${attempt.id}`}
                packageTitle={pkg.title}
                ownerName="peserta ini"
                redirectAfterConfirm="/admin"
              />
            ) : (
              <DeleteAttemptButton
                variant="button"
                attemptId={attempt.id}
                packageTitle={pkg.title}
                toTrash={attempt.userId === user.userId && Boolean(user.parentId) && !isStaffViewer}
                redirectTo={attempt.userId === user.userId ? '/' : '/admin'}
              />
            )}
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
        <ExamReviewList questions={detailedQuestions} allWeighted={allWeighted} />
      </main>
    </div>
  );
}
