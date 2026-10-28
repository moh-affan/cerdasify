'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteAttemptButtonProps {
  attemptId: string;
  packageTitle: string;
  isActive?: boolean; // attempt masih berjalan/dijeda
  ownerName?: string; // diisi saat staf menghapus hasil milik peserta lain
  toTrash?: boolean; // akun anak: hasil masuk sampah menunggu konfirmasi orang tua/admin
  redirectTo?: string; // tujuan setelah terhapus; default memuat ulang halaman ini
  variant?: 'icon' | 'button';
}

export function DeleteAttemptButton({
  attemptId,
  packageTitle,
  isActive = false,
  ownerName,
  toTrash = false,
  redirectTo,
  variant = 'icon',
}: DeleteAttemptButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    const what = isActive ? 'pengerjaan yang sedang berjalan' : 'hasil ujian';
    const whose = ownerName ? ` milik ${ownerName}` : '';
    const consequence = toTrash
      ? `Hasil akan dipindahkan ke sampah dan baru terhapus permanen setelah dikonfirmasi orang tua atau admin.${
          isActive ? ' Pengerjaan ini akan diakhiri dan dinilai lebih dulu.' : ''
        }`
      : 'Skor dan seluruh jawaban akan dihapus permanen.';
    if (!confirm(`Hapus ${what} "${packageTitle}"${whose}? ${consequence}`)) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/exam/attempt/${attemptId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus hasil ujian');
      if (redirectTo) router.replace(redirectTo);
      else router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus hasil ujian');
      setBusy(false);
    }
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        title="Hapus hasil ujian"
        aria-label="Hapus hasil ujian"
        className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold transition disabled:opacity-60 cursor-pointer"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">Hapus Hasil</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={handleDelete}
      title="Hapus hasil ujian"
      aria-label="Hapus hasil ujian"
      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-60 cursor-pointer"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
