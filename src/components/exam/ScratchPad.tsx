'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  GripHorizontal,
  Hand,
  LocateFixed,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import { useOptionalScratchPad } from './ScratchPadContext';

// Kertas coretan untuk berhitung. Hanya di browser: tidak dikirim ke server & tidak dinilai.
// Coretan disimpan per kunci/halaman sebagai vektor dalam koordinat "kertas",
// sehingga kertas bisa digeser tanpa batas, di-undo, dan digambar ulang saat ukuran panel berubah.

interface Stroke {
  tool: 'pen' | 'eraser';
  color: string;
  width: number;
  points: number[]; // x0, y0, x1, y1, ... dalam koordinat kertas (piksel CSS)
}

interface PageState {
  strokes: Stroke[];
  // Posisi pandang: titik kertas yang tampil di pojok kiri atas kanvas
  offsetX: number;
  offsetY: number;
}

export interface ScratchPadProps {
  isOpen?: boolean;
  onClose?: () => void;
  pageKey?: string; // id soal (opsional bila dipicu dari context)
  pageLabel?: string;
}

type Tool = 'pen' | 'eraser' | 'hand';

const PEN_COLORS = ['#0f172a', '#2563eb', '#dc2626'];
const PEN_WIDTH = 2.5;
const ERASER_WIDTH = 24;
const GRID_SIZE = 24;
const STORAGE_KEY = 'cerdasify_scratchpad_v1';

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

function getInitialPages(): Map<string, PageState> {
  const map = new Map<string, PageState>();
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const [k, v] of parsed) {
            map.set(k, v);
          }
        }
      }
    } catch {
      // Abaikan
    }
  }
  return map;
}

function getInitialTotalSheets(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return 1;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let maxSheet = 1;
      for (const [k] of parsed) {
        if (typeof k === 'string' && k.startsWith('sheet_')) {
          const num = parseInt(k.replace('sheet_', ''), 10);
          if (!Number.isNaN(num) && num > maxSheet) maxSheet = num;
        }
      }
      return maxSheet;
    }
  } catch {
    // Abaikan
  }
  return 1;
}

