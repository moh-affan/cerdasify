'use client';

import React, { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Gambar yang bisa diketuk untuk dibuka di Lightbox layar penuh (diagram/geometri di smartphone). */
export default function ZoomableImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="relative inline-block group cursor-zoom-in" aria-label={`Perbesar: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- sumber gambar dinamis (upload/Supabase) */}
        <img src={src} alt={alt} loading="lazy" className={className} />
        <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/55 text-white opacity-80 group-hover:opacity-100">
          <ZoomIn className="w-4 h-4" />
        </span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3"
          onClick={() => setOpen(false)}
        >
          <button type="button" className="absolute top-3 right-3 p-2 rounded-xl bg-white/15 text-white" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- sumber gambar dinamis (upload/Supabase) */}
          <img src={src} alt={alt} className={cn('max-w-full max-h-full object-contain bg-white rounded-lg')} />
        </div>
      )}
    </>
  );
}
