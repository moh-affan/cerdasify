import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/db';
import { gameProgress, gameSets, subjects, users, vocabMastery } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import CerdasifyLogo from '@/components/ui/CerdasifyLogo';
import GradePicker from '@/components/learn/GradePicker';
import { StarRow } from '@/components/games/Pads';
import {
  PHASES,
  PHASE_INFO,
  computeStreak,
  contentMatchesPhase,
  gradeToPhase,
  isKidsPhase,
  isPhase,
  jakartaDateString,
  type Phase,
} from '@/lib/learning';
import { ENGINE_INFO, GAME_ENGINES, type VocabCard } from '@/lib/games/types';
import { activityDates, gameLimitStatus, isContentVocabSet } from '@/lib/games/server';
import { MASTERED_BOX, wordKey } from '@/lib/games/vocab';
import { and, asc, eq, gte, lte, sql } from 'drizzle-orm';
import { ArrowLeft, Flame, Star, Brain, Target, Hourglass, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Bermain · Game Edukasi' };

export default async function GamesHubPage({ searchParams }: { searchParams: Promise<{ fase?: string; mapel?: string }> }) {
  const user = await getCurrentUser();
  const sp = await searchParams;

  const [userRow] = user
    ? await db.select({ gradeLevel: users.gradeLevel }).from(users).where(eq(users.id, user.userId)).limit(1)
    : [];
  const gradeLevel = userRow?.gradeLevel ?? null;
  const ownPhase = gradeToPhase(gradeLevel);
  const phase: Phase = isPhase(sp.fase) ? sp.fase : (ownPhase ?? 'A');
  const kids = isKidsPhase(phase);
  const today = jakartaDateString();

  const [allSubjects, rows, progress, dueRows, masteredRow, dates, limit] = await Promise.all([
    db.select().from(subjects).orderBy(asc(subjects.orderIndex)),
    db.select().from(gameSets).where(eq(gameSets.isPublished, true)).orderBy(asc(gameSets.orderIndex), asc(gameSets.title)),
    user ? db.select().from(gameProgress).where(eq(gameProgress.userId, user.userId)) : Promise.resolve([]),
    user
      ? db
          .select({ wordKey: vocabMastery.wordKey })
          .from(vocabMastery)
          .where(and(eq(vocabMastery.userId, user.userId), lte(vocabMastery.dueDate, today)))
      : Promise.resolve([]),
    user
      ? db
          .select({ n: sql<number>`count(*)::int` })
          .from(vocabMastery)
          .where(and(eq(vocabMastery.userId, user.userId), gte(vocabMastery.box, MASTERED_BOX)))
          .then((r) => r[0])
      : Promise.resolve(undefined),
    user ? activityDates(user.userId) : Promise.resolve([]),
    user ? gameLimitStatus(user.userId) : Promise.resolve(null),
  ]);

  const progressMap = new Map(progress.map((p) => [p.gameSetId, p]));
  const totalStars = progress.reduce((s, p) => s + p.bestStars, 0);
  const streak = computeStreak(dates, today);
  const due = new Set(dueRows.map((r) => r.wordKey));

  // Kartu kosakata bacaan hanya dibuka dari halaman bacaan
  const listed = rows.filter((r) => !isContentVocabSet(r));
  const phaseAll = listed.filter((r) => contentMatchesPhase(phase, r.phaseMin, r.phaseMax));
  const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));
  const subjectChips = allSubjects
    .map((s) => ({ ...s, count: phaseAll.filter((r) => r.subjectId === s.id).length }))
    .filter((s) => s.count > 0);
  const subjectFilter = subjectChips.some((s) => s.slug === sp.mapel) ? sp.mapel : undefined;
  const visible = subjectFilter ? phaseAll.filter((r) => subjectMap.get(r.subjectId)?.slug === subjectFilter) : phaseAll;

  // Tantangan hari ini: dek kosakata dengan kata jatuh tempo terbanyak, atau game yang belum pernah dimainkan
  const dueBySet = new Map<string, number>();
  if (due.size) {
    for (const r of phaseAll.filter((x) => x.engine === 'VOCAB_PICTURE' && x.itemsJson)) {
      const n = (JSON.parse(r.itemsJson!) as VocabCard[]).filter((c) => due.has(wordKey(c.word))).length;
      if (n) dueBySet.set(r.id, n);
    }
  }
  const dueTop = [...dueBySet.entries()].sort((a, b) => b[1] - a[1])[0];
  const challenge = dueTop
    ? { set: phaseAll.find((r) => r.id === dueTop[0])!, text: `${dueTop[1]} kata perlu diulang hari ini` }
    : (() => {
        const fresh = phaseAll.find((r) => !progressMap.has(r.id));
        return fresh ? { set: fresh, text: 'Belum pernah kamu mainkan. Coba sekarang!' } : null;
      })();

  const hubUrl = (params: { fase?: string; mapel?: string }) => {
    const qs = new URLSearchParams();
    if (params.fase && params.fase !== ownPhase) qs.set('fase', params.fase);
    if (params.mapel) qs.set('mapel', params.mapel);
    const q = qs.toString();
    return q ? `/bermain?${q}` : '/bermain';
  };

  // Kelompok: mata pelajaran → urutan engine
  const groups = allSubjects
    .map((s) => ({
      subject: s,
      items: visible
        .filter((r) => r.subjectId === s.id)
        .sort((a, b) => GAME_ENGINES.indexOf(a.engine) - GAME_ENGINES.indexOf(b.engine) || a.orderIndex - b.orderIndex),
    }))
    .filter((g) => g.items.length);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Kembali ke beranda">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <CerdasifyLogo />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/belajar"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold hover:bg-sky-100"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Pustaka Belajar
            </Link>
            {user && <GradePicker currentGrade={gradeLevel} />}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-7">
        <section
          className={cn(
            'rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden',
            kids ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500' : 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900'
          )}
        >
          <div className="absolute -right-4 -bottom-6 text-[7rem] sm:text-[9rem] opacity-20 select-none" aria-hidden>
            🎮
          </div>
          <div className="space-y-2 max-w-xl relative">
            <p className="text-sm font-semibold text-white/80">{user ? `Halo, ${user.name.split(' ')[0]}! 👋` : 'Selamat datang! 👋'}</p>
            <h1 className={cn('font-extrabold tracking-tight leading-tight', kids ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl')}>
              {kids ? 'Ayo bermain sambil belajar! 🎮' : 'Bermain · Game Edukasi'}
            </h1>
            <p className="text-sm text-white/80">
              {PHASE_INFO[phase].label} · {PHASE_INFO[phase].grades}
            </p>
          </div>
          {user && (
            <div className="mt-5 flex flex-wrap gap-2.5 relative">
              <span className="bg-white/15 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-sm font-bold">
                <Flame className="w-4 h-4 text-orange-300" /> {streak} hari beruntun
              </span>
              <span className="bg-white/15 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-sm font-bold">
                <Star className="w-4 h-4 text-yellow-300" /> {totalStars} bintang
              </span>
              <span className="bg-white/15 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-sm font-bold">
                <Brain className="w-4 h-4 text-pink-200" /> {masteredRow?.n ?? 0} kata dikuasai
              </span>
              {limit?.remaining !== null && limit?.remaining !== undefined && (
                <span className="bg-white/15 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-sm font-bold">
                  <Hourglass className="w-4 h-4 text-sky-200" /> Sisa {limit.remaining} menit hari ini
                </span>
              )}
            </div>
          )}
          {!user && (
            <p className="mt-4 text-xs bg-white/15 rounded-xl px-3 py-2 inline-block relative">
              Semua game bisa langsung dimainkan. <Link href="/login" className="font-bold underline">Masuk</Link> agar bintang & hafalan kosakatamu tersimpan.
            </p>
          )}
        </section>

        <Link
          href="/belajar"
          className="sm:hidden -mt-3 flex items-center gap-3 bg-white border border-sky-200 text-sky-900 rounded-2xl px-4 py-3"
        >
          <BookOpen className="w-5 h-5 text-sky-600" />
          <span className="flex-1 text-sm font-bold">Pustaka Belajar: bacaan & materi</span>
          <span aria-hidden>→</span>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Pilih fase">
          {PHASES.map((p) => (
            <Link
              key={p}
              href={hubUrl({ fase: p, mapel: subjectFilter })}
              className={cn(
                'shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition',
                p === phase ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
              )}
            >
              {PHASE_INFO[p].label}
              <span className="hidden sm:inline font-normal opacity-80"> · {PHASE_INFO[p].grades}</span>
              {p === ownPhase && ' ★'}
            </Link>
          ))}
        </nav>

        {subjectChips.length > 1 && (
          <nav className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 -mt-4" aria-label="Pilih mata pelajaran">
            <Link
              href={hubUrl({ fase: phase })}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition',
                !subjectFilter ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'
              )}
            >
              Semua
            </Link>
            {subjectChips.map((s) => (
              <Link
                key={s.id}
                href={hubUrl({ fase: phase, mapel: s.slug })}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition',
                  subjectFilter === s.slug ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                )}
              >
                {s.icon} {s.name} <span className="opacity-60">{s.count}</span>
              </Link>
            ))}
          </nav>
        )}

        {challenge && !subjectFilter && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" /> Tantangan Hari Ini
            </h2>
            <Link
              href={`/bermain/${challenge.set.slug}`}
              className="flex items-center gap-4 bg-white rounded-3xl border-2 border-rose-200 p-5 hover:shadow-md hover:border-rose-300 transition group"
            >
              <div className="text-6xl shrink-0">{challenge.set.coverEmoji || ENGINE_INFO[challenge.set.engine].emoji}</div>
              <div className="min-w-0 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-rose-600">{ENGINE_INFO[challenge.set.engine].label}</span>
                <h3 className="text-xl font-extrabold group-hover:text-rose-700">{challenge.set.title}</h3>
                <p className="text-sm text-slate-500">{challenge.text}</p>
              </div>
            </Link>
          </section>
        )}

        {groups.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            Belum ada game untuk {PHASE_INFO[phase].label}. Coba fase lain, ya!
          </div>
        ) : (
          groups.map(({ subject, items }) => (
            <section key={subject.id} className="space-y-3">
              <h2 className="text-lg font-bold">
                {subject.icon} {subject.name}{' '}
                <span className="text-xs font-semibold text-slate-400">
                  ({items.filter((i) => progressMap.has(i.id)).length}/{items.length} dimainkan)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((r) => {
                  const p = progressMap.get(r.id);
                  const dueCount = dueBySet.get(r.id);
                  return (
                    <Link
                      key={r.id}
                      href={`/bermain/${r.slug}`}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-2 hover:shadow-md hover:border-emerald-300 transition group relative"
                    >
                      {dueCount ? (
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">{dueCount} ulang</span>
                      ) : (
                        !p && user && <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">Baru</span>
                      )}
                      <div className={kids ? 'text-5xl' : 'text-4xl'}>{r.coverEmoji || ENGINE_INFO[r.engine].emoji}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        {ENGINE_INFO[r.engine].emoji} {ENGINE_INFO[r.engine].label}
                      </span>
                      <h3 className="font-bold text-sm leading-snug group-hover:text-emerald-700">{r.title}</h3>
                      <div className="mt-auto pt-1">
                        {p ? <StarRow stars={p.bestStars} size="sm" /> : <span className="text-xs text-slate-400">Belum dimainkan</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
