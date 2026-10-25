import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { PromptIcon, TikTokIcon, XIcon, LinkedInIcon } from './NavIcons.tsx';

interface MobileDrawerProps {
  isMenuMounted: boolean;
  isMenuActive: boolean;
  areItemsVisible: boolean;
  onClose: () => void;
  onOpenStart: () => void;
  onOpenPrompts: () => void;
  onNavigateWork?: () => void;
  onNavigateCaseStudies?: () => void;
  currentRoute?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isMenuMounted,
  isMenuActive,
  areItemsVisible,
  onClose,
  onOpenStart,
  onOpenPrompts,
  onNavigateWork,
  onNavigateCaseStudies,
  currentRoute: _currentRoute,
}) => {
  if (!isMenuMounted) return null;

  return (
    <div
      id="mobile-nav-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      style={{
        transform: isMenuActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        opacity: isMenuActive ? 1 : 0,
        transition:
          'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="fixed inset-0 top-0 left-0 w-full h-[100dvh] bg-[#0c0c0e]/98 backdrop-blur-2xl border-b border-white/10 z-40 flex flex-col justify-between pt-24 pb-8 px-6 md:hidden overflow-y-auto pointer-events-auto touch-manipulation"
    >
      {/* Navigation Links Column */}
      <div className="flex flex-col gap-1.5 pt-4">
        {/* Work */}
        <div
          style={{
            transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
            opacity: areItemsVisible ? 1 : 0,
            filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
            transition:
              'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: areItemsVisible ? '220ms' : '0ms',
          }}
        >
          <a
            href="/work"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              if (onNavigateWork) {
                onNavigateWork();
              } else {
                onOpenStart();
              }
            }}
            className="w-full text-left py-3 px-3 text-lg font-medium text-white hover:text-white/80 flex items-center justify-between group cursor-pointer rounded-lg hover:bg-white/[0.03] transition-colors pointer-events-auto select-none"
          >
            <span>Work</span>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
          </a>
        </div>

        {/* Case studies */}
        <div
          style={{
            transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
            opacity: areItemsVisible ? 1 : 0,
            filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
            transition:
              'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: areItemsVisible ? '290ms' : '0ms',
          }}
        >
          <a
            href="/case-studies"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              if (onNavigateCaseStudies) {
                onNavigateCaseStudies();
              } else {
                onOpenStart();
              }
            }}
            className="w-full text-left py-3 px-3 text-lg font-medium text-white hover:text-white/80 flex items-center justify-between group cursor-pointer rounded-lg hover:bg-white/[0.03] transition-colors pointer-events-auto select-none"
          >
            <span>Case studies</span>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
          </a>
        </div>

        {/* AI Coding Prompts */}
        <div
          style={{
            transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
            opacity: areItemsVisible ? 1 : 0,
            filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
            transition:
              'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: areItemsVisible ? '360ms' : '0ms',
          }}
        >
          <a
            href="/ai-coding-prompts"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              onOpenPrompts();
            }}
            className="w-full text-left py-3 px-3 text-lg font-medium text-white hover:text-white/80 flex items-center justify-between group cursor-pointer rounded-lg hover:bg-white/[0.03] transition-colors pointer-events-auto select-none"
          >
            <span>AI Coding Prompts</span>
            <PromptIcon
              variant="white"
              className="w-5 h-5 shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
            />
          </a>
        </div>

        {/* Templates */}
        <div
          style={{
            transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
            opacity: areItemsVisible ? 1 : 0,
            filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
            transition:
              'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: areItemsVisible ? '430ms' : '0ms',
          }}
        >
          <div className="w-full text-left py-3 px-3 text-lg font-medium text-white/80 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <span>Templates</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#F04E23]/40 bg-[#F04E23]/10 text-[#F04E23] text-[9px] font-semibold tracking-wider uppercase select-none">
                Coming soon
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
          </div>
        </div>

        {/* Tutorials */}
        <div
          style={{
            transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
            opacity: areItemsVisible ? 1 : 0,
            filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
            transition:
              'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: areItemsVisible ? '500ms' : '0ms',
          }}
        >
          <div className="w-full text-left py-3 px-3 text-lg font-medium text-white/80 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <span>Tutorials</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#F04E23]/40 bg-[#F04E23]/10 text-[#F04E23] text-[9px] font-semibold tracking-wider uppercase select-none">
                Coming soon
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div
        style={{
          transform: areItemsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 22px, 0)',
          opacity: areItemsVisible ? 1 : 0,
          filter: areItemsVisible ? 'blur(0px)' : 'blur(4px)',
          transition:
            'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: areItemsVisible ? '580ms' : '0ms',
        }}
        className="pt-6 border-t border-white/[0.08] flex flex-col gap-3.5 pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPrompts();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-[13px] uppercase tracking-[0.1em] rounded-lg text-center active:scale-[0.98] transition-all hover:brightness-110 shadow-lg shadow-[#F04E23]/30 cursor-pointer flex items-center justify-center gap-2 pointer-events-auto select-none"
        >
          <PromptIcon variant="white" className="w-4 h-4" />
          <span>Get AI Coding Prompts</span>
        </button>

        {/* Official Direct Contact & Social Links Dock */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="mailto:hello@vixceestudios.com"
            className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm pointer-events-auto"
            aria-label="Send direct message to hello@vixceestudios.com"
            title="hello@vixceestudios.com"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@vixcee.design"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm pointer-events-auto"
            aria-label="Vixcee Studios on TikTok"
            title="TikTok"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/vixceevibes"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm pointer-events-auto"
            aria-label="Vixcee Studios on X"
            title="X"
          >
            <XIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/mathew-victor-449a11388"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm pointer-events-auto"
            aria-label="Mathew Victor on LinkedIn"
            title="LinkedIn"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>

        <p className="text-center text-xs text-white/40 font-light tracking-wide">
          Your sites live in days, not weeks
        </p>
      </div>
    </div>
  );
};
