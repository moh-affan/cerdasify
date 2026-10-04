'use client';

import React from 'react';
import { usePwa } from './PwaContext';
import { Download, Smartphone, Check } from 'lucide-react';

interface InstallButtonProps {
  variant?: 'header' | 'sidebar' | 'icon' | 'badge';
  className?: string;
}

export default function InstallButton({
  variant = 'header',
  className = '',
}: InstallButtonProps) {
  const { isInstallable, isInstalled, promptInstall, setShowModal } = usePwa();

  const handleClick = () => {
    if (isInstalled) {
      setShowModal(true);
      return;
    }
    if (isInstallable) {
      promptInstall();
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition active:scale-98 ${
          isInstalled
            ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-950/50'
            : 'text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 hover:bg-indigo-900/50 hover:text-white'
        } ${className}`}
      >
        {isInstalled ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Aplikasi Terpasang</span>
          </>
        ) : (
          <>
            <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">Pasang di Android</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={isInstalled ? 'Aplikasi Cerdasify Terpasang' : 'Pasang Aplikasi di HP'}
        className={`p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95 ${className}`}
        aria-label="Pasang Aplikasi"
      >
        {isInstalled ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Smartphone className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
          isInstalled
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
        } ${className}`}
      >
        {isInstalled ? (
          <>
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Terpasang</span>
          </>
        ) : (
          <>
            <Download className="w-3 h-3 text-indigo-600" />
            <span>Pasang App</span>
          </>
        )}
      </button>
    );
  }

  // Default: 'header' button
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
        isInstalled
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800'
      } ${className}`}
    >
      {isInstalled ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">App Terpasang</span>
          <span className="sm:hidden">Terpasang</span>
        </>
      ) : (
        <>
          <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">Pasang di Android</span>
          <span className="sm:hidden">Pasang App</span>
        </>
      )}
    </button>
  );
}
