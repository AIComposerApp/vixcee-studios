import React, { useState, useEffect, useRef } from 'react';

export interface VerticalTextRollerProps {
  words?: string[];
  pauseDuration?: number; // ms to pause on each word (default: 2000ms)
  slideDuration?: number; // ms for vertical slide transition (default: 500ms)
  className?: string;
}

/**
 * VerticalTextRoller
 * A responsive web component that continuously cycles words in an infinite loop
 * with an in-place vertical slide transition and single-line overflow clipping.
 *
 * Sequence: 'sites' -> 'tools' -> 'apps' -> 'sites' ...
 */
export const VerticalTextRoller: React.FC<VerticalTextRollerProps> = ({
  words = ['sites', 'tools', 'apps'],
  pauseDuration = 2000,
  slideDuration = 500,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Responsively measure width of each word across mobile, tablet, and desktop font sizes
  useEffect(() => {
    const updateWidths = () => {
      const measured = measureRefs.current.map((el) =>
        el ? Math.ceil(el.getBoundingClientRect().width) : 0
      );
      if (measured.some((w) => w > 0)) {
        setWidths((prev) => {
          if (prev.length === measured.length && prev.every((w, i) => w === measured[i])) {
            return prev;
          }
          return measured;
        });
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);

    if (document.fonts) {
      document.fonts.ready.then(updateWidths);
    }

    return () => {
      window.removeEventListener('resize', updateWidths);
    };
  }, [words]);

  // Continuous infinite cycle: 2s readable pause on each word, followed by ~0.5s smooth slide
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isSliding) {
      // Pause for readable duration on the currently visible word
      timer = setTimeout(() => {
        const next = (currentIndex + 1) % words.length;
        setNextIndex(next);
        setIsSliding(true);
      }, pauseDuration);
    } else {
      // Complete sliding transition after slideDuration
      timer = setTimeout(() => {
        setCurrentIndex(nextIndex);
        setIsSliding(false);
      }, slideDuration);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, nextIndex, isSliding, words.length, pauseDuration, slideDuration]);

  // Active width interpolation to prevent abrupt layout pops in surrounding text
  const currentMeasuredWidth = widths[currentIndex];
  const nextMeasuredWidth = widths[nextIndex];
  const activeWidth = isSliding && nextMeasuredWidth ? nextMeasuredWidth : currentMeasuredWidth;

  return (
    <>
      {/* Hidden off-screen measurement span to track responsive layout widths */}
      <span
        aria-hidden="true"
        className="invisible fixed -top-[9999px] -left-[9999px] pointer-events-none whitespace-nowrap opacity-0 select-none"
      >
        {words.map((word, idx) => (
          <span
            key={`measure-${word}`}
            ref={(el) => {
              measureRefs.current[idx] = el;
            }}
            className="inline-block px-0.5 font-normal tracking-[-0.015em]"
          >
            {word}
          </span>
        ))}
      </span>

      {/* Strict single-line clipping container with overflow: hidden */}
      <span
        className={`relative inline-block overflow-hidden align-baseline select-none font-normal text-white ${className}`}
        style={{
          height: '1.2em',
          verticalAlign: '-0.2em',
          width: activeWidth ? `${activeWidth}px` : undefined,
          transition: isSliding
            ? `width ${slideDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : 'none',
        }}
        aria-live="polite"
        role="text"
      >
        {/* In-flow ghost sizer providing natural baseline & width fallback */}
        <span
          className="invisible pointer-events-none select-none inline-block px-0.5 leading-none"
          aria-hidden="true"
        >
          {words[currentIndex]}
        </span>

        {/* Currently visible (or outgoing) word */}
        <span
          key={`current-${currentIndex}-${words[currentIndex]}`}
          className="absolute inset-0 flex items-center justify-center font-normal text-white leading-none px-0.5"
          style={{
            animation: isSliding
              ? `vRollerSlideUpOut ${slideDuration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
              : 'none',
            transform: isSliding ? undefined : 'translateY(0%)',
            willChange: 'transform',
          }}
        >
          {words[currentIndex]}
        </span>

        {/* Incoming word: simultaneously slides up from below to replace current word */}
        {isSliding && (
          <span
            key={`next-${nextIndex}-${words[nextIndex]}`}
            className="absolute inset-0 flex items-center justify-center font-normal text-white leading-none px-0.5"
            style={{
              animation: `vRollerSlideUpIn ${slideDuration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              willChange: 'transform',
            }}
          >
            {words[nextIndex]}
          </span>
        )}
      </span>
    </>
  );
};
