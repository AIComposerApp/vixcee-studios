import React, { useRef, useEffect } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { PromptIcon } from './PromptIcon.tsx';

interface WorkShowcaseSectionProps {
  onOpenPrompts?: (promptId?: string) => void;
  onOpenBookCall?: () => void;
}

interface ShowcaseImage {
  id: string;
  title: string;
  src: string;
}

// 13 High-Performance Optimized Mobile Portrait Screenshots across 3 balanced columns
const COLUMN_1_IMAGES: ShowcaseImage[] = [
  {
    id: 'allbirds',
    title: 'Allbirds Mens Dasher NZ',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/Allbirds-Mens-Dasher-NZ-09-25-2026_05_30_PM-portrait_zkp8ls.png',
  },
  {
    id: 'alex-hydrate',
    title: 'ALEX Hydrate',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/ALEX-hydrate-mobile-portrait_apcmge.png',
  },
  {
    id: 'balance-wellness',
    title: 'Balance Wellness',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/Balance-Wellness-mobile-portrait_vgprfk.png',
  },
  {
    id: 'ijaw-massage',
    title: 'IJAW Massage Plus',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355855/IJAWMASSAGEPLUS-_-Traditional-Healing-Modern-Comfort-09-25-2026_05_18_PM-portrait_orh8ey.png',
  },
  {
    id: 'aurelia-hotels',
    title: 'Aurelia Hotels',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355860/Aurelia-Hotels-mobile-portrait_yagbgb.png',
  },
];

const COLUMN_2_IMAGES: ShowcaseImage[] = [
  {
    id: 'chesney-hotel',
    title: 'Chesney Hotel',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355855/Chesney-Hotel-mobile-portrait_cjpsj2.png',
  },
  {
    id: 'prince-of-web3',
    title: 'Prince of Web3',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355856/Prince-of-Web3-mobile-portrait_mqpqeh.png',
  },
  {
    id: 'flowstate',
    title: 'FlowState Intelligent Plumbing',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355856/FlowState-Intelligent-Plumbing-09-25-2026_05_04_PM-portrait_vvlepq.png',
  },
  {
    id: 'scribe',
    title: 'Scribe Smarter Lessons',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355857/Scribe-_-Smarter-lessons-Built-with-Scribe--09-25-2026_05_23_PM-portrait_tixcfp.png',
  },
];

