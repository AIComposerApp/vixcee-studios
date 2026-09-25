import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CarouselItem {
  id: string;
  title: string;
  imgUrl: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 'prince-of-web3',
    title: 'Prince of Web3',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
  },
  {
    id: 'carizma-luxury',
    title: 'Carizma Luxury Hotels',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
  },
  {
    id: 'chesney-hotel',
    title: 'Chesney Hotel Boutique',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358616/Chesney-Hotel-Boutique-bg-front_zde5g3.png',
  },
  {
    id: 'alege-official',
    title: 'Alege Official',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358607/Alege-Official-bg-front_fgcdvr.png',
  },
  {
    id: 'alex-hydration',
    title: 'ALEX Form Follows Hydration',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
  },
];

export const AngledCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Initial center card
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Eager cache assets in background
  useEffect(() => {
    CAROUSEL_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.imgUrl;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : CAROUSEL_ITEMS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < CAROUSEL_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  // Stately 6.5-Second Autoplay delay with graceful pause on user interaction
  const resetTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    if (!isHoveredRef.current) {
      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 6500);
    }
  }, [handleNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [activeIndex, resetTimer]);

  // Direct DOM refs for cursor follower pills (zero React re-renders on mousemove)
  const leftFollowerRef = useRef<HTMLDivElement>(null);
  const rightFollowerRef = useRef<HTMLDivElement>(null);

  const mouseTargets = useRef({
    left: {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      currentTiltX: 0,
      currentTiltY: 0,
      active: false,
    },
    right: {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      currentTiltX: 0,
      currentTiltY: 0,
      active: false,
    },
  });

  // RAF loop for smooth velvet lerped cursor follow directly on DOM elements
  useEffect(() => {
    let animId: number;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const updateFollowers = () => {
      const { left, right } = mouseTargets.current;

      if (left.active && leftFollowerRef.current) {
        left.currentX = lerp(left.currentX, left.targetX, 0.12);
        left.currentY = lerp(left.currentY, left.targetY, 0.12);
        left.currentTiltX = lerp(left.currentTiltX, left.targetTiltX, 0.1);
        left.currentTiltY = lerp(left.currentTiltY, left.targetTiltY, 0.1);

        leftFollowerRef.current.style.opacity = '1';
        leftFollowerRef.current.style.transform = `translate3d(${left.currentX.toFixed(1)}px, ${left.currentY.toFixed(1)}px, 0) translate(-50%, -50%) perspective(500px) rotateX(${left.currentTiltX.toFixed(1)}deg) rotateY(${left.currentTiltY.toFixed(1)}deg)`;
      } else if (leftFollowerRef.current && leftFollowerRef.current.style.opacity !== '0') {
        leftFollowerRef.current.style.opacity = '0';
      }

      if (right.active && rightFollowerRef.current) {
        right.currentX = lerp(right.currentX, right.targetX, 0.12);
        right.currentY = lerp(right.currentY, right.targetY, 0.12);
        right.currentTiltX = lerp(right.currentTiltX, right.targetTiltX, 0.1);
        right.currentTiltY = lerp(right.currentTiltY, right.targetTiltY, 0.1);

        rightFollowerRef.current.style.opacity = '1';
        rightFollowerRef.current.style.transform = `translate3d(${right.currentX.toFixed(1)}px, ${right.currentY.toFixed(1)}px, 0) translate(-50%, -50%) perspective(500px) rotateX(${right.currentTiltX.toFixed(1)}deg) rotateY(${right.currentTiltY.toFixed(1)}deg)`;
      } else if (rightFollowerRef.current && rightFollowerRef.current.style.opacity !== '0') {
        rightFollowerRef.current.style.opacity = '0';
      }

      animId = requestAnimationFrame(updateFollowers);
    };

    animId = requestAnimationFrame(updateFollowers);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Helper to test if cursor is over the center card
  const isCursorOverCenter = (clientX: number) => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const cardWidth = Math.min(rect.width * 0.52, 680.8);
    const halfWidth = cardWidth / 2;
    return clientX >= centerX - halfWidth && clientX <= centerX + halfWidth;
  };

  const hideAllFollowers = () => {
    mouseTargets.current.left.active = false;
    mouseTargets.current.right.active = false;
    if (leftFollowerRef.current) leftFollowerRef.current.style.opacity = '0';
    if (rightFollowerRef.current) rightFollowerRef.current.style.opacity = '0';
  };

  // Left flank mouse move
  const handleLeftMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    if (isCursorOverCenter(e.clientX)) {
      hideAllFollowers();
      return;
    }

    isHoveredRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // Ensure right follower is off
    mouseTargets.current.right.active = false;
    if (rightFollowerRef.current) rightFollowerRef.current.style.opacity = '0';

    const m = mouseTargets.current.left;
    if (!m.active) {
      m.currentX = e.clientX;
      m.currentY = e.clientY;
      m.active = true;
    }
    m.targetX = e.clientX;
    m.targetY = e.clientY;
    m.targetTiltX = -relY * 14;
    m.targetTiltY = relX * 14;
  };

  const handleLeftMouseLeave = () => {
    mouseTargets.current.left.active = false;
    if (leftFollowerRef.current) leftFollowerRef.current.style.opacity = '0';
    isHoveredRef.current = false;
    resetTimer();
  };

  // Right flank mouse move
  const handleRightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    if (isCursorOverCenter(e.clientX)) {
      hideAllFollowers();
      return;
    }

    isHoveredRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // Ensure left follower is off
    mouseTargets.current.left.active = false;
    if (leftFollowerRef.current) leftFollowerRef.current.style.opacity = '0';

    const m = mouseTargets.current.right;
    if (!m.active) {
      m.currentX = e.clientX;
      m.currentY = e.clientY;
      m.active = true;
    }
    m.targetX = e.clientX;
    m.targetY = e.clientY;
    m.targetTiltX = -relY * 14;
    m.targetTiltY = relX * 14;
  };

  const handleRightMouseLeave = () => {
    mouseTargets.current.right.active = false;
    if (rightFollowerRef.current) rightFollowerRef.current.style.opacity = '0';
    isHoveredRef.current = false;
    resetTimer();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
        resetTimer();
      } else if (e.key === 'ArrowRight') {
        handleNext();
        resetTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, resetTimer]);

  // Card transform calculator
  const getCardTransform = (index: number) => {
    let delta = index - activeIndex;
    const count = CAROUSEL_ITEMS.length;

    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;

    return { delta };
  };

  return (
    <div
      ref={containerRef}
      className="angled-carousel relative w-full max-w-[1466px] h-[190px] sm:h-[270px] md:h-[410px] lg:h-[480px] mx-auto flex items-end justify-center overflow-visible z-20 select-none cursor-default"
      aria-label="Website Showcase Carousel"
    >
      {/* Seamless blend into solid black (#0c0c0e) starting from the vertical center line of the carousel */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none z-[1]"
        style={{
          top: '48%', // Starts right from the center line of the cards
          background: 'linear-gradient(to bottom, transparent 0%, rgba(12, 12, 14, 0.6) 28%, #0c0c0e 65%, #0c0c0e 100%)',
        }}
      />

      {/* 1. Carousel Cards Stack */}
      <div className="relative w-full h-full flex items-center justify-center z-[2]">
        {CAROUSEL_ITEMS.map((item, index) => {
          const { delta } = getCardTransform(index);
          const isActive = delta === 0;
          const isHidden = Math.abs(delta) > 1;

          // Responsive calculation
          const translateXPercent = delta * 100;
          const translateYPx = Math.abs(delta) * 21.265;
          const rotateDeg = delta * 2.0;
          const scale = 1 - Math.abs(delta) * 0.12;
          const opacity = isHidden ? 0 : 1;
          const zIndex = isActive ? 35 : 20 - Math.abs(delta) * 5;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (delta === -1) {
                  handlePrev();
                  resetTimer();
                } else {
                  handleNext();
                  resetTimer();
                }
              }}
              onMouseEnter={() => {
                if (isActive) {
                  hideAllFollowers();
                }
              }}
              onMouseMove={() => {
                if (isActive) {
                  hideAllFollowers();
                }
              }}
              className={`angled-carousel__card absolute flex justify-center items-center transition-all duration-[1350ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
                !isHidden ? 'cursor-pointer' : ''
              } ${!isActive ? 'hover:brightness-110' : ''}`}
              style={{
                width: 'clamp(240px, 52vw, 760px)',
                aspectRatio: '3220 / 2100',
                transform: `translateX(${translateXPercent}%) translateY(${translateYPx}px) rotate(${rotateDeg}deg) scale(${scale})`,
                opacity,
                filter: isActive ? 'none' : 'brightness(0.72) contrast(0.96)',
                zIndex,
                pointerEvents: isHidden ? 'none' : 'auto',
              }}
            >
              <div className="w-full h-full block">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  fetchPriority={isActive ? 'high' : Math.abs(delta) <= 1 ? 'auto' : 'low'}
                  className="w-full h-full object-contain pointer-events-none select-none block"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Left Flank Hit Area (Only on the left side, desktop only so mobile swipe is never blocked) */}
      <div
        className="angled-carousel__controls angled-carousel__controls--left absolute left-0 top-0 bottom-0 w-[42%] z-20 hidden md:flex items-center justify-start cursor-pointer"
        onMouseMove={handleLeftMouseMove}
        onMouseLeave={handleLeftMouseLeave}
        onClick={() => {
          handlePrev();
          resetTimer();
        }}
        aria-label="Previous slide area"
      >
        <div className="cursor-follow w-full h-full">
          <button
            className="cta cta--inline cursor-follow__area w-full h-full bg-transparent border-none outline-none cursor-pointer flex items-center"
            aria-label="Previous"
          >
            <div className="cursor-follow__content-sr-only sr-only">
              <p className="text text--body">Previous</p>
            </div>
          </button>
        </div>
      </div>

      {/* Floating pill for Left (Desktop only) */}
      <div
        ref={leftFollowerRef}
        className="cursor-follow__follower fixed top-0 left-0 pointer-events-none z-[1000] opacity-0 transition-opacity duration-200 hidden md:block will-change-transform"
        style={{
          transform: 'translate3d(-9999px, -9999px, 0)',
        }}
      >
        <div className="cursor-follow__pill flex items-center justify-center min-w-[92px] h-[45px] px-4 py-3 bg-white text-black rounded-full shadow-[0_18px_11px_rgba(0,0,0,0.12),0_8px_8px_rgba(0,0,0,0.14),0_2px_5px_rgba(0,0,0,0.15)] border border-black/10">
          <p className="text text--body text-[15px] font-medium tracking-tight text-black m-0 select-none">
            Previous
          </p>
        </div>
      </div>

      {/* 3. Right Flank Hit Area (Only on the right side, desktop only so mobile swipe is never blocked) */}
      <div
        className="angled-carousel__controls angled-carousel__controls--right absolute right-0 top-0 bottom-0 w-[42%] z-20 hidden md:flex items-center justify-end cursor-pointer"
        onMouseMove={handleRightMouseMove}
        onMouseLeave={handleRightMouseLeave}
        onClick={() => {
          handleNext();
          resetTimer();
        }}
        aria-label="Next slide area"
      >
        <div className="cursor-follow w-full h-full">
          <button
            className="cta cta--inline cursor-follow__area w-full h-full bg-transparent border-none outline-none cursor-pointer flex items-center"
            aria-label="Next"
          >
            <div className="cursor-follow__content-sr-only sr-only">
              <p className="text text--body">Next</p>
            </div>
          </button>
        </div>
      </div>

      {/* Floating pill for Right (Desktop only) */}
      <div
        ref={rightFollowerRef}
        className="cursor-follow__follower fixed top-0 left-0 pointer-events-none z-[1000] opacity-0 transition-opacity duration-200 hidden md:block will-change-transform"
        style={{
          transform: 'translate3d(-9999px, -9999px, 0)',
        }}
      >
        <div className="cursor-follow__pill flex items-center justify-center min-w-[92px] h-[45px] px-4 py-3 bg-white text-black rounded-full shadow-[0_18px_11px_rgba(0,0,0,0.12),0_8px_8px_rgba(0,0,0,0.14),0_2px_5px_rgba(0,0,0,0.15)] border border-black/10">
          <p className="text text--body text-[15px] font-medium tracking-tight text-black m-0 select-none">
            Next
          </p>
        </div>
      </div>
    </div>
  );
};
