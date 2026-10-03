import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { questions, examPackages, users, attempts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import {
  BookOpen,
  Package,
  Users,
  Award,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

export default async function AdminDashboardOverviewPage() {
  const user = await getCurrentUser();

  const totalQuestions = db.select().from(questions).all().length;
  const totalPackages = db.select().from(examPackages).all().length;
  const totalUsers = db.select().from(users).all().length;
  const totalAttempts = db.select().from(attempts).all().length;

  const recentAttempts = db
    .select({
      id: attempts.id,
      userId: attempts.userId,
      packageId: attempts.packageId,
      scoreTotal: attempts.scoreTotal,
      isPassed: attempts.isPassed,
      status: attempts.status,
      startedAt: attempts.startedAt,
      finishedAt: attempts.finishedAt,
    })
    .from(attempts)
    .orderBy(desc(attempts.startedAt))
    .limit(10)
    .all();

  const allUsers = db.select().from(users).all();
  const userMap = new Map(allUsers.map((u) => [u.id, u.name]));

  const allPkgs = db.select().from(examPackages).all();
  const pkgMap = new Map(allPkgs.map((p) => [p.id, p.title]));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Kontrol Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Selamat datang, <strong className="text-slate-800">{user?.name}</strong>. Pantau metrik dan bank soal sistem di sini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bank-soal/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Soal</span>
          </Link>

          <Link
            href="/admin/import"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Impor Data</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bank Soal</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalQuestions}</div>
          <p className="text-[11px] text-slate-400">Butir soal terdaftar</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paket Ujian</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalPackages}</div>
          <p className="text-[11px] text-slate-400">Paket simulasi aktif</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Ujian</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalAttempts}</div>
          <p className="text-[11px] text-slate-400">Sesi ujian disubmit</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pengguna</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalUsers}</div>
          <p className="text-[11px] text-slate-400">Peserta & Admin terdaftar</p>
        </div>
      </div>

      {/* Recent Attempts Activity */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Aktivitas Pengerjaan Ujian Terbaru
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Sesi pengerjaan terkini oleh peserta</p>
          </div>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Belum ada aktivitas pengerjaan ujian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Peserta</th>
                  <th className="pb-3">Paket Ujian</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Skor</th>
                  <th className="pb-3">Hasil</th>
                  <th className="pb-3 pr-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttempts.map((att) => {
                  const studentName = userMap.get(att.userId) || 'Peserta';
                  const pkgName = pkgMap.get(att.packageId) || 'Paket Ujian';
                  const isDone = att.status === 'COMPLETED';

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 pl-2 font-bold text-slate-800">{studentName}</td>
                      <td className="py-3 text-slate-600">{pkgName}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-extrabold text-slate-800">
                        {isDone ? att.scoreTotal : '-'}
                      </td>
                      <td className="py-3">
                        {isDone ? (
                          att.isPassed ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Lulus
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold">Tidak Lulus</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">Sedang berjalan</span>
                        )}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {isDone && (
                          <Link
                            href={`/results/${att.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs inline-flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
