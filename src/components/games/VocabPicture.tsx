'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Volume2, ArrowRight, Check, X, Delete } from 'lucide-react';
import { gradeVocab, isVocabAnswerCorrect, type VocabAnswer } from '@/lib/games/vocab';
import type { VocabCard, VocabConfig } from '@/lib/games/types';
import { buzz, isSoundOn, playSfx } from '@/lib/games/sfx';
import { canSpeak, speak } from '@/lib/games/speech';
import { cn } from '@/lib/utils';
import { LetterPad } from './Pads';
import type { EngineProps } from './engine';

const noopSubscribe = () => () => {};

export default function VocabPicture({ set, round, paused, kids, onFinish }: EngineProps) {
  const deck = set.items as VocabCard[];
  const cfg = set.config as VocabConfig;
  const items = round ?? [];
  const ttsOk = useSyncExternalStore(noopSubscribe, canSpeak, () => false);

  const [step, setStep] = useState(0);
  const [introduced, setIntroduced] = useState<Set<number>>(() => new Set());
  const [typed, setTyped] = useState('');
  const [usedTiles, setUsedTiles] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; chosen: VocabAnswer } | null>(null);
  const answers = useRef<VocabAnswer[]>([]);
  const finished = useRef(false);

  const item = items[step];
  const card = item ? deck[item.idx] : null;
  const showIntro = !!item && item.isNew && !introduced.has(step);

  const say = useCallback(
    (word: string) => {
      if (cfg.speak && isSoundOn()) speak(word, 'en-US', kids);
    },
    [cfg.speak, kids]
  );

  // Ucapkan kata saat kartu kenalan / soal "Dengar & Pilih" muncul
  useEffect(() => {
    if (!card || paused || feedback) return;
    if (showIntro || item.mode === 'LISTEN_PICK') {
      const t = window.setTimeout(() => say(card.word), 250);
      return () => window.clearTimeout(t);
    }
  }, [card, feedback, item, paused, say, showIntro]);

  const answer = (value: VocabAnswer) => {
    if (!item || !card || feedback || paused) return;
    const ok = isVocabAnswerCorrect(item, deck, value);
    answers.current[step] = value;
    setFeedback({ ok, chosen: value });
    if (ok) playSfx('correct');
    else {
      playSfx('wrong');
      buzz();
    }
    say(card.word);
  };

  const next = () => {
    setFeedback(null);
    setTyped('');
    setUsedTiles([]);
    if (step + 1 < items.length) {
      setStep(step + 1);
      return;
    }
    if (finished.current) return;
    finished.current = true;
    const all = items.map((_, i) => answers.current[i] ?? null);
    const graded = gradeVocab(items, deck, all);
    onFinish({
      log: all,
      local: graded,
      summary: (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-700">Kosakata ronde ini:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {items.map((it, i) => {
              const c = deck[it.idx];
              return (
                <li key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 text-sm">
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <b>{c.word}</b> <span className="text-slate-500">· {c.meaning}</span>
                  </span>
                  {graded.results[i] ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-500" />}
                  <button type="button" onClick={() => speak(c.word)} className="p-1 text-indigo-600" aria-label={`Dengarkan ${c.word}`}>
                    <Volume2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-slate-500">Kata yang salah akan muncul lagi besok agar cepat hafal. 🧠</p>
        </div>
      ),
    });
  };

  // Lanjut otomatis setelah jawaban benar
  useEffect(() => {
    if (!feedback?.ok || paused) return;
    const t = window.setTimeout(next, 1300);
    return () => window.clearTimeout(t);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused || !item) return;
      if (feedback || showIntro) {
        if (e.key === 'Enter') {
          if (showIntro) setIntroduced((s) => new Set([...s, step]));
          else next();
        }
        return;
      }
      if (item.mode === 'TYPE') {
        if (/^[a-z]$/i.test(e.key)) setTyped((t) => (t.length < 20 ? t + e.key.toLowerCase() : t));
        else if (e.key === 'Backspace') setTyped((t) => t.slice(0, -1));
        else if (e.key === 'Enter' && typed) answer(typed);
      } else if ((item.mode === 'LOOK_PICK' || item.mode === 'LISTEN_PICK') && /^[1-6]$/.test(e.key)) {
        const opt = item.options?.[Number(e.key) - 1];
        if (opt !== undefined) answer(opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item || !card) {
    return <p className="text-center text-sm text-slate-500 py-10">Belum ada kata untuk dimainkan.</p>;
  }

  const big = kids ? 'text-8xl sm:text-9xl' : 'text-7xl sm:text-8xl';
  const spelled = usedTiles.map((t) => item.letters?.[t] ?? '').join('');

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(step / items.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-500 tabular-nums">
          {step + 1}/{items.length}
        </span>
      </div>

      {showIntro ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center bg-white rounded-3xl border-2 border-sky-200 p-6">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">✨ Kata baru</span>
          <div className={big} aria-hidden>
            {card.emoji}
          </div>
          <div className="space-y-1">
            <div className={cn('font-extrabold', kids ? 'text-5xl' : 'text-4xl')}>{card.word}</div>
            <div className="text-lg text-slate-500">{card.meaning}</div>
          </div>
          {ttsOk && (
            <button type="button" onClick={() => speak(card.word, 'en-US', kids)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-100 text-sky-800 font-bold">
              <Volume2 className="w-5 h-5" /> Dengarkan
            </button>
          )}
          <button
            type="button"
            onClick={() => setIntroduced((s) => new Set([...s, step]))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-lg font-extrabold active:scale-95 transition"
          >
            Aku ingat! <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-2 text-center bg-white rounded-3xl border-2 p-5',
              feedback?.ok === true ? 'border-emerald-400 bg-emerald-50' : feedback?.ok === false ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
            )}
            aria-live="polite"
          >
            {item.mode === 'LISTEN_PICK' ? (
              <>
                <p className="text-sm font-semibold text-slate-500">Dengarkan, lalu pilih gambarnya</p>
                {ttsOk ? (
                  <button
                    type="button"
                    onClick={() => speak(card.word, 'en-US', kids)}
                    className="w-24 h-24 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
                    aria-label="Putar suara kata"
                  >
                    <Volume2 className="w-12 h-12" />
                  </button>
                ) : (
                  <div className="text-4xl font-extrabold">{card.word}</div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-500">
                  {item.mode === 'LOOK_PICK' ? 'Apa bahasa Inggrisnya?' : item.mode === 'SPELL' ? 'Susun hurufnya!' : 'Ketik bahasa Inggrisnya'}
                </p>
                <div className={big} aria-label={card.meaning}>
                  {card.emoji}
                </div>
                {item.mode !== 'LOOK_PICK' && <p className="text-base text-slate-500">({card.meaning})</p>}
              </>
            )}
            {feedback && (
              <div className="pt-1 space-y-1">
                <p className={cn('text-lg font-extrabold', feedback.ok ? 'text-emerald-700' : 'text-rose-600')}>
                  {feedback.ok ? '✓ Benar!' : '✗ Belum tepat'}
                </p>
                {!feedback.ok && (
                  <p className="text-sm">
                    Jawabannya: <b className="text-lg">{card.emoji} {card.word}</b> <span className="text-slate-500">({card.meaning})</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {(item.mode === 'LOOK_PICK' || item.mode === 'LISTEN_PICK') && (
            <div className={cn('grid gap-2.5', (item.options?.length ?? 4) <= 3 ? 'grid-cols-3' : 'grid-cols-2')}>
              {item.options?.map((opt) => {
                const c = deck[opt];
                const isAnswer = opt === item.idx;
                const chosen = feedback?.chosen === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => answer(opt)}
                    disabled={!!feedback}
                    className={cn(
                      'rounded-2xl border-2 bg-white font-extrabold active:scale-95 transition flex items-center justify-center p-3',
                      item.mode === 'LISTEN_PICK' ? 'h-24 sm:h-28 text-5xl' : cn('h-16', kids ? 'text-2xl' : 'text-xl'),
                      feedback && isAnswer && 'border-emerald-500 bg-emerald-50',
                      feedback && chosen && !isAnswer && 'border-rose-400 bg-rose-50 opacity-80',
                      !feedback && 'border-slate-200 hover:border-indigo-300'
                    )}
                  >
                    {item.mode === 'LISTEN_PICK' ? c.emoji : c.word}
                  </button>
                );
              })}
            </div>
          )}

          {item.mode === 'SPELL' && item.letters && (
            <div className="space-y-3">
              <div className="flex justify-center gap-1.5 flex-wrap" aria-label="Susunan hurufmu">
                {item.letters.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-b-4 flex items-center justify-center text-2xl font-extrabold',
                      spelled[i] ? 'bg-indigo-100 border-indigo-400 text-indigo-800' : 'bg-slate-100 border-slate-300'
                    )}
                  >
                    {spelled[i] ?? ''}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {item.letters.map((l, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback || usedTiles.includes(i)}
                    onClick={() => {
                      const used = [...usedTiles, i];
                      setUsedTiles(used);
                      playSfx('tap');
                      if (used.length === item.letters!.length) answer(used.map((t) => item.letters![t]).join(''));
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-100 border-2 border-amber-300 text-2xl font-extrabold text-amber-900 disabled:opacity-25 active:scale-95 transition"
                  >
                    {l}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={!!feedback || !usedTiles.length}
                  onClick={() => setUsedTiles((u) => u.slice(0, -1))}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-40"
                  aria-label="Hapus huruf terakhir"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {item.mode === 'TYPE' && (
            <div className="space-y-3">
              <div className="mx-auto max-w-xs h-14 rounded-2xl border-2 border-indigo-300 bg-white flex items-center justify-center text-3xl font-extrabold tracking-wide text-indigo-800">
                {typed || <span className="text-slate-300 text-lg font-semibold">ketik di sini</span>}
              </div>
              <LetterPad
                disabled={!!feedback}
                onLetter={(l) => setTyped((t) => (t.length < 20 ? t + l.toLowerCase() : t))}
                onBackspace={() => setTyped((t) => t.slice(0, -1))}
              />
              <div className="text-center">
                <button
                  type="button"
                  disabled={!!feedback || !typed}
                  onClick={() => answer(typed)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-extrabold disabled:opacity-40"
                >
                  <Check className="w-5 h-5" /> Jawab
                </button>
              </div>
            </div>
          )}

          {feedback && !feedback.ok && (
            <div className="text-center">
              <button type="button" onClick={next} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-lg font-extrabold">
                Lanjut <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
