'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Jam permainan arcade (ms aktif, tanpa jeda) yang diperbarui setiap frame.
 * `read()` dipakai di event handler untuk mencatat waktu aksi ke log.
 */
export function useGameTime(paused: boolean) {
  const [now, setNow] = useState(0);
  const acc = useRef(0);
  useEffect(() => {
    if (paused) return;
    const start = performance.now();
    const base = acc.current;
    let raf = 0;
    const tick = () => {
      acc.current = base + performance.now() - start;
      setNow(acc.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  const read = useCallback(() => Math.round(acc.current), []);
  return { now, read };
}

/** Panggil `onEnd` sekali saat `ended` menjadi true. */
export function useEndOnce(ended: boolean, onEnd: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    if (ended && !fired.current) {
      fired.current = true;
      onEnd();
    }
  }, [ended, onEnd]);
}

export function Hearts({ hearts, max }: { hearts: number; max: number }) {
  return (
    <span className="inline-flex gap-0.5 text-base" aria-label={`Nyawa ${hearts} dari ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < hearts ? '' : 'grayscale opacity-30'}>
          ❤️
        </span>
      ))}
    </span>
  );
}

export function HudChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold tabular-nums', className)}>
      {children}
    </span>
  );
}

export function TimeChip({ ms }: { ms: number }) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return (
    <HudChip className={s <= 10 ? 'bg-rose-100 border-rose-200 text-rose-700' : undefined}>
      <Timer className="w-4 h-4" /> {s}s
    </HudChip>
  );
}

export function ComboChip({ combo }: { combo: number }) {
  if (combo < 2) return null;
  return (
    <HudChip className="bg-orange-100 border-orange-200 text-orange-700">
      🔥 {combo}
      {combo >= 10 ? ' ×3' : combo >= 5 ? ' ×2' : ''}
    </HudChip>
  );
}

/** Daftar soal yang terlewat/salah untuk layar hasil. */
export function ReviewList({ title, rows }: { title: string; rows: { q: string; a: string }[] }) {
  if (!rows.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <ul className="space-y-1.5 text-sm">
        {rows.slice(0, 15).map((r, i) => (
          <li key={i} className="flex items-start justify-between gap-3 bg-slate-50 rounded-lg px-3 py-1.5">
            <span className="font-semibold">{r.q}</span>
            <b className="text-emerald-700 shrink-0">{r.a}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