export const ScratchPad: React.FC<ScratchPadProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  pageKey: propPageKey,
  pageLabel: propPageLabel,
}) => {
  const context = useOptionalScratchPad();

  // Boleh dipanggil via props langsung ATAU via ScratchPadContext global
  const isOpen = propIsOpen !== undefined ? propIsOpen : (context?.isOpen ?? false);
  const handleClose = useCallback(() => {
    if (propOnClose) propOnClose();
    else context?.setIsOpen(false);
  }, [propOnClose, context]);

  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pagesRef = useRef<Map<string, PageState> | null>(null);
  if (pagesRef.current == null) {
    pagesRef.current = getInitialPages();
  }
  const activeStrokeRef = useRef<Stroke | null>(null);
  // Pointer yang sedang menyentuh kanvas (koordinat layar) & titik acuan geser terakhir
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const panAnchorRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isPanned, setIsPanned] = useState(false);
  // null = posisi bawaan (CSS); setelah diseret, panel memakai posisi & ukuran eksplisit
  const [panelPos, setPanelPos] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Lembar coretan bebas bila tidak sedang dalam konteks soal ujian
  const [activeSheet, setActiveSheet] = useState(1);
  const [totalSheets, setTotalSheets] = useState<number>(getInitialTotalSheets);

  // Kunci dan label aktif: prioritaskan prop > context soal > lembar coretan bebas
  const effectiveKey = propPageKey ?? context?.pageContext?.key ?? `sheet_${activeSheet}`;
  const effectiveLabel = propPageLabel ?? context?.pageContext?.label ?? `Lembar ${activeSheet}`;
  const isQuestionMode = Boolean(propPageKey || context?.pageContext);

  const saveToStorage = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !pagesRef.current) return;
      const entries = Array.from(pagesRef.current.entries());
      const filtered = entries.filter(([, p]) => p.strokes.length > 0 || p.offsetX !== 0 || p.offsetY !== 0);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // Abaikan bila storage penuh atau dibatasi browser
    }
  }, []);

  const pageFor = useCallback((key: string) => {
    let page = pagesRef.current?.get(key);
    if (!page) {
      page = { strokes: [], offsetX: 0, offsetY: 0 };
      pagesRef.current?.set(key, page);
    }
    return page;
  }, []);

  /** Pasang transformasi DPR + geseran kertas agar koordinat gambar = koordinat kertas. */
  const applyView = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const dpr = window.devicePixelRatio || 1;
      const page = pageFor(effectiveKey);
      ctx.setTransform(dpr, 0, 0, dpr, -page.offsetX * dpr, -page.offsetY * dpr);
    },
    [pageFor, effectiveKey]
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const page = pageFor(effectiveKey);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyView(ctx);
    for (const s of page.strokes) drawStroke(ctx, s);
    // Petak latar ikut bergeser bersama kertas
    canvas.style.backgroundPosition = `${-page.offsetX}px ${-page.offsetY}px`;
    setStrokeCount(page.strokes.length);
    setIsPanned(page.offsetX !== 0 || page.offsetY !== 0);
    context?.setHasStrokes(page.strokes.length > 0);
  }, [applyView, context, pageFor, effectiveKey]);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      const page = pageFor(effectiveKey);
      page.offsetX -= dx;
      page.offsetY -= dy;
      redraw();
      saveToStorage();
    },
    [pageFor, effectiveKey, redraw, saveToStorage]
  );

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
      redraw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  // Ganti kunci soal/halaman → tampilkan coretan milik halaman tersebut
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Tutup panel saat menekan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Scroll mouse / touchpad menggeser kertas (listener non-pasif agar halaman tidak ikut tergulir)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.shiftKey && e.deltaX === 0) panBy(-e.deltaY, 0);
      else panBy(-e.deltaX, -e.deltaY);
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [panBy]);

  // Ukuran layar berubah (rotasi HP, bilah alamat browser) → jaga panel yang sudah diseret tetap di dalam layar
  useEffect(() => {
    const clamp = () =>
      setPanelPos((p) => {
        if (!p) return p;
        const width = Math.min(p.width, window.innerWidth);
        return {
          ...p,
          width,
          left: Math.min(Math.max(0, p.left), window.innerWidth - width),
          top: Math.min(Math.max(0, p.top), window.innerHeight - 48),
        };
      });
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  const pointersCenter = () => {
    const pts = [...pointersRef.current.values()];
    return {
      x: pts.reduce((sum, p) => sum + p.x, 0) / pts.length,
      y: pts.reduce((sum, p) => sum + p.y, 0) / pts.length,
    };
  };

  const toPaper = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const page = pageFor(effectiveKey);
    return [e.clientX - rect.left + page.offsetX, e.clientY - rect.top + page.offsetY];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    if (e.button === 1) e.preventDefault(); // cegah auto-scroll klik tengah
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Dua jari, alat tangan, atau tombol tengah mouse → geser kertas
    if (pointersRef.current.size > 1 || tool === 'hand' || e.button === 1) {
      if (activeStrokeRef.current) {
        // Jari pertama tadi ternyata awal gestur geser, bukan coretan
        const strokes = pageFor(effectiveKey).strokes;
        if (strokes[strokes.length - 1] === activeStrokeRef.current) strokes.pop();
        activeStrokeRef.current = null;
        redraw();
      }
      panAnchorRef.current = pointersCenter();
      return;
    }

    const stroke: Stroke = {
      tool,
      color,
      width: tool === 'eraser' ? ERASER_WIDTH : PEN_WIDTH,
      points: toPaper(e),
    };
    pageFor(effectiveKey).strokes.push(stroke);
    activeStrokeRef.current = stroke;
    applyView(ctx);
    drawStroke(ctx, stroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (panAnchorRef.current) {
      const center = pointersCenter();
      panBy(center.x - panAnchorRef.current.x, center.y - panAnchorRef.current.y);
      panAnchorRef.current = center;
      return;
    }

    const stroke = activeStrokeRef.current;
    const ctx = e.currentTarget.getContext('2d');
    if (!stroke || !ctx) return;
    const from = stroke.points.length;
    // Event gabungan membuat garis lebih halus pada stylus/layar sentuh cepat
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const ev of events.length > 0 ? events : [e.nativeEvent]) stroke.points.push(...toPaper(ev));
    applyView(ctx);
    drawStroke(ctx, stroke, from);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size > 0) {
      // Masih ada jari yang menempel: lanjutkan geser dari posisinya tanpa lompatan
      if (panAnchorRef.current) panAnchorRef.current = pointersCenter();
      return;
    }
    panAnchorRef.current = null;
    if (activeStrokeRef.current) {
      activeStrokeRef.current = null;
      const count = pageFor(effectiveKey).strokes.length;
      setStrokeCount(count);
      context?.setHasStrokes(count > 0);
      saveToStorage();
    }
  };

  const handleUndo = () => {
    pageFor(effectiveKey).strokes.pop();
    redraw();
    saveToStorage();
  };

  const handleClear = () => {
    pagesRef.current?.set(effectiveKey, { strokes: [], offsetX: 0, offsetY: 0 });
    redraw();
    saveToStorage();
  };

  const handleResetView = () => {
    const page = pageFor(effectiveKey);
    page.offsetX = 0;
    page.offsetY = 0;
    redraw();
    saveToStorage();
  };

  // Seret panel lewat pegangan di toolbar
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    e.preventDefault();
    const rect = panel.getBoundingClientRect();
    const grabX = e.clientX - rect.left;
    const grabY = e.clientY - rect.top;
    const onMove = (ev: PointerEvent) => {
      setPanelPos({
        left: Math.min(Math.max(0, ev.clientX - grabX), window.innerWidth - rect.width),
        top: Math.min(Math.max(0, ev.clientY - grabY), window.innerHeight - 48),
        width: rect.width,
        height: rect.height,
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const toolBtn = (active: boolean) =>
    `w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition cursor-pointer border ${
      active ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
    }`;

  const sizeClass = isExpanded
    ? 'inset-x-2 top-16 bottom-20 lg:inset-x-auto lg:left-6 lg:right-6 lg:top-20 lg:bottom-6'
    : 'inset-x-2 bottom-20 h-[60vh] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-[640px] lg:h-[560px] lg:resize lg:min-w-[360px] lg:min-h-[300px] lg:max-w-[calc(100vw-3rem)] lg:max-h-[calc(100vh-6rem)]';

  return (
    <div
      ref={panelRef}
      className={`${isOpen ? 'flex' : 'hidden'} fixed z-40 flex-col bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden print:hidden ${
        panelPos ? '' : sizeClass
      }`}
      style={panelPos ?? undefined}
      role="dialog"
      aria-label="Kertas coretan"
    >
      <div className="flex items-center gap-1.5 px-2 py-2 border-b border-slate-200 bg-slate-50 overflow-x-auto select-none">
        <div
          onPointerDown={handleDragStart}
          title="Seret untuk memindahkan panel"
          className="w-7 h-8 shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-move touch-none"
        >
          <GripHorizontal className="w-4 h-4" />
        </div>
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
            className={`w-6 h-6 shrink-0 rounded-full border-2 cursor-pointer transition-transform active:scale-95 ${
              tool === 'pen' && color === c ? 'border-indigo-500 ring-2 ring-indigo-200 scale-110' : 'border-white shadow-sm'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button type="button" title="Penghapus" onClick={() => setTool('eraser')} className={toolBtn(tool === 'eraser')}>
          <Eraser className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Geser kertas (atau pakai dua jari / scroll)"
          onClick={() => setTool('hand')}
          className={toolBtn(tool === 'hand')}
        >
          <Hand className="w-4 h-4" />
        </button>
        <span className="w-px h-6 shrink-0 bg-slate-200 mx-0.5" />
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
          title="Hapus semua coretan di lembar ini"
          onClick={handleClear}
          disabled={strokeCount === 0 && !isPanned}
          className={`${toolBtn(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isPanned && (
          <button type="button" title="Kembali ke posisi awal kertas" onClick={handleResetView} className={toolBtn(false)}>
            <LocateFixed className="w-4 h-4" />
          </button>
        )}

        {/* Kontrol navigasi lembar coretan bebas ATAU label soal ujian */}
        {!isQuestionMode ? (
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg px-1 py-0.5 shrink-0 mx-1">
            <button
              type="button"
              title="Lembar sebelumnya"
              disabled={activeSheet <= 1}
              onClick={() => setActiveSheet((s) => Math.max(1, s - 1))}
              className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold text-slate-700 min-w-[46px] text-center select-none">
              {activeSheet}/{totalSheets}
            </span>
            <button
              type="button"
              title="Lembar berikutnya"
              disabled={activeSheet >= totalSheets}
              onClick={() => setActiveSheet((s) => Math.min(totalSheets, s + 1))}
              className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Tambah lembar baru"
              onClick={() => {
                setTotalSheets((t) => {
                  const next = t + 1;
                  setActiveSheet(next);
                  return next;
                });
              }}
              className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="flex-1 min-w-0 truncate text-right text-[11px] font-semibold text-slate-600 px-1">
            {effectiveLabel}
          </span>
        )}

        {!isQuestionMode && <span className="flex-1 min-w-2" />}

        <button
          type="button"
          title={isExpanded ? 'Perkecil' : 'Perbesar'}
          onClick={() => {
            setIsExpanded((v) => !v);
            setPanelPos(null);
            panelRef.current?.style.removeProperty('width');
            panelRef.current?.style.removeProperty('height');
          }}
          className={toolBtn(false)}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button type="button" title="Sembunyikan kertas coretan (Esc)" onClick={handleClose} className={toolBtn(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`flex-1 min-h-0 w-full touch-none ${
          tool === 'hand' ? 'cursor-grab active:cursor-grabbing' : tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />
    </div>
  );
};
