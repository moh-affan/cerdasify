'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Pause, Play, Volume2, VolumeX, X, RotateCcw, Gamepad2, LogIn, Trophy, WifiOff } from 'lucide-react';
import { requestJson, RequestError, withRetry } from '@/lib/fetch-json';
import { ENGINE_INFO, type GameResult, type PlayableSet } from '@/lib/games/types';
import { newSeed } from '@/lib/games/rng';
import { isSoundOn, playSfx, setSoundOn, subscribeSound } from '@/lib/games/sfx';
import { stopSpeaking } from '@/lib/games/speech';
import { buildVocabRound, type VocabRoundItem } from '@/lib/games/vocab';
import type { VocabCard, VocabConfig } from '@/lib/games/types';
import { jakartaDateString } from '@/lib/learning';
import { cn } from '@/lib/utils';
import { StarRow } from './Pads';
import type { EngineProps } from './engine';

const Loading = () => (
  <div className="flex-1 flex items-center justify-center py-20 text-slate-400 text-sm font-semibold animate-pulse">Menyiapkan permainan…</div>
);

// Setiap engine dimuat terpisah sehingga halaman hanya mengunduh kode game yang dimainkan
const ENGINES: Record<PlayableSet['engine'], React.ComponentType<EngineProps>> = {
  MATH_SPRINT: dynamic(() => import('./MathSprint'), { loading: Loading }),
  MEMORY_MATCH: dynamic(() => import('./MemoryMatch'), { loading: Loading }),
  CROSSMATH: dynamic(() => import('./CrossMath'), { loading: Loading }),
  CROSSWORD: dynamic(() => import('./Crossword'), { loading: Loading }),
  VOCAB_PICTURE: dynamic(() => import('./VocabPicture'), { loading: Loading }),
  BALLOON_POP: dynamic(() => import('./BalloonPop'), { loading: Loading }),
  CATCHER: dynamic(() => import('./Catcher'), { loading: Loading }),
  LANE_RUNNER: dynamic(() => import('./LaneRunner'), { loading: Loading }),
  TOWER_DEFENSE: dynamic(() => import('./TowerDefense'), { loading: Loading }),
};

const QUEUE_KEY = 'cerdasify-game-queue';

interface QueuedFinish {
  sessionId: string;
  log: unknown;
  durationMs: number;
}

function readQueue(): QueuedFinish[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') as QueuedFinish[];
  } catch {
    return [];
  }
}

function writeQueue(q: QueuedFinish[]) {
  try {
    if (q.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-20)));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {
    // abaikan
  }
}

