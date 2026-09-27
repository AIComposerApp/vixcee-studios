/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { BentoGridSection } from './components/BentoGridSection.tsx';
import { KingCarousel } from './components/KingCarousel.tsx';
import { WorkShowcaseSection } from './components/WorkShowcaseSection.tsx';
import { HomeTestimonials } from './components/HomeTestimonials.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { BookingSection } from './components/BookingSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PromptsModal } from './components/PromptsModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { CaseStudiesPage } from './pages/CaseStudiesPage.tsx';
import { CaseStudyDetailPage } from './pages/CaseStudyDetailPage.tsx';
import { WorkPage } from './pages/WorkPage.tsx';

export type DockStage = 'initial' | 'docking' | 'docked';
export type AppRoute = 'home' | 'case-studies' | 'case-study-detail' | 'work';

export default function App() {
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [dockStage, setDockStage] = useState<DockStage>('initial');

  // Client-Side Routing State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [selectedCaseStudySlug, setSelectedCaseStudySlug] = useState<string | null>(null);

  // Initialize Route from URL Pathname
  useEffect(() => {
    const parsePath = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

      if (pathname.startsWith('/case-studies/')) {
        const slug = pathname.replace('/case-studies/', '');
        if (slug) {
          setCurrentRoute('case-study-detail');
          setSelectedCaseStudySlug(slug);
          return;
        }
      }

      if (pathname === '/case-studies') {
        setCurrentRoute('case-studies');
        setSelectedCaseStudySlug(null);
        return;
      }

      if (pathname === '/work') {
        setCurrentRoute('work');
        setSelectedCaseStudySlug(null);
        return;
      }

      setCurrentRoute('home');
      setSelectedCaseStudySlug(null);
    };

    parsePath();

    const handlePopState = () => {
      parsePath();
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cinematic Intro: Smooth loading sequence on arrival
  useEffect(() => {
    if (dockStage === 'docked') return;

    const dockTimer = setTimeout(() => {
      setDockStage('docking');
    }, 1500);

    const finishTimer = setTimeout(() => {
      setDockStage('docked');
    }, 2350);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // Clean Navigation Handlers (Instant Scroll Reset)
  const navigateToHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentRoute('home');
    setSelectedCaseStudySlug(null);
    window.scrollTo(0, 0);
  };

  const navigateToCaseStudies = () => {
    if (window.location.pathname !== '/case-studies') {
      window.history.pushState({}, '', '/case-studies');
    }
    setCurrentRoute('case-studies');
    setSelectedCaseStudySlug(null);
    window.scrollTo(0, 0);
  };

  const navigateToWork = () => {
    if (window.location.pathname !== '/work') {
      window.history.pushState({}, '', '/work');
    }
    // Trigger authentic loading screen progression to pre-warm work assets
    setDockStage('initial');
    setCurrentRoute('work');
    setSelectedCaseStudySlug(null);
    window.scrollTo(0, 0);

    setTimeout(() => {
      setDockStage('docking');
    }, 1200);

    setTimeout(() => {
      setDockStage('docked');
    }, 2050);
  };

  const navigateToCaseStudyDetail = (slug: string) => {
    const targetUrl = `/case-studies/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    setCurrentRoute('case-study-detail');
    setSelectedCaseStudySlug(slug);
    window.scrollTo(0, 0);
  };

  const handleOpenPrompts = (promptId?: string) => {
    setActivePromptId(promptId || null);
    setIsPromptsOpen(true);
  };

  const handleScrollToBooking = () => {
    if (currentRoute !== 'home') {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      setCurrentRoute('home');
      setSelectedCaseStudySlug(null);

      // Instant positioning at #book-call with zero dizzying scroll animation
      requestAnimationFrame(() => {
        const el = document.getElementById('book-call');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
          setTimeout(() => {
            const elRetry = document.getElementById('book-call');
            if (elRetry) {
              elRetry.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
          }, 30);
        }
      });
      return;
    }

    const el = document.getElementById('book-call');
    if (el) {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      // If far away, jump instantly to avoid rapid multi-screen scrolling
      if (distance > window.innerHeight * 1.5) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div id="homepage-default" className="min-h-screen flex flex-col bg-[#0c0c0e] text-white overflow-x-clip selection:bg-white selection:text-black">
      {/* Exact Site Loading Screen with Original Timing and Stage Lifecycle */}
      <LoadingScreen stage={dockStage} />

      {/* Header Navigation with Directional Scroll Hide/Show */}
      <Header
        dockStage={dockStage}
        onOpenStart={handleScrollToBooking}
        onOpenPrompts={() => handleOpenPrompts()}
        onNavigateCaseStudies={navigateToCaseStudies}
        onNavigateHome={navigateToHome}
        onNavigateWork={navigateToWork}
        isStaticPinned={currentRoute === 'work'}
      />

      {/* Route Views */}
      <main id="content" className="flex-1 flex flex-col">
        {currentRoute === 'work' && (
          <WorkPage
            onSelectCaseStudy={navigateToCaseStudyDetail}
            onOpenBookCall={handleScrollToBooking}
            onNavigateHome={navigateToHome}
            onNavigateCaseStudies={navigateToCaseStudies}
            dockStage={dockStage}
          />
        )}

        {currentRoute === 'case-studies' && (
          <CaseStudiesPage
            onSelectCaseStudy={navigateToCaseStudyDetail}
            onOpenBookCall={handleScrollToBooking}
            onNavigateHome={navigateToHome}
          />
        )}

        {currentRoute === 'case-study-detail' && selectedCaseStudySlug && (
          <CaseStudyDetailPage
            slug={selectedCaseStudySlug}
            onBackToCaseStudies={navigateToCaseStudies}
            onSelectCaseStudy={navigateToCaseStudyDetail}
            onOpenBookCall={handleScrollToBooking}
            onNavigateHome={navigateToHome}
          />
        )}

        {currentRoute === 'home' && (
          <>
            <Hero
              onOpenPrompts={() => handleOpenPrompts()}
              onOpenBookCall={handleScrollToBooking}
            />
            <BentoGridSection
              onOpenPrompts={handleOpenPrompts}
              onOpenBookCall={handleScrollToBooking}
            />
            <KingCarousel
              onOpenPrompts={handleOpenPrompts}
              onOpenBookCall={handleScrollToBooking}
            />
            <WorkShowcaseSection
              onOpenPrompts={handleOpenPrompts}
              onOpenBookCall={handleScrollToBooking}
            />
            <HomeTestimonials />
            <FaqSection />
            <BookingSection />
          </>
        )}

        {/* Global Unified Footer (Hidden on Work page to maintain immersive fullscreen canvas) */}
        {currentRoute !== 'work' && (
          <Footer
            onOpenPrompts={() => handleOpenPrompts()}
            onOpenBookCall={handleScrollToBooking}
            onNavigateCaseStudies={navigateToCaseStudies}
            onNavigateHome={navigateToHome}
            onNavigateWork={navigateToWork}
          />
        )}
      </main>

      {/* AI Coding Prompts Modal */}
      <PromptsModal
        isOpen={isPromptsOpen}
        onClose={() => setIsPromptsOpen(false)}
        targetPromptId={activePromptId}
      />

      {/* Strategy Call / Start Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
