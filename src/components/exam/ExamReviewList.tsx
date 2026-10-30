'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, HelpCircle, BookOpen, Layers, BarChart3, Filter } from 'lucide-react';
import { MathRenderer } from '@/components/katex/MathRenderer';
import ZoomableImage from '@/components/ui/ZoomableImage';

export interface DetailedQuestionReview {
  index: number;
  question: {
    id: string;
    contentMarkdown: string | null;
    imageUrl: string | null;
    explanationMarkdown: string | null;
    explanationImageUrl: string | null;
    difficulty: string;
    topicId: string;
    type: string;
  };
  topicName: string;
  options: {
    id: string;
    questionId: string;
    label: string;
    contentMarkdown: string;
    imageUrl: string | null;
    isCorrect: boolean;
    scoreValue: number;
    orderIndex: number;
  }[];
  isGradedScale: boolean;
  topScale: number;
  selectedIds: string[];
  isCorrect: boolean;
  keyChangedAfterGrading: boolean;
  scoreAwarded: number;
  isDoubtful: boolean;
}

interface ExamReviewListProps {
  questions: DetailedQuestionReview[];
  allWeighted: boolean;
}

type FilterType = 'ALL' | 'WRONG' | 'CORRECT' | 'UNANSWERED';

export function ExamReviewList({ questions, allWeighted }: ExamReviewListProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const counts = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    for (const q of questions) {
      if (q.selectedIds.length === 0) {
        unanswered++;
      } else if (q.isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    }

    return {
      all: questions.length,
      correct,
      wrong,
      unanswered,
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (filter === 'ALL') return questions;
    if (filter === 'CORRECT') return questions.filter((q) => q.isCorrect);
    if (filter === 'WRONG') return questions.filter((q) => q.selectedIds.length > 0 && !q.isCorrect);
    if (filter === 'UNANSWERED') return questions.filter((q) => q.selectedIds.length === 0);
    return questions;
  }, [questions, filter]);

  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`question-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Review Jawaban & Pembahasan Lengkap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelajari kunci jawaban resmi dan langkah pembahasan KaTeX untuk setiap soal
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Menampilkan <strong className="text-slate-800">{filteredQuestions.length}</strong> dari{' '}
              <strong className="text-slate-800">{questions.length}</strong> soal
            </span>
          </div>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Soal</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                filter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('WRONG')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
              filter === 'WRONG'
                ? allWeighted
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : allWeighted
                  ? 'bg-amber-50/70 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-rose-50/70 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {allWeighted ? <BarChart3 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{allWeighted ? 'Pilihan Sebagian' : 'Jawaban Salah'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                filter === 'WRONG'
                  ? 'bg-white/20 text-white'
                  : allWeighted
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-rose-200 text-rose-900'
              }`}
            >
              {counts.wrong}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('CORRECT')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
              filter === 'CORRECT'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{allWeighted ? 'Pilihan Terbaik' : 'Jawaban Benar'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                filter === 'CORRECT' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              {counts.correct}
            </span>
          </button>

          {counts.unanswered > 0 && (
            <button
              type="button"
              onClick={() => setFilter('UNANSWERED')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
                filter === 'UNANSWERED'
                  ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tidak Dijawab</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                  filter === 'UNANSWERED' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-800'
                }`}
              >
                {counts.unanswered}
              </span>
            </button>
          )}
        </div>

        {/* Quick jump bar for filtered items */}
        {filteredQuestions.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">Lompat ke No:</span>
            {filteredQuestions.map((q) => {
              let badgeColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (q.selectedIds.length === 0) {
                badgeColor = 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200';
              } else if (q.isGradedScale) {
                badgeColor = q.isCorrect
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200';
              } else if (q.isCorrect) {
                badgeColor = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200';
              } else {
                badgeColor = 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200';
              }

              return (
                <button
                  key={q.index}
                  type="button"
                  onClick={() => scrollToQuestion(q.index)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition flex items-center justify-center shrink-0 ${badgeColor}`}
                  title={`Soal nomor ${q.index} (${q.topicName})`}
                >
                  {q.index}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State when no questions match the active filter */}
      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            {filter === 'WRONG' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Layers className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {filter === 'WRONG'
              ? 'Luar biasa! Tidak ada jawaban yang salah.'
              : filter === 'CORRECT'
                ? 'Belum ada jawaban yang benar pada ujian ini.'
                : 'Tidak ada soal dalam kategori ini.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === 'WRONG'
              ? 'Seluruh soal yang Anda jawab berhasil dijawab dengan tepat.'
              : 'Silakan pilih filter lain untuk meninjau pembahasan soal.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              <span>Tampilkan Semua Soal</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Items List */}
      <div className="space-y-6">
        {filteredQuestions.map((item) => (
          <div
            key={item.index}
            id={`question-${item.index}`}
            className="scroll-mt-24 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 transition"
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
                    {item.isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}+{item.scoreAwarded} dari{' '}
                    {item.topScale} poin
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

            {item.keyChangedAfterGrading && (
              <p className="mb-3 px-3 py-2 rounded-xl text-xs bg-amber-50 text-amber-800 border border-amber-200">
                Kunci soal ini diperbaiki setelah ujian dinilai. Status di atas mengikuti kunci lama; kunci yang
                disorot di bawah adalah kunci terbaru.
              </p>
            )}

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
                  optStyle =
                    'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium ring-1 ring-emerald-500';
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
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                    >
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
  );
}

