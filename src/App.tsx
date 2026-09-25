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
import { PromptsModal } from './components/PromptsModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';

export type DockStage = 'initial' | 'docking' | 'docked';

export default function App() {
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [dockStage, setDockStage] = useState<DockStage>('initial');

  useEffect(() => {
    // Prevent background scrolling while loading screen is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 1. Reveal and dwell period: 4400ms -> start docking
    const dockTimer = setTimeout(() => {
      setDockStage('docking');
    }, 4400);

    // 2. Continuous flight completes at 5250ms (4400ms + 850ms) -> docked state
    const finishTimer = setTimeout(() => {
      setDockStage('docked');
      document.body.style.overflow = originalOverflow;
    }, 5250);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleOpenPrompts = (promptId?: string) => {
    setActivePromptId(promptId || null);
    setIsPromptsOpen(true);
  };

  return (
    <div id="homepage-default" className="min-h-screen flex flex-col bg-[#0c0c0e] text-white">
      {/* Coordinated Independent Dark Backdrop & Ambient Bloom Overlay */}
      <LoadingScreen stage={dockStage} />

      {/* Header Navigation hosting the Unified Continuous Single-Element Logo */}
      <Header
        dockStage={dockStage}
        onOpenStart={() => setIsBookingOpen(true)}
        onOpenPrompts={() => handleOpenPrompts()}
      />

      {/* Main Content Area hosting the Hero Section & Bento Section */}
      <main id="content" className="flex-1 flex flex-col">
        <Hero
          onOpenPrompts={() => handleOpenPrompts()}
          onOpenBookCall={() => setIsBookingOpen(true)}
        />
        <BentoGridSection
          onOpenPrompts={handleOpenPrompts}
          onOpenBookCall={() => setIsBookingOpen(true)}
        />
        <KingCarousel
          onOpenPrompts={handleOpenPrompts}
          onOpenBookCall={() => setIsBookingOpen(true)}
        />
        <WorkShowcaseSection
          onOpenPrompts={handleOpenPrompts}
          onOpenBookCall={() => setIsBookingOpen(true)}
        />
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

