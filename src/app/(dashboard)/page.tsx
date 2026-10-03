import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { examPackages, categories, packageQuestions, questions, attempts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import {
  Sparkles,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  LogOut,
  Shield,
  User,
  History,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Image as ImageIcon,
  PauseCircle,
} from 'lucide-react';

export default async function UserDashboardPage() {
  const user = await getCurrentUser();

  // Load published packages
  const packagesList = db
    .select({
      id: examPackages.id,
      title: examPackages.title,
      slug: examPackages.slug,
      categoryId: examPackages.categoryId,
      type: examPackages.type,
      durationMinutes: examPackages.durationMinutes,
      passingGradeRules: examPackages.passingGradeRules,
    })
    .from(examPackages)
    .where(eq(examPackages.isPublished, true))
    .all();

  const allCategories = db.select().from(categories).all();
  const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

  // Get question counts and image presence for each package
  const packageStats = packagesList.map((pkg) => {
    const pkgQs = db
      .select({
        questionId: packageQuestions.questionId,
        imageUrl: questions.imageUrl,
      })
      .from(packageQuestions)
      .innerJoin(questions, eq(packageQuestions.questionId, questions.id))
      .where(eq(packageQuestions.packageId, pkg.id))
      .all();

    const hasImages = pkgQs.some((q) => Boolean(q.imageUrl));

    return {
      ...pkg,
      categoryName: categoryMap.get(pkg.categoryId) || 'Umum',
      questionCount: pkgQs.length,
      hasImages,
    };
  });

  // User's past attempts
  const userAttempts = user
    ? db
        .select()
        .from(attempts)
        .where(eq(attempts.userId, user.userId))
        .orderBy(desc(attempts.startedAt))
        .all()
    : [];

  const pkgTitleMap = new Map(packagesList.map((p) => [p.id, p.title]));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                Cerdasify
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Ujian & Bank Soal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Panel Admin</span>
                  </Link>
                )}

                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">@{user.username} ({user.role})</span>
                </div>

                <a
                  href="/api/auth/logout"
                  title="Keluar"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              Simulasi Ujian Matematika, Sains & CPNS
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Latihan Soal Presisi Tinggi dengan Pembahasan Rumus Lengkap
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Mulai simulasi berbatas waktu, evaluasi kelemahan topik secara instan, dan perdalam pemahaman konsep matematika dengan formula KaTeX standar olimpiade.
            </p>
          </div>
        </section>

        {/* Available Packages Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Daftar Paket Soal & Simulasi Ujian
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih paket ujian untuk memulai simulasi pengerjaan soal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packageStats.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                      {pkg.categoryName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {pkg.durationMinutes} Menit
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                    {pkg.title}
                  </h3>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {pkg.type === 'PRACTICE' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <PauseCircle className="w-3 h-3 text-amber-600" />
                        Mode Latihan (Bisa Dijeda)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Simulasi Resmi
                      </span>
                    )}

                    {pkg.hasImages && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <ImageIcon className="w-3 h-3 text-purple-600" />
                        Soal Bergambar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Award className="w-4 h-4 text-indigo-500" />
                      {pkg.questionCount} Butir Soal
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={`/exam/${pkg.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs group-hover:shadow-indigo-500/20 active:scale-98 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mulai Pengerjaan</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History of Past Attempts */}
        {user && userAttempts.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Riwayat Ujian Anda
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar hasil pengerjaan simulasi ujian dan pembahasan materi
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {userAttempts.map((att) => {
                  const pkgTitle = pkgTitleMap.get(att.packageId) || 'Paket Ujian';
                  const isCompleted = att.status === 'COMPLETED';

                  return (
                    <div
                      key={att.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{pkgTitle}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted
                                ? att.isPassed
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isCompleted
                              ? att.isPassed
                                ? 'LULUS'
                                : 'BELUM LULUS'
                              : 'SEDANG BERJALAN'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Dimulai pada {new Date(att.startedAt).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {isCompleted && (
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              Skor Akhir
                            </span>
                            <span className="text-lg font-extrabold text-indigo-600 font-mono">
                              {att.scoreTotal}
                            </span>
                          </div>
                        )}

                        <Link
                          href={isCompleted ? `/results/${att.id}` : `/exam/${att.packageId}`}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isCompleted
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          <span>{isCompleted ? 'Lihat Hasil & Pembahasan' : 'Lanjutkan Ujian'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Cerdasify • Platform Simulasi Ujian & Bank Soal Cerdas</p>
          <div className="flex items-center gap-4">
            <span>SQLite WAL Mode Enabled</span>
            <span>•</span>
            <span>KaTeX Formula Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
