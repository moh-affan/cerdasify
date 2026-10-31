'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FloatingScratchButton } from './FloatingScratchButton';
import { ScratchPad } from './ScratchPad';

export interface PageContext {
  key: string;
  label: string;
}

interface ScratchPadContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen: () => void;
  pageContext: PageContext | null;
  setPageContext: (ctx: PageContext | null) => void;
  hasStrokes: boolean;
  setHasStrokes: (has: boolean) => void;
}

const ScratchPadContext = createContext<ScratchPadContextType | null>(null);

export function useScratchPad() {
  const ctx = useContext(ScratchPadContext);
  if (!ctx) {
    throw new Error('useScratchPad must be used within ScratchPadProvider');
  }
  return ctx;
}

export function useOptionalScratchPad() {
  return useContext(ScratchPadContext);
}

export function ScratchPadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [hasStrokes, setHasStrokes] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <ScratchPadContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
        pageContext,
        setPageContext,
        hasStrokes,
        setHasStrokes,
      }}
    >
      {children}
      <FloatingScratchButton />
      <ScratchPad />
    </ScratchPadContext.Provider>
  );
}

