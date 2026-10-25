import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionMeta {
  id: string;
  label: string;
  index: string;
}

interface CaseStudyDockProps {
  dockStage: 'initial' | 'docking' | 'docked';
  sections: SectionMeta[];
  activeSection: string;
  currentSectionMeta: SectionMeta;
  onBackToCaseStudies: () => void;
  onScrollToSection: (id: string) => void;
  onOpenBookCall: () => void;
}

export const CaseStudyDock: React.FC<CaseStudyDockProps> = ({
  dockStage,
  sections,
  activeSection,
  currentSectionMeta,
  onBackToCaseStudies,
  onScrollToSection,
  onOpenBookCall,
}) => {
  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] pointer-events-auto transition-all duration-500 ease-out ${
        dockStage === 'docked'
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <nav
        aria-label="Case study navigation dock"
        className="inline-flex items-center gap-1.5 sm:gap-3.5 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#141416]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black ring-1 ring-white/5 text-[11px] sm:text-[13px] text-white/70 select-none max-w-full"
      >
        {/* Back to Case Studies */}
        <button
          onClick={onBackToCaseStudies}
          className="group hover:text-white transition-colors cursor-pointer flex items-center gap-0.5 sm:gap-1.5 whitespace-nowrap font-medium text-white/80 text-[11px] sm:text-[13px] shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50 group-hover:text-white group-hover:-translate-x-0.5 transition-all shrink-0" />
          <span className="hidden sm:inline">Case Studies</span>
          <span className="inline sm:hidden">Cases</span>
        </button>

        {/* Segmented Section Dashes */}
        <div className="flex items-center gap-1 sm:gap-2 px-0.5 sm:px-1 shrink-0">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onScrollToSection(sec.id)}
                className={`h-[2px] sm:h-[2.5px] rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-3.5 sm:w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                    : 'w-2 sm:w-4 bg-white/25 hover:bg-white/50'
                }`}
                title={`Jump to ${sec.label}`}
                aria-label={`Jump to ${sec.label}`}
              />
            );
          })}
        </div>

        {/* Active Section Indicator e.g. "01 Challenge" */}
        <button
          onClick={() => onScrollToSection(activeSection)}
          className="font-mono text-[10px] sm:text-[12px] text-white font-medium whitespace-nowrap cursor-pointer hover:text-white/80 transition-colors shrink-0"
        >
          <span>{currentSectionMeta.index}</span>{' '}
          <span className="capitalize">{currentSectionMeta.label}</span>
        </button>

        {/* Floating Book Call CTA */}
        <button
          onClick={onOpenBookCall}
          className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium text-[10px] sm:text-[12px] transition-all flex items-center gap-0.5 sm:gap-1 whitespace-nowrap cursor-pointer border border-white/10 shrink-0"
        >
          <span>Book call</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </nav>
    </div>
  );
};
