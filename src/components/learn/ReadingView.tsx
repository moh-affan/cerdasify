'use client';

import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Volume2,
  Square,
  Languages,
  Lightbulb,
  BookMarked,
  CheckCircle2,
  XCircle,
  Star,
  Loader2,
  X,
  Turtle,
  LogIn,
} from 'lucide-react';
import type { ContentSegment } from '@/lib/learning';
import { cn } from '@/lib/utils';
import ComicPanelView from './ComicPanelView';
import SpeechPractice from './SpeechPractice';

export interface VocabItem {
  word: string;
  forms: string[];
  partOfSpeech: string | null;
  meaning: string;
  example: string | null;
  emoji: string | null;
}

export interface GrammarItem {
  title: string;
  pattern: string | null;
  explanation: string;
  examples: string[];
}

export interface QuizItem {
  prompt: string;
  options: string[];
}

interface QuizResult {
  selected: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string | null;
}

interface ReadingViewProps {
  contentId: string;
  segments: ContentSegment[];
  vocab: VocabItem[];
  grammar: GrammarItem[];
  quiz: QuizItem[];
  kidsMode: boolean;
  isLoggedIn: boolean;
  previousScore: { score: number; total: number } | null;
  /** Judul bagian catatan (grammar / pesan moral / fakta) */
  notesHeading?: string;
  /** Tampilkan tombol mode latihan pidato (teleprompter) */
  practiceMode?: boolean;
}

const noopSubscribe = () => () => {};

function useSpeech(kidsMode: boolean) {
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => 'speechSynthesis' in window,
    () => false
  );
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [slow, setSlow] = useState(kidsMode);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);
  }, []);

  /** Bacakan antrean teks; `indices` dipakai untuk menyorot kalimat yang sedang dibaca. */
  const speak = useCallback(
    (texts: string[], indices: (number | null)[] = [], lang = 'en-US') => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      texts.forEach((text, i) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = slow ? 0.7 : 0.95;
        u.onstart = () => setSpeakingIdx(indices[i] ?? null);
        if (i === texts.length - 1) u.onend = () => setSpeakingIdx(null);
        window.speechSynthesis.speak(u);
      });
    },
    [supported, slow]
  );

  return { supported, speakingIdx, slow, setSlow, speak, stop };
}

