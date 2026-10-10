'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Bookmark, ArrowRight, RotateCcw } from 'lucide-react';

export interface LastReadItem {
  slug: string;
  title: string;
  theme?: string | null;
  coverEmoji?: string | null;
  coverImageUrl?: string | null;
  completedAt?: string;
  nextSlug?: string | null;
  nextTitle?: string | null;
  quizScore?: number | null;
  quizTotal?: number | null;
}

const STORAGE_KEY = 'cerdasify_last_read';
const noopSubscribe = () => () => {};

function getLocalSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getLocalServerSnapshot(): string | null {
  return null;
}

export default function ContinueReadingBanner({
  serverItem,
}: {
  serverItem?: LastReadItem | null;
}) {
  const rawStorage = useSyncExternalStore(
    noopSubscribe,
    getLocalSnapshot,
    getLocalServerSnapshot
  );

  const localItem = useMemo<LastReadItem | null>(() => {
    if (serverItem || !rawStorage) return null;
    try {
      const parsed = JSON.parse(rawStorage);
      return parsed && typeof parsed.slug === 'string' ? parsed : null;
    } catch {
      return null;
    }
  }, [serverItem, rawStorage]);

  const item = serverItem ?? localItem;
  if (!item) return null;

  const hasNext = Boolean(item.nextSlug && item.nextTitle);

  return (
    <section className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-3xl shrink-0">
            {item.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.coverImageUrl}
                alt=""
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              item.coverEmoji || '📖'
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                <Bookmark className="w-3 h-3" />
                Lanjutkan Membaca
              </span>
              {item.theme && (
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  · {item.theme}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500">
              {hasNext ? (
                <span>
                  Selesai! Lanjut berikutnya: <b className="text-slate-700">{item.nextTitle}</b>
                </span>
              ) : item.quizTotal && item.quizTotal > 0 ? (
                <span>
                  Terakhir dikerjakan · Skor: ⭐ {item.quizScore}/{item.quizTotal}
                </span>
              ) : (
                <span>Bacaan terakhir yang kamu buka</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {hasNext ? (
            <>
              <Link
                href={`/belajar/${item.nextSlug}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-98"
              >
                <span>Lanjut Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/belajar/${item.slug}`}
                className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold transition"
                title="Baca Ulang Materi Ini"
                aria-label="Baca Ulang Materi Ini"
              >
                <RotateCcw className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <Link
              href={`/belajar/${item.slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-98"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
