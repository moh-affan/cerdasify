'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  basketAt,
  buildFallingSchedule,
  CATCH_RADIUS,
  CATCHER_HEARTS,
  catcherEnd,
  catcherResult,
  isEmojiLabel,
  replayCatcher,
  ruleAt,
  rulePrompt,
  type FallingConfig,
  type MoveLog,
} from '@/lib/games/arcade';
import { buzz, playSfx } from '@/lib/games/sfx';
import { cn } from '@/lib/utils';
import { ComboChip, Hearts, HudChip, TimeChip, useEndOnce, useGameTime } from './arcade-ui';
import type { EngineProps } from './engine';

/** Garis tangkap keranjang (persen tinggi arena) */
const CATCH_LINE = 84;
const MOVE_THROTTLE_MS = 30;

export default function Catcher({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as FallingConfig;
  const schedule = useMemo(() => buildFallingSchedule(seed, cfg, 'catcher'), [seed, cfg]);
  const [log, setLog] = useState<MoveLog>([]);
  const { now, read } = useGameTime(paused);
  const arena = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Posisi keranjang yang tampil = posisi yang tercatat di log (sumber kebenaran yang sama dengan server)
  const state = useMemo(() => replayCatcher(schedule, log, now), [schedule, log, now]);
  const basketX = basketAt(log, now);
  const end = catcherEnd(schedule, state);
  const ended = now >= end;

  useEndOnce(
    ended,
    useCallback(() => {
      const final = replayCatcher(schedule, log);
      onFinish({ log, local: catcherResult(schedule, final) });
    }, [log, onFinish, schedule])
  );

  // Efek suara saat benda selesai ditangkap / lewat
  const heard = useRef(0);
  useEffect(() => {
    if (state.resolved.size <= heard.current) return;
    const ids = [...state.resolved.entries()].slice(heard.current);
    heard.current = state.resolved.size;
    for (const [, r] of ids) {
      if (r.caught && r.good) playSfx('correct');
      else if (r.caught) {
        playSfx('wrong');
        buzz();
      }
    }
  }, [state.resolved]);

  const moveTo = (x: number, force = false) => {
    if (paused || ended) return;
    const clamped = Math.round(Math.min(0.94, Math.max(0.06, x)) * 1000) / 1000;
    const ms = read();
    setLog((prev) => {
      const last = prev[prev.length - 1];
      if (last && last[1] === clamped) return prev;
      if (last && !force && ms - last[0] < MOVE_THROTTLE_MS) return prev;
      // Waktu tidak boleh mundur (beberapa event dalam milidetik yang sama)
      const at = last ? Math.max(last[0], ms) : ms;
      return [...prev, [at, clamped]];
    });
  };

  const fromPointer = (clientX: number, force = false) => {
    const rect = arena.current?.getBoundingClientRect();
    if (!rect) return;
    moveTo((clientX - rect.left) / rect.width, force);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveTo(basketX - 0.1, true);
      else if (e.key === 'ArrowRight') moveTo(basketX + 0.1, true);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const rule = ruleAt(cfg, schedule, now);
  const showRuleBanner = now % (cfg.waveSec * 1000) < 2200 && !ended;
  const lastResolved = [...state.resolved.entries()].pop();
  const lastItem = lastResolved ? schedule.items[lastResolved[0]] : null;
  const showFeedback = lastItem && lastResolved && now - (lastItem.t + lastItem.life) < 700;

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <TimeChip ms={schedule.durationMs - now} />
        <Hearts hearts={state.hearts} max={CATCHER_HEARTS} />
        <ComboChip combo={state.combo} />
        <HudChip className="bg-emerald-50 border-emerald-200 text-emerald-700">⭐ {state.score}</HudChip>
      </div>

      <div className="rounded-2xl bg-amber-500 text-white text-center px-3 py-2" aria-live="polite">
        <span className={cn('font-extrabold', kids ? 'text-2xl' : 'text-xl')}>🧺 {rulePrompt(rule)}</span>
      </div>

      <div
        ref={arena}
        className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-sky-200 via-sky-50 to-lime-100 h-[54dvh] min-h-[330px] max-h-[540px] select-none touch-none"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          fromPointer(e.clientX, true);
        }}
        onPointerMove={(e) => {
          if (dragging.current || e.pointerType === 'mouse') fromPointer(e.clientX);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          fromPointer(e.clientX, true);
        }}
        role="application"
        aria-label="Area tangkap: seret atau gunakan tombol panah"
      >
        <div className="absolute inset-x-0 bottom-0 h-[12%] bg-lime-300/70 border-t-2 border-lime-400" aria-hidden />
        {showRuleBanner && (
          <div className="absolute inset-x-0 top-1/4 z-20 text-center pointer-events-none">
            <span className="inline-block bg-white/95 rounded-2xl px-5 py-3 shadow-lg text-lg font-extrabold text-amber-700 animate-pulse">
              🎯 {rulePrompt(rule)}
            </span>
          </div>
        )}
        {schedule.items.map((item) => {
          if (now < item.t || state.resolved.has(item.id)) return null;
          const p = Math.min(1, (now - item.t) / item.life);
          return (
            <span
              key={item.id}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-full flex items-center justify-center rounded-2xl bg-white/90 shadow border border-slate-200 font-extrabold px-2',
                isEmojiLabel(item.label) ? (kids ? 'text-4xl w-16 h-16' : 'text-3xl w-14 h-14') : 'text-lg min-w-12 h-12'
              )}
              style={{ left: `${item.x * 100}%`, top: `${p * CATCH_LINE}%` }}
              aria-hidden
            >
              {item.label}
            </span>
          );
        })}
        {showFeedback && lastResolved && lastResolved[1].caught && (
          <span
            className={cn('absolute -translate-x-1/2 text-xl font-extrabold pointer-events-none', lastResolved[1].good ? 'text-emerald-700' : 'text-rose-600')}
            style={{ left: `${basketX * 100}%`, top: `${CATCH_LINE - 16}%` }}
          >
            {lastResolved[1].good ? `+${lastResolved[1].points}` : '💔'}
          </span>
        )}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-[left] duration-75"
          style={{ left: `${basketX * 100}%`, top: `${CATCH_LINE - 2}%`, width: `${CATCH_RADIUS * 2 * 100}%` }}
          aria-hidden
        >
          <span className="text-5xl leading-none">🧺</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onPointerDown={() => moveTo(basketX - 0.2, true)}
          className="w-20 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center active:bg-amber-50"
          aria-label="Geser keranjang ke kiri"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          type="button"
          onPointerDown={() => moveTo(basketX + 0.2, true)}
          className="w-20 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center active:bg-amber-50"
          aria-label="Geser keranjang ke kanan"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
