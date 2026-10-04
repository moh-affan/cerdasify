import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { examPackages, categories, packageQuestions, questions, attempts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import CerdasifyLogo from '@/components/ui/CerdasifyLogo';
import InstallButton from '@/components/pwa/InstallButton';
import { eq, desc } from 'drizzle-orm';
import {
  Sparkles,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
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
  Search,
  Filter,
  X,
} from 'lucide-react';

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; type?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;

  const searchQuery = (sp.q || '').trim().toLowerCase();
  const selectedCategory = sp.category || '';
  const selectedType = sp.type || '';
  const requestedPage = Math.max(1, parseInt(sp.page || '1', 10));
  const PAGE_SIZE = 9;

  // Load published packages
  const packagesList = await db
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
    .where(eq(examPackages.isPublished, true));

  const allCategories = await db.select().from(categories).orderBy(categories.orderIndex);
  const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

  // Get question counts and image presence for each package
  const allPkgQuestions = await db
    .select({
      packageId: packageQuestions.packageId,
      questionId: packageQuestions.questionId,
      imageUrl: questions.imageUrl,
    })
    .from(packageQuestions)
    .innerJoin(questions, eq(packageQuestions.questionId, questions.id));

  const packageStats = packagesList.map((pkg) => {
    const pkgQs = allPkgQuestions.filter((q) => q.packageId === pkg.id);
    const hasImages = pkgQs.some((q) => Boolean(q.imageUrl));

    return {
      ...pkg,
      categoryName: categoryMap.get(pkg.categoryId) || 'Umum',
      questionCount: pkgQs.length,
      hasImages,
    };
  });

  // Filter packages based on search query, category, and type
  const filteredPackages = packageStats.filter((pkg) => {
    if (searchQuery && !pkg.title.toLowerCase().includes(searchQuery) && !pkg.categoryName.toLowerCase().includes(searchQuery)) {
      return false;
    }
    if (selectedCategory && pkg.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedType && pkg.type !== selectedType) {
      return false;
    }
    return true;
  });

  // Pagination calculation
  const totalFiltered = filteredPackages.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedPackages = filteredPackages.slice(startIdx, startIdx + PAGE_SIZE);

  // Helper to build pagination links
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (sp.q) params.set('q', sp.q);
    if (sp.category) params.set('category', sp.category);
    if (sp.type) params.set('type', sp.type);
    if (pageNumber > 1) params.set('page', String(pageNumber));
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };

  const isFilterActive = Boolean(searchQuery || selectedCategory || selectedType);

  // User's past attempts
  const userAttempts = user
    ? await db
        .select()
        .from(attempts)
        .where(eq(attempts.userId, user.userId))
        .orderBy(desc(attempts.startedAt))
    : [];

  const pkgTitleMap = new Map(packagesList.map((p) => [p.id, p.title]));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <CerdasifyLogo />

          <div className="flex items-center gap-2 sm:gap-3">
            <InstallButton variant="header" />

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
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Daftar Paket Soal & Simulasi Ujian
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tersedia {packageStats.length} paket latihan & simulasi siap dikerjakan
              </p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <form method="GET" action="/" className="flex flex-col md:flex-row gap-3">
              {/* Search text */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="q"
                  defaultValue={sp.q || ''}
                  placeholder="Cari judul paket ujian atau kompetisi..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-56">
                <select
                  name="category"
                  defaultValue={selectedCategory}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="">Semua Kategori ({allCategories.length})</option>
                  {allCategories.map((c) => {
                    const cnt = packageStats.filter((p) => p.categoryId === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} ({cnt})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Type Filter */}
              <div className="w-full md:w-44">
                <select
                  name="type"
                  defaultValue={selectedType}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="">Semua Mode</option>
                  <option value="SIMULATION">Simulasi Resmi</option>
                  <option value="PRACTICE">Mode Latihan (Jeda)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Terapkan</span>
                </button>

                {isFilterActive && (
                  <Link
                    href="/"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
                    title="Reset Filter"
                  >
                    <X className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </form>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan {totalFiltered > 0 ? startIdx + 1 : 0}–{Math.min(startIdx + PAGE_SIZE, totalFiltered)} dari {totalFiltered} paket soal
              {isFilterActive && ' (difilter)'}
            </span>
            {totalPages > 1 && (
              <span>Halaman {currentPage} dari {totalPages}</span>
            )}
          </div>

          {/* Packages Grid */}
          {paginatedPackages.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Paket Soal yang Cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan ubah kata kunci pencarian atau bersihkan filter kategori/mode ujian untuk melihat paket soal lainnya.
              </p>
              {isFilterActive && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Hapus Semua Filter</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedPackages.map((pkg) => (
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {/* Previous */}
              <Link
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                  currentPage > 1
                    ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
                }`}
                aria-disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Link>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={createPageUrl(p)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {/* Next */}
              <Link
                href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                  currentPage < totalPages
                    ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
                }`}
                aria-disabled={currentPage >= totalPages}
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
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
