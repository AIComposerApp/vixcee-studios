import React, { useEffect, useRef } from 'react';
import { ScrollReveal } from './motion/ScrollMotion.tsx';

interface BentoGridSectionProps {
  onOpenPrompts: (promptId?: string) => void;
  onOpenBookCall?: () => void;
}

interface FeatureRow {
  id: string;
  tag: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  promptId: string;
  inverted?: boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    id: 'bento-frontend',
    tag: 'FRONTEND',
    heading: 'Clean code from the first shot',
    description: 'Prompts that give your AI coding agent clear direction. Less debugging and fewer wasted generations.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1200/v1790340435/better_prompt_bg_pdcipq.jpg',
    imageAlt: 'Clean code frontend architecture prompt generator and interface nodes',
    promptId: 'clean-code-first-shot',
    inverted: false,
  },
  {
    id: 'bento-animations',
    tag: 'ANIMATIONS',
    heading: 'High-end motion on the first try',
    description: 'Prompts that give your AI coding agent exact parameters for easing and timing. Smoother transitions and less endless tweaking.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1200/v1790340412/better_animation_jrrzcy.jpg',
    imageAlt: 'Kinetic 3D translucent glass splitting cards motion preview',
    promptId: 'high-end-motion',
    inverted: true,
  },
  {
    id: 'bento-backend',
    tag: 'BACKEND',
    heading: 'Production-ready server logic immediately',
    description: 'Prompts that give your AI coding agent precise architecture guidelines. Secure API endpoints and less endless debugging.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1200/v1790340405/backend_bg_lzgixv.jpg',
    imageAlt: 'Production backend architecture with RabbitMQ, Resend, Paystack, and Firebase 3D tiles',
    promptId: 'production-server-logic',
    inverted: false,
  },
];

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({
  onOpenPrompts,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Direct DOM references for 60/120fps hardware-accelerated transform without React re-renders
  const cardRef0 = useRef<HTMLDivElement | null>(null);
  const cardRef1 = useRef<HTMLDivElement | null>(null);
  const cardRef2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Eagerly pre-warm Stop Burning Tokens images in browser cache
    FEATURE_ROWS.forEach((row) => {
      const img = new Image();
      img.src = row.image;
    });

    let animId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    let isRunning = true;

    const cardRefs = [cardRef0, cardRef1, cardRef2];

    const calculateTargetProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalTravel = windowHeight + rect.height;

      if (totalTravel <= 0) return;

      // Section-level progress driving all cards in simultaneous opposing flow
      const raw = (windowHeight - rect.top) / totalTravel;
      targetProgress = Math.max(0, Math.min(1, raw));
    };

    const renderLoop = () => {
      if (!isRunning) return;

      // Silky LERP (Linear Interpolation) for frictionless 60/120fps fluid tracking
      currentProgress += (targetProgress - currentProgress) * 0.12;

      const isDesktop = window.innerWidth >= 1024;
      // Calibrated travel distances:
      // Desktop: 180px entry, crossing through center to -85px
      // Mobile: 90px entry, crossing to -40px
      const startDistance = isDesktop ? 180 : 90;
      const pastDistance = isDesktop ? 85 : 40;

      // Continuous lateral travel across full progress
      const baseTravel = startDistance - (startDistance + pastDistance) * currentProgress;

      cardRefs.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;

        const isEven = FEATURE_ROWS[idx].inverted;
        // Row 1 & 3: glides right to left (starts positive, passes center, goes negative)
        // Row 2: glides left to right (starts negative, passes center, goes positive)
        // This causes Row 2 and Row 3 to dynamically cross paths (interception point)
        const offset = isEven ? -baseTravel : baseTravel;

        el.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      });

      animId = requestAnimationFrame(renderLoop);
    };

    const onScrollOrResize = () => {
      calculateTargetProgress();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    calculateTargetProgress();
    currentProgress = targetProgress;
    animId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stop-burning-tokens"
      className="relative w-full bg-[#0c0c0e] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-12 xl:px-16 select-none overflow-hidden"
      aria-label="Stop burning tokens - One-shot prompts for high-end animations and functionality"
    >
      <div className="relative z-10 w-full max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16 lg:mb-20 px-4">
          <ScrollReveal delay={0} clipMask={true}>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
              Stop burning tokens
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-[19px] text-white/70 font-light leading-relaxed max-w-2xl text-balance">
              One-shot prompts for high-end animations and functionality.
            </p>
          </ScrollReveal>
        </div>

        {/* Tighter Row Spacing: Allows consecutive cards to be visible simultaneously for the interception effect */}
        <div className="space-y-12 sm:space-y-14 lg:space-y-18">
          {FEATURE_ROWS.map((row, index) => {
            const isEven = !!row.inverted;
            const cardRef = index === 0 ? cardRef0 : index === 1 ? cardRef1 : cardRef2;

            return (
              <div
                key={row.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-18 items-center overflow-visible"
              >
                {/* Visual Image Card with Opposing Interception Parallax */}
                <div
                  className={`col-span-12 lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div
                    ref={cardRef}
                    className="w-full rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#111216] relative group hover:border-white/20 transition-colors duration-300"
                    style={{
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  >
                    <div className="w-full aspect-[16/10.5] relative overflow-hidden bg-[#0c0c0e]">
                      <img
                        src={row.image}
                        alt={row.imageAlt}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover object-center select-none group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Editorial Text & Actions Column */}
                <div
                  className={`col-span-12 lg:col-span-5 flex flex-col justify-center text-left ${
                    isEven ? 'lg:order-2 lg:pl-4 xl:pl-8' : 'lg:order-1 lg:pr-4 xl:pr-8'
                  }`}
                >
                  <ScrollReveal delay={0}>
                    {/* Badge */}
                    <div className="inline-block mb-3 sm:mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] border border-[#FF4A22]/40 bg-[#FF4A22]/10 text-[#FF5D38] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em]">
                        {row.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-[-0.025em] leading-[1.14] mb-4 text-balance">
                      {row.heading}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-[17px] text-white/65 font-light leading-relaxed mb-7 max-w-lg">
                      {row.description}
                    </p>

                    {/* Buttons: GET identical to Header Sign up button + Browse > */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <button
                        onClick={() => onOpenPrompts(row.promptId)}
                        className="px-5 sm:px-6 py-2 sm:py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] hover:brightness-110 text-white rounded-[4px] active:scale-[0.97] transition-all duration-200 shadow-md shadow-[#F04E23]/25 hover:shadow-lg hover:shadow-[#F04E23]/40 whitespace-nowrap cursor-pointer"
                      >
                        <span>GET</span>
                      </button>

                      <button
                        onClick={() => onOpenPrompts()}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer group/browse tracking-wide py-2"
                      >
                        <span>Browse</span>
                        <span className="text-[#FF661F] group-hover/browse:translate-x-0.5 transition-transform font-mono">
                          &gt;
                        </span>
                      </button>
                    </div>
                  </ScrollReveal>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default BentoGridSection;
