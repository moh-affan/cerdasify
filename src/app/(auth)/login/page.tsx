'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, User, GraduationCap, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { CerdasifyIcon } from '@/components/ui/CerdasifyLogo';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const u = customUser || username;
    const p = customPass || password;

    if (!u || !p) {
      setError('Masukkan username dan kata sandi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    handleLogin(undefined, u, p);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 selection:bg-indigo-500">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <CerdasifyIcon size={56} className="shadow-2xl shadow-indigo-500/30 rounded-2xl" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Cerdasify</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Platform Simulasi Ujian & Bank Soal Matematika, Sains & CPNS
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Masuk ke Akun</h2>
            <p className="text-xs text-slate-400">Gunakan akun yang telah didaftarkan oleh administrator</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / ID Peserta
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: peserta_budi atau superadmin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Akses Cepat (Demo Akun):
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin', 'SuperPassword123!')}
                className="w-full py-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between border border-slate-600/40 transition"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Super Admin
                </span>
                <span className="text-[10px] text-slate-400 font-mono">superadmin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guru_olimpiade', 'GuruPassword123!')}
                className="w-full py-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between border border-slate-600/40 transition"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  Admin / Pembina Olimpiade
                </span>
                <span className="text-[10px] text-slate-400 font-mono">guru_olimpiade</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('peserta_budi', 'Peserta123!')}
                className="w-full py-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between border border-slate-600/40 transition"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Peserta / Siswa Ujian
                </span>
                <span className="text-[10px] text-slate-400 font-mono">peserta_budi</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Cerdasify Engine v1.0 • High-Speed SQLite WAL Mode
        </p>
      </div>
    </div>
  );
}
