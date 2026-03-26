'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, memo } from 'react';

interface SocialLink {
  name: string;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { name: 'GitHub', href: 'https://github.com/marktantongco', label: 'GitHub Profile' },
  { name: 'Twitter', href: 'https://twitter.com/markytanky', label: 'Twitter Profile' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/marktantongco1', label: 'LinkedIn Profile' },
];

const techStack = ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebGPU'];

// Memoized tech badge for performance
const TechBadge = memo(function TechBadge({ tech }: { tech: string }) {
  return (
    <span
      className="text-[7px] md:text-[8px] border px-1.5 py-0.5 tracking-[0.05em] uppercase"
      style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--ghost)',
        borderColor: 'var(--rebar)',
      }}
    >
      {tech}
    </span>
  );
});

// Memoized social link for performance
const SocialLinkItem = memo(function SocialLinkItem({ link }: { link: SocialLink }) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase transition-colors duration-200"
      style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--bone)',
      }}
      whileHover={{ color: 'var(--electric)', x: 2 }}
      aria-label={link.label}
    >
      {link.name} →
    </motion.a>
  );
});

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [time, setTime] = useState('--:--:--');

  // Track scroll progress and update time on client
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[101] origin-left"
        style={{ background: 'var(--rebar)' }}
        aria-hidden="true"
      >
        <motion.div
          className="h-full"
          style={{ 
            background: 'var(--electric)',
            width: `${scrollProgress}%`,
          }}
        />
      </motion.div>

      <motion.footer
        className="border-t-4 relative overflow-hidden mt-auto"
        style={{ borderColor: 'var(--electric)' }}
        role="contentinfo"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        itemScope
        itemType="https://schema.org/WPFooter"
      >
        {/* Main Footer Content */}
        <div className="px-5 md:px-8 lg:px-12 py-4 md:py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Brand Section */}
            <div>
              <motion.h3
                className="text-lg md:text-xl mb-1.5"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--electric)',
                }}
                whileHover={{ x: 3 }}
                itemProp="name"
              >
                MAT.DEV
              </motion.h3>
              <p
                className="text-[8px] md:text-[9px] tracking-[0.1em] uppercase mb-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ghost)',
                }}
                itemProp="description"
              >
                Neo-Brutalist WebGPU Engineer
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--electric)' }}
                  aria-hidden="true"
                />
                <span
                  className="text-[8px] md:text-[9px] tracking-[0.15em] uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--electric)',
                  }}
                >
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>

            {/* Links Section */}
            <div>
              <span
                className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase block mb-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ghost)',
                }}
              >
                CONNECT //
              </span>
              <nav className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-1.5" aria-label="Social links">
                {socialLinks.map((link) => (
                  <SocialLinkItem key={link.name} link={link} />
                ))}
              </nav>

              {/* Tech Stack */}
              <div className="mt-3 md:mt-4">
                <span
                  className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase block mb-1.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--ghost)',
                  }}
                >
                  BUILT WITH //
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="md:text-right">
              <span
                className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase block mb-1.5"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ghost)',
                }}
              >
                STATUS //
              </span>
              
              {/* Live Time */}
              <div className="mb-2 md:mb-3">
                <span
                  className="text-[8px] md:text-[9px] tracking-[0.1em] uppercase block"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  LOCAL TIME
                </span>
                <motion.span
                  className="text-base md:text-lg font-bold tabular-nums"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--bone)',
                  }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {time}
                </motion.span>
              </div>

              {/* Scroll Progress */}
              <div>
                <span
                  className="text-[8px] md:text-[9px] tracking-[0.1em] uppercase block mb-1"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  SCROLL PROGRESS
                </span>
                <div className="w-full md:w-28 h-1 border" style={{ borderColor: 'var(--rebar)' }}>
                  <motion.div
                    className="h-full"
                    style={{ background: 'var(--electric)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${scrollProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span
                  className="text-[9px] md:text-[10px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric)' }}
                >
                  {Math.round(scrollProgress)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t-2 px-5 md:px-8 lg:px-12 py-2.5 md:py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3"
          style={{ borderColor: 'var(--rebar)' }}
        >
          <div
            className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-center md:text-left"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost)',
            }}
          >
            © {currentYear} MARK ANTHONY TANTONGCO {'//'} ALL RIGHTS RESERVED
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <span
              className="text-[8px] md:text-[9px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ghost)',
              }}
            >
              DEUS ACTIVE
            </span>
            <motion.div
              className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full"
              style={{ background: 'var(--blood)' }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
            <span
              className="text-[8px] md:text-[9px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ghost)',
              }}
            >
              ALL SYSTEMS BRUTAL
            </span>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div
          className="absolute -bottom-8 md:-bottom-10 -right-8 md:-right-10 text-[100px] md:text-[150px] leading-none pointer-events-none select-none opacity-[0.03]"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--electric)',
          }}
          aria-hidden="true"
        >
          2025
        </div>
      </motion.footer>
    </>
  );
}
