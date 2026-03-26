'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { GlitchText } from './glitch-text';
import { memo, useRef } from 'react';

// Unique animation variants for HERO - Diagonal burst reveal
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, x: -30, y: 20, rotate: -3 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // Overshooting bounce
    },
  },
};

const heroTitleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    x: -100,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const subItems = [
  { label: 'Specialization', value: 'WebGPU Compute + React Three Fiber' },
  { label: 'Stack', value: 'Next.js · WGSL · GSAP · R3F' },
  { label: 'Mode', value: 'Subgroup Voting · Leader Election' },
  { label: 'Status', value: 'AVAILABLE FOR BRUTAL WORK' },
];

// Animated line component
const AnimatedLine = memo(function AnimatedLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span 
      className="inline-block w-6 md:w-8 h-0.5 bg-[var(--ghost)] origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
});

// Memoized sub-item with unique animation
const SubItem = memo(function SubItem({ item, index }: { item: typeof subItems[0]; index: number }) {
  return (
    <motion.div
      className="hero-sub-item group cursor-default relative"
      role="listitem"
      initial={{ opacity: 0, y: 15, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: 0.5 + index * 0.08, 
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      whileHover={{ 
        x: 4, 
        scale: 1.02,
        transition: { duration: 0.15 }
      }}
    >
      {/* Accent line on hover */}
      <motion.div
        className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--electric)] origin-top"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
      />
      <strong
        className="block text-[11px] md:text-[13px] mb-0.5 tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-[var(--electric)]"
        style={{ color: 'var(--bone)', fontFamily: 'var(--font-mono)' }}
      >
        {item.label}
      </strong>
      <span
        className="text-[10px] md:text-[12px] leading-relaxed tracking-[0.04em]"
        style={{ color: 'var(--ghost)', fontFamily: 'var(--font-mono)' }}
      >
        {item.value}
      </span>
    </motion.div>
  );
});

// Glowing orb background effect
const GlowingOrb = memo(function GlowingOrb({ className, color, delay = 0 }: { 
  className: string; 
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: [0, 0.6, 0.3]
      }}
      transition={{ 
        duration: 1.5, 
        delay,
        ease: 'easeOut'
      }}
    />
  );
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen flex flex-col justify-end pt-20 pb-6 px-5 md:pt-24 md:pb-8 md:px-8 lg:px-12 relative overflow-hidden"
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Animated background grid with parallax */}
      <motion.div 
        className="absolute inset-0 opacity-[0.025]" 
        aria-hidden="true"
        style={{ y }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--electric) 1px, transparent 1px),
              linear-gradient(90deg, var(--electric) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '80px 80px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>

      {/* Glowing orbs for depth */}
      <GlowingOrb className="w-[400px] h-[400px] -top-20 -right-20" color="var(--electric)" delay={0.3} />
      <GlowingOrb className="w-[300px] h-[300px] bottom-20 -left-10" color="var(--blood)" delay={0.5} />
      <GlowingOrb className="w-[200px] h-[200px] top-1/3 left-1/3" color="var(--ice)" delay={0.7} />

      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
        style={{ opacity, scale }}
      >
        {/* Status badge with sliding animation */}
        <motion.p
          variants={heroItemVariants}
          className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2 flex-wrap"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost)',
          }}
        >
          <AnimatedLine delay={0.15} />
          <motion.span 
            className="cursor-pointer px-1 py-0.5 -mx-1 relative overflow-hidden group/font"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover/font:text-[var(--void)]">DEUS ACTIVE</span>
            <motion.span 
              className="absolute inset-0 bg-[var(--electric)] origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.span>
          <span className="text-[var(--electric)]" aria-hidden="true">{'//'}</span>
          <motion.span 
            className="cursor-pointer px-1 py-0.5 -mx-1 relative overflow-hidden group/role"
            whileHover={{ scale: 1.02 }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover/role:text-[var(--void)]">Neo-Brutalist WebGPU Engineer</span>
            <motion.span 
              className="absolute inset-0 bg-[var(--electric)] origin-right"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.span>
        </motion.p>

        {/* Main heading with dramatic reveal */}
        <motion.h1
          id="hero-title"
          variants={heroTitleVariants}
          className="text-[clamp(3rem,10vw,12rem)] leading-[0.88] tracking-[-0.02em] mb-0"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--bone)',
          }}
        >
          {/* First name - Electric burst */}
          <motion.span
            className="block cursor-pointer relative"
            style={{
              color: 'var(--electric)',
              textShadow: 'clamp(3px, 0.5vw, 6px) clamp(3px, 0.5vw, 6px) 0 var(--rebar)',
            }}
            whileHover={{ 
              textShadow: 'clamp(5px, 0.8vw, 10px) clamp(5px, 0.8vw, 10px) 0 var(--rebar)',
              x: 4,
              y: 4,
              scale: 1.02
            }}
            transition={{ duration: 0.2, ease: 'backOut' }}
            itemProp="givenName"
          >
            <GlitchText text="MARK" className="inline" />
          </motion.span>
          
          {/* Middle name - Slide reveal */}
          <motion.span 
            className="block cursor-pointer"
            initial={{ opacity: 0.7 }}
            whileHover={{ 
              x: 10,
              opacity: 1,
              transition: { duration: 0.15 }
            }}
            itemProp="additionalName"
          >
            <GlitchText text="ANTHONY" className="inline" />
          </motion.span>
          
          {/* Last name - Outline effect */}
          <motion.span
            className="block cursor-pointer"
            whileHover={{
              WebkitTextStroke: '2px var(--electric)',
              textShadow: '0 0 30px var(--electric)',
            }}
            transition={{ duration: 0.2 }}
            style={{
              WebkitTextStroke: 'clamp(1px, 0.15vw, 2px) var(--bone)',
              color: 'transparent',
            }}
            itemProp="familyName"
          >
            <GlitchText text="TANTONGCO" className="inline" />
          </motion.span>
        </motion.h1>

        {/* Info grid with 3D flip animation */}
        <motion.div
          variants={heroItemVariants}
          className="mt-4 md:mt-5 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 border-t-4 pt-3 md:pt-4"
          style={{ borderColor: 'var(--electric)' }}
          role="list"
          aria-label="Professional information"
        >
          {subItems.map((item, index) => (
            <SubItem key={item.label} item={item} index={index} />
          ))}
        </motion.div>

        {/* Hidden structured data for SEO */}
        <div className="sr-only" aria-hidden="true">
          <span itemProp="jobTitle">WebGPU Engineer</span>
          <span itemProp="description">
            Neo-Brutalist WebGPU Engineer specializing in living digital organisms, 
            GPU compute shaders, and sentient particle systems.
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator with magnetic pulse */}
      <motion.div
        className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        aria-hidden="true"
      >
        <motion.div
          className="w-4 md:w-5 h-7 md:h-9 border-2 border-[var(--electric)] rounded-full flex justify-center relative"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Inner dot */}
          <motion.div
            className="w-0.5 md:w-1 h-2 md:h-2.5 bg-[var(--electric)] rounded-full mt-1.5 md:mt-2"
            animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 border-2 border-[var(--electric)] rounded-full"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
