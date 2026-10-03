'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Circle, ArrowLeft, Send } from 'lucide-react';

interface ExamConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting?: boolean;
  stats: {
    total: number;
    answered: number;
    doubtful: number;
    unanswered: number;
  };
}

export const ExamConfirmModal: React.FC<ExamConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting = false,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-indigo-600 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Konfirmasi Selesai Ujian</h3>
            <p className="text-xs text-slate-500">Periksa kembali rekap lembar jawaban Anda</p>
          </div>
        </div>

        {/* Stats summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 my-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sudah Dijawab Mantap
            </span>
            <span className="font-bold text-slate-800">{stats.answered} soal</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Masih Ragu-ragu
            </span>
            <span className="font-bold text-amber-600">{stats.doubtful} soal</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <Circle className="w-4 h-4 text-slate-400" />
              Belum Terisi (Kosong)
            </span>
            <span className="font-bold text-slate-500">{stats.unanswered} soal</span>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Soal</span>
            <span>{stats.total} soal</span>
          </div>
        </div>

        {stats.unanswered > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 mb-5">
            <strong>Peringatan:</strong> Masih terdapat {stats.unanswered} soal yang belum Anda jawab. Jawaban kosong akan dihitung sesuai aturan penilaian paket ujian.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Cek Lagi
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirmSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin mr-1">⏳</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Mengirim...' : 'Kumpulkan'}
          </button>
        </div>
      </div>
    </div>
  );
};
