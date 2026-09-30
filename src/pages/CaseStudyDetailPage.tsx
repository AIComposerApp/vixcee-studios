import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CASE_STUDIES } from '../data/caseStudies.ts';
import { CloudinaryVideo, getDirectVideoUrl } from '../components/CloudinaryVideo.tsx';
import { ImageWithSkeleton } from '../components/ImageWithSkeleton.tsx';
import { ChevronLeft, ChevronRight, Copy, Check, Calendar } from 'lucide-react';

interface CaseStudyDetailPageProps {
  slug: string;
  onBackToCaseStudies: () => void;
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onNavigateHome: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
}

const heroEditorialTransition = {
  duration: 3.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

const deepDiveTransition = {
  duration: 2.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

const SECTIONS = [
  { id: 'challenge', label: 'Challenge', index: '01' },
  { id: 'direction', label: 'Direction', index: '02' },
  { id: 'experience', label: 'Experience', index: '03' },
  { id: 'result', label: 'Outcome', index: '04' },
];

// Helper to pre-warm image assets in browser cache on hover
const prewarmImage = (url: string) => {
  if (typeof window === 'undefined' || !url) return;
  const img = new Image();
  img.src = url;
};

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({
  slug,
  onBackToCaseStudies,
  onSelectCaseStudy,
  onOpenBookCall,
  onNavigateHome,
  dockStage = 'docked',
}) => {
  const isRevealed = dockStage !== 'initial';
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('challenge');
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentStudy = CASE_STUDIES.find((cs) => cs.slug === slug) || CASE_STUDIES[0];
  const otherStudies = CASE_STUDIES.filter((cs) => cs.slug !== currentStudy.slug);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Eagerly inject high-priority browser preload hint for active video stream
    if (currentStudy.videoUrl) {
      const directUrl = getDirectVideoUrl(currentStudy.videoUrl);
      if (directUrl && typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.type = 'video/mp4';
        link.href = directUrl;
        link.setAttribute('fetchpriority', 'high');
        link.setAttribute('data-active-study-video', currentStudy.slug);
        document.head.appendChild(link);

        return () => {
          link.remove();
        };
      }
    }
  }, [slug, currentStudy.slug, currentStudy.videoUrl]);

  // Track overall scroll progress & active section
  useEffect(() => {
    const handleScroll = () => {
      // 1. Overall reading progress (0 - 100%)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // 2. Active section detection
      const scrollPos = window.scrollY + 220;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${currentStudy.title} Case Study — Shipped by Vixcee Studios`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSectionMeta = SECTIONS[activeIndex] || SECTIONS[0];

  return (
    <article className="w-full min-h-screen bg-[#0c0c0e] text-white selection:bg-white selection:text-black relative pb-32">
      
      {/* ============================================================ */}
      {/* TOP SUBTLE MONOCHROME READING PROGRESS (Hairline 1.5px)      */}
      {/* ============================================================ */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-white/[0.06]">
        <div
          className="h-full bg-white/70 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ============================================================ */}
      {/* 1. TOP HERO HEADER & OVERVIEW                                */}
      {/* ============================================================ */}
      <motion.div
        className="pt-28 sm:pt-36 max-w-[1240px] mx-auto px-6 lg:px-12 text-left"
        initial={{ opacity: 0, y: 64 }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 64,
        }}
        transition={heroEditorialTransition}
      >
        
        {/* Top Static Title Header */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-normal tracking-[-0.03em] text-white max-w-4xl leading-[1.12] mb-12">
          {currentStudy.subtitle}
        </h1>

        {/* Top 2-Column Split: Image on Left + Summary/Quote on Right (No Redundant Button) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-14 border-b border-white/[0.08]">
          
          {/* Left: Thumbnail/Preview Image with Skeleton Loader */}
          <div className="lg:col-span-6">
            <ImageWithSkeleton
              src={currentStudy.imageUrl}
              alt={currentStudy.title}
              aspectRatioClass="aspect-[16/11]"
              containerClassName="rounded-md"
              fetchPriority="high"
            />
          </div>

          {/* Right: Clean Editorial Summary & Testimonial Quote */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <p className="text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed mb-8">
              {currentStudy.overview[0]} {currentStudy.overview[1]}
            </p>

            {/* Testimonial Block */}
            {currentStudy.clientQuote && (
              <div className="pt-6 border-t border-white/[0.08] w-full">
                <p className="text-base sm:text-[17px] font-light text-white/90 leading-relaxed mb-4">
                  &ldquo;{currentStudy.clientQuote.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.1] text-white font-medium flex items-center justify-center text-xs">
                    {currentStudy.clientQuote.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white">
                      {currentStudy.clientQuote.author}
                    </span>
                    <span className="block text-[11px] text-white/40">
                      {currentStudy.clientQuote.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </motion.div>

      {/* ============================================================ */}
      {/* 2. CASE STUDY VIDEO SHOWCASE, ARTICLE BODY & NEXT PROJECTS   */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 72 }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 72,
        }}
        transition={deepDiveTransition}
      >

      {/* ============================================================ */}
      {/* 2. DEDICATED PROMINENT VIDEO SHOWCASE (Exclusive to this page) */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-18 max-w-[1240px] mx-auto px-6 lg:px-12">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
          <CloudinaryVideo
            videoUrl={currentStudy.videoUrl}
            posterUrl={currentStudy.imageUrl}
            title={currentStudy.title}
            aspectRatio="video"
            alwaysAutoplay={true}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TWO-COLUMN EDITORIAL ARTICLE LAYOUT                       */}
      {/* ============================================================ */}
      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 pb-24 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Sticky Project Specs & In-Page Navigation */}
          <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28">
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-white mb-4">
                {currentStudy.title}
              </h2>
              
              {/* In-Page Navigation Anchors */}
              <nav className="flex flex-col gap-2.5 text-xs text-white/50 mb-8 font-medium">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`text-left transition-colors cursor-pointer ${
                      activeSection === sec.id ? 'text-white font-semibold' : 'hover:text-white'
                    }`}
                  >
                    The {sec.label}
                  </button>
                ))}
              </nav>

              {/* Social Share Strip (Clean Dividers, No Dots) */}
              <div className="pt-6 border-t border-white/[0.08]">
                <span className="text-[11px] text-white/40 block mb-2 font-mono uppercase tracking-wider">
                  Share
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShareLinkedIn}
                    className="text-xs text-white/60 hover:text-white font-medium cursor-pointer"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={handleShareX}
                    className="text-xs text-white/60 hover:text-white font-medium cursor-pointer"
                  >
                    X
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="text-xs text-white/60 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Project Specs */}
            <div className="pt-6 border-t border-white/[0.08] text-xs text-white/50 space-y-3">
              <div>
                <span className="text-white/30 block text-[10px] uppercase font-mono">Industry</span>
                <span className="text-white/80">{currentStudy.industry}</span>
              </div>
              <div>
                <span className="text-white/30 block text-[10px] uppercase font-mono">Platform</span>
                <span className="text-white/80">{currentStudy.platform}</span>
              </div>
              <div>
                <span className="text-white/30 block text-[10px] uppercase font-mono">Services</span>
                <span className="text-white/80">{currentStudy.services.join(', ')}</span>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Editorial Narrative */}
          <main className="lg:col-span-8 flex flex-col gap-16">
            
            {/* PROBLEM / CHALLENGE SECTION */}
            <section id="challenge" className="space-y-6 scroll-mt-24">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono font-medium block">
                01 Problem
              </span>

              <h2 className="text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-white">
                The Challenge
              </h2>

              <p className="text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed">
                {currentStudy.challenge.intro}
              </p>

              {/* Editorial Pull Quote (Clean Neutral Border) */}
              <div className="p-6 rounded-md bg-white/[0.03] text-[15px] sm:text-base font-light text-white/90 leading-relaxed italic border-l-2 border-white/40">
                &ldquo;{currentStudy.challenge.summary}&rdquo;
              </div>

              {/* Requirements Checklist (Clean Monospace Numerals, Zero Dots) */}
              <div className="space-y-3 pt-2">
                {currentStudy.challenge.points.map((pt, i) => (
                  <div key={i} className="flex items-baseline gap-3 text-sm text-white/70 font-light">
                    <span className="text-[11px] font-mono text-white/35 shrink-0 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-white/[0.08]" />

            {/* SOLUTION / DIRECTION SECTION */}
            <section id="direction" className="space-y-6 scroll-mt-24">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono font-medium block">
                02 Direction
              </span>

              <h2 className="text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-white">
                {currentStudy.direction.title}
              </h2>

              {currentStudy.direction.description.map((desc, i) => (
                <p key={i} className="text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed">
                  {desc}
                </p>
              ))}

              {/* Core Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentStudy.direction.questions.map((q, i) => (
                  <div key={i} className="p-4 rounded-md bg-white/[0.03] text-sm text-white font-medium">
                    {q}
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-white/[0.08]" />

            {/* THE EXPERIENCE SECTION */}
            <section id="experience" className="space-y-6 scroll-mt-24">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono font-medium block">
                03 Experience
              </span>

              <h2 className="text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-white">
                {currentStudy.experience.title}
              </h2>

              <p className="text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed">
                {currentStudy.experience.intro}
              </p>

              <div className="space-y-6 pt-2">
                {currentStudy.experience.sections.map((sec, i) => (
                  <div key={i} className="p-6 rounded-md bg-white/[0.02]">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {sec.heading}
                    </h3>
                    <p className="text-sm sm:text-base text-white/65 font-light leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-white/[0.08]" />

            {/* RESULT & KEY TAKEAWAYS */}
            <section id="result" className="space-y-6 scroll-mt-24">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono font-medium block">
                04 Outcome
              </span>

              <h2 className="text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-white">
                {currentStudy.result.title}
              </h2>

              {currentStudy.result.paragraphs.map((para, i) => (
                <p key={i} className="text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Takeaway Block */}
              <div className="p-8 rounded-md bg-white/[0.03] text-center my-6">
                <p className="text-xl sm:text-2xl font-light text-white mb-3">
                  &ldquo;{currentStudy.takeaway.quote}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-white/50 font-light max-w-lg mx-auto">
                  {currentStudy.takeaway.text}
                </p>
              </div>

              {/* Key Features List */}
              <div className="divide-y divide-white/[0.08] pt-4">
                {currentStudy.keyFeatures.map((kf, i) => (
                  <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <span className="text-sm font-medium text-white sm:w-1/3">
                      {kf.title}
                    </span>
                    <span className="text-xs sm:text-sm text-white/60 font-light sm:w-2/3">
                      {kf.description}
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </main>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PRIMARY CONCLUSION CTA BANNER                             */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-white/[0.08] text-center px-6">
        <h2 className="text-2xl sm:text-4xl font-normal text-white mb-3">
          Start building in days
        </h2>
        <p className="text-sm text-white/50 font-light max-w-md mx-auto mb-6">
          Ready to architect your next digital presence? Book a 15-minute consultation.
        </p>
        <button
          onClick={onOpenBookCall}
          className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-lg bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[13px] sm:text-[14px] uppercase tracking-[0.06em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#F04E23]/25 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book a call</span>
        </button>
      </section>

      {/* ============================================================ */}
      {/* 5. "MORE CASE STUDIES" GRID                                  */}
      {/* ============================================================ */}
      <section className="py-16 border-t border-white/[0.08] max-w-[1240px] mx-auto px-6 lg:px-12 text-left">
        <h3 className="text-xl sm:text-2xl font-normal text-white mb-8">
          More case studies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onSelectCaseStudy(study.slug)}
              onMouseEnter={() => prewarmImage(study.imageUrl)}
              className="flex flex-col items-start cursor-pointer group"
            >
              {/* Image Frame with Shimmer Skeleton */}
              <div className="w-full mb-3">
                <ImageWithSkeleton
                  src={study.imageUrl}
                  alt={study.title}
                  aspectRatioClass="aspect-[16/10]"
                  containerClassName="rounded-md"
                />
              </div>
              <h4 className="text-[14px] font-medium text-white leading-snug mb-3 line-clamp-2">
                {study.title}
              </h4>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all group-hover:bg-white/95 shadow-sm">
                <span>Read more</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
      </motion.div>

      {/* ============================================================ */}
      {/* 6. FIXED FLOATING COMMAND DOCK (EXACT SCREENSHOT RESTORATION) */}
      {/* ============================================================ */}
      <div
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] pointer-events-auto transition-all duration-500 ease-out ${
          dockStage === 'docked'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Case study navigation dock"
          className="inline-flex items-center gap-1.5 sm:gap-3.5 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#141416]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black ring-1 ring-white/5 text-[11px] sm:text-[13px] text-white/70 select-none max-w-full"
        >
          {/* Back to Case Studies */}
          <button
            onClick={onBackToCaseStudies}
            className="group hover:text-white transition-colors cursor-pointer flex items-center gap-0.5 sm:gap-1.5 whitespace-nowrap font-medium text-white/80 text-[11px] sm:text-[13px] shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50 group-hover:text-white group-hover:-translate-x-0.5 transition-all shrink-0" />
            <span className="hidden sm:inline">Case Studies</span>
            <span className="inline sm:hidden">Cases</span>
          </button>

          {/* Segmented Section Dashes */}
          <div className="flex items-center gap-1 sm:gap-2 px-0.5 sm:px-1 shrink-0">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`h-[2px] sm:h-[2.5px] rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-3.5 sm:w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                      : 'w-2 sm:w-4 bg-white/25 hover:bg-white/50'
                  }`}
                  title={`Jump to ${sec.label}`}
                  aria-label={`Jump to ${sec.label}`}
                />
              );
            })}
          </div>

          {/* Active Section Indicator e.g. "01 Challenge" */}
          <button
            onClick={() => scrollToSection(activeSection)}
            className="font-mono text-[10px] sm:text-[12px] text-white font-medium whitespace-nowrap cursor-pointer hover:text-white/80 transition-colors shrink-0"
          >
            <span>{currentSectionMeta.index}</span>{' '}
            <span className="capitalize">{currentSectionMeta.label}</span>
          </button>

          {/* Floating Book Call CTA */}
          <button
            onClick={onOpenBookCall}
            className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium text-[10px] sm:text-[12px] transition-all flex items-center gap-0.5 sm:gap-1 whitespace-nowrap cursor-pointer border border-white/10 shrink-0"
          >
            <span>Book call</span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </nav>
      </div>

    </article>
  );
};
