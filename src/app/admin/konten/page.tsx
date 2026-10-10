import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { learningContents, subjects } from '@/db/schema';
import { CONTENT_TYPE_LABEL, PHASES, PHASE_INFO, contentMatchesPhase, isPhase } from '@/lib/learning';
import { asc } from 'drizzle-orm';
import { Library, Plus, Search, Pencil, ExternalLink } from 'lucide-react';
import ContentRowActions from './ContentRowActions';

export default async function AdminContentListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mapel?: string; jenis?: string; fase?: string }>;
}) {
  const sp = await searchParams;
  const [allSubjects, rows] = await Promise.all([
    db.select().from(subjects).orderBy(asc(subjects.orderIndex)),
    db
      .select({
        id: learningContents.id,
        slug: learningContents.slug,
        title: learningContents.title,
        type: learningContents.type,
        subjectId: learningContents.subjectId,
        phaseMin: learningContents.phaseMin,
        phaseMax: learningContents.phaseMax,
        theme: learningContents.theme,
        coverEmoji: learningContents.coverEmoji,
        isPublished: learningContents.isPublished,
        editedAt: learningContents.editedAt,
      })
      .from(learningContents)
      .orderBy(asc(learningContents.orderIndex), asc(learningContents.title)),
  ]);

  const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));
  const q = (sp.q || '').trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q) && !(r.theme ?? '').toLowerCase().includes(q) && !r.slug.includes(q)) return false;
    if (sp.mapel && r.subjectId !== sp.mapel) return false;
    if (sp.jenis && r.type !== sp.jenis) return false;
    if (isPhase(sp.fase) && !contentMatchesPhase(sp.fase, r.phaseMin, r.phaseMax)) return false;
    return true;
  });

  const selectCls =
    'py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-600" />
            Pustaka Belajar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {rows.length} konten · bacaan, cerita, ensiklopedia, komik, pidato, dan materi pelajaran
          </p>
        </div>
        <Link
          href="/admin/konten/baru"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          Konten Baru
        </Link>
      </div>

      <form method="GET" className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Cari judul, tema, atau slug…"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>
        <select name="mapel" defaultValue={sp.mapel ?? ''} className={selectCls}>
          <option value="">Semua mapel</option>
          {allSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>
        <select name="jenis" defaultValue={sp.jenis ?? ''} className={selectCls}>
          <option value="">Semua jenis</option>
          {Object.entries(CONTENT_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select name="fase" defaultValue={sp.fase ?? ''} className={selectCls}>
          <option value="">Semua fase</option>
          {PHASES.map((p) => (
            <option key={p} value={p}>
              {PHASE_INFO[p].label} ({PHASE_INFO[p].grades})
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
          Terapkan
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Tidak ada konten yang cocok.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const subject = subjectMap.get(r.subjectId);
              return (
                <li key={r.id} className="p-3 sm:px-4 flex items-center gap-3 hover:bg-slate-50/70">
                  <span className="text-2xl w-9 text-center shrink-0">{r.coverEmoji || subject?.icon || '📖'}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/konten/${r.id}`} className="font-semibold text-sm text-slate-900 hover:text-indigo-700 truncate block">
                      {r.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">{CONTENT_TYPE_LABEL[r.type]}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {subject?.icon} {subject?.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Fase {r.phaseMin}
                        {r.phaseMax !== r.phaseMin && `–${r.phaseMax}`}
                      </span>
                      {r.theme && <span className="text-slate-400">{r.theme}</span>}
                      {!r.isPublished && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">DRAF</span>}
                      {r.editedAt && <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">diedit</span>}
                    </div>
                  </div>
                  <Link href={`/belajar/${r.slug}`} target="_blank" title="Lihat" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/konten/${r.id}`} title="Edit" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <ContentRowActions id={r.id} title={r.title} isPublished={r.isPublished} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