const COLUMN_3_IMAGES: ShowcaseImage[] = [
  {
    id: 'google-ai-studio',
    title: 'Google AI Studio App',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355857/My-Google-AI-Studio-App-09-25-2026_05_58_PM-portrait_d8ruby.png',
  },
  {
    id: 'sandra-osaigbovo',
    title: 'Sandra Osaigbovo',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Sandra-Osaigbovo_mobile-portrait_gy9r4g.png',
  },
  {
    id: 'shoe-finder',
    title: 'Shoe Finder',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Shoe-Finder-09-25-2026_05_31_PM-portrait_yajud6.png',
  },
  {
    id: 'carizma-luxury',
    title: 'Carizma Luxury Hotels',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Carizma-Luxury-Hotels-mobile-portrait_emb4pi.png',
  },
];

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({
  onOpenPrompts,
  onOpenBookCall,
}) => {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const mCol1Ref = useRef<HTMLDivElement>(null);
  const mCol2Ref = useRef<HTMLDivElement>(null);
  const mCol3Ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Independent measurement refs for desktop and mobile stages across 3 columns
  const h1DeskRef = useRef(0);
  const h2DeskRef = useRef(0);
  const h3DeskRef = useRef(0);
  const h1MobRef = useRef(0);
  const h2MobRef = useRef(0);
  const h3MobRef = useRef(0);

  // Physics state refs (no React re-renders for true 60/120fps hardware motion)
  const currentSpeedRef = useRef(0.72);
  const targetSpeedRef = useRef(0.72);
  const lastDirectionRef = useRef(1); // 1 = forward / scroll down, -1 = reverse / scroll up
  const isHoveredRef = useRef(false);

  // Cumulative offset trackers (strictly continuous, zero jumps on direction flip)
  const progress1Ref = useRef(0);
  const progress2Ref = useRef(0);
  const progress3Ref = useRef(0);

  // Eager browser preloading to guarantee zero image load wait
  useEffect(() => {
    [...COLUMN_1_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_3_IMAGES].forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Measure exact repeating period between duplicated sets via child offsetTop with phase preservation
  const measureHeights = () => {
    // Desktop measurement
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

    // Mobile measurement (independent due to 3D perspective scaling)
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
        // Prevent address bar collapse/expand from triggering re-measurements during mobile scroll
        if (Math.abs(window.innerWidth - lastW) < 5) return;
        lastW = window.innerWidth;
      }
      measureHeights();
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver watches for initial image layout shifts
    let roTimer: number | null = null;
    const observer = new ResizeObserver(() => {
      if (roTimer === null) {
        roTimer = requestAnimationFrame(() => {
          measureHeights();
          roTimer = null;
        });
      }
    });

    if (col1Ref.current) observer.observe(col1Ref.current);
    if (col2Ref.current) observer.observe(col2Ref.current);
    if (col3Ref.current) observer.observe(col3Ref.current);
    if (mCol1Ref.current) observer.observe(mCol1Ref.current);
    if (mCol2Ref.current) observer.observe(mCol2Ref.current);
    if (mCol3Ref.current) observer.observe(mCol3Ref.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (roTimer) cancelAnimationFrame(roTimer);
    };
  }, []);

  // Smooth scroll responsiveness with anti-jitter smoothing
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Filter out micro-jitter from trackpad bounce (only respond to intentional scrolls)
      if (Math.abs(delta) > 8) {
        const dir = delta > 0 ? 1 : -1;
        lastDirectionRef.current = dir;

        if (isHoveredRef.current) {
          // If hovered, responsive nudge while maintaining slow-motion pace
          targetSpeedRef.current = 0.28 * dir;
        } else {
          targetSpeedRef.current = 0.95 * dir;
        }

        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (isHoveredRef.current) {
            targetSpeedRef.current = 0.20 * lastDirectionRef.current;
          } else {
            targetSpeedRef.current = 0.72 * lastDirectionRef.current;
          }
        }, 140);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  // Continuous physics animation loop via requestAnimationFrame with continuous modulo, active only when visible
  useEffect(() => {
    let animId: number | null = null;
    let isVisible = false;

    const updatePhysics = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      // Lerp speed smoothly to prevent jarring speed snaps
      currentSpeedRef.current +=
        (targetSpeedRef.current - currentSpeedRef.current) * 0.05;

      const speed = currentSpeedRef.current;
      progress1Ref.current += speed;
      progress2Ref.current += speed;
      progress3Ref.current += speed;

      // Desktop transforms
      const h1D = h1DeskRef.current;
      const h2D = h2DeskRef.current;
      const h3D = h3DeskRef.current;
      if (col1Ref.current && h1D > 0) {
        const y1 = ((progress1Ref.current % h1D) + h1D) % h1D;
        col1Ref.current.style.transform = `translate3d(0, ${-y1.toFixed(1)}px, 0)`;
      }
      if (col2Ref.current && h2D > 0) {
        const y2 = ((progress2Ref.current % h2D) + h2D) % h2D;
        col2Ref.current.style.transform = `translate3d(0, ${(-h2D + y2).toFixed(1)}px, 0)`;
      }
      if (col3Ref.current && h3D > 0) {
        const y3 = (((progress3Ref.current + h3D * 0.45) % h3D) + h3D) % h3D;
        col3Ref.current.style.transform = `translate3d(0, ${-y3.toFixed(1)}px, 0)`;
      }

      // Mobile 3D transforms (independent dimensions)
      const h1M = h1MobRef.current;
      const h2M = h2MobRef.current;
      const h3M = h3MobRef.current;
      if (mCol1Ref.current && h1M > 0) {
        const y1 = ((progress1Ref.current % h1M) + h1M) % h1M;
        mCol1Ref.current.style.transform = `translate3d(0, ${-y1.toFixed(1)}px, 0)`;
      }
      if (mCol2Ref.current && h2M > 0) {
        const y2 = ((progress2Ref.current % h2M) + h2M) % h2M;
        mCol2Ref.current.style.transform = `translate3d(0, ${(-h2M + y2).toFixed(1)}px, 0)`;
      }
      if (mCol3Ref.current && h3M > 0) {
        const y3 = (((progress3Ref.current + h3M * 0.45) % h3M) + h3M) % h3M;
        mCol3Ref.current.style.transform = `translate3d(0, ${-y3.toFixed(1)}px, 0)`;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) {
            measureHeights();
            animId = requestAnimationFrame(updatePhysics);
          }
        } else if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Hover handlers for cushioned slow-motion crawl and resume
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    // Decelerate smoothly to a gentle 28% slow-motion crawl (no sudden halt)
    targetSpeedRef.current = 0.20 * (lastDirectionRef.current >= 0 ? 1 : -1);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Accelerate smoothly back to full cruise speed
    targetSpeedRef.current = 0.72 * (lastDirectionRef.current >= 0 ? 1 : -1);
  };

  // Triple datasets for infinite seamless wrapping
  const tripleCol1 = [...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES];
  const tripleCol2 = [...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES];
  const tripleCol3 = [...COLUMN_3_IMAGES, ...COLUMN_3_IMAGES, ...COLUMN_3_IMAGES];

  return (
    <section
      ref={sectionRef}
      id="work-showcase"
      className="relative w-full bg-[#0c0c0e] py-16 sm:py-24 md:py-28 lg:py-32 overflow-hidden select-none"
      aria-label="Work that performs - mobile showcase"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_560px] xl:grid-cols-[1fr_640px] 2xl:grid-cols-[1fr_720px] items-center gap-12 lg:gap-14 xl:gap-16">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Expanded Editorial Stack & CTAs                 */}
          {/* ============================================================ */}
          <div className="flex flex-col items-start text-left z-10 max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.025em] leading-[1.08] text-balance">
              Work that performs.
            </h2>
            
            <div className="mt-4 sm:mt-5 space-y-3 max-w-xl">
              <p className="text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed text-balance">
                A curated showcase of mobile-first digital experiences engineered for high conversion, fluid 120fps motion, and uncompromising brand identity.
              </p>
              <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
                From bespoke luxury stays and modern wellness brands to scalable SaaS platforms, every site is custom-crafted to turn everyday visitors into loyal clients.
              </p>
            </div>

            {/* Action Buttons Stack */}
            <div className="mt-7 sm:mt-9 flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenPrompts?.()}
                className="h-[46px] sm:h-[50px] px-5 sm:px-7 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[12px] sm:text-[13px] uppercase tracking-[0.08em] rounded-[4px] hover:brightness-110 hover:shadow-[0_8px_30px_rgba(240,78,35,0.45)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#F04E23]/30 cursor-pointer group"
              >
                <PromptIcon
                  variant="white"
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform shrink-0"
                />
                <span className="font-semibold tracking-wider text-white">Get prompts</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onOpenBookCall?.()}
                className="h-[46px] sm:h-[50px] px-4 sm:px-6 bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-white/40 text-white font-medium text-[12px] sm:text-[13px] uppercase tracking-[0.08em] rounded-[4px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer shadow-lg shadow-black/40"
              >
                <Calendar className="w-4 h-4 text-white/80" />
                <span>Book a call</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Physics-Driven 3-Column Marquee Stage          */}
          {/* ============================================================ */}
          <div
            ref={stageRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[520px] sm:h-[580px] lg:h-[650px] xl:h-[720px] flex items-center justify-center overflow-hidden cursor-default"
          >
            {/* Deep Atmospheric Vertical Gradient Edge Vignettes */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 z-20 select-none"
              style={{
                background:
                  'linear-gradient(to bottom, #0c0c0e 0%, rgba(12, 12, 14, 0.92) 35%, rgba(12, 12, 14, 0.4) 70%, transparent 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 z-20 select-none"
              style={{
                background:
                  'linear-gradient(to top, #0c0c0e 0%, rgba(12, 12, 14, 0.92) 35%, rgba(12, 12, 14, 0.4) 70%, transparent 100%)',
              }}
            />

            {/* Mobile / Tablet Left & Right Side Pure Gradient Edge Overlays (No blur distortion) */}
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

            {/* Perimeter Radial Dissolve Vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-20 select-none"
              style={{
                background:
                  'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 45%, rgba(12, 12, 14, 0.55) 72%, #0c0c0e 100%)',
              }}
            />

            {/* Desktop Stage (Upright with Deep Vanishing Gradient Fade Masks) */}
            <div
              className="hidden lg:flex w-full h-full justify-center gap-4 xl:gap-5 overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
              }}
            >
              {/* Column 1 (Glides UP - Raw Phones) */}
              <div
                ref={col1Ref}
                className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform"
              >
                {tripleCol1.map((item, idx) => (
                  <div
                    key={`d-col1-${item.id}-${idx}`}
                    className="w-full shrink-0 flex items-center justify-center aspect-[500/985]"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      onLoad={measureHeights}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={idx < 2 ? 'high' : 'low'}
                      className="w-full h-auto object-contain select-none pointer-events-none block"
                    />
                  </div>
                ))}
              </div>

              {/* Column 2 (Glides DOWN - Raw Phones) */}
              <div
                ref={col2Ref}
                className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform"
              >
                {tripleCol2.map((item, idx) => (
                  <div
                    key={`d-col2-${item.id}-${idx}`}
                    className="w-full shrink-0 flex items-center justify-center aspect-[500/985]"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      onLoad={measureHeights}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={idx < 2 ? 'high' : 'low'}
                      className="w-full h-auto object-contain select-none pointer-events-none block"
                    />
                  </div>
                ))}
              </div>

              {/* Column 3 (Glides UP - Staggered Offset) */}
              <div
                ref={col3Ref}
                className="w-1/3 flex flex-col gap-5 xl:gap-6 will-change-transform"
              >
                {tripleCol3.map((item, idx) => (
                  <div
                    key={`d-col3-${item.id}-${idx}`}
                    className="w-full shrink-0 flex items-center justify-center aspect-[500/985]"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      onLoad={measureHeights}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={idx < 2 ? 'high' : 'low'}
                      className="w-full h-auto object-contain select-none pointer-events-none block"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile / Tablet Stage (< lg): 3D Isometric Ascending Stage */}
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
                {/* Column 1 (Glides UP - Raw Phones) */}
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
                    <div
                      key={`m-col1-${item.id}-${idx}`}
                      className="w-full shrink-0 flex items-center justify-center aspect-[500/985] overflow-hidden"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        onLoad={measureHeights}
                        loading={idx < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={idx < 2 ? 'high' : 'low'}
                        className="w-full h-auto object-contain select-none pointer-events-none block"
                      />
                    </div>
                  ))}
                </div>

                {/* Column 2 (Glides DOWN - Raw Phones) */}
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
                    <div
                      key={`m-col2-${item.id}-${idx}`}
                      className="w-full shrink-0 flex items-center justify-center aspect-[500/985] overflow-hidden"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        onLoad={measureHeights}
                        loading={idx < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={idx < 2 ? 'high' : 'low'}
                        className="w-full h-auto object-contain select-none pointer-events-none block"
                      />
                    </div>
                  ))}
                </div>

                {/* Column 3 (Glides UP - Staggered Offset) */}
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
                    <div
                      key={`m-col3-${item.id}-${idx}`}
                      className="w-full shrink-0 flex items-center justify-center aspect-[500/985] overflow-hidden"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        onLoad={measureHeights}
                        loading={idx < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={idx < 2 ? 'high' : 'low'}
                        className="w-full h-auto object-contain select-none pointer-events-none block"
                      />
                    </div>
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
