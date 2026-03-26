'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef, memo, useEffect } from 'react';

const socialLinks = [
  { 
    name: 'GITHUB', 
    href: 'https://github.com/marktantongco',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    color: 'var(--bone)',
  },
  { 
    name: 'TWITTER', 
    href: 'https://twitter.com/markytanky',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'var(--ice)',
  },
  { 
    name: 'LINKEDIN', 
    href: 'https://linkedin.com/in/marktantongco1',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'var(--electric)',
  },
];

// Unique CTA animation: Magnetic pull + pulse
const SocialLink = memo(function SocialLink({ link, index }: { link: typeof socialLinks[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 border-2 flex items-center justify-center transition-all duration-300 relative overflow-hidden"
      style={{
        borderColor: 'var(--rebar)',
        color: 'var(--ghost)',
      }}
      initial={{ 
        opacity: 0, 
        scale: 0, 
        rotate: -180,
        y: 20
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        y: 0
      }}
      viewport={{ once: true }}
      transition={{ 
        delay: 0.3 + index * 0.1, 
        duration: 0.5,
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      whileHover={{
        borderColor: link.color,
        color: link.color,
        boxShadow: `4px 4px 0 ${link.color}`,
        y: -3,
        scale: 1.1,
        rotate: [0, -10, 10, 0],
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: 180
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      aria-label={link.name}
    >
      {/* Pulse ring effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 border-2 rounded-none"
            style={{ borderColor: link.color }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
      
      {/* Background sweep */}
      <motion.div
        className="absolute inset-0 origin-bottom"
        style={{ background: link.color, opacity: 0.1 }}
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      <span className="relative z-10">{link.icon}</span>
    </motion.a>
  );
});

// Unique CTA: Glitch effect button
const GlitchButton = memo(function GlitchButton({ 
  children, 
  onClick, 
  disabled, 
  isSubmitted 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  disabled: boolean;
  isSubmitted: boolean;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      className="w-full text-base border-4 px-6 py-3 tracking-[0.1em] uppercase transition-all duration-150 disabled:opacity-50 relative overflow-hidden group"
      style={{
        fontFamily: 'var(--font-display)',
        color: isSubmitted ? 'var(--bone)' : 'var(--void)',
        background: isSubmitted ? 'var(--electric)' : 'var(--blood)',
        borderColor: isSubmitted ? 'var(--electric)' : 'var(--blood)',
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '8px 8px 0 var(--blood)',
        y: -2,
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: '2px 2px 0 var(--blood)',
        y: 0
      }}
    >
      {/* Glitch layers on hover */}
      <span className="relative z-10">{children}</span>
      
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-0 group-hover:opacity-100"
        style={{ borderColor: 'var(--electric)' }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100"
        style={{ borderColor: 'var(--electric)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
});

// Floating particles background for CTA section
// Using deterministic values to avoid hydration mismatch
const FloatingParticle = memo(function FloatingParticle({ 
  delay, 
  size, 
  color,
  initialX,
  animateX,
  duration
}: { 
  delay: number; 
  size: number; 
  color: string;
  initialX: number;
  animateX: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        opacity: 0.1,
      }}
      initial={{ y: 100, x: initialX, opacity: 0 }}
      animate={{
        y: -100,
        x: animateX,
        opacity: [0, 0.2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
});

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Deterministic floating particles - no Math.random() to avoid hydration mismatch
  const particles = [
    { delay: 0, size: 6, color: 'var(--blood)', initialX: -20, animateX: 40, duration: 4.5 },
    { delay: 0.3, size: 8, color: 'var(--electric)', initialX: 30, animateX: -10, duration: 5 },
    { delay: 0.6, size: 5, color: 'var(--blood)', initialX: 10, animateX: 60, duration: 4.2 },
    { delay: 0.9, size: 7, color: 'var(--electric)', initialX: -30, animateX: 20, duration: 5.5 },
    { delay: 1.2, size: 9, color: 'var(--blood)', initialX: 50, animateX: -40, duration: 4.8 },
    { delay: 1.5, size: 6, color: 'var(--electric)', initialX: -10, animateX: 50, duration: 5.2 },
    { delay: 1.8, size: 7, color: 'var(--blood)', initialX: 40, animateX: -20, duration: 4.6 },
    { delay: 2.1, size: 5, color: 'var(--electric)', initialX: -40, animateX: 30, duration: 5.3 },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-5 md:px-8 lg:px-12 pb-8 md:pb-10 relative overflow-hidden"
      aria-labelledby="contact-title"
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      <motion.div
        className="border-4 p-4 md:p-6 relative overflow-hidden"
        style={{
          borderColor: 'var(--blood)',
          boxShadow: '6px 6px 0 var(--blood)',
          rotate,
          scale,
          transformOrigin: 'center center',
        }}
        initial={{ opacity: 0, y: 40, rotateX: -10, rotateY: -5 }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          rotateY: 0,
          boxShadow: ['6px 6px 0 var(--blood)', '8px 8px 0 var(--blood)', '6px 6px 0 var(--blood)']
        }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{ 
          boxShadow: '10px 10px 0 var(--blood)',
          transition: { duration: 0.2 }
        }}
      >
        {/* Animated background watermark with wave */}
        <motion.div
          className="absolute -right-8 -bottom-8 text-[120px] md:text-[150px] leading-none pointer-events-none select-none"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--blood)',
            letterSpacing: '-0.05em',
            opacity: 0.04,
          }}
          animate={{ 
            rotate: [0, 2, 0, -2, 0],
            scale: [1, 1.02, 1, 0.98, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          aria-hidden="true"
        >
          CONTACT
        </motion.div>

        {/* Diagonal stripe accent */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 origin-left"
          style={{ background: 'var(--blood)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              {/* CTA Title with unique reveal */}
              <motion.h2
                id="contact-title"
                className="text-3xl md:text-4xl lg:text-5xl leading-[0.9] tracking-[-0.02em] mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--blood)',
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="block"
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  LET&apos;S
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  BUILD
                </motion.span>
                <motion.span
                  className="block cursor-pointer inline-block"
                  initial={{ y: 20, opacity: 0, rotateX: 90 }}
                  whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ 
                    scale: 1.05,
                    color: 'var(--electric)',
                    textShadow: '0 0 30px var(--electric)',
                    x: 5
                  }}
                >
                  BEASTS.
                </motion.span>
              </motion.h2>

              <motion.p
                className="text-[12px] leading-[1.6] mb-5 max-w-[380px] tracking-[0.05em]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ghost)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                You need something dangerous. Something that doesn&apos;t politely animate.
                Something <motion.strong 
                  style={{ color: 'var(--electric)' }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >MONUMENTAL</motion.strong>.
              </motion.p>

              {/* Social Links with magnetic effect */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <span
                  className="text-[11px] tracking-[0.15em] uppercase block mb-2"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  CONNECT //
                </span>
                <div className="flex gap-1.5">
                  {socialLinks.map((link, index) => (
                    <SocialLink key={link.name} link={link} index={index} />
                  ))}
                </div>
              </motion.div>

              {/* Quick Info with pulse */}
              <motion.div
                className="mt-5 p-2.5 border-2 relative overflow-hidden"
                style={{ borderColor: 'var(--rebar)' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--electric)' }}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                      boxShadow: ['0 0 0 var(--electric)', '0 0 10px var(--electric)', '0 0 0 var(--electric)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[11px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric)' }}
                  >
                    AVAILABLE FOR WORK
                  </span>
                </div>
                <p
                  className="text-[12px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  Currently accepting projects for Q1 2025. Response time: ~24 hours.
                </p>
              </motion.div>
            </div>

            {/* Contact Form with unique field animations */}
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="space-y-2">
                {/* Input fields with unique reveal */}
                {[
                  { key: 'name', label: 'NAME', type: 'text', placeholder: '' },
                  { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'EMAIL' },
                  { key: 'project', label: 'PROJECT TYPE', type: 'select' },
                  { key: 'message', label: 'YOUR MESSAGE', type: 'textarea' },
                ].map((field, index) => (
                  <motion.div
                    key={field.key}
                    className="relative"
                    initial={{ opacity: 0, y: 10, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                  >
                    {field.type === 'select' ? (
                      <>
                        <select
                          value={formState.project}
                          onChange={(e) => handleInputChange('project', e.target.value)}
                          className="w-full bg-transparent border-2 border-[var(--rebar)] px-3 py-3 text-[var(--bone)] focus:border-[var(--blood)] focus:outline-none transition-colors appearance-none cursor-pointer"
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                        >
                          <option value="" disabled style={{ background: 'var(--void)' }}>
                            PROJECT TYPE
                          </option>
                          <option value="webgpu" style={{ background: 'var(--void)' }}>WebGPU / 3D Web</option>
                          <option value="fullstack" style={{ background: 'var(--void)' }}>Full-Stack Application</option>
                          <option value="design" style={{ background: 'var(--void)' }}>UI/UX Design</option>
                          <option value="consulting" style={{ background: 'var(--void)' }}>Technical Consulting</option>
                          <option value="other" style={{ background: 'var(--void)' }}>Other</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[12px]" style={{ color: 'var(--ghost)' }}>▼</span>
                      </>
                    ) : field.type === 'textarea' ? (
                      <motion.textarea
                        placeholder={field.label}
                        value={formState.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        rows={4}
                        className="w-full bg-transparent border-2 border-[var(--rebar)] px-3 py-3 text-[var(--bone)] placeholder:text-[var(--ghost)] focus:border-[var(--blood)] focus:outline-none transition-colors resize-none"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                        whileFocus={{ scale: 1.003, borderColor: 'var(--blood)' }}
                        required
                      />
                    ) : (
                      <motion.input
                        type={field.type}
                        placeholder={field.placeholder || field.label}
                        value={formState[field.key as keyof typeof formState]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent border-2 border-[var(--rebar)] px-3 py-3 text-[var(--bone)] placeholder:text-[var(--ghost)] focus:border-[var(--blood)] focus:outline-none transition-colors"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                        whileFocus={{ scale: 1.005, borderColor: 'var(--blood)' }}
                        required
                      />
                    )}
                  </motion.div>
                ))}

                {/* Submit Button with unique glitch CTA */}
                <GlitchButton
                  onClick={() => {}}
                  disabled={isSubmitting || submitted}
                  isSubmitted={submitted}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⚙
                      </motion.span>
                      TRANSMITTING...
                    </span>
                  ) : submitted ? (
                    <motion.span 
                      className="flex items-center justify-center gap-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ✓ TRANSMITTED
                    </motion.span>
                  ) : (
                    'TRANSMIT MESSAGE →'
                  )}
                </GlitchButton>
              </div>
            </motion.form>
          </div>

          {/* Email direct link with slide CTA */}
          <motion.div
            className="mt-6 pt-4 border-t-2 flex flex-wrap items-center justify-between gap-3"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <span
              className="text-[11px] tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              PREFER EMAIL?
            </span>
            <motion.a
              href="mailto:mark@mat.dev"
              className="text-[12px] border-2 px-3 py-1.5 tracking-[0.1em] uppercase relative overflow-hidden group"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--electric)',
                borderColor: 'var(--electric)',
              }}
              whileHover={{
                boxShadow: '4px 4px 0 var(--electric)',
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 group-hover:text-[var(--void)] transition-colors duration-300">
                MARK@MAT.DEV
              </span>
              <motion.span
                className="absolute inset-0 bg-[var(--electric)] origin-bottom"
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
