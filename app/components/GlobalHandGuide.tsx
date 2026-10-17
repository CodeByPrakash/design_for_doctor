'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useScrollProgress } from './SmoothScrollProvider';

const HandModelCanvas = dynamic(() => import('./HandModelCanvas'), {
  ssr: false,
  loading: () => null,
});

/**
 * GlobalHandGuide
 * Persistent 3D Hand Canvas that stays anchored across the entire page journey.
 * As the user scrolls from top to bottom:
 * - In Hero: Content on Left -> Skeleton Hand glides to RIGHT inside the orbital ring.
 * - In Symptoms: Cards on Right -> Skeleton Hand glides to LEFT pointing directly at the cards.
 * - In About: Clinical text on Left -> Skeleton Hand glides to RIGHT showing joint alignment.
 * - In Care Pathway: Steps across -> Skeleton Hand gestures across the pathway.
 * - In Consultation: Form on Right -> Skeleton Hand glides to LEFT framing the form.
 */
export default function GlobalHandGuide({
  activeAnatomy,
}: {
  activeAnatomy?: string | null;
}) {
  const scrollProgress = useScrollProgress();

  return (
    <div
      className="fixed inset-0 pointer-events-none !pointer-events-none z-20 overflow-hidden select-none"
      style={{ pointerEvents: 'none' }}
      data-hand-canvas
      aria-hidden="true"
    >
      <HandModelCanvas
        scrollProgress={scrollProgress}
        activeAnatomy={activeAnatomy}
      />
    </div>
  );
}
