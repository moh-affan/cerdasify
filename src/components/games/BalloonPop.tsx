'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  balloonResult,
  buildFallingSchedule,
  isEmojiLabel,
  replayBalloon,
  ruleAt,
  rulePrompt,
  type BalloonState,
  type FallingConfig,
  type TapLog,
} from '@/lib/games/arcade';
import { buzz, playSfx } from '@/lib/games/sfx';
import { cn } from '@/lib/utils';
import { ComboChip, HudChip, TimeChip, useEndOnce, useGameTime } from './arcade-ui';
import type { EngineProps } from './engine';

const COLORS = ['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-violet-400', 'bg-pink-400', 'bg-orange-400'];
const EMPTY: BalloonState = { score: 0, combo: 0, goodHits: 0, badHits: 0, hits: new Map() };

export default function BalloonPop({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as FallingConfig;
  const schedule = useMemo(() => buildFallingSchedule(seed, cfg, 'balloon'), [seed, cfg]);
  const [log, setLog] = useState<TapLog>([]);
  const { now, read } = useGameTime(paused);
  const state = useMemo(() => replayBalloon(schedule, log) ?? EMPTY, [schedule, log]);

  const ended = now >= schedule.durationMs;
  useEndOnce(
    ended,
    useCallback(() => onFinish({ log, local: balloonResult(schedule, state) }), [log, onFinish, schedule, state])
  );

  const rule = ruleAt(cfg, schedule, now);
  const waveMs = cfg.waveSec * 1000;
  const showRuleBanner = now % waveMs < 2200 && !ended;

  const tap = (id: number) => {
    if (paused || ended) return;
    const ms = read();
    const item = schedule.items[id];
    if (!item || state.hits.has(id) || ms < item.t || ms > item.t + item.life) return;
    const next: TapLog = [...log, [ms, id]];
    setLog(next);
    if (item.good) {
      const combo = state.combo + 1;
      playSfx(combo === 5 || combo === 10 ? 'levelUp' : 'correct');
    } else {
      playSfx('wrong');
      buzz();
    }
  };

  const balloonSize = kids ? 'w-[4.5rem] h-[5.5rem]' : 'w-16 h-20';

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <TimeChip ms={schedule.durationMs - now} />
        <ComboChip combo={state.combo} />
        <HudChip className="bg-emerald-50 border-emerald-200 text-emerald-700">⭐ {state.score}</HudChip>
      </div>

      <div className="rounded-2xl bg-indigo-600 text-white text-center px-3 py-2" aria-live="polite">
        <span className="text-[11px] font-semibold text-indigo-200 block">Pecahkan balon:</span>
        <span className={cn('font-extrabold', kids ? 'text-2xl' : 'text-xl')}>{rulePrompt(rule)}</span>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border-2 border-sky-200 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 h-[56dvh] min-h-[340px] max-h-[560px] select-none touch-manipulation"
        role="application"
        aria-label="Area balon"
      >
        <span className="absolute top-6 left-6 text-4xl opacity-70" aria-hidden>
          ☁️
        </span>
        <span className="absolute top-20 right-8 text-3xl opacity-60" aria-hidden>
          ☁️
        </span>
        {showRuleBanner && (
          <div className="absolute inset-x-0 top-1/3 z-20 text-center pointer-events-none">
            <span className="inline-block bg-white/95 rounded-2xl px-5 py-3 shadow-lg text-lg font-extrabold text-indigo-700 animate-pulse">
              🎯 {rulePrompt(rule)}
            </span>
          </div>
        )}
        {schedule.items.map((item) => {
          const hit = state.hits.get(item.id);
          if (now < item.t) return null;
          const p = Math.min(1, (now - item.t) / item.life);
          if (hit) {
            if (now - hit.ms > 600) return null;
            const hp = Math.min(1, (hit.ms - item.t) / item.life);
            return (
              <span
                key={item.id}
                className={cn('absolute -translate-x-1/2 text-xl font-extrabold pointer-events-none', hit.good ? 'text-emerald-700' : 'text-rose-600')}
                style={{ left: `${item.x * 100}%`, top: `${(1 - hp) * 100 - 6}%` }}
              >
                {hit.good ? `💥 +${hit.points}` : '✗'}
              </span>
            );
          }
          if (p >= 1) return null;
          return (
            <button
              key={item.id}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                tap(item.id);
              }}
              aria-label={`Balon ${item.label}`}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${item.x * 100}%`, top: `${(1 - p) * 108 - 8}%` }}
            >
              <span
                className={cn(
                  balloonSize,
                  COLORS[item.id % COLORS.length],
                  'rounded-[50%] shadow-md flex items-center justify-center text-white font-extrabold border-2 border-white/40 px-1 text-center leading-tight',
                  isEmojiLabel(item.label) ? 'text-3xl' : item.label.length > 5 ? 'text-xs' : item.label.length > 3 ? 'text-base' : 'text-xl'
                )}
              >
                {item.label}
              </span>
              <span className="w-px h-6 bg-slate-500/60" aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
  );
}
