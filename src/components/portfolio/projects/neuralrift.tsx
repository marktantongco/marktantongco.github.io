'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface NeuralRiftProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Organism {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
  generation: number;
  hue: number;
  neural: number[];
  trail: { x: number; y: number }[];
}

export function NeuralRift({ isOpen, onClose }: NeuralRiftProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const organismsRef = useRef<Organism[]>([]);
  const [stats, setStats] = useState({
    population: 0,
    generation: 1,
    avgEnergy: 0,
    mutations: 0,
  });
  const [isPaused, setIsPaused] = useState(false);

  const createOrganism = useCallback((x?: number, y?: number, parent?: Organism): Organism => {
    const canvas = canvasRef.current;
    return {
      x: x ?? (canvas ? Math.random() * canvas.width : 100),
      y: y ?? (canvas ? Math.random() * canvas.height : 100),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: parent ? parent.size + (Math.random() - 0.5) * 4 : 5 + Math.random() * 10,
      energy: 100,
      generation: parent ? parent.generation + 1 : 1,
      hue: parent ? (parent.hue + (Math.random() - 0.5) * 20) % 360 : Math.random() * 360,
      neural: Array.from({ length: 4 }, () => Math.random()),
      trail: [],
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize organisms
    if (organismsRef.current.length === 0) {
      organismsRef.current = Array.from({ length: 50 }, () => createOrganism());
    }

    let lastTime = 0;
    let mutations = 0;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16, 3);
      lastTime = time;

      // Dark fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw organisms
      organismsRef.current.forEach((org, i) => {
        // Neural network influences movement
        const neuralInfluence = org.neural.reduce((sum, n, idx) => {
          switch (idx) {
            case 0: return sum + Math.sin(time * 0.001 + org.x * 0.01) * n;
            case 1: return sum + Math.cos(time * 0.001 + org.y * 0.01) * n;
            case 2: return sum + Math.sin(time * 0.002) * n * 0.5;
            default: return sum + Math.cos(time * 0.002) * n * 0.5;
          }
        }, 0);

        org.vx += neuralInfluence * 0.1;
        org.vy += neuralInfluence * 0.1;

        // Energy decay
        org.energy -= 0.05;

        // Speed limit
        const speed = Math.sqrt(org.vx * org.vx + org.vy * org.vy);
        if (speed > 3) {
          org.vx *= 3 / speed;
          org.vy *= 3 / speed;
        }

        // Move
        org.x += org.vx * dt;
        org.y += org.vy * dt;

        // Bounce
        if (org.x < 0 || org.x > canvas.width) org.vx *= -1;
        if (org.y < 0 || org.y > canvas.height) org.vy *= -1;
        org.x = Math.max(0, Math.min(canvas.width, org.x));
        org.y = Math.max(0, Math.min(canvas.height, org.y));

        // Trail
        if (org.generation > 3) {
          org.trail.push({ x: org.x, y: org.y });
          if (org.trail.length > 15) org.trail.shift();
        }

        // Draw trail
        if (org.trail.length > 1) {
          ctx.strokeStyle = `hsla(${org.hue}, 100%, 60%, 0.3)`;
          ctx.lineWidth = org.size * 0.3;
          ctx.beginPath();
          ctx.moveTo(org.trail[0].x, org.trail[0].y);
          org.trail.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }

        // Draw organism
        const alpha = Math.min(1, org.energy / 50);
        
        // Glow
        const gradient = ctx.createRadialGradient(
          org.x, org.y, 0,
          org.x, org.y, org.size * 3
        );
        gradient.addColorStop(0, `hsla(${org.hue}, 100%, 70%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${org.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(org.x, org.y, org.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${org.hue}, 100%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(org.x, org.y, org.size, 0, Math.PI * 2);
        ctx.fill();

        // Energy indicator
        if (org.energy < 30) {
          ctx.strokeStyle = `rgba(255, 45, 0, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(org.x, org.y, org.size + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Reproduction
        if (org.energy > 150 && organismsRef.current.length < 150) {
          organismsRef.current.push(createOrganism(org.x, org.y, org));
          org.energy -= 50;
          mutations++;
        }

        // Death
        if (org.energy <= 0) {
          organismsRef.current.splice(i, 1);
        }
      });

      // Food particles
      if (Math.random() < 0.1) {
        ctx.fillStyle = 'rgba(0, 245, 255, 0.8)';
        const fx = Math.random() * canvas.width;
        const fy = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(fx, fy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Feed nearby organisms
        organismsRef.current.forEach((org) => {
          const dx = fx - org.x;
          const dy = fy - org.y;
          if (dx * dx + dy * dy < 10000) {
            org.energy += 10;
          }
        });
      }

      // Update stats
      if (time % 1000 < 20) {
        setStats({
          population: organismsRef.current.length,
          generation: Math.max(...organismsRef.current.map((o) => o.generation), 1),
          avgEnergy: organismsRef.current.length > 0
            ? organismsRef.current.reduce((sum, o) => sum + o.energy, 0) / organismsRef.current.length
            : 0,
          mutations,
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isOpen, isPaused, createOrganism]);

  const reset = () => {
    organismsRef.current = [];
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
          style={{ background: '#000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <motion.header
            className="border-b-4 px-6 py-4 flex items-center justify-between"
            style={{ borderColor: 'var(--ice)' }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-4">
              <h1
                className="text-2xl md:text-4xl tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
              >
                NEURALRIFT
              </h1>
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 border"
                style={{ borderColor: 'var(--ice)', color: 'var(--ice)' }}
              >
                AI PARTICLE ORGANISM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 border-2 text-[11px] tracking-wider"
                style={{ borderColor: 'var(--electric)', color: 'var(--electric)' }}
                whileHover={{ background: 'var(--electric)', color: 'var(--void)' }}
              >
                {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </motion.button>
              <motion.button
                onClick={reset}
                className="px-4 py-2 border-2 text-[11px] tracking-wider"
                style={{ borderColor: 'var(--blood)', color: 'var(--blood)' }}
                whileHover={{ background: 'var(--blood)', color: 'var(--bone)' }}
              >
                ↺ RESET
              </motion.button>
              <motion.button
                onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 border-2 text-[11px] tracking-wider uppercase flex items-center gap-2"
                style={{ borderColor: 'var(--ice)', color: 'var(--ice)' }}
                whileHover={{ background: 'var(--ice)', color: 'var(--void)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                HOME
              </motion.button>
              <motion.button
                onClick={onClose}
                className="text-2xl px-3 py-2 border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--blood)', color: 'var(--blood)' }}
                whileHover={{ background: 'var(--blood)', color: 'var(--bone)' }}
                aria-label="Close project"
              >
                ✕
              </motion.button>
            </div>
          </motion.header>

          {/* Main Canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 p-4 border-2" style={{ borderColor: 'var(--rebar)', background: 'rgba(0,0,0,0.8)' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] tracking-[0.15em] mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                    POPULATION
                  </div>
                  <div className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}>
                    {stats.population}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.15em] mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                    GENERATION
                  </div>
                  <div className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}>
                    {stats.generation}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.15em] mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                    AVG ENERGY
                  </div>
                  <div className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--blood)' }}>
                    {stats.avgEnergy.toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.15em] mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                    MUTATIONS
                  </div>
                  <div className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
                    {stats.mutations}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 p-4 border-2 text-[10px]" style={{ borderColor: 'var(--rebar)', background: 'rgba(0,0,0,0.8)' }}>
              <div className="mb-2 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}>
                BEHAVIOR
              </div>
              <div className="space-y-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--electric)' }} />
                  <span>YOUNG ORGANISM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--ice)' }} />
                  <span>NEURAL CONNECTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'var(--blood)' }} />
                  <span>LOW ENERGY</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <motion.div
              className="absolute top-4 right-4 p-4 border-2 max-w-xs"
              style={{ borderColor: 'var(--rebar)', background: 'rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-[9px] tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ice)' }}>
                HOW IT WORKS
              </div>
              <div className="text-[11px] leading-relaxed" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}>
                Each organism has a <span style={{ color: 'var(--electric)' }}>neural network</span> that influences its movement. 
                They <span style={{ color: 'var(--ice)' }}>feed on cyan particles</span> and 
                <span style={{ color: 'var(--blood)' }}> reproduce</span> when energy exceeds 150.
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            className="border-t-4 px-6 py-3 flex items-center justify-between"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ y: 30 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ice)' }} />
              <span
                className="text-[10px] tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                AUTONOMOUS EVOLUTION SYSTEM
              </span>
            </div>
            <span
              className="text-[10px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              WGSL · R3F · Bloom · GSAP
            </span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
