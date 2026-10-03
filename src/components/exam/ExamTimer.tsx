'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Pause } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeOut: () => void;
  onTick?: (remaining: number) => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialSeconds,
  onTimeOut,
  onTick,
  isPaused = false,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    if (seconds <= 0) {
      onTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeOut();
          return 0;
        }
        const next = prev - 1;
        if (onTick && next % 5 === 0) {
          setTimeout(() => onTick(next), 0);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onTimeOut, onTick, isPaused]);

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
