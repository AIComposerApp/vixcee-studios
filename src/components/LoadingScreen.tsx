import React from 'react';

interface LoadingScreenProps {
  stage: 'initial' | 'docking' | 'docked';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  // Once docking is complete and hero is fully revealed, unmount backdrop overlay
  if (stage === 'docked') return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        Solid dark backdrop:
        Opaque immediately on frame 0 (#0c0c0e, opacity-100) with zero flash of underlying hero.
        Dissolves seamlessly outward as the mark begins its flight at 4400ms.
      */}
      <div
        className={`absolute inset-0 bg-[#0c0c0e] transition-opacity duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          stage === 'docking' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Dynamic Ambient Optical Bloom centered behind the loading logo */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out flex items-center justify-center ${
          stage === 'docking'
            ? 'opacity-0 scale-125'
            : 'opacity-60 scale-100'
        }`}
      >
        <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(254,94,80,0.35)_0%,rgba(252,128,0,0.12)_45%,transparent_70%)] blur-[40px]" />
      </div>
    </div>
  );
};
