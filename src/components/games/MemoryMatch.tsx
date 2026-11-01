'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Footprints, Volume2 } from 'lucide-react';
import { buildMemoryBoard, replayMemory, type MemoryCard, type MemoryLogEntry } from '@/lib/games/memory';
import type { MemoryConfig } from '@/lib/games/types';
import { buzz, isSoundOn, playSfx } from '@/lib/games/sfx';
import { speak } from '@/lib/games/speech';
import { cn } from '@/lib/utils';
import type { EngineProps } from './engine';

/** Kolom & rasio kartu agar seluruh papan muat di layar ponsel tanpa menggulir. */
function gridCols(cards: number) {
  if (cards <= 16) return 'grid-cols-4 max-w-lg';
  if (cards <= 20) return 'grid-cols-5 max-w-xl';
  return 'grid-cols-6 max-w-2xl';
}

function CardFace({ card, kids }: { card: MemoryCard; kids: boolean }) {
  switch (card.kind) {
    case 'emoji':
      return <span className={kids ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}>{card.label}</span>;
    case 'dots':
      return <span className="text-sm sm:text-lg leading-tight break-all text-center px-1">{card.label}</span>;
    case 'num':
      return <span className="text-3xl sm:text-4xl font-extrabold tabular-nums">{card.label}</span>;
    case 'expr':
      return <span className="text-base sm:text-2xl font-extrabold tabular-nums whitespace-nowrap">{card.label}</span>;
    case 'word':
      return <span className={cn('font-extrabold text-center px-0.5 leading-tight [overflow-wrap:anywhere]', card.label.length > 7 ? 'text-sm sm:text-lg' : kids ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl')}>{card.label}</span>;
    default:
      return <span className="text-[11px] sm:text-sm font-bold leading-snug text-center px-1 [overflow-wrap:anywhere]">{card.label}</span>;
  }
}

export default function MemoryMatch({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = useMemo(() => {
    const c = { ...(set.config as MemoryConfig) };
    if (Array.isArray(set.items)) c.pairs = Math.min(c.pairs, set.items.length);
    return c;
  }, [set.config, set.items]);
  const board = useMemo(() => buildMemoryBoard(seed, cfg, set.items), [seed, cfg, set.items]);

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [mismatch, setMismatch] = useState(false);
  const log = useRef<MemoryLogEntry[]>([]);
  const done = useRef(false);

  const pairs = board.length / 2;

  useEffect(() => {
    if (done.current || matched.size !== board.length || board.length === 0) return;
    done.current = true;
    const local = replayMemory(board, log.current) ?? { score: 0, correct: pairs, total: log.current.length, stars: 1 };
    const pairList = Array.from({ length: pairs }, (_, p) => board.filter((c) => c.pair === p).sort((a, b) => a.side - b.side));
    const timer = window.setTimeout(
      () =>
        onFinish({
          log: log.current,
          local,
          summary: (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Pasangan yang kamu temukan:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {pairList.map(([a, b]) => (
                  <li key={a.pair} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 text-sm">
                    <span className="font-bold flex-1 min-w-0 truncate">{a.label}</span>
                    <span className="text-slate-400">=</span>
                    <span className={cn('flex-1 min-w-0 text-right', b.kind === 'emoji' ? 'text-2xl' : b.kind === 'dots' ? 'text-xs break-all' : 'font-semibold')}>
                      {b.label}
                    </span>
                    {a.speak && (
                      <button type="button" onClick={() => speak(a.speak!)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50" aria-label={`Dengarkan ${a.label}`}>
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ),
        }),
      700
    );
    return () => window.clearTimeout(timer);
  }, [matched, board, pairs, onFinish]);

  const flip = (i: number) => {
    if (paused || mismatch || open.includes(i) || matched.has(i) || open.length >= 2) return;
    const card = board[i];
    playSfx('flip');
    if (card.speak && isSoundOn()) speak(card.speak);
    if (open.length === 0) {
      setOpen([i]);
      return;
    }
    const first = open[0];
    setOpen([first, i]);
    setMoves((m) => m + 1);
    log.current.push([first, i]);
    if (board[first].pair === card.pair) {
      window.setTimeout(() => {
        playSfx('correct');
        setMatched((prev) => new Set([...prev, first, i]));
        setOpen([]);
      }, 350);
    } else {
      setMismatch(true);
      window.setTimeout(() => {
        playSfx('wrong');
        buzz();
      }, 300);
      window.setTimeout(() => {
        setOpen([]);
        setMismatch(false);
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
          <Footprints className="w-4 h-4 text-indigo-500" /> Langkah {moves}
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700" aria-live="polite">
          Pasangan {matched.size / 2}/{pairs}
        </span>
      </div>
      {cfg.pairMode === 'WORD_EMOJI' && (
        <p className="text-xs text-slate-500 text-center">
          <span className="inline-block w-3 h-3 rounded bg-sky-400 align-middle mr-1" /> kartu kata ·{' '}
          <span className="inline-block w-3 h-3 rounded bg-amber-400 align-middle mr-1" /> kartu gambar. Pasangkan kata dengan gambarnya!
        </p>
      )}
      <div className={cn('grid gap-2 sm:gap-3 w-full mx-auto', gridCols(board.length))}>
        {board.map((card, i) => {
          const isOpen = open.includes(i) || matched.has(i);
          const isMatched = matched.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => flip(i)}
              disabled={isMatched}
              aria-label={isOpen ? card.label : `Kartu tertutup ${i + 1}`}
              className="aspect-[4/5] [perspective:800px] focus-visible:outline-3 focus-visible:outline-indigo-500 rounded-2xl touch-manipulation"
            >
              <span
                className={cn(
                  'relative block w-full h-full transition-transform duration-300 motion-reduce:transition-none [transform-style:preserve-3d]',
                  isOpen && '[transform:rotateY(180deg)]'
                )}
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 border-2 border-indigo-600 flex items-center justify-center text-3xl text-white/90 font-extrabold shadow-sm [backface-visibility:hidden]">
                  ?
                </span>
                <span
                  className={cn(
                    'absolute inset-0 rounded-2xl bg-white border-[3px] flex items-center justify-center overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]',
                    card.side === 0 ? 'border-sky-400' : 'border-amber-400',
                    isMatched && 'bg-emerald-50 border-emerald-400',
                    mismatch && open.includes(i) && 'bg-rose-50 border-rose-300'
                  )}
                >
                  <CardFace card={card} kids={kids} />
                  {isMatched && <span className="absolute top-1 right-1.5 text-xs text-emerald-600 font-bold">✓</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
