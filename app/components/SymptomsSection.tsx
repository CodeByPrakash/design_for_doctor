'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ArrowRight, Activity, ShieldCheck, Stethoscope, ChevronRight } from 'lucide-react';

export interface SymptomDetail {
  id: string;
  title: string;
  image: string;
  anatomyTag: 'carpal' | 'thumb' | 'wrist';
  shortDesc: string;
  anatomyName: string;
  symptomsList: string[];
  conservativeCare: string[];
  surgicalOptions: string[];
  recoveryTimeline: string;
}

const SYMPTOMS: SymptomDetail[] = [
  {
    id: 'numbness',
    title: 'Hand Numbness',
    image: '/symptoms/hand_numbness.jpg',
    anatomyTag: 'carpal',
    shortDesc: 'Numbness, nighttime tingling, or burning in the thumb, index, and middle fingers caused by median nerve compression.',
    anatomyName: 'Carpal Tunnel & Median Nerve',
    symptomsList: [
      'Nocturnal burning sensation requiring shaking of the hand',
      'Loss of two-point discrimination in the thumb & index finger',
      'Weakness in thenar pinch grip and dropping objects',
    ],
    conservativeCare: [
      'Neutral wrist cock-up splinting for sleep',
      'Ergonomic workstation adjustment & keyboard angling',
      'Ultrasound-guided corticosteroid injection into carpal canal',
    ],
    surgicalOptions: [
      'Minimally invasive endoscopic carpal tunnel release (ECTR)',
      'Direct decompression of the transverse carpal ligament',
    ],
    recoveryTimeline: 'Immediate nerve decompression; return to desk work in 3–5 days; full pinch strength at 6–8 weeks.',
  },
  {
    id: 'thumb-pain',
    title: 'Thumb Pain',
    image: '/symptoms/thumb_pain.jpg',
    anatomyTag: 'thumb',
    shortDesc: 'Aching at the thumb base when opening jars, pinching, or grasping, commonly linked to CMC osteoarthritis or De Quervain tenosynovitis.',
    anatomyName: '1st Carpometacarpal (CMC) & Radial Styloid',
    symptomsList: [
      'Deep aching at the base of the thumb during twisting motion',
      'Tenderness over the radial styloid with thumb tucked (Finkelstein test)',
      'Prominence or subluxation of the basal joint',
    ],
    conservativeCare: [
      'Custom molded spica splint preserving index freedom',
      'Targeted joint protection hand therapy',
      'Precision intra-articular anti-inflammatory injection',
    ],
    surgicalOptions: [
      'Trapeziectomy with ligament reconstruction tendon interposition (LRTI)',
      '1st extensor compartment release for De Quervain tenosynovitis',
    ],
    recoveryTimeline: 'Splint immobilization for 2–3 weeks, followed by structured occupational hand therapy.',
  },
  {
    id: 'wrist-injuries',
    title: 'Wrist Injuries',
    image: '/symptoms/wrist_injuries.jpg',
    anatomyTag: 'wrist',
    shortDesc: 'Pain following a fall, scaphoid fracture nonunion, TFCC ligament tears, or persistent clicking when pushing up from a chair.',
    anatomyName: 'Scaphoid, Lunate & TFCC Complex',
    symptomsList: [
      'Dorsal wrist pain exacerbated by loaded extension (push-up position)',
      'Anatomical snuffbox tenderness following outstretched fall',
      'Ulnar-sided clicking or catching during forearm rotation',
    ],
    conservativeCare: [
      'Rigid short-arm immobilization & CT bone union tracking',
      'Controlled eccentric wrist stabilization therapy',
      'Targeted radiocarpal joint injections under imaging',
    ],
    surgicalOptions: [
      'Percutaneous headless screw fixation for scaphoid fractures',
      'Wrist arthroscopy & minimally invasive TFCC repair',
    ],
    recoveryTimeline: 'Protected weight-bearing at 4–6 weeks; return to sports and impact activities at 10–12 weeks.',
  },
];

