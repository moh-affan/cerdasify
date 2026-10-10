import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { learningContents, readingProgress, subjects, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import CerdasifyLogo from '@/components/ui/CerdasifyLogo';
import GradePicker from '@/components/learn/GradePicker';
import {
  PHASES,
  PHASE_INFO,
  CONTENT_TYPE_LABEL,
  contentMatchesPhase,
  computeStreak,
  gradeToPhase,
  isKidsPhase,
  isPhase,
  jakartaDateString,
  pickDailyReading,
  type Phase,
} from '@/lib/learning';
import { asc, eq } from 'drizzle-orm';
import { ArrowLeft, Flame, BookOpenCheck, Clock, CheckCircle2, Sun, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function BelajarPage({
  searchParams,
}: {
  searchParams: Promise<{ fase?: string; mapel?: string }>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;

  let gradeLevel: number | null = null;
  let isChildAccount = false;
  if (user) {
    const [row] = await db
      .select({ gradeLevel: users.gradeLevel, parentId: users.parentId })
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);
    gradeLevel = row?.gradeLevel ?? null;
    isChildAccount = Boolean(row?.parentId);
  }

  const ownPhase = gradeToPhase(gradeLevel);
  const phase: Phase = isPhase(sp.fase) ? sp.fase : ownPhase ?? 'A';
  const kids = isKidsPhase(phase);

  const [allSubjects, contents, progress] = await Promise.all([
    db.select().from(subjects).orderBy(asc(subjects.orderIndex)),
    db
      .select({
        id: learningContents.id,
        slug: learningContents.slug,
        subjectId: learningContents.subjectId,
        type: learningContents.type,
        phaseMin: learningContents.phaseMin,
        phaseMax: learningContents.phaseMax,
        cefrLevel: learningContents.cefrLevel,
        theme: learningContents.theme,
        title: learningContents.title,
        titleTranslation: learningContents.titleTranslation,
        coverEmoji: learningContents.coverEmoji,
        coverImageUrl: learningContents.coverImageUrl,
        readingMinutes: learningContents.readingMinutes,
        orderIndex: learningContents.orderIndex,
      })
      .from(learningContents)
      .where(eq(learningContents.isPublished, true))
      .orderBy(asc(learningContents.orderIndex)),
    user ? db.select().from(readingProgress).where(eq(readingProgress.userId, user.userId)) : Promise.resolve([]),
  ]);

  const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));
  const progressMap = new Map(progress.map((p) => [p.contentId, p]));
  const completedIds = new Set(progressMap.keys());
  const today = jakartaDateString();
  const streak = computeStreak(progress.map((p) => p.readDate), today);

  const phaseAll = contents.filter((c) => contentMatchesPhase(phase, c.phaseMin, c.phaseMax));
  const subjectFilter = allSubjects.some((s) => s.slug === sp.mapel) ? sp.mapel : undefined;
  const subjectChips = allSubjects
    .map((s) => ({ ...s, count: phaseAll.filter((c) => c.subjectId === s.id).length }))
    .filter((s) => s.count > 0);
  const phaseContents = subjectFilter
    ? phaseAll.filter((c) => subjectMap.get(c.subjectId)?.slug === subjectFilter)
    : phaseAll;

  const hubUrl = (params: { fase?: string; mapel?: string }) => {
    const qs = new URLSearchParams();
    if (params.fase && params.fase !== ownPhase) qs.set('fase', params.fase);
    if (params.mapel) qs.set('mapel', params.mapel);
    const q = qs.toString();
    return q ? `/belajar?${q}` : '/belajar';
  };
  const GROUP_PREVIEW = 6;
  const dailyReadings = phaseAll.filter((c) => c.type === 'DAILY_READING');
  const readToday = dailyReadings.find((c) => progressMap.get(c.id)?.readDate === today);
  const todayReading = readToday ?? pickDailyReading(dailyReadings, completedIds, today);

  // Bacaan, cerita & ensiklopedia dikelompokkan per jenis; materi (LESSON) per tema (mis. "Doa Harian").
  // Urutan kelompok mengikuti orderIndex konten pertamanya.
  const groupMap = new Map<
    string,
    { key: string; title: string; icon: string | null; subjectSlug?: string; items: typeof phaseContents }
  >();
  for (const c of phaseContents) {
    const byTheme = c.type === 'LESSON';
    const key = byTheme ? `${c.type}:${c.theme ?? ''}` : c.type;
    const title = byTheme ? c.theme || CONTENT_TYPE_LABEL[c.type] : CONTENT_TYPE_LABEL[c.type];
    if (!groupMap.has(key)) {
      const subject = subjectMap.get(c.subjectId);
      groupMap.set(key, { key, title, icon: subject?.icon ?? null, subjectSlug: subject?.slug, items: [] });
    }
    groupMap.get(key)!.items.push(c);
  }
  const groups = [...groupMap.values()];

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
            {user && !isChildAccount && (
              <Link
                href="/orang-tua"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Orang Tua</span>
              </Link>
            )}
            {user && <GradePicker currentGrade={gradeLevel} />}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Sapaan & statistik */}
        <section
          className={cn(
            'rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden',
            kids
              ? 'bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500'
              : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900'
          )}
        >
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-semibold text-white/80">
              {user ? `Halo, ${user.name.split(' ')[0]}! 👋` : 'Selamat datang! 👋'}
            </p>
            <h1 className={cn('font-extrabold tracking-tight leading-tight', kids ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl')}>
              {kids ? 'Ayo membaca hari ini! 📚' : 'Pustaka Belajar'}
            </h1>
            <p className="text-sm text-white/80">
              {PHASE_INFO[phase].label} · {PHASE_INFO[phase].grades} · Bahasa Inggris {PHASE_INFO[phase].cefr}
            </p>
          </div>

          {user && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="bg-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-bold">{streak} hari beruntun</span>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-emerald-300" />
                <span className="text-sm font-bold">{completedIds.size} bacaan selesai</span>
              </div>
            </div>
          )}
          {user && !gradeLevel && (
            <p className="mt-4 text-xs bg-white/15 rounded-xl px-3 py-2 inline-block">
              Atur <b>Kelasku</b> di pojok kanan atas agar bacaan otomatis sesuai jenjangmu.
            </p>
          )}
        </section>

        {/* Pilihan fase */}
        <nav className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {PHASES.map((p) => (
            <Link
              key={p}
              href={hubUrl({ fase: p, mapel: subjectFilter })}
              className={cn(
                'shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition',
                p === phase
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
              )}
            >
              {PHASE_INFO[p].label}
              <span className="hidden sm:inline font-normal opacity-80"> · {PHASE_INFO[p].grades}</span>
              {p === ownPhase && ' ★'}
            </Link>
          ))}
        </nav>

        {/* Filter mata pelajaran */}
        {subjectChips.length > 1 && (
          <nav className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 -mt-4">
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
                  subjectFilter === s.slug
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                )}
              >
                {s.icon} {s.name} <span className="opacity-60">{s.count}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Bacaan hari ini */}
        {todayReading && !subjectFilter && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Bacaan Hari Ini
            </h2>
            <Link
              href={`/belajar/${todayReading.slug}`}
              className="block bg-white rounded-3xl border-2 border-amber-200 p-5 sm:p-6 hover:shadow-md hover:border-amber-300 transition group"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-6xl sm:text-7xl shrink-0">{todayReading.coverEmoji || '📖'}</div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    {todayReading.theme}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-indigo-700">
                    {todayReading.title}
                  </h3>
                  {todayReading.titleTranslation && (
                    <p className="text-sm text-slate-500">{todayReading.titleTranslation}</p>
                  )}
                  <p className="text-xs font-semibold pt-1">
                    {progressMap.has(todayReading.id) ? (
                      <span className="text-emerald-700">✅ Sudah dibaca hari ini — hebat!</span>
                    ) : (
                      <span className="text-indigo-700">Mulai membaca →</span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Daftar konten per jenis */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            Belum ada bacaan untuk {PHASE_INFO[phase].label}. Konten baru akan segera ditambahkan.
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.key} className="space-y-3">
              <h2 className="text-lg font-bold">
                {g.icon && <span className="mr-1.5">{g.icon}</span>}
                {g.title}{' '}
                <span className="text-xs font-semibold text-slate-400">
                  ({g.items.filter((i) => completedIds.has(i.id)).length}/{g.items.length} selesai)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(subjectFilter ? g.items : g.items.slice(0, GROUP_PREVIEW)).map((c) => {
                  const done = progressMap.get(c.id);
                  const subject = subjectMap.get(c.subjectId);
                  return (
                    <Link
                      key={c.id}
                      href={`/belajar/${c.slug}`}
                      className={cn(
                        'relative bg-white rounded-2xl border p-4 hover:shadow-md hover:border-indigo-300 transition flex flex-col gap-1.5',
                        done ? 'border-emerald-200' : 'border-slate-200'
                      )}
                    >
                      {done && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />}
                      {c.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.coverImageUrl}
                          alt=""
                          loading="lazy"
                          className="w-full aspect-square object-cover rounded-xl -mt-1 mb-1"
                        />
                      ) : (
                        <div className="text-4xl">{c.coverEmoji || subject?.icon || '📖'}</div>
                      )}
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{c.title}</h3>
                      {c.titleTranslation && <p className="text-xs text-slate-500 leading-snug">{c.titleTranslation}</p>}
                      <div className="mt-auto pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {c.readingMinutes} mnt
                        {done && done.quizTotal > 0 && (
                          <span className="ml-auto text-amber-600 font-semibold">
                            ⭐ {done.quizScore}/{done.quizTotal}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {!subjectFilter && g.items.length > GROUP_PREVIEW && (
                <Link
                  href={hubUrl({ fase: phase, mapel: g.subjectSlug })}
                  className="inline-flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Lihat semua ({g.items.length}) →
                </Link>
              )}
            </section>
          ))
        )}
      </main>
    </div>
  );
}
