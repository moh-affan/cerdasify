// Efek suara game dibuat langsung dengan Web Audio (tanpa file audio → 0 KB unduhan).
// Preferensi suara disimpan per perangkat di localStorage.

const SOUND_KEY = 'cerdasify-game-sound';
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

/** Untuk useSyncExternalStore: komponen ikut diperbarui saat suara dinyalakan/dimatikan. */
export function subscribeSound(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    // penyimpanan diblokir: abaikan
  }
  listeners.forEach((cb) => cb());
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export type SfxKind = 'tap' | 'flip' | 'correct' | 'wrong' | 'win' | 'levelUp';

export function playSfx(kind: SfxKind) {
  if (typeof window === 'undefined' || !isSoundOn()) return;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    switch (kind) {
      case 'tap':
        tone(660, 0, 0.05, 'triangle', 0.05);
        break;
      case 'flip':
        tone(520, 0, 0.07, 'triangle', 0.06);
        break;
      case 'correct':
        tone(660, 0, 0.1);
        tone(880, 0.08, 0.16);
        break;
      case 'wrong':
        // Lembut, tidak menakutkan
        tone(300, 0, 0.14, 'sine', 0.08);
        tone(250, 0.1, 0.18, 'sine', 0.06);
        break;
      case 'levelUp':
        tone(523, 0, 0.08);
        tone(659, 0.07, 0.08);
        tone(784, 0.14, 0.14);
        break;
      case 'win':
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22));
        break;
    }
  } catch {
    // Audio tidak tersedia: game tetap berjalan tanpa suara
  }
}

/** Getar ringan saat jawaban salah (bila perangkat mendukung). */
export function buzz() {
  try {
    if (isSoundOn() && 'vibrate' in navigator) navigator.vibrate(60);
  } catch {
    // abaikan
  }
}
