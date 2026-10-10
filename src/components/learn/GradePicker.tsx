'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, GraduationCap } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/learning';

export default function GradePicker({ currentGrade }: { currentGrade: number | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (gradeLevel: number) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/learn/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradeLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan kelas');
      router.push('/belajar');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan kelas');
    } finally {
      setSaving(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4 text-indigo-600" />}
      <span>Kelasku:</span>
      <select
        value={currentGrade ?? ''}
        disabled={saving}
        onChange={(e) => save(Number(e.target.value))}
        className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
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
      {error && <span className="text-rose-600">{error}</span>}
    </label>
  );
}
