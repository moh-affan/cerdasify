'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, Zap, Check } from 'lucide-react';
import {
  initialSprintState,
  replaySprint,
  sprintProblem,
  sprintStep,
  SPRINT_MAX_LEVEL,
  type SprintLogEntry,
} from '@/lib/games/math-sprint';
import type { MathSprintConfig } from '@/lib/games/types';
import { buzz, playSfx } from '@/lib/games/sfx';
import { cn } from '@/lib/utils';
import { NumberPad } from './Pads';
import type { EngineProps } from './engine';

export default function MathSprint({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as MathSprintConfig;
  const durationMs = cfg.durationSec * 1000;

  const [index, setIndex] = useState(0);
  const [state, setState] = useState(initialSprintState);
  const [input, setInput] = useState('');
  const [remaining, setRemaining] = useState(durationMs);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; answer: number } | null>(null);
  const [levelUp, setLevelUp] = useState(false);

  const log = useRef<SprintLogEntry[]>([]);
  const remainingRef = useRef(durationMs);
  const problemStartRemaining = useRef(durationMs);
  const ended = useRef(false);

  const problem = sprintProblem(seed, index, state.level, cfg);

  const end = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    const local = replaySprint(seed, cfg, log.current);
    onFinish({
      log: log.current,
      local,
      summary: local.mistakes.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-700">Yuk, perhatikan lagi:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
            {local.mistakes.slice(0, 12).map((m, i) => (
              <li key={i} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                <span className="font-semibold">{m.text.replace('▢', '?')}</span>
                <span>
                  {m.given !== null && <s className="text-rose-500 mr-2">{cmpLabel(cfg, m.given)}</s>}
                  <b className="text-emerald-700">{cmpLabel(cfg, m.answer)}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : undefined,
    });
  }, [cfg, onFinish, seed]);

  // Hitung mundur; berhenti saat dijeda (papan juga ditutup overlay)
  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      remainingRef.current = Math.max(0, remainingRef.current - (now - last));
      last = now;
      setRemaining(remainingRef.current);
      if (remainingRef.current <= 0) {
        window.clearInterval(id);
        end();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [paused, end]);

  const submit = useCallback(
    (value: number | null) => {
      if (ended.current || feedback || paused || remainingRef.current <= 0) return;
      const ms = Math.round(problemStartRemaining.current - remainingRef.current);
      log.current.push([value, ms]);
      setAnswered(log.current.length);
      const ok = value === problem.answer;
      const next = sprintStep(state, ok);
      if (ok) {
        setCorrect((c) => c + 1);
        playSfx(next.level > state.level ? 'levelUp' : 'correct');
      } else {
        playSfx('wrong');
        buzz();
      }
      if (next.level > state.level) {
        setLevelUp(true);
        window.setTimeout(() => setLevelUp(false), 1200);
      }
      setFeedback({ ok, answer: problem.answer });
      window.setTimeout(
        () => {
          setFeedback(null);
          setInput('');
          setState(next);
          setIndex((i) => i + 1);
          problemStartRemaining.current = remainingRef.current;
        },
        ok ? 350 : 1100
      );
    },
    [feedback, paused, problem.answer, state]
  );

  const submitInput = () => {
    if (input === '' || input === '-') return;
    submit(Number(input));
  };

  // Dukungan keyboard fisik (laptop/tablet)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused) return;
      if (problem.kind === 'CMP') {
        const map: Record<string, number> = { '<': -1, '=': 0, '>': 1, ',': -1, '.': 1 };
        if (e.key in map) submit(map[e.key]);
        return;
      }
      if (/^\d$/.test(e.key)) setInput((v) => (v.replace('-', '').length < 6 ? v + e.key : v));
      else if (e.key === 'Backspace') setInput((v) => v.slice(0, -1));
      else if (e.key === '-' && cfg.allowNegative) setInput((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`));
      else if (e.key === 'Enter' && input !== '' && input !== '-') submit(Number(input));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cfg.allowNegative, input, paused, problem.kind, submit]);

  const seconds = Math.ceil(remaining / 1000);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 text-sm font-bold">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
            seconds <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-white border border-slate-200 text-slate-700'
          )}
          role="timer"
          aria-label={`Sisa ${seconds} detik`}
        >
          <Timer className="w-4 h-4" /> {seconds}s
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
          <Zap className="w-4 h-4 text-amber-500" /> Level {state.level}/{SPRINT_MAX_LEVEL}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Check className="w-4 h-4" /> {correct}
          <span className="text-emerald-500 font-semibold">/{answered}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-[width] duration-100" style={{ width: `${(remaining / durationMs) * 100}%` }} />
      </div>

      <div
        className={cn(
          'relative rounded-3xl border-2 bg-white flex flex-col items-center justify-center gap-3 py-8 px-4 transition-colors',
          feedback?.ok === true && 'border-emerald-400 bg-emerald-50',
          feedback?.ok === false && 'border-rose-300 bg-rose-50',
          !feedback && 'border-slate-200'
        )}
        aria-live="polite"
      >
        {levelUp && (
          <span className="absolute top-2 right-3 text-xs font-extrabold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">⬆️ Naik level!</span>
        )}
        <div className={cn('font-extrabold tracking-tight text-center tabular-nums', kids ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl')}>
          {problem.kind === 'CMP' ? (
            <span className="inline-flex items-center gap-3">
              {problem.text.split('▢')[0].trim()}
              <span className="inline-flex w-14 h-14 rounded-xl border-2 border-dashed border-indigo-300 items-center justify-center text-indigo-600">
                {feedback ? cmpLabel(cfg, problem.answer) : '?'}
              </span>
              {problem.text.split('▢')[1].trim()}
            </span>
          ) : (
            <>
              {problem.text.includes('?') ? problem.text.replace('?', '▢') : `${problem.text} =`}
            </>
          )}
        </div>
        {problem.kind === 'NUM' && (
          <div
            className={cn(
              'min-w-32 h-16 px-4 rounded-2xl border-2 flex items-center justify-center text-4xl font-extrabold tabular-nums',
              feedback?.ok === false ? 'border-rose-300 text-rose-500 line-through' : 'border-indigo-300 text-indigo-700'
            )}
          >
            {input || <span className="text-slate-300">?</span>}
          </div>
        )}
        {feedback?.ok === false && (
          <p className="text-sm font-bold text-emerald-700">
            Jawaban benar: <span className="text-lg">{cmpLabel(cfg, feedback.answer)}</span>
          </p>
        )}
      </div>

      {problem.kind === 'CMP' ? (
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
          {(['<', '=', '>'] as const).map((sym, i) => (
            <button
              key={sym}
              type="button"
              onClick={() => submit(i - 1)}
              disabled={!!feedback}
              className="h-20 rounded-2xl bg-white border-2 border-slate-200 text-4xl font-extrabold text-indigo-700 active:scale-95 active:bg-indigo-50 transition"
            >
              {sym}
            </button>
          ))}
        </div>
      ) : (
        <NumberPad
          disabled={!!feedback}
          onDigit={(d) => setInput((v) => (v.replace('-', '').length < 6 ? v + d : v))}
          onBackspace={() => setInput((v) => v.slice(0, -1))}
          onToggleMinus={cfg.allowNegative ? () => setInput((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`)) : undefined}
          onSubmit={submitInput}
          submitDisabled={input === '' || input === '-'}
        />
      )}
    </div>
  );
}

function cmpLabel(cfg: MathSprintConfig, value: number): string {
  if (cfg.mode !== 'COMPARE') return String(value);
  return value < 0 ? '<' : value > 0 ? '>' : '=';
}
