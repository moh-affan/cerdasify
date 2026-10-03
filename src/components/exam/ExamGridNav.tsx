'use client';

import React from 'react';
import { HelpCircle, CheckCircle2, Circle } from 'lucide-react';

export interface QuestionStatusItem {
  index: number;
  questionId: string;
  isAnswered: boolean;
  isDoubtful: boolean;
}

interface ExamGridNavProps {
  items: QuestionStatusItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ExamGridNav: React.FC<ExamGridNavProps> = ({
  items,
  currentIndex,
  onSelectIndex,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const answeredCount = items.filter((x) => x.isAnswered && !x.isDoubtful).length;
  const doubtfulCount = items.filter((x) => x.isDoubtful).length;
  const unansweredCount = items.filter((x) => !x.isAnswered && !x.isDoubtful).length;

  const content = (
    <div className="flex flex-col h-full">
      {/* Header & Stats */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Navigasi Soal</h3>
        <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{answeredCount} Dijawab</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2 py-1 rounded-md border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{doubtfulCount} Ragu</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
            <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{unansweredCount} Kosong</span>
          </div>
        </div>
      </div>

      {/* Grid numbers */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => {
            const isActive = item.index === currentIndex;
            let badgeClass = 'bg-white text-slate-700 border-slate-200 hover:border-slate-300';

            if (item.isDoubtful) {
              badgeClass = 'bg-amber-500 text-white border-amber-600 shadow-sm';
            } else if (item.isAnswered) {
              badgeClass = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
            }

            return (
              <button
                key={item.index}
                type="button"
                onClick={() => {
                  onSelectIndex(item.index);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`relative h-10 rounded-lg text-xs font-bold border transition-all flex items-center justify-center select-none active:scale-95 ${badgeClass} ${
                  isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 z-10' : ''
                }`}
              >
                {item.index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-h-[calc(100vh-100px)] sticky top-20">
        {content}
      </aside>

      {/* Mobile Bottom Sheet / Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[80vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" />
            <div className="flex-1 overflow-hidden">{content}</div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-700 transition"
              >
                Tutup Navigasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
