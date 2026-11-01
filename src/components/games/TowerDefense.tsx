'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildDefenseSchedule,
  defenseResult,
  replayDefense,
  type AnswerLog,
  type DefenseConfig,
} from '@/lib/games/arcade';
import { buzz, playSfx } from '@/lib/games/sfx';
import { cn } from '@/lib/utils';
import { NumberPad } from './Pads';
import { ComboChip, Hearts, HudChip, ReviewList, useEndOnce, useGameTime } from './arcade-ui';
import type { EngineProps } from './engine';

/** Garis benteng & titik awal robot (persen tinggi arena); robot mulai agak ke bawah agar soalnya terbaca */
const WALL_LINE = 84;
/** Robot (gelembung soal + badan ±4.5rem) mulai tepat di bawah tepi atas lalu turun sampai garis benteng. */
const robotTop = (p: number) => `calc(${(1 - p).toFixed(4)} * (2% + 4.5rem) + ${p.toFixed(4)} * ${WALL_LINE}%)`;

export default function TowerDefense({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as DefenseConfig;
  const robots = useMemo(() => buildDefenseSchedule(seed, cfg), [seed, cfg]);
  const [log, setLog] = useState<AnswerLog>([]);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<{ ms: number; ok: boolean } | null>(null);
  const { now, read } = useGameTime(paused);
  const state = useMemo(() => replayDefense(robots, cfg, log, now), [robots, cfg, log, now]);
  const end = state.overAt ?? state.doneAt;
  const ended = end !== null && now >= end;

  useEndOnce(
    ended,
    useCallback(() => {
      const final = replayDefense(robots, cfg, log);
      onFinish({
        log,
        local: defenseResult(robots, cfg, final),
        summary: (
          <ReviewList
            title="Robot yang lolos ke benteng:"
            rows={robots.filter((r) => final.leaked.has(r.id)).map((r) => ({ q: r.boss ? `👾 ${r.text}` : r.text, a: String(r.answer) }))}
          />
        ),
      });
    }, [cfg, log, onFinish, robots])
  );

  // Suara saat robot sampai ke benteng
  const leakedHeard = useRef(0);
  useEffect(() => {
    if (state.leaked.size > leakedHeard.current) {
      leakedHeard.current = state.leaked.size;
      playSfx('wrong');
      buzz();
    }
  }, [state.leaked.size]);

  const submit = useCallback(() => {
    if (paused || ended || input === '' || input === '-') return;
    const ms = read();
    const value = Number(input);
    const next: AnswerLog = [...log, [log.length ? Math.max(log[log.length - 1][0], ms) : ms, value]];
    const after = replayDefense(robots, cfg, next, ms);
    const hit = after.answers[after.answers.length - 1]?.hit ?? null;
    setLog(next);
    setInput('');
    setFlash({ ms, ok: hit !== null });
    if (hit !== null) playSfx(robots[hit].boss ? 'levelUp' : 'correct');
    else {
      playSfx('wrong');
      buzz();
    }
  }, [cfg, ended, input, log, paused, read, robots]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused) return;
      if (/^\d$/.test(e.key)) setInput((v) => (v.replace('-', '').length < 6 ? v + e.key : v));
      else if (e.key === 'Backspace') setInput((v) => v.slice(0, -1));
      else if (e.key === '-' && cfg.math.allowNegative) setInput((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`));
      else if (e.key === 'Enter') submit();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cfg.math.allowNegative, paused, submit]);

  const active = robots.filter((r) => r.t <= now && now < r.t + r.life && !state.destroyed.has(r.id));
  const boss = active.find((r) => r.boss);
  const wave = Math.max(0, ...robots.filter((r) => r.t <= now).map((r) => r.wave));
  const nextWaveSoon = !active.length && !ended && robots.some((r) => r.t > now);
  const showFlash = flash && now - flash.ms < 600;

  return (
    <div className="flex-1 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <HudChip>
          🌊 {wave + 1}/{cfg.waves}
        </HudChip>
        <Hearts hearts={Math.max(0, state.hp)} max={cfg.hp} />
        <ComboChip combo={state.combo} />
        <HudChip className="bg-emerald-50 border-emerald-200 text-emerald-700">⭐ {state.score}</HudChip>
      </div>

      {boss && (
        <div className="rounded-2xl bg-fuchsia-600 text-white px-3 py-2 text-sm font-semibold leading-snug" aria-live="polite">
          <span className="font-extrabold">👾 BOS:</span> {boss.text}
        </div>
      )}

      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border-2 border-slate-300 bg-gradient-to-b from-indigo-950 via-indigo-800 to-emerald-700 max-h-[420px] select-none transition-[height] duration-300',
          // Saat banner soal bos tampil, arena dipendekkan agar keypad tetap muat di layar
          boss ? 'h-[28dvh] min-h-[190px]' : 'h-[36dvh] min-h-[220px]'
        )}
        aria-label="Medan benteng"
      >
        <span className="absolute top-3 left-4 text-xs text-white/40" aria-hidden>
          ✦ ✧ ✦
        </span>
        {nextWaveSoon && (
          <div className="absolute inset-x-0 top-1/3 text-center text-white font-extrabold text-lg animate-pulse">Gelombang berikutnya datang…</div>
        )}
        {robots.map((r) => {
          const destroyedAt = state.destroyed.get(r.id);
          if (now < r.t) return null;
          if (destroyedAt !== undefined) {
            if (now - destroyedAt > 450) return null;
            const p = (destroyedAt - r.t) / r.life;
            return (
              <span key={r.id} className="absolute -translate-x-1/2 text-4xl pointer-events-none" style={{ left: `${r.x * 100}%`, top: `calc(${robotTop(p)} - 2.5rem)` }}>
                ⚡
              </span>
            );
          }
          if (now >= r.t + r.life) return null;
          const p = (now - r.t) / r.life;
          return (
            <div
              key={r.id}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
              style={{ left: `${r.x * 100}%`, top: robotTop(p) }}
            >
              <span
                className={cn(
                  'rounded-xl px-2 py-0.5 font-extrabold whitespace-nowrap shadow tabular-nums',
                  r.boss ? 'bg-fuchsia-500 text-white text-sm' : cn('bg-white text-slate-900', kids ? 'text-lg' : 'text-base')
                )}
              >
                {r.boss ? 'BOS' : r.text.replace(' = ?', '')}
              </span>
              <span className={r.boss ? 'text-5xl' : 'text-3xl'} aria-hidden>
                {r.boss ? '👾' : '🤖'}
              </span>
            </div>
          );
        })}
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-stone-500/80 border-t-4 border-stone-700 flex items-center justify-center gap-6 text-3xl" aria-hidden>
          <span>🏰</span>
          <span>🏰</span>
          <span>🏰</span>
        </div>
        {showFlash && (
          <div className="absolute inset-x-0 bottom-[18%] text-center pointer-events-none z-10">
            <span className={cn('inline-block rounded-xl px-3 py-1 font-extrabold', flash.ok ? 'bg-emerald-500 text-white' : 'bg-white text-rose-600')}>
              {flash.ok ? 'Tepat! ⚡' : 'Tidak ada robot dengan jawaban itu'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="min-w-32 h-11 px-4 rounded-2xl border-2 border-indigo-300 bg-white flex items-center justify-center text-3xl font-extrabold tabular-nums text-indigo-700">
          {input || <span className="text-slate-300 text-lg font-semibold">jawaban</span>}
        </div>
      </div>
      <NumberPad
        onDigit={(d) => setInput((v) => (v.replace('-', '').length < 6 ? v + d : v))}
        onBackspace={() => setInput((v) => v.slice(0, -1))}
        onToggleMinus={cfg.math.allowNegative ? () => setInput((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`)) : undefined}
        onSubmit={submit}
        submitDisabled={input === '' || input === '-'}
        disabled={ended}
        compact
      />
    </div>
  );
}
