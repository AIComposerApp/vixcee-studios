import React, { useRef, useEffect } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { PromptIcon } from './PromptIcon.tsx';
import { ScrollReveal } from './motion/ScrollMotion.tsx';
import { WordLensReveal } from './motion/WordLensReveal.tsx';
import {
  COLUMN_1_IMAGES,
  COLUMN_2_IMAGES,
  COLUMN_3_IMAGES,
  getWorkPageId,
} from './showcase/showcaseData.ts';
import { ShowcasePhoneCard } from './showcase/ShowcasePhoneCard.tsx';

interface WorkShowcaseSectionProps {
  onOpenPrompts?: (promptId?: string) => void;
  onOpenBookCall?: () => void;
  onNavigateWork?: (workId?: string) => void;
}

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({
  onOpenPrompts,
  onOpenBookCall,
  onNavigateWork,
}) => {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const mCol1Ref = useRef<HTMLDivElement>(null);
  const mCol2Ref = useRef<HTMLDivElement>(null);
  const mCol3Ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const h1DeskRef = useRef(0);
  const h2DeskRef = useRef(0);
  const h3DeskRef = useRef(0);
  const h1MobRef = useRef(0);
  const h2MobRef = useRef(0);
  const h3MobRef = useRef(0);

  const currentSpeedRef = useRef(0.72);
  const targetSpeedRef = useRef(0.72);
  const lastDirectionRef = useRef(1);
  const isHoveredRef = useRef(false);

  const progress1Ref = useRef(0);
  const progress2Ref = useRef(0);
  const progress3Ref = useRef(0);

  useEffect(() => {
    [...COLUMN_1_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_3_IMAGES].forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  const measureHeights = () => {
    if (col1Ref.current && col1Ref.current.children.length >= COLUMN_1_IMAGES.length * 2) {
      const first = col1Ref.current.children[0] as HTMLElement;
      const next = col1Ref.current.children[COLUMN_1_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h1DeskRef.current) > 2) {
          if (h1DeskRef.current > 0) {
            const phase = ((progress1Ref.current % h1DeskRef.current) + h1DeskRef.current) % h1DeskRef.current;
            progress1Ref.current = (phase / h1DeskRef.current) * diff;
          }
          h1DeskRef.current = diff;
        }
      }
    }
    if (col2Ref.current && col2Ref.current.children.length >= COLUMN_2_IMAGES.length * 2) {
      const first = col2Ref.current.children[0] as HTMLElement;
      const next = col2Ref.current.children[COLUMN_2_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h2DeskRef.current) > 2) {
          if (h2DeskRef.current > 0) {
            const phase = ((progress2Ref.current % h2DeskRef.current) + h2DeskRef.current) % h2DeskRef.current;
            progress2Ref.current = (phase / h2DeskRef.current) * diff;
          }
          h2DeskRef.current = diff;
        }
      }
    }
    if (col3Ref.current && col3Ref.current.children.length >= COLUMN_3_IMAGES.length * 2) {
      const first = col3Ref.current.children[0] as HTMLElement;
      const next = col3Ref.current.children[COLUMN_3_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h3DeskRef.current) > 2) {
          if (h3DeskRef.current > 0) {
            const phase = ((progress3Ref.current % h3DeskRef.current) + h3DeskRef.current) % h3DeskRef.current;
            progress3Ref.current = (phase / h3DeskRef.current) * diff;
          }
          h3DeskRef.current = diff;
        }
      }
    }

    if (mCol1Ref.current && mCol1Ref.current.children.length >= COLUMN_1_IMAGES.length * 2) {
      const first = mCol1Ref.current.children[0] as HTMLElement;
      const next = mCol1Ref.current.children[COLUMN_1_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h1MobRef.current) > 2) {
          if (h1MobRef.current > 0) {
            const phase = ((progress1Ref.current % h1MobRef.current) + h1MobRef.current) % h1MobRef.current;
            progress1Ref.current = (phase / h1MobRef.current) * diff;
          }
          h1MobRef.current = diff;
        }
      }
    }
    if (mCol2Ref.current && mCol2Ref.current.children.length >= COLUMN_2_IMAGES.length * 2) {
      const first = mCol2Ref.current.children[0] as HTMLElement;
      const next = mCol2Ref.current.children[COLUMN_2_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h2MobRef.current) > 2) {
          if (h2MobRef.current > 0) {
            const phase = ((progress2Ref.current % h2MobRef.current) + h2MobRef.current) % h2MobRef.current;
            progress2Ref.current = (phase / h2MobRef.current) * diff;
          }
          h2MobRef.current = diff;
        }
      }
    }
    if (mCol3Ref.current && mCol3Ref.current.children.length >= COLUMN_3_IMAGES.length * 2) {
      const first = mCol3Ref.current.children[0] as HTMLElement;
      const next = mCol3Ref.current.children[COLUMN_3_IMAGES.length] as HTMLElement;
      if (first && next) {
        const diff = next.offsetTop - first.offsetTop;
        if (diff > 50 && Math.abs(diff - h3MobRef.current) > 2) {
          if (h3MobRef.current > 0) {
            const phase = ((progress3Ref.current % h3MobRef.current) + h3MobRef.current) % h3MobRef.current;
            progress3Ref.current = (phase / h3MobRef.current) * diff;
          }
          h3MobRef.current = diff;
        }
      }
    }
  };

  useEffect(() => {
    measureHeights();

    let lastW = typeof window !== 'undefined' ? window.innerWidth : 0;
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (Math.abs(window.innerWidth - lastW) < 5) return;
        lastW = window.innerWidth;
      }
      measureHeights();
    };

    window.addEventListener('resize', handleResize);

    let roTimer: number | null = null;
    const observer = new ResizeObserver(() => {
      if (roTimer === null) {
        roTimer = requestAnimationFrame(() => {
          measureHeights();
          roTimer = null;
        });
      }
    });

    if (stageRef.current) observer.observe(stageRef.current);
    if (col1Ref.current) observer.observe(col1Ref.current);
    if (col2Ref.current) observer.observe(col2Ref.current);
    if (col3Ref.current) observer.observe(col3Ref.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (roTimer !== null) cancelAnimationFrame(roTimer);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let isTicking = false;

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;

          if (Math.abs(delta) > 0.5) {
            lastDirectionRef.current = delta > 0 ? 1 : -1;
            const boost = Math.min(Math.abs(delta) * 0.18, 5.0);
            targetSpeedRef.current = lastDirectionRef.current * (0.72 + boost);
          }

          lastScrollY = currentScrollY;
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 16.667, 2.0);
      lastTime = currentTime;

      const baseTarget = isHoveredRef.current
        ? 0
        : lastDirectionRef.current * 0.72;

      targetSpeedRef.current += (baseTarget - targetSpeedRef.current) * 0.045 * dt;
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.08 * dt;

      const step = currentSpeedRef.current * dt;

      if (h1DeskRef.current > 0) {
        progress1Ref.current = ((progress1Ref.current + step) % h1DeskRef.current + h1DeskRef.current) % h1DeskRef.current;
        if (col1Ref.current) {
          col1Ref.current.style.transform = `translate3d(0, ${-progress1Ref.current}px, 0)`;
        }
      }
      if (h2DeskRef.current > 0) {
        progress2Ref.current = ((progress2Ref.current - step) % h2DeskRef.current + h2DeskRef.current) % h2DeskRef.current;
        if (col2Ref.current) {
          col2Ref.current.style.transform = `translate3d(0, ${-progress2Ref.current}px, 0)`;
        }
      }
      if (h3DeskRef.current > 0) {
        progress3Ref.current = ((progress3Ref.current + step * 1.08) % h3DeskRef.current + h3DeskRef.current) % h3DeskRef.current;
        if (col3Ref.current) {
          col3Ref.current.style.transform = `translate3d(0, ${-progress3Ref.current}px, 0)`;
        }
      }

      if (h1MobRef.current > 0) {
        if (mCol1Ref.current) {
          const mobProg1 = ((progress1Ref.current) % h1MobRef.current + h1MobRef.current) % h1MobRef.current;
          mCol1Ref.current.style.transform = `translate3d(0, ${-mobProg1}px, 0)`;
        }
      }
      if (h2MobRef.current > 0) {
        if (mCol2Ref.current) {
          const mobProg2 = ((progress2Ref.current) % h2MobRef.current + h2MobRef.current) % h2MobRef.current;
          mCol2Ref.current.style.transform = `translate3d(0, ${-mobProg2}px, 0)`;
        }
      }
      if (h3MobRef.current > 0) {
        if (mCol3Ref.current) {
          const mobProg3 = ((progress3Ref.current) % h3MobRef.current + h3MobRef.current) % h3MobRef.current;
          mCol3Ref.current.style.transform = `translate3d(0, ${-mobProg3}px, 0)`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const tripleCol1 = [...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES];
  const tripleCol2 = [...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES];
  const tripleCol3 = [...COLUMN_3_IMAGES, ...COLUMN_3_IMAGES, ...COLUMN_3_IMAGES];

  return (
    <section className="relative w-full bg-[#0c0c0e] text-white overflow-hidden py-16 sm:py-24 border-t border-white/[0.04]">
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center text-left z-10 lg:pr-6">
            <ScrollReveal yOffset={20} duration={800}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-6 backdrop-blur-sm self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE5E50] animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider text-white/70 uppercase">
                  Mobile-First Engineering
                </span>
              </div>
            </ScrollReveal>

            <WordLensReveal
              text="Work that performs on every device."
              as="h2"
              className="text-4xl sm:text-5xl lg:text-[54px] font-light tracking-[-0.03em] leading-[1.08] text-white mb-6"
              delay={150}
            />

            <ScrollReveal yOffset={24} duration={800} delay={250}>
              <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-lg mb-8">
                Over 70% of modern web traffic originates from mobile devices. We architect every viewport with high-velocity interaction dynamics, hardware-accelerated transforms, and sub-second loading states.
              </p>
            </ScrollReveal>

            <ScrollReveal yOffset={28} duration={800} delay={350}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onOpenBookCall && onOpenBookCall()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[13px] uppercase tracking-[0.1em] rounded-lg text-center active:scale-[0.98] transition-all hover:brightness-110 shadow-lg shadow-[#F04E23]/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Strategy Call</span>
                </button>

                <button
                  onClick={() => onOpenPrompts && onOpenPrompts()}
                  className="px-6 py-3.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium text-[13px] tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <PromptIcon variant="white" className="w-4 h-4 text-white/80 group-hover:text-white" />
                  <span>AI Prompt Kits</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          <div
            ref={stageRef}
            onMouseEnter={() => (isHoveredRef.current = true)}
            onMouseLeave={() => (isHoveredRef.current = false)}
            className="lg:col-span-7 relative h-[620px] sm:h-[720px] lg:h-[760px] w-full overflow-hidden select-none"
          >
            <div
              className="lg:hidden pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-20 select-none"
              style={{
                background:
                  'linear-gradient(to right, #0c0c0e 0%, rgba(12, 12, 14, 0.95) 20%, rgba(12, 12, 14, 0.4) 65%, transparent 100%)',
              }}
            />
            <div
              className="lg:hidden pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-20 select-none"
              style={{
                background:
                  'linear-gradient(to left, #0c0c0e 0%, rgba(12, 12, 14, 0.95) 20%, rgba(12, 12, 14, 0.4) 65%, transparent 100%)',
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 z-20 select-none"
              style={{
                background:
                  'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 45%, rgba(12, 12, 14, 0.55) 72%, #0c0c0e 100%)',
              }}
            />

            {/* Desktop Stage */}
            <div
              className="hidden lg:flex w-full h-full justify-center gap-4 xl:gap-5 overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
              }}
            >
              <div ref={col1Ref} className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform">
                {tripleCol1.map((item, idx) => (
                  <ShowcasePhoneCard
                    key={`d-col1-${item.id}-${idx}`}
                    item={item}
                    idx={idx}
                    onNavigateWork={onNavigateWork}
                    workId={getWorkPageId(item.id)}
                    onLoad={measureHeights}
                    isDesktop={true}
                  />
                ))}
              </div>

              <div ref={col2Ref} className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform">
                {tripleCol2.map((item, idx) => (
                  <ShowcasePhoneCard
                    key={`d-col2-${item.id}-${idx}`}
                    item={item}
                    idx={idx}
                    onNavigateWork={onNavigateWork}
                    workId={getWorkPageId(item.id)}
                    onLoad={measureHeights}
                    isDesktop={true}
                  />
                ))}
              </div>

              <div ref={col3Ref} className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform">
                {tripleCol3.map((item, idx) => (
                  <ShowcasePhoneCard
                    key={`d-col3-${item.id}-${idx}`}
                    item={item}
                    idx={idx}
                    onNavigateWork={onNavigateWork}
                    workId={getWorkPageId(item.id)}
                    onLoad={measureHeights}
                    isDesktop={true}
                  />
                ))}
              </div>
            </div>

            {/* Mobile / Tablet Stage (< lg) */}
            <div className="flex lg:hidden relative w-full h-full items-center justify-center overflow-hidden isolate">
              <div
                className="relative w-[140%] sm:w-[130%] md:w-[120%] h-[145%] flex justify-center gap-3 sm:gap-4 md:gap-5"
                style={{
                  perspective: '1050px',
                  transform:
                    'rotateX(52deg) rotateY(-6deg) rotateZ(-22deg) translateY(-4%) scale(0.92)',
                  transformStyle: 'preserve-3d',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  ref={mCol1Ref}
                  className="w-1/3 flex flex-col gap-4 sm:gap-5 will-change-transform"
                  style={{
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  {tripleCol1.map((item, idx) => (
                    <ShowcasePhoneCard
                      key={`m-col1-${item.id}-${idx}`}
                      item={item}
                      idx={idx}
                      onNavigateWork={onNavigateWork}
                      workId={getWorkPageId(item.id)}
                      onLoad={measureHeights}
                    />
                  ))}
                </div>

                <div
                  ref={mCol2Ref}
                  className="w-1/3 flex flex-col gap-4 sm:gap-5 will-change-transform"
                  style={{
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  {tripleCol2.map((item, idx) => (
                    <ShowcasePhoneCard
                      key={`m-col2-${item.id}-${idx}`}
                      item={item}
                      idx={idx}
                      onNavigateWork={onNavigateWork}
                      workId={getWorkPageId(item.id)}
                      onLoad={measureHeights}
                    />
                  ))}
                </div>

                <div
                  ref={mCol3Ref}
                  className="w-1/3 flex flex-col gap-4 sm:gap-5 will-change-transform"
                  style={{
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  {tripleCol3.map((item, idx) => (
                    <ShowcasePhoneCard
                      key={`m-col3-${item.id}-${idx}`}
                      item={item}
                      idx={idx}
                      onNavigateWork={onNavigateWork}
                      workId={getWorkPageId(item.id)}
                      onLoad={measureHeights}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
