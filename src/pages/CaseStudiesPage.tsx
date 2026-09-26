import React, { useEffect } from 'react';
import { CASE_STUDIES } from '../data/caseStudies.ts';
import { AngledCarousel } from '../components/AngledCarousel.tsx';
import { ImageWithSkeleton } from '../components/ImageWithSkeleton.tsx';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface CaseStudiesPageProps {
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onNavigateHome: () => void;
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

// 4-Column minimal case study grid items using hero carousel images
const MORE_CASE_STUDIES = [
  {
    id: 'prince-of-web3',
    slug: 'prince-of-web3',
    title: 'Building a premium digital presence for a Web3 growth strategist',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
  },
  {
    id: 'carizma-hotels',
    slug: 'carizma-hotels',
    title: 'Designing a smarter front desk for modern hotel operations',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
  },
  {
    id: 'scribe',
    slug: 'scribe',
    title: 'Reimagining how people create, learn, and share knowledge with AI',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
  },
  {
    id: 'chesney-hospitality',
    slug: 'carizma-hotels',
    title: 'A luxury boutique digital presence engineered for direct booking conversion',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358616/Chesney-Hotel-Boutique-bg-front_zde5g3.png',
  },
  {
    id: 'alege-official',
    slug: 'prince-of-web3',
    title: 'Turning personal influence into a recognized institutional advisory brand',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358607/Alege-Official-bg-front_fgcdvr.png',
  },
  {
    id: 'alex-hydration',
    slug: 'scribe',
    title: 'Form follows hydration: Direct-to-consumer product experience',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
  },
];

// Helper to pre-warm image assets in browser cache on hover
const prewarmImage = (url: string) => {
  if (typeof window === 'undefined' || !url) return;
  const img = new Image();
  img.src = url;
};

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  onSelectCaseStudy,
  onOpenBookCall,
  onNavigateHome,
}) => {
  const featured = CASE_STUDIES[0]; // Prince of Web3
  const secondary1 = CASE_STUDIES[1]; // Carizma Hotels
  const secondary2 = CASE_STUDIES[2]; // Scribe (with hero carousel image)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0c0c0e] text-white selection:bg-white selection:text-black relative pb-28">
      
      {/* ============================================================ */}
      {/* 1. TOP HERO HEADER (Matching Reference)                      */}
      {/* ============================================================ */}
      <section className="pt-32 sm:pt-40 pb-10 px-6 lg:px-12 max-w-[1340px] mx-auto text-center">
        
        {/* Eyebrow */}
        <p className="text-[12px] sm:text-[13px] uppercase tracking-[0.25em] text-white/45 font-medium mb-5">
          Case Studies
        </p>

        {/* Large Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-white max-w-3xl mx-auto leading-[1.12] mb-8">
          See how the world&apos;s designers are making it real
        </h1>

        {/* Studio Signature Gradient Button */}
        <div>
          <button
            onClick={onOpenBookCall}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-lg bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[13px] sm:text-[14px] uppercase tracking-[0.06em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#F04E23]/25 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a call</span>
          </button>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. EXACT HERO SECTION CAROUSEL (AngledCarousel)              */}
      {/* ============================================================ */}
      <section className="w-full pb-14 relative z-10 overflow-hidden">
        <AngledCarousel onSelectCaseStudy={onSelectCaseStudy} />
      </section>

      {/* ============================================================ */}
      {/* 3. CLIENT LOGOS STRIP ("Trusted by 300+ companies")          */}
      {/* ============================================================ */}
      <section className="py-14 border-t border-white/[0.08] max-w-[1340px] mx-auto px-6 lg:px-12 text-center">
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
      <section className="py-16 border-t border-white/[0.08] max-w-[1340px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Large Image with Skeleton & High Priority */}
          <div
            onClick={() => onSelectCaseStudy(featured.slug)}
            onMouseEnter={() => prewarmImage(featured.imageUrl)}
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
              AI assisted design at scale, lessons from {featured.title}
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
      <section className="py-14 border-t border-white/[0.08] max-w-[1340px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Column 1 (Left): Two Stacked Horizontal Items */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            
            {/* Item 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center text-left">
              <div
                onClick={() => onSelectCaseStudy(secondary1.slug)}
                onMouseEnter={() => prewarmImage(secondary1.imageUrl)}
                className="sm:col-span-5 cursor-pointer"
              >
                <ImageWithSkeleton
                  src={secondary1.imageUrl}
                  alt={secondary1.title}
                  aspectRatioClass="aspect-square"
                  containerClassName="rounded-md"
                />
              </div>
              <div className="sm:col-span-7 flex flex-col items-start">
                <h3 className="text-lg sm:text-xl font-normal text-white leading-snug mb-3">
                  For {secondary1.title}, operations is just another workspace to optimize
                </h3>
                <button
                  onClick={() => onSelectCaseStudy(secondary1.slug)}
                  className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-medium group transition-colors cursor-pointer"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center text-left pt-6 border-t border-white/[0.06]">
              <div
                onClick={() => onSelectCaseStudy(featured.slug)}
                onMouseEnter={() => prewarmImage("https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358616/Chesney-Hotel-Boutique-bg-front_zde5g3.png")}
                className="sm:col-span-5 cursor-pointer"
              >
                <ImageWithSkeleton
                  src="https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358616/Chesney-Hotel-Boutique-bg-front_zde5g3.png"
                  alt="Chesney Project"
                  aspectRatioClass="aspect-square"
                  containerClassName="rounded-md"
                />
              </div>
              <div className="sm:col-span-7 flex flex-col items-start">
                <h3 className="text-lg sm:text-xl font-normal text-white leading-snug mb-3">
                  One sketch became the flagship product. Vixcee helped them finally finish it
                </h3>
                <button
                  onClick={() => onSelectCaseStudy(featured.slug)}
                  className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-medium group transition-colors cursor-pointer"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Column 2 (Right): Tall Image Card with Excerpt */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div
              onClick={() => onSelectCaseStudy(secondary2.slug)}
              onMouseEnter={() => prewarmImage(secondary2.imageUrl)}
              className="w-full cursor-pointer mb-5"
            >
              <ImageWithSkeleton
                src={secondary2.imageUrl}
                alt={secondary2.title}
                aspectRatioClass="aspect-[16/10]"
                containerClassName="rounded-md"
              />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug mb-2">
              A learning platform that treats technology as a natural extension
            </h3>

            <p className="text-sm text-white/60 font-light leading-relaxed mb-4 max-w-md">
              {secondary2.shortSummary}
            </p>

            <button
              onClick={() => onSelectCaseStudy(secondary2.slug)}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-medium group transition-colors cursor-pointer"
            >
              <span>Read more</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TESTIMONIAL QUOTE (Matching Reference)                    */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-white/[0.08] max-w-3xl mx-auto px-6 text-center">
        <p className="text-lg sm:text-2xl font-light text-white/90 leading-relaxed mb-6">
          &ldquo;It&apos;s the spectrum of possibilities that defines Vixcee for me, it always keeps my imagination active.&rdquo;
        </p>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-white">Alejandro Castaneda</span>
          <span className="text-[11px] text-white/40">Professor & Coordinator, Centro University</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. MORE CASE STUDIES: 4-COLUMN MINIMAL GRID (Hero Images)    */}
      {/* ============================================================ */}
      <section className="py-16 border-t border-white/[0.08] max-w-[1340px] mx-auto px-6 lg:px-12">
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
              onMouseEnter={() => prewarmImage(item.image)}
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
              <h3 className="text-[14px] font-medium text-white leading-snug mb-2 line-clamp-2">
                {item.title}
              </h3>

              {/* Read More Link */}
              <div className="inline-flex items-center gap-1 text-[12px] text-white/60 group-hover:text-white font-medium transition-colors">
                <span>Read more</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BOTTOM "READY TO MAKE IT REAL" BANNER                     */}
      {/* ============================================================ */}
      <section className="py-24 border-t border-white/[0.08] text-center px-6">
        <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-white mb-4">
          Ready to make it real?
        </h2>
        <p className="text-sm sm:text-base text-white/50 font-light max-w-md mx-auto mb-8">
          Join designers, founders, and leaders shipping next-generation digital products in days.
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
      <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] pointer-events-auto">
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
