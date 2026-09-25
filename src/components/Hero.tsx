import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { PromptIcon } from './PromptIcon.tsx';
import { DotGridBackground } from './DotGridBackground.tsx';
import { AngledCarousel } from './AngledCarousel.tsx';
import { VerticalTextRoller } from './VerticalTextRoller.tsx';

interface HeroProps {
  onOpenPrompts: () => void;
  onOpenBookCall: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPrompts, onOpenBookCall }) => {
  return (
    <section
      id="homepage-hero"
      className="homepage-hero relative w-full bg-[#0c0c0e] overflow-x-clip min-h-[100dvh] flex flex-col justify-between items-center md:min-h-screen md:h-auto md:justify-start"
      aria-label="Hero - Your sites live in days, not weeks"
    >
      {/* 1. Exact Melius Interactive 3D Atomic Orbit Dot Grid in Signature Melius Orange (#F04E23)
          Desktop & Tablet (>= 768px): Interactive 3D atomic orbit hover effect
          Mobile (< 768px): Static pristine grid with zero touch distortion for effortless scrolling */}
      <DotGridBackground
        dotColor="#F04E23"
        dotSize={3}
        dotSpacing={28}
        orbitSpeed={1.5}
        impactRadius={120}
        scaleOnHover={1.8}
        enableRevolve={true}
        fadeEdges={true}
        desktopAndTabletOnly={true}
      />

      {/* 2. Seamless radial vignette overlay smoothly dissolving outer dots into #0c0c0e */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] select-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(12, 12, 14, 0.65) 65%, #0c0c0e 95%)',
        }}
      />

      {/* Top subtle linear edge fade for seamless header blending */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0c0c0e] to-transparent z-[2]" />

      {/* 4. Hero Text Container:
          - On Mobile: Compact, elegant vertical spacing fitting alongside the carousel inside 100dvh upfront.
          - On Desktop: Centered, spacious fold with ample breathing room. */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-28 pb-3 md:pb-8 px-4 sm:px-6 pointer-events-auto md:min-h-[calc(100dvh-100px)]">
        <div className="homepage-hero__text-container flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Headline */}
          <div className="homepage-hero__text-container-localized-hero-text max-w-4xl">
            <h1 className="text-[28px] sm:text-4xl md:text-6xl lg:text-[74px] font-light tracking-[-0.015em] text-white leading-[1.18] md:leading-[1.08] text-balance select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] [word-spacing:0.08em]">
              Your{' '}
              <VerticalTextRoller words={['sites', 'tools', 'apps']} />{' '}
              live in days, not weeks
            </h1>
          </div>

          {/* Subheading with clean breathing space */}
          <div className="mt-2.5 sm:mt-4 md:mt-7 max-w-2xl">
            <p className="text-[13px] sm:text-base md:text-[19px] text-white/80 font-light leading-relaxed text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              We build mobile-first websites that work for your business. Get free optimized prompts for your AI coding agent.
            </p>
          </div>

          {/* Action Buttons: "Get prompts" and "Book a call" */}
          <div className="mt-3.5 sm:mt-6 md:mt-9 flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            {/* Primary CTA: "Get prompts" */}
            <button
              onClick={onOpenPrompts}
              className="min-w-[140px] sm:min-w-[160px] md:min-w-[176px] h-[44px] sm:h-[50px] md:h-[54px] px-4 sm:px-6 md:px-7 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.08em] rounded-[4px] hover:brightness-110 hover:shadow-[0_8px_30px_rgba(240,78,35,0.45)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#F04E23]/30 cursor-pointer group"
            >
              <PromptIcon
                variant="white"
                className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm"
              />
              <span className="font-semibold tracking-wider text-white">Get prompts</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Secondary CTA: "Book a call" */}
            <button
              onClick={onOpenBookCall}
              className="min-w-[130px] sm:min-w-[150px] md:min-w-[160px] h-[42px] sm:h-[48px] md:h-[54px] px-4 sm:px-6 md:px-7 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 hover:border-white/40 text-white font-medium text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.08em] rounded-[4px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer shadow-lg shadow-black/40"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span>Book a call</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Angled Showcase Carousel:
          - On Mobile: Sits directly in the lower portion of the screen, with both its top and bottom edges 100% visible upfront without scrolling.
          - On Desktop: Peaks slightly above the bottom fold; scrolling brings the full carousel into view.
          - Seamless Dark Transition: The dot grid and background dissolve into pure solid #0c0c0e starting from the vertical center of the carousel cards. */}
      <div className="w-full relative z-20 shrink-0 pb-3 sm:pb-5 md:pb-12 lg:pb-16">
        <AngledCarousel />
      </div>

      {/* Underneath the carousel: Solid obsidian black floor guarantee */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-[#0c0c0e] z-[1]" />
    </section>
  );
};
