'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useScrollProgress } from './SmoothScrollProvider';

const HandModelCanvas = dynamic(() => import('./HandModelCanvas'), {
  ssr: false,
  loading: () => null,
});

/**
 * FloatingHandGuide:
 * Persistent 3D Hand Canvas that stays anchored in the viewport
 * across the entire website journey.
 * Driven by global page scroll progress:
 * - In Hero: positioned on the far right, wrist upper-right, pointing down-left.
 * - In Common Symptoms: descends, rotates, and points its fingertip to the symptom cards.
 * - In Philosophy & Consultation: shifts smoothly across to complement the content layout.
 */
export default function FloatingHandGuide() {
  const scrollProgress = useScrollProgress();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    >
      <HandModelCanvas scrollProgress={scrollProgress} />
    </div>
  );
}
