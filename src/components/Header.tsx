import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { MobileDrawer } from './header/MobileDrawer.tsx';
import { HeaderLogo } from './header/HeaderLogo.tsx';
import { ResourcesDropdown } from './header/ResourcesDropdown.tsx';

interface HeaderProps {
  onOpenStart: () => void;
  onOpenPrompts: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
  currentRoute?: string;
  onNavigateCaseStudies?: () => void;
  onNavigateHome?: () => void;
  onNavigateWork?: () => void;
  isStaticPinned?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStart,
  onOpenPrompts,
  dockStage = 'docked',
  currentRoute,
  onNavigateCaseStudies,
  onNavigateHome,
  onNavigateWork,
  isStaticPinned = false,
}) => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [areItemsVisible, setAreItemsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWordmarkVisible, setIsWordmarkVisible] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (dockStage === 'docked') {
      const timer = setTimeout(() => {
        setIsWordmarkVisible(true);
      }, 220);
      return () => clearTimeout(timer);
    } else {
      setIsWordmarkVisible(false);
      setIsHeaderVisible(true);
      setIsScrolled(false);
      lastScrollY.current = 0;
    }
  }, [dockStage]);

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
      }, 220);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setAreItemsVisible(false);
      timer1 = setTimeout(() => {
        setIsMenuActive(false);
      }, 200);
      timer2 = setTimeout(() => {
        setIsMenuMounted(false);
      }, 480);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);

      if (isMobileMenuOpen || isResourcesOpen) {
        setIsHeaderVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= 40) {
        setIsHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        setIsHeaderVisible(false);
      } else if (currentY < lastScrollY.current - 6) {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, isResourcesOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    return {
      transform: `translate3d(${logoCoords.deltaX}px, ${logoCoords.deltaY}px, 0) scale(${logoCoords.scale})`,
      transformOrigin: 'center center',
      filter: 'drop-shadow(0 4px 30px rgba(255, 255, 255, 0.35))',
    };
  }, [dockStage, logoCoords]);

  const isNavVisible = dockStage !== 'initial';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[70] h-[80px] select-none transition-transform duration-300 ease-out ${
        isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      } ${
        dockStage !== 'docked' || isStaticPinned || isHeaderVisible || isMobileMenuOpen
          ? 'translate-y-0'
          : '-translate-y-full'
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[115px] pointer-events-none transition-opacity duration-500 ease-out ${
          !isMobileMenuOpen && (isStaticPinned || isScrolled) ? 'opacity-100' : 'opacity-0'
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

      <div className="relative z-50 max-w-[1466px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between pointer-events-auto">
        <motion.div
          className={`flex-1 flex items-center justify-start ${
            isNavVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          initial={{ opacity: 0, y: -36 }}
          animate={{
            opacity: isNavVisible ? 1 : 0,
            y: isNavVisible ? 0 : -36,
          }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav className="hidden md:flex items-center space-x-7 text-[14px] font-medium tracking-tight text-white/80">
            <a
              href="/work"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateWork) {
                  onNavigateWork();
                } else {
                  onOpenStart();
                }
              }}
              className={`transition-colors ${currentRoute === 'work' ? 'text-white' : 'hover:text-white'}`}
            >
              Work
            </a>

            <a
              href="/case-studies"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateCaseStudies) {
                  onNavigateCaseStudies();
                } else {
                  onOpenStart();
                }
              }}
              className={`transition-colors ${currentRoute === 'case-studies' ? 'text-white' : 'hover:text-white'}`}
            >
              Case studies
            </a>

            <ResourcesDropdown
              isOpen={isResourcesOpen}
              setIsOpen={setIsResourcesOpen}
              dropdownRef={dropdownRef}
              onOpenPrompts={onOpenPrompts}
            />
          </nav>

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
        </motion.div>

        <HeaderLogo
          targetRef={targetRef}
          logoStyle={logoStyle}
          isWordmarkVisible={isWordmarkVisible}
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigateHome={onNavigateHome}
        />

        <motion.div
          className={`flex-1 flex items-center justify-end ${
            isNavVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          initial={{ opacity: 0, y: -36 }}
          animate={{
            opacity: isNavVisible ? 1 : 0,
            y: isNavVisible ? 0 : -36,
          }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onOpenStart}
            className="px-5 sm:px-6 py-2 sm:py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] hover:brightness-110 text-white rounded-[4px] active:scale-[0.97] transition-all duration-200 shadow-md shadow-[#F04E23]/25 hover:shadow-lg hover:shadow-[#F04E23]/40 whitespace-nowrap cursor-pointer"
          >
            Prompts
          </button>
        </motion.div>
      </div>

      <MobileDrawer
        isMenuMounted={isMenuMounted}
        isMenuActive={isMenuActive}
        areItemsVisible={areItemsVisible}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenStart={onOpenStart}
        onOpenPrompts={onOpenPrompts}
        onNavigateWork={onNavigateWork}
        onNavigateCaseStudies={onNavigateCaseStudies}
        currentRoute={currentRoute}
      />
    </header>
  );
};
