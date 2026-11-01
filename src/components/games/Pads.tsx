'use client';

import React from 'react';
import { Delete, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const baseKeyCls =
  'rounded-2xl bg-white border-2 border-slate-200 font-extrabold text-slate-800 active:scale-95 active:bg-indigo-50 transition select-none touch-manipulation disabled:opacity-40';

/** Keypad angka di layar (keyboard bawaan ponsel tidak dipakai agar papan tidak tertutup). */
export function NumberPad({
  onDigit,
  onBackspace,
  onSubmit,
  onToggleMinus,
  disabled,
  submitDisabled,
  compact,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onSubmit?: () => void;
  onToggleMinus?: () => void;
  disabled?: boolean;
  submitDisabled?: boolean;
  /** Tombol lebih pendek agar muat di bawah arena game */
  compact?: boolean;
}) {
  const keyCls = compact ? cn(baseKeyCls, 'h-11 sm:h-12 text-xl') : cn(baseKeyCls, 'h-14 sm:h-16 text-2xl');
  return (
    <div className={cn('grid grid-cols-3 w-full max-w-xs mx-auto', compact ? 'gap-1.5' : 'gap-2')} role="group" aria-label="Keypad angka">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" className={keyCls} disabled={disabled} onClick={() => onDigit(d)}>
          {d}
        </button>
      ))}
      {onToggleMinus ? (
        <button type="button" className={keyCls} disabled={disabled} onClick={onToggleMinus} aria-label="Tanda minus">
          ±
        </button>
      ) : (
        <button type="button" className={cn(keyCls, 'text-slate-500')} disabled={disabled} onClick={onBackspace} aria-label="Hapus">
          <Delete className="w-6 h-6 mx-auto" />
        </button>
      )}
      <button type="button" className={keyCls} disabled={disabled} onClick={() => onDigit('0')}>
        0
      </button>
      {onSubmit ? (
        <button
          type="button"
          className={cn(keyCls, 'bg-emerald-500 border-emerald-600 text-white active:bg-emerald-600')}
          disabled={disabled || submitDisabled}
          onClick={onSubmit}
          aria-label="Kirim jawaban"
        >
          <Check className="w-7 h-7 mx-auto" />
        </button>
      ) : (
        <button type="button" className={cn(keyCls, 'text-slate-500')} disabled={disabled} onClick={onBackspace} aria-label="Hapus">
          <Delete className="w-6 h-6 mx-auto" />
        </button>
      )}
      {onToggleMinus && onSubmit && (
        <button type="button" className={cn(keyCls, 'col-span-3 h-11 sm:h-12 text-base text-slate-500')} disabled={disabled} onClick={onBackspace}>
          <Delete className="w-5 h-5 inline mr-1" /> Hapus
        </button>
      )}
    </div>
  );
}

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

/** Keyboard huruf A–Z di layar untuk TTS Kata & Ketik Kata. */
export function LetterPad({ onLetter, onBackspace, disabled }: { onLetter: (l: string) => void; onBackspace: () => void; disabled?: boolean }) {
  return (
    <div className="space-y-1.5 w-full max-w-md mx-auto select-none" role="group" aria-label="Keyboard huruf">
      {ROWS.map((row, i) => (
        <div key={row} className="flex justify-center gap-1">
          {row.split('').map((l) => (
            <button
              key={l}
              type="button"
              disabled={disabled}
              onClick={() => onLetter(l)}
              className="flex-1 max-w-10 h-11 rounded-lg bg-white border border-slate-300 text-base font-bold text-slate-800 active:bg-indigo-100 touch-manipulation"
            >
              {l}
            </button>
          ))}
          {i === 2 && (
            <button
              type="button"
              disabled={disabled}
              onClick={onBackspace}
              aria-label="Hapus huruf"
              className="px-3 h-11 rounded-lg bg-slate-200 border border-slate-300 text-slate-700 active:bg-slate-300 touch-manipulation"
            >
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function StarRow({ stars, size = 'md' }: { stars: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-sm' : 'text-xl';
  return (
    <span className={cn('inline-flex gap-0.5', cls)} aria-label={`${stars} dari 3 bintang`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < stars ? '' : 'grayscale opacity-25'}>
          ⭐
        </span>
      ))}
    </span>
  );
}
