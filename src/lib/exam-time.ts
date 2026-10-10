// Perhitungan waktu ujian di sisi server. Klien hanya menampilkan; server yang menentukan.

/** Toleransi keterlambatan jaringan saat menyimpan/submit di detik-detik terakhir. */
export const GRACE_SECONDS = 30;

export interface AttemptTiming {
  status: string;
  startedAt: string;
  remainingSeconds: number | null;
  segmentStartedAt: string | null;
}

/**
 * Sisa waktu (detik) menurut server.
 * - PAUSED: sisa waktu yang dibekukan saat dijeda.
 * - IN_PROGRESS: sisa waktu awal segmen dikurangi waktu yang berlalu sejak segmen dimulai.
 */
export function computeRemainingSeconds(a: AttemptTiming, durationMinutes: number, now = Date.now()): number {
  const total = durationMinutes * 60;
  const base = a.remainingSeconds ?? total;
  if (a.status === 'PAUSED') return Math.max(0, base);

  // Attempt lama (sebelum segment_started_at ada) yang pernah dijeda: waktu lanjutnya tidak tercatat,
  // jadi gunakan sisa waktu tersimpan apa adanya.
  if (!a.segmentStartedAt && a.remainingSeconds !== null) return Math.max(0, a.remainingSeconds);

  const since = Date.parse(a.segmentStartedAt ?? a.startedAt);
  const elapsed = Math.floor((now - since) / 1000);
  return Math.max(0, Math.min(total, base - elapsed));
}

/** True jika waktu habis melewati toleransi (hanya untuk attempt yang sedang berjalan). */
export function isPastDeadline(a: AttemptTiming, durationMinutes: number, now = Date.now()): boolean {
  if (a.status !== 'IN_PROGRESS') return false;
  const total = durationMinutes * 60;
  const base = a.remainingSeconds ?? total;
  if (!a.segmentStartedAt && a.remainingSeconds !== null) return base <= 0;
  const since = Date.parse(a.segmentStartedAt ?? a.startedAt);
  return (now - since) / 1000 > base + GRACE_SECONDS;
}
