import React, { useState, useEffect, useRef } from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`w-full h-full cursor-pointer ${className}`}>
      {children}
    </div>
  );
};

interface CardSwapProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: string;
  onCardClick?: (index: number) => void;
}

export const CardSwap: React.FC<CardSwapProps> = ({
  children,
  width = 580,
  height = 380,
  cardDistance = 60,
  verticalDistance = 68,
  delay = 5000,
  pauseOnHover = true,
  skewAmount = 6,
  onCardClick,
}) => {
  const cards = React.Children.toArray(children);
  const totalCards = cards.length;
  const [topIndex, setTopIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (totalCards <= 1) return;
    if (pauseOnHover && isHovered) return;

    timerRef.current = setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % totalCards);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [topIndex, isHovered, totalCards, delay, pauseOnHover]);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        height: `${height}px`,
        perspective: '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.map((child, i) => {
        // Calculate relative position from current top card
        const offset = (i - topIndex + totalCards) % totalCards;
        const isCurrent = offset === 0;

        // Visual stack ordering
        const translateX = offset * cardDistance;
        const translateY = offset * -verticalDistance * 0.35;
        const scale = 1 - offset * 0.08;
        const rotateZ = offset * (skewAmount * 0.6);
        const zIndex = totalCards - offset;
        const opacity = offset >= 4 ? 0 : 1 - offset * 0.18;

        return (
          <div
            key={i}
            onClick={() => onCardClick?.(i)}
            className="absolute inset-0 will-change-transform cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale}) rotateZ(${rotateZ}deg)`,
              zIndex,
              opacity,
              pointerEvents: isCurrent ? 'auto' : 'auto',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default CardSwap;
