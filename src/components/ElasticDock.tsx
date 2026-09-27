import React from 'react';

export type DeviceMode = 'mobile' | 'laptop';
export type DockState = 'overview' | 'zoomed' | 'focused';

interface ElasticDockProps {
  dockState: DockState;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  onOpenAction: () => void;
  hasCaseStudy?: boolean;
}

export const ElasticDock: React.FC<ElasticDockProps> = ({
  dockState,
  deviceMode,
  setDeviceMode,
  onOpenAction,
  hasCaseStudy = false,
}) => {
  const isOverview = dockState === 'overview' || dockState === 'zoomed';
  const isFocused = dockState === 'focused';

  // State A (overview toggle): 196px
  // State C (focused pill button): 212px or 176px
  const containerWidth = isOverview ? 196 : hasCaseStudy ? 212 : 176;

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
      {/* 
        SINGLE PERSISTENT ELASTIC DOM ELEMENT:
        Morphs width, height, border-radius, background, and shadow smoothly 
        using an authentic spring curve.
      */}
      <div
        className="relative overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: `${containerWidth}px`,
          height: '48px',
          borderRadius: '9999px',
          backgroundColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
          backgroundImage: isFocused
            ? 'none'
            : 'linear-gradient(135deg, rgba(255, 245, 240, 0.6) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(245, 240, 255, 0.6) 100%)',
          backdropFilter: isFocused ? 'none' : 'blur(24px)',
          WebkitBackdropFilter: isFocused ? 'none' : 'blur(24px)',
          border: isFocused ? 'none' : '0.8px solid rgba(255, 255, 255, 0.45)',
          boxShadow: isFocused
            ? '0 12px 36px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.4)'
            : 'rgba(0, 0, 0, 0.22) 0px 8px 30px 0px, rgba(255, 255, 255, 0.6) 0px 1px 0px 0px inset',
        }}
        onClick={() => {
          if (isFocused) {
            onOpenAction();
          }
        }}
      >
        {/* ============================================================ */}
        {/* STATE A CONTENT: [ Mobile | Desktop ] Segmented Toggle       */}
        {/* Clean, no redundant zoom buttons                             */}
        {/* ============================================================ */}
        <div
          className={`absolute inset-0 px-2 flex items-center justify-center transition-opacity duration-300 ${
            isOverview ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Segmented Track with Sliding Frosted Glass Active Pill */}
          <div
            className="relative flex items-center p-0.5 select-none"
            style={{ width: '180px', height: '36px' }}
          >
            {/* Sliding Frosted Glass Active Pill */}
            <div
              className="absolute top-0.5 bottom-0.5 rounded-[18px] transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
              style={{
                width: '86px',
                transform:
                  deviceMode === 'mobile' ? 'translateX(0px)' : 'translateX(88px)',
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.45) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '0.8px solid rgba(255, 255, 255, 0.65)',
                boxShadow:
                  '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            />

            {/* Mobile Tab */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeviceMode('mobile');
              }}
              className={`relative z-10 w-[86px] h-full text-[13px] font-semibold transition-colors duration-200 flex items-center justify-center cursor-pointer ${
                deviceMode === 'mobile' ? 'text-black font-bold' : 'text-[#444] hover:text-black'
              }`}
            >
              Mobile
            </button>

            {/* Desktop Tab */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeviceMode('laptop');
              }}
              className={`relative z-10 w-[86px] h-full text-[13px] font-semibold transition-colors duration-200 flex items-center justify-center cursor-pointer ${
                deviceMode === 'laptop' ? 'text-black font-bold' : 'text-[#444] hover:text-black'
              }`}
            >
              Desktop
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STATE C CONTENT: PILL-SHAPED SOLID WHITE CTA BUTTON          */}
        {/* Rounded-full, crisp white, black font, matching site CTA     */}
        {/* ============================================================ */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isFocused ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <span className="text-black text-[13.5px] font-semibold tracking-tight whitespace-nowrap px-6">
            {hasCaseStudy ? 'Read Case Study' : 'Book a Call'}
          </span>
        </div>
      </div>
    </div>
  );
};
