'use client';

import { useRef, useCallback, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function GlitchText({ text, className, style, onHoverStart, onHoverEnd }: GlitchTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (isGlitching) return;
    
    const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const originalText = text;
    let iterations = 0;
    
    setIsGlitching(true);
    onHoverStart?.();
    
    const interval = setInterval(() => {
      if (!textRef.current) {
        clearInterval(interval);
        return;
      }
      
      textRef.current.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      iterations += 0.5;
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        if (textRef.current) {
          textRef.current.textContent = originalText;
        }
        setIsGlitching(false);
        onHoverEnd?.();
      }
    }, 30);
  }, [text, isGlitching, onHoverStart, onHoverEnd]);

  return (
    <span
      ref={textRef}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
    >
      {text}
    </span>
  );
}
