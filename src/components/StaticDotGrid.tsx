import React from 'react';

interface StaticDotGridProps {
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
}

export const StaticDotGrid: React.FC<StaticDotGridProps> = ({
  dotColor = 'rgba(240, 78, 35, 0.4)',
  dotSize = 2.5,
  dotSpacing = 32,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
        backgroundPosition: '0 0',
      }}
    >
      {/* Radial vignette fade smoothly dissolving outer edges into #0c0c0e */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(12, 12, 14, 0.75) 60%, #0c0c0e 95%)',
        }}
      />
    </div>
  );
};
