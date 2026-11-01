import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { gameProgress, gameSets, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { contentMatchesPhase, gradeToPhase, isKidsPhase } from '@/lib/learning';
import { gameLimitStatus, isContentVocabSet, toPlayableSet } from '@/lib/games/server';
import GamePlayer from '@/components/games/GamePlayer';
import { and, eq } from 'drizzle-orm';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ konten?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [set] = await db.select({ title: gameSets.title }).from(gameSets).where(eq(gameSets.slug, slug)).limit(1);
  return { title: set ? `${set.title} · Bermain` : 'Bermain' };
}

export default async function PlayGamePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { konten } = await searchParams;
  const user = await getCurrentUser();

  const [row] = await db.select().from(gameSets).where(eq(gameSets.slug, slug)).limit(1);
  const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  if (!row || (!row.isPublished && !isStaff)) notFound();

  const contentVocab = isContentVocabSet(row);
  const set = await toPlayableSet(row, contentVocab ? (konten ?? null) : null);
  if (!set) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 p-6 text-center bg-slate-50">
        <div className="text-6xl">🃏</div>
        <h1 className="text-xl font-extrabold">Kosakata bergambar belum cukup</h1>
        <p className="text-sm text-slate-500 max-w-sm">Permainan ini butuh minimal 4 kosakata bergambar dari bacaan. Coba bacaan lain, ya!</p>
        <Link href={konten ? `/belajar/${konten}` : '/belajar'} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
          Kembali
        </Link>
      </div>
    );
  }

  const [progress, userRow, limit] = await Promise.all([
    user
      ? db
          .select()
          .from(gameProgress)
          .where(and(eq(gameProgress.userId, user.userId), eq(gameProgress.gameSetId, row.id)))
          .limit(1)
          .then((r) => r[0] ?? null)
      : Promise.resolve(null),
    user ? db.select({ gradeLevel: users.gradeLevel }).from(users).where(eq(users.id, user.userId)).limit(1).then((r) => r[0]) : Promise.resolve(undefined),
    user ? gameLimitStatus(user.userId) : Promise.resolve(null),
  ]);

  const userPhase = gradeToPhase(userRow?.gradeLevel);
  const displayPhase = userPhase && contentMatchesPhase(userPhase, row.phaseMin, row.phaseMax) ? userPhase : row.phaseMin;

  return (
    <GamePlayer
      set={set}
      isLoggedIn={!!user}
      best={progress ? { stars: progress.bestStars, score: progress.bestScore, plays: progress.plays } : null}
      kids={isKidsPhase(displayPhase)}
      remainingMinutes={limit?.remaining ?? null}
      backHref={contentVocab && konten ? `/belajar/${konten}` : '/bermain'}
    />
  );
}
