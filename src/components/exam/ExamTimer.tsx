'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Clock, AlertTriangle, Pause } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface ExamTimerProps {
  /** Sisa detik dari server. Komponen di-mount ulang (prop `key`) setiap kali server memberi nilai baru. */
  initialSeconds: number;
  onTimeOut: () => void;
  onTick?: (remaining: number) => void;
  isPaused?: boolean;
}

/**
 * Hitung mundur berbasis tenggat (Date.now), sehingga tetap akurat walau tab sempat di latar belakang.
 * Nilai akhir tetap divalidasi server saat menyimpan/submit.
 */
export const ExamTimer: React.FC<ExamTimerProps> = ({ initialSeconds, onTimeOut, onTick, isPaused = false }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const secondsRef = useRef(initialSeconds);
  const onTimeOutRef = useRef(onTimeOut);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTimeOutRef.current = onTimeOut;
    onTickRef.current = onTick;
  }, [onTimeOut, onTick]);

  useEffect(() => {
    if (isPaused) return;
    const deadline = Date.now() + secondsRef.current * 1000;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (left !== secondsRef.current) {
        secondsRef.current = left;
        setSeconds(left);
        onTickRef.current?.(left);
      }
      if (left <= 0) {
        clearInterval(timer);
        onTimeOutRef.current();
      }
    };
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const isUrgent = seconds < 300; // < 5 mins
  const isCritical = seconds < 60; // < 1 min

  if (isPaused) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-semibold tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
        <Pause className="w-3.5 h-3.5 text-amber-700" />
        <span>DIJEDA ({formatDuration(seconds)})</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-semibold tracking-wider transition-all duration-300 ${
        isCritical
          ? 'bg-rose-50 text-rose-600 border border-rose-300 animate-pulse shadow-sm shadow-rose-100'
          : isUrgent
          ? 'bg-amber-50 text-amber-700 border border-amber-300'
          : 'bg-slate-100 text-slate-800 border border-slate-200'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-slate-600" />
      )}
      <span>{formatDuration(seconds)}</span>
    </div>
  );
};
