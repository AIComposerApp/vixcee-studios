import React, { useState } from 'react';
import { Home, Calendar, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

interface CaseStudiesPinnedNavProps {
  currentPage?: 'case-studies' | 'case-study-detail';
  currentSlug?: string;
  onNavigateHome: () => void;
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onBackToCaseStudies?: () => void;
  sections?: { id: string; label: string; index: string }[];
  activeSection?: string;
  onSectionClick?: (id: string) => void;
}

export const CaseStudiesPinnedNav: React.FC<CaseStudiesPinnedNavProps> = ({
  currentPage = 'case-study-detail',
  onNavigateHome,
  onOpenBookCall,
  onBackToCaseStudies,
  sections = [],
  activeSection = '',
  onSectionClick,
}) => {
  const [isSectionsMenuOpen, setIsSectionsMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[94vw]">
      {/* Floating Pill Dock */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        {/* Back to Case Studies or Home */}
        {onBackToCaseStudies ? (
          <button
            onClick={onBackToCaseStudies}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-black hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
            title="Back to Case Studies"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Studies</span>
          </button>
        ) : (
          <button
            onClick={onNavigateHome}
            className="p-2 rounded-full text-black hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        {/* Divider */}
        <div className="w-[1px] h-4 bg-black/15 mx-0.5" />

        {/* In-page Sections Jump Menu (for detail page) */}
        {sections.length > 0 && onSectionClick && (
          <div className="relative">
            <button
              onClick={() => setIsSectionsMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-black/80 hover:text-black hover:bg-black/10 transition-all cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5" />
              <span className="capitalize">
                {sections.find((s) => s.id === activeSection)?.label || 'Sections'}
              </span>
            </button>

            {/* Popup Sections Picker */}
            {isSectionsMenuOpen && (
              <div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col gap-1 min-w-[150px] animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{
                  background: 'rgba(20, 20, 24, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      onSectionClick(sec.id);
                      setIsSectionsMenuOpen(false);
                    }}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-white text-black font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    The {sec.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Book a Call CTA */}
        <button
          onClick={onOpenBookCall}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-sm cursor-pointer ml-1"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book a Call</span>
        </button>
      </div>
    </div>
  );
};

export default CaseStudiesPinnedNav;
