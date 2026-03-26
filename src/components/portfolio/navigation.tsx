'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '#projects', label: 'Work' },
  { href: '#about', label: 'Stack' },
  { href: '#cloudstack', label: 'Cloud' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll state
      setScrolled(window.scrollY > 50);

      // Scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sections = ['hero', 'projects', 'about', 'cloudstack', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar in Nav */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[101]"
        style={{ background: 'var(--rebar)' }}
      >
        <motion.div
          className="h-full"
          style={{ 
            background: 'var(--electric)',
            width: `${scrollProgress}%`,
          }}
          transition={{ duration: 0.05 }}
        />
      </motion.div>

      <motion.nav
        className="fixed top-1 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:px-10 lg:px-15 border-b-4 transition-all duration-300"
        style={{
          borderColor: 'var(--electric)',
          background: scrolled ? 'rgba(0,0,0,0.95)' : 'var(--void)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Logo */}
        <motion.a
          href="#hero"
          className="text-lg md:text-2xl tracking-[0.15em] no-underline relative group"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--electric)',
          }}
          aria-label="Mark Anthony Tantongco Home"
          onClick={(e) => handleNavClick(e, '#hero')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">MAT.DEV</span>
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 bg-[var(--electric)]"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
          {/* Logo glow effect */}
          <motion.span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
            style={{
              color: 'var(--electric)',
            }}
          >
            MAT.DEV
          </motion.span>
        </motion.a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 lg:gap-8 list-none m-0 p-0">
          {navItems.map((item) => (
            <motion.li 
              key={item.href} 
              className="relative"
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
            >
              <a
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.12em] pb-1 transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? 'text-[var(--electric)]'
                    : 'text-[var(--ghost)] hover:text-[var(--bone)]'
                }`}
                style={{ fontFamily: 'var(--font-mono)' }}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
              {/* Active indicator */}
              {activeSection === item.href.slice(1) && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--electric)]"
                  layoutId="activeNavIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.li>
          ))}
        </ul>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 border-2"
            style={{ borderColor: 'var(--rebar)' }}
            whileHover={{ borderColor: 'var(--electric)' }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--electric)' }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span
              className="text-[9px] tracking-[0.12em] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--electric)',
              }}
            >
              GOD MODE
            </span>
          </motion.div>

          {/* Scroll percentage */}
          <motion.div
            className="text-[9px] tracking-[0.1em] tabular-nums"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 1 : 0 }}
          >
            {Math.round(scrollProgress)}%
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex flex-col gap-1.5 p-2 relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <motion.span
            className="w-6 h-0.5 bg-[var(--electric)]"
            animate={{ 
              rotate: mobileMenuOpen ? 45 : 0, 
              y: mobileMenuOpen ? 5 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-[var(--electric)]"
            animate={{ 
              opacity: mobileMenuOpen ? 0 : 1,
              x: mobileMenuOpen ? -10 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-[var(--electric)]"
            animate={{ 
              rotate: mobileMenuOpen ? -45 : 0, 
              y: mobileMenuOpen ? -5 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 border-b-4 bg-[var(--void)]"
              style={{ borderColor: 'var(--electric)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="flex flex-col p-6 gap-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <a
                      href={item.href}
                      className="text-2xl tracking-[0.1em] uppercase flex items-center justify-between"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: activeSection === item.href.slice(1) ? 'var(--electric)' : 'var(--ghost)',
                      }}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                      <motion.span
                        className="text-sm"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </a>
                  </motion.li>
                ))}
                
                {/* Mobile status */}
                <motion.li
                  className="pt-4 border-t"
                  style={{ borderColor: 'var(--rebar)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: 'var(--electric)' }}
                    />
                    <span
                      className="text-[10px] tracking-[0.12em] uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--electric)',
                      }}
                    >
                      GOD MODE ACTIVE
                    </span>
                  </div>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
