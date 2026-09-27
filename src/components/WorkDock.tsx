import React from 'react';
import { Plus } from 'lucide-react';

export type DeviceFilter = 'all' | 'mobile' | 'laptop';
export type IndustryFilter = 'all' | 'ecommerce' | 'hospitality' | 'web3' | 'wellness' | 'saas';

interface WorkDockProps {
  deviceFilter: DeviceFilter;
  setDeviceFilter: (filter: DeviceFilter) => void;
  industryFilter: IndustryFilter;
  setIndustryFilter: (filter: IndustryFilter) => void;
  isFocused?: boolean;
}

export const WorkDock: React.FC<WorkDockProps> = ({
  deviceFilter,
  setDeviceFilter,
  industryFilter,
  setIndustryFilter,
  isFocused = false,
}) => {
  const industries: { id: IndustryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'web3', label: 'Web3' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'saas', label: 'SaaS' },
  ];

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-auto flex flex-col items-center gap-2 max-w-[96vw] ${
        isFocused ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* ============================================================ */}
      {/* TIER 2: FLOATING SECONDARY INDUSTRY CHIPS (Stacked Above)    */}
      {/* ============================================================ */}
      <div
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-[18px] select-none overflow-x-auto scrollbar-none max-w-full"
        style={{
          border: '0.8px solid rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        }}
      >
        {industries.map((ind) => {
          const isActive = industryFilter === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setIndustryFilter(ind.id)}
              className={`relative px-2.5 sm:px-3 py-1 text-[11px] sm:text-[12px] font-medium transition-all rounded-[14px] cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white shadow-sm font-semibold'
                  : 'text-[#333] hover:text-black hover:bg-black/[0.08]'
              }`}
            >
              {ind.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TIER 1: PINNED PRIMARY BOTTOM DOCK (Reference CSS Match)     */}
      {/* ============================================================ */}
      <div
        className="control-bar-island flex items-center px-2 py-1 select-none"
        style={{
          height: '48px',
          border: '0.8px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '24px',
          boxShadow:
            'rgba(0, 0, 0, 0.2) 0px 8px 32px 0px, rgba(255, 255, 255, 0.5) 0px 1px 0px 0px inset',
          backgroundImage:
            'linear-gradient(135deg, rgba(255, 245, 240, 0.5) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(245, 240, 255, 0.5) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Subtle Plus Icon Button matching reference recording */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-black/75">
            <Plus className="w-4 h-4" />
          </div>

          {/* Vertical Divider */}
          <div
            className="w-[1px] h-5 mx-0.5 bg-black/[0.12] shrink-0"
            style={{
              boxShadow: 'rgba(255, 255, 255, 0.4) 0px 0px 1px 0px',
            }}
          />

          {/* Primary Tabs: [ All ] [ Mobile ] [ Laptop ] */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setDeviceFilter('all')}
              className={`relative px-3.5 sm:px-4 py-1.5 text-[13px] font-semibold transition-all rounded-[20px] cursor-pointer whitespace-nowrap ${
                deviceFilter === 'all'
                  ? 'text-black shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] bg-white/75 border border-white/60'
                  : 'text-[#444] hover:text-black hover:bg-white/20'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setDeviceFilter('mobile')}
              className={`relative px-3.5 sm:px-4 py-1.5 text-[13px] font-semibold transition-all rounded-[20px] cursor-pointer whitespace-nowrap ${
                deviceFilter === 'mobile'
                  ? 'text-black shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] bg-white/75 border border-white/60'
                  : 'text-[#444] hover:text-black hover:bg-white/20'
              }`}
            >
              Mobile
            </button>

            <button
              onClick={() => setDeviceFilter('laptop')}
              className={`relative px-3.5 sm:px-4 py-1.5 text-[13px] font-semibold transition-all rounded-[20px] cursor-pointer whitespace-nowrap ${
                deviceFilter === 'laptop'
                  ? 'text-black shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] bg-white/75 border border-white/60'
                  : 'text-[#444] hover:text-black hover:bg-white/20'
              }`}
            >
              Laptop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
