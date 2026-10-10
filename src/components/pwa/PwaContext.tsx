'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<void>;
  showModal: boolean;
  setShowModal: (open: boolean) => void;
}

const PwaContext = createContext<PwaContextType>({
  isInstallable: false,
  isInstalled: false,
  isAndroid: false,
  isIOS: false,
  promptInstall: async () => {},
  showModal: false,
  setShowModal: () => {},
});

const noopSubscribe = () => () => {};
const getUA = () => navigator.userAgent || '';
const getStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installedByEvent, setInstalledByEvent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Nilai dari browser dibaca lewat useSyncExternalStore (server: string kosong / false)
  const ua = useSyncExternalStore(noopSubscribe, getUA, () => '');
  const isStandalone = useSyncExternalStore(noopSubscribe, getStandalone, () => false);
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isInstalled = isStandalone || installedByEvent;

  useEffect(() => {
    // Service worker juga didaftarkan saat development agar fitur PWA bisa diuji
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('Service worker registration note:', err));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstalledByEvent(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledByEvent(true);
          setShowModal(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowModal(true);
      }
    } else {
      // Fallback: open guidance modal
      setShowModal(true);
    }
  };

  return (
    <PwaContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isAndroid,
        isIOS,
        promptInstall,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}
