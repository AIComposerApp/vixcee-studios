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
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
  },
  {
    id: 'carizma-luxury',
    title: 'Carizma Luxury Hotels',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
  },
  {
    id: 'chesney-hotel',
    title: 'Chesney Hotel Boutique',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto/v1790358616/Chesney-Hotel-Boutique-bg-front_zde5g3.png',
  },
  {
    id: 'alege-official',
    title: 'Alege Official',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto/v1790358607/Alege-Official-bg-front_fgcdvr.png',
  },
  {
    id: 'alex-hydration',
    title: 'ALEX Form Follows Hydration',
    imgUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
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

  // Floating cursor follow states
  const [leftFollower, setLeftFollower] = useState({
    visible: false,
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
  });

  const [rightFollower, setRightFollower] = useState({
    visible: false,
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
  });

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

  // RAF loop for smooth velvet lerped cursor follow
  useEffect(() => {
    let animId: number;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const updateFollowers = () => {
      const { left, right } = mouseTargets.current;

      if (left.active) {
        left.currentX = lerp(left.currentX, left.targetX, 0.09);
        left.currentY = lerp(left.currentY, left.targetY, 0.09);
        left.currentTiltX = lerp(left.currentTiltX, left.targetTiltX, 0.08);
        left.currentTiltY = lerp(left.currentTiltY, left.targetTiltY, 0.08);

        setLeftFollower({
          visible: true,
          x: left.currentX,
          y: left.currentY,
          tiltX: left.currentTiltX,
          tiltY: left.currentTiltY,
        });
      }

      if (right.active) {
        right.currentX = lerp(right.currentX, right.targetX, 0.09);
        right.currentY = lerp(right.currentY, right.targetY, 0.09);
        right.currentTiltX = lerp(right.currentTiltX, right.targetTiltX, 0.08);
        right.currentTiltY = lerp(right.currentTiltY, right.targetTiltY, 0.08);

        setRightFollower({
          visible: true,
          x: right.currentX,
          y: right.currentY,
          tiltX: right.currentTiltX,
          tiltY: right.currentTiltY,
        });
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
    // Calculate current width of the center card: clamp(220px, 48vw, 680.8px) on desktop, clamp(180px, 58vw, 680px) on mobile
    const cardWidth = Math.min(rect.width * 0.52, 680.8);
    const halfWidth = cardWidth / 2;
    return clientX >= centerX - halfWidth && clientX <= centerX + halfWidth;
  };

  const hideAllFollowers = () => {
    mouseTargets.current.left.active = false;
    mouseTargets.current.right.active = false;
    setLeftFollower((prev) => ({ ...prev, visible: false }));
    setRightFollower((prev) => ({ ...prev, visible: false }));
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
    setRightFollower((prev) => ({ ...prev, visible: false }));

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
    setLeftFollower((prev) => ({ ...prev, visible: false }));
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
    setLeftFollower((prev) => ({ ...prev, visible: false }));

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
    setRightFollower((prev) => ({ ...prev, visible: false }));
    isHoveredRef.current = false;
    resetTimer();
  };

  // Touch handling
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    isHoveredRef.current = true;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
    touchStartX.current = null;
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
                }
                if (delta === 1) {
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
                !isActive ? 'cursor-pointer hover:brightness-110' : ''
              }`}
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
              <picture className="w-full h-full block">
                <source type="image/webp" srcSet={item.imgUrl} />
                <source type="image/png" srcSet={item.imgUrl} />
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  loading="eager"
                  fetchPriority={isActive ? 'high' : 'auto'}
                  className="w-full h-full object-contain pointer-events-none select-none block"
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* 2. Left Flank Hit Area (Only on the left side, hides on center) */}
      <div
        className="angled-carousel__controls angled-carousel__controls--left absolute left-0 top-0 bottom-0 w-[42%] z-20 flex items-center justify-start cursor-pointer"
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
      {leftFollower.visible && (
        <div
          className="cursor-follow__follower fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block"
          style={{
            left: `${leftFollower.x}px`,
            top: `${leftFollower.y}px`,
            opacity: leftFollower.visible ? 1 : 0,
            transform: `translate3d(-50%, -50%, 0) perspective(500px) rotateX(${leftFollower.tiltX}deg) rotateY(${leftFollower.tiltY}deg)`,
          }}
        >
          <div className="cursor-follow__pill flex items-center justify-center min-w-[92px] h-[45px] px-4 py-3 bg-white text-black rounded-full shadow-[0_18px_11px_rgba(0,0,0,0.12),0_8px_8px_rgba(0,0,0,0.14),0_2px_5px_rgba(0,0,0,0.15)] border border-black/10">
            <p className="text text--body text-[15px] font-medium tracking-tight text-black m-0 select-none">
              Previous
            </p>
          </div>
        </div>
      )}

      {/* 3. Right Flank Hit Area (Only on the right side, hides on center) */}
      <div
        className="angled-carousel__controls angled-carousel__controls--right absolute right-0 top-0 bottom-0 w-[42%] z-20 flex items-center justify-end cursor-pointer"
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
      {rightFollower.visible && (
        <div
          className="cursor-follow__follower fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block"
          style={{
            left: `${rightFollower.x}px`,
            top: `${rightFollower.y}px`,
            opacity: rightFollower.visible ? 1 : 0,
            transform: `translate3d(-50%, -50%, 0) perspective(500px) rotateX(${rightFollower.tiltX}deg) rotateY(${rightFollower.tiltY}deg)`,
          }}
        >
          <div className="cursor-follow__pill flex items-center justify-center min-w-[92px] h-[45px] px-4 py-3 bg-white text-black rounded-full shadow-[0_18px_11px_rgba(0,0,0,0.12),0_8px_8px_rgba(0,0,0,0.14),0_2px_5px_rgba(0,0,0,0.15)] border border-black/10">
            <p className="text text--body text-[15px] font-medium tracking-tight text-black m-0 select-none">
              Next
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
