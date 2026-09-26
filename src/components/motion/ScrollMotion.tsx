import React, { useEffect, useRef, useState, useMemo } from 'react';

// ============================================================================
// 1. SCROLL REVEAL (Scroll-Triggered Viewport Entry)
// ============================================================================
interface ScrollRevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number; // Delay in milliseconds (e.g. 0, 80, 160)
  duration?: number; // Duration in milliseconds (default: 850)
  threshold?: number; // Viewport intersection threshold (default: 0.15)
  yOffset?: number; // Initial translateY distance in px (default: 26)
  clipMask?: boolean; // Wraps inside overflow-hidden for masked emergence
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  duration = 850,
  threshold = 0.15,
  yOffset = 26,
  clipMask = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Honor prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Fire once and stay revealed
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const motionStyle: React.CSSProperties = {
    transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${yOffset}px, 0)`,
    opacity: isVisible ? 1 : 0,
    transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'transform, opacity',
  };

  if (clipMask) {
    return (
      <div className="overflow-hidden">
        <Component
          ref={elementRef}
          className={className}
          style={motionStyle}
        >
          {children}
        </Component>
      </div>
    );
  }

  return (
    <Component
      ref={elementRef}
      className={className}
      style={motionStyle}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// 2. TEXT LUMINOSITY FILL (Scroll-Driven Reading Illumination)
// ============================================================================
interface TextLuminosityFillProps {
  text: string;
  className?: string;
  containerClassName?: string;
  as?: 'p' | 'h2' | 'h3' | 'span' | 'blockquote';
}

export const TextLuminosityFill: React.FC<TextLuminosityFillProps> = ({
  text,
  className = '',
  containerClassName = '',
  as: Component = 'p',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start lighting up when top of element enters lower 75% of viewport
      // Reach 100% illumination when top enters upper 28% of viewport
      const start = windowHeight * 0.75;
      const end = windowHeight * 0.28;

      if (rect.top > start) {
        setScrollProgress(0);
      } else if (rect.top < end) {
        setScrollProgress(1);
      } else {
        const progress = (start - rect.top) / (start - end);
        setScrollProgress(Math.min(1, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`relative select-none ${containerClassName}`}>
      <Component className={className}>
        {words.map((word, index) => {
          // Calculate individual word threshold
          const wordThreshold = index / words.length;
          const wordProgress = Math.min(
            1,
            Math.max(0, (scrollProgress - wordThreshold) * words.length * 1.5)
          );

          // Interpolate opacity between 0.24 (muted) and 1.0 (illuminated white)
          const opacity = 0.24 + wordProgress * 0.76;

          return (
            <span
              key={index}
              style={{
                opacity,
                transition: 'opacity 180ms ease-out',
                willChange: 'opacity',
              }}
              className="inline-block mr-[0.28em] transition-opacity duration-150"
            >
              {word}
            </span>
          );
        })}
      </Component>
    </div>
  );
};
