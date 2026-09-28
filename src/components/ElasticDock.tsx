import React from 'react';
import { Plus, Minus } from 'lucide-react';

export type DeviceMode = 'mobile' | 'laptop';
export type DockState = 'overview' | 'zoomed' | 'focused';

interface ElasticDockProps {
  dockState: DockState;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  onToggleZoom: () => void;
  onOpenAction: () => void;
  hasCaseStudy?: boolean;
}

export const ElasticDock: React.FC<ElasticDockProps> = ({
  dockState,
  deviceMode,
  setDeviceMode,
  onToggleZoom,
  onOpenAction,
  hasCaseStudy = false,
}) => {
  const isOverview = dockState === 'overview';
  const isZoomed = dockState === 'zoomed';
  const isFocused = dockState === 'focused';

  // State A (overview with [ + ] and toggle): 248px
  // State B (zoomed close-up with [ - ] circle): 48px
  // State C (focused pill button): 212px or 176px
  const containerWidth = isOverview ? 248 : isZoomed ? 48 : hasCaseStudy ? 212 : 176;

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
          } else if (isZoomed) {
            onToggleZoom();
          }
        }}
      >
        {/* ============================================================ */}
        {/* STATE A CONTENT: [ + ] | [ Mobile | Desktop ]                */}
        {/* ============================================================ */}
        <div
          className={`absolute inset-0 px-2 flex items-center justify-between transition-opacity duration-300 ${
            isOverview ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* [+] Zoom to Close-Up Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleZoom();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-black hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
            title="Zoom into cluster"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Hairline Divider */}
          <div
            className="w-[1px] h-5 bg-black/[0.12] shrink-0 mx-1"
            style={{
              boxShadow: 'rgba(255, 255, 255, 0.4) 0px 0px 1px 0px',
            }}
          />

          {/* Clean Segmented Track: Mobile | Desktop */}
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
        {/* STATE B CONTENT: CIRCULAR [ - ] ZOOM OUT BUTTON              */}
        {/* Restored: When in zoomed mode, dock shrinks to 48px circle    */}
        {/* with [-] icon. Clicking it returns to overview!              */}
        {/* ============================================================ */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isZoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          title="Return to Overview (-)"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleZoom();
            }}
            className="w-full h-full flex items-center justify-center cursor-pointer"
            aria-label="Zoom out"
          >
            <Minus className="w-5 h-5 text-black" />
          </button>
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
