'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Eraser } from 'lucide-react';
import {
  checkCrossMath,
  generateCrossMath,
  replayCrossMath,
  type CrossMathAnswer,
  type CrossMathRoundLog,
} from '@/lib/games/crossmath';
import type { CrossMathConfig } from '@/lib/games/types';
import { buzz, playSfx } from '@/lib/games/sfx';
import { cn } from '@/lib/utils';
import { NumberPad } from './Pads';
import type { EngineProps } from './engine';

const OP_LABEL: Record<string, string> = { '+': '+', '-': '−', '×': '×', '÷': '÷' };

export default function CrossMath({ set, seed, paused, kids, onFinish }: EngineProps) {
  const cfg = set.config as CrossMathConfig;
  const [round, setRound] = useState(0);
  const puzzle = useMemo(() => generateCrossMath(seed, round, cfg), [seed, round, cfg]);

  // Isian sebagai teks agar keypad bisa mengetik "-" / beberapa digit
  const [values, setValues] = useState<Record<number, string>>({});
  /** Bank: sel → indeks chip yang dipakai */
  const [chipOf, setChipOf] = useState<Record<number, number>>({});
  const [selectedCell, setSelectedCell] = useState<number | null>(() => (cfg.bank ? null : generateCrossMath(seed, 0, cfg).hidden[0]));
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [check, setCheck] = useState<{ ok: boolean; badRows: number[]; badCols: number[] } | null>(null);
  const [solved, setSolved] = useState(false);
  const attempts = useRef<CrossMathRoundLog[]>([]);

  const usedChips = new Set(Object.values(chipOf));
  const filled = puzzle.hidden.every((i) => values[i] !== undefined && values[i] !== '' && values[i] !== '-');

  const resetRound = (nextRound: number) => {
    setValues({});
    setChipOf({});
    // Mode keypad: kotak kosong pertama langsung terpilih
    setSelectedCell(cfg.bank ? null : generateCrossMath(seed, nextRound, cfg).hidden[0]);
    setSelectedChip(null);
    setCheck(null);
    setSolved(false);
  };

  const place = (cell: number, chip: number) => {
    setValues((v) => ({ ...v, [cell]: String(puzzle.bank[chip]) }));
    setChipOf((c) => ({ ...c, [cell]: chip }));
    setSelectedChip(null);
    setSelectedCell(null);
    setCheck(null);
    playSfx('tap');
  };

  const clearCell = (cell: number) => {
    setValues((v) => {
      const next = { ...v };
      delete next[cell];
      return next;
    });
    setChipOf((c) => {
      const next = { ...c };
      delete next[cell];
      return next;
    });
    setCheck(null);
  };

  const tapCell = (cell: number) => {
    if (paused || solved || !puzzle.hidden.includes(cell)) return;
    if (!cfg.bank) {
      setSelectedCell(cell);
      return;
    }
    if (selectedChip !== null) {
      if (chipOf[cell] !== undefined) clearCell(cell);
      place(cell, selectedChip);
    } else if (values[cell] !== undefined) {
      clearCell(cell);
    } else {
      setSelectedCell(cell === selectedCell ? null : cell);
    }
  };

  const tapChip = (chip: number) => {
    if (paused || solved || usedChips.has(chip)) return;
    if (selectedCell !== null && values[selectedCell] === undefined) place(selectedCell, chip);
    else setSelectedChip(chip === selectedChip ? null : chip);
  };

  const typeDigit = useCallback(
    (d: string) => {
      if (selectedCell === null || solved) return;
      setValues((v) => {
        const cur = v[selectedCell] ?? '';
        return cur.replace('-', '').length >= 4 ? v : { ...v, [selectedCell]: cur + d };
      });
      setCheck(null);
    },
    [selectedCell, solved]
  );

  const backspace = useCallback(() => {
    if (selectedCell === null || solved) return;
    setValues((v) => ({ ...v, [selectedCell]: (v[selectedCell] ?? '').slice(0, -1) }));
    setCheck(null);
  }, [selectedCell, solved]);

  const submit = () => {
    if (!filled || solved || paused) return;
    const answer: CrossMathAnswer = Object.fromEntries(puzzle.hidden.map((i) => [String(i), Number(values[i])]));
    const result = checkCrossMath(puzzle, answer);
    if (!attempts.current[round]) attempts.current[round] = { attempts: [] };
    attempts.current[round].attempts.push(answer);
    setCheck(result);
    if (!result.ok) {
      playSfx('wrong');
      buzz();
      return;
    }
    playSfx('correct');
    setSolved(true);
    window.setTimeout(() => {
      if (round + 1 < cfg.rounds) {
        setRound(round + 1);
        resetRound(round + 1);
      } else {
        const log = attempts.current.slice(0, cfg.rounds);
        const local = replayCrossMath(seed, cfg, log) ?? { score: 0, correct: 0, total: cfg.rounds, stars: 0 };
        onFinish({ log, local });
      }
    }, 1000);
  };

  useEffect(() => {
    if (cfg.bank) return;
    const onKey = (e: KeyboardEvent) => {
      if (paused) return;
      if (/^\d$/.test(e.key)) typeDigit(e.key);
      else if (e.key === 'Backspace') backspace();
      else if (e.key === '-' && cfg.allowNegative && selectedCell !== null)
        setValues((v) => {
          const cur = v[selectedCell] ?? '';
          return { ...v, [selectedCell]: cur.startsWith('-') ? cur.slice(1) : `-${cur}` };
        });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [backspace, cfg.allowNegative, cfg.bank, paused, selectedCell, typeDigit]);

  const cellSize = kids ? 'w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl' : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';
  const opSize = kids ? 'w-8 sm:w-10 text-2xl' : 'w-6 sm:w-10 text-xl';
  const failedRows = check && !check.ok ? check.badRows : [];
  const failedCols = check && !check.ok ? check.badCols : [];

  const rows = [0, 1, 2, 3, 4].map((R) =>
    [0, 1, 2, 3, 4].map((C) => {
      if (R % 2 === 0 && C % 2 === 0) {
        const idx = 3 * (R / 2) + C / 2;
        const hidden = puzzle.hidden.includes(idx);
        const bad = failedRows.includes(R / 2) || failedCols.includes(C / 2);
        return (
          <button
            key={`${R}-${C}`}
            type="button"
            onClick={() => tapCell(idx)}
            disabled={!hidden}
            aria-label={hidden ? `Kotak kosong, ${values[idx] ? `berisi ${values[idx]}` : 'belum diisi'}` : `Angka ${puzzle.cells[idx]}`}
            className={cn(
              cellSize,
              'rounded-xl flex items-center justify-center font-extrabold tabular-nums border-2 transition',
              hidden ? 'bg-white border-dashed border-indigo-300 text-indigo-700' : 'bg-slate-100 border-slate-200 text-slate-800',
              hidden && selectedCell === idx && 'border-solid border-indigo-600 ring-4 ring-indigo-200',
              hidden && bad && 'border-solid border-rose-400 bg-rose-50',
              solved && hidden && 'border-solid border-emerald-400 bg-emerald-50 text-emerald-700'
            )}
          >
            {hidden ? values[idx] || '' : puzzle.cells[idx]}
          </button>
        );
      }
      let label = '';
      if (R % 2 === 0 && C === 1) label = OP_LABEL[puzzle.rowOps[R / 2]];
      else if (R % 2 === 0 && C === 3) label = '=';
      else if (C % 2 === 0 && R === 1) label = OP_LABEL[puzzle.colOps[C / 2]];
      else if (C % 2 === 0 && R === 3) label = '=';
      const vertical = R % 2 === 1;
      return (
        <div
          key={`${R}-${C}`}
          className={cn('flex items-center justify-center font-extrabold text-slate-500', vertical ? 'h-7 sm:h-9 text-xl' : opSize, label === '=' && vertical && 'rotate-90')}
          aria-hidden
        >
          {label}
        </div>
      );
    })
  );

  return (
    <div className="flex-1 flex flex-col gap-4 items-center">
      <div className="w-full flex items-center justify-between text-sm font-bold">
        <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
          Puzzle {round + 1}/{cfg.rounds}
        </span>
        {check && !check.ok && <span className="text-rose-600 text-xs">Persamaan bertanda merah belum benar</span>}
        {solved && <span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Benar!</span>}
      </div>

      <div className="bg-white/70 rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-sm">
        <div className="grid grid-cols-[auto_auto_auto_auto_auto] items-center justify-items-center gap-0.5">{rows}</div>
      </div>

      {cfg.bank ? (
        <div className="w-full space-y-2">
          <p className="text-xs text-center text-slate-500">
            {selectedChip !== null ? 'Sekarang ketuk kotak kosong.' : 'Ketuk angka, lalu ketuk kotak kosong. Ketuk kotak berisi untuk menghapus.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {puzzle.bank.map((n, chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => tapChip(chip)}
                disabled={usedChips.has(chip)}
                className={cn(
                  'min-w-14 h-14 px-3 rounded-2xl border-2 text-2xl font-extrabold tabular-nums transition active:scale-95',
                  usedChips.has(chip)
                    ? 'bg-slate-100 border-slate-200 text-slate-300'
                    : selectedChip === chip
                      ? 'bg-indigo-600 border-indigo-700 text-white -translate-y-1 shadow-lg'
                      : 'bg-amber-100 border-amber-300 text-amber-900'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <NumberPad
          onDigit={typeDigit}
          onBackspace={backspace}
          onToggleMinus={
            cfg.allowNegative && selectedCell !== null
              ? () =>
                  setValues((v) => {
                    const cur = v[selectedCell] ?? '';
                    return { ...v, [selectedCell]: cur.startsWith('-') ? cur.slice(1) : `-${cur}` };
                  })
              : undefined
          }
          disabled={solved || selectedCell === null}
        />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setValues({});
            setChipOf({});
            setCheck(null);
          }}
          disabled={solved}
          className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold disabled:opacity-50"
        >
          <Eraser className="w-4 h-4" /> Ulang
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!filled || solved}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-extrabold disabled:opacity-40 active:scale-95 transition"
        >
          <CheckCircle2 className="w-5 h-5" /> Cek
        </button>
      </div>
    </div>
  );
}
