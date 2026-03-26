'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, memo, useRef } from 'react';
import { AetherDash } from './projects/aetherdash';
import { VoidMart } from './projects/voidmart';
import { CryptoVault } from './projects/cryptovault';
import { NeuralRift } from './projects/neuralrift';

interface Project {
  id: string;
  num: string;
  name: string;
  type: string;
  tech: string[];
  color: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 'aetherdash',
    num: '001',
    name: 'AETHERDASH',
    type: 'Real-time Analytics Dashboard',
    tech: ['WebGPU', 'Next.js', 'R3F'],
    color: 'var(--electric)',
    description: 'Real-time analytics dashboard with WebGPU-powered visualizations',
  },
  {
    id: 'voidmart',
    num: '002',
    name: 'VOIDMART',
    type: 'Brutalist E-Commerce Engine',
    tech: ['Shopify', 'GSAP', 'Three.js'],
    color: 'var(--ice)',
    description: 'Brutalist e-commerce platform with immersive 3D experiences',
  },
  {
    id: 'cryptovault',
    num: '003',
    name: 'CRYPTOVAULT',
    type: 'Volatility Tracker + WebGPU Heatmap',
    tech: ['WebGPU', 'D3.js', 'WebSocket'],
    color: 'var(--blood)',
    description: 'Cryptocurrency volatility tracker with real-time WebGPU heatmap',
  },
  {
    id: 'neuralrift',
    num: '004',
    name: 'NEURALRIFT',
    type: 'AI-Driven Particle Organism',
    tech: ['WGSL', 'R3F', 'GSAP'],
    color: 'var(--electric)',
    description: 'AI-driven particle organism with GPU compute shaders',
  },
];

