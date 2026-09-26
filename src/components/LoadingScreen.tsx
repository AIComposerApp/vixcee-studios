import React from 'react';

interface LoadingScreenProps {
  stage?: 'initial' | 'docking' | 'docked';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage = 'docked' }) => {
  if (stage === 'docked') return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none select-none overflow-hidden transition-opacity duration-700 ease-out ${
        stage === 'docking' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Deep Dark Solid Backdrop */}
      <div className="absolute inset-0 bg-[#0c0c0e]" />

      {/* Dynamic Ambient Optical Bloom centered behind the logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(254,94,80,0.45)_0%,rgba(252,128,0,0.18)_45%,transparent_75%)] blur-[60px]" />
      </div>
    </div>
  );
};
