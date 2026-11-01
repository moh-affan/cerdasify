import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { gameProgress, gameSets, subjects } from '@/db/schema';
import { PHASES, PHASE_INFO, contentMatchesPhase, isPhase } from '@/lib/learning';
import { ENGINE_INFO, GAME_ENGINES } from '@/lib/games/types';
import { asc, sql } from 'drizzle-orm';
import { Gamepad2, Plus, Search, Pencil, ExternalLink, Terminal } from 'lucide-react';
import GameRowActions from './GameRowActions';

export default async function AdminGameListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jenis?: string; fase?: string; mapel?: string }>;
}) {
  const sp = await searchParams;
  const [allSubjects, rows, plays] = await Promise.all([
    db.select().from(subjects).orderBy(asc(subjects.orderIndex)),
    db
      .select({
        id: gameSets.id,
        slug: gameSets.slug,
        title: gameSets.title,
        engine: gameSets.engine,
        subjectId: gameSets.subjectId,
        phaseMin: gameSets.phaseMin,
        phaseMax: gameSets.phaseMax,
        coverEmoji: gameSets.coverEmoji,
        isPublished: gameSets.isPublished,
        editedAt: gameSets.editedAt,
      })
      .from(gameSets)
      .orderBy(asc(gameSets.orderIndex), asc(gameSets.title)),
    db
      .select({ gameSetId: gameProgress.gameSetId, players: sql<number>`count(*)::int`, plays: sql<number>`sum(${gameProgress.plays})::int` })
      .from(gameProgress)
      .groupBy(gameProgress.gameSetId),
  ]);

  const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));
  const playMap = new Map(plays.map((p) => [p.gameSetId, p]));
  const q = (sp.q || '').trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q) && !r.slug.includes(q)) return false;
    if (sp.jenis && r.engine !== sp.jenis) return false;
    if (sp.mapel && r.subjectId !== sp.mapel) return false;
    if (isPhase(sp.fase) && !contentMatchesPhase(sp.fase, r.phaseMin, r.phaseMax)) return false;
    return true;
  });
  const editedCount = rows.filter((r) => r.editedAt).length;

  const selectCls =
    'py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-emerald-600" />
            Game Edukasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {rows.length} set game · Kilat Hitung, Kartu Kembar, Silang Angka, TTS Kata, Kosakata Bergambar
          </p>
        </div>
        <Link
          href="/admin/game/baru"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          Set Game Baru
        </Link>
      </div>

      {editedCount > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 flex gap-2">
          <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {editedCount} set dibuat/diubah lewat panel admin. Jalankan <code className="font-mono font-bold">npm run games:export</code> lalu commit
            agar perubahan ikut tersimpan di repo dan tidak hilang saat seeding ulang.
          </p>
        </div>
      )}

      <form method="GET" className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Cari judul atau slug…"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>
        <select name="jenis" defaultValue={sp.jenis ?? ''} className={selectCls}>
          <option value="">Semua jenis</option>
          {GAME_ENGINES.map((e) => (
            <option key={e} value={e}>
              {ENGINE_INFO[e].emoji} {ENGINE_INFO[e].label}
            </option>
          ))}
        </select>
        <select name="mapel" defaultValue={sp.mapel ?? ''} className={selectCls}>
          <option value="">Semua mapel</option>
          {allSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
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
          <p className="p-8 text-center text-sm text-slate-500">Tidak ada set game yang cocok.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const subject = subjectMap.get(r.subjectId);
              const p = playMap.get(r.id);
              return (
                <li key={r.id} className="p-3 sm:px-4 flex items-center gap-3 hover:bg-slate-50/70">
                  <span className="text-2xl w-9 text-center shrink-0">{r.coverEmoji || ENGINE_INFO[r.engine].emoji}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/game/${r.id}`} className="font-semibold text-sm text-slate-900 hover:text-indigo-700 truncate block">
                      {r.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {ENGINE_INFO[r.engine].emoji} {ENGINE_INFO[r.engine].label}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {subject?.icon} {subject?.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Fase {r.phaseMin}
                        {r.phaseMax !== r.phaseMin && `–${r.phaseMax}`}
                      </span>
                      <span className="text-slate-400">
                        {p ? `${p.players} pemain · ${p.plays}× dimainkan` : 'belum dimainkan'}
                      </span>
                      {!r.isPublished && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">DRAF</span>}
                      {r.editedAt && <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">diedit</span>}
                    </div>
                  </div>
                  <Link href={`/bermain/${r.slug}`} target="_blank" title="Coba main" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/game/${r.id}`} title="Edit" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <GameRowActions id={r.id} title={r.title} isPublished={r.isPublished} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
