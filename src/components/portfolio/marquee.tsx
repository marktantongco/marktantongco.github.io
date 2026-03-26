'use client';

import { motion } from 'framer-motion';

const items = [
  { text: 'WEBGPU', color: 'var(--electric)' },
  { text: 'NEO-BRUTALISM', color: 'var(--bone)' },
  { text: 'SUBGROUP OPS', color: 'var(--electric)' },
  { text: 'R3F', color: 'var(--bone)' },
  { text: 'WGSL', color: 'var(--electric)' },
  { text: 'SENTIENT PARTICLES', color: 'var(--bone)' },
  { text: 'GSAP', color: 'var(--electric)' },
  { text: 'VIBE CODE', color: 'var(--bone)' },
];

export function Marquee() {
  return (
    <div
      className="border-y-4 py-3 overflow-hidden relative"
      style={{
        borderColor: 'var(--electric)',
        background: 'var(--electric)',
      }}
      aria-hidden="true"
    >
      {/* Gradient fade edges */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 z-10"
        style={{
          background: 'linear-gradient(to right, var(--electric), transparent)',
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-20 z-10"
        style={{
          background: 'linear-gradient(to left, var(--electric), transparent)',
        }}
      />

      {/* First row - left to right */}
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: [0, '-50%'] }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {[...items, ...items].map((item, index) => (
          <motion.span
            key={index}
            className="text-xl md:text-2xl lg:text-3xl tracking-[0.1em] px-6 md:px-12"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--void)',
            }}
            whileHover={{ scale: 1.1, color: 'var(--blood)' }}
          >
            {item.text}
          </motion.span>
        ))}
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-2 h-2 bg-[var(--void)] rounded-full"
        animate={{
          y: [-20, 20, -20],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-[var(--void)] rounded-full"
        animate={{
          y: [20, -20, 20],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      />
    </div>
  );
}
