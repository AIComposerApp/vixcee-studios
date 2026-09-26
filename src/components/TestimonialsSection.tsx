import React, { useRef, useState, useEffect } from 'react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'alex-kim',
    name: 'Alex Kim',
    role: 'Front-end Developer',
    avatar:
      'https://images.okaydev.co/production/uploads/u/ericdjohnson/avatars/eric-llama-upright.jpg?w=104&auto=compress%2Cformat&fit=min&dm=1717178634&s=fdadae2d8598c67349cb744081f33dee',
    quote: 'The prompts saved me hours of back and forth with my coding agent.',
    rating: 5,
  },
  {
    id: 'rachel-green',
    name: 'Rachel Green',
    role: 'Owner, Boutique Shop',
    avatar:
      'https://images.okaydev.co/production/uploads/u/MeesRutten/avatars/Instagram-post-3.png?w=104&auto=compress%2Cformat&fit=min&dm=1770518432&s=aee0ab3cac0fca72232ba67f6ff79af2',
    quote: 'My website was live in five days. It looks better than anything I had before.',
    rating: 5,
  },
  {
    id: 'sam-patel',
    name: 'Sam Patel',
    role: 'Vibe Coder',
    avatar:
      'https://images.okaydev.co/production/uploads/u/elliottmangham/avatars/elliott-avatar-1k.png?w=104&auto=compress%2Cformat&fit=min&dm=1771954248&s=5e9f691d41a03243319beb59a8826134',
    quote: 'I stopped burning tokens on bad generations. These prompts just work.',
    rating: 5,
  },
  {
    id: 'laura-bennett',
    name: 'Laura Bennett',
    role: 'Founder, Consultancy',
    avatar:
      'https://images.okaydev.co/production/uploads/u/iliketoplay/avatars/5_headshot.jpg?w=104&auto=compress%2Cformat&fit=min&dm=1717181333&s=ef259d3eb43a500fde02b6438d9c7b20',
    quote: 'The onboarding was painless. I knew exactly what I was getting.',
    rating: 5,
  },
];

interface TestimonialsSectionProps {
  onOpenPrompts?: () => void;
  onOpenBookCall?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenPrompts,
  onOpenBookCall,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Preload avatars
  useEffect(() => {
    TESTIMONIALS.forEach((item) => {
      const img = new Image();
      img.src = item.avatar;
    });
  }, []);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calculate approximate active card index based on scroll position
    const cardWidth = 360 + 24; // card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), TESTIMONIALS.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll<HTMLElement>('.testimonial-card');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    scrollToIndex(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(TESTIMONIALS.length - 1, activeIndex + 1));
  };

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#0c0c0e] py-20 sm:py-28 md:py-32 overflow-hidden select-none"
      aria-label="Client and developer testimonials"
    >
      {/* Background Decorative Rails (Inspired by reference aesthetic with subtle VIXCEE branding) */}
      <div
        className="pointer-events-none absolute inset-0 flex justify-between px-2 sm:px-6 md:px-12 opacity-[0.03] overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="flex gap-4 sm:gap-8">
          <div className="flex flex-col justify-between py-6 text-7xl sm:text-8xl font-black uppercase tracking-tighter leading-none [writing-mode:vertical-lr] rotate-180">
            <span>VIXCEE</span>
            <span>STUDIOS</span>
          </div>
          <div className="hidden sm:flex flex-col justify-between py-6 text-7xl sm:text-8xl font-black uppercase tracking-tighter leading-none [writing-mode:vertical-lr]">
            <span>VIXCEE</span>
            <span>STUDIOS</span>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <div className="hidden sm:flex flex-col justify-between py-6 text-7xl sm:text-8xl font-black uppercase tracking-tighter leading-none [writing-mode:vertical-lr] rotate-180">
            <span>VIXCEE</span>
            <span>STUDIOS</span>
          </div>
          <div className="flex flex-col justify-between py-6 text-7xl sm:text-8xl font-black uppercase tracking-tighter leading-none [writing-mode:vertical-lr]">
            <span>VIXCEE</span>
            <span>STUDIOS</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Ambient Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] rounded-full opacity-20 blur-[130px]"
        style={{
          background: 'radial-gradient(ellipse at center, #FC8000 0%, #FE5E50 45%, #FF96AD 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* ============================================================ */}
        {/* TOP SECTION: Centered Header                                 */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Section Category Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-medium tracking-wide uppercase text-white/80 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FE5E50] animate-pulse" />
            Social Proof
          </div>

          {/* Main Large Bold Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
            Testimonials
          </h2>

          {/* Description */}
          <p className="mt-3.5 sm:mt-4 text-base sm:text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-xl text-balance">
            What clients and developers say about working with Vixcee Studios
          </p>

          {/* Interactive Avatar Navigation Dots */}
          <div
            className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-8 sm:mt-10"
            role="tablist"
            aria-label="Testimonial switcher"
          >
            {TESTIMONIALS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={`avatar-btn-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`View testimonial from ${item.name}`}
                  onClick={() => scrollToIndex(idx)}
                  className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-[#FE5E50] ring-offset-2 ring-offset-[#0c0c0e] scale-110'
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/20 select-none"
                    loading="lazy"
                  />
                  {isActive && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#FE5E50]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Arrow Controls (Desktop / Tablet Header Bar) */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
          <div className="text-xs sm:text-sm text-white/40 tracking-wider uppercase font-medium">
            Swipe or scroll to explore
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              aria-label="Previous testimonial"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/30'
                  : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              aria-label="Next testimonial"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/30'
                  : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM SECTION: Horizontal Card Row                          */}
        {/* ============================================================ */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {TESTIMONIALS.map((item, index) => {
            const isPartiallyVisibleNotice = index === 3;
            return (
              <div
                key={item.id}
                className="testimonial-card snap-start shrink-0 w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[420px] flex flex-col justify-between rounded-[22px] sm:rounded-[26px] bg-[#121216]/90 backdrop-blur-md border border-white/[0.08] p-7 sm:p-8 hover:border-[#FE5E50]/40 hover:bg-[#15151b] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)] group relative"
              >
                {/* Top: 5 Stars Rating + Quotation Mark Graphic */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F59E0B] fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Subtle Quote Icon */}
                    <span className="text-white/20 group-hover:text-[#FE5E50]/40 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-[17px] sm:text-[19px] md:text-[20px] font-medium text-white/95 leading-[1.38] tracking-[-0.01em] min-h-[72px] sm:min-h-[84px]">
                    “{item.quote}”
                  </blockquote>
                </div>

                {/* Bottom: User Profile (Avatar + Name + Role) */}
                <div className="pt-6 sm:pt-7 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/20 bg-white/5 shrink-0">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full object-cover select-none"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] sm:text-base font-bold text-white tracking-[-0.01em] group-hover:text-white">
                        {item.name}
                      </span>
                      <span className="text-[13px] sm:text-[14px] text-white/60 font-light">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  {/* Verified Indicator Badge */}
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium text-white/50"
                    title="Verified client or partner"
                  >
                    <svg className="w-3 h-3 text-[#FC8000]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>

                {/* Partially visible visual hint on Card 4 */}
                {isPartiallyVisibleNotice && (
                  <div className="sr-only">Additional client review</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Actions */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-sm sm:text-base text-white/60 font-light">
            Ready to build a mobile-first website that works for your business?
          </p>
          <button
            type="button"
            onClick={onOpenBookCall}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FC8000] via-[#FE5E50] to-[#FF96AD] text-white font-medium text-sm hover:opacity-95 transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(254,94,80,0.3)] hover:scale-[1.02]"
          >
            <span>Start Your Project</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};