/** Kirim hasil yang tertunda saat offline. Hasil yang ditolak server (4xx) dibuang dari antrean. */
async function flushQueue() {
  const queue = readQueue();
  if (!queue.length) return;
  const left: QueuedFinish[] = [];
  for (const item of queue) {
    try {
      await requestJson('/api/games/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (err) {
      if (err instanceof RequestError && (err.status === 0 || err.status >= 500)) left.push(item);
    }
  }
  writeQueue(left);
}

interface FinishResponse {
  result: GameResult;
  isNewBest: boolean;
  bestStars: number;
  error?: string;
}

type Phase = 'intro' | 'starting' | 'playing' | 'finishing' | 'result';

export default function GamePlayer({
  set,
  isLoggedIn,
  best,
  kids,
  remainingMinutes,
  backHref,
}: {
  set: PlayableSet;
  isLoggedIn: boolean;
  best: { stars: number; score: number; plays: number } | null;
  kids: boolean;
  remainingMinutes: number | null;
  backHref: string;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [session, setSession] = useState<{ id: string | null; seed: number; round: VocabRoundItem[] | null; key: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const sound = useSyncExternalStore(subscribeSound, isSoundOn, () => true);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{
    result: GameResult;
    summary?: ReactNode;
    isNewBest: boolean;
    bestStars: number;
    note?: { kind: 'offline' | 'guest' | 'unverified'; text: string };
  } | null>(null);
  const [bestState, setBestState] = useState(best);

  // Waktu bermain aktif (tanpa jeda) untuk batas waktu harian
  const activeMs = useRef(0);
  const segmentStart = useRef<number | null>(null);

  const info = ENGINE_INFO[set.engine];
  const Engine = ENGINES[set.engine];

  useEffect(() => {
    void flushQueue();
    const online = () => void flushQueue();
    window.addEventListener('online', online);
    return () => {
      window.removeEventListener('online', online);
      stopSpeaking();
    };
  }, []);

  const pauseClock = () => {
    if (segmentStart.current !== null) {
      activeMs.current += Date.now() - segmentStart.current;
      segmentStart.current = null;
    }
  };
  const resumeClock = () => {
    if (segmentStart.current === null) segmentStart.current = Date.now();
  };

  const setPausedSafe = useCallback((p: boolean) => {
    setPaused(p);
    if (p) {
      pauseClock();
      stopSpeaking();
    } else resumeClock();
  }, []);

  // Jeda otomatis saat aplikasi/tab ditinggalkan
  useEffect(() => {
    if (phase !== 'playing') return;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') setPausedSafe(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase, setPausedSafe]);

  const start = async () => {
    setError(null);
    setOutcome(null);
    setPhase('starting');
    activeMs.current = 0;
    segmentStart.current = null;
    try {
      if (isLoggedIn) {
        const data = await withRetry(() =>
          requestJson<{ sessionId: string; seed: number; round: VocabRoundItem[] | null; error?: string }>('/api/games/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: set.slug, context: set.context }),
          })
        );
        setSession({ id: data.sessionId, seed: data.seed, round: data.round, key: Date.now() });
      } else {
        // Tamu: permainan disusun di browser, skor tidak disimpan
        const seed = newSeed();
        const round =
          set.engine === 'VOCAB_PICTURE'
            ? buildVocabRound(seed, set.items as VocabCard[], set.config as VocabConfig, new Map(), jakartaDateString())
            : null;
        setSession({ id: null, seed, round, key: Date.now() });
      }
      setPaused(false);
      segmentStart.current = Date.now();
      setPhase('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memulai permainan');
      setPhase('intro');
    }
  };

  const finish = useCallback(
    async ({ log, local, summary }: { log: unknown; local: GameResult; summary?: ReactNode }) => {
      pauseClock();
      stopSpeaking();
      if (local.stars > 0) playSfx('win');
      const durationMs = activeMs.current;
      const sessionId = session?.id;
      if (!sessionId) {
        setOutcome({
          result: local,
          summary,
          isNewBest: false,
          bestStars: local.stars,
          note: { kind: 'guest', text: 'Masuk akun agar bintang dan progresmu tersimpan.' },
        });
        setPhase('result');
        return;
      }
      setPhase('finishing');
      const payload: QueuedFinish = { sessionId, log, durationMs };
      try {
        const data = await withRetry(() =>
          requestJson<FinishResponse>('/api/games/finish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        );
        setOutcome({ result: data.result, summary, isNewBest: data.isNewBest, bestStars: data.bestStars });
        setBestState((prev) => ({
          stars: Math.max(prev?.stars ?? 0, data.result.stars),
          score: Math.max(prev?.score ?? 0, data.result.score),
          plays: (prev?.plays ?? 0) + 1,
        }));
      } catch (err) {
        if (err instanceof RequestError && (err.status === 0 || err.status >= 500)) {
          writeQueue([...readQueue(), payload]);
          setOutcome({
            result: local,
            summary,
            isNewBest: false,
            bestStars: local.stars,
            note: { kind: 'offline', text: 'Koneksi terputus. Hasil disimpan di perangkat dan akan dikirim otomatis saat online.' },
          });
        } else {
          setOutcome({
            result: local,
            summary,
            isNewBest: false,
            bestStars: local.stars,
            note: { kind: 'unverified', text: err instanceof Error ? err.message : 'Hasil tidak dapat disimpan.' },
          });
        }
      }
      setPhase('result');
    },
    [session]
  );

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    if (next) playSfx('tap');
    else stopSpeaking();
  };

  const limitReached = remainingMinutes !== null && remainingMinutes <= 0;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2">
          <Link href={backHref} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Keluar dari permainan">
            <X className="w-5 h-5" />
          </Link>
          <span className="text-xl" aria-hidden>
            {set.coverEmoji || info.emoji}
          </span>
          <h1 className="flex-1 min-w-0 truncate text-sm sm:text-base font-bold">{set.title}</h1>
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            aria-label={sound ? 'Matikan suara' : 'Nyalakan suara'}
            aria-pressed={sound}
          >
            {sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          {phase === 'playing' && (
            <button
              type="button"
              onClick={() => setPausedSafe(true)}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-700"
              aria-label="Jeda permainan"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {(phase === 'intro' || phase === 'starting') && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-6">
            <div className={kids ? 'text-8xl' : 'text-7xl'} aria-hidden>
              {set.coverEmoji || info.emoji}
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{info.label}</span>
              <h2 className={cn('font-extrabold', kids ? 'text-3xl' : 'text-2xl')}>{set.title}</h2>
              {set.description && <p className="text-sm text-slate-500 max-w-md mx-auto">{set.description}</p>}
            </div>
            <ol className="bg-white rounded-2xl border border-slate-200 p-4 text-left text-sm text-slate-700 space-y-1.5 max-w-md w-full">
              {info.howTo.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
            {bestState && bestState.plays > 0 && (
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Rekor: <StarRow stars={bestState.stars} size="sm" /> · skor {bestState.score} ·{' '}
                {bestState.plays}× main
              </p>
            )}
            {remainingMinutes !== null && !limitReached && (
              <p className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-xl px-3 py-1.5">
                ⏳ Sisa waktu bermain hari ini: {remainingMinutes} menit
              </p>
            )}
            {limitReached ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 max-w-md space-y-2">
                <p className="font-bold">Waktu bermain hari ini sudah habis ⏰</p>
                <p>Orang tuamu mengatur batas waktu bermain. Yuk lanjut membaca di Pustaka Belajar!</p>
                <Link href="/belajar" className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-white font-bold">
                  📚 Ke Pustaka Belajar
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={start}
                disabled={phase === 'starting'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-extrabold shadow-lg shadow-indigo-200 active:scale-95 transition disabled:opacity-60"
              >
                <Play className="w-6 h-6" />
                {phase === 'starting' ? 'Menyiapkan…' : 'Mulai Main'}
              </button>
            )}
            {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
            {!isLoggedIn && (
              <p className="text-xs text-slate-500">
                Kamu bermain sebagai tamu.{' '}
                <Link href="/login" className="font-semibold text-indigo-700 underline">
                  Masuk
                </Link>{' '}
                agar bintangmu tersimpan.
              </p>
            )}
          </div>
        )}

        {(phase === 'playing' || phase === 'finishing') && session && (
          <div className={cn('flex-1 flex flex-col relative', phase === 'finishing' && 'pointer-events-none opacity-60')}>
            <Engine
              key={session.key}
              set={set}
              seed={session.seed}
              round={session.round}
              sessionId={session.id}
              paused={paused}
              kids={kids}
              onFinish={finish}
            />
            {phase === 'finishing' && (
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-700">Menyimpan hasil…</div>
            )}
          </div>
        )}

        {phase === 'result' && outcome && (
          <div className="flex-1 flex flex-col items-center text-center gap-5 py-4">
            <div className="text-6xl" aria-hidden>
              {outcome.result.stars >= 3 ? '🏆' : outcome.result.stars >= 1 ? '🎉' : '💪'}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold">
                {outcome.result.stars >= 3
                  ? 'Luar biasa!'
                  : outcome.result.stars === 2
                    ? 'Hebat!'
                    : outcome.result.stars === 1
                      ? 'Bagus!'
                      : 'Ayo coba lagi!'}
              </h2>
              <StarRow stars={outcome.result.stars} size="lg" />
              {outcome.isNewBest && (
                <p className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">🌟 Rekor baru!</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <div className="bg-white rounded-2xl border border-slate-200 p-3">
                <div className="text-[11px] font-semibold text-slate-500">Skor</div>
                <div className="text-2xl font-extrabold">{outcome.result.score}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-3">
                <div className="text-[11px] font-semibold text-slate-500">
                  {set.engine === 'MEMORY_MATCH'
                    ? 'Langkah'
                    : set.engine === 'CROSSMATH'
                      ? 'Puzzle'
                      : set.engine === 'TOWER_DEFENSE'
                        ? 'Robot dihentikan'
                        : set.engine === 'LANE_RUNNER'
                          ? 'Gerbang benar'
                          : set.engine === 'BALLOON_POP' || set.engine === 'CATCHER'
                            ? 'Benda benar'
                            : 'Benar'}
                </div>
                <div className="text-2xl font-extrabold">
                  {set.engine === 'MEMORY_MATCH' ? outcome.result.total : `${outcome.result.correct}/${outcome.result.total}`}
                </div>
              </div>
            </div>
            {outcome.note && (
              <p
                className={cn(
                  'text-xs font-semibold rounded-xl px-3 py-2 max-w-md flex items-center gap-2',
                  outcome.note.kind === 'offline' ? 'bg-sky-50 text-sky-800' : outcome.note.kind === 'guest' ? 'bg-indigo-50 text-indigo-800' : 'bg-rose-50 text-rose-700'
                )}
              >
                {outcome.note.kind === 'offline' && <WifiOff className="w-4 h-4 shrink-0" />}
                {outcome.note.kind === 'guest' && <LogIn className="w-4 h-4 shrink-0" />}
                {outcome.note.text}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold active:scale-95 transition"
              >
                <RotateCcw className="w-5 h-5" /> Main Lagi
              </button>
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                <Gamepad2 className="w-5 h-5" /> Game Lain
              </Link>
            </div>
            {outcome.summary && <div className="w-full max-w-xl text-left">{outcome.summary}</div>}
          </div>
        )}
      </main>

      {/* Layar jeda: papan permainan ditutup agar tidak bisa dipelajari sambil menghentikan waktu */}
      {phase === 'playing' && paused && (
        <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center gap-5 text-white p-6" role="dialog" aria-modal="true" aria-label="Permainan dijeda">
          <div className="text-6xl" aria-hidden>
            ⏸️
          </div>
          <h2 className="text-2xl font-extrabold">Permainan dijeda</h2>
          <p className="text-sm text-slate-300 text-center max-w-xs">Papan disembunyikan selama jeda. Tekan lanjutkan bila sudah siap.</p>
          <button
            type="button"
            autoFocus
            onClick={() => setPausedSafe(false)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-extrabold"
          >
            <Play className="w-6 h-6" /> Lanjutkan
          </button>
          <Link href={backHref} className="text-sm text-slate-400 underline">
            Keluar dari permainan
          </Link>
        </div>
      )}
    </div>
  );
}
