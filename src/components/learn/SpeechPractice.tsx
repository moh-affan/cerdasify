'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Minus, Plus, RotateCcw } from 'lucide-react';
import type { ContentSegment } from '@/lib/learning';
import { formatDuration } from '@/lib/utils';

/** Mode latihan pidato: teks besar yang bergulir otomatis (teleprompter) + stopwatch. */
export default function SpeechPractice({ segments, onClose }: { segments: ContentSegment[]; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(3); // 1–8
  const [fontSize, setFontSize] = useState(28);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let carry = 0;
    const tick = (now: number) => {
      const el = scrollRef.current;
      if (el) {
        carry += ((now - last) / 1000) * speed * 12;
        const whole = Math.floor(carry);
        if (whole > 0) {
          el.scrollTop += whole;
          carry -= whole;
        }
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) setRunning(false);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, [running, speed]);

  const restart = () => {
    setRunning(false);
    setElapsed(0);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Jeda' : 'Mulai'}
        </button>
        <button type="button" onClick={restart} className="p-2 rounded-xl bg-white/10" aria-label="Ulangi dari awal">
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="font-mono text-lg tabular-nums px-2">{formatDuration(elapsed)}</span>
        <div className="flex items-center gap-1 text-xs ml-auto">
          <span className="text-white/60">Kecepatan</span>
          <button type="button" onClick={() => setSpeed((v) => Math.max(1, v - 1))} className="p-1.5 rounded-lg bg-white/10" aria-label="Lebih lambat">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-4 text-center font-bold">{speed}</span>
          <button type="button" onClick={() => setSpeed((v) => Math.min(8, v + 1))} className="p-1.5 rounded-lg bg-white/10" aria-label="Lebih cepat">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <span className="text-white/60 ml-2">Huruf</span>
          <button type="button" onClick={() => setFontSize((v) => Math.max(18, v - 4))} className="p-1.5 rounded-lg bg-white/10" aria-label="Perkecil huruf">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setFontSize((v) => Math.min(48, v + 4))} className="p-1.5 rounded-lg bg-white/10" aria-label="Perbesar huruf">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-xl bg-white/10" aria-label="Tutup">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 sm:px-12">
        <div className="max-w-3xl mx-auto py-[40vh] space-y-6 leading-relaxed" style={{ fontSize }}>
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              {seg.h && <p className="text-emerald-300 font-bold uppercase tracking-widest text-[0.5em] pt-6">{seg.h}</p>}
              <p>{seg.tx ?? seg.en}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
