import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack.tsx';
import { ScrollReveal } from './motion/ScrollMotion.tsx';

interface BentoGridSectionProps {
  onOpenPrompts: (promptId?: string) => void;
  onOpenBookCall: () => void;
}

interface FeatureItem {
  id: string;
  index: string;
  tag?: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  promptId: string;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'bento-frontend',
    index: '01',
    tag: 'Frontend Architecture',
    heading: 'Clean code from the first shot',
    description: 'Prompts that give your AI coding agent clear direction. Less debugging and fewer wasted generations.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790340435/better_prompt_bg_pdcipq.jpg',
    imageAlt: 'Clean code frontend website architecture interface preview',
    promptId: 'clean-code-first-shot',
  },
  {
    id: 'bento-animations',
    index: '02',
    tag: 'Motion & Easing',
    heading: 'High-end motion on the first try',
    description: 'Prompts that give your AI coding agent exact parameters for easing and timing. Smoother transitions and less endless tweaking.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790340412/better_animation_jrrzcy.jpg',
    imageAlt: 'High-end motion easing curves and smooth transitions preview',
    promptId: 'high-end-motion',
  },
  {
    id: 'bento-backend',
    index: '03',
    tag: 'Backend Infrastructure',
    heading: 'Production-ready server logic immediately',
    description: 'Prompts that give your AI coding agent precise architecture guidelines. Secure API endpoints and less endless debugging.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790340405/backend_bg_lzgixv.jpg',
    imageAlt: 'Production-ready backend API and database architecture preview',
    promptId: 'production-server-logic',
  },
];

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({
  onOpenPrompts,
}) => {
  return (
    <section
      id="stop-burning-tokens"
      className="relative w-full bg-[#0c0c0e] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10 xl:px-12 select-none overflow-visible"
      aria-label="Stop burning tokens - One-shot prompts for high-end animations and functionality"
    >
      <div className="w-full max-w-[1360px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14 md:mb-18 px-4">
          <ScrollReveal delay={0} clipMask={true}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
              Stop burning tokens
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-[19px] text-white/70 font-light leading-relaxed max-w-2xl text-balance">
              One-shot prompts for high-end animations and functionality.
            </p>
          </ScrollReveal>
        </div>

        {/* React Bits <ScrollStack /> Component */}
        <ScrollStack
          useWindowScroll={true}
          itemDistance={70}
          itemScale={0.035}
          itemStackDistance={32}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.9}
          className="w-full"
        >
          {FEATURE_ITEMS.map((item) => (
            <ScrollStackItem
              key={item.id}
              itemClassName="bg-[#111216]/95 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Subtle ambient gradient highlight */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_right,rgba(255,102,31,0.12),transparent_70%)]"
                aria-hidden="true"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Text & Actions */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-white/40 tracking-wider">
                      {item.index} / 03
                    </span>
                    {item.tag && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] border border-white/15 bg-white/5 text-white/80 text-[10px] font-semibold uppercase tracking-[0.08em]">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-[-0.02em] leading-tight mb-3">
                    {item.heading}
                  </h3>

                  <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed mb-6 max-w-lg">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onOpenPrompts(item.promptId)}
                      className="h-10 sm:h-11 px-6 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-xs uppercase tracking-wider rounded-[4px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-md shadow-[#F04E23]/25"
                    >
                      <span>Get prompt</span>
                    </button>

                    <button
                      onClick={() => onOpenPrompts()}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer group/browse tracking-wide py-2"
                    >
                      <span>Browse all</span>
                      <span className="text-[#FF661F] group-hover/browse:translate-x-0.5 transition-transform font-mono">
                        &gt;
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Immersive Visual Preview */}
                <div className="lg:col-span-6 w-full flex items-center justify-center">
                  <div className="w-full h-[220px] sm:h-[300px] lg:h-[360px] rounded-[16px] sm:rounded-[20px] overflow-hidden border border-white/10 shadow-2xl bg-[#0c0c0e] relative group-hover:border-white/20 transition-colors">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center select-none"
                    />
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};
export default BentoGridSection;
