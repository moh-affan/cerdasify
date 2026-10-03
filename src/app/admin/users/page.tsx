import React from 'react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';
import { Users, Shield, User, GraduationCap, CheckCircle2, XCircle, PlusCircle } from 'lucide-react';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const allUsers = db.select().from(users).orderBy(desc(users.createdAt)).all();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Manajemen Pengguna & RBAC
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola hak akses Super Admin, Admin/Pengajar, dan akun Peserta Ujian
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total {allUsers.length} Pengguna Terdaftar
          </span>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
            Sistem Tertutup (Closed RBAC)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 pl-4">Nama Lengkap</th>
                <th className="py-3">Username</th>
                <th className="py-3">Role Akses</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-4">Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((u) => {
                let roleBadge = 'bg-slate-100 text-slate-700';
                let RoleIcon = User;

                if (u.role === 'SUPER_ADMIN') {
                  roleBadge = 'bg-amber-100 text-amber-900 font-bold';
                  RoleIcon = Shield;
                } else if (u.role === 'ADMIN') {
                  roleBadge = 'bg-indigo-100 text-indigo-900 font-bold';
                  RoleIcon = GraduationCap;
                }

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 pl-4 font-bold text-slate-800">{u.name}</td>
                    <td className="py-3 font-mono text-slate-600">@{u.username}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] ${roleBadge}`}>
                        <RoleIcon className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
