'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import SymptomsSection from './components/SymptomsSection';
import PracticeSections from './components/PracticeSections';

// Dynamic imports to prevent SSR hydration mismatches
const SmoothScrollProvider = dynamic(
  () => import('./components/SmoothScrollProvider'),
  { ssr: false }
);

const GlobalHandGuide = dynamic(
  () => import('./components/GlobalHandGuide'),
  { ssr: false }
);

const HeroReference = dynamic(
  () => import('./components/HeroReference'),
  { ssr: false }
);

/**
 * Traverso Hand Surgery Landing Page
 *
 * Implements refined editorial aesthetic with persistent 3D scroll guide:
 * - Palette: Cream #F3F0E5, Ivory #E9E6D8, Olive #626747, Forest #2D3525, Muted #777667, Border #D8D3C3
 * - Global 3D anatomical hand scrolls from top to bottom, dynamically shifting between
 *   right and left based on content location (content left -> hand right, content right -> hand left).
 * - Rich interactivity: Shadcn-style condition breakdown dialogs, interactive anatomy tabs,
 *   step-by-step patient pathway accordion, interactive referral protocol, and consultation form.
 * - Synced Lenis smooth scroll with GSAP ticker per cinematic-gsap-lenis-motion-system.
 * - Performance Toggle: Allows users to turn off WebGL 3D rendering for faster load times and 0 GPU overhead.
 */
export default function Home() {
  const [activeAnatomy, setActiveAnatomy] = useState<string | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(true);

  // Restore 3D preference from localStorage (defaults to true)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('traverso_3d_enabled');
      if (stored !== null) {
        setIs3DEnabled(stored === 'true');
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const handleToggle3D = () => {
    setIs3DEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('traverso_3d_enabled', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <SmoothScrollProvider>
      {/* Subtle editorial film noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Global Persistent 3D Hand Canvas across all sections - completely unmounted when 3D is disabled */}
      {is3DEnabled && <GlobalHandGuide activeAnatomy={activeAnatomy} />}

      {/* Main Page Layout */}
      <div className="min-h-screen bg-[#F3F0E5] text-[#2D3525] flex flex-col relative selection:bg-[#626747]/20 selection:text-[#2D3525]">
        {/* Navigation Bar with 3D Performance Toggle */}
        <Navbar is3DEnabled={is3DEnabled} onToggle3D={handleToggle3D} />

        {/* Hero Section */}
        <main className="flex-1 relative pt-20 sm:pt-24 pointer-events-auto">
          <HeroReference />

          {/* Common Symptoms Section with Interactive Anatomy Hotspots */}
          <SymptomsSection onHoverAnatomy={setActiveAnatomy} />

          {/* About, Care Pathway, Referring Physicians & Interactive Consultation Form */}
          <PracticeSections />
        </main>
      </div>

      {/* Floating Performance Mode Quick-Toggle Pill in bottom-left */}
      <aside
        className="fixed bottom-5 left-5 z-40 pointer-events-auto"
        aria-label="3D Model and Performance Settings"
      >
        <button
          type="button"
          onClick={handleToggle3D}
          title={
            is3DEnabled
              ? 'Click to disable 3D model for maximum speed and lower battery usage'
              : 'Click to enable 3D interactive model guide'
          }
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer border ${
            is3DEnabled
              ? 'bg-[#FAF7F0]/90 text-[#2D3525] border-[#D8D3C3] hover:bg-[#FAF7F0] hover:border-[#626747]/60'
              : 'bg-[#626747] text-[#FAF7F0] border-[#626747] hover:bg-[#52563b]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-transform ${
              is3DEnabled
                ? 'bg-emerald-600 animate-pulse'
                : 'bg-amber-300 scale-110'
            }`}
          />
          <span className="font-mono text-[11px] uppercase tracking-wider">
            {is3DEnabled ? '3D Guide: Active' : '⚡ 3D Off • Fast Mode'}
          </span>
        </button>
      </aside>
    </SmoothScrollProvider>
  );
}
