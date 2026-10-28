'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eraser, Maximize2, Minimize2, Pencil, Trash2, Undo2, X } from 'lucide-react';

// Kertas coretan untuk berhitung. Hanya di browser: tidak dikirim ke server & tidak dinilai.
// Coretan disimpan per soal (selama halaman terbuka) sebagai vektor agar bisa di-undo & digambar ulang saat ukuran berubah.

interface Stroke {
  tool: 'pen' | 'eraser';
  color: string;
  width: number;
  points: number[]; // x0, y0, x1, y1, ... dalam piksel CSS
}

interface ScratchPadProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string; // id soal
  pageLabel: string;
}

const PEN_COLORS = ['#0f172a', '#2563eb', '#dc2626'];
const PEN_WIDTH = 2.5;
const ERASER_WIDTH = 24;

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, fromPoint = 0) {
  const p = s.points;
  ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const start = Math.max(0, fromPoint - 2);
  ctx.moveTo(p[start], p[start + 1]);
  if (p.length === 2) ctx.lineTo(p[0] + 0.01, p[1]); // ketukan tunggal → titik
  for (let i = start + 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
  ctx.stroke();
}

export const ScratchPad: React.FC<ScratchPadProps> = ({ isOpen, onClose, pageKey, pageLabel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pagesRef = useRef(new Map<string, Stroke[]>());
  const activeStrokeRef = useRef<Stroke | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const strokesFor = useCallback((key: string) => {
    let list = pagesRef.current.get(key);
    if (!list) {
      list = [];
      pagesRef.current.set(key, list);
    }
    return list;
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    const strokes = strokesFor(pageKey);
    for (const s of strokes) drawStroke(ctx, s);
    setStrokeCount(strokes.length);
  }, [pageKey, strokesFor]);

  // Sesuaikan resolusi kanvas dengan ukuran tampil (tajam di layar HiDPI), lalu gambar ulang
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  // Ganti soal → tampilkan coretan milik soal tersebut
  useEffect(() => {
    redraw();
  }, [redraw]);

  const pointFrom = (e: React.PointerEvent | PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      tool,
      color,
      width: tool === 'eraser' ? ERASER_WIDTH : PEN_WIDTH,
      points: pointFrom(e),
    };
    strokesFor(pageKey).push(stroke);
    activeStrokeRef.current = stroke;
    drawStroke(ctx, stroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = activeStrokeRef.current;
    const ctx = e.currentTarget.getContext('2d');
    if (!stroke || !ctx) return;
    const from = stroke.points.length;
    // Event gabungan membuat garis lebih halus pada stylus/layar sentuh cepat
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const ev of events.length > 0 ? events : [e.nativeEvent]) stroke.points.push(...pointFrom(ev));
    drawStroke(ctx, stroke, from);
  };

  const handlePointerUp = () => {
    if (!activeStrokeRef.current) return;
    activeStrokeRef.current = null;
    setStrokeCount(strokesFor(pageKey).length);
  };

  const handleUndo = () => {
    strokesFor(pageKey).pop();
    redraw();
  };

  const handleClear = () => {
    pagesRef.current.set(pageKey, []);
    redraw();
  };

  const toolBtn = (active: boolean) =>
    `w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
      active ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
    }`;

  return (
    <div
      className={`${isOpen ? 'flex' : 'hidden'} fixed z-40 flex-col bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden inset-x-2 bottom-[72px] h-[48vh] lg:inset-x-auto lg:right-6 lg:bottom-6 ${
        isExpanded ? 'lg:w-[min(960px,calc(100vw-3rem))] lg:h-[75vh]' : 'lg:w-[460px] lg:h-[420px]'
      }`}
      role="dialog"
      aria-label="Kertas coretan"
    >
      <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-slate-200 bg-slate-50">
        <button type="button" title="Pena" onClick={() => setTool('pen')} className={toolBtn(tool === 'pen')}>
          <Pencil className="w-4 h-4" />
        </button>
        {PEN_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title="Warna pena"
            onClick={() => {
              setColor(c);
              setTool('pen');
            }}
            className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
              tool === 'pen' && color === c ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-white shadow-sm'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button type="button" title="Penghapus" onClick={() => setTool('eraser')} className={toolBtn(tool === 'eraser')}>
          <Eraser className="w-4 h-4" />
        </button>
        <span className="w-px h-6 bg-slate-200 mx-0.5" />
        <button
          type="button"
          title="Batalkan coretan terakhir"
          onClick={handleUndo}
          disabled={strokeCount === 0}
          className={`${toolBtn(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Hapus semua coretan soal ini"
          onClick={handleClear}
          disabled={strokeCount === 0}
          className={`${toolBtn(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <span className="flex-1 min-w-0 truncate text-right text-[11px] font-semibold text-slate-500 px-1">{pageLabel}</span>

        <button
          type="button"
          title={isExpanded ? 'Perkecil' : 'Perbesar'}
          onClick={() => setIsExpanded((v) => !v)}
          className={`${toolBtn(false)} hidden lg:flex`}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button type="button" title="Sembunyikan kertas coretan" onClick={onClose} className={toolBtn(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`flex-1 w-full touch-none ${tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
        style={{
          backgroundImage:
            'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
