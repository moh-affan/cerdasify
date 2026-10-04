'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { OptionItem } from '@/components/exam/OptionItem';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { ExamGridNav, QuestionStatusItem } from '@/components/exam/ExamGridNav';
import { ExamConfirmModal } from '@/components/exam/ExamConfirmModal';
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  Send,
  Loader2,
  AlertCircle,
  Home,
  Pause,
  Play,
  Maximize2,
  X,
  BookOpen,
} from 'lucide-react';

interface QuestionOption {
  id: string;
  label: string;
  contentMarkdown: string;
  imageUrl?: string | null;
}

interface Question {
  id: string;
  topicName: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
  difficulty: string;
  contentMarkdown: string;
  imageUrl?: string | null;
  options: QuestionOption[];
}

interface AnswerState {
  selectedOptionIds: string[];
  isDoubtful: boolean;
}

export default function ExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [packageTitle, setPackageTitle] = useState<string>('');
  const [packageType, setPackageType] = useState<'SIMULATION' | 'PRACTICE'>('SIMULATION');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);

  const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    async function initExam() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Start or resume attempt
        const startRes = await fetch('/api/exam/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId }),
        });

        const startData = await startRes.json();
        if (!startRes.ok) {
          throw new Error(startData.error || 'Gagal memulai ujian');
        }

        const activeAttemptId = startData.attemptId;
        setAttemptId(activeAttemptId);

        // 2. Fetch questions and saved answers
        const attemptRes = await fetch(`/api/exam/attempt/${activeAttemptId}`);
        const attemptData = await attemptRes.json();

        if (!attemptRes.ok) {
          throw new Error(attemptData.error || 'Gagal memuat soal');
        }

        if (attemptData.attempt.status !== 'IN_PROGRESS' && attemptData.attempt.status !== 'PAUSED') {
          router.replace(`/results/${activeAttemptId}`);
          return;
        }

        setPackageTitle(attemptData.attempt.packageTitle);
        setPackageType(attemptData.attempt.packageType || 'SIMULATION');
        setQuestions(attemptData.questions);
        setAnswers(attemptData.answers || {});

        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          const qParam = sp.get('q');
          if (qParam) {
            const targetNum = parseInt(qParam, 10);
            if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= attemptData.questions.length) {
              const targetIdx = targetNum - 1;
              setCurrentIndex(targetIdx);
              if (sp.get('zoom') === '1' || sp.get('zoom') === 'true') {
                const targetQ = attemptData.questions[targetIdx];
                if (targetQ && targetQ.imageUrl) {
                  setZoomImageUrl(targetQ.imageUrl);
                }
              }
            }
          }
        }

        const isCurrentlyPaused = attemptData.attempt.status === 'PAUSED';
        setIsPaused(isCurrentlyPaused);

        // Compute elapsed seconds or restore remainingSeconds
        if (
          attemptData.attempt.remainingSeconds !== null &&
          attemptData.attempt.remainingSeconds !== undefined
        ) {
          setRemainingSeconds(attemptData.attempt.remainingSeconds);
        } else {
          const startTime = new Date(attemptData.attempt.startedAt).getTime();
          const durationSec = attemptData.attempt.durationMinutes * 60;
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const rem = Math.max(0, durationSec - elapsed);
          setRemainingSeconds(rem);
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    }

    if (packageId) {
      initExam();
    }
  }, [packageId, router]);

  // Save answer to server in background
  const triggerAutoSave = useCallback(
    async (qId: string, newState: AnswerState) => {
      if (!attemptId) return;
      try {
        await fetch('/api/exam/save-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId,
            questionId: qId,
            selectedOptionIds: newState.selectedOptionIds,
            isDoubtful: newState.isDoubtful,
          }),
        });
      } catch (e) {
        console.warn('Auto-save failed:', e);
      }
    },
    [attemptId]
  );

  // Handle Pause
  const handlePause = async () => {
    if (!attemptId || isPaused) return;
    setIsPaused(true);
    try {
      await fetch('/api/exam/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, remainingSeconds }),
      });
    } catch (e) {
      console.error('Failed to pause exam', e);
    }
  };

  // Handle Resume
  const handleResume = async () => {
    if (!attemptId) return;
    try {
      await fetch('/api/exam/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      });
      setIsPaused(false);
    } catch (e) {
      console.error('Failed to resume exam', e);
    }
  };

  // Handle Option Select
  const handleSelectOption = (optionId: string) => {
    if (isPaused) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentAns = answers[currentQ.id] || { selectedOptionIds: [], isDoubtful: false };
    const newSelected = [optionId]; // Single choice mode

    const updatedState: AnswerState = {
      ...currentAns,
      selectedOptionIds: newSelected,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: updatedState,
    }));

    triggerAutoSave(currentQ.id, updatedState);
  };

  // Toggle Doubtful
  const handleToggleDoubtful = () => {
    if (isPaused) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentAns = answers[currentQ.id] || { selectedOptionIds: [], isDoubtful: false };
    const updatedState: AnswerState = {
      ...currentAns,
      isDoubtful: !currentAns.isDoubtful,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: updatedState,
    }));

    triggerAutoSave(currentQ.id, updatedState);
  };

  // Submit Final Answers
  const handleSubmitExam = async () => {
    if (!attemptId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirimkan ujian');
      }

      router.push(data.redirectUrl || `/results/${attemptId}`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirimkan ujian. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-lg font-bold text-slate-800">Menyiapkan Ruang Ujian...</h2>
        <p className="text-sm text-slate-500 mt-1">Mengambil lembar soal dan memverifikasi sesi ujian</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Tidak Dapat Membuka Ujian</h2>
          <p className="text-sm text-slate-600 mt-2">{error || 'Paket soal belum tersedia'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition cursor-pointer"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] || { selectedOptionIds: [], isDoubtful: false };

  // Prepare grid nav data
  const gridItems: QuestionStatusItem[] = questions.map((q, idx) => {
    const a = answers[q.id];
    return {
      index: idx,
      questionId: q.id,
      isAnswered: (a?.selectedOptionIds?.length || 0) > 0,
      isDoubtful: Boolean(a?.isDoubtful),
    };
  });

  const answeredCount = gridItems.filter((x) => x.isAnswered && !x.isDoubtful).length;
  const doubtfulCount = gridItems.filter((x) => x.isDoubtful).length;
  const unansweredCount = gridItems.filter((x) => !x.isAnswered && !x.isDoubtful).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-indigo-100 relative">
      {/* Top Distraction-free Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push('/')}
            title="Keluar ke Dashboard"
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer shrink-0"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                title={packageTitle}
                className="font-bold text-slate-800 text-sm sm:text-base lg:text-lg truncate max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl"
              >
                {packageTitle}
              </h1>
              {packageType === 'PRACTICE' && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                  Mode Latihan
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
              <span>Soal {currentIndex + 1} dari {questions.length}</span>
              <span>•</span>
              <span className="font-medium text-indigo-600">{currentQ.topicName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Pause / Resume Button */}
          {isPaused ? (
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              title="Jeda ujian untuk istirahat sejenak"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-slate-200 text-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jeda</span>
            </button>
          )}

          {/* Countdown Timer */}
          <ExamTimer
            initialSeconds={remainingSeconds}
            onTimeOut={handleSubmitExam}
            onTick={(s) => setRemainingSeconds(s)}
            isPaused={isPaused}
          />

          {/* Selesai / Submit button on header for desktop */}
          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 active:scale-95 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Selesai Ujian
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 items-start pb-24 lg:pb-8 relative">
        {/* Question Panel */}
        <main className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 relative">
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                {currentQ.type === 'GRADED_SCALE' ? 'Skala Bertingkat (TKP)' : 'Pilihan Ganda'}
              </span>
              {currentQ.imageUrl && (
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  Bergambar
                </span>
              )}
              {currentQ.contentMarkdown.includes(':::passage') && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Soal Cerita / Teks Bacaan
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleDoubtful}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border active:scale-95 cursor-pointer ${
                currentAnswer.isDoubtful
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{currentAnswer.isDoubtful ? 'Tandai Ragu (Aktif)' : 'Ragu-ragu'}</span>
            </button>
          </div>

          {/* Question Text with KaTeX */}
          <div className="text-slate-900 text-base sm:text-lg leading-relaxed mb-6 select-text space-y-4">
            <MathRenderer content={currentQ.contentMarkdown} />

            {/* Stimulus Image Rendering with Zoom / Lightbox */}
            {currentQ.imageUrl && (
              <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded-2xl inline-block max-w-full">
                <div className="relative group cursor-pointer" onClick={() => setZoomImageUrl(currentQ.imageUrl!)}>
                  <img
                    src={currentQ.imageUrl}
                    alt={`Gambar Soal Nomor ${currentIndex + 1}`}
                    className="max-h-72 w-auto object-contain rounded-xl border border-slate-200 shadow-xs transition group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <Maximize2 className="w-4 h-4" />
                    <span>Klik Perbesar Gambar</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 px-1 italic">
                  Klik gambar untuk melihat resolusi penuh
                </p>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option) => (
              <OptionItem
                key={option.id}
                label={option.label}
                content={option.contentMarkdown}
                imageUrl={option.imageUrl}
                isSelected={currentAnswer.selectedOptionIds.includes(option.id)}
                onSelect={() => handleSelectOption(option.id)}
              />
            ))}
          </div>

          {/* Desktop Inline Pagination Controls */}
          <div className="hidden lg:flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Soal Sebelumnya
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition cursor-pointer"
              >
                Soal Berikutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Kumpulkan Ujian
              </button>
            )}
          </div>
        </main>

        {/* Sidebar Grid Navigation (Desktop Sidebar & Mobile Drawer) */}
        <ExamGridNav
          items={gridItems}
          currentIndex={currentIndex}
          onSelectIndex={(idx) => setCurrentIndex(idx)}
          isOpenMobile={isNavOpenMobile}
          onCloseMobile={() => setIsNavOpenMobile(false)}
        />
      </div>

      {/* PAUSE OVERLAY (When paused, hides questions to prevent cheating and provides clear resume UI) */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
              <Pause className="w-8 h-8 fill-current" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Sesi Pengerjaan Dijeda</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Timer dihentikan sementara dan jawaban Anda tersimpan aman di server. Lembar soal disembunyikan hingga Anda menekan tombol lanjutkan.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono font-bold">
              Sisa Waktu Tersimpan: {Math.floor(remainingSeconds / 60)} menit {remainingSeconds % 60} detik
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleResume}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lanjutkan Pengerjaan (Resume)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Kumpulkan Ujian Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM LIGHTBOX */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center p-2">
              <img
                src={zoomImageUrl}
                alt="Gambar Soal Resolusi Tinggi"
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-2 z-40 lg:hidden shadow-lg">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsNavOpenMobile(true)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4 text-indigo-600" />
          <span>Nomor ({currentIndex + 1}/{questions.length})</span>
        </button>

        <button
          type="button"
          onClick={handleToggleDoubtful}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            currentAnswer.isDoubtful
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={isPaused ? handleResume : handlePause}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            isPaused
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title={isPaused ? 'Lanjutkan Ujian' : 'Jeda Ujian'}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            Submit
          </button>
        )}
      </div>

      {/* Confirmation Submit Modal */}
      <ExamConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={handleSubmitExam}
        isSubmitting={isSubmitting}
        stats={{
          total: questions.length,
          answered: answeredCount,
          doubtful: doubtfulCount,
          unanswered: unansweredCount,
        }}
      />
    </div>
  );
}
