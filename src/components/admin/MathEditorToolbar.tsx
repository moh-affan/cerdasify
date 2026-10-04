'use client';

import React from 'react';
import { MathRenderer } from '@/components/katex/MathRenderer';

interface MathEditorToolbarProps {
  onInsert: (snippet: string) => void;
  previewContent?: string;
  showPreview?: boolean;
}

const TOOLBAR_GROUPS = [
  {
    name: 'Dasar',
    items: [
      { label: 'Pecahan', snippet: '$\\frac{a}{b}$', desc: 'Pecahan a/b' },
      { label: 'Akar', snippet: '$\\sqrt{x}$', desc: 'Akar kuadrat' },
      { label: 'Akar-n', snippet: '$\\sqrt[n]{x}$', desc: 'Akar derajat n' },
      { label: 'Pangkat', snippet: '$x^{2}$', desc: 'Pangkat' },
      { label: 'Subskrip', snippet: '$x_{1}$', desc: 'Indeks bawah' },
      { label: 'Kali', snippet: '$\\times$', desc: 'Tanda silang kali' },
      { label: 'Bagi', snippet: '$\\div$', desc: 'Tanda bagi' },
      { label: 'Plus-Minus', snippet: '$\\pm$', desc: 'Tanda plus minus' },
    ],
  },
  {
    name: 'Olimpiade',
    items: [
      { label: '☐ Kotak', snippet: '$\\square$', desc: 'Kotak kosong' },
      { label: '▲ Segitiga', snippet: '$\\blacktriangle$', desc: 'Segitiga' },
      { label: '● Bulat', snippet: '$\\bullet$', desc: 'Titik bulat' },
      { label: '■ Kotak Isi', snippet: '$\\blacksquare$', desc: 'Kotak hitam' },
      { label: '⊗ Kali Lingkar', snippet: '$\\otimes$', desc: 'Operator kali' },
      { label: '⊕ Tambah Lingkar', snippet: '$\\oplus$', desc: 'Operator tambah' },
      { label: '★ Bintang', snippet: '$\\star$', desc: 'Bintang' },
    ],
  },
  {
    name: 'Lanjutan & Sains',
    items: [
      { label: 'Persamaan Bercabang', snippet: '$\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}$', desc: 'Sistem cases' },
      { label: 'Matriks 2x2', snippet: '$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$', desc: 'Matriks' },
      { label: 'Sigma', snippet: '$\\sum_{i=1}^{n} i$', desc: 'Deret jumlah' },
      { label: 'Limit', snippet: '$\\lim_{x \\to 0} \\frac{\\sin x}{x}$', desc: 'Limit fungsi' },
      { label: 'π Pi', snippet: '$\\pi$', desc: 'Simbol Pi' },
      { label: 'θ Theta', snippet: '$\\theta$', desc: 'Sudut Theta' },
      { label: 'α Alpha', snippet: '$\\alpha$', desc: 'Alpha' },
      { label: 'β Beta', snippet: '$\\beta$', desc: 'Beta' },
      { label: 'Δ Delta', snippet: '$\\Delta$', desc: 'Delta' },
    ],
  },
  {
    name: 'Stimulus & Cerita',
    items: [
      {
        label: '📖 Kotak Cerita / Bacaan',
        snippet: ':::passage[Teks Bacaan (Soal No. 1 – 5)]\nTuliskan isi teks cerita / narasi di sini...\n:::\n\n',
        desc: 'Sisipkan stimulus teks cerita/bacaan untuk soal',
      },
      {
        label: '💬 Dialog Percakapan',
        snippet: ':::passage[Dialog Soal]\n**Tokoh A :** “Teks ucapan...”\n**Tokoh B :** “Teks balasan...”\n:::\n\n',
        desc: 'Sisipkan stimulus percakapan atau wawancara',
      },
    ],
  },
];

export const MathEditorToolbar: React.FC<MathEditorToolbarProps> = ({
  onInsert,
  previewContent,
  showPreview = true,
}) => {
  return (
    <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 mr-1">Sisipkan Formula:</span>
        {TOOLBAR_GROUPS.map((group) => (
          <div key={group.name} className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1">{group.name}</span>
            {group.items.map((item) => (
              <button
                key={item.label}
                type="button"
                title={item.desc}
                onClick={() => onInsert(item.snippet)}
                className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded transition border border-transparent hover:border-indigo-200 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {showPreview && previewContent !== undefined && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Pratinjau Langsung (Live Preview)</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">KaTeX Rendered</span>
          </div>
          <div className="min-h-[40px] text-slate-900 text-sm">
            {previewContent.trim() ? (
              <MathRenderer content={previewContent} />
            ) : (
              <span className="text-slate-400 italic text-xs">Ketik soal atau klik tombol toolbar di atas untuk melihat formula...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
