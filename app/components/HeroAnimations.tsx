'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroAnimations
 *
 * GSAP timeline for the hero section's text and UI elements.
 * Choreography: label → heading → subheading → CTA
 * Following the cinematic-gsap-lenis-motion-system skill's choreography rules.
 */
export default function HeroAnimations() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      // Make everything visible immediately
      gsap.set(
        ['.hero-label', '.hero-heading', '.hero-subheading', '.hero-cta-group', '.scroll-indicator'],
        { opacity: 1, y: 0, filter: 'none' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.6,
        defaults: {
          ease: 'power4.out',
        },
      });

      // Label fade in
      tl.fromTo(
        '.hero-label',
        { y: 20, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 }
      );

      // Heading reveal
      tl.fromTo(
        '.hero-heading',
        { y: 40, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1 },
        '-=0.4'
      );

      // Subheading
      tl.fromTo(
        '.hero-subheading',
        { y: 25, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9 },
        '-=0.5'
      );

      // CTA group
      tl.fromTo(
        '.hero-cta-group',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      );

      // Scroll indicator
      tl.fromTo(
        '.scroll-indicator',
        { opacity: 0 },
        { opacity: 0.6, duration: 1.2 },
        '-=0.2'
      );

      // Orbital ring subtle entrance
      tl.fromTo(
        '.orbital-ring',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 1.5, ease: 'power3.out' },
        0.3
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
