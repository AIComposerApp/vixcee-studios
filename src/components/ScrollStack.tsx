import React, { useRef, useEffect } from 'react';

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => {
  return (
    <div
      className={`w-full rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 transition-transform duration-300 ${itemClassName}`}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  useWindowScroll?: boolean;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 70,
  itemScale = 0.035,
  itemStackDistance = 32,
  baseScale = 0.9,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animFrame: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll<HTMLDivElement>('.scroll-stack-card');
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        // Distance from top of viewport relative to stacking threshold
        const stickyTop = 110 + index * itemStackDistance;
        const diff = stickyTop - itemRect.top;

        if (diff > 0) {
          // When sticking, apply slight stacking scale
          const scale = Math.max(baseScale, 1 - index * itemScale);
          item.style.transform = `scale(${scale})`;
          item.style.zIndex = `${index + 1}`;
        } else {
          item.style.transform = 'scale(1)';
          item.style.zIndex = `${index + 1}`;
        }
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animFrame);
    };
  }, [baseScale, itemDistance, itemScale, itemStackDistance]);

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center ${className}`}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            key={idx}
            className="scroll-stack-card w-full sticky top-[110px] origin-top transition-transform duration-200 ease-out"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default ScrollStack;
