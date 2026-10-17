'use client';

import { useEffect, useRef, useCallback, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContextType {
  lenis: Lenis | null;
  scrollProgress: number;
}

const ScrollContext = createContext<ScrollContextType>({
  lenis: null,
  scrollProgress: 0,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

export function useSmoothScroll() {
  return useContext(ScrollContext).lenis;
}

export function useScrollProgress() {
  return useContext(ScrollContext).scrollProgress;
}

/**
 * SmoothScrollProvider
 *
 * Integrates Lenis smooth scrolling with GSAP ticker
 * per the cinematic-gsap-lenis-motion-system skill.
 * Respects prefers-reduced-motion.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      // No smooth scroll, just pass through
      const handleScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
          setScrollProgress(window.scrollY / maxScroll);
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // Initialize Lenis
    const lenisInstance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Sync Lenis with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP ticker
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Track scroll progress
    lenisInstance.on('scroll', (e: Lenis) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(e.scroll / maxScroll);
      }
    });

    // Set defaults
    gsap.defaults({ ease: 'power3.out', duration: 0.85 });

    // Refresh on load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ lenis, scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}
