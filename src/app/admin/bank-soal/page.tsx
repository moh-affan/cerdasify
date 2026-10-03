import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { questions, questionOptions, topics, categories } from '@/db/schema';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { PlusCircle, Search, Filter, BookOpen, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { desc, eq, asc } from 'drizzle-orm';

export default async function AdminBankSoalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string; difficulty?: string }>;
}) {
  const sp = await searchParams;
  const searchQuery = (sp.q || '').toLowerCase();
  const filterTopic = sp.topic || '';
  const filterDifficulty = sp.difficulty || '';

  const allTopics = db.select().from(topics).all();
  const topicMap = new Map(allTopics.map((t) => [t.id, t.name]));

  const allCategories = db.select().from(categories).all();
  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  // Fetch all questions
  const allQs = db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt))
    .all();

  // Filter in memory for responsiveness
  const filtered = allQs.filter((q) => {
    if (filterTopic && q.topicId !== filterTopic) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    if (searchQuery && !q.contentMarkdown.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

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
            Kelola {allQs.length} butir soal olimpiade, sains, dan CPNS dengan formula KaTeX
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

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <form method="GET" className="relative">
            <input
              type="text"
              name="q"
              defaultValue={sp.q || ''}
              placeholder="Cari teks soal atau kata kunci formula..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <form method="GET" className="flex items-center gap-2">
            {sp.q && <input type="hidden" name="q" value={sp.q} />}
            <select
              name="topic"
              defaultValue={filterTopic}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="">Semua Topik ({allTopics.length})</option>
              {allTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              name="difficulty"
              defaultValue={filterDifficulty}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="">Semua Tingkat</option>
              <option value="EASY">Mudah (EASY)</option>
              <option value="MEDIUM">Sedang (MEDIUM)</option>
              <option value="HARD">Sulit (HARD)</option>
              <option value="HOTS">HOTS</option>
            </select>

            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500 font-semibold px-1">
          Menampilkan {filtered.length} dari {allQs.length} soal
        </div>

        {filtered.slice(0, 50).map((q, idx) => {
          const tName = topicMap.get(q.topicId) || 'Umum';
          const opts = db
            .select()
            .from(questionOptions)
            .where(eq(questionOptions.questionId, q.id))
            .orderBy(asc(questionOptions.orderIndex))
            .all();

          const correctOpt = opts.find((o) => o.isCorrect);

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-indigo-300 transition space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {tName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 uppercase">
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {q.type === 'GRADED_SCALE' ? 'Skala TKP' : 'Pilihan Ganda'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/bank-soal/${q.id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit Soal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Question Body */}
              <div className="text-slate-900 text-sm sm:text-base leading-relaxed select-text">
                <MathRenderer content={q.contentMarkdown} />
              </div>

              {/* Options Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {opts.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                      opt.isCorrect
                        ? 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-medium'
                        : 'border-slate-100 bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <div className="flex-1 truncate">
                      <MathRenderer content={opt.contentMarkdown} />
                    </div>
                    {opt.isCorrect && (
                      <span className="text-[10px] font-bold text-emerald-700 uppercase shrink-0">
                        {q.type === 'GRADED_SCALE' ? `Poin: ${opt.scoreValue}` : 'Kunci'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation preview if present */}
              {q.explanationMarkdown && (
                <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
                  <strong className="text-slate-700 shrink-0">Pembahasan:</strong>
                  <div className="line-clamp-2 select-text">
                    <MathRenderer content={q.explanationMarkdown} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length > 50 && (
          <p className="text-center text-xs text-slate-400 py-4">
            Menampilkan 50 soal pertama. Gunakan filter topik atau pencarian untuk mempersempit daftar.
          </p>
        )}
      </div>
    </div>
  );
}
