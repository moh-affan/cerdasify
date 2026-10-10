'use client';

import { useEffect } from 'react';

interface LastReadTrackerProps {
  slug: string;
  title: string;
  theme?: string | null;
  coverEmoji?: string | null;
  coverImageUrl?: string | null;
}

const STORAGE_KEY = 'cerdasify_last_read';

export default function LastReadTracker({
  slug,
  title,
  theme,
  coverEmoji,
  coverImageUrl,
}: LastReadTrackerProps) {
  useEffect(() => {
    try {
      const data = {
        slug,
        title,
        theme: theme ?? null,
        coverEmoji: coverEmoji ?? null,
        coverImageUrl: coverImageUrl ?? null,
        visitedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Abaikan jika localStorage tidak diizinkan / private mode
    }
  }, [slug, title, theme, coverEmoji, coverImageUrl]);

  return null;
}
