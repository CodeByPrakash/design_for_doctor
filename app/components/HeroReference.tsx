'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useScrollContext } from './SmoothScrollProvider';



export default function HeroReference() {
  const { lenis } = useScrollContext();
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Measure scroll progress through the hero section (0 to 1)
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / heroHeight));
      setScrollProgress(progress);
    };

    if (lenis) {
      lenis.on('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll();

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lenis]);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[92vh] md:min-h-[96vh] flex items-center overflow-hidden bg-[#F3F0E5]"
      id="hero"
      aria-label="Hero introduction"
    >
      {/* ── Subtle Organic Olive Wave in Lower-Right Corner ──
          Curved gently so it never obscures the bone anatomy */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 right-0 w-full h-full"
        >
          <path
            d="M680 900 C860 810 1020 680 1200 560 C1300 495 1380 460 1440 450 L1440 900 L680 900 Z"
            fill="#626747"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* ── Two-Column Balanced Hero Composition ── */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 py-10 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 z-20">

        {/* Left Column: Typography & Uncompressed CTA Buttons */}
        <div className="w-full lg:w-[48%] max-w-xl flex flex-col justify-center pt-2 lg:pt-0 z-20">

          {/* Eyebrow Label with Horizontal Divider */}
          <div className="flex items-center gap-3.5 mb-5">
            <span className="text-[11px] font-sans font-semibold tracking-[0.22em] text-[#626747] uppercase">
              Hand &amp; Wrist Surgery
            </span>
            <span className="h-px w-20 md:w-28 bg-[#626747]/25" />
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-light text-[#2D3525] leading-[1.05] tracking-tight font-serif mb-5">
            Expert Care for
            <br />
            Your Hands
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#777667] font-normal leading-relaxed max-w-lg mb-8 font-sans">
            Clear information to help you understand your symptoms and explore
            the right next step.
          </p>

          {/* Uncompressed, Generously Sized CTA Button Pair */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary CTA */}
            <a
              href="#symptoms"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-full bg-[#626747] text-[#FAF7F0] text-[14px] font-sans font-medium tracking-wide hover:bg-[#4A4F35] shadow-xs hover:shadow-md transition-all duration-200 group whitespace-nowrap shrink-0 relative z-30 pointer-events-auto cursor-pointer"
              id="cta-explore"
            >
              <span>Explore Symptoms</span>
              <span className="ml-2 text-base transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              href="#about"
              className="inline-flex items-center justify-center min-h-[48px] px-7 py-3.5 rounded-full border border-[#D8D3C3] bg-transparent text-[#2D3525] text-[14px] font-sans font-medium tracking-wide hover:bg-[#E9E6D8]/60 transition-colors duration-200 whitespace-nowrap shrink-0 relative z-30 pointer-events-auto cursor-pointer"
              id="cta-about"
            >
              <span>About the Practice</span>
            </a>
          </div>
        </div>

        {/* Right Column: Orbital Ring Area and Futuristic Anatomy Artwork */}
        <div className="w-full lg:w-[52%] h-[420px] sm:h-[500px] lg:h-[640px] relative flex items-center justify-center pointer-events-none z-10">

          {/* Atmospheric Blended Artwork: Skull, Hand, and Golden Orbital Ribbons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="relative w-[380px] sm:w-[480px] lg:w-[600px] h-[380px] sm:h-[480px] lg:h-[600px] opacity-75 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)] mix-blend-multiply transition-transform duration-700 ease-out">
              <Image
                src="/resources/Ribbon Skull Orbit.png"
                alt="Craniofacial and Hand Microsurgical Precision"
                fill
                sizes="(max-width: 1024px) 480px, 600px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* ── 3 Concentric Dynamic Orbital Rings with Complementary Scroll Spin ── */}

          {/* 1. Outer Ring (Normal Width) - Clockwise rotation */}
          <div className="absolute w-[340px] sm:w-[420px] lg:w-[500px] h-[340px] sm:h-[420px] lg:h-[500px] pointer-events-none z-10">
            <div
              className="relative w-full h-full rounded-full border border-[#626747]/25 transition-transform duration-100 ease-out"
              style={{
                transform: `rotate(${scrollProgress * 55}deg)`,
              }}
            >
              {/* Top-Right Node Dot (~1 o'clock) */}
              <div className="absolute top-[8%] right-[16%] w-2.5 h-2.5 rounded-full bg-[#626747] border-2 border-[#F3F0E5]" />
              {/* Bottom-Left Node Dot (~7 o'clock) */}
              <div className="absolute bottom-[10%] left-[18%] w-2 h-2 rounded-full bg-[#626747]/80 border-2 border-[#F3F0E5]" />
            </div>
          </div>

          {/* 2. Middle Ring (A Bit More Width than Inner) - Counter-Clockwise Complementary Spin */}
          <div className="absolute w-[240px] sm:w-[300px] lg:w-[360px] h-[240px] sm:h-[300px] lg:h-[360px] pointer-events-none z-10">
            <div
              className="relative w-full h-full rounded-full border border-dashed border-[#626747]/30 transition-transform duration-100 ease-out"
              style={{
                transform: `rotate(${-scrollProgress * 80}deg)`,
              }}
            >
              {/* Right-Center Node Dot (~3 o'clock) */}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-[#626747] border-2 border-[#F3F0E5]" />
              {/* Left-Center Node Dot (~9 o'clock) */}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-[#626747]/70 border-2 border-[#F3F0E5]" />
            </div>
          </div>

          {/* 3. Inner Ring (Less Width) - Clockwise Complementary Spin */}
          <div className="absolute w-[150px] sm:w-[190px] lg:w-[230px] h-[150px] sm:h-[190px] lg:h-[230px] pointer-events-none z-10">
            <div
              className="relative w-full h-full rounded-full border border-[#626747]/35 transition-transform duration-100 ease-out"
              style={{
                transform: `rotate(${scrollProgress * 115}deg)`,
              }}
            >
              {/* Top Node Dot (~12 o'clock) */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#626747] border-2 border-[#F3F0E5]" />
              {/* Bottom Node Dot (~6 o'clock) */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#626747]/60" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll To Explore Indicator on Right (Over Olive Wave) ── */}
      <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-1.5 z-20 pointer-events-none">
        <div className="w-4 h-7 rounded-full border border-[#FAF7F0]/60 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-[#FAF7F0] animate-bounce" />
        </div>
        <span className="text-[10.5px] font-sans font-normal tracking-wider text-[#FAF7F0]/85 uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
