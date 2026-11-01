'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, Flag, Volume2 } from 'lucide-react';
import { requestJson } from '@/lib/fetch-json';
import { entryCells, entryId } from '@/lib/games/crossword';
import type { CrosswordConfig, GameResult, PublicCrossword } from '@/lib/games/types';
import { buzz, isSoundOn, playSfx } from '@/lib/games/sfx';
import { speak } from '@/lib/games/speech';
import { cn } from '@/lib/utils';
import { LetterPad } from './Pads';
import type { EngineProps } from './engine';

const k = (r: number, c: number) => `${r},${c}`;

export default function Crossword({ set, sessionId, paused, onFinish }: EngineProps) {
  const puzzle = set.items as PublicCrossword;
  const cfg = set.config as CrosswordConfig;

  const cellEntries = useMemo(() => {
    const map = new Map<string, number[]>();
    puzzle.entries.forEach((e, idx) => entryCells(e).forEach(([r, c]) => map.set(k(r, c), [...(map.get(k(r, c)) ?? []), idx])));
    return map;
  }, [puzzle]);
  const numbers = useMemo(() => {
    const map = new Map<string, number>();
    puzzle.entries.forEach((e) => map.set(k(e.row, e.col), e.num));
    return map;
  }, [puzzle]);

  const [fill, setFill] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<{ entry: number; pos: number }>({ entry: 0, pos: 0 });
  const [correct, setCorrect] = useState<Set<string>>(() => new Set());
  const [checked, setChecked] = useState(false);
  const [hints, setHints] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const entry = puzzle.entries[active.entry];
  const cells = entryCells(entry);
  const [ar, ac] = cells[Math.min(active.pos, cells.length - 1)];
  const activeKey = k(ar, ac);
  const activeCells = new Set(cells.map(([r, c]) => k(r, c)));

  const wordOf = useCallback(
    (idx: number) =>
      entryCells(puzzle.entries[idx])
        .map(([r, c]) => fill[k(r, c)] ?? '')
        .join(''),
    [fill, puzzle.entries]
  );

  const finish = useCallback(
    (finalCorrect: Set<string>, finalFill: Record<string, string>) => {
      if (done) return;
      setDone(true);
      const n = finalCorrect.size;
      const total = puzzle.entries.length;
      const all = n === total;
      const local: GameResult = {
        score: Math.max(0, n * 10 - hints * 3),
        correct: n,
        total,
        stars: all ? (hints === 0 ? 3 : hints <= 3 ? 2 : 1) : n / total >= 0.8 ? 1 : 0,
      };
      const words = puzzle.entries.map((e, idx) => ({
        e,
        word: entryCells(e).map(([r, c]) => finalFill[k(r, c)] ?? '·').join(''),
        ok: finalCorrect.has(entryId(puzzle.entries[idx])),
      }));
      onFinish({
        log: { fill: finalFill },
        local,
        summary: (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-700">Jawabanmu:</h3>
            <ul className="space-y-1 text-sm">
              {words.map(({ e, word, ok }) => (
                <li key={entryId(e)} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                  <span className="w-9 shrink-0 text-xs font-bold text-slate-400">
                    {e.num}
                    {e.dir === 'A' ? '→' : '↓'}
                  </span>
                  <span className={cn('font-mono font-bold tracking-widest', ok ? 'text-emerald-700' : 'text-rose-500')}>{word}</span>
                  <span className="flex-1 min-w-0 truncate text-xs text-slate-500">
                    {e.emoji} {e.clue}
                  </span>
                  {ok && cfg.lang === 'en' && (
                    <button type="button" onClick={() => speak(word.toLowerCase())} className="p-1 text-indigo-600" aria-label={`Dengarkan ${word}`}>
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ),
      });
    },
    [cfg.lang, done, hints, onFinish, puzzle.entries]
  );

  const moveWithin = (delta: number) => setActive((a) => ({ ...a, pos: Math.max(0, Math.min(cells.length - 1, a.pos + delta)) }));

  const typeLetter = useCallback(
    (letter: string) => {
      if (paused || done) return;
      if (!revealed.has(activeKey)) {
        setFill((f) => ({ ...f, [activeKey]: letter }));
        setChecked(false);
      }
      playSfx('tap');
      setActive((a) => ({ ...a, pos: Math.min(cells.length - 1, a.pos + 1) }));
    },
    [activeKey, cells.length, done, paused, revealed]
  );

  const backspace = useCallback(() => {
    if (paused || done) return;
    if (fill[activeKey] && !revealed.has(activeKey)) {
      setFill((f) => {
        const next = { ...f };
        delete next[activeKey];
        return next;
      });
    } else if (active.pos > 0) {
      const [pr, pc] = cells[active.pos - 1];
      const prevKey = k(pr, pc);
      if (!revealed.has(prevKey))
        setFill((f) => {
          const next = { ...f };
          delete next[prevKey];
          return next;
        });
      setActive((a) => ({ ...a, pos: a.pos - 1 }));
    }
    setChecked(false);
  }, [active.pos, activeKey, cells, done, fill, paused, revealed]);

  const selectCell = (r: number, c: number) => {
    const list = cellEntries.get(k(r, c));
    if (!list || paused) return;
    let target = list.find((i) => i === active.entry) ?? list[0];
    if (activeKey === k(r, c) && list.length > 1) target = list.find((i) => i !== active.entry) ?? target; // ketuk ulang = ganti arah
    const pos = entryCells(puzzle.entries[target]).findIndex(([rr, cc]) => rr === r && cc === c);
    setActive({ entry: target, pos });
  };

  const selectEntry = (idx: number) => {
    const firstEmpty = entryCells(puzzle.entries[idx]).findIndex(([r, c]) => !fill[k(r, c)]);
    setActive({ entry: idx, pos: Math.max(0, firstEmpty) });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused || done || e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[a-z]$/i.test(e.key)) typeLetter(e.key.toUpperCase());
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') moveWithin(1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') moveWithin(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const check = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const data = await requestJson<{ correct: string[]; error?: string }>('/api/games/crossword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: set.slug, action: 'check', fill }),
      });
      const next = new Set(data.correct);
      const newlyCorrect = [...next].filter((id) => !correct.has(id));
      setCorrect(next);
      setChecked(true);
      if (next.size === puzzle.entries.length) {
        playSfx('correct');
        finish(next, fill);
      } else if (newlyCorrect.length) {
        playSfx('correct');
        setMessage(`${next.size} dari ${puzzle.entries.length} kata sudah benar. Lanjutkan!`);
        if (cfg.speak && cfg.lang === 'en' && isSoundOn()) {
          const idx = puzzle.entries.findIndex((e) => entryId(e) === newlyCorrect[0]);
          if (idx >= 0) speak(wordOf(idx).toLowerCase());
        }
      } else {
        playSfx('wrong');
        buzz();
        setMessage('Belum ada kata baru yang benar. Periksa kotak bertanda merah.');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Gagal memeriksa jawaban');
    } finally {
      setBusy(false);
    }
  };

  const hint = async () => {
    if (revealed.has(activeKey)) return;
    setBusy(true);
    setMessage(null);
    try {
      const data = await requestJson<{ letter: string; error?: string }>('/api/games/crossword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: set.slug, action: 'hint', row: ar, col: ac, sessionId }),
      });
      setFill((f) => ({ ...f, [activeKey]: data.letter }));
      setRevealed((s) => new Set([...s, activeKey]));
      setHints((h) => h + 1);
      setChecked(false);
      moveWithin(1);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Gagal membuka huruf');
    } finally {
      setBusy(false);
    }
  };

  // Kotak yang sudah penuh tapi katanya salah (setelah dicek)
  const wrongCells = new Set<string>();
  if (checked) {
    puzzle.entries.forEach((e, idx) => {
      if (correct.has(entryId(e))) return;
      if (wordOf(idx).length === e.length) entryCells(e).forEach(([r, c]) => wrongCells.add(k(r, c)));
    });
  }
  const correctCells = new Set<string>();
  puzzle.entries.forEach((e) => {
    if (correct.has(entryId(e))) entryCells(e).forEach(([r, c]) => correctCells.add(k(r, c)));
  });

  const ordered = puzzle.entries.map((e, idx) => ({ e, idx }));
  const across = ordered.filter((x) => x.e.dir === 'A');
  const down = ordered.filter((x) => x.e.dir === 'D');
  const pos = ordered.findIndex((x) => x.idx === active.entry);

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
          Benar {correct.size}/{puzzle.entries.length}
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">💡 Bantuan {hints}</span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div
          className="grid gap-px mx-auto bg-slate-300 border-2 border-slate-400 rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`, width: `min(100%, ${puzzle.cols * 2.6}rem)`, minWidth: `${puzzle.cols * 1.35}rem` }}
          role="grid"
          aria-label="Teka-teki silang"
        >
          {Array.from({ length: puzzle.rows }).flatMap((_, r) =>
            Array.from({ length: puzzle.cols }).map((__, c) => {
              const key = k(r, c);
              if (!cellEntries.has(key)) return <div key={key} className="aspect-square bg-slate-700/90" aria-hidden />;
              const num = numbers.get(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectCell(r, c)}
                  aria-label={`Kotak baris ${r + 1} kolom ${c + 1}${fill[key] ? `, huruf ${fill[key]}` : ''}`}
                  className={cn(
                    'relative aspect-square flex items-center justify-center font-extrabold uppercase text-[min(4.5vw,1.25rem)] leading-none',
                    key === activeKey ? 'bg-indigo-300' : activeCells.has(key) ? 'bg-indigo-100' : correctCells.has(key) ? 'bg-emerald-100' : wrongCells.has(key) ? 'bg-rose-100' : 'bg-white',
                    revealed.has(key) ? 'text-amber-600' : correctCells.has(key) ? 'text-emerald-800' : 'text-slate-900'
                  )}
                >
                  {num && <span className="absolute top-0 left-0.5 text-[min(2.2vw,0.6rem)] font-bold text-slate-500 leading-none">{num}</span>}
                  {fill[key] ?? ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-indigo-600 text-white rounded-2xl px-2 py-2">
        <button type="button" onClick={() => selectEntry(ordered[(pos - 1 + ordered.length) % ordered.length].idx)} className="p-2 rounded-xl hover:bg-white/15" aria-label="Petunjuk sebelumnya">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0 text-center" aria-live="polite">
          <div className="text-[11px] font-bold text-indigo-200">
            {entry.num} {entry.dir === 'A' ? 'Mendatar' : 'Menurun'} · {entry.length} huruf
          </div>
          <div className="text-sm sm:text-base font-semibold leading-snug">
            {entry.emoji && <span className="text-2xl mr-1.5 align-middle">{entry.emoji}</span>}
            {entry.clue}
          </div>
        </div>
        <button type="button" onClick={() => selectEntry(ordered[(pos + 1) % ordered.length].idx)} className="p-2 rounded-xl hover:bg-white/15" aria-label="Petunjuk berikutnya">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <LetterPad onLetter={typeLetter} onBackspace={backspace} disabled={done} />

      {message && <p className="text-xs font-semibold text-center text-slate-600">{message}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={hint}
          disabled={busy || done || revealed.has(activeKey)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-sm font-bold disabled:opacity-50"
        >
          <Lightbulb className="w-4 h-4" /> Bantuan huruf
        </button>
        <button
          type="button"
          onClick={check}
          disabled={busy || done}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" /> Cek
        </button>
        <button
          type="button"
          onClick={() => finish(correct, fill)}
          disabled={busy || done}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm font-bold disabled:opacity-50"
        >
          <Flag className="w-4 h-4" /> Selesai
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {[
          ['Mendatar', across],
          ['Menurun', down],
        ].map(([label, list]) => (
          <div key={label as string} className="bg-white rounded-2xl border border-slate-200 p-3">
            <h3 className="text-xs font-bold text-slate-500 mb-1.5">{label as string}</h3>
            <ul className="space-y-0.5">
              {(list as typeof ordered).map(({ e, idx }) => (
                <li key={entryId(e)}>
                  <button
                    type="button"
                    onClick={() => selectEntry(idx)}
                    className={cn(
                      'w-full text-left px-2 py-1 rounded-lg flex gap-2',
                      idx === active.entry ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-slate-50',
                      correct.has(entryId(e)) && 'text-emerald-700'
                    )}
                  >
                    <span className="font-bold w-5 shrink-0">{e.num}</span>
                    <span className="flex-1">
                      {e.emoji && <span className="mr-1">{e.emoji}</span>}
                      {e.clue}
                    </span>
                    {correct.has(entryId(e)) && <span>✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
