import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { ChevronDown, ArrowRight, LayoutTemplate, BookOpen } from 'lucide-react';
import { PromptIcon } from './PromptIcon.tsx';

interface HeaderProps {
  onOpenStart: () => void;
  onOpenPrompts: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStart,
  onOpenPrompts,
  dockStage = 'docked',
}) => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [areItemsVisible, setAreItemsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWordmarkVisible, setIsWordmarkVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Synchronous initial coordinates to ensure zero-flash, frame-0 centering
  const [logoCoords, setLogoCoords] = useState<{
    deltaX: number;
    deltaY: number;
    scale: number;
  }>(() => {
    if (typeof window === 'undefined') {
      return { deltaX: 0, deltaY: 360, scale: 4.74 };
    }
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 768;
    const targetW = isMobile ? 36 : 38;
    const desiredW = isMobile ? 130 : isTablet ? 155 : 180;
    return {
      deltaX: 0,
      deltaY: window.innerHeight / 2 - 40,
      scale: desiredW / targetW,
    };
  });

  // Mathematically precise FLIP measurement before first paint
  useLayoutEffect(() => {
    if (dockStage === 'docked') return;

    const measure = () => {
      if (!targetRef.current) return;
      const targetRect = targetRef.current.getBoundingClientRect();
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 768;
      const targetW = targetRect.width || (isMobile ? 36 : 38);
      const desiredW = isMobile ? 130 : isTablet ? 155 : 180;
      const scale = desiredW / targetW;

      setLogoCoords({
        deltaX: viewportCenterX - targetCenterX,
        deltaY: viewportCenterY - targetCenterY,
        scale,
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [dockStage]);

  // Dedicated post-docking delay:
  // Wordmark only begins its gentle dissolve AFTER the SVG mark has completely docked into place
  useEffect(() => {
    if (dockStage === 'docked') {
      const timer = setTimeout(() => {
        setIsWordmarkVisible(true);
      }, 220);
      return () => clearTimeout(timer);
    } else {
      setIsWordmarkVisible(false);
    }
  }, [dockStage]);

  // Non-instantaneous mobile menu lifecycle
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isMobileMenuOpen) {
      setIsMenuMounted(true);
      const frame = requestAnimationFrame(() => {
        setIsMenuActive(true);
      });
      timer1 = setTimeout(() => {
        setAreItemsVisible(true);
      }, 70);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setAreItemsVisible(false);
      timer1 = setTimeout(() => {
        setIsMenuActive(false);
      }, 180);
      timer2 = setTimeout(() => {
        setIsMenuMounted(false);
      }, 480);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isMobileMenuOpen]);

  // Scroll detection for header backdrop and wordmark
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Continuous unified single-element transform style
  const logoStyle: React.CSSProperties = useMemo(() => {
    if (dockStage === 'docked') {
      return {
        transform: 'none',
        transformOrigin: 'center center',
        filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.25))',
      };
    }

    if (dockStage === 'docking') {
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        transformOrigin: 'center center',
        transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), filter 850ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, filter',
        filter: 'drop-shadow(0 2px 12px rgba(255, 255, 255, 0.25))',
      };
    }

    // dockStage === 'initial'
    return {
      transform: `translate3d(${logoCoords.deltaX}px, ${logoCoords.deltaY}px, 0) scale(${logoCoords.scale})`,
      transformOrigin: 'center center',
      filter: 'drop-shadow(0 4px 30px rgba(255, 255, 255, 0.35))',
    };
  }, [dockStage, logoCoords]);

  const isNavVisible = dockStage !== 'initial';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[80px] pointer-events-none select-none">
      {/* 
        Seamlessly blended background with incremental gradient fade:
        - Fades in smoothly only on scroll down
        - Extends down to 115px with a gradual mask-image gradient that fades from opaque to transparent
      */}
      <div
        className={`absolute top-0 left-0 right-0 h-[115px] pointer-events-none transition-opacity duration-500 ease-out ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(to bottom, #0c0c0e 0%, rgba(12, 12, 14, 0.96) 40%, rgba(12, 12, 14, 0.6) 72%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.35) 82%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.35) 82%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      {/* Header Content Row */}
      <div className="relative z-10 max-w-[1466px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between pointer-events-auto">
        {/* Left Side: Work, Case studies, Resources (dissolves in synchronously as logo flies) */}
        <div
          className={`flex-1 flex items-center justify-start transition-opacity duration-700 ease-out ${
            isNavVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <nav className="hidden md:flex items-center space-x-7 text-[14px] font-medium tracking-tight text-white/80">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                onOpenStart();
              }}
              className="hover:text-white transition-colors"
            >
              Work
            </a>

            <a
              href="#case-studies"
              onClick={(e) => {
                e.preventDefault();
                onOpenStart();
              }}
              className="hover:text-white transition-colors"
            >
              Case studies
            </a>

            {/* Resources with dropdown indicator */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`flex items-center gap-1.5 py-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded ${
                  isResourcesOpen ? 'text-white' : 'text-white/80'
                }`}
                aria-expanded={isResourcesOpen}
                aria-haspopup="true"
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isResourcesOpen ? 'rotate-180 text-white' : 'text-white/60'
                  }`}
                />
              </button>

              {isResourcesOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-[340px] animate-in fade-in slide-in-from-top-2 duration-200"
                  role="menu"
                >
                  <div className="bg-[#0c0c0e]/95 border border-white/10 rounded-xl p-2.5 shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-1 ring-1 ring-white/5">
                    {/* AI Coding Prompts */}
                    <button
                      onClick={() => {
                        setIsResourcesOpen(false);
                        onOpenPrompts();
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-pointer"
                    >
                      <PromptIcon variant="white" className="w-5 h-5 mt-0.5 shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]" />
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
                    <div
                      className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-default"
                    >
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
                    <div
                      className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150 group flex items-start gap-3 cursor-default"
                    >
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
          </nav>

          {/* Asymmetric Two-Line Hamburger Morph */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden relative w-10 h-10 -ml-2 flex items-center justify-center text-white/90 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded cursor-pointer group"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-[14px] relative flex flex-col justify-between items-end pointer-events-none">
              <span
                className={`h-[2px] bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center ${
                  isMobileMenuOpen
                    ? 'w-6 translate-y-[6px] rotate-45'
                    : 'w-4 translate-y-0 rotate-0 group-hover:w-5'
                }`}
              />
              <span
                className={`h-[2px] bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center ${
                  isMobileMenuOpen
                    ? 'w-6 -translate-y-[6px] -rotate-45'
                    : 'w-6 translate-y-0 rotate-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* 
          Center: Stable Brand Identity Hosting Unified Continuous Single-Element Logo
          - EXACT same SVG element from frame 0
          - Zero DOM unmount, zero swap, zero element replacement
          - Moves directly from centered reveal into resting header slot
        */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative flex flex-col items-center justify-center group focus-visible:outline-none cursor-pointer py-1"
            aria-label="Vixcee Studios Home"
          >
            {/* Stable Target Slot */}
            <div
              id="header-logo-target"
              ref={targetRef}
              className="w-[36px] sm:w-[38px] aspect-[225/166] relative flex items-center justify-center"
            >
              {/* 
                Unified Continuous Single SVG Element:
                - Renders on frame 0 in the viewport center, scaled up, playing its initial drawing & color transition
                - At 4400ms, smoothly glides and scales directly into translate3d(0, 0, 0) scale(1)
                - Remains permanently locked in the DOM as the interactive header logo with zero replacement artifacts
              */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={logoStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="88.17903919219971 100.88997669219971 225.1209789276123 166.12005577087402"
                  fill="none"
                  className="w-full h-full pointer-events-none group-hover:brightness-110 transition-[filter] duration-200"
                >
                  <defs>
                    <style type="text/css">{`
                      @keyframes logoReveal { 
                        0% { transform: scale(0.94); transform-origin: 200px 185px; opacity: 0; } 
                        15% { opacity: 1; } 
                        100% { transform: scale(1); transform-origin: 200px 185px; opacity: 1; } 
                      }
                      .anim-logo { 
                        animation: logoReveal 3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                      }
                    `}</style>
                  </defs>
                  <path
                    d="M 248.22,193.18 C 268.71,162.59 288.78,130.59 307.94,106.25 H 263.27 C 251.59,106.25 239.39,115.32 233.59,125.71 L 218.25,150.71 L 201.61,123.33 C 199.76,120.1 196.22,118.08 192.74,118.14 L 154.71,118.53 C 156.49,120.12 158.19,121.57 159.64,123.65 C 173.22,143.69 186.21,165.87 198.51,185.19 L 218.25,151.53 L 244.47,194.33 L 222.05,227.06 L 198.82,186.44 C 192.78,197.31 186.07,208.14 179.46,217.19 C 179.34,217.27 179.23,217.22 179.22,217.08 C 182.09,209.63 186.47,202.3 189.14,195.32 L 150.5,128.09 C 147.56,122.54 140.84,118.25 135.49,118.25 H 93.54 L 172.06,247.81 C 181.15,261.85 196.15,261.2 206.59,248.19 L 222.08,228.06 L 237.32,255.52 C 239.39,259.31 243.25,261.65 247.17,261.65 H 291.66 L 248.22,193.18 Z"
                    fill="white"
                    className="anim-logo"
                    id="logo-mark"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="1000"
                      to="0"
                      dur="1.9s"
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.22 1 0.36 1"
                    />
                    <animate
                      attributeName="stroke"
                      values="#FE5E50;#FFB4A2;#FFFFFF;rgba(255,255,255,0)"
                      keyTimes="0;0.35;0.75;1"
                      dur="2.6s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="stroke-width"
                      values="3.5;3;1.5;0"
                      keyTimes="0;0.5;0.8;1"
                      dur="2.6s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="fill-opacity"
                      values="0;0;0.4;1"
                      keyTimes="0;0.45;0.75;1"
                      dur="3s"
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                    />
                    <animate
                      attributeName="fill"
                      values="#FE5E50;#FFA07A;#FFFFFF"
                      keyTimes="0;0.6;1"
                      dur="3s"
                      fill="freeze"
                    />
                  </path>
                </svg>
              </div>
            </div>

            {/* 
              Wordmark: Positioned absolutely below the symbol mark
              - Strictly isolated to opacity and transform to eliminate sub-pixel twitching
              - Only dissolves into view after SVG mark has docked, with dedicated post-docking delay
              - Fades out cleanly on scroll down
            */}
            <div
              style={{
                transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'opacity, transform',
              }}
              className={`absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap ${
                !isWordmarkVisible || isScrolled
                  ? 'opacity-0 -translate-y-1 pointer-events-none'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-white whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                VIXCEE STUDIOS
              </span>
            </div>
          </a>
        </div>

        {/* Right Side: Sign up (Orange-to-Yellow Gradient CTA Button) */}
        <div
          className={`flex-1 flex items-center justify-end transition-opacity duration-700 ease-out ${
            isNavVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={onOpenStart}
            className="px-5 sm:px-6 py-2 sm:py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] hover:brightness-110 text-white rounded-[4px] active:scale-[0.97] transition-all duration-200 shadow-md shadow-[#F04E23]/25 hover:shadow-lg hover:shadow-[#F04E23]/40 whitespace-nowrap cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuMounted && (
        <div
          className={`md:hidden pointer-events-auto bg-[#0c0c0e]/95 backdrop-blur-xl border-b px-6 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMenuActive
              ? 'max-h-[460px] py-6 opacity-100 border-white/10'
              : 'max-h-0 py-0 opacity-0 border-transparent'
          }`}
        >
          <div className="space-y-3">
            {/* Work */}
            <div
              style={{
                transition: 'opacity 250ms ease, filter 250ms ease',
                transitionDelay: areItemsVisible ? '50ms' : '0ms',
              }}
              className={areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'}
            >
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenStart();
                }}
                className="w-full text-left py-2 px-2 text-base font-medium text-white hover:text-white/80 flex items-center justify-between group"
              >
                <span>Work</span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              </button>
            </div>

            {/* Case studies */}
            <div
              style={{
                transition: 'opacity 250ms ease, filter 250ms ease',
                transitionDelay: areItemsVisible ? '100ms' : '0ms',
              }}
              className={areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'}
            >
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenStart();
                }}
                className="w-full text-left py-2 px-2 text-base font-medium text-white hover:text-white/80 flex items-center justify-between group"
              >
                <span>Case studies</span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              </button>
            </div>

            {/* AI Coding Prompts */}
            <div
              style={{
                transition: 'opacity 250ms ease, filter 250ms ease',
                transitionDelay: areItemsVisible ? '150ms' : '0ms',
              }}
              className={areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'}
            >
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPrompts();
                }}
                className="w-full text-left py-2 px-2 text-base font-medium text-white hover:text-white/80 flex items-center justify-between group"
              >
                <span>AI Coding Prompts</span>
                <PromptIcon variant="white" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]" />
              </button>
            </div>

            {/* Templates */}
            <div
              style={{
                transition: 'opacity 250ms ease, filter 250ms ease',
                transitionDelay: areItemsVisible ? '200ms' : '0ms',
              }}
              className={areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'}
            >
              <div className="w-full text-left py-2 px-2 text-base font-medium text-white flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span>Templates</span>
                  <span className="inline-flex items-center px-1.5 py-[2px] rounded-full border border-[#F04E23]/40 bg-[#F04E23]/5 text-[#F04E23]/90 text-[8px] font-medium leading-none select-none">
                    Coming soon
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>

            {/* Tutorials */}
            <div
              style={{
                transition: 'opacity 250ms ease, filter 250ms ease',
                transitionDelay: areItemsVisible ? '250ms' : '0ms',
              }}
              className={areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'}
            >
              <div className="w-full text-left py-2 px-2 text-base font-medium text-white flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span>Tutorials</span>
                  <span className="inline-flex items-center px-1.5 py-[2px] rounded-full border border-[#F04E23]/40 bg-[#F04E23]/5 text-[#F04E23]/90 text-[8px] font-medium leading-none select-none">
                    Coming soon
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>
          </div>

          {/* Sign up CTA */}
          <div
            style={{
              transition: 'opacity 250ms ease, filter 250ms ease',
              transitionDelay: areItemsVisible ? '300ms' : '0ms',
            }}
            className={`pt-4 border-t border-white/10 flex flex-col gap-3 ${
              areItemsVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'
            }`}
          >
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenStart();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-xs uppercase tracking-[0.1em] rounded-[4px] text-center active:scale-[0.98] transition-all hover:brightness-110 shadow-md shadow-[#F04E23]/25 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
