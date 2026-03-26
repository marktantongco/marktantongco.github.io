'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          width: isHovering ? 60 : isClicking ? 40 : 20,
          height: isHovering ? 60 : isClicking ? 40 : 20,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2"
          style={{
            borderColor: isClicking ? 'var(--blood)' : 'var(--electric)',
          }}
          animate={{
            scale: isHovering ? 1 : isClicking ? 0.8 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Dot cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-1 h-1 rounded-full"
          style={{
            background: isClicking ? 'var(--blood)' : 'var(--electric)',
          }}
          animate={{
            scale: isClicking ? 0 : 1,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-8 h-8 rounded-full border border-[var(--electric)] opacity-20"
          animate={{
            scale: isHovering ? 2 : 1.5,
            opacity: 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  );
}
