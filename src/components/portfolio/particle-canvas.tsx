'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  role: number;
  hue: number;
  opacity: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>(0);
  const initializedRef = useRef(false);

  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const createParticle = useCallback((W: number, H: number): Particle => {
    const role = Math.random() < 0.05 ? 1 : Math.random() < 0.02 ? 2 : 0;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      life: Math.random(),
      maxLife: 0.6 + Math.random() * 0.4,
      role,
      hue: role === 1 ? 55 : role === 2 ? 185 : 45,
      opacity: Math.random() * 0.5 + 0.5,
    };
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const count = isMobile() ? 180 : 600;
    particlesRef.current = Array.from({ length: count }, () => 
      createParticle(canvas.width, canvas.height)
    );
  }, [isMobile, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initializedRef.current) return;
    
    initializedRef.current = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        mouseRef.current = {
          x: t.clientX / window.innerWidth,
          y: t.clientY / window.innerHeight,
        };
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let time = 0;

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      const { x: mouseX, y: mouseY } = mouseRef.current;
      
      time += 0.001;

      ctx.clearRect(0, 0, W, H);

      // Draw subtle grid effect
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 100;
      const offsetX = (time * 50) % gridSize;
      const offsetY = (time * 30) % gridSize;
      
      for (let x = -gridSize + offsetX; x < W + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < H + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw connections (skip on mobile for perf)
      if (!isMobile()) {
        ctx.lineWidth = 0.4;
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = dx * dx + dy * dy;
            if (d < 5000) {
              const alpha = (1 - d / 5000) * 0.12;
              ctx.strokeStyle = `rgba(255,234,0,${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw mouse glow
      const gradient = ctx.createRadialGradient(
        mouseX * W, mouseY * H, 0,
        mouseX * W, mouseY * H, 150
      );
      gradient.addColorStop(0, 'rgba(255, 234, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 234, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        // Subgroup leader: attracted to mouse
        if (p.role === 1) {
          const dx = mouseX * W - p.x;
          const dy = mouseY * H - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          p.vx += (dx / dist) * 0.04;
          p.vy += (dy / dist) * 0.04;
        }
        // Broadcaster: erratic orbit
        if (p.role === 2) {
          p.vx += Math.sin(Date.now() * 0.002 + p.x) * 0.02;
          p.vy += Math.cos(Date.now() * 0.002 + p.y) * 0.02;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx *= 0.96;
          p.vy *= 0.96;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.003;

        if (p.life > p.maxLife || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          Object.assign(p, createParticle(W, H));
        }

        const alpha = Math.sin((Math.PI * p.life) / p.maxLife) * 0.7 * p.opacity;
        const sz = p.role === 1 ? p.size * 2.5 : p.role === 2 ? p.size * 2 : p.size;
        
        // Draw glow for leaders
        if (p.role > 0) {
          const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 4);
          glowGradient.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${alpha * 0.3})`);
          glowGradient.addColorStop(1, `hsla(${p.hue}, 100%, 75%, 0)`);
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.role > 0 ? 75 : 55}%, ${alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, createParticle, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-[0.35] pointer-events-none"
      aria-hidden="true"
    />
  );
}
