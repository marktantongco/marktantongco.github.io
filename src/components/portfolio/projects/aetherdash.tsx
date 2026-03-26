'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface AetherDashProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AetherDash({ isOpen, onClose }: AetherDashProps) {
  const [metrics, setMetrics] = useState([
    { label: 'GPU UTILIZATION', value: 87, unit: '%', color: 'var(--electric)' },
    { label: 'PARTICLE COUNT', value: 12480, unit: '', color: 'var(--ice)' },
    { label: 'FRAME TIME', value: 16.67, unit: 'ms', color: 'var(--electric)' },
    { label: 'COMPUTE LOAD', value: 92, unit: '%', color: 'var(--blood)' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; hue: number }[]>([]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize particles
    particlesRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      hue: Math.random() * 60 + 40,
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 0.8)`;
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          if (dx * dx + dy * dy < 3000) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: m.label === 'PARTICLE COUNT' 
            ? 12000 + Math.floor(Math.random() * 1000)
            : m.label === 'FRAME TIME'
            ? 16 + Math.random() * 2
            : m.value + (Math.random() - 0.5) * 5,
        }))
      );
    }, 1000);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(interval);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: 'var(--void)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <motion.header
            className="border-b-4 px-6 py-4 flex items-center justify-between"
            style={{ borderColor: 'var(--electric)' }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              <h1
                className="text-2xl md:text-4xl tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
              >
                AETHERDASH
              </h1>
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 border"
                style={{ borderColor: 'var(--electric)', color: 'var(--electric)' }}
              >
                LIVE ANALYTICS
              </span>
            </div>
            <div className="flex items-center gap-3">
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

          {/* Metrics Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b-4"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="p-4 md:p-6 border-r-2 last:border-r-0"
                style={{ borderColor: 'var(--rebar)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div
                  className="text-[10px] tracking-[0.15em] mb-2"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  {metric.label}
                </div>
                <div
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: metric.color }}
                >
                  {typeof metric.value === 'number' ? metric.value.toFixed(metric.unit === 'ms' ? 2 : 0) : metric.value}
                  <span className="text-lg ml-1">{metric.unit}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Overlay Panels */}
            <div className="absolute inset-0 pointer-events-none p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {/* Left Panel */}
                <motion.div
                  className="border-2 p-4 pointer-events-auto"
                  style={{ borderColor: 'var(--rebar)', background: 'rgba(0,0,0,0.8)' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3
                    className="text-lg mb-4 tracking-wider"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
                  >
                    WORKGROUP STATUS
                  </h3>
                  {['WG-0', 'WG-1', 'WG-2', 'WG-3'].map((wg, i) => (
                    <div key={wg} className="flex items-center justify-between py-2 border-b border-[var(--rebar)]">
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)', fontSize: '11px' }}>
                        {wg}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-24 h-2"
                          style={{ background: 'var(--rebar)' }}
                        >
                          <motion.div
                            className="h-full"
                            style={{ background: 'var(--electric)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${70 + Math.random() * 30}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                          />
                        </div>
                        <span
                          className="text-[10px]"
                          style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric)' }}
                        >
                          {Math.floor(70 + Math.random() * 30)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Center - Empty for canvas visibility */}
                <div />

                {/* Right Panel */}
                <motion.div
                  className="border-2 p-4 pointer-events-auto"
                  style={{ borderColor: 'var(--rebar)', background: 'rgba(0,0,0,0.8)' }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3
                    className="text-lg mb-4 tracking-wider"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
                  >
                    PARTICLE BEHAVIOR
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'SUBGROUP VOTES', value: '1,247' },
                      { label: 'LEADERS ELECTED', value: '32' },
                      { label: 'BROADCASTS', value: '8,421' },
                      { label: 'ATOMIC OPS', value: '156/s' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span
                          className="text-[10px]"
                          style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="text-sm"
                          style={{ fontFamily: 'var(--font-mono)', color: 'var(--ice)' }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            className="border-t-4 px-6 py-3 flex items-center justify-between"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--electric)' }} />
              <span
                className="text-[10px] tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                WEBGPU COMPUTE ACTIVE
              </span>
            </div>
            <span
              className="text-[10px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              NEXT.js · R3F · WGSL
            </span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
