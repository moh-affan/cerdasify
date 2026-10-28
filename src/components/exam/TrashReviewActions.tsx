'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RotateCcw, Trash2 } from 'lucide-react';

interface TrashReviewActionsProps {
  // Orang tua: /api/parent/attempts/[id]; admin: /api/exam/attempt/[id]
  endpoint: string;
  packageTitle: string;
  ownerName: string;
  redirectAfterConfirm?: string; // dipakai di halaman yang ikut hilang setelah hapus permanen
}

// Tombol meninjau hasil ujian di sampah: setujui hapus permanen, atau pulihkan.
export function TrashReviewActions({ endpoint, packageTitle, ownerName, redirectAfterConfirm }: TrashReviewActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<'confirm' | 'restore' | null>(null);

  const call = async (kind: 'confirm' | 'restore') => {
    const question =
      kind === 'confirm'
        ? `Setujui penghapusan hasil "${packageTitle}" milik ${ownerName}? Skor dan jawaban dihapus permanen.`
        : `Pulihkan hasil "${packageTitle}" milik ${ownerName}? Hasil akan tampil lagi di riwayat ujiannya.`;
    if (!confirm(question)) return;

    setBusy(kind);
    try {
      const res = await fetch(endpoint, {
        method: kind === 'confirm' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'restore' ? JSON.stringify({ action: 'restore' }) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal memproses permintaan');
      if (kind === 'confirm' && redirectAfterConfirm) router.replace(redirectAfterConfirm);
      else router.refresh();
      setBusy(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal memproses permintaan');
      setBusy(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => call('restore')}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-60 cursor-pointer"
      >
        {busy === 'restore' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        <span>Pulihkan</span>
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => call('confirm')}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition disabled:opacity-60 cursor-pointer"
      >
        {busy === 'confirm' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        <span>Hapus Permanen</span>
      </button>
    </div>
  );
}
