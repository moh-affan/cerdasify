// Utilitas Pustaka Belajar: fase Kurikulum Merdeka, level CEFR, streak & bacaan harian.

export const PHASES = ['A', 'B', 'C', 'D', 'E', 'F', 'L'] as const;
export type Phase = (typeof PHASES)[number];

export const PHASE_INFO: Record<Phase, { label: string; grades: string; cefr: string }> = {
  A: { label: 'Fase A', grades: 'SD Kelas 1–2', cefr: 'Pre-A1' },
  B: { label: 'Fase B', grades: 'SD Kelas 3–4', cefr: 'Pre-A1 – A1' },
  C: { label: 'Fase C', grades: 'SD Kelas 5–6', cefr: 'A1' },
  D: { label: 'Fase D', grades: 'SMP Kelas 7–9', cefr: 'A2' },
  E: { label: 'Fase E', grades: 'SMA Kelas 10', cefr: 'B1' },
  F: { label: 'Fase F', grades: 'SMA Kelas 11–12', cefr: 'B1 – B2' },
  L: { label: 'Lanjut', grades: 'Umum / Dewasa', cefr: 'B2 – C1' },
};

export const GRADE_OPTIONS: { value: number; label: string }[] = [
  ...Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: `SD Kelas ${i + 1}` })),
  ...Array.from({ length: 3 }, (_, i) => ({ value: i + 7, label: `SMP Kelas ${i + 7}` })),
  ...Array.from({ length: 3 }, (_, i) => ({ value: i + 10, label: `SMA Kelas ${i + 10}` })),
  { value: 13, label: 'Lanjut / Umum' },
];

export const CONTENT_TYPE_LABEL: Record<string, string> = {
  DAILY_READING: 'Daily Reading',
  STORY: 'Cerita Pendek',
  ENCYCLOPEDIA: 'Ensiklopedia',
  COMIC: 'Komik',
  SPEECH: 'Contoh Pidato',
  LESSON: 'Materi Pelajaran',
};

export function gradeToPhase(grade: number | null | undefined): Phase | null {
  if (!grade) return null;
  if (grade <= 2) return 'A';
  if (grade <= 4) return 'B';
  if (grade <= 6) return 'C';
  if (grade <= 9) return 'D';
  if (grade === 10) return 'E';
  if (grade <= 12) return 'F';
  return 'L';
}

export function isPhase(value: unknown): value is Phase {
  return typeof value === 'string' && (PHASES as readonly string[]).includes(value);
}

export function phaseIndex(phase: Phase): number {
  return PHASES.indexOf(phase);
}

export function contentMatchesPhase(phase: Phase, min: Phase, max: Phase): boolean {
  const i = phaseIndex(phase);
  return i >= phaseIndex(min) && i <= phaseIndex(max);
}

/** Fase A–B memakai tampilan anak: huruf besar, audio & terjemahan per kalimat. */
export function isKidsPhase(phase: Phase): boolean {
  return phase === 'A' || phase === 'B';
}

/**
 * Satu unit teks bacaan. Bacaan bahasa Inggris memakai `en` + `id`;
 * cerita/ensiklopedia berbahasa Indonesia memakai `tx`; doa / ayat memakai `ar` + `latin` + `id`.
 */
export interface ContentSegment {
  en?: string;
  /** Teks utama berbahasa Indonesia (cerita, ensiklopedia) */
  tx?: string;
  ar?: string;
  latin?: string;
  id?: string;
  /** Nomor ayat (untuk surat Al-Qur'an) */
  n?: number;
  /** Awal paragraf baru */
  break?: boolean;
  /** Judul bagian yang ditampilkan sebelum segmen ini (mis. "Pembukaan" pada pidato) */
  h?: string;
  /** Satu panel komik */
  panel?: ComicPanel;
}

export const COMIC_BACKGROUNDS = ['sky', 'grass', 'room', 'school', 'night', 'sunset', 'sea', 'plain'] as const;
export type ComicBackground = (typeof COMIC_BACKGROUNDS)[number];

export interface ComicBubble {
  who: string;
  text: string;
  side?: 'left' | 'right';
  tone?: 'say' | 'think' | 'shout';
}

export interface ComicPanel {
  /** Adegan berupa emoji, mis. "👦🏻🏫🌳" (dipakai jika tidak ada gambar) */
  scene?: string;
  /** URL gambar panel (opsional, menggantikan adegan emoji) */
  img?: string;
  bg?: ComicBackground;
  /** Narasi di atas panel */
  caption?: string;
  bubbles?: ComicBubble[];
}

export function parseSegments(json: string | null): ContentSegment[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonArray<T = string>(json: string | null): T[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Tanggal hari ini (YYYY-MM-DD) dalam zona Asia/Jakarta. */
export function jakartaDateString(date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

function shiftDate(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** N tanggal terakhir (YYYY-MM-DD), dari yang terlama hingga hari ini. */
export function lastNDates(n: number, today = jakartaDateString()): string[] {
  return Array.from({ length: n }, (_, i) => shiftDate(today, i - n + 1));
}

/** Jumlah hari berturut-turut membaca, berakhir hari ini atau kemarin. */
export function computeStreak(readDates: string[], today = jakartaDateString()): number {
  const days = new Set(readDates);
  let cursor = days.has(today) ? today : shiftDate(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

/**
 * Bacaan hari ini: bacaan pertama (urut orderIndex) yang belum diselesaikan.
 * Bila semua sudah dibaca, rotasi berdasarkan tanggal agar tetap berganti tiap hari.
 */
export function pickDailyReading<T extends { id: string }>(
  readings: T[],
  completedIds: Set<string>,
  today = jakartaDateString()
): T | null {
  if (readings.length === 0) return null;
  const unread = readings.find((r) => !completedIds.has(r.id));
  if (unread) return unread;
  const dayNumber = Math.floor(new Date(`${today}T00:00:00Z`).getTime() / 86_400_000);
  return readings[dayNumber % readings.length];
}
