// PRNG deterministik untuk game edukasi. Dipakai bersama oleh browser dan server:
// seed yang sama selalu menghasilkan soal/papan yang sama, sehingga server bisa memutar ulang
// log jawaban dan menghitung ulang skor tanpa menyimpan soal.

export type Rng = () => number;

/** mulberry32: cepat, cukup acak untuk permainan, hasil di [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gabungkan beberapa bilangan menjadi satu seed (FNV-1a sederhana). */
export function mixSeed(...parts: (number | string)[]): number {
  let h = 2166136261;
  for (const part of parts) {
    const s = String(part);
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    h = Math.imul(h ^ 0x2c, 16777619);
  }
  return h >>> 0;
}

export function rngFor(...parts: (number | string)[]): Rng {
  return mulberry32(mixSeed(...parts));
}

/** Bilangan bulat acak di [min, max] (inklusif). */
export function randInt(rng: Rng, min: number, max: number): number {
  if (max < min) return min;
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Fisher–Yates, mengembalikan salinan baru. */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Seed baru 31-bit (positif, muat di kolom INTEGER Postgres). */
export function newSeed(): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] & 0x7fffffff;
  }
  return Math.floor(Math.random() * 0x7fffffff);
}