export default function ReadingView({
  contentId,
  segments,
  vocab,
  grammar,
  quiz,
  kidsMode,
  isLoggedIn,
  previousScore,
  notesHeading,
  practiceMode,
}: ReadingViewProps) {
  const [practicing, setPracticing] = useState(false);
  const { supported, speakingIdx, slow, setSlow, speak, stop } = useSpeech(kidsMode);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [openTranslations, setOpenTranslations] = useState<Set<number>>(new Set());
  const [activeVocab, setActiveVocab] = useState<VocabItem | null>(null);

  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Peta kata (lowercase) → vocab, termasuk bentuk lain (jamak, lampau, dst.)
  const { vocabRegex, vocabLookup } = useMemo(() => {
    const lookup = new Map<string, VocabItem>();
    for (const v of vocab) {
      for (const w of [v.word, ...v.forms]) lookup.set(w.toLowerCase(), v);
    }
    const words = [...lookup.keys()].sort((a, b) => b.length - a.length);
    const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return {
      vocabLookup: lookup,
      vocabRegex: escaped.length ? new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi') : null,
    };
  }, [vocab]);

  const renderWithVocab = (text: string, key: string) => {
    if (!vocabRegex) return text;
    const parts = text.split(vocabRegex);
    return parts.map((part, i) => {
      const v = i % 2 === 1 ? vocabLookup.get(part.toLowerCase()) : undefined;
      if (!v) return <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>;
      return (
        <button
          key={`${key}-${i}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveVocab(v);
          }}
          className="font-semibold text-indigo-700 underline decoration-indigo-300 decoration-2 underline-offset-4 hover:bg-indigo-50 rounded"
        >
          {part}
        </button>
      );
    });
  };

  const toggleTranslation = (idx: number) => {
    setOpenTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Teks utama: kalimat Inggris (en) atau teks berbahasa Indonesia (tx), misalnya cerita & ensiklopedia
  const mainText = (seg: ContentSegment) =>
    seg.panel
      ? [seg.panel.caption, ...(seg.panel.bubbles ?? []).map((b) => b.text)].filter(Boolean).join('. ')
      : seg.en ?? seg.tx ?? '';
  const spokenIdx = segments.map((s, i) => (mainText(s) ? i : null)).filter((i): i is number => i !== null);
  const isEnglish = segments.some((s) => s.en);
  const speechLang = isEnglish ? 'en-US' : 'id-ID';
  const hasTranslations = segments.some((s) => s.en && s.id);
  const isComic = segments.length > 0 && segments.every((s) => s.panel);

  const playAll = () => {
    if (speakingIdx !== null) return stop();
    speak(
      spokenIdx.map((i) => mainText(segments[i])),
      spokenIdx,
      speechLang
    );
  };

  // Kelompokkan kalimat ke dalam paragraf
  const paragraphs: number[][] = [];
  segments.forEach((s, i) => {
    if (i === 0 || s.break || s.h || s.panel) paragraphs.push([]);
    paragraphs[paragraphs.length - 1].push(i);
  });

  const submitQuiz = async () => {
    if (answers.some((a) => a === null)) {
      setError('Jawab semua pertanyaan dulu, ya!');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/learn/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      setResults(data.results);
      setScore({ score: data.score, total: data.total });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers(quiz.map(() => null));
    setResults(null);
    setScore(null);
  };

  const textSize = kidsMode ? 'text-xl sm:text-2xl leading-[1.9]' : 'text-base sm:text-lg leading-relaxed';

  return (
    <div className="space-y-6">
      {practiceMode && (
        <button
          type="button"
          onClick={() => setPracticing(true)}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          🎤 Mode Latihan Pidato (Teleprompter)
        </button>
      )}
      {practicing && <SpeechPractice segments={segments} onClose={() => setPracticing(false)} />}

      {/* Toolbar Audio & Terjemahan */}
      {spokenIdx.length > 0 && (supported || hasTranslations) && (
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-2 shadow-xs">
        {supported && (
          <>
            <button
              type="button"
              onClick={playAll}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition active:scale-95',
                speakingIdx !== null ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              )}
            >
              {speakingIdx !== null ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
              <span>{speakingIdx !== null ? 'Berhenti' : 'Dengarkan'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSlow(!slow)}
              title="Kecepatan suara"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition',
                slow ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'
              )}
            >
              <Turtle className="w-4 h-4" />
              <span>{slow ? 'Pelan' : 'Normal'}</span>
            </button>
          </>
        )}
        {hasTranslations && (
        <button
          type="button"
          onClick={() => {
            setShowAllTranslations(!showAllTranslations);
            setOpenTranslations(new Set());
          }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ml-auto',
            showAllTranslations ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-600'
          )}
        >
          <Languages className="w-4 h-4" />
          <span>{showAllTranslations ? 'Sembunyikan Arti' : 'Tampilkan Arti'}</span>
        </button>
        )}
      </div>
      )}

      {kidsMode && spokenIdx.length > 0 && (
        <p className="text-xs text-slate-500 px-1">
          💡 {vocab.length > 0 && (
            <>
              Ketuk <span className="font-semibold text-indigo-700 underline decoration-indigo-300">kata berwarna</span> untuk
              melihat artinya.{' '}
            </>
          )}
          Ketuk 🔊 untuk mendengar{hasTranslations ? ', dan 🇮🇩 untuk melihat terjemahan kalimat' : ' kalimatnya'}.
        </p>
      )}

      {/* Teks Bacaan */}
      {segments.length > 0 && (
      <article
        className={cn(
          'space-y-5',
          !isComic && 'bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs'
        )}
      >
        {paragraphs.map((para, pIdx) => (
          <div key={pIdx} className={kidsMode ? 'space-y-3' : ''}>
            {segments[para[0]].h && (
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">{segments[para[0]].h}</h3>
            )}
            {para.map((idx) => {
              const seg = segments[idx];
              const translationOpen = showAllTranslations || openTranslations.has(idx);
              const isSpeaking = speakingIdx === idx;

              if (seg.panel) {
                return (
                  <ComicPanelView
                    key={idx}
                    panel={seg.panel}
                    index={segments.slice(0, idx).filter((x) => x.panel).length}
                    isSpeaking={isSpeaking}
                  />
                );
              }

              if (seg.ar) {
                return (
                  <div key={idx} className="py-4 border-b border-slate-100 last:border-0 space-y-2">
                    <div className="flex items-start gap-3">
                      {seg.n !== undefined && (
                        <span className="shrink-0 mt-2 w-8 h-8 rounded-full border-2 border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          {seg.n}
                        </span>
                      )}
                      <p dir="rtl" lang="ar" className="flex-1 text-3xl sm:text-4xl leading-[2.3] text-slate-900 text-right font-arabic">
                        {seg.ar}
                      </p>
                    </div>
                    {seg.latin && <p className="text-sm italic text-emerald-800">{seg.latin}</p>}
                    {seg.id && <p className="text-sm text-slate-600">{seg.id}</p>}
                  </div>
                );
              }

              return (
                <span key={idx} className={cn(kidsMode ? 'block' : 'inline')}>
                  <span
                    className={cn(
                      textSize,
                      'text-slate-800 rounded-lg transition-colors',
                      isSpeaking && 'bg-yellow-100'
                    )}
                  >
                    {renderWithVocab(mainText(seg), `s${idx}`)}
                  </span>
                  {kidsMode && (
                    <span className="inline-flex items-center gap-1 ml-2 align-middle">
                      {supported && (
                        <button
                          type="button"
                          onClick={() => speak([mainText(seg)], [idx], speechLang)}
                          className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 inline-flex items-center justify-center"
                          aria-label="Dengarkan kalimat"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                      {seg.en && seg.id && !showAllTranslations && (
                        <button
                          type="button"
                          onClick={() => toggleTranslation(idx)}
                          className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 inline-flex items-center justify-center text-sm"
                          aria-label="Lihat terjemahan"
                        >
                          🇮🇩
                        </button>
                      )}
                    </span>
                  )}
                  {translationOpen && seg.en && seg.id && (
                    <span
                      className={cn(
                        'text-amber-800 bg-amber-50 rounded-lg',
                        kidsMode ? 'block text-base mt-1 px-3 py-1.5' : 'block text-sm my-1 px-2.5 py-1'
                      )}
                    >
                      {seg.id}
                    </span>
                  )}
                  {!kidsMode && ' '}
                </span>
              );
            })}
          </div>
        ))}
      </article>
      )}

      {/* Kosakata */}
      {vocab.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            {kidsMode || !isEnglish ? 'Kata Baru' : 'Keywords & Vocabulary'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vocab.map((v) => (
              <button
                key={v.word}
                type="button"
                onClick={() => {
                  setActiveVocab(v);
                  speak([v.word], [], speechLang);
                }}
                className="text-left bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition active:scale-98"
              >
                {v.emoji && <div className={kidsMode ? 'text-4xl mb-1' : 'text-2xl mb-1'}>{v.emoji}</div>}
                <div className="font-bold text-slate-900 text-base">{v.word}</div>
                {v.partOfSpeech && !kidsMode && (
                  <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{v.partOfSpeech}</div>
                )}
                <div className="text-sm text-slate-600">{v.meaning}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grammar */}
      {grammar.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            {notesHeading ?? (kidsMode ? 'Pola Kalimat' : 'Analisis Grammar')}
          </h2>
          {grammar.map((g) => (
            <div key={g.title} className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200 p-4 sm:p-5 space-y-2.5">
              <h3 className="font-bold text-amber-900">{g.title}</h3>
              {g.pattern && (
                <div className="inline-block font-mono text-sm bg-white border border-amber-200 text-amber-900 rounded-lg px-3 py-1.5">
                  {g.pattern}
                </div>
              )}
              <p className="text-sm text-slate-700 leading-relaxed">{g.explanation}</p>
              {g.examples.length > 0 && (
                <ul className="space-y-1">
                  {g.examples.map((ex) => (
                    <li key={ex} className="text-sm text-slate-800 flex gap-2">
                      <span className="text-amber-500">▸</span>
                      <span className="italic">{ex}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Kuis */}
      {quiz.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            {kidsMode || !isEnglish ? 'Ayo Jawab!' : 'Comprehension Check'}
          </h2>

          {previousScore && !score && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              ✅ Kamu sudah menyelesaikan bacaan ini. Skor terbaik: {previousScore.score}/{previousScore.total}
            </p>
          )}

          {quiz.map((q, qIdx) => {
            const r = results?.[qIdx];
            return (
              <div key={qIdx} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <p className={cn('font-semibold text-slate-900', kidsMode ? 'text-lg' : 'text-sm sm:text-base')}>
                  {qIdx + 1}. {q.prompt}
                </p>
                <div className={cn('grid gap-2', kidsMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
                  {q.options.map((opt, oIdx) => {
                    const selected = answers[qIdx] === oIdx;
                    const isCorrect = r && r.correctIndex === oIdx;
                    const isWrongPick = r && selected && !r.isCorrect;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={!!results}
                        onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qIdx ? oIdx : a)))}
                        className={cn(
                          'text-left rounded-xl border-2 px-4 py-3 transition flex items-center gap-2',
                          kidsMode ? 'text-base' : 'text-sm',
                          isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                            : isWrongPick
                              ? 'border-rose-400 bg-rose-50 text-rose-900'
                              : selected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                                : 'border-slate-200 hover:border-indigo-300 text-slate-800'
                        )}
                      >
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {isWrongPick && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {r?.explanation && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">💬 {r.explanation}</p>
                )}
              </div>
            );
          })}

          {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk akun untuk mengecek jawaban & menyimpan progres
            </Link>
          ) : score ? (
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white text-center space-y-3">
              <div className="text-4xl">
                {Array.from({ length: score.total }, (_, i) => (i < score.score ? '⭐' : '☆')).join('')}
              </div>
              <p className="text-lg font-extrabold">
                {score.score === score.total
                  ? kidsMode || !isEnglish
                    ? 'Hebat sekali! Semua benar! 🎉'
                    : 'Perfect score! 🎉'
                  : `Kamu benar ${score.score} dari ${score.total}. Terus semangat!`}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold"
                >
                  Coba Lagi
                </button>
                <Link href="/belajar" className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-bold">
                  Kembali ke Pustaka
                </Link>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={submitQuiz}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {kidsMode || !isEnglish ? 'Cek Jawabanku ✨' : 'Check Answers'}
            </button>
          )}
        </section>
      )}

      {/* Popup Kosakata */}
      {activeVocab && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 flex items-end sm:items-center justify-center p-4"
          onClick={() => setActiveVocab(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {activeVocab.emoji && <span className="text-5xl">{activeVocab.emoji}</span>}
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{activeVocab.word}</h3>
                  {activeVocab.partOfSpeech && (
                    <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      {activeVocab.partOfSpeech}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveVocab(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-lg text-slate-800">
              {isEnglish ? '🇮🇩' : '💡'} {activeVocab.meaning}
            </p>
            {activeVocab.example && (
              <p className="text-sm italic text-slate-600 bg-slate-50 rounded-xl px-3 py-2">“{activeVocab.example}”</p>
            )}
            {supported && (
              <button
                type="button"
                onClick={() =>
                  speak([activeVocab.word, ...(activeVocab.example ? [activeVocab.example] : [])], [], speechLang)
                }
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Dengarkan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
