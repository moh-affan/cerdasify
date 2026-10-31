'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PencilLine, X } from 'lucide-react';
import { useScratchPad } from './ScratchPadContext';

export const FloatingScratchButton: React.FC = () => {
  const { isOpen, toggleOpen, hasStrokes } = useScratchPad();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    moved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false,
  });

  // Jaga posisi tombol agar tetap berada di dalam layar saat ukuran layar berubah (rotasi HP / resize)
  useEffect(() => {
    const handleResize = () => {
      setPos((current) => {
        if (!current || !buttonRef.current) return current;
        const rect = buttonRef.current.getBoundingClientRect();
        return {
          x: Math.min(Math.max(8, current.x), window.innerWidth - rect.width - 8),
          y: Math.min(Math.max(8, current.y), window.innerHeight - rect.height - 8),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Hanya tanggapi klik kiri / pointer utama
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
      moved: false,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragInfoRef.current.startX;
      const dy = ev.clientY - dragInfoRef.current.startY;
      if (!dragInfoRef.current.moved && Math.hypot(dx, dy) > 6) {
        dragInfoRef.current.moved = true;
        setIsDragging(true);
      }

      if (dragInfoRef.current.moved) {
        const nextX = Math.min(
          Math.max(8, dragInfoRef.current.initialX + dx),
          window.innerWidth - rect.width - 8
        );
        const nextY = Math.min(
          Math.max(8, dragInfoRef.current.initialY + dy),
          window.innerHeight - rect.height - 8
        );
        setPos({ x: nextX, y: nextY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (!dragInfoRef.current.moved) {
        // Klik murni tanpa seret -> toggle buka/tutup
        toggleOpen();
      }
      setTimeout(() => setIsDragging(false), 50);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={handlePointerDown}
      aria-label={isOpen ? 'Tutup kertas coretan' : 'Buka kertas coretan untuk berhitung'}
      aria-expanded={isOpen}
      title={
        isOpen
          ? 'Tutup kertas coretan'
          : 'Buka kertas coretan (bisa digeser ke mana saja)'
      }
      className={`fixed z-40 select-none print:hidden flex items-center gap-2 rounded-full border shadow-xl transition-all duration-200 cursor-pointer touch-none active:scale-95 ${
        isDragging ? 'opacity-90 scale-105 shadow-2xl' : ''
      } ${
        isOpen
          ? 'bg-slate-900 text-white border-slate-700 shadow-slate-900/30 ring-2 ring-indigo-400/50 px-3.5 py-3 sm:px-4 sm:py-3'
          : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400/30 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 px-3.5 py-3 sm:px-4 sm:py-3'
      } ${
        pos ? '' : 'bottom-20 right-4 sm:bottom-6 sm:right-6'
      }`}
      style={pos ? { left: `${pos.x}px`, top: `${pos.y}px` } : undefined}
    >
      <div className="relative flex items-center justify-center">
        {isOpen ? (
          <X className="w-5 h-5 text-slate-200" />
        ) : (
          <PencilLine className="w-5 h-5 text-indigo-100" />
        )}
        {!isOpen && hasStrokes && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600 animate-pulse"
            title="Ada coretan tersimpan"
          />
        )}
      </div>
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        {isOpen ? 'Tutup Coretan' : 'Coretan'}
      </span>
    </button>
  );
};

