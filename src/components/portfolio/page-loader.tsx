'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Use deterministic positions based on index to avoid SSR mismatch
const particlePositions = [
  { left: 20, top: 35 },
  { left: 35, top: 55 },
  { left: 50, top: 40 },
  { left: 65, top: 60 },
  { left: 80, top: 45 },
];

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--void)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
        >
          {/* Logo */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--electric)',
              }}
              animate={{
                textShadow: [
                  '0 0 0 var(--rebar)',
                  '8px 8px 0 var(--rebar)',
                  '0 0 0 var(--rebar)',
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              MAT.DEV
            </motion.h1>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-1 border border-[var(--rebar)] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: 'var(--electric)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-[10px] tracking-[0.2em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING PARTICLE FIELD
          </motion.p>

          {/* Decorative elements - using deterministic positions */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: 'var(--electric)',
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
