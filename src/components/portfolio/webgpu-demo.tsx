'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DemoParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  isLeader: boolean;
  trail: { x: number; y: number }[];
}

export function WebGPUDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<DemoParticle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>(0);
  const frameRef = useRef(0);
  const initializedRef = useRef(false);
  const [stats, setStats] = useState({ entities: 0, leaders: 0, fps: 60 });
  const [isHovering, setIsHovering] = useState(false);

  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const createParticle = useCallback((dW: number, dH: number): DemoParticle => {
    return {
      x: dW / 2 + (Math.random() - 0.5) * dW * 0.6,
      y: dH / 2 + (Math.random() - 0.5) * dH * 0.6,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      life: 0,
      maxLife: 2 + Math.random() * 3,
      isLeader: Math.random() < 0.08,
      trail: [],
    };
  }, []);

  const initDemoParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const count = isMobile() ? 80 : 200;
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(canvas.width, canvas.height)
    );
  }, [isMobile, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || initializedRef.current) return;
    
    initializedRef.current = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    initDemoParticles();

    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - canvasRect.left) / canvasRect.width,
        y: (e.clientY - canvasRect.top) / canvasRect.height,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const canvasRect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) {
        mouseRef.current = {
          x: (t.clientX - canvasRect.left) / canvasRect.width,
          y: (t.clientY - canvasRect.top) / canvasRect.height,
        };
      }
    };

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
      initDemoParticles();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('resize', handleResize);

    const animateDemo = (currentTime: number) => {
      const dW = canvas.width;
      const dH = canvas.height;
      const { x: dMX, y: dMY } = mouseRef.current;

      // Calculate FPS
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }

      ctx.fillStyle = 'rgba(26,26,26,0.18)';
      ctx.fillRect(0, 0, dW, dH);

      particlesRef.current.forEach((p) => {
        const tx = dMX * dW;
        const ty = dMY * dH;
        const dx = tx - p.x;
        const dy = ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        const force = p.isLeader ? 0.08 : 0.015;

        p.vx += (dx / dist) * force + (Math.random() - 0.5) * 0.1;
        p.vy += (dy / dist) * force + (Math.random() - 0.5) * 0.1;

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 3) {
          p.vx *= 2.8 / spd;
          p.vy *= 2.8 / spd;
        }

        if (p.isLeader) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 18) p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.016;

        if (p.life > p.maxLife) {
          p.x = dW / 2 + (Math.random() - 0.5) * dW * 0.6;
          p.y = dH / 2 + (Math.random() - 0.5) * dH * 0.6;
          p.vx = (Math.random() - 0.5);
          p.vy = (Math.random() - 0.5);
          p.life = 0;
          p.trail = [];
        }

        const a = Math.min(1, p.life * 2) * (1 - Math.max(0, p.life - (p.maxLife - 0.5)) * 2) * 0.85;

        if (p.isLeader && p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const ta = (i / p.trail.length) * a * 0.5;
            ctx.strokeStyle = `rgba(0,245,255,${ta})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isLeader ? 3 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.isLeader ? `rgba(0,245,255,${a})` : `rgba(255,234,0,${a * 0.7})`;
        ctx.fill();
      });

      frameRef.current++;

      // Update stats
      if (frameRef.current % 30 === 0) {
        const leaders = particlesRef.current.filter((p) => p.isLeader).length;
        setStats({
          entities: particlesRef.current.length,
          leaders,
          fps,
        });
      }

      animationRef.current = requestAnimationFrame(animateDemo);
    };

    animateDemo();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initDemoParticles, createParticle]);

  return (
    <motion.section
      className="mx-6 md:mx-10 lg:mx-15 mb-20 border-4 relative overflow-hidden min-h-[300px]"
      style={{
        borderColor: 'var(--electric)',
        boxShadow: isHovering ? '12px 12px 0 var(--electric)' : '8px 8px 0 var(--electric)',
      }}
      aria-label="Interactive particle simulation"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        ref={containerRef}
        className="h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--concrete)' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          aria-label="Particle field simulation"
        />

        {/* Overlay labels */}
        <motion.div
          className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--electric)',
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[var(--electric)]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            PARTICLE_FIELD // LIVE
          </div>
        </motion.div>

        {/* Stats panel */}
        <motion.div
          className="absolute bottom-4 right-4 text-right"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="text-[10px] tracking-[0.1em] space-y-1"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost)',
            }}
            aria-live="polite"
          >
            <div className="flex items-center justify-end gap-2">
              <span className="text-[var(--electric)]">{stats.fps}</span>
              <span>FPS</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[var(--electric)]">{stats.entities}</span>
              <span>ENTITIES</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[var(--ice)]">{stats.leaders}</span>
              <span>LEADERS</span>
            </div>
          </div>
        </motion.div>

        {/* Interaction hint */}
        <motion.div
          className="absolute bottom-4 left-4 text-[9px] tracking-[0.1em] uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost)',
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          MOVE CURSOR TO ATTRACT
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
