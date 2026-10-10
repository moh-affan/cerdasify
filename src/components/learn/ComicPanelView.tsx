'use client';

import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { ComicBackground, ComicPanel } from '@/lib/learning';
import { cn } from '@/lib/utils';

const BG: Record<ComicBackground, string> = {
  sky: 'from-sky-200 via-sky-100 to-white',
  grass: 'from-sky-100 via-emerald-50 to-emerald-200',
  room: 'from-amber-50 via-orange-50 to-amber-100',
  school: 'from-yellow-50 via-white to-emerald-100',
  night: 'from-indigo-950 via-indigo-900 to-slate-800',
  sunset: 'from-orange-300 via-rose-200 to-amber-100',
  sea: 'from-sky-200 via-cyan-100 to-blue-300',
  plain: 'from-slate-50 to-white',
};

/** Pecah adegan menjadi grafem (emoji gabungan ZWJ seperti 👨‍👩‍👧 tetap utuh). */
function splitEmoji(scene: string): string[] {
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return [...seg.segment(scene)].map((x) => x.segment).filter((x) => x.trim());
}

/** Ukuran emoji menyesuaikan jumlahnya agar adegan selalu muat satu baris di layar 360px. */
function sceneSize(count: number): string {
  if (count <= 3) return 'text-6xl sm:text-7xl';
  if (count === 4) return 'text-5xl sm:text-7xl';
  if (count === 5) return 'text-4xl sm:text-6xl';
  return 'text-3xl sm:text-5xl';
}

interface Props {
  panel: ComicPanel;
  index: number;
  isSpeaking?: boolean;
}

export default function ComicPanelView({ panel, index, isSpeaking }: Props) {
  const [zoom, setZoom] = useState(false);
  const bg = panel.bg ?? 'plain';
  const dark = bg === 'night';

  return (
    <figure
      className={cn(
        'rounded-3xl border-[3px] border-slate-900 overflow-hidden bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition',
        isSpeaking && 'ring-4 ring-yellow-300'
      )}
    >
      {panel.caption && (
        <figcaption className="bg-yellow-200 border-b-[3px] border-slate-900 px-4 py-2 text-sm sm:text-base font-semibold text-slate-900">
          <span className="text-[10px] font-black mr-2 text-slate-500">#{index + 1}</span>
          {panel.caption}
        </figcaption>
      )}

      {panel.img ? (
        <button type="button" onClick={() => setZoom(true)} className="relative block w-full group" aria-label="Perbesar gambar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={panel.img} alt={panel.caption || `Panel ${index + 1}`} loading="lazy" className="w-full h-auto block" />
          <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-80 group-hover:opacity-100">
            <ZoomIn className="w-4 h-4" />
          </span>
        </button>
      ) : (
        panel.scene && (
          <div
            className={cn(
              'bg-gradient-to-b flex flex-nowrap items-end justify-center gap-2 sm:gap-4 px-3 py-7 sm:py-10 leading-none select-none',
              sceneSize(splitEmoji(panel.scene).length),
              BG[bg]
            )}
            aria-hidden="true"
          >
            {splitEmoji(panel.scene).map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        )
      )}

      {panel.bubbles && panel.bubbles.length > 0 && (
        <div className={cn('p-3 sm:p-4 space-y-2.5', dark ? 'bg-slate-900' : 'bg-white')}>
          {panel.bubbles.map((b, i) => {
            const right = b.side === 'right';
            return (
              <div key={i} className={cn('flex', right ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[85%]">
                  <div className={cn('text-[11px] font-bold mb-0.5', right ? 'text-right' : '', dark ? 'text-slate-300' : 'text-slate-500')}>
                    {b.who}
                  </div>
                  <div
                    className={cn(
                      'relative px-3.5 py-2 text-sm sm:text-base text-slate-900 border-2 border-slate-900',
                      b.tone === 'think' ? 'rounded-[1.5rem] border-dashed bg-slate-50 italic' : 'rounded-2xl bg-white',
                      b.tone === 'shout' && 'font-black uppercase tracking-wide bg-yellow-100',
                      right ? 'rounded-tr-sm' : 'rounded-tl-sm'
                    )}
                  >
                    {b.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {zoom && panel.img && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3" onClick={() => setZoom(false)}>
          <button
            type="button"
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/15 text-white"
            onClick={() => setZoom(false)}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={panel.img} alt={panel.caption || ''} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </figure>
  );
}
