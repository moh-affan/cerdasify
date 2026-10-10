'use client';

import React from 'react';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { Check } from 'lucide-react';

interface OptionItemProps {
  label: string; // A, B, C, D, E
  content: string;
  imageUrl?: string | null;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  label,
  content,
  imageUrl,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full min-h-[52px] p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 group select-none active:scale-[0.99] cursor-pointer ${
        isSelected
          ? 'bg-indigo-50/70 border-indigo-600 shadow-sm shadow-indigo-100 ring-2 ring-indigo-600/20'
          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
          isSelected
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : label}
      </div>

      <div className="flex-1 text-slate-800 text-sm sm:text-base leading-relaxed pt-0.5">
        <MathRenderer content={content} />
        {imageUrl && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- gambar soal dari URL unggahan dinamis */}
            <img src={imageUrl} alt={`Opsi ${label}`} className="max-h-48 rounded-lg border border-slate-200" />
          </div>
        )}
      </div>
    </button>
  );
};
