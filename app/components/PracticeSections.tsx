'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Stethoscope,
  Activity,
  Award,
  Download,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function PracticeSections() {
  // ── Form State ──
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<'manhattan' | 'greenwich'>('manhattan');
  const [selectedConditionType, setSelectedConditionType] = useState<string>('Hand Numbness & Carpal Tunnel');
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon'>('morning');
  const [hasPriorImaging, setHasPriorImaging] = useState<boolean>(true);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptomsNotes, setSymptomsNotes] = useState('');

  // ── Copy states ──
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedDoctorPhone, setCopiedDoctorPhone] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // ── Active Tabs ──
  const [aboutActiveTab, setAboutActiveTab] = useState<'philosophy' | 'credentials' | 'walant'>('philosophy');
  const [referringActiveUrgency, setReferringActiveUrgency] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // ── Hand image hover hotspot ──
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleCopyPhone = (number: string, isDoctor: boolean) => {
    navigator.clipboard?.writeText(number);
    if (isDoctor) {
      setCopiedDoctorPhone(true);
      setTimeout(() => setCopiedDoctorPhone(false), 2200);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set('.practice-metric-card, .journey-phase-card, .physician-pillar-card', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Metric cards in About: smooth popup appear
      gsap.fromTo(
        '.practice-metric-card',
        { y: 32, scale: 0.96, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.practice-metrics-grid',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Journey phase cards in Patients: smooth popup appear
      gsap.fromTo(
        '.journey-phase-card',
        { y: 35, scale: 0.96, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.journey-phases-grid',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 3. Physician collaboration cards: smooth popup appear
      gsap.fromTo(
        '.physician-pillar-card',
        { y: 30, scale: 0.97, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.physician-pillars-grid',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // ── Physician Triage Profiles ──
  const REFERRAL_TIERS = [
    {
      id: 'acute-trauma',
      category: 'Acute Trauma & Tendon Laceration',
      urgencyBadge: 'Same-Day Evaluation',
      urgencyColor: 'bg-emerald-950/20 text-emerald-800 border-emerald-700/30',
      timeframe: 'Immediate triage within 4 hours',
      indications: 'Suspected flexor tendon severance, acute open joint injury, neurovascular compromise, high-pressure injection.',
      diagnosticProtocol: 'Immediate splinting in functional resting position. Keep patient NPO if operative exploration is indicated within 24–72 hours. Do not attempt deep wound exploration in clinic.',
      radiologyRequired: 'Standard 3-view hand/wrist radiographs to exclude foreign body or concomitant fracture.',
    },
    {
      id: 'scaphoid-fracture',
      category: 'Scaphoid & Distal Radius Fractures',
      urgencyBadge: 'Priority: 24–48 Hours',
      urgencyColor: 'bg-amber-950/20 text-amber-800 border-amber-700/30',
      timeframe: 'Fast-track appointment within 48h',
      indications: 'Anatomical snuffbox tenderness, displaced Colles fracture, nonunion, dorsal intercalated segment instability (DISI).',
      diagnosticProtocol: 'Rigid thumb spica splinting for suspected scaphoid injury. Avoid premature casting before definitive CT assessment of fracture displacement.',
      radiologyRequired: 'Dedicated 4-view scaphoid series (ulnar deviation view) and dedicated PA/lateral wrist views.',
    },
    {
      id: 'nerve-compression',
      category: 'Severe Nerve Entrapment & Atrophy',
      urgencyBadge: 'Consultation: 3–5 Days',
      urgencyColor: 'bg-stone-900/10 text-[#2D3525] border-[#626747]/30',
      timeframe: 'Scheduled within 5 business days',
      indications: 'Thenar wasting, constant numbness in median nerve distribution, drop objects, severe cubital tunnel syndrome with clawing.',
      diagnosticProtocol: 'Trial of neutral wrist cock-up splint at night. Electrodiagnostic studies (EMG/NCS) helpful but not mandatory prior to clinical exam.',
      radiologyRequired: 'EMG/NCS summary report if available; ultrasound evaluation of cross-sectional area performed in-office.',
    },
    {
      id: 'joint-preservation',
      category: 'Thumb Arthritis & Chronic Tendinopathy',
      urgencyBadge: 'Elective Subspecialty Exam',
      urgencyColor: 'bg-stone-900/10 text-[#2D3525] border-[#626747]/30',
      timeframe: 'Flexible appointment coordinating with patient schedule',
      indications: 'Basal joint (CMC) arthritis failing conservative management, recurrent de Quervain tenosynovitis, locked trigger digit.',
      diagnosticProtocol: 'Review of prior corticosteroid injections (timing and efficacy) and custom occupational therapy hand splinting history.',
      radiologyRequired: 'Stress radiographs of the thumb base (Bett’s view or Robert’s view) and weight-bearing bilateral hands.',
    },
  ];

  // ── Patient Care Guidance FAQs ──
  const FAQS = [
    {
      q: 'What should I bring to my initial diagnostic consultation?',
      a: 'Please bring any prior hand, wrist, or forearm X-rays, MRI discs/reports, nerve conduction studies (EMG), and a list of daily activities, professions, or sports that provoke symptoms. If you have worn custom splints or received prior injections, bring those dates and details.',
    },
    {
      q: 'How is minimally invasive endoscopic carpal tunnel release performed?',
      a: 'Using high-definition micro-cameras through a single 1cm wrist crease incision, the transverse carpal ligament is divided from beneath. This avoids disrupting the thick palmar skin and deep fascia, dramatically reducing pillar pain and allowing immediate gentle finger movement.',
    },
    {
      q: 'What is the Wide-Awake Local Anesthesia No Tourniquet (WALANT) technique?',
      a: 'WALANT utilizes lidocaine and epinephrine without an arm tourniquet or general anesthesia. Patients remain completely comfortable and awake, allowing live intraoperative testing of tendon gliding and repair strength before incisions are closed.',
    },
    {
      q: 'Are non-surgical treatment options always explored first?',
      a: 'Yes. Unless an acute displaced fracture, severed tendon, or progressive motor nerve loss is present, individualized conservative protocols—including custom thermal splinting, targeted ultrasound-guided injections, and certified hand therapy—are trialed first.',
    },
    {
      q: 'Do referring physicians receive consultation reports promptly?',
      a: 'Every patient evaluation generates a detailed clinical note sent back to the primary care provider or referring specialist within 24–48 hours, including imaging findings, photographic documentation, and collaborative care milestones.',
    },
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#F3F0E5] text-[#2D3525] relative z-10">

      {/* ─────────────────────────────────────────────────────────────
          1. ABOUT THE PRACTICE SECTION (#about)
          Adheres to high-end-visual-design: Double-bezel hardware,
          nested tabs, macro-whitespace (py-32 md:py-36), editorial typography.
      ───────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="relative w-full py-28 md:py-36 px-5 sm:px-8 md:px-14 border-t border-[#D8D3C3]/50 scroll-mt-24"
        aria-label="About the practice and Dr. Traverso"
      >
        <div className="max-w-7xl mx-auto relative z-30 pointer-events-auto">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10.5px] uppercase tracking-[0.22em] font-mono font-medium border border-[#626747]/25 bg-[#626747]/8 text-[#626747]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#626747] animate-pulse" />
              Surgical Fellowship &amp; Philosophy
            </span>
            <span className="h-px flex-1 max-w-[120px] bg-[#626747]/20" />
          </div>

          {/* Section Main Grid: Editorial Narrative (Left) + Double-Bezel Anatomy Showcase (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
            {/* Left Column (7 cols): Editorial Typography & Tabbed Details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-light text-[#2D3525] leading-[1.08] tracking-tight font-serif mb-7">
                  Dedicated Exclusively to the Micro-Anatomy of the Upper Extremity
                </h2>

                <p className="text-base sm:text-lg text-[#2D3525]/90 font-light leading-relaxed mb-6 font-sans">
                  The human hand contains 27 delicate bones, intricate sensory nerve branches with millimeter tolerances, and high-tension tendon pulleys. Restoring its function requires subspecialized precision rather than general orthopaedic approaches.
                </p>

                <p className="text-sm sm:text-base text-[#777667] font-normal leading-relaxed mb-9 font-sans">
                  Dr. Traverso completed dedicated Hand &amp; Microvascular Surgery fellowship training at Columbia University Irving Medical Center. Our clinical practice centers on conservative-first restoration, anatomical preservation of normal biomechanics, and rapid return to occupational dexterity.
                </p>
              </div>

              {/* Shadcn-Style Tabbed Philosophy Explorer */}
              <div className="bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3] mb-8">
                <div className="bg-[#FAF7F0] rounded-[calc(2rem-0.5rem)] p-6 sm:p-7 shadow-xs">
                  {/* Tab Navigation Pill Group */}
                  <div className="flex flex-wrap gap-2 p-1 bg-[#E9E6D8]/60 rounded-full border border-[#D8D3C3]/60 mb-6">
                    <button
                      type="button"
                      onClick={() => setAboutActiveTab('philosophy')}
                      className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${aboutActiveTab === 'philosophy'
                        ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                        : 'text-[#626747] hover:text-[#2D3525]'
                        }`}
                    >
                      Anatomical Philosophy
                    </button>
                    <button
                      type="button"
                      onClick={() => setAboutActiveTab('walant')}
                      className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${aboutActiveTab === 'walant'
                        ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                        : 'text-[#626747] hover:text-[#2D3525]'
                        }`}
                    >
                      WALANT Technique
                    </button>
                    <button
                      type="button"
                      onClick={() => setAboutActiveTab('credentials')}
                      className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${aboutActiveTab === 'credentials'
                        ? 'bg-[#626747] text-[#FAF7F0] shadow-xs'
                        : 'text-[#626747] hover:text-[#2D3525]'
                        }`}
                    >
                      Board &amp; Hospital Credentials
                    </button>
                  </div>

                  {/* Tab 1: Philosophy Content */}
                  {aboutActiveTab === 'philosophy' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Transverse Carpal Arch &amp; Pulley Preservation
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            We avoid aggressive open exposures that destabilize the natural arches of the palm. Micro-incisions preserve the A2 and A4 flexor pulleys, preventing bowstringing and maintaining grip leverage.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pt-3 border-t border-[#D8D3C3]/40">
                        <CheckCircle2 className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Conservative Trial Priority
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            Over 75% of early carpal tunnel syndrome, de Quervain tenosynovitis, and mild thumb arthritis resolve without surgery through customized ergonomic modification and hand therapy.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: WALANT Technique */}
                  {aboutActiveTab === 'walant' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Wide-Awake Local Anesthesia No Tourniquet
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            Eliminates the nausea, sedation, and cardiac strain of general anesthesia. An arm tourniquet is unnecessary, avoiding ischemic arm pain during surgery.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pt-3 border-t border-[#D8D3C3]/40">
                        <CheckCircle2 className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Intraoperative Active Finger Range-of-Motion
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            Patients actively flex their fingers while on the operating table, allowing the surgeon to visually confirm frictionless tendon excursion before skin closure.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Credentials Content */}
                  {aboutActiveTab === 'credentials' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-start gap-3">
                        <Award className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Columbia University Medical Center Fellowship
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            Specialized microvascular surgery, brachial plexus reconstruction, and acute wrist arthroscopy at New York-Presbyterian Hospital.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pt-3 border-t border-[#D8D3C3]/40">
                        <Building2 className="w-4 h-4 text-[#626747] mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#2D3525] font-normal">
                            Hospital &amp; Academic Affiliations
                          </p>
                          <p className="text-xs text-[#777667] leading-relaxed mt-0.5">
                            Attending Surgeon, New York-Presbyterian Hospital / Greenwich Hospital (Yale New Haven Health). Member, American Society for Surgery of the Hand (ASSH).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Double-Bezel Image Container with Interactive Anatomical Telemetry */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#E9E6D8]/60 p-2 sm:p-2.5 rounded-[2.5rem] border border-[#D8D3C3] shadow-lg">
                <div className="relative h-[440px] sm:h-[500px] rounded-[calc(2.5rem-0.625rem)] overflow-hidden bg-[#2D3525] group">
                  <Image
                    src="/symptoms/bottom_hand.jpg"
                    alt="Clinical anatomical preparation of the resting wrist and hand"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D3525]/85 via-[#2D3525]/20 to-transparent" />

                  {/* Interactive Hotspot 1: Carpal Tunnel Portal */}
                  <div
                    className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    onMouseEnter={() => setActiveHotspot('portal')}
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-[#FAF7F0]/30 animate-ping" />
                      <span className="w-5 h-5 rounded-full bg-[#FAF7F0] border-2 border-[#626747] flex items-center justify-center text-[9px] font-mono font-bold text-[#2D3525] shadow-md">
                        +
                      </span>
                    </div>
                    {activeHotspot === 'portal' && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-xl bg-[#FAF7F0] text-[#2D3525] text-[11px] font-sans shadow-xl border border-[#D8D3C3] animate-in fade-in zoom-in-95 duration-200">
                        <p className="font-semibold text-[#626747] font-mono text-[9.5px] uppercase tracking-wider mb-0.5">
                          Zone 1: Endoscopic Release
                        </p>
                        Single 1cm incision hidden in wrist flexion crease.
                      </div>
                    )}
                  </div>

                  {/* Interactive Hotspot 2: Thenar Branch */}
                  <div
                    className="absolute top-[68%] left-[32%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    onMouseEnter={() => setActiveHotspot('thenar')}
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#FAF7F0] border-2 border-[#626747] flex items-center justify-center text-[9px] font-mono font-bold text-[#2D3525] shadow-md">
                        +
                      </span>
                    </div>
                    {activeHotspot === 'thenar' && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-xl bg-[#FAF7F0] text-[#2D3525] text-[11px] font-sans shadow-xl border border-[#D8D3C3] animate-in fade-in zoom-in-95 duration-200">
                        <p className="font-semibold text-[#626747] font-mono text-[9.5px] uppercase tracking-wider mb-0.5">
                          Motor Branch Protection
                        </p>
                        Preserving the recurrent thenar motor branch for thumb opposition.
                      </div>
                    )}
                  </div>

                  {/* Bottom HUD Information overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F0]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D8D3C3]/80 uppercase tracking-widest mb-1.5 border-b border-[#FAF7F0]/20 pb-2">
                      <span>Anatomical Mapping</span>
                      <span className="text-[#FAF7F0] font-semibold">Submillimeter Precision</span>
                    </div>
                    <p className="text-base sm:text-lg font-serif font-light text-[#FAF7F0] leading-snug">
                      Preserving kinetic arches and tendon gliding surfaces.
                    </p>
                  </div>
                </div>
              </div>

              {/* Micro-callout badge under card */}
              <div className="mt-4 flex items-center justify-between px-3 text-xs text-[#777667] font-sans">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#626747]" />
                  Accredited Ambulatory Surgical Suites
                </span>
                <span className="font-mono text-[11px] text-[#626747]">NYC &amp; CT</span>
              </div>
            </div>
          </div>

          {/* 3 Clinical Metrics Bento Cards (Double-Bezel Architecture) */}
          <div className="practice-metrics-grid grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="practice-metric-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3]">
              <div className="bg-[#FAF7F0] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#626747] font-semibold block mb-2">
                    SURGICAL EXPERIENCE
                  </span>
                  <p className="text-3xl sm:text-4xl font-light font-serif text-[#2D3525] mb-2">
                    2,400+
                  </p>
                  <p className="text-xs text-[#777667] leading-relaxed">
                    Upper extremity microsurgical and endoscopic procedures safely performed.
                  </p>
                </div>
              </div>
            </div>

            <div className="practice-metric-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3]">
              <div className="bg-[#FAF7F0] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#626747] font-semibold block mb-2">
                    OUTPATIENT RECOVERY
                  </span>
                  <p className="text-3xl sm:text-4xl font-light font-serif text-[#2D3525] mb-2">
                    99.4%
                  </p>
                  <p className="text-xs text-[#777667] leading-relaxed">
                    Same-day discharge rate utilizing gentle, regional and WALANT anesthesia techniques.
                  </p>
                </div>
              </div>
            </div>

            <div className="practice-metric-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3]">
              <div className="bg-[#FAF7F0] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#626747] font-semibold block mb-2">
                    PHYSICIAN COMMUNICATION
                  </span>
                  <p className="text-3xl sm:text-4xl font-light font-serif text-[#2D3525] mb-2">
                    24–48h
                  </p>
                  <p className="text-xs text-[#777667] leading-relaxed">
                    Clinical note and imaging summary return guarantee to referring primary care providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PATIENT JOURNEY SECTION (#patients)
          Double-bezel cards, step markers, clinical milestones.
      ───────────────────────────────────────────────────────────── */}
      <section
        id="patients"
        className="relative w-full py-28 md:py-36 px-5 sm:px-8 md:px-14 bg-[#FAF7F0] border-t border-[#D8D3C3]/50 scroll-mt-24 overflow-hidden"
        aria-label="Patient care pathway and FAQs"
      >
        {/* Blended Doctor Character Visual on the Right Side */}
        <div
          className="absolute top-4 right-0 sm:right-4 md:right-8 lg:right-16 w-[340px] sm:w-[440px] lg:w-[540px] h-[500px] sm:h-[600px] lg:h-[680px] pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <div className="relative w-full h-full">
            <Image
              src="/Gemini_Generated_Image_tsi8utsi8utsi8ut.png"
              alt="Dr. Traverso Patient Care"
              fill
              sizes="(max-width: 1024px) 440px, 540px"
              className="object-contain object-top lg:object-right-top [mask-image:radial-gradient(ellipse_at_60%_45%,black_50%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_60%_45%,black_50%,transparent_85%)] opacity-95"
              priority
            />
            {/* Ambient edge blending gradients */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#FAF7F0]/80 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FAF7F0] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Elegant Olive & Gold Ribbon Wave Ambient Overlay Effect */}



        <div className="max-w-7xl mx-auto relative z-30 pointer-events-auto">
          {/* Eyebrow & Title */}
          <div className="max-w-2xl lg:max-w-xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10.5px] uppercase tracking-[0.22em] font-mono font-medium border border-[#626747]/25 bg-[#626747]/8 text-[#626747]">
                Clinical Protocol
              </span>
              <span className="h-px w-24 bg-[#626747]/20" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-light text-[#2D3525] leading-[1.1] tracking-tight font-serif mb-5">
              Your Pathway from Accurate Diagnosis to Complete Dexterity
            </h2>

            <p className="text-base sm:text-lg text-[#777667] font-normal leading-relaxed font-sans">
              Restoring hand function requires a cohesive progression. Each patient moves through clear clinical stages designed to resolve pain and safeguard natural range of motion.
            </p>
          </div>

          {/* 4 Asymmetrical Double-Bezel Pathway Cards */}
          <div className="journey-phases-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Step 1 */}
            <div className="journey-phase-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3] hover:border-[#626747]/40 transition-colors">
              <div className="bg-[#F3F0E5] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#626747] tracking-wider">
                      PHASE 01
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#626747]" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-[#2D3525] mb-2.5">
                    Micro-Mapping &amp; Exam
                  </h3>
                  <p className="text-xs text-[#777667] leading-relaxed font-sans">
                    Precision 2-point discrimination sensory testing, provocative nerve maneuvers (Phalen&apos;s, Tinel&apos;s), and dynamic ultrasound imaging of carpal tunnel geometry.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#D8D3C3]/40 text-[11px] font-mono text-[#626747]">
                  Est: 45–60 min consultation
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="journey-phase-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3] hover:border-[#626747]/40 transition-colors">
              <div className="bg-[#F3F0E5] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#626747] tracking-wider">
                      PHASE 02
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#626747]" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-[#2D3525] mb-2.5">
                    Targeted Conservative Care
                  </h3>
                  <p className="text-xs text-[#777667] leading-relaxed font-sans">
                    Custom thermosetting splints fabricated by certified hand therapists, ergonomic workload adaptation, and selective ultrasound-guided steroid injections.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#D8D3C3]/40 text-[11px] font-mono text-[#626747]">
                  Est: 4–6 week evaluation
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="journey-phase-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3] hover:border-[#626747]/40 transition-colors">
              <div className="bg-[#F3F0E5] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#626747] tracking-wider">
                      PHASE 03
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#626747]" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-[#2D3525] mb-2.5">
                    Subspecialized Procedure
                  </h3>
                  <p className="text-xs text-[#777667] leading-relaxed font-sans">
                    When surgery is required: Endoscopic single-portal carpal tunnel release, scaphoid headless compression screw fixation, or joint-preserving arthroplasty under WALANT.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#D8D3C3]/40 text-[11px] font-mono text-[#626747]">
                  Outpatient / Same-day discharge
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="journey-phase-card bg-[#E9E6D8]/50 p-2 rounded-[2rem] border border-[#D8D3C3] hover:border-[#626747]/40 transition-colors">
              <div className="bg-[#F3F0E5] rounded-[calc(2rem-0.5rem)] p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#626747] tracking-wider">
                      PHASE 04
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#626747]" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-[#2D3525] mb-2.5">
                    Hand Therapy &amp; Dexterity
                  </h3>
                  <p className="text-xs text-[#777667] leading-relaxed font-sans">
                    Close coordination with Certified Hand Therapists (CHT) for desensitization, tendon-gliding exercises, scar remodeling, and progressive pinch strengthening.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#D8D3C3]/40 text-[11px] font-mono text-[#626747]">
                  Return to unrestricted play/work
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Shadcn-Style Clean Accordion for FAQs */}
          <div className="max-w-3xl mx-auto bg-[#E9E6D8]/50 p-2 sm:p-2.5 rounded-[2.5rem] border border-[#D8D3C3] relative">
            <div className="bg-[#F3F0E5] rounded-[calc(2.5rem-0.625rem)] p-7 sm:p-10 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <HelpCircle className="w-4 h-4 text-[#626747]" />
                <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#626747] font-semibold">
                  Common Patient Questions
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#2D3525] mb-8 relative z-10">
                Consultation &amp; Surgical Guidance
              </h3>

              <div className="space-y-3.5 relative z-10">
                {FAQS.map((faq, i) => {
                  const isOpen = expandedFaq === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-[#D8D3C3] bg-[#FAF7F0] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : i)}
                        className="w-full px-6 py-4.5 flex items-center justify-between text-left text-sm font-sans font-medium text-[#2D3525] hover:text-[#626747] transition-colors focus:outline-none cursor-pointer"
                      >
                        <span className="pr-4">{faq.q}</span>
                        <span
                          className={`w-7 h-7 rounded-full bg-[#E9E6D8]/60 flex items-center justify-center shrink-0 text-[#626747] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#626747] text-[#FAF7F0]' : ''
                            }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-xs sm:text-[13px] text-[#777667] font-sans leading-relaxed border-t border-[#D8D3C3]/40 pt-4 animate-in fade-in duration-200">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Elegant Olive & Gold Ribbon Wave Overlay at Bottom of Card */}
            <div
              className="absolute -bottom-8 sm:-bottom-14 -left-6 sm:-left-12 -right-6 sm:-right-12 h-[200px] sm:h-[260px] pointer-events-none select-none z-20"
              aria-hidden="true"
            >
              <div className="relative w-full h-full opacity-85 mix-blend-multiply [mask-image:radial-gradient(ellipse_at_bottom,black_65%,transparent_95%)]">
                <Image
                  src="/resources/olive_gold_ribbon_wave.png"
                  alt="Olive and Gold Ribbon Wave Overlay"
                  fill
                  sizes="(max-width: 1024px) 800px, 950px"
                  className="object-contain object-bottom scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. REFERRING PHYSICIANS SECTION (#referring)
          Interactive Referral Triage Matrix, Direct Line, Fast-track
          clinical packet download simulation.
      ───────────────────────────────────────────────────────────── */}
      <section
        id="referring"
        className="relative w-full py-28 md:py-36 px-5 sm:px-8 md:px-14 border-t border-[#D8D3C3]/50 scroll-mt-24"
        aria-label="Referring physicians information and urgent triage"
      >
        <div className="max-w-7xl mx-auto relative z-30 pointer-events-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10.5px] uppercase tracking-[0.22em] font-mono font-medium border border-[#626747]/25 bg-[#626747]/8 text-[#626747]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#626747]" />
                  Physician Collaboration Portal
                </span>
                <span className="h-px w-20 bg-[#626747]/20" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-light text-[#2D3525] leading-[1.1] tracking-tight font-serif mb-5">
                A Responsive, Direct Clinical Partnership
              </h2>

              <p className="text-base sm:text-lg text-[#777667] font-normal leading-relaxed font-sans">
                We partner with primary care physicians, urgent care centers, sports medicine teams, and rheumatologists to deliver rapid patient evaluations and immediate clinical feedback.
              </p>
            </div>

            {/* Direct Physician Quick-Action Card */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => handleCopyPhone('(212) 555-0199', true)}
                className="inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-full bg-[#626747] text-[#FAF7F0] text-xs font-sans font-medium tracking-wide hover:bg-[#4A4F35] shadow-xs transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FAF7F0]/80" />
                  <span>{copiedDoctorPhone ? 'Copied to Clipboard' : 'Direct Doctor Line: (212) 555-0199'}</span>
                </span>
                <span className="w-7 h-7 rounded-full bg-[#FAF7F0]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {copiedDoctorPhone ? <Check className="w-3.5 h-3.5 text-[#FAF7F0]" /> : <Copy className="w-3.5 h-3.5 text-[#FAF7F0]" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className="inline-flex items-center justify-between gap-3 px-5 py-3.5 rounded-full border border-[#D8D3C3] bg-[#FAF7F0] text-xs font-sans font-medium text-[#2D3525] hover:bg-[#E9E6D8] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#626747]" />
                  <span>Referral Order Sheet</span>
                </span>
                <Download className="w-3.5 h-3.5 text-[#626747]" />
              </button>
            </div>
          </div>

          {/* Interactive Referral Triage Decision Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Column (5 cols): Urgency Condition Selectors */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#626747] font-semibold block mb-2">
                SELECT CLINICAL SCENARIO
              </span>

              {REFERRAL_TIERS.map((tier, idx) => {
                const isSelected = referringActiveUrgency === idx;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setReferringActiveUrgency(idx)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${isSelected
                      ? 'bg-[#FAF7F0] border-[#626747] shadow-sm ring-1 ring-[#626747]/20'
                      : 'bg-[#F3F0E5] border-[#D8D3C3] hover:border-[#626747]/40 hover:bg-[#FAF7F0]/60'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${tier.urgencyColor}`}>
                        {tier.urgencyBadge}
                      </span>
                      <span className="text-[11px] font-mono text-[#777667]">Protocol 0{idx + 1}</span>
                    </div>
                    <h4 className="text-base font-serif font-normal text-[#2D3525] mb-1">
                      {tier.category}
                    </h4>
                    <p className="text-xs text-[#777667] line-clamp-1 font-sans">
                      {tier.timeframe}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column (7 cols): Selected Protocol Details Card (Double-Bezel Hardware Architecture) */}
            <div className="lg:col-span-7 bg-[#E9E6D8]/50 p-2 sm:p-2.5 rounded-[2.5rem] border border-[#D8D3C3]">
              <div className="bg-[#FAF7F0] rounded-[calc(2.5rem-0.625rem)] p-7 sm:p-9 shadow-xs relative overflow-hidden">
                {/* Subtle Watermark Emblem: Skeletal Hand with Golden Orbital Ribbons */}
                <div
                  className="absolute -top-6 -right-6 w-56 h-56 pointer-events-none select-none opacity-25 mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)] z-0"
                  aria-hidden="true"
                >
                  <Image
                    src="/resources/skeletal_hand_orbital.png"
                    alt="Surgical Precision Emblem"
                    fill
                    sizes="224px"
                    className="object-contain"
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-[#D8D3C3]/40 pb-4 mb-6">
                    <div>
                      <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#626747] font-semibold block">
                        Recommended Triage Protocol
                      </span>
                      <h3 className="text-2xl font-serif font-light text-[#2D3525]">
                        {REFERRAL_TIERS[referringActiveUrgency].category}
                      </h3>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${REFERRAL_TIERS[referringActiveUrgency].urgencyColor}`}>
                      {REFERRAL_TIERS[referringActiveUrgency].urgencyBadge}
                    </span>
                  </div>

                  <div className="space-y-6 text-xs sm:text-[13px] font-sans">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#626747] font-bold mb-1">
                        Target Timeframe
                      </p>
                      <p className="text-[#2D3525] font-medium">
                        {REFERRAL_TIERS[referringActiveUrgency].timeframe}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#626747] font-bold mb-1">
                        Clinical Indications &amp; Presentation
                      </p>
                      <p className="text-[#777667] leading-relaxed">
                        {REFERRAL_TIERS[referringActiveUrgency].indications}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F3F0E5] border border-[#D8D3C3]/60">
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#626747] font-bold mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-[#626747]" />
                        Immediate Stabilization &amp; Handling
                      </p>
                      <p className="text-[#2D3525] leading-relaxed">
                        {REFERRAL_TIERS[referringActiveUrgency].diagnosticProtocol}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#626747] font-bold mb-1">
                        Required Imaging / Studies
                      </p>
                      <p className="text-[#777667] leading-relaxed">
                        {REFERRAL_TIERS[referringActiveUrgency].radiologyRequired}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#D8D3C3]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#777667]">
                      <span>Clinical Note Return: Guaranteed within 24–48 hours</span>
                      <span className="font-mono text-[#626747]">referrals@traversosurgery.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars of Physician Collaboration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#626747]/10 flex items-center justify-center shrink-0 text-[#626747]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2D3525] mb-1">Same-Day Urgent Hold</h4>
                <p className="text-xs text-[#777667] leading-relaxed">
                  Dedicated slots held daily in both Manhattan and Greenwich for acute trauma referrals.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#626747]/10 flex items-center justify-center shrink-0 text-[#626747]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2D3525] mb-1">Direct EHR Sharing</h4>
                <p className="text-xs text-[#777667] leading-relaxed">
                  Fast electronic exchange via Epic CareLink and Nuance PowerShare image networks.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F0] border border-[#D8D3C3] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#626747]/10 flex items-center justify-center shrink-0 text-[#626747]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2D3525] mb-1">Direct MD Line</h4>
                <p className="text-xs text-[#777667] leading-relaxed">
                  Connect straight to Dr. Traverso for challenging differential diagnoses or image reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CONSULTATION & CONTACT SECTION (#contact)
          Luxurious Forest #2D3525, interactive multi-step appointment
          terminal with real location toggles, pain metrics, and feedback.
      ───────────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative w-full py-28 md:py-36 px-5 sm:px-8 md:px-14 bg-[#2D3525] text-[#FAF7F0] border-t border-[#626747]/40 scroll-mt-24"
        aria-label="Consultation inquiry and practice locations"
      >
        <div className="max-w-7xl mx-auto relative z-30 pointer-events-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10.5px] uppercase tracking-[0.22em] font-mono font-medium border border-[#FAF7F0]/20 bg-[#FAF7F0]/10 text-[#D8D3C3]">
              Direct Clinical Consultation
            </span>
            <span className="h-px flex-1 max-w-[120px] bg-[#FAF7F0]/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column (5 cols): Practice Locations & Office Coordination */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight font-serif mb-6 text-[#FAF7F0]">
                  Restoring Strength, Precision &amp; Independence
                </h2>

                <p className="text-base text-[#D8D3C3]/85 font-light leading-relaxed mb-8 font-sans">
                  Whether addressing chronic numbness, acute sports injury, or persistent joint stiffness, we conduct unhurried evaluations with complete imaging review and customized restoration plans.
                </p>
              </div>

              {/* Interactive Location Tabs */}
              <div className="space-y-4">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#D8D3C3] font-semibold block">
                  CLINICAL SUITE LOCATIONS
                </span>

                {/* Manhattan Suite Card */}
                <div
                  onClick={() => setSelectedLocation('manhattan')}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedLocation === 'manhattan'
                    ? 'bg-[#3A4532] border-[#D8D3C3] shadow-md ring-1 ring-[#D8D3C3]/30'
                    : 'bg-[#2D3525] border-[#626747]/40 hover:border-[#D8D3C3]/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D8D3C3]" />
                      <span className="font-serif text-lg text-[#FAF7F0]">Manhattan Clinical Suite</span>
                    </div>
                    {selectedLocation === 'manhattan' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#2D3525] font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#D8D3C3]/90 font-sans mb-3">
                    850 5th Avenue, Suite 800 (at 66th Street), New York, NY 10065
                  </p>
                  <div className="pt-3 border-t border-[#FAF7F0]/10 flex items-center justify-between text-[11px] text-[#D8D3C3]/75 font-sans">
                    <span>Subway: 4/5/6 to 68th St | N/R/W to 5th Ave</span>
                    <span>Valet Garage on 66th</span>
                  </div>
                </div>

                {/* Greenwich Pavilion Card */}
                <div
                  onClick={() => setSelectedLocation('greenwich')}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedLocation === 'greenwich'
                    ? 'bg-[#3A4532] border-[#D8D3C3] shadow-md ring-1 ring-[#D8D3C3]/30'
                    : 'bg-[#2D3525] border-[#626747]/40 hover:border-[#D8D3C3]/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D8D3C3]" />
                      <span className="font-serif text-lg text-[#FAF7F0]">Greenwich Surgical Pavilion</span>
                    </div>
                    {selectedLocation === 'greenwich' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#2D3525] font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#D8D3C3]/90 font-sans mb-3">
                    55 Holly Hill Lane, Suite 210, Greenwich, CT 06830
                  </p>
                  <div className="pt-3 border-t border-[#FAF7F0]/10 flex items-center justify-between text-[11px] text-[#D8D3C3]/75 font-sans">
                    <span>Metro-North to Greenwich Station (5 min)</span>
                    <span>Complimentary Parking</span>
                  </div>
                </div>
              </div>

              {/* Office Hours & Telephone */}
              <div className="p-6 rounded-2xl bg-[#343D2C] border border-[#626747]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10.5px] font-mono uppercase tracking-wider text-[#D8D3C3] font-semibold mb-1">
                    Direct Appointments Desk
                  </p>
                  <p className="font-serif text-xl text-[#FAF7F0]">(212) 555-0199</p>
                  <p className="text-xs text-[#D8D3C3]/70 font-sans mt-0.5">Monday – Friday: 8:30 AM – 5:00 PM</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('(212) 555-0199', false)}
                  className="px-4 py-2 rounded-full border border-[#D8D3C3]/40 text-xs text-[#FAF7F0] hover:bg-[#FAF7F0]/10 transition-colors shrink-0"
                >
                  {copiedPhone ? 'Copied!' : 'Copy Number'}
                </button>
              </div>
            </div>

            {/* Right Column (7 cols): Shadcn-Style Interactive Consultation Terminal */}
            <div className="lg:col-span-7 bg-[#FAF7F0]/5 p-2 sm:p-2.5 rounded-[2.5rem] border border-[#FAF7F0]/10 shadow-2xl">
              <div className="bg-[#343D2C] rounded-[calc(2.5rem-0.625rem)] p-7 sm:p-10 border border-[#626747]/40 shadow-inner">
                <div className="border-b border-[#FAF7F0]/15 pb-4 mb-7 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#FAF7F0] font-light">
                      Request Consultation
                    </h3>
                    <p className="text-xs text-[#D8D3C3]/80 font-sans mt-1">
                      Our clinical care coordinator will review your history and confirm within 24 hours.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-[#626747] bg-[#2D3525] text-[#D8D3C3]">
                    HIPAA Secure
                  </span>
                </div>

                {formSubmitted ? (
                  <div className="p-8 sm:p-10 rounded-2xl bg-[#2D3525] border border-[#626747] text-center space-y-4 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#626747]/30 border border-[#626747] flex items-center justify-center mx-auto text-[#FAF7F0]">
                      <Check className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0]">
                      Consultation Request Received
                    </h4>
                    <p className="text-xs sm:text-sm text-[#D8D3C3] max-w-md mx-auto leading-relaxed font-sans">
                      Thank you, <strong>{patientName || 'Patient'}</strong>. We have registered your request for <strong>{selectedConditionType}</strong> at our <strong>{selectedLocation === 'manhattan' ? 'Manhattan Suite' : 'Greenwich Pavilion'}</strong>.
                    </p>

                    <div className="p-4 rounded-xl bg-[#343D2C] border border-[#FAF7F0]/10 max-w-sm mx-auto text-left text-xs font-mono text-[#D8D3C3] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="opacity-70">Triage Reference:</span>
                        <span className="text-[#FAF7F0] font-bold">TRV-2026-892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Preferred Window:</span>
                        <span className="text-[#FAF7F0]">{preferredTime === 'morning' ? 'Morning (8:30am–12pm)' : 'Afternoon (1pm–5pm)'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Prior Imaging:</span>
                        <span className="text-[#FAF7F0]">{hasPriorImaging ? 'On File / Discs In Hand' : 'To Be Coordinated'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setPatientName('');
                        setPatientPhone('');
                        setPatientEmail('');
                        setSymptomsNotes('');
                      }}
                      className="mt-4 px-6 py-2.5 rounded-full border border-[#D8D3C3]/40 text-xs text-[#FAF7F0] hover:bg-[#626747] transition-colors"
                    >
                      Submit Another Consultation Request
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                    className="space-y-6 text-xs font-sans"
                  >
                    {/* Condition Selector Pills */}
                    <div>
                      <label className="block text-[#D8D3C3] uppercase tracking-wider text-[10.5px] font-mono mb-2.5 font-medium">
                        01. Primary Condition / Area of Concern *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          'Hand Numbness & Carpal Tunnel',
                          'Base of Thumb Pain (CMC)',
                          'Wrist Pain / Sports Injury',
                          'Trigger Finger & Tendon Snapping',
                        ].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedConditionType(type)}
                            className={`px-3.5 py-3 rounded-xl text-left text-xs transition-all ${selectedConditionType === type
                              ? 'bg-[#626747] text-[#FAF7F0] font-medium border border-[#FAF7F0]/40 shadow-xs'
                              : 'bg-[#2D3525] text-[#D8D3C3] border border-[#626747]/40 hover:border-[#D8D3C3]/60'
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location & Preferred Time of Day */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#D8D3C3] uppercase tracking-wider text-[10.5px] font-mono mb-2 font-medium">
                          02. Clinical Location *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedLocation('manhattan')}
                            className={`py-2.5 px-3 rounded-xl text-center border text-xs transition-colors ${selectedLocation === 'manhattan'
                              ? 'bg-[#626747] border-[#FAF7F0]/40 text-[#FAF7F0]'
                              : 'bg-[#2D3525] border-[#626747]/40 text-[#D8D3C3] hover:border-[#D8D3C3]'
                              }`}
                          >
                            Manhattan
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedLocation('greenwich')}
                            className={`py-2.5 px-3 rounded-xl text-center border text-xs transition-colors ${selectedLocation === 'greenwich'
                              ? 'bg-[#626747] border-[#FAF7F0]/40 text-[#FAF7F0]'
                              : 'bg-[#2D3525] border-[#626747]/40 text-[#D8D3C3] hover:border-[#D8D3C3]'
                              }`}
                          >
                            Greenwich
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#D8D3C3] uppercase tracking-wider text-[10.5px] font-mono mb-2 font-medium">
                          03. Preferred Time Window
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPreferredTime('morning')}
                            className={`py-2.5 px-3 rounded-xl text-center border text-xs transition-colors ${preferredTime === 'morning'
                              ? 'bg-[#626747] border-[#FAF7F0]/40 text-[#FAF7F0]'
                              : 'bg-[#2D3525] border-[#626747]/40 text-[#D8D3C3] hover:border-[#D8D3C3]'
                              }`}
                          >
                            Morning (8:30–12)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredTime('afternoon')}
                            className={`py-2.5 px-3 rounded-xl text-center border text-xs transition-colors ${preferredTime === 'afternoon'
                              ? 'bg-[#626747] border-[#FAF7F0]/40 text-[#FAF7F0]'
                              : 'bg-[#2D3525] border-[#626747]/40 text-[#D8D3C3] hover:border-[#D8D3C3]'
                              }`}
                          >
                            Afternoon (1–5)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Patient Contact Information */}
                    <div>
                      <label className="block text-[#D8D3C3] uppercase tracking-wider text-[10.5px] font-mono mb-2 font-medium">
                        04. Patient Contact Details *
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Full Name (e.g., Katherine Miller)"
                          className="w-full px-4 py-3.5 rounded-xl bg-[#2D3525] border border-[#626747]/50 text-[#FAF7F0] placeholder-[#D8D3C3]/40 focus:outline-none focus:border-[#D8D3C3] transition-colors"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="tel"
                            required
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            placeholder="Direct Phone (e.g., 212-555-0144)"
                            className="w-full px-4 py-3.5 rounded-xl bg-[#2D3525] border border-[#626747]/50 text-[#FAF7F0] placeholder-[#D8D3C3]/40 focus:outline-none focus:border-[#D8D3C3] transition-colors"
                          />
                          <input
                            type="email"
                            required
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full px-4 py-3.5 rounded-xl bg-[#2D3525] border border-[#626747]/50 text-[#FAF7F0] placeholder-[#D8D3C3]/40 focus:outline-none focus:border-[#D8D3C3] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Prior Imaging Checkbox */}
                    <div
                      onClick={() => setHasPriorImaging(!hasPriorImaging)}
                      className="p-3.5 rounded-xl bg-[#2D3525] border border-[#626747]/40 flex items-center gap-3 cursor-pointer select-none hover:border-[#D8D3C3]/60 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${hasPriorImaging ? 'bg-[#626747] border-[#FAF7F0]' : 'border-[#D8D3C3]/50'}`}>
                        {hasPriorImaging && <Check className="w-3 h-3 text-[#FAF7F0]" />}
                      </div>
                      <span className="text-xs text-[#D8D3C3]">
                        I have recent X-rays, MRI discs, or nerve conduction studies (EMG) available.
                      </span>
                    </div>

                    {/* Brief notes textarea */}
                    <div>
                      <label className="block text-[#D8D3C3] uppercase tracking-wider text-[10.5px] font-mono mb-2 font-medium">
                        05. Symptoms, Duration &amp; Aggravating Factors
                      </label>
                      <textarea
                        rows={3}
                        value={symptomsNotes}
                        onChange={(e) => setSymptomsNotes(e.target.value)}
                        placeholder="e.g. Night waking due to thumb and index tingling for 3 months, worse when holding coffee cup or driving..."
                        className="w-full px-4 py-3.5 rounded-xl bg-[#2D3525] border border-[#626747]/50 text-[#FAF7F0] placeholder-[#D8D3C3]/40 focus:outline-none focus:border-[#D8D3C3] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit CTA Button with Button-in-Button Architecture */}
                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-full bg-[#626747] text-[#FAF7F0] text-xs font-sans font-medium uppercase tracking-wider hover:bg-[#4A4F35] shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                    >
                      <span>Submit Clinical Consultation Request</span>
                      <span className="w-8 h-8 rounded-full bg-[#FAF7F0]/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4 text-[#FAF7F0]" />
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Practice Semantic Footer */}
          <div className="pt-16 mt-20 border-t border-[#FAF7F0]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8D3C3]/70 font-sans gap-4">
            <p>© 2026 Traverso Hand Surgery, P.C. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#about" className="hover:text-[#FAF7F0] transition-colors">Privacy Notice</a>
              <a href="#patients" className="hover:text-[#FAF7F0] transition-colors">Patient Portal</a>
              <a href="#referring" className="hover:text-[#FAF7F0] transition-colors">Physician Referral Protocol</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          REFERRAL ORDER SHEET MODAL (Simulation)
      ───────────────────────────────────────────────────────────── */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF7F0] text-[#2D3525] w-full max-w-lg rounded-3xl p-8 border border-[#D8D3C3] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#D8D3C3]/60 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-[#626747]" />
                <h3 className="font-serif text-xl font-light">Physician Referral Packet</h3>
              </div>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#E9E6D8] flex items-center justify-center text-[#2D3525] hover:bg-[#D8D3C3] transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#777667] leading-relaxed mb-6 font-sans">
              Download our standardized PDF clinical order sheet. Completed orders can be sent directly via fax to <strong>(212) 555-0198</strong> or emailed securely to <strong>referrals@traversosurgery.com</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#F3F0E5] border border-[#D8D3C3] space-y-2 mb-6 text-xs font-mono text-[#2D3525]">
              <div className="flex justify-between">
                <span>Packet Contents:</span>
                <span className="font-bold">Order Form + Imaging Matrix</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Clinical Fax:</span>
                <span className="font-bold">(212) 555-0198</span>
              </div>
              <div className="flex justify-between">
                <span>Triage Cell:</span>
                <span className="font-bold">(212) 555-0199</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-[#D8D3C3] text-xs font-sans hover:bg-[#E9E6D8]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Traverso_Hand_Surgery_Referral_Packet_2026.pdf download initiated.');
                  setDownloadModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#626747] text-[#FAF7F0] text-xs font-sans font-medium hover:bg-[#4A4F35] flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
