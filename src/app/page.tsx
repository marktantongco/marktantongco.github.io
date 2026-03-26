'use client';

import dynamic from 'next/dynamic';
import { Navigation, Hero, Marquee, WebGPUDemo, Projects, About, CloudStack, Contact, Footer, ScanLine, PageLoader } from '@/components/portfolio';

// Dynamic imports for heavy components - loaded only when needed
const CustomCursor = dynamic(
  () => import('@/components/portfolio/custom-cursor').then((mod) => mod.CustomCursor),
  { ssr: false }
);

const ParticleCanvas = dynamic(
  () => import('@/components/portfolio/particle-canvas').then((mod) => mod.ParticleCanvas),
  { ssr: false, loading: () => null }
);

export default function Home() {
  return (
    <>
      {/* Page Loader */}
      <PageLoader />
      
      <main className="min-h-screen flex flex-col">
        {/* Scan Line Effect */}
        <ScanLine />
        
        {/* Custom Cursor - Client only */}
        <CustomCursor />
        
        {/* Particle Background - Lazy loaded */}
        <ParticleCanvas />

        {/* Main Content Wrapper */}
        <div className="relative z-[2] flex flex-col min-h-screen">
          {/* Navigation */}
          <Navigation />

          {/* Hero Section */}
          <Hero />

          {/* Marquee Strip */}
          <Marquee />

          {/* WebGPU Demo - Lazy loaded */}
          <WebGPUDemo />

          {/* Projects Section */}
          <Projects />

          {/* About / Skills Section */}
          <About />

          {/* Cloud Stack Section */}
          <CloudStack />

          {/* Contact CTA */}
          <Contact />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </>
  );
}
