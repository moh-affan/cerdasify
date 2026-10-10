import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { attempts, learningContents, readingProgress, subjects, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import CerdasifyLogo from '@/components/ui/CerdasifyLogo';
import { AddChildForm, ChildSettings } from '@/components/learn/ParentForms';
import { GRADE_OPTIONS, PHASE_INFO, computeStreak, gradeToPhase, jakartaDateString, lastNDates } from '@/lib/learning';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { ArrowLeft, Flame, BookOpenCheck, Star, ClipboardCheck, Users } from 'lucide-react';

const DAY_LABEL = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default async function ParentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [me] = await db.select({ parentId: users.parentId }).from(users).where(eq(users.id, user.userId)).limit(1);
  if (me?.parentId) redirect('/belajar');

  const children = await db
    .select({ id: users.id, name: users.name, username: users.username, gradeLevel: users.gradeLevel })
    .from(users)
    .where(eq(users.parentId, user.userId))
    .orderBy(asc(users.createdAt));

  const childIds = children.map((c) => c.id);
  const [progressRows, attemptRows, allSubjects] = await Promise.all([
    childIds.length
      ? db
          .select({
            userId: readingProgress.userId,
            readDate: readingProgress.readDate,
            completedAt: readingProgress.completedAt,
            quizScore: readingProgress.quizScore,
            quizTotal: readingProgress.quizTotal,
            title: learningContents.title,
            emoji: learningContents.coverEmoji,
            slug: learningContents.slug,
            subjectId: learningContents.subjectId,
          })
          .from(readingProgress)
          .innerJoin(learningContents, eq(readingProgress.contentId, learningContents.id))
          .where(inArray(readingProgress.userId, childIds))
          .orderBy(desc(readingProgress.completedAt))
      : Promise.resolve([]),
    childIds.length
      ? db
          .select({ userId: attempts.userId, status: attempts.status })
          .from(attempts)
          .where(inArray(attempts.userId, childIds))
      : Promise.resolve([]),
    db.select().from(subjects),
  ]);

  const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));
  const today = jakartaDateString();
  const week = lastNDates(7, today);
  const gradeLabel = new Map(GRADE_OPTIONS.map((g) => [g.value, g.label]));

  const stats = children.map((child) => {
    const rows = progressRows.filter((r) => r.userId === child.id);
    const scored = rows.filter((r) => r.quizTotal > 0);
    const correct = scored.reduce((sum, r) => sum + r.quizScore, 0);
    const total = scored.reduce((sum, r) => sum + r.quizTotal, 0);
    const perDay = week.map((d) => rows.filter((r) => r.readDate === d).length);
    const perSubject = new Map<string, number>();
    for (const r of rows) perSubject.set(r.subjectId, (perSubject.get(r.subjectId) ?? 0) + 1);
    const childAttempts = attemptRows.filter((a) => a.userId === child.id);

    return {
      child,
      phase: gradeToPhase(child.gradeLevel),
      streak: computeStreak(rows.map((r) => r.readDate), today),
      totalRead: rows.length,
      readToday: perDay[perDay.length - 1],
      accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
      perDay,
      maxPerDay: Math.max(1, ...perDay),
      perSubject: [...perSubject.entries()].sort((a, b) => b[1] - a[1]),
      recent: rows.slice(0, 8),
      examsDone: childAttempts.filter((a) => a.status === 'COMPLETED' || a.status === 'TIMED_OUT').length,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-2">
          <Link href="/" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Kembali ke beranda">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <CerdasifyLogo />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Dasbor Orang Tua
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pantau kebiasaan membaca, hasil kuis, dan latihan soal anak Anda.
            </p>
          </div>
          <AddChildForm />
        </div>

        {stats.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-2">
            <div className="text-5xl">👨‍👩‍👧</div>
            <h2 className="font-bold">Belum ada akun anak</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Buat akun untuk anak Anda. Anak masuk dengan username & password tersebut, dan seluruh progres belajarnya
              akan tampil di halaman ini.
            </p>
          </div>
        )}

        {stats.map((s) => (
          <section key={s.child.id} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white font-extrabold text-lg flex items-center justify-center">
                  {s.child.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-lg leading-tight">{s.child.name}</h2>
                  <p className="text-xs text-slate-500">
                    @{s.child.username} ·{' '}
                    {s.child.gradeLevel ? gradeLabel.get(s.child.gradeLevel) : 'Kelas belum diatur'}
                    {s.phase && ` · ${PHASE_INFO[s.phase].label}`}
                  </p>
                </div>
              </div>
              <ChildSettings childId={s.child.id} gradeLevel={s.child.gradeLevel} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat icon={<Flame className="w-4 h-4 text-orange-500" />} label="Hari beruntun" value={s.streak} />
              <Stat icon={<BookOpenCheck className="w-4 h-4 text-emerald-600" />} label="Bacaan selesai" value={s.totalRead} />
              <Stat
                icon={<Star className="w-4 h-4 text-yellow-500" />}
                label="Ketepatan kuis"
                value={s.accuracy === null ? '–' : `${s.accuracy}%`}
              />
              <Stat icon={<ClipboardCheck className="w-4 h-4 text-indigo-600" />} label="Ujian selesai" value={s.examsDone} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700">7 Hari Terakhir</h3>
                <div className="flex items-end gap-2 h-28 bg-slate-50 rounded-2xl p-3">
                  {s.perDay.map((count, i) => (
                    <div key={week[i]} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-semibold text-slate-500">{count || ''}</span>
                      <div
                        className={count ? 'w-full rounded-md bg-indigo-500' : 'w-full rounded-md bg-slate-200'}
                        style={{ height: `${count ? Math.max(12, (count / s.maxPerDay) * 100) : 6}%` }}
                      />
                      <span className={week[i] === today ? 'text-[10px] font-bold text-indigo-700' : 'text-[10px] text-slate-400'}>
                        {DAY_LABEL[new Date(`${week[i]}T00:00:00Z`).getUTCDay()]}
                      </span>
                    </div>
                  ))}
                </div>
                {s.perSubject.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.perSubject.map(([subjectId, count]) => (
                      <span
                        key={subjectId}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                      >
                        {subjectMap.get(subjectId)?.icon} {subjectMap.get(subjectId)?.name ?? subjectId}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700">Aktivitas Terbaru</h3>
                {s.recent.length === 0 ? (
                  <p className="text-sm text-slate-400 bg-slate-50 rounded-2xl p-4">Belum ada bacaan yang diselesaikan.</p>
                ) : (
                  <ul className="divide-y divide-slate-100 bg-slate-50 rounded-2xl px-3">
                    {s.recent.map((r) => (
                      <li key={`${r.slug}`} className="py-2 flex items-center gap-2.5 text-sm">
                        <span className="text-xl">{r.emoji || '📖'}</span>
                        <Link href={`/belajar/${r.slug}`} className="flex-1 min-w-0 truncate font-medium hover:text-indigo-700">
                          {r.title}
                        </Link>
                        {r.quizTotal > 0 && (
                          <span className="text-xs font-semibold text-amber-600 shrink-0">
                            ⭐ {r.quizScore}/{r.quizTotal}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {new Date(`${r.readDate}T00:00:00Z`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
    </div>
  );
}
