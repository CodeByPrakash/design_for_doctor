'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PillNav, { PillNavItem } from './PillNav';
import logo from './logo.svg';
import { useScrollContext } from './SmoothScrollProvider';

const NAV_ITEMS: PillNavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Conditions', href: '#symptoms' },
  { label: 'Patients', href: '#patients' },
  { label: 'Physicians', href: '#referring' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({
  is3DEnabled = true,
  onToggle3D,
}: {
  is3DEnabled?: boolean;
  onToggle3D?: () => void;
}) {
  const [activeHref, setActiveHref] = useState('#');
  const [scrolled, setScrolled] = useState(false);
  const { lenis } = useScrollContext();

  // Smooth scroll handler
  const scrollToAnchor = useCallback(
    (href: string) => {
      setActiveHref(href);
      if (href === '#' || href === '/' || href === '') {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const targetEl = document.querySelector(href);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl as HTMLElement, { offset: -90, duration: 1.2 });
        } else {
          const top = (targetEl as HTMLElement).getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    },
    [lenis]
  );

  // ScrollSpy to track active section across the entire page
  useEffect(() => {
    const sections = [
      { id: 'contact', href: '#contact' },
      { id: 'referring', href: '#referring' },
      { id: 'patients', href: '#patients' },
      { id: 'about', href: '#about' },
      { id: 'symptoms', href: '#symptoms' },
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      if (scrollY < 180) {
        setActiveHref('#');
        return;
      }

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active when the section occupies the upper-mid viewport
          if (rect.top <= 260 && rect.bottom >= 120) {
            setActiveHref(sec.href);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (
    item: PillNavItem,
    _index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault();
    if (item.href) {
      scrollToAnchor(item.href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
          ? 'py-2.5 sm:py-3.5 backdrop-blur-md bg-[#F3F0E5]/90 border-b border-[#D8D3C3]/60 shadow-[0_4px_20px_-8px_rgba(45,53,37,0.12)]'
          : 'py-4 sm:py-5 bg-[#F3F0E5]/70 backdrop-blur-xs border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-4">
        {/* Editorial Brand Name */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor('#');
          }}
          className="flex items-center gap-2.5 sm:gap-3 group no-underline flex-shrink-0"
          aria-label="Traverso Hand Surgery home"
        >
          <span className="font-serif text-xl sm:text-2xl font-light text-[#2D3525] tracking-tight whitespace-nowrap group-hover:text-[#626747] transition-colors duration-200">
            Traverso Hand Surgery
          </span>
        </a>

        {/* PillNav Navigation Component & 3D Performance Toggle */}
        <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3.5 min-w-0">
          {onToggle3D && (
            <button
              type="button"
              onClick={onToggle3D}
              title={
                is3DEnabled
                  ? 'Turn off 3D model to maximize page performance and battery'
                  : 'Turn on 3D model guide'
              }
              aria-label={is3DEnabled ? 'Disable 3D model' : 'Enable 3D model'}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 border cursor-pointer select-none shrink-0 ${is3DEnabled
                  ? 'bg-[#FAF7F0]/90 hover:bg-[#FAF7F0] border-[#D8D3C3] text-[#2D3525] hover:border-[#626747]/50 shadow-2xs'
                  : 'bg-[#626747] text-[#FAF7F0] border-[#626747] shadow-sm'
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${is3DEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-amber-300'
                  }`}
              />
              <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider">
                {is3DEnabled ? '3D: ON' : '3D: OFF'}
              </span>
              <span className="md:hidden font-mono text-[10px]">
                {is3DEnabled ? '3D' : 'Off'}
              </span>
            </button>
          )}

          <PillNav
            logo={logo}
            logoAlt="Traverso Hand Surgery Emblem"
            logoHref="#"
            items={NAV_ITEMS}
            activeHref={activeHref}
            onItemClick={handleNavClick}
            itemStyle="pill"
            hoverEffect="fill"
            indicator="dot"
            layout="split"
            surface="glass"
            size="md"
            theme="light"
            highlightColor="#626747"
            highlightTextColor="#FAF7F0"
            textColor="#2D3525"
            bounce={0.3}
            stretch={0.5}
            collapse="auto"
            intro
            className="shadow-xs"
          />
        </div>
      </div>
    </header>
  );
}
