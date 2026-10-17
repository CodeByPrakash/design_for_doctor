'use client';

import React from 'react';
import Image from 'next/image';

export default function PhilosophySection() {
  return (
    <section className="relative w-full bg-[#ECE7DA] overflow-hidden">
      {/* ── Inverted Organic Wave Background from Mockup ── */}
      <div className="relative w-full min-h-[600px] lg:min-h-[750px] flex items-center">
        {/* Background SVG Wave */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1440 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0 240 C320 200 680 340 980 500 C1200 620 1340 720 1440 800 L0 800 L0 240 Z"
              fill="#5C6444"
            />
          </svg>
        </div>

        {/* Content Layout */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-14 py-20 w-full flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          {/* Left Side: Editorial Image matching Mockup's bottom hand */}
          <div className="w-full lg:w-1/2 relative h-[340px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-[#FAF7F0]/20">
            <Image
              src="/symptoms/bottom_hand.jpg"
              alt="Hand and forearm resting gracefully"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25281E]/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F0]">
              <p className="text-[11px] uppercase tracking-widest font-mono text-[#FAF7F0]/80 mb-1">
                Clinical Excellence
              </p>
              <p className="text-xl font-serif font-light text-[#FAF7F0]">
                Restoring independence to everyday movement.
              </p>
            </div>
          </div>

          {/* Right Side: Philosophy & Consultation */}
          <div className="w-full lg:w-[45%] text-[#FAF7F0]">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11.5px] font-sans font-semibold tracking-[0.22em] text-[#EDE8DC] uppercase">
                Surgical Philosophy
              </span>
              <span className="h-px w-20 bg-[#EDE8DC]/40" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.12] font-serif mb-6 text-[#FAF7F0]">
              Meticulous care for complex hand &amp; wrist anatomy.
            </h2>

            <p className="text-sm md:text-base text-[#EDE8DC]/90 font-light leading-relaxed mb-8 font-sans">
              Dr. Traverso combines microsurgical technique with conservative, patient-centered therapy. Every treatment plan is crafted to safeguard delicate nerves, preserve joint longevity, and return function with minimal downtime.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF7F0] text-[#5C6444] text-[13.5px] font-medium tracking-wide hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <span>Book a Consultation</span>
                <span>→</span>
              </a>

              <a
                href="tel:2125550198"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#FAF7F0]/30 text-[#FAF7F0] text-[13.5px] font-medium tracking-wide hover:bg-[#FAF7F0]/10 transition-colors"
              >
                (212) 555-0198
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact & Clinic Locations Section ── */}
      <div id="contact" className="w-full py-20 px-6 md:px-14 bg-[#5C6444] border-t border-[#FAF7F0]/15 text-[#FAF7F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
          <div>
            <h4 className="font-serif text-xl font-light mb-3 text-[#FAF7F0]">
              Traverso Hand Surgery
            </h4>
            <p className="text-[#EDE8DC]/80 leading-relaxed max-w-xs font-sans">
              Specialized orthopedic microsurgery dedicated exclusively to the hand, wrist, and forearm.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-3 text-[#FAF7F0]/90 font-sans">
              Locations
            </h4>
            <p className="text-[#EDE8DC]/80 leading-relaxed font-sans">
              <strong>Manhattan Office:</strong><br />
              850 5th Avenue, Suite 400<br />
              New York, NY 10065
            </p>
            <p className="text-[#EDE8DC]/80 leading-relaxed mt-3 font-sans">
              <strong>Greenwich Surgical Pavilion:</strong><br />
              Greenwich, CT 06830
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-3 text-[#FAF7F0]/90 font-sans">
              Patient Inquiries
            </h4>
            <p className="text-[#EDE8DC]/80 leading-relaxed font-sans">
              Direct: (212) 555-0198<br />
              Email: consultations@traversosurgery.com<br />
              Mon – Fri: 8:00 AM – 5:30 PM
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#FAF7F0]/15 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#EDE8DC]/70 font-sans gap-4">
          <p>© 2026 Traverso Hand Surgery, PC. All rights reserved.</p>
          <p>Dr. Purnell Traverso, MD, FACS • Board Certified Orthopedic Surgeon</p>
        </div>
      </div>
    </section>
  );
}