export default function SymptomsSection({
  onHoverAnatomy,
}: {
  onHoverAnatomy?: (anatomy: string | null) => void;
}) {
  const [selectedCondition, setSelectedCondition] = useState<SymptomDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'carpal' | 'thumb' | 'wrist'>('carpal');

  const activeTabDetail = SYMPTOMS.find((s) => s.anatomyTag === activeTab) || SYMPTOMS[0];

  return (
    <section
      id="symptoms"
      className="relative w-full py-20 md:py-28 px-6 sm:px-10 md:px-14 bg-[#F3F0E5] border-t border-[#D8D3C3]/40 z-10 scroll-mt-24"
      aria-label="Common symptoms and clinical conditions"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 relative z-30 pointer-events-auto">

        {/* Left Side: Editorial Heading & Description */}
        <div className="w-full lg:w-[36%] flex flex-col justify-start">
          {/* Eyebrow with Horizontal Divider */}
          <div className="flex items-center gap-3.5 mb-5">
            <span className="text-[11px] font-sans font-semibold tracking-[0.22em] text-[#626747] uppercase">
              Common Symptoms
            </span>
            <span className="h-px w-20 md:w-28 bg-[#626747]/25" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-light text-[#2D3525] leading-[1.08] tracking-tight font-serif mb-5">
            Find Information About
            <br />
            Your Symptoms
          </h2>

          {/* Subtitle */}
          <p className="text-base text-[#777667] font-normal leading-relaxed max-w-sm mb-6 font-sans">
            Learn more about common hand and wrist conditions, anatomical origins, and evidence-based restorative options.
          </p>

          {/* Quick Guidance Hint */}
          <div className="p-4 rounded-2xl bg-[#E9E6D8]/50 border border-[#D8D3C3] max-w-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-[#626747] font-semibold mb-1 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[#626747]" />
              <span>Interactive Anatomy</span>
            </div>
            <p className="text-xs text-[#777667] leading-relaxed">
              Hover over any card below to light up its corresponding bone region on the 3D model, or click for clinical guidance.
            </p>
          </div>

          {/* Interactive Anatomical Illustration in the Left Blank Area */}
          <div
            id="symptoms-hand-zone"
            className="w-full max-w-sm rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] p-5 shadow-xs relative overflow-hidden mt-6 group"
          >
            <div className="flex items-center justify-between mb-2 text-[10px] font-mono uppercase tracking-widest text-[#626747]">
              <span>Anatomical Blueprint</span>
              <span className="font-semibold text-[#2D3525]">Musculoskeletal Map</span>
            </div>

            <div className="relative w-full h-[260px] sm:h-[280px] flex items-center justify-center">
              <Image
                src="/resources/anatomical_hand_wrist.png"
                alt="Detailed Anatomical Hand and Wrist Illustration"
                fill
                sizes="360px"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hotspot 1: Carpal Tunnel */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCondition(SYMPTOMS[0]);
                  setActiveTab('carpal');
                  onHoverAnatomy?.('carpal');
                }}
                onMouseEnter={() => onHoverAnatomy?.('carpal')}
                onMouseLeave={() => onHoverAnatomy?.(null)}
                className={`absolute bottom-[24%] left-[45%] -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all shadow-md z-10 cursor-pointer ${activeTab === 'carpal'
                    ? 'bg-[#626747] text-[#FAF7F0] ring-2 ring-[#FAF7F0]'
                    : 'bg-[#FAF7F0]/95 text-[#2D3525] border border-[#D8D3C3] hover:bg-[#626747] hover:text-[#FAF7F0]'
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>Carpal Tunnel</span>
              </button>

              {/* Hotspot 2: 1st CMC Joint */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCondition(SYMPTOMS[1]);
                  setActiveTab('thumb');
                  onHoverAnatomy?.('thumb');
                }}
                onMouseEnter={() => onHoverAnatomy?.('thumb')}
                onMouseLeave={() => onHoverAnatomy?.(null)}
                className={`absolute top-[44%] left-[24%] -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all shadow-md z-10 cursor-pointer ${activeTab === 'thumb'
                    ? 'bg-[#626747] text-[#FAF7F0] ring-2 ring-[#FAF7F0]'
                    : 'bg-[#FAF7F0]/95 text-[#2D3525] border border-[#D8D3C3] hover:bg-[#626747] hover:text-[#FAF7F0]'
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>1st CMC Joint</span>
              </button>

              {/* Hotspot 3: TFCC / Scaphoid */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCondition(SYMPTOMS[2]);
                  setActiveTab('wrist');
                  onHoverAnatomy?.('wrist');
                }}
                onMouseEnter={() => onHoverAnatomy?.('wrist')}
                onMouseLeave={() => onHoverAnatomy?.(null)}
                className={`absolute bottom-[10%] right-[22%] flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all shadow-md z-10 cursor-pointer ${activeTab === 'wrist'
                    ? 'bg-[#626747] text-[#FAF7F0] ring-2 ring-[#FAF7F0]'
                    : 'bg-[#FAF7F0]/95 text-[#2D3525] border border-[#D8D3C3] hover:bg-[#626747] hover:text-[#FAF7F0]'
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>Scaphoid &amp; TFCC</span>
              </button>
            </div>

            <p className="text-[11px] text-[#777667] text-center font-sans mt-3 border-t border-[#D8D3C3]/50 pt-2.5">
              Click any anatomical hotspot or symptom card to inspect targeted clinical protocols.
            </p>
          </div>
        </div>

        {/* Right Side: Three Balanced Cards */}
        <div className="w-full lg:w-[64%] flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            {SYMPTOMS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCondition(card)}
                onMouseEnter={() => onHoverAnatomy?.(card.anatomyTag)}
                onMouseLeave={() => onHoverAnatomy?.(null)}
                className="group flex flex-col text-left rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:border-[#626747]/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#626747]/30"
              >
                {/* Card Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-[#E9E6D8] p-3">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xs">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Card Footer Label */}
                <div className="px-5 py-4 flex items-center justify-between bg-[#FAF7F0] border-t border-[#D8D3C3]/30">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-sans font-medium text-[#2D3525] tracking-tight group-hover:text-[#626747] transition-colors">
                      {card.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#777667]">
                      Explore Condition
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E9E6D8]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#626747] group-hover:text-[#FAF7F0]">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Interactive Shadcn-style Anatomy Tabs ── */}
          <div className="p-6 rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#D8D3C3]/50">
              <div>
                <span className="text-[10.5px] uppercase tracking-widest font-mono text-[#626747] font-semibold block">
                  Clinical Overview
                </span>
                <h3 className="text-lg font-serif font-light text-[#2D3525]">
                  Select an Anatomical Subspecialty
                </h3>
              </div>

              {/* Tabs list */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#E9E6D8]/60 border border-[#D8D3C3]/60 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('carpal');
                    onHoverAnatomy?.('carpal');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${activeTab === 'carpal'
                      ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                      : 'text-[#2D3525] hover:text-[#626747]'
                    }`}
                >
                  Nerve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('thumb');
                    onHoverAnatomy?.('thumb');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${activeTab === 'thumb'
                      ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                      : 'text-[#2D3525] hover:text-[#626747]'
                    }`}
                >
                  Thumb
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('wrist');
                    onHoverAnatomy?.('wrist');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${activeTab === 'wrist'
                      ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                      : 'text-[#2D3525] hover:text-[#626747]'
                    }`}
                >
                  Wrist
                </button>
              </div>
            </div>

            {/* Active Tab Panel Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-[11px] font-mono text-[#777667] block mb-1">
                  STRUCTURE &amp; PATHOLOGY
                </span>
                <p className="text-base font-serif font-medium text-[#2D3525] mb-2">
                  {activeTabDetail.anatomyName}
                </p>
                <p className="text-xs text-[#777667] leading-relaxed mb-4">
                  {activeTabDetail.shortDesc}
                </p>
                <ul className="space-y-1.5">
                  {activeTabDetail.symptomsList.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#2D3525]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#626747] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#F3F0E5] border border-[#D8D3C3]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#626747]" />
                    <span className="text-[11px] font-mono text-[#626747] font-semibold uppercase">
                      Evidence-Based Protocol
                    </span>
                  </div>
                  <p className="text-xs text-[#777667] leading-relaxed mb-3">
                    {activeTabDetail.recoveryTimeline}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCondition(activeTabDetail)}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#626747] text-[#FAF7F0] text-xs font-sans font-medium hover:bg-[#4A4F35] transition-colors"
                >
                  <span>View Clinical Breakdown</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Shadcn-Style Condition Dialog / Modal ── */}
      {selectedCondition && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2D3525]/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedCondition(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] p-6 sm:p-10 shadow-2xl text-[#2D3525] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCondition(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#E9E6D8]/60 flex items-center justify-center text-[#2D3525] hover:bg-[#626747] hover:text-[#FAF7F0] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dialog Header */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-[#626747] font-semibold uppercase tracking-wider block mb-2">
                Clinical Condition Breakdown
              </span>
              <h3 className="text-3xl font-light font-serif text-[#2D3525] leading-tight mb-2">
                {selectedCondition.title}
              </h3>
              <p className="text-sm font-sans text-[#777667]">
                Anatomical Region: <strong className="text-[#2D3525]">{selectedCondition.anatomyName}</strong>
              </p>
            </div>

            {/* Diagnostic Presentation */}
            <div className="space-y-6 text-sm font-sans">
              <div>
                <h4 className="text-base font-serif font-medium text-[#2D3525] mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#626747]" />
                  <span>Clinical Presentation &amp; Symptoms</span>
                </h4>
                <ul className="space-y-2 bg-[#F3F0E5] p-4 rounded-2xl border border-[#D8D3C3]/50">
                  {selectedCondition.symptomsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#2D3525]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#626747] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment Protocols Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F3F0E5] border border-[#D8D3C3]/50">
                  <h5 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#626747] mb-2">
                    01 / Conservative Therapies
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#777667]">
                    {selectedCondition.conservativeCare.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#626747] font-bold">·</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#F3F0E5] border border-[#D8D3C3]/50">
                  <h5 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#626747] mb-2">
                    02 / Surgical Intervention
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#777667]">
                    {selectedCondition.surgicalOptions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#626747] font-bold">·</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recovery Expectations */}
              <div className="p-4 rounded-2xl bg-[#E9E6D8]/50 border border-[#D8D3C3]">
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="w-4 h-4 text-[#626747]" />
                  <span className="text-xs font-mono font-semibold text-[#2D3525] uppercase">
                    Prognosis &amp; Recovery
                  </span>
                </div>
                <p className="text-xs text-[#777667] leading-relaxed">
                  {selectedCondition.recoveryTimeline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8D3C3]/40">
                <button
                  type="button"
                  onClick={() => setSelectedCondition(null)}
                  className="px-5 py-2.5 rounded-full border border-[#D8D3C3] text-xs font-sans text-[#2D3525] hover:bg-[#E9E6D8] transition-colors"
                >
                  Close
                </button>
                <a
                  href="#contact"
                  onClick={() => setSelectedCondition(null)}
                  className="px-6 py-2.5 rounded-full bg-[#626747] text-[#FAF7F0] text-xs font-sans font-medium hover:bg-[#4A4F35] transition-colors"
                >
                  Book Evaluation for {selectedCondition.title} →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
