'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, KeyRound, Check } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/learning';

async function send(url: string, method: string, body: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
  return data;
}

const inputCls =
  'w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition';

export function AddChildForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', password: '', gradeLevel: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await send('/api/parent/children', 'POST', {
        name: form.name,
        username: form.username,
        password: form.password,
        gradeLevel: form.gradeLevel ? Number(form.gradeLevel) : null,
      });
      setForm({ name: '', username: '', password: '', gradeLevel: '' });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        Tambah Akun Anak
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl border border-indigo-200 p-5 space-y-3 shadow-xs">
      <h3 className="font-bold text-slate-900">Akun Anak Baru</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          required
          placeholder="Nama panggilan anak"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputCls}
        />
        <input
          required
          placeholder="Username (huruf kecil, mis. aisyah)"
          value={form.username}
          autoCapitalize="none"
          onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          className={inputCls}
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Password (min. 6 karakter)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputCls}
        />
        <select
          value={form.gradeLevel}
          onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
          className={inputCls}
        >
          <option value="">Pilih kelas</option>
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Simpan
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export function ChildSettings({ childId, gradeLevel }: { childId: string; gradeLevel: number | null }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const update = async (body: Record<string, unknown>, okMsg: string) => {
    setSaving(true);
    setStatus(null);
    try {
      await send(`/api/parent/children/${childId}`, 'PATCH', body);
      setStatus({ ok: true, msg: okMsg });
      router.refresh();
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
      <select
        value={gradeLevel ?? ''}
        disabled={saving}
        onChange={(e) => update({ gradeLevel: Number(e.target.value) }, 'Kelas diperbarui')}
        className="py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
        aria-label="Kelas anak"
      >
        <option value="" disabled>
          Pilih kelas
        </option>
        {GRADE_OPTIONS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          update({ password }, 'Password diganti').then(() => setPassword(''));
        }}
      >
        <input
          type="password"
          minLength={6}
          required
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 sm:w-36 py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-white font-semibold disabled:opacity-60"
        >
          <KeyRound className="w-3.5 h-3.5" />
          Ganti
        </button>
      </form>
      {status && (
        <span className={status.ok ? 'text-emerald-700 inline-flex items-center gap-1' : 'text-rose-600'}>
          {status.ok && <Check className="w-3.5 h-3.5" />}
          {status.msg}
        </span>
      )}
    </div>
  );
}
