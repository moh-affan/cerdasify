import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { questions, questionOptions, topics, categories } from '@/db/schema';
import { MathRenderer } from '@/components/katex/MathRenderer';
import {
  PlusCircle,
  Search,
  Filter,
  BookOpen,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { desc, eq, asc } from 'drizzle-orm';

export default async function AdminBankSoalPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    topic?: string;
    difficulty?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const searchQuery = (sp.q || '').trim().toLowerCase();
  const filterCategory = sp.category || '';
  const filterTopic = sp.topic || '';
  const filterDifficulty = sp.difficulty || '';
  const filterType = sp.type || '';
  const requestedPage = Math.max(1, parseInt(sp.page || '1', 10));
  const PAGE_SIZE = 15;

  const allCategories = await db.select().from(categories).orderBy(categories.orderIndex);
  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const allTopics = await db.select().from(topics).orderBy(topics.name);
  const topicMap = new Map(allTopics.map((t) => [t.id, t.name]));
  const topicCategoryMap = new Map(allTopics.map((t) => [t.id, t.categoryId]));

  // Topics filtered by chosen category (if any)
  const availableTopics = filterCategory
    ? allTopics.filter((t) => t.categoryId === filterCategory)
    : allTopics;

  // Fetch all questions with order by latest
  const allQs = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt));

  // Filter in memory for maximum speed and flex
  const filtered = allQs.filter((q) => {
    // Category filter
    if (filterCategory) {
      const qCat = topicCategoryMap.get(q.topicId);
      if (qCat !== filterCategory) return false;
    }
    // Topic filter
    if (filterTopic && q.topicId !== filterTopic) return false;
    // Difficulty filter
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    // Type filter
    if (filterType && q.type !== filterType) return false;
    // Search query
    if (searchQuery) {
      const matchesQ = q.contentMarkdown.toLowerCase().includes(searchQuery);
      const matchesExp = (q.explanationMarkdown || '').toLowerCase().includes(searchQuery);
      if (!matchesQ && !matchesExp) return false;
    }
    return true;
  });

  // Pagination calculation
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedQuestions = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const allOpts = await db.select().from(questionOptions).orderBy(asc(questionOptions.orderIndex));
  const optionsByQuestionId = new Map<string, typeof allOpts>();
  for (const opt of allOpts) {
    if (!optionsByQuestionId.has(opt.questionId)) optionsByQuestionId.set(opt.questionId, []);
    optionsByQuestionId.get(opt.questionId)!.push(opt);
  }

  // Helper to build pagination links
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (sp.q) params.set('q', sp.q);
    if (sp.category) params.set('category', sp.category);
    if (sp.topic) params.set('topic', sp.topic);
    if (sp.difficulty) params.set('difficulty', sp.difficulty);
    if (sp.type) params.set('type', sp.type);
    if (pageNumber > 1) params.set('page', String(pageNumber));
    const qs = params.toString();
    return qs ? `/admin/bank-soal?${qs}` : '/admin/bank-soal';
  };

  const isFilterActive = Boolean(
    searchQuery || filterCategory || filterTopic || filterDifficulty || filterType
  );

  // Generate pagination page numbers range
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;
    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Bank Soal & Formula Sains
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola {allQs.length} butir soal olimpiade, sains, dan CPNS dengan formula KaTeX standar resmi
          </p>
        </div>

        <Link
          href="/admin/bank-soal/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Soal Baru</span>
        </Link>
      </div>

      {/* Unified Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <form method="GET" action="/admin/bank-soal" className="space-y-3">
          {/* Search Row */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={sp.q || ''}
              placeholder="Cari teks pertanyaan, kata kunci, atau rumus matematika..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Kategori</label>
              <select
                name="category"
                defaultValue={filterCategory}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="">Semua Kategori ({allCategories.length})</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Topik / Materi</label>
              <select
                name="topic"
                defaultValue={filterTopic}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="">Semua Topik ({availableTopics.length})</option>
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tingkat Kesulitan</label>
              <select
                name="difficulty"
                defaultValue={filterDifficulty}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="">Semua Tingkat</option>
                <option value="EASY">Mudah (EASY)</option>
                <option value="MEDIUM">Sedang (MEDIUM)</option>
                <option value="HARD">Sulit (HARD)</option>
                <option value="HOTS">Tingkat Tinggi (HOTS)</option>
              </select>
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tipe Soal</label>
              <select
                name="type"
                defaultValue={filterType}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="">Semua Tipe Soal</option>
                <option value="SINGLE_CHOICE">Pilihan Ganda Biasa</option>
                <option value="MULTI_CHOICE">Pilihan Ganda Kompleks</option>
                <option value="GRADED_SCALE">Skala TKP CPNS (1–5)</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-500">
              Ditemukan <strong className="text-slate-800 font-bold">{totalFiltered}</strong> butir soal
              {isFilterActive && ' sesuai filter'}
            </div>

            <div className="flex items-center gap-2">
              {isFilterActive && (
                <Link
                  href="/admin/bank-soal"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </Link>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Terapkan Filter</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Menampilkan {totalFiltered > 0 ? startIdx + 1 : 0}–{Math.min(startIdx + PAGE_SIZE, totalFiltered)} dari {totalFiltered} butir soal
        </span>
        {totalPages > 1 && (
          <span>Halaman {currentPage} dari {totalPages}</span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Soal yang Sesuai</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan atur kembali kata kunci pencarian atau ubah pilihan kategori, topik, dan tingkat kesulitan.
            </p>
            {isFilterActive && (
              <Link
                href="/admin/bank-soal"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Hapus Semua Filter</span>
              </Link>
            )}
          </div>
        ) : (
          paginatedQuestions.map((q, idx) => {
            const overallNumber = startIdx + idx + 1;
            const tName = topicMap.get(q.topicId) || 'Umum';
            const catId = topicCategoryMap.get(q.topicId);
            const cName = catId ? catMap.get(catId) : null;

            const opts = optionsByQuestionId.get(q.id) || [];

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-indigo-300 transition space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {overallNumber}
                    </span>
                    {cName && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {cName}
                      </span>
                    )}
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {tName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        q.difficulty === 'EASY'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : q.difficulty === 'MEDIUM'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : q.difficulty === 'HARD'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {q.type === 'GRADED_SCALE' ? 'Skala TKP' : 'Pilihan Ganda'}
                    </span>
                    {q.imageUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                        <ImageIcon className="w-3 h-3 text-purple-600" />
                        Bergambar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {q.id}
                    </span>
                    <Link
                      href={`/admin/bank-soal/${q.id}`}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 transition active:scale-95"
                      title="Edit Butir Soal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Question Body with KaTeX MathRenderer */}
                <div className="text-slate-900 text-sm sm:text-base leading-relaxed select-text space-y-2">
                  <MathRenderer content={q.contentMarkdown} />
                  {q.imageUrl && (
                    <div className="mt-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl inline-block">
                      <img
                        src={q.imageUrl}
                        alt="Stimulus Soal"
                        className="max-h-48 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Options Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {opts.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                        opt.isCorrect
                          ? 'border-emerald-400 bg-emerald-50/60 text-emerald-950 font-medium ring-1 ring-emerald-400/40'
                          : 'border-slate-100 bg-slate-50/50 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          opt.isCorrect ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <div className="flex-1 overflow-hidden break-words">
                        <MathRenderer content={opt.contentMarkdown} />
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase shrink-0">
                          {q.type === 'GRADED_SCALE' ? `Poin ${opt.scoreValue}` : 'Kunci'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step-by-step Explanation */}
                {q.explanationMarkdown && (
                  <div className="pt-2 text-xs text-slate-600 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100/80 flex items-start gap-2">
                    <strong className="text-indigo-900 font-bold shrink-0">Pembahasan:</strong>
                    <div className="select-text leading-relaxed text-slate-700 flex-1">
                      <MathRenderer content={q.explanationMarkdown} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
          <div className="text-xs text-slate-500">
            Halaman <strong className="text-slate-800 font-bold">{currentPage}</strong> dari{' '}
            <strong className="text-slate-800 font-bold">{totalPages}</strong> (Total {totalFiltered} butir soal)
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* First Page */}
            <Link
              href={createPageUrl(1)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition ${
                currentPage > 1
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
              }`}
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Link>

            {/* Prev Page */}
            <Link
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition ${
                currentPage > 1
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
              }`}
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            {/* Page Buttons */}
            {getPageNumbers().map((p, pIdx) => {
              if (p === '...') {
                return (
                  <span key={`dots-${pIdx}`} className="px-2 text-xs text-slate-400 font-mono">
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;
              return (
                <Link
                  key={pageNum}
                  href={createPageUrl(pageNum)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* Next Page */}
            <Link
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition ${
                currentPage < totalPages
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
              }`}
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Last Page */}
            <Link
              href={createPageUrl(totalPages)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition ${
                currentPage < totalPages
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50 text-slate-300 pointer-events-none'
              }`}
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