// Unique 3D flip card animation
const ProjectCard = memo(function ProjectCard({ 
  project, 
  index, 
  onOpen 
}: { 
  project: Project; 
  index: number; 
  onOpen: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      className="border-4 p-3 md:p-4 cursor-pointer relative overflow-hidden transition-all duration-300 group preserve-3d"
      style={{
        borderColor: 'var(--rebar)',
        marginRight: '-4px',
        marginBottom: '-4px',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      tabIndex={0}
      role="listitem"
      initial={{ 
        opacity: 0, 
        y: 50, 
        rotateX: -30,
        rotateY: index % 2 === 0 ? -15 : 15,
        scale: 0.9
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        rotateY: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      whileHover={{
        borderColor: 'var(--electric)',
        boxShadow: '8px 8px 0 var(--electric)',
        zIndex: 10,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project.id);
        }
      }}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Animated background sweep */}
      <motion.div
        className="absolute inset-0 z-0 origin-bottom"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.25, ease: [0.77, 0, 0.175, 1] }}
        style={{ 
          background: 'var(--electric)',
          transformStyle: 'preserve-3d'
        }}
        aria-hidden="true"
      />

      {/* Scan line effect on hover */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
        initial={{ y: '-100%' }}
        whileHover={{ y: '100%' }}
        transition={{ duration: 0.8, ease: 'linear' }}
        aria-hidden="true"
      />

      {/* Corner accent with glow */}
      <motion.div
        className="absolute top-0 right-0 w-10 md:w-12 h-10 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${project.color}30 50%)`,
        }}
        aria-hidden="true"
      />

      {/* Glowing dot in corner */}
      <motion.div
        className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
        style={{ 
          background: project.color,
          boxShadow: `0 0 10px ${project.color}, 0 0 20px ${project.color}`
        }}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        aria-hidden="true"
      />

      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {/* Top row: Number + View button */}
        <div className="flex items-start justify-between mb-1.5 md:mb-2">
          <motion.span
            className="text-[10px] md:text-[12px] tracking-[0.2em] group-hover:text-[var(--void)] transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost)',
            }}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.2 }}
            aria-label={`Project ${project.num}`}
          >
            {project.num}
          </motion.span>
          
          {/* Animated button */}
          <motion.button
            className="text-[10px] md:text-[12px] border-2 px-2 py-0.5 md:py-1 tracking-[0.1em] uppercase no-underline whitespace-nowrap group-hover:bg-[var(--void)] group-hover:text-[var(--electric)] group-hover:border-[var(--void)] transition-all duration-300 relative overflow-hidden"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--electric)',
              borderColor: 'var(--electric)',
            }}
            aria-label={`View ${project.name} project details`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project.id);
            }}
          >
            <span className="relative z-10">VIEW →</span>
            {/* Button sweep effect */}
            <motion.span
              className="absolute inset-0 bg-[var(--electric)] origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
              style={{ zIndex: 0 }}
            />
          </motion.button>
        </div>

        {/* Project Name with glitch on hover */}
        <motion.h3
          className="text-lg md:text-xl lg:text-2xl leading-[0.9] tracking-[-0.01em] mb-1 group-hover:text-[var(--void)] transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--bone)',
          }}
          whileHover={{ 
            x: 8,
            textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
          }}
          transition={{ duration: 0.12 }}
          itemProp="name"
        >
          {project.name}
        </motion.h3>

        {/* Type */}
        <p
          className="text-[10px] md:text-[12px] mb-1.5 md:mb-2 tracking-[0.1em] group-hover:text-[var(--rebar)] transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost)',
          }}
          itemProp="applicationCategory"
        >
          {project.type}
        </p>

        {/* Tech tags with staggered animation */}
        <div className="flex flex-wrap gap-1" aria-label="Technologies used">
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              className="text-[9px] md:text-[11px] border px-1.5 py-0.5 tracking-[0.05em] uppercase group-hover:border-[var(--void)] group-hover:text-[var(--void)] transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ghost)',
                borderColor: 'var(--rebar)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + i * 0.05 + 0.3 }}
              whileHover={{ 
                scale: 1.1, 
                background: 'var(--void)',
                color: project.color,
                borderColor: project.color
              }}
              itemProp="keywords"
            >
              {t}
            </motion.span>
          ))}
        </div>

        {/* Hidden description for SEO */}
        <span className="sr-only" itemProp="description">
          {project.description}
        </span>
      </div>

      {/* Bottom progress line with wave animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-[var(--electric)] group-hover:bg-[var(--void)]"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.25, ease: [0.77, 0, 0.175, 1] }}
        aria-hidden="true"
      />
    </motion.article>
  );
});

export function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const openProject = (id: string) => {
    setActiveProject(id);
  };

  const closeProject = () => {
    setActiveProject(null);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="px-5 md:px-8 lg:px-12 pb-10 md:pb-12 relative"
        aria-labelledby="projects-title"
        itemScope
        itemType="https://schema.org/ItemList"
        style={{ perspective: '1000px' }}
      >
        {/* Animated background shape */}
        <motion.div
          className="absolute left-0 top-0 w-[300px] h-[300px] pointer-events-none opacity-[0.02]"
          style={{
            background: 'var(--electric)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            y: backgroundY
          }}
          aria-hidden="true"
        />

        {/* Header with typewriter effect */}
        <motion.p
          className="text-[11px] md:text-[13px] tracking-[0.3em] uppercase mb-2"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost)',
          }}
          initial={{ opacity: 0, x: -20, skewX: -10 }}
          whileInView={{ opacity: 1, x: 0, skewX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          Selected Work / 2023—2025
        </motion.p>

        <motion.h2
          id="projects-title"
          className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-[-0.01em] mb-5 md:mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--bone)',
          }}
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          PROJECTS
        </motion.h2>

        {/* Compact Grid - 2x2 with 3D effects */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-0" 
          role="list" 
          aria-label="Project portfolio"
          style={{ perspective: '2000px' }}
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onOpen={openProject}
            />
          ))}
        </div>

        {/* Footer hint with pulse animation */}
        <motion.p
          className="text-center mt-4 md:mt-5 text-[9px] md:text-[11px] tracking-[0.2em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CLICK ANY PROJECT TO VIEW DEMO
          </motion.span>
        </motion.p>
      </section>

      {/* Project Demos */}
      <AetherDash isOpen={activeProject === 'aetherdash'} onClose={closeProject} />
      <VoidMart isOpen={activeProject === 'voidmart'} onClose={closeProject} />
      <CryptoVault isOpen={activeProject === 'cryptovault'} onClose={closeProject} />
      <NeuralRift isOpen={activeProject === 'neuralrift'} onClose={closeProject} />
    </>
  );
}
