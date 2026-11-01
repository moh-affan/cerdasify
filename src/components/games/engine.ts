import type { ReactNode } from 'react';
import type { GameResult, PlayableSet } from '@/lib/games/types';
import type { VocabRoundItem } from '@/lib/games/vocab';

/** Kontrak bersama setiap engine game (komponen klien yang dimuat lazy). */
export interface EngineProps {
  set: PlayableSet;
  seed: number;
  /** Ronde Kosakata Bergambar dari server (null untuk tamu / engine lain) */
  round: VocabRoundItem[] | null;
  sessionId: string | null;
  paused: boolean;
  kids: boolean;
  onFinish: (payload: { log: unknown; local: GameResult; summary?: ReactNode }) => void;
}
