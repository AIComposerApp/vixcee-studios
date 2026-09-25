import React, { useEffect } from 'react';

interface KingCarouselProps {
  onOpenPrompts?: (promptId?: string) => void;
  onOpenBookCall?: () => void;
}

interface StepItem {
  step: string;
  icon: string;
  heading: string;
  description: string;
  ctaText: string;
  action: 'start' | 'view' | 'book';
}

const STEPS: StepItem[] = [
  {
    step: '01',
    icon: 'https://res.cloudinary.com/divndlntm/image/upload/v1790292660/LiveFast_avrpcf.svg',
    heading: 'Submit the onboarding form',
    description: 'Tell me about your business and what you need. Takes five minutes.',
    ctaText: 'Start >',
    action: 'start',
  },
  {
    step: '02',
    icon: 'https://res.cloudinary.com/divndlntm/image/upload/v1790292714/FreePrompts_2_tyydzw.svg',
    heading: 'Get your custom website plan',
    description: 'You receive a clear plan with timeline and scope. No surprises.',
    ctaText: 'View >',
    action: 'view',
  },
  {
    step: '03',
    icon: 'https://res.cloudinary.com/divndlntm/image/upload/v1790292860/UpcomingRelease_axywpv.svg',
    heading: 'Your website goes live in days',
    description: 'High-end mobile-first design built and launched. You focus on your business.',
    ctaText: 'Book >',
    action: 'book',
  },
];

export const KingCarousel: React.FC<KingCarouselProps> = ({
  onOpenPrompts,
  onOpenBookCall,
}) => {
  // Pre-cache process icons in background
  useEffect(() => {
    STEPS.forEach((step) => {
      const icon = new Image();
      icon.src = step.icon;
    });
  }, []);

  const handleStepAction = (action: 'start' | 'view' | 'book') => {
    if (action === 'start' || action === 'book') {
      onOpenBookCall?.();
    } else if (action === 'view') {
      onOpenPrompts?.();
    }
  };

  return (
    <section
      id="grow-your-business"
      className="relative w-full bg-[#0c0c0e] py-16 sm:py-24 md:py-28 lg:py-32 overflow-hidden select-none"
      aria-label="Simple and fast website process"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* ============================================================ */}
        {/* "Simple and fast" Section Header                             */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-18 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
            Simple and fast
          </h2>
          <p className="mt-3.5 sm:mt-4 text-base sm:text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-xl text-balance">
            Three steps from first contact to a live website
          </p>
        </div>

        {/* ============================================================ */}
        {/* Three-Column Step Grid                                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-[1240px] mx-auto">
          {STEPS.map((stepItem, index) => (
            <div
              key={index}
              className="flex flex-col items-start text-left p-6 sm:p-7 md:p-8 rounded-[18px] sm:rounded-[22px] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
            >
              {/* Step Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={stepItem.icon}
                  alt={stepItem.heading}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-sm select-none"
                  loading="lazy"
                />
              </div>

              {/* Step Heading */}
              <h3 className="text-xl sm:text-[22px] md:text-2xl font-bold text-white tracking-[-0.015em] leading-[1.25] mb-3 group-hover:text-white transition-colors">
                {stepItem.heading}
              </h3>

              {/* Step Description */}
              <p className="text-[14px] sm:text-[15px] md:text-base text-white/70 font-light leading-relaxed mb-6 flex-1">
                {stepItem.description}
              </p>

              {/* Text Link Call to Action */}
              <button
                type="button"
                onClick={() => handleStepAction(stepItem.action)}
                className="inline-flex items-center gap-1.5 text-[15px] sm:text-base font-medium text-white/90 hover:text-[#FFAA00] transition-colors cursor-pointer group/link pt-1"
              >
                <span>{stepItem.ctaText}</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
