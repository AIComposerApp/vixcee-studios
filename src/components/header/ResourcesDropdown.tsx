import React from 'react';
import { ChevronDown, ArrowRight, LayoutTemplate, BookOpen } from 'lucide-react';
import { PromptIcon } from '../PromptIcon.tsx';

interface ResourcesDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onOpenPrompts: () => void;
}

export const ResourcesDropdown: React.FC<ResourcesDropdownProps> = ({
  isOpen,
  setIsOpen,
  dropdownRef,
  onOpenPrompts,
}) => {
  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded cursor-pointer ${
          isOpen ? 'text-white' : 'text-white/80'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Resources</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'text-white/60'
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 pt-2 w-[340px] animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
        >
          <div className="bg-[#0c0c0e]/95 border border-white/10 rounded-xl p-2.5 shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-1 ring-1 ring-white/5">
            {/* AI Coding Prompts */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPrompts();
              }}
              className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-pointer"
            >
              <PromptIcon
                variant="white"
                className="w-5 h-5 mt-0.5 shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white flex items-center justify-between">
                  <span>AI Coding Prompts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                  Free optimized prompts for your AI coding agents.
                </p>
              </div>
            </button>

            {/* Templates */}
            <div className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-default">
              <LayoutTemplate className="w-4 h-4 text-white/70 mt-1 shrink-0 group-hover:text-white transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>Templates</span>
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded-full border border-[#F04E23]/40 bg-[#F04E23]/5 text-[#F04E23]/90 text-[8px] font-medium leading-none select-none">
                      Coming soon
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                  Production-ready website & app starter templates.
                </p>
              </div>
            </div>

            {/* Tutorials */}
            <div className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-default">
              <BookOpen className="w-4 h-4 text-white/70 mt-1 shrink-0 group-hover:text-white transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>Tutorials</span>
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded-full border border-[#F04E23]/40 bg-[#F04E23]/5 text-[#F04E23]/90 text-[8px] font-medium leading-none select-none">
                      Coming soon
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                  Step-by-step guides for AI-driven development.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
