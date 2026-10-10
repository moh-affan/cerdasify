'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';

export default function ContentRowActions({ id, title, isPublished }: { id: string; title: string; isPublished: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const call = async (method: 'PATCH' | 'DELETE', body?: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal');
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {busy && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      <button
        type="button"
        disabled={busy}
        onClick={() => call('PATCH', { isPublished: !isPublished })}
        title={isPublished ? 'Sembunyikan (draf)' : 'Terbitkan'}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
      >
        {isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (confirm(`Hapus "${title}"? Progres baca pengguna untuk konten ini juga akan terhapus.`)) call('DELETE');
        }}
        title="Hapus"
        className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
