import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { examPackages, categories, packageQuestions } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Package, Clock, Award, PlusCircle, CheckCircle2, Play, ExternalLink } from 'lucide-react';

export default async function AdminPackagesPage() {
  const allPkgs = db.select().from(examPackages).orderBy(desc(examPackages.createdAt)).all();
  const allCats = db.select().from(categories).all();
  const catMap = new Map(allCats.map((c) => [c.id, c.name]));

  const packagesWithStats = allPkgs.map((pkg) => {
    const qCount = db
      .select()
      .from(packageQuestions)
      .where(eq(packageQuestions.packageId, pkg.id))
      .all().length;

    return {
      ...pkg,
      categoryName: catMap.get(pkg.categoryId) || 'Umum',
      questionCount: qCount,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Manajemen Paket Ujian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola paket simulasi olimpiade dan konfigurasi passing grade ujian
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packagesWithStats.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                  {pkg.categoryName}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {pkg.durationMinutes} Menit
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {pkg.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Award className="w-4 h-4 text-indigo-500" />
                  {pkg.questionCount} Soal
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dipublikasikan
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <Link
                href={`/exam/${pkg.id}`}
                target="_blank"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Uji Coba Ujian</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
