import React, { useState, useEffect } from 'react';
import { CASE_STUDIES } from '../data/caseStudies.ts';
import { AngledCarousel } from '../components/AngledCarousel.tsx';
import { ImageWithSkeleton } from '../components/ImageWithSkeleton.tsx';
import { VerticalTextRoller } from '../components/VerticalTextRoller.tsx';
import { getDirectVideoUrl } from '../components/CloudinaryVideo.tsx';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface CaseStudiesPageProps {
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onNavigateHome: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
}

// Client brands strip matching reference
const CLIENT_LOGOS = [
  'DELL',
  'new balance',
  'Ford',
  'ESTÉE LAUDER',
  'BROOKS',
  'Hasbro',
  'nuro',
  'ALSO.',
];

const HEADLINE_TOKENS: (string | React.ReactNode)[] = [
  'Custom',
  <VerticalTextRoller key="roller" words={['sites', 'tools', 'apps']} />,
  'that',
  'turn',
  'visitors',
  'into',
  'paying',
  'clients.',
];

// Dynamic minimal case study grid items from CASE_STUDIES
const MORE_CASE_STUDIES = CASE_STUDIES.map((cs) => ({
  id: cs.id,
  slug: cs.slug,
  title: cs.subtitle || cs.title,
  image: cs.imageUrl,
  videoUrl: cs.videoUrl,
}));

