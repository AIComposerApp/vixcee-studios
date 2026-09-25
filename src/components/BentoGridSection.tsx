import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BentoGridSectionProps {
  onOpenPrompts: (promptId?: string) => void;
  onOpenBookCall: () => void;
}

interface FeatureItem {
  id: string;
  tag?: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  promptId: string;
  textPosition: 'left' | 'right';
  directionSign: number;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'bento-frontend',
    heading: 'Clean code from the first shot',
    description: 'Prompts that give your AI coding agent clear direction. Less debugging and fewer wasted generations.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/v1790340435/better_prompt_bg_pdcipq.jpg',
    imageAlt: 'Clean code frontend website architecture interface preview',
    promptId: 'clean-code-first-shot',
    textPosition: 'left',
    directionSign: -1,
  },
  {
    id: 'bento-animations',
    tag: 'Animations',
    heading: 'High-end motion on the first try',
    description: 'Prompts that give your AI coding agent exact parameters for easing and timing. Smoother transitions and less endless tweaking.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/v1790340412/better_animation_jrrzcy.jpg',
    imageAlt: 'High-end motion easing curves and smooth transitions preview',
    promptId: 'high-end-motion',
    textPosition: 'right',
    directionSign: 1,
  },
  {
    id: 'bento-backend',
    tag: 'Backend',
    heading: 'Production-ready server logic immediately',
    description: 'Prompts that give your AI coding agent precise architecture guidelines. Secure API endpoints and less endless debugging.',
    image: 'https://res.cloudinary.com/divndlntm/image/upload/v1790340405/backend_bg_lzgixv.jpg',
    imageAlt: 'Production-ready backend API and database architecture preview',
    promptId: 'production-server-logic',
    textPosition: 'left',
    directionSign: -1,
  },
];

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({
  onOpenPrompts,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Direct DOM refs to avoid 60/120fps React re-renders
  const rowsMeta = useRef<{
    id: string;
    directionSign: number;
    rowEl: HTMLDivElement | null;
    mImgEl: HTMLDivElement | null;
    dImgEl: HTMLDivElement | null;
    rowCenterY: number;
  }[]>([
    { id: 'bento-frontend', directionSign: -1, rowEl: null, mImgEl: null, dImgEl: null, rowCenterY: 0 },
    { id: 'bento-animations', directionSign: 1, rowEl: null, mImgEl: null, dImgEl: null, rowCenterY: 0 },
    { id: 'bento-backend', directionSign: -1, rowEl: null, mImgEl: null, dImgEl: null, rowCenterY: 0 },
  ]);

  const updateTransforms = useCallback((scrollY: number) => {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight || 800 : 800;
    const currentViewportCenter = scrollY + windowHeight / 2;

    rowsMeta.current.forEach((row) => {
      const centerY = row.rowCenterY || (scrollY + windowHeight / 2);
      const verticalDiff = currentViewportCenter - centerY;
      const normalizedProgress = verticalDiff / (windowHeight * 1.05);

      const desktopTravel = 135;
      const mobileTabletTravel = 80;

      const currentDesktopX = row.directionSign * normalizedProgress * desktopTravel;
      const currentMobileTabletX = row.directionSign * normalizedProgress * mobileTabletTravel;

      if (row.dImgEl) {
        row.dImgEl.style.transform = `translate3d(${currentDesktopX.toFixed(2)}px, 0, 0)`;
      }
      if (row.mImgEl) {
        row.mImgEl.style.transform = `translate3d(${currentMobileTabletX.toFixed(2)}px, 0, 0)`;
      }
    });
  }, []);

  const measureRowCenters = useCallback(() => {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    rowsMeta.current.forEach((row) => {
      if (row.rowEl) {
        const rect = row.rowEl.getBoundingClientRect();
        row.rowCenterY = rect.top + currentScroll + rect.height / 2;
      }
    });
  }, []);

  // Butter-smooth RAF loop with zero React re-renders and auto-sleep when idle or offscreen
  useEffect(() => {
    let animId: number | null = null;
    let isVisible = false;
    let currentY = window.scrollY || document.documentElement.scrollTop;
    let targetY = currentY;

    measureRowCenters();
    updateTransforms(currentY);

    const onScroll = () => {
      targetY = window.scrollY || document.documentElement.scrollTop;
      if (!animId && isVisible) {
        animId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.05) {
        currentY += diff * 0.12;
        updateTransforms(currentY);
        animId = requestAnimationFrame(tick);
      } else {
        currentY = targetY;
        updateTransforms(currentY);
        animId = null; // Sleep when settled
      }
    };

    const onResize = () => {
      measureRowCenters();
      targetY = window.scrollY || document.documentElement.scrollTop;
      currentY = targetY;
      updateTransforms(currentY);
    };

    // IntersectionObserver to completely halt work when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measureRowCenters();
          targetY = window.scrollY || document.documentElement.scrollTop;
          currentY = targetY;
          updateTransforms(currentY);
        } else if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { rootMargin: '150px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [measureRowCenters, updateTransforms]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      ref={sectionRef}
      id="stop-burning-tokens"
      className="relative w-full bg-[#0c0c0e] py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-10 xl:px-12 select-none overflow-hidden"
      aria-label="Stop burning tokens - One-shot prompts for high-end animations and functionality"
    >
      <div className="w-full max-w-[1520px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-18 md:mb-24 lg:mb-28 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
            Stop burning tokens
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-[19px] text-white/70 font-light leading-relaxed max-w-2xl text-balance">
            One-shot prompts for high-end animations and functionality.
          </p>
        </div>

        {/* Alternating Full-Width Showcase Rows */}
        <div className="flex flex-col space-y-16 sm:space-y-20 md:space-y-28 lg:space-y-36 overflow-visible">
          {FEATURE_ITEMS.map((item, index) => {
            const isTextLeft = item.textPosition === 'left';
            const imgError = Boolean(imgErrors[item.id]);

            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (rowsMeta.current[index]) rowsMeta.current[index].rowEl = el;
                }}
                className="relative w-full flex flex-col justify-center overflow-visible"
              >
                {/* Mobile & Tablet Layout */}
                <div className="lg:hidden flex flex-col w-full space-y-6 sm:space-y-7 overflow-visible">
                  <div className="w-full overflow-visible flex items-center justify-center">
                    <div
                      ref={(el) => {
                        if (rowsMeta.current[index]) rowsMeta.current[index].mImgEl = el;
                      }}
                      className="w-full max-w-[560px] h-[250px] sm:h-[340px] md:h-[390px] rounded-[16px] sm:rounded-[22px] overflow-hidden will-change-transform shadow-2xl bg-[#111215]"
                    >
                      {!imgError ? (
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(item.id)}
                          className="w-full h-full object-cover object-center pointer-events-none select-none"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#111215]" />
                      )}
                    </div>
                  </div>

                  <div className="w-full max-w-[560px] mx-auto flex flex-col justify-start px-2 sm:px-3 pt-1 pb-4">
                    {item.tag && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded-[3px] border border-[#F04E23]/40 bg-[#F04E23]/10 text-[#F04E23] text-[9.5px] font-semibold uppercase tracking-[0.08em] mb-2.5 self-start">
                        <span>{item.tag}</span>
                      </div>
                    )}

                    <h3 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-white tracking-[-0.02em] leading-[1.14]">
                      {item.heading}
                    </h3>
                    <p className="mt-2.5 text-[14px] sm:text-[15px] text-white/75 font-light leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-5 sm:mt-6 flex items-center gap-4">
                      <button
                        onClick={() => onOpenPrompts(item.promptId)}
                        className="h-[40px] sm:h-[42px] px-6 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[11px] uppercase tracking-[0.08em] rounded-[4px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-[#F04E23]/25"
                      >
                        <span>Get</span>
                      </button>

                      <button
                        onClick={() => onOpenPrompts()}
                        className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer group/browse tracking-wide py-2"
                      >
                        <span>Browse</span>
                        <span className="text-[#FF661F] group-hover/browse:translate-x-0.5 transition-transform duration-200 font-mono text-[11px]">
                          &gt;
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div
                  className={`hidden lg:flex relative w-full items-center justify-between gap-10 xl:gap-16 overflow-visible ${
                    isTextLeft ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="w-[32%] xl:w-[30%] shrink-0 flex flex-col justify-center z-20">
                    {item.tag && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded-[3px] border border-[#F04E23]/40 bg-[#F04E23]/10 text-[#F04E23] text-[9.5px] font-semibold uppercase tracking-[0.08em] mb-3 self-start">
                        <span>{item.tag}</span>
                      </div>
                    )}

                    <h3 className="text-3xl lg:text-[34px] xl:text-[36px] font-semibold text-white tracking-[-0.02em] leading-[1.14] text-balance">
                      {item.heading}
                    </h3>
                    <p className="mt-3.5 text-[14px] lg:text-[15px] text-white/70 font-light leading-relaxed text-balance">
                      {item.description}
                    </p>

                    <div className="mt-7 flex items-center gap-4">
                      <button
                        onClick={() => onOpenPrompts(item.promptId)}
                        className="h-[42px] px-6 lg:px-7 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[11px] lg:text-[12px] uppercase tracking-[0.08em] rounded-[4px] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-[#F04E23]/25"
                      >
                        <span>Get</span>
                      </button>

                      <button
                        onClick={() => onOpenPrompts()}
                        className="inline-flex items-center gap-1.5 text-[12px] lg:text-[13px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer group/browse tracking-wide py-2"
                      >
                        <span>Browse</span>
                        <span className="text-[#FF661F] group-hover/browse:translate-x-0.5 transition-transform duration-200 font-mono text-[11px]">
                          &gt;
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-visible flex items-center justify-center">
                    <div
                      ref={(el) => {
                        if (rowsMeta.current[index]) rowsMeta.current[index].dImgEl = el;
                      }}
                      className="w-full max-w-[760px] h-[400px] lg:h-[440px] xl:h-[470px] rounded-[18px] lg:rounded-[22px] overflow-hidden will-change-transform shadow-2xl bg-[#111215]"
                    >
                      {!imgError ? (
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(item.id)}
                          className="w-full h-full object-cover object-center pointer-events-none select-none"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#111215]" />
                      )}
                    </div>
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
