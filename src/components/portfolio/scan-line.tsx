'use client';

import { useSyncExternalStore, useMemo } from 'react';
import { motion } from 'framer-motion';

// Store for prefers-reduced-motion media query
function createMediaQueryStore(query: string) {
  return {
    subscribe: (callback: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    getSnapshot: () => {
      if (typeof window === 'undefined') return false;
      return !window.matchMedia(query).matches;
    },
    getServerSnapshot: () => false,
  };
}

export function ScanLine() {
  const mediaQueryStore = useMemo(
    () => createMediaQueryStore('(prefers-reduced-motion: reduce)'),
    []
  );
  
  const isVisible = useSyncExternalStore(
    mediaQueryStore.subscribe,
    mediaQueryStore.getSnapshot,
    mediaQueryStore.getServerSnapshot
  );

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed left-0 w-full h-0.5 pointer-events-none z-[1000]"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--electric), transparent)',
        }}
        initial={{ top: -2, opacity: 0.5 }}
        animate={{ 
          top: ['0%', '100%'],
          opacity: [0.5, 0.8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />
      
      {/* Secondary scan line for depth */}
      <motion.div
        className="fixed left-0 w-full h-px pointer-events-none z-[1000]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,234,0,0.3), transparent)',
        }}
        initial={{ top: -1, opacity: 0.3 }}
        animate={{ 
          top: ['0%', '100%'],
          opacity: [0.3, 0.5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          delay: 0.5,
        }}
        aria-hidden="true"
      />
    </>
  );
}
