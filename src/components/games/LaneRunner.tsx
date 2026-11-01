'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import {
  buildRunnerSchedule,
  isEmojiLabel,
  laneAt,
  replayRunner,
  runnerEnd,
  runnerResult,
  type LaneLog,
  type RunnerConfig,
} from '@/lib/games/arcade';
import type { VocabCard } from '@/lib/games/types';
import { buzz, isSoundOn, playSfx } from '@/lib/games/sfx';
import { speak } from '@/lib/games/speech';
import { cn } from '@/lib/utils';
import { ComboChip, Hearts, HudChip, ReviewList, useEndOnce, useGameTime } from './arcade-ui';
import type { EngineProps } from './engine';

/** Posisi pelari (persen tinggi arena) */
const RUNNER_LINE = 80;
const LANE_X = [1 / 6, 1 / 2, 5 / 6];

export default function LaneRunner({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as RunnerConfig;
  const deck = cfg.source === 'VOCAB' ? (set.items as VocabCard[]) : null;
  const gates = useMemo(() => buildRunnerSchedule(seed, cfg, deck), [seed, cfg, deck]);
  const [log, setLog] = useState<LaneLog>([]);
  const { now, read } = useGameTime(paused);
  const state = useMemo(() => replayRunner(gates, cfg, log, now), [gates, cfg, log, now]);
  const lane = laneAt(log, now);
  const end = runnerEnd(gates, state);
  const ended = now >= end;

  useEndOnce(
    ended,
    useCallback(() => {
      const final = replayRunner(gates, cfg, log);
      onFinish({
        log,
        local: runnerResult(gates, final),
        summary: (
          <ReviewList
            title="Gerbang yang terlewat:"
            rows={gates
              .filter((g) => final.results.get(g.i)?.ok === false)
              .map((g) => ({ q: g.questionKind === 'listen' ? `🔊 ${g.question}` : g.question, a: g.options[g.correct] }))}
          />
        ),
      });
    }, [cfg, gates, log, onFinish])
  );

  const upcoming = gates.find((g) => g.T > now && !state.results.has(g.i));
  const lastGate = [...gates].reverse().find((g) => state.results.has(g.i));
  const lastResult = lastGate ? state.results.get(lastGate.i) : undefined;
  const showFeedback = lastGate && now - lastGate.T < 900;

  // Suara: soal "dengar" diucapkan saat gerbangnya muncul; efek benar/salah setelah melewati gerbang
  const spoken = useRef(-1);
  useEffect(() => {
    if (!upcoming || paused || spoken.current === upcoming.i) return;
    if (now < upcoming.T - upcoming.approach) return;
    spoken.current = upcoming.i;
    if (upcoming.questionKind === 'listen' && upcoming.speak && isSoundOn()) speak(upcoming.speak, 'en-US', kids);
  }, [kids, now, paused, upcoming]);
  const heard = useRef(0);
  useEffect(() => {
    if (state.results.size <= heard.current || !lastResult) return;
    heard.current = state.results.size;
    if (lastResult.ok) playSfx('correct');
    else {
      playSfx('wrong');
      buzz();
    }
  }, [lastResult, state.results.size]);

  const setLane = (next: number) => {
    if (paused || ended) return;
    const l = Math.max(0, Math.min(2, next));
    if (l === lane) return;
    const ms = read();
    setLog((prev) => [...prev, [prev.length ? Math.max(prev[prev.length - 1][0], ms) : ms, l]]);
    playSfx('tap');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLane(lane - 1);
      else if (e.key === 'ArrowRight') setLane(lane + 1);
      else if (['1', '2', '3'].includes(e.key)) setLane(Number(e.key) - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const swipeStart = useRef<number | null>(null);
  const interval = upcoming ? upcoming.approach : 3000;

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <HudChip>
          🚩 {state.passed}/{gates.length}
        </HudChip>
        <Hearts hearts={state.hearts} max={cfg.hearts} />
        <ComboChip combo={state.streak} />
        <HudChip className="bg-emerald-50 border-emerald-200 text-emerald-700">⭐ {state.score}</HudChip>
      </div>

      <div className="rounded-2xl bg-violet-600 text-white text-center px-3 py-2 min-h-16 flex items-center justify-center gap-3" aria-live="polite">
        {upcoming ? (
          upcoming.questionKind === 'listen' ? (
            <button
              type="button"
              onClick={() => upcoming.speak && speak(upcoming.speak, 'en-US', kids)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 font-extrabold"
            >
              <Volume2 className="w-6 h-6" /> Dengarkan, lalu lari ke gambarnya
            </button>
          ) : (
            <span className={cn('font-extrabold', upcoming.questionKind === 'emoji' ? 'text-4xl' : kids ? 'text-3xl' : 'text-2xl')}>{upcoming.question}</span>
          )
        ) : (
          <span className="font-bold">🏁 Hampir sampai!</span>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border-2 border-slate-300 h-[52dvh] min-h-[320px] max-h-[520px] select-none touch-none"
        style={{
          backgroundColor: '#64748b',
          backgroundImage:
            'linear-gradient(90deg, transparent calc(33.33% - 2px), rgba(255,255,255,.55) calc(33.33% - 2px), rgba(255,255,255,.55) calc(33.33% + 2px), transparent calc(33.33% + 2px), transparent calc(66.66% - 2px), rgba(255,255,255,.55) calc(66.66% - 2px), rgba(255,255,255,.55) calc(66.66% + 2px), transparent calc(66.66% + 2px)), repeating-linear-gradient(180deg, transparent 0 46px, rgba(255,255,255,.12) 46px 52px)',
          backgroundPosition: `0 0, 0 ${Math.round((now * (260 / interval)) % 52)}px`,
        }}
        onPointerDown={(e) => {
          swipeStart.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (start === null) return;
          const dx = e.clientX - start;
          if (Math.abs(dx) > 30) {
            setLane(lane + (dx > 0 ? 1 : -1));
            return;
          }
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setLane(Math.floor(((e.clientX - rect.left) / rect.width) * 3));
        }}
        role="application"
        aria-label="Jalur lari: ketuk jalur, geser, atau gunakan tombol panah"
      >
        {gates.map((g) => {
          const appear = g.T - g.approach;
          if (now < appear || now > g.T + 350) return null;
          const p = (now - appear) / g.approach;
          const res = state.results.get(g.i);
          return (
            <div key={g.i} className="absolute inset-x-0 flex -translate-y-1/2" style={{ top: `${p * RUNNER_LINE}%` }}>
              {g.options.map((opt, idx) => (
                <div key={idx} className="w-1/3 px-1.5">
                  <div
                    className={cn(
                      'h-14 rounded-xl border-b-4 flex items-center justify-center text-center font-extrabold leading-tight px-1 shadow',
                      res
                        ? idx === g.correct
                          ? 'bg-emerald-400 border-emerald-600 text-white'
                          : idx === res.chosen
                            ? 'bg-rose-400 border-rose-600 text-white'
                            : 'bg-white/60 border-slate-300 text-slate-500'
                        : 'bg-white border-amber-400 text-slate-800',
                      isEmojiLabel(opt) ? 'text-3xl' : opt.length > 10 ? 'text-[11px]' : opt.length > 6 ? 'text-sm' : 'text-lg'
                    )}
                  >
                    {opt}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl transition-[left] duration-150 pointer-events-none"
          style={{ left: `${LANE_X[lane] * 100}%`, top: `${RUNNER_LINE + 8}%` }}
          aria-hidden
        >
          <span className={cn('inline-block', !paused && !ended && 'animate-bounce')}>🏃</span>
        </div>

        {showFeedback && lastResult && lastGate && (
          <div className="absolute inset-x-0 top-[38%] text-center pointer-events-none z-10">
            <span
              className={cn(
                'inline-block rounded-2xl px-4 py-2 font-extrabold shadow-lg',
                lastResult.ok ? 'bg-emerald-500 text-white text-2xl' : 'bg-white text-rose-600 text-base'
              )}
            >
              {lastResult.ok ? '✓ Benar!' : `💔 Jawaban: ${lastGate.options[lastGate.correct]}`}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((l) => (
          <button
            key={l}
            type="button"
            onPointerDown={() => setLane(l)}
            className={cn(
              'h-12 rounded-2xl border-2 font-bold text-sm transition',
              lane === l ? 'bg-violet-600 border-violet-700 text-white' : 'bg-white border-slate-200 text-slate-600'
            )}
            aria-label={`Pindah ke jalur ${l + 1}`}
            aria-pressed={lane === l}
          >
            {['⬅️ Kiri', '⬆️ Tengah', 'Kanan ➡️'][l]}
          </button>
        ))}
      </div>
    </div>
  );
}
