'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';

// Skills with proficiency percentages
const technicalSkills = [
  { name: 'TypeScript / JavaScript', level: 95, color: 'var(--electric)' },
  { name: 'React / Next.js', level: 92, color: 'var(--electric)' },
  { name: 'WebGPU / WebGL', level: 88, color: 'var(--ice)' },
  { name: 'Node.js / Bun', level: 90, color: 'var(--blood)' },
  { name: 'Three.js / R3F', level: 85, color: 'var(--ice)' },
  { name: 'Prisma / PostgreSQL', level: 87, color: 'var(--blood)' },
];

// Skill category cards - Now includes COMPATIBILITY
const skillCards = [
  {
    title: 'FRONTEND',
    icon: 'CODE',
    description: 'React · Next.js · TypeScript · Tailwind',
    color: 'var(--electric)',
  },
  {
    title: 'BACKEND',
    icon: 'DATABASE',
    description: 'Node.js · Bun · Prisma · PostgreSQL',
    color: 'var(--blood)',
  },
  {
    title: 'COMPUTE',
    icon: 'CPU',
    description: 'WebGPU · WGSL · WebGL · Shaders',
    color: 'var(--ice)',
  },
  {
    title: 'SECURITY',
    icon: 'SHIELD',
    description: 'Auth · Encryption · Best Practices',
    color: 'var(--ghost)',
  },
  {
    title: 'COMPATIBILITY',
    icon: 'PUZZLE',
    description: 'Cross-Browser · Fallbacks · Polyfills',
    color: 'var(--bone)',
  },
];

// Unique animation: Skill bar with wave effect
const SkillBar = memo(function SkillBar({ skill, index }: { skill: typeof technicalSkills[0]; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasAnimatedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            timelineRef.current = gsap.timeline();
            
            timelineRef.current
              .fromTo(
                fillRef.current,
                { width: '0%', rotationX: 45 },
                {
                  width: `${skill.level}%`,
                  rotationX: 0,
                  duration: 1.4,
                  delay: index * 0.08,
                  ease: 'power4.out',
                }
              )
              .fromTo(
                percentRef.current,
                { textContent: '0', opacity: 0, scale: 0.5 },
                {
                  textContent: skill.level,
                  opacity: 1,
                  scale: 1,
                  duration: 0.8,
                  ease: 'back.out(2)',
                  snap: { textContent: 1 },
                  onUpdate: function () {
                    if (percentRef.current) {
                      percentRef.current.textContent = Math.round(
                        parseFloat(percentRef.current.textContent || '0')
                      ).toString();
                    }
                  },
                },
                index * 0.08
              );
          }
        });
      },
      { threshold: 0.2 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => {
      observer.disconnect();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [skill.level, index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    gsap.to(fillRef.current, {
      boxShadow: `0 0 25px ${skill.color}, 0 0 50px ${skill.color}50`,
      scaleY: 1.3,
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(barRef.current, {
      x: 5,
      duration: 0.15,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(fillRef.current, {
      boxShadow: 'none',
      scaleY: 1,
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(barRef.current, {
      x: 0,
      duration: 0.15,
      ease: 'power2.out',
    });
  };

  return (
    <motion.div
      ref={barRef}
      className="group cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-[11px] md:text-[13px] tracking-[0.14em] uppercase transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-mono)',
            color: isHovered ? skill.color : 'var(--bone)',
          }}
        >
          {skill.name}
        </span>
        <span
          ref={percentRef}
          className="text-[11px] md:text-[13px] font-bold tabular-nums"
          style={{
            fontFamily: 'var(--font-mono)',
            color: skill.color,
          }}
        >
          0
        </span>
      </div>
      <div
        className="h-1.5 border-2 overflow-hidden relative"
        style={{
          borderColor: 'var(--rebar)',
        }}
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 0.6, ease: 'linear' }}
        />
        <div
          ref={fillRef}
          className="h-full transition-all duration-300 origin-left"
          style={{
            width: '0%',
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
          }}
        />
      </div>
    </motion.div>
  );
});

// Unique animation: Card with 3D flip on scroll
const SkillCard = memo(function SkillCard({ card, index }: { card: typeof skillCards[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      borderColor: card.color,
      boxShadow: `6px 6px 0 ${card.color}`,
      rotateY: 5,
      rotateX: -3,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
    gsap.to(iconRef.current, {
      scale: 1.2,
      rotation: 360,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });
    gsap.to(accentRef.current, {
      width: '100%',
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      borderColor: 'var(--rebar)',
      boxShadow: 'none',
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to(accentRef.current, {
      width: 0,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="border-4 p-2.5 md:p-3 relative overflow-hidden cursor-default group"
      style={{
        borderColor: 'var(--rebar)',
        marginRight: '-4px',
        marginBottom: '-4px',
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, rotateX: 90, y: 30 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon */}
      <div
        ref={iconRef}
        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border-2 mb-1.5 md:mb-2"
        style={{
          borderColor: card.color,
          color: card.color,
        }}
        aria-hidden="true"
      >
        {card.icon === 'CODE' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        )}
        {card.icon === 'DATABASE' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        )}
        {card.icon === 'CPU' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
          </svg>
        )}
        {card.icon === 'SHIELD' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        )}
        {card.icon === 'PUZZLE' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/>
          </svg>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-sm md:text-base mb-0.5"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--bone)',
        }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p
        className="text-[10px] md:text-[12px] tracking-[0.1em] uppercase"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--ghost)',
        }}
      >
        {card.description}
      </p>

      {/* Bottom accent line */}
      <div
        ref={accentRef}
        className="absolute bottom-0 left-0 h-0.5 w-0"
        style={{ background: card.color }}
      />
      
      {/* Corner accent on hover */}
      <motion.div
        className="absolute top-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${card.color}40 50%)`,
        }}
      />
    </motion.div>
  );
});

