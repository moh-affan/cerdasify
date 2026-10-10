// Pembatas percobaan sederhana di memori (per instance server).
// Cukup untuk meredam tebak-password; untuk skala besar gunakan penyimpanan bersama (mis. Redis).

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) return { allowed: true, retryAfterSec: 0 };
  if (bucket.count >= limit) return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  return { allowed: true, retryAfterSec: 0 };
}

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) buckets.set(key, { count: 1, resetAt: now + windowMs });
  else bucket.count += 1;

  // Bersihkan entri kedaluwarsa agar memori tidak tumbuh tanpa batas
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
}

export function resetLimit(key: string) {
  buckets.delete(key);
}
