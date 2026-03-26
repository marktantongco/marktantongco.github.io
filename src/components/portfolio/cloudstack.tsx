'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';

interface CloudStack {
  id: string;
  name: string;
  provider: string;
  description: string;
  database: string;
  automation: string;
  features: string[];
  limits: string;
  color: string;
  icon: string;
}

const cloudStacks: CloudStack[] = [
  {
    id: 'vercel',
    name: 'VERCEL STACK',
    provider: 'Vercel + Neon + GitHub',
    description: 'Perfect for Next.js apps with serverless PostgreSQL and automated deployments',
    database: 'Neon (PostgreSQL) — 0.5GB free',
    automation: 'GitHub Actions — Auto-deploy on push',
    features: ['Edge Functions', 'Preview Deployments', 'Auto SSL', 'Analytics'],
    limits: '100GB bandwidth, 100 builds/day',
    color: 'var(--electric)',
    icon: '▲',
  },
  {
    id: 'railway',
    name: 'RAILWAY STACK',
    provider: 'Railway + PostgreSQL + Render',
    description: 'Full-stack deployment with containerized services and managed databases',
    database: 'Railway PostgreSQL — 1GB free',
    automation: 'GitHub Integration — Auto-rebuild',
    features: ['Docker Support', 'Cron Jobs', 'Redis Cache', 'Metrics'],
    limits: '$5 credit/month, 512MB RAM',
    color: 'var(--ice)',
    icon: '◆',
  },
  {
    id: 'supabase',
    name: 'SUPABASE STACK',
    provider: 'Supabase + Vercel + Cloudflare',
    description: 'Open-source Firebase alternative with real-time database and auth',
    database: 'Supabase PostgreSQL — 500MB free',
    automation: 'Supabase CLI + GitHub Actions',
    features: ['Real-time Sync', 'Auth/RLS', 'Storage', 'Edge Functions'],
    limits: '500MB database, 1GB storage, 50K MAU',
    color: 'var(--blood)',
    icon: '●',
  },
  {
    id: 'planetscale',
    name: 'PLANETSCALE STACK',
    provider: 'PlanetScale + Cloudflare + Fly.io',
    description: 'Serverless MySQL with branching, edge computing, and global distribution',
    database: 'PlanetScale MySQL — 5GB free',
    automation: 'Prisma Migrate + GitHub Actions',
    features: ['Branching', 'Auto-scaling', 'Edge Queries', 'No connection limits'],
    limits: '1B rows read/month, 10M rows written',
    color: 'var(--ghost)',
    icon: '◈',
  },
];

// Memoized card for performance
const StackCard = memo(function StackCard({ stack, index }: { stack: CloudStack; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current && !isExpanded) {
      gsap.to(cardRef.current, {
        borderColor: stack.color,
        boxShadow: `6px 6px 0 ${stack.color}`,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(iconRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.35,
        ease: 'back.out(1.7)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current && !isExpanded) {
      gsap.to(cardRef.current, {
        borderColor: 'var(--rebar)',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    timelineRef.current = gsap.timeline();
    
    if (!isExpanded) {
      // Expand animation
      gsap.to(cardRef.current, {
        borderColor: stack.color,
        boxShadow: `8px 8px 0 ${stack.color}`,
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      // Collapse animation
      gsap.to(cardRef.current, {
        borderColor: 'var(--rebar)',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="border-4 p-3 relative overflow-hidden cursor-pointer transition-all duration-300 group"
      style={{
        borderColor: 'var(--rebar)',
        marginRight: '-4px',
        marginBottom: '-4px',
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            ref={iconRef}
            className="w-7 h-7 flex items-center justify-center border-2 text-sm"
            style={{
              borderColor: stack.color,
              color: stack.color,
            }}
          >
            {stack.icon}
          </div>
          <div>
            <h3
              className="text-sm md:text-base leading-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--bone)',
              }}
            >
              {stack.name}
            </h3>
            <span
              className="text-[7px] tracking-[0.1em] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                color: stack.color,
              }}
            >
              {stack.provider}
            </span>
          </div>
        </div>
        <motion.span
          className="text-[9px] px-1.5 py-0.5 border"
          style={{
            borderColor: stack.color,
            color: stack.color,
            fontFamily: 'var(--font-mono)',
          }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </div>

      {/* Description */}
      <p
        className="text-[9px] leading-relaxed"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--ghost)',
        }}
      >
        {stack.description}
      </p>

      {/* Expanded Content */}
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="space-y-1.5 pt-2 mt-2 border-t" style={{ borderColor: 'var(--rebar)' }}>
          {/* Database */}
          <div>
            <span
              className="text-[8px] tracking-[0.1em] uppercase block mb-0.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              DATABASE
            </span>
            <span
              className="text-[10px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--bone)' }}
            >
              {stack.database}
            </span>
          </div>

          {/* Automation */}
          <div>
            <span
              className="text-[8px] tracking-[0.1em] uppercase block mb-0.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              AUTOMATION
            </span>
            <span
              className="text-[10px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--bone)' }}
            >
              {stack.automation}
            </span>
          </div>

          {/* Features */}
          <div>
            <span
              className="text-[8px] tracking-[0.1em] uppercase block mb-1"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              FEATURES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stack.features.map((feature) => (
                <span
                  key={feature}
                  className="text-[8px] border px-1.5 py-0.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: stack.color,
                    borderColor: stack.color,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Limits */}
          <div>
            <span
              className="text-[8px] tracking-[0.1em] uppercase block mb-0.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              FREE LIMITS
            </span>
            <span
              className="text-[9px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--blood)' }}
            >
              {stack.limits}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
        style={{ background: stack.color }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${stack.color}15 50%)`,
        }}
      />
    </motion.div>
  );
});

export function CloudStack() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { letterSpacing: '0.3em', opacity: 0.5, x: -30 },
              { 
                letterSpacing: '-0.01em', 
                opacity: 1, 
                x: 0,
                duration: 1, 
                ease: 'power3.out' 
              }
            );
          }
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cloudstack"
      className="px-6 md:px-10 lg:px-15 pb-10"
      aria-labelledby="cloudstack-title"
    >
      {/* Header */}
      <motion.p
        className="text-[10px] tracking-[0.3em] uppercase mb-2"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--ghost)',
        }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Deployment / Free Tier Options
      </motion.p>

      <motion.h2
        ref={titleRef}
        id="cloudstack-title"
        className="text-4xl md:text-6xl lg:text-[70px] leading-[0.9] tracking-[-0.01em] mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--bone)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        CLOUD STACK
      </motion.h2>

      {/* Intro Text */}
      <motion.div
        className="mb-4 max-w-2xl"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <p
          className="text-[10px] leading-relaxed"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost)',
          }}
        >
          Production-ready deployment stacks with <strong style={{ color: 'var(--electric)' }}>free tier</strong> options. 
          Each stack includes database, CI/CD automation, and essential features.
        </p>
      </motion.div>

      {/* Stack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {cloudStacks.map((stack, index) => (
          <StackCard key={stack.id} stack={stack} index={index} />
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        className="mt-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--electric)' }}
        />
        <span
          className="text-[8px] tracking-[0.15em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
        >
          CLICK CARDS TO EXPAND • ALL STACKS OFFER FREE TIERS
        </span>
      </motion.div>
    </section>
  );
}
