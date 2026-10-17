'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScrollContext } from './SmoothScrollProvider';

interface Chapter {
  id: number;
  timeRange: [number, number];
  title: string;
  subtitle: string;
  structure: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    timeRange: [0, 3.3],
    title: 'Carpal Alignment',
    subtitle: 'Radiocarpal & Midcarpal Articulation',
    structure: 'Radius, Ulna, Scaphoid & Lunate',
  },
  {
    id: 2,
    timeRange: [3.3, 6.6],
    title: 'Kinematic Flexion',
    subtitle: 'Metacarpophalangeal Arch Motion',
    structure: 'Metacarpals I–V & Phalangeal Rays',
  },
  {
    id: 3,
    timeRange: [6.6, 10.0],
    title: 'Articular Repair',
    subtitle: 'Microvascular & Ligamentous Restoration',
    structure: 'Intercarpal Ligaments & Joint Radiance',
  },
];

export default function VideoScrollHero() {
  const { lenis } = useScrollContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback & scroll state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10.0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [manualPlaying, setManualPlaying] = useState(false);

  // Refs for smooth animation loop
  const targetTimeRef = useRef(0);
  const isScrollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Handle video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 10.0);
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  // Scroll calculation and Lenis integration
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollUpdate = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress relative to this pinned section (0 to 1)
      const rawProgress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);

      // Target video time corresponding to scroll progress
      const targetSec = clamped * (videoRef.current?.duration || 10.0);
      targetTimeRef.current = targetSec;

      // Mark as scrolling
      setIsScrolling(true);

      // Clear existing noscroll timeout
      if (isScrollingTimeoutRef.current) {
        clearTimeout(isScrollingTimeoutRef.current);
      }

      // "Frame pause on noscroll event":
      // When scroll stops for 110ms, pause the video on exact current frame
      isScrollingTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (videoRef.current && !manualPlaying) {
          videoRef.current.pause();
        }
      }, 110);

      // Update active chapter
      const chapterIdx = CHAPTERS.findIndex(
        (ch) => targetSec >= ch.timeRange[0] && targetSec <= ch.timeRange[1]
      );
      if (chapterIdx !== -1) {
        setCurrentChapter(chapterIdx);
      }
    };

    // Attach to Lenis if available
    if (lenis) {
      lenis.on('scroll', handleScrollUpdate);
    } else {
      window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    }

    // Initial check
    handleScrollUpdate();

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScrollUpdate);
      } else {
        window.removeEventListener('scroll', handleScrollUpdate);
      }
      if (isScrollingTimeoutRef.current) {
        clearTimeout(isScrollingTimeoutRef.current);
      }
    };
  }, [lenis, manualPlaying]);

  // Smooth lerp frame loop for buttery seeking & scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      if (!manualPlaying) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        // Smoothly interpolate towards target time
        if (Math.abs(diff) > 0.02) {
          // If actively scrolling, scrub currentTime smoothly
          video.currentTime = current + diff * 0.25;
        }

        setCurrentTime(video.currentTime);
      } else {
        setCurrentTime(video.currentTime);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [manualPlaying]);

  // Jump to specific chapter via smooth scroll
  const jumpToChapter = (chapter: Chapter) => {
    if (!containerRef.current) return;
    const startTime = chapter.timeRange[0];
    const targetProgress = startTime / duration;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const containerTop = containerRef.current.offsetTop;
    const targetScrollY = containerTop + targetProgress * totalScrollable;

    if (lenis) {
      lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  // Toggle manual preview play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setManualPlaying(true);
    } else {
      video.pause();
      setManualPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '360vh' }}
      id="hero-scroll-container"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#F7F2E8]">
        {/* Subtle Luxury Atmospheric Background Elements */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(98,103,71,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(98,103,71,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />

        {/* Faint Architectural Radial Ring */}
        <div
          className="absolute right-[12%] top-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-[#626747]/10 pointer-events-none hidden md:block"
          style={{
            transform: `translateY(-50%) rotate(${scrollProgress * 45}deg)`,
            transition: 'transform 0.1s linear',
          }}
          aria-hidden="true"
        />

        {/* Top Header / Doctor Metadata Bar */}
        <header className="absolute top-6 left-6 right-6 md:left-12 md:right-12 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#626747] animate-pulse" />
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#2C2C2B] font-sans">
                Dr. Purnell Traverso
              </p>
              <p className="text-[10px] md:text-xs text-[#626747] tracking-widest uppercase font-medium">
                Orthopedic Hand &amp; Wrist Microsurgeon
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#626747]/10 text-[#4A4D35] border border-[#626747]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#626747]" />
                Manhattan &amp; Greenwich Consultations
              </span>
            </div>
            <a
              href="#contact"
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md bg-[#626747] text-[#F8F6EE] hover:bg-[#4A4D35] transition-colors shadow-sm"
            >
              Book Visit
            </a>
          </div>
        </header>

        {/* Main Content Layout: Left Content (50%) + Right Video (50%) */}
        <div className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-20 pointer-events-none pt-20 md:pt-0">
          
          {/* ── LEFT SIDE: Editorial Content Canvas ── */}
          <div className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-center pointer-events-auto select-text">
            {/* Clinical Specialty Tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-[#626747]" />
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#626747]">
                Subspecialty Hand &amp; Wrist Surgery
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#2C2C2B] leading-[1.08] tracking-tight mb-5 font-serif">
              Precision.
              <br />
              <em className="italic text-[#626747] font-normal font-serif">Artistry.</em>
              <br />
              Restoration.
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm md:text-base text-[#5A5C50] font-light leading-relaxed mb-6 max-w-lg">
              Dedicated fellowship-trained orthopedic surgery restoring intricate
              carpal kinematics, tendon excursion, and peripheral nerve function
              through evidence-based microsurgical precision.
            </p>

            {/* Call to Action Group */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#626747] text-[#F8F6EE] text-xs uppercase font-medium tracking-wider hover:bg-[#4A4D35] transition-all duration-300 shadow-md group"
                id="cta-book"
              >
                <span>Request Consultation</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href="#expertise"
                className="inline-flex items-center px-5 py-3.5 rounded-md border border-[#626747]/30 text-[#4A4D35] text-xs uppercase font-medium tracking-wider hover:bg-[#626747]/10 transition-colors"
                id="cta-procedures"
              >
                Clinical Scope
              </a>
            </div>

            {/* ── INTERACTIVE ANATOMICAL TIMELINE & SCROLL SCRUBBER ── */}
            <div className="p-4 rounded-lg bg-[#FAF7F0]/80 border border-[#626747]/15 backdrop-blur-sm shadow-sm max-w-lg">
              {/* Header row with Live Status Indicator */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full transition-colors duration-300 ${
                      isScrolling
                        ? 'bg-[#626747] animate-ping'
                        : 'bg-[#8B8F72]'
                    }`}
                  />
                  <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-[#4A4D35]">
                    {isScrolling ? (
                      <span className="text-[#626747]">● Kinematic Scroll Scrubbing</span>
                    ) : (
                      <span className="text-[#626747]">❙❙ Frame Paused (Anatomical Hold)</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#626747]/10 hover:bg-[#626747]/20 text-[#4A4D35] transition-colors"
                    title={manualPlaying ? 'Pause video' : 'Play video'}
                  >
                    {manualPlaying ? 'Pause' : 'Play Demo'}
                  </button>
                  <span className="text-[11px] font-mono text-[#626747] font-medium">
                    {currentTime.toFixed(1)}s / {duration.toFixed(0)}s
                  </span>
                </div>
              </div>

              {/* Progress Scrub Bar */}
              <div className="w-full h-1.5 bg-[#E8E4D6] rounded-full overflow-hidden mb-3 relative">
                <div
                  className="h-full bg-[#626747] transition-all duration-75 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Interactive Chapters synced with video */}
              <div className="grid grid-cols-3 gap-2">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = currentChapter === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(ch)}
                      className={`text-left p-2 rounded transition-all duration-200 border ${
                        isActive
                          ? 'bg-[#626747] text-[#FAF7F0] border-[#626747] shadow-sm'
                          : 'bg-white/40 text-[#4A4D35] border-transparent hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono opacity-70">
                          0{ch.id}
                        </span>
                        <span className="text-[8px] opacity-70">
                          {ch.timeRange[0]}s
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold truncate leading-tight mt-0.5">
                        {ch.title}
                      </p>
                      <p
                        className={`text-[9px] truncate mt-0.5 ${
                          isActive ? 'text-[#EDEADF]' : 'text-[#8B8F72]'
                        }`}
                      >
                        {ch.structure}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anatomy Micro-Metrics Strip */}
            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-[#626747]/15">
              <div>
                <p className="text-lg md:text-xl font-light text-[#2C2C2B] font-serif">
                  27
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#8B8F72]">
                  Hand &amp; Wrist Bones
                </p>
              </div>
              <div className="h-6 w-px bg-[#626747]/20" />
              <div>
                <p className="text-lg md:text-xl font-light text-[#2C2C2B] font-serif">
                  14
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#8B8F72]">
                  Movable Articulations
                </p>
              </div>
              <div className="h-6 w-px bg-[#626747]/20" />
              <div>
                <p className="text-lg md:text-xl font-light text-[#2C2C2B] font-serif">
                  0.5mm
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#8B8F72]">
                  Microsurgical Gauge
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE: Better Adjustment Video Stage ── */}
          <div className="w-full md:w-[50%] lg:w-[52%] h-[50vh] md:h-[88vh] relative flex items-center justify-center pointer-events-auto">
            {/* Subtle Circular Highlight behind video */}
            <div
              className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(98,103,71,0.06) 0%, transparent 65%)',
                filter: 'blur(30px)',
              }}
              aria-hidden="true"
            />

            {/* Seamless Edge Feathering Wrapper */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                /* Mask gradient on desktop to seamlessly dissolve the left border of video into cream */
                WebkitMaskImage:
                  'radial-gradient(ellipse 95% 90% at 55% 50%, black 70%, transparent 100%)',
                maskImage:
                  'radial-gradient(ellipse 95% 90% at 55% 50%, black 70%, transparent 100%)',
              }}
            >
              <video
                ref={videoRef}
                src="/gemini_generated_video_bf4767e0.mp4"
                playsInline
                muted
                preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-contain object-center scale-[1.08] md:scale-[1.12] transition-transform duration-700 ease-out"
                style={{
                  filter: 'contrast(1.02) saturate(1.04)',
                }}
              />
            </div>

            {/* Elegant Editorial Specimen Plaque (covers watermark softly & adds luxury prestige) */}
            <div className="absolute bottom-4 right-2 md:bottom-8 md:right-4 z-20 pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-[#FAF7F0]/90 border border-[#626747]/20 backdrop-blur-md shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#626747]" />
                <span className="text-[9px] md:text-[10px] font-mono tracking-wider text-[#4A4D35] uppercase">
                  Specimen 01 • Dynamic Hand Anatomy • 24 FPS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Scroll Cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#626747]/80">
            Scroll To Examine Kinematics
          </span>
          <div className="w-4 h-7 rounded-full border border-[#626747]/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#626747] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
