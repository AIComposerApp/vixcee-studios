import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface WordLensRevealProps {
  text?: string;
  words?: (string | React.ReactNode)[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const WordLensReveal: React.FC<WordLensRevealProps> = ({
  text,
  words: customWords,
  as: Component = 'h2',
  className = '',
  wordClassName = 'inline-block mr-[0.24em] last:mr-0',
  delay = 0,
  stagger = 75,
  immediate = false,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
}) => {
  const [isVisible, setIsVisible] = useState(immediate);
  const containerRef = useRef<HTMLElement | null>(null);

  // Normalize words list
  const wordList = useMemo(() => {
    if (customWords && customWords.length > 0) {
      return customWords;
    }
    if (text) {
      return text.trim().split(/\s+/);
    }
    return [];
  }, [text, customWords]);

  useEffect(() => {
    if (immediate) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    // Honor prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Immediate check if element is already within viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => setIsVisible(true));
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
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, threshold, rootMargin]);

  return (
    <Component ref={containerRef as any} className={className}>
      {wordList.map((item, idx) => (
        <span
          key={idx}
          className={`${wordClassName} ${isVisible ? 'animate-word-lens' : 'opacity-0'}`}
          style={{
            animationDelay: `${delay + idx * stagger}ms`,
          }}
        >
          {item}
        </span>
      ))}
    </Component>
  );
};

export default WordLensReveal;
