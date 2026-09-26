import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'prince-of-web3',
    name: 'Princeofweb3',
    role: 'Web3 KOL',
    quote: '“One year since launch, and my website is still working for my business.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790409590/Prince-of-Web3-profile_pwk6qi.png',
  },
  {
    id: 'alex-kim',
    name: 'Alex Kim',
    role: 'Front-end Developer',
    quote: '“The prompts saved me hours of back and forth with my coding agent.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790409916/Developer_wearing_hoodie_and_gla__2K_20260926090350_oowzsq.jpg',
  },
  {
    id: 'rachel-green',
    name: 'Rachel Green',
    role: 'Owner, Boutique Shop',
    quote: '“My website was live in five days. It looks better than anything I had before.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790409914/Man_wearing_suit_jacket_2K_20260926090349_rmtthz.jpg',
  },
  {
    id: 'sam-patel',
    name: 'Sam Patel',
    role: 'Vibe Coder',
    quote: '“I stopped burning tokens on bad generations. These prompts just work.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790410050/Black_male_software_developer_po__2K_20260926090718_gd2qir.jpg',
  },
  {
    id: 'laura-bennett',
    name: 'Laura Bennett',
    role: 'Founder, Consultancy',
    quote: '“The onboarding was painless. I knew exactly what I was getting.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790409920/Man_posing_for_headshot_2K_20260926090420_eyjjps.jpg',
  },
  {
    id: 'nina-alvarez',
    name: 'Nina Alvarez',
    role: 'Owner, Dental Clinic',
    quote: '“I got more leads in the first week than the previous month.”',
    avatar: 'https://res.cloudinary.com/divndlntm/image/upload/v1790410800/Male_developer_headshot_2K_20260926091944_kyoyna.jpg',
  },
];

export const HomeTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-advance every 6.5 seconds when not hovered
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  return (
    <section
      className="home-testimonials relative w-full bg-[#FFFFFF] text-[#0C0C0E] py-20 sm:py-24 overflow-hidden select-none border-t border-[#0C0C0E]/[0.06]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="What clients and developers say about working with Vixcee Studios"
    >
      {/* ============================================================ */}
      {/* BACKGROUND GRAPHIC RAILS: Stylized Vertical VIXCEE Watermark */}
      {/* ============================================================ */}
      <div
        className="testimonials-rails absolute inset-0 pointer-events-none flex justify-between px-2 sm:px-6 overflow-hidden"
        aria-hidden="true"
      >
        {/* Left Rails Group */}
        <div className="testimonials-rails-group flex gap-2 sm:gap-4 h-full">
          {/* Rail 1 */}
          <div className="testimonials-rail flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 2 (Flipped 180deg) */}
          <div className="testimonials-rail is-flipped flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 3 */}
          <div className="testimonials-rail flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 4 (Desktop Only, Flipped) */}
          <div className="testimonials-rail is-flipped is-desktop-only hidden lg:flex flex-col justify-between items-center w-20 h-full overflow-hidden opacity-[0.035]">
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 5 (Desktop Only) */}
          <div className="testimonials-rail is-desktop-only hidden lg:flex flex-col justify-between items-center w-20 h-full overflow-hidden opacity-[0.035]">
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>
        </div>

        {/* Right Rails Group */}
        <div className="testimonials-rails-group flex gap-2 sm:gap-4 h-full">
          {/* Rail 1 (Flipped) */}
          <div className="testimonials-rail is-flipped flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 2 */}
          <div className="testimonials-rail flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 3 (Flipped) */}
          <div className="testimonials-rail is-flipped flex flex-col justify-between items-center w-14 sm:w-16 lg:w-20 h-full overflow-hidden opacity-[0.04]">
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-4xl sm:text-6xl lg:text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 4 (Desktop Only) */}
          <div className="testimonials-rail is-desktop-only hidden lg:flex flex-col justify-between items-center w-20 h-full overflow-hidden opacity-[0.035]">
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>

          {/* Rail 5 (Desktop Only, Flipped) */}
          <div className="testimonials-rail is-flipped is-desktop-only hidden lg:flex flex-col justify-between items-center w-20 h-full overflow-hidden opacity-[0.035]">
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
            <span className="block [writing-mode:vertical-rl] rotate-180 font-black tracking-[0.25em] text-7xl text-[#0C0C0E]">
              VIXCEE
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION CONTENT: Clean Heading, Interactive Dots, & Slider   */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        
        {/* Main Heading */}
        <h2
          className="testimonials-heading text-center text-[#0C0C0E] font-bold text-2xl sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.03em] max-w-[680px]"
          aria-label="What clients and developers say about working with Vixcee Studios"
        >
          <div className="home-line-mask overflow-hidden py-0.5">
            <div className="home-line">What clients and developers say</div>
          </div>
          <div className="home-line-mask overflow-hidden py-0.5">
            <div className="home-line">about working with Vixcee Studios</div>
          </div>
        </h2>

        {/* Interactive Avatar Navigation Dots */}
        <div
          className="testimonials-dots flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10"
          role="tablist"
          aria-label="Testimonial Navigation"
        >
          {TESTIMONIALS.map((t, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`testimonial-panel-${t.id}`}
                aria-label={`Testimonial ${idx + 1} from ${t.name}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`testimonials-dot relative w-[52px] h-[52px] flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C0C0E] transition-all duration-300 ${
                  isActive ? 'is-active z-10' : 'hover:scale-105'
                }`}
              >
                <span
                  className={`testimonials-dot-avatar block w-[52px] h-[52px] rounded-full overflow-hidden border-[2px] transition-all duration-300 ${
                    isActive
                      ? 'border-[#0C0C0E] opacity-100 scale-110 shadow-[0_6px_20px_rgba(12,12,12,0.18)] ring-2 ring-[#0C0C0E]/15'
                      : 'border-[#0C0C0E]/20 opacity-50 scale-[0.78] hover:opacity-85 hover:scale-[0.88] hover:border-[#0C0C0E]/40'
                  }`}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none bg-neutral-100"
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Viewport and Active Slide Content (No Buttons) */}
        <div className="testimonials-viewport w-full max-w-[680px] mt-8 sm:mt-10 min-h-[190px] flex flex-col items-center">
          {TESTIMONIALS.map((t, idx) => {
            const isActive = idx === activeIndex;
            if (!isActive) return null;

            return (
              <div
                key={t.id}
                id={`testimonial-panel-${t.id}`}
                role="tabpanel"
                aria-label={`Testimonial from ${t.name}`}
                className="testimonial-slide w-full flex flex-col items-center text-center animate-fade-in"
              >
                {/* Quote */}
                <blockquote className="testimonial-quote text-[#0C0C0E] font-medium text-xl sm:text-[23px] md:text-[25px] leading-[1.38] max-w-[620px]">
                  {t.quote}
                </blockquote>

                {/* Speaker Identity Meta */}
                <div className="testimonial-meta mt-6 flex flex-col items-center">
                  <div className="testimonial-name-mask overflow-hidden">
                    <span className="testimonial-name block font-bold text-lg sm:text-xl uppercase tracking-wider text-[#0C0C0E] leading-tight">
                      {t.name}
                    </span>
                  </div>
                  <div className="testimonial-title text-[#0C0C0E]/65 text-sm sm:text-base leading-normal mt-1 max-w-[420px] font-normal">
                    {t.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
