import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import CerdasifyLogo from '@/components/ui/CerdasifyLogo';
import InstallButton from '@/components/pwa/InstallButton';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  UploadCloud,
  Users,
  Home,
  LogOut,
  Library,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const navLinks = [
    { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
    { label: 'Bank Soal', href: '/admin/bank-soal', icon: BookOpen },
    { label: 'Paket Ujian', href: '/admin/packages', icon: Package },
    { label: 'Impor Massal', href: '/admin/import', icon: UploadCloud },
    { label: 'Pustaka Belajar', href: '/admin/konten', icon: Library },
    { label: 'Pengguna & RBAC', href: '/admin/users', icon: Users, superAdminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 selection:bg-indigo-100">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between p-4 md:p-6 md:sticky md:top-0 md:h-screen">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <CerdasifyLogo
            textColor="text-white"
            subtitle="Control Panel"
          />

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              if (item.superAdminOnly && user.role !== 'SUPER_ADMIN') {
                return null;
              }
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-98"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2">
            <InstallButton variant="sidebar" />
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3 mt-4">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-300">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">
                Role: <span className="text-amber-400 font-mono">{user.role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>

            <a
              href="/api/auth/logout"
              title="Keluar"
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