// Helper to pre-warm image and video assets in browser cache on hover
const prewarmCaseStudy = (imageUrl?: string, videoUrl?: string) => {
  if (typeof window === 'undefined') return;
  if (imageUrl) {
    const img = new Image();
    img.src = imageUrl;
  }
  if (videoUrl) {
    const directUrl = getDirectVideoUrl(videoUrl);
    if (directUrl) {
      const existing = document.querySelector(`link[href="${directUrl}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'video';
        link.href = directUrl;
        document.head.appendChild(link);
      }
    }
  }
};

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  onSelectCaseStudy,
  onOpenBookCall,
  onNavigateHome,
  dockStage = 'docked',
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const featured = CASE_STUDIES[0]; // Prince of Web3
  const secondary1 = CASE_STUDIES[1]; // Carizma Hotels
  const secondary2 = CASE_STUDIES[2]; // Scribe
  const secondary3 = CASE_STUDIES.find((cs) => cs.slug === 'alex-hydrate') || CASE_STUDIES[3]; // ALEX Hydrate

  useEffect(() => {
    window.scrollTo(0, 0);

    // Guaranteed 60ms paint buffer before firing animation state
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 60);

    // Pre-warm all optimized case study images into memory immediately
    CASE_STUDIES.forEach((cs) => {
      if (cs.imageUrl) {
        const img = new Image();
        img.src = cs.imageUrl;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0c0c0e] text-white selection:bg-white selection:text-black relative pb-28">
      {/* ============================================================ */}
      {/* 1. TOP HERO HEADER (Matching Reference)                      */}
      {/* ============================================================ */}
      <section className="relative isolate pt-32 sm:pt-40 pb-10 px-6 lg:px-12 max-w-[1340px] mx-auto text-center overflow-visible">
        
        {/* Animated Ember Horizon Flow Gradient Shader Behind Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] sm:w-[130%] h-[380px] sm:h-[480px] pointer-events-none overflow-visible z-0">
          {/* Primary warm amber/orange horizon pulse */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none animate-ember-flow opacity-85"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(252, 128, 0, 0.70) 0%, rgba(240, 78, 35, 0.45) 35%, rgba(180, 35, 10, 0.18) 65%, transparent 85%)',
              filter: 'blur(45px)',
            }}
          />
          {/* Secondary intense deep coral core */}
          <div
            className="absolute inset-0 w-[85%] h-[80%] top-[10%] left-[7.5%] pointer-events-none animate-ember-drift-1 opacity-80"
            style={{
              background:
                'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255, 60, 20, 0.65) 0%, rgba(254, 94, 80, 0.35) 35%, transparent 75%)',
              filter: 'blur(35px)',
            }}
          />
          {/* Ambient wide horizon wash */}
          <div
            className="absolute inset-0 w-[120%] h-[120%] -top-[10%] -left-[10%] pointer-events-none animate-ember-drift-2 opacity-55"
            style={{
              background:
                'radial-gradient(ellipse 85% 65% at 50% 50%, rgba(252, 128, 0, 0.50) 0%, rgba(240, 78, 35, 0.30) 35%, transparent 85%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        {/* Content Container (Elevated above gradient) */}
        <div className="relative z-10">
          {/* Eyebrow */}
          <p
            className={`text-[12px] sm:text-[13px] uppercase tracking-[0.25em] text-white/45 font-medium mb-5 ${
              shouldAnimate ? 'animate-block-reveal' : 'opacity-0'
            }`}
            style={{
              animationDelay: '80ms',
            }}
          >
            PROVEN OUTCOMES
          </p>

          {/* Large Headline with Vertical Roller Transition & Word-by-Word Lens Reveal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.015em] text-white max-w-4xl mx-auto leading-[1.14] md:leading-[1.08] mb-4 text-balance [word-spacing:0.08em]">
            {HEADLINE_TOKENS.map((token, idx) => (
              <span
                key={idx}
                className={`inline-block mr-[0.24em] last:mr-0 ${
                  shouldAnimate ? 'animate-word-lens' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${120 + idx * 75}ms`,
                }}
              >
                {token}
              </span>
            ))}
          </h1>

          <p
            className={`mt-5 sm:mt-6 text-[13px] sm:text-base md:text-[18px] text-white/70 font-light max-w-lg mx-auto leading-relaxed mb-8 text-balance ${
              shouldAnimate ? 'animate-block-reveal' : 'opacity-0'
            }`}
            style={{
              animationDelay: '520ms',
            }}
          >
            High-converting digital products built to scale your business — delivered in days.
          </p>

          {/* Studio Signature Gradient Button */}
          <div
            className={`transition-all duration-300 ${
              shouldAnimate ? 'animate-block-reveal' : 'opacity-0'
            }`}
            style={{
              animationDelay: '680ms',
            }}
          >
            <button
              onClick={onOpenBookCall}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-lg bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[13px] sm:text-[14px] uppercase tracking-[0.06em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#F04E23]/25 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a call</span>
            </button>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. SHOWCASE CAROUSEL (Hero Style 3D Angled Carousel)         */}
      {/* ============================================================ */}
      <section className="w-full relative z-10 overflow-hidden flex flex-col items-center justify-center pt-2 pb-16 sm:pb-24">
        {/* Subtle warm background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(255,102,31,0.07),transparent_70%)]"
          aria-hidden="true"
        />

        {/* Angled Showcase Carousel matching Homepage Hero Section */}
        <div className="w-full relative z-20 shrink-0 pb-3 sm:pb-5 md:pb-12 lg:pb-16">
          <AngledCarousel onSelectCaseStudy={onSelectCaseStudy} />
        </div>

        {/* Seamless Bottom Gradient Fade into obsidian #0c0c0e background */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-36 sm:h-48 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/85 to-transparent z-20"
          aria-hidden="true"
        />
      </section>

      {/* ============================================================ */}
      {/* 3. CLIENT LOGOS STRIP ("Trusted by 300+ companies")          */}
      {/* ============================================================ */}
      <section className="py-14 max-w-[1340px] mx-auto px-6 lg:px-12 text-center">
        <p className="text-[12px] text-white/40 uppercase tracking-[0.15em] font-medium mb-8">
          Trusted by high-growth founders & teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          {CLIENT_LOGOS.map((brand, i) => (
            <span
              key={i}
              className="text-[15px] sm:text-[17px] font-semibold tracking-wider text-white/80 font-mono uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURED CASE STUDY (Large 2-Column Split, No Borders)    */}
      {/* ============================================================ */}
      <section className="py-16 max-w-[1340px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Large Image with Skeleton & High Priority */}
          <div
            onClick={() => onSelectCaseStudy(featured.slug)}
            onMouseEnter={() => prewarmCaseStudy(featured.imageUrl, featured.videoUrl)}
            className="lg:col-span-6 cursor-pointer"
          >
            <ImageWithSkeleton
              src={featured.imageUrl}
              alt={featured.title}
              aspectRatioClass="aspect-[16/11]"
              containerClassName="rounded-md"
              fetchPriority="high"
            />
          </div>

          {/* Right: Editorial Copy & "Read more →" */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h2 className="text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-white leading-tight mb-4">
              How {featured.title} built an authority brand and turned cold traffic into high-value retainers
            </h2>

            <p className="text-[15px] sm:text-[17px] text-white/60 font-light leading-relaxed mb-6 max-w-xl">
              {featured.shortSummary}
            </p>

            <button
              onClick={() => onSelectCaseStudy(featured.slug)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer group"
            >
              <span>Read more</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. 2-COLUMN SECTION (Row 2, Zero Outlines or Hover Offsets)  */}
      {/* ============================================================ */}
      <section className="py-14 max-w-[1340px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Column 1 (Left): Two Stacked Horizontal Items */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            
            {/* Item 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center text-left">
              <div
                onClick={() => onSelectCaseStudy(secondary1.slug)}
                onMouseEnter={() => prewarmCaseStudy(secondary1.imageUrl, secondary1.videoUrl)}
                className="sm:col-span-5 cursor-pointer"
              >
                <ImageWithSkeleton
                  src={secondary1.imageUrl}
                  alt={secondary1.title}
                  aspectRatioClass="aspect-[16/10]"
                  containerClassName="rounded-md"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="sm:col-span-7 flex flex-col items-start">
                <h3 className="text-lg sm:text-xl font-normal text-white leading-snug mb-3">
                  How Carizma Hotels replaced chaotic spreadsheets with a custom reservation engine that fills rooms daily.
                </h3>
                <button
                  onClick={() => onSelectCaseStudy(secondary1.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer group shadow-sm"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center text-left pt-6">
              <div
                onClick={() => onSelectCaseStudy(secondary3.slug)}
                onMouseEnter={() => prewarmCaseStudy(secondary3.imageUrl, secondary3.videoUrl)}
                className="sm:col-span-5 cursor-pointer"
              >
                <ImageWithSkeleton
                  src={secondary3.imageUrl}
                  alt={secondary3.title}
                  aspectRatioClass="aspect-[16/10]"
                  containerClassName="rounded-md"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="sm:col-span-7 flex flex-col items-start">
                <h3 className="text-lg sm:text-xl font-normal text-white leading-snug mb-3">
                  How ALEX Hydrate turned everyday water bottles into an e-commerce brand that sells out drops in hours.
                </h3>
                <button
                  onClick={() => onSelectCaseStudy(secondary3.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer group shadow-sm"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Column 2 (Right): Tall Image Card with Excerpt */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div
              onClick={() => onSelectCaseStudy(secondary2.slug)}
              onMouseEnter={() => prewarmCaseStudy(secondary2.imageUrl, secondary2.videoUrl)}
              className="w-full cursor-pointer mb-5"
            >
              <ImageWithSkeleton
                src={secondary2.imageUrl}
                alt={secondary2.title}
                aspectRatioClass="aspect-[16/10]"
                containerClassName="rounded-md"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug mb-2">
              How Scribe simplified complex AI into a clean web platform that keeps users subscribed and learning.
            </h3>

            <p className="text-sm text-white/60 font-light leading-relaxed mb-4 max-w-md">
              {secondary2.shortSummary}
            </p>

            <button
              onClick={() => onSelectCaseStudy(secondary2.slug)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer group shadow-sm"
            >
              <span>Read more</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TESTIMONIAL QUOTE (Matching Reference)                    */}
      {/* ============================================================ */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-center">
        <p className="text-lg sm:text-2xl font-light text-white/90 leading-relaxed mb-6">
          &ldquo;Vixcee delivered our entire web platform in 6 days. Our conversion rate doubled on launch week, and clients constantly compliment how effortless the experience feels.&rdquo;
        </p>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-white">Marcus Vance</span>
          <span className="text-[11px] text-white/40">Founder &amp; Managing Director</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. MORE CASE STUDIES: 4-COLUMN MINIMAL GRID (Hero Images)    */}
      {/* ============================================================ */}
      <section className="py-16 max-w-[1340px] mx-auto px-6 lg:px-12">
        <div className="text-left mb-8">
          <h2 className="text-xl sm:text-2xl font-normal text-white">
            More case studies
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 text-left">
          {MORE_CASE_STUDIES.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectCaseStudy(item.slug)}
              onMouseEnter={() => prewarmCaseStudy(item.image, item.videoUrl)}
              className="flex flex-col items-start cursor-pointer group"
            >
              {/* Image Frame with Shimmer Skeleton */}
              <div className="w-full mb-3">
                <ImageWithSkeleton
                  src={item.image}
                  alt={item.title}
                  aspectRatioClass="aspect-[16/10]"
                  containerClassName="rounded-md"
                />
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-medium text-white leading-snug mb-3 line-clamp-2">
                {item.title}
              </h3>

              {/* Read More Link */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCaseStudy(item.slug);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer group shadow-sm"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BOTTOM "READY TO MAKE IT REAL" BANNER                     */}
      {/* ============================================================ */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-white mb-4">
          Have a website, app, or tool you need built?
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Stop waiting months for slow agencies. Let&apos;s discuss your project and ship a high-converting digital product for your business next week.
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
      {/* 9. FLOATING BOTTOM-PINNED BREADCRUMB PILL                    */}
      {/* ============================================================ */}
      <div
        className={`fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] pointer-events-auto transition-all duration-500 ease-out ${
          dockStage === 'docked'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Floating breadcrumb"
          className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0c0c0e]/92 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black ring-1 ring-white/5 text-[12px] sm:text-[13px] text-white/60 font-medium select-none"
        >
          <button
            onClick={onNavigateHome}
            className="group hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4 text-white/50 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            <span>Home</span>
          </button>
          <span className="text-white font-medium">Case Studies</span>
        </nav>
      </div>

    </div>
  );
};