export function About() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { 
                letterSpacing: '0.3em', 
                opacity: 0.5, 
                x: -30,
                skewX: -10
              },
              { 
                letterSpacing: '-0.01em', 
                opacity: 1, 
                x: 0,
                skewX: 0,
                duration: 1, 
                ease: 'power3.out' 
              }
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="px-5 md:px-8 lg:px-12 pb-8 md:pb-10 relative"
      aria-labelledby="about-title"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      {/* Animated background shape */}
      <motion.div
        className="absolute right-0 top-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] pointer-events-none opacity-[0.02]"
        style={{
          background: 'var(--electric)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          y
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <motion.p
        className="text-[11px] md:text-[13px] tracking-[0.3em] uppercase mb-2"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--ghost)',
        }}
        initial={{ opacity: 0, x: -20, skewX: -5 }}
        whileInView={{ opacity: 1, x: 0, skewX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        About / The Organism
      </motion.p>

      <motion.h2
        ref={titleRef}
        id="about-title"
        className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-[-0.01em] mb-4 md:mb-5"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--bone)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        STACK
      </motion.h2>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 relative z-10" style={{ opacity }}>
        {/* Left: About Text */}
        <motion.div
          initial={{ opacity: 0, x: -30, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <article
            className="border-4 p-3 md:p-4 relative overflow-hidden group"
            style={{
              borderColor: 'var(--electric)',
              boxShadow: '5px 5px 0 var(--electric)',
            }}
          >
            {/* Decorative corner */}
            <motion.div
              className="absolute -top-1 -right-1 w-5 md:w-6 h-5 md:h-6"
              style={{
                background: 'var(--electric)',
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
              whileHover={{ scale: 1.5, rotate: 45 }}
              aria-hidden="true"
            />

            <p
              className="text-[13px] md:text-[15px] leading-[1.65] font-light tracking-[0.03em]"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--bone)',
              }}
              itemProp="description"
            >
              I build{' '}
              <motion.strong 
                style={{ color: 'var(--electric)', fontWeight: 700 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                living digital organisms
              </motion.strong>{' '}
              — interfaces that vote, broadcast, and physically react. My work fuses{' '}
              <motion.strong 
                style={{ color: 'var(--electric)', fontWeight: 700 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Neo-Brutalist design
              </motion.strong>{' '}
              with{' '}
              <motion.strong 
                style={{ color: 'var(--electric)', fontWeight: 700 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                bleeding-edge WebGPU compute
              </motion.strong>
              , shipping 64-thread workgroups with subgroup intelligence.
            </p>
          </article>

          {/* Skill Cards Grid - Now 5 cards with Compatibility */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-0 mt-3 md:mt-4" role="list" aria-label="Skill categories">
            {skillCards.map((card, index) => (
              <SkillCard key={card.title} card={card} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Right: Skill Bars */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotateY: -15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.h3
            className="text-sm md:text-base mb-2.5 md:mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--electric)',
            }}
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            whileInView={{ opacity: 1, letterSpacing: '-0.01em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            PROFICIENCY
          </motion.h3>

          <div className="space-y-2.5 md:space-y-3" role="list" aria-label="Technical skills">
            {technicalSkills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>

          {/* Additional Info */}
          <motion.aside
            className="mt-3 md:mt-4 p-2 md:p-2.5 border-2"
            style={{ borderColor: 'var(--rebar)' }}
            aria-label="Currently exploring"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--electric)' }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-hidden="true"
              />
              <span
                className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                Currently exploring
              </span>
            </div>
            <p
              className="text-[12px] md:text-[14px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--bone)' }}
            >
              AI/ML Integration · WebGPU Subgroups · Real-time 3D
            </p>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
