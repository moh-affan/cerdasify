'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { usePwa } from './PwaContext';
import { CerdasifyIcon } from '@/components/ui/CerdasifyLogo';
import {
  Download,
  X,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MoreVertical,
  PlusSquare,
  Share,
} from 'lucide-react';

const DISMISS_KEY = 'cerdasify_pwa_dismissed_time';
const DISMISS_MS = 3 * 24 * 60 * 60 * 1000;
const noopSubscribe = () => () => {};

function readRecentlyDismissed(): boolean {
  try {
    const t = Number(localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(t) && t > 0 && Date.now() - t < DISMISS_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    promptInstall,
    showModal,
    setShowModal,
  } = usePwa();

  // Banner disembunyikan 3 hari setelah ditutup. Di server dianggap "ditutup" agar tidak berkedip saat hidrasi.
  const recentlyDismissed = useSyncExternalStore(noopSubscribe, readRecentlyDismissed, () => true);
  const [dismissedNow, setDismissedNow] = useState(false);
  const bannerDismissed = recentlyDismissed || dismissedNow;

  const dismissBanner = () => {
    setDismissedNow(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Penyimpanan diblokir (mode privat): cukup sembunyikan untuk sesi ini
    }
  };

  // If already installed, hide banner
  const showBanner = !bannerDismissed && !isInstalled;

  return (
    <>
      {/* Floating Bottom Install Banner for Mobile */}
      {showBanner && (
        <aside
          aria-label="Prompt pemasangan aplikasi"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 shrink-0">
                <CerdasifyIcon size={36} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <span>Pasang Aplikasi Cerdasify</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[9px] font-semibold">
                    PWA
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300 truncate">
                  Akses simulasi lebih cepat dari layar utama
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (isInstallable) {
                    promptInstall();
                  } else {
                    setShowModal(true);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang</span>
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Tutup banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Full Modal Guide */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header with App Branding */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-1 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 shadow-inner">
                  <CerdasifyIcon size={52} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black tracking-tight text-white">
                      Cerdasify Mobile
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                      Android PWA
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Platform Simulasi Ujian & Bank Soal Interaktif
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {isInstalled ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Aplikasi Sudah Terpasang!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Cerdasify sudah aktif di layar utama perangkat Anda. Anda dapat membukanya langsung seperti aplikasi bawaan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <>
                  {/* Keunggulan PWA */}
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center">
                      <Sparkles className="w-5 h-5 text-indigo-600 mb-1.5" />
                      <span className="text-[11px] font-bold text-indigo-950">Layar Penuh</span>
                      <span className="text-[9px] text-indigo-600/80">Bebas bilah URL</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center">
                      <Smartphone className="w-5 h-5 text-amber-600 mb-1.5" />
                      <span className="text-[11px] font-bold text-amber-950">Akses Instan</span>
                      <span className="text-[9px] text-amber-600/80">Dari Homescreen</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center">
                      <Download className="w-5 h-5 text-emerald-600 mb-1.5" />
                      <span className="text-[11px] font-bold text-emerald-950">Sangat Ringan</span>
                      <span className="text-[9px] text-emerald-600/80">&lt; 1 MB Kuota</span>
                    </div>
                  </div>

                  {/* Android Chrome Direct Prompt or Manual Steps */}
                  {isInstallable ? (
                    <div className="space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={promptInstall}
                        className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>Pasang Aplikasi Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] text-center text-slate-500">
                        Browser Anda mendukung instalasi otomatis satu ketukan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        <span>
                          {isIOS ? 'Cara Pasang di iPhone / iPad (iOS):' : 'Cara Pasang di HP Android:'}
                        </span>
                      </div>

                      {isIOS ? (
                        <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              1
                            </span>
                            <div className="leading-snug">
                              Ketuk tombol <span className="font-semibold text-indigo-600">Bagikan (Share)</span>{' '}
                              <Share className="w-3.5 h-3.5 inline text-indigo-600" /> di menu bilah bawah Safari.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              2
                            </span>
                            <div className="leading-snug">
                              Gulir ke bawah lalu pilih menu{' '}
                              <span className="font-semibold text-slate-900">
                                Tambahkan ke Layar Utama (Add to Home Screen)
                              </span>{' '}
                              <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              3
                            </span>
                            <div className="leading-snug">
                              Ketuk <span className="font-semibold text-slate-900">Tambah</span> di pojok kanan atas.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              1
                            </span>
                            <div className="leading-snug">
                              Ketuk tombol menu titik tiga (
                              <MoreVertical className="w-3.5 h-3.5 inline text-slate-800" />
                              ) di pojok kanan atas browser Google Chrome / Android Anda.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              2
                            </span>
                            <div className="leading-snug">
                              Pilih menu{' '}
                              <span className="font-semibold text-indigo-700">
                                &ldquo;Instal aplikasi&rdquo;
                              </span>{' '}
                              atau{' '}
                              <span className="font-semibold text-indigo-700">
                                &ldquo;Tambahkan ke Layar Utama&rdquo;
                              </span>
                              .
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              3
                            </span>
                            <div className="leading-snug">
                              Ketuk tombol konfirmasi <span className="font-semibold text-slate-900">&ldquo;Instal&rdquo;</span>. Ikon Cerdasify akan langsung muncul di beranda HP Anda!
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
                      >
                        Mengerti
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
