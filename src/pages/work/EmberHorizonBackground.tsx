import React from 'react';

export const EmberHorizonBackground: React.FC = () => {
  return (
    <>
      {/* Animated Ember Horizon Flow Gradient Shader */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] sm:w-[130%] h-[380px] sm:h-[480px] pointer-events-none overflow-visible z-[1]">
        {/* Primary warm amber/orange horizon pulse */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none animate-ember-flow opacity-85"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(252, 128, 0, 0.70) 0%, rgba(240, 78, 35, 0.45) 35%, rgba(180, 35, 10, 0.18) 65%, transparent 85%)',
            filter: 'blur(45px)',
          }}
        />
        {/* Secondary intense deep coral core */}
        <div
          className="absolute inset-0 w-[85%] h-[80%] top-[10%] left-[7.5%] pointer-events-none animate-ember-drift-1 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255, 60, 20, 0.65) 0%, rgba(254, 94, 80, 0.35) 35%, transparent 75%)',
            filter: 'blur(35px)',
          }}
        />
        {/* Ambient wide horizon wash */}
        <div
          className="absolute inset-0 w-[120%] h-[120%] -top-[10%] -left-[10%] pointer-events-none animate-ember-drift-2 opacity-55"
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 50% 50%, rgba(252, 128, 0, 0.50) 0%, rgba(240, 78, 35, 0.30) 35%, transparent 85%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Subtle top vignette for clean header blending */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent z-[2]" />
    </>
  );
};
