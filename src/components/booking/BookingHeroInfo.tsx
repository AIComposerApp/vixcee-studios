import React from 'react';
import { motion } from 'motion/react';
import { VerticalTextRoller } from '../VerticalTextRoller.tsx';
import { WordLensReveal } from '../motion/WordLensReveal.tsx';

const bookingLeftTransition = {
  duration: 3.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const BookingHeroInfo: React.FC = () => {
  return (
    <motion.div
      className="lg:col-span-5 flex flex-col justify-start text-left py-2 sm:py-6"
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={bookingLeftTransition}
    >
      {/* Animated SVG Symbol */}
      <div className="mb-6 sm:mb-8 flex items-center">
        <img
          src="https://res.cloudinary.com/divndlntm/image/upload/v1790414220/vixceestudios_symbol_reveal_01a0cf05-642a-74af-b172-cc2054f40851_u7e4sz.svg"
          alt="Vixcee Studios Symbol"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain select-none pointer-events-none"
          loading="eager"
        />
      </div>

      {/* Hero Headline with Interchanging VerticalTextRoller */}
      <WordLensReveal
        as="h2"
        delay={0}
        stagger={60}
        immediate={true}
        className="text-[28px] sm:text-4xl md:text-5xl lg:text-[56px] font-light tracking-[-0.015em] leading-[1.14] md:leading-[1.08] text-white text-balance [word-spacing:0.08em] select-none"
        words={[
          'Your',
          <VerticalTextRoller key="roller" words={['sites', 'tools', 'apps']} />,
          'live',
          'in',
          'days,',
          'not',
          'weeks',
        ]}
      />

      {/* Clean Subtitle */}
      <p className="mt-5 text-[13px] sm:text-base md:text-[18px] text-white/70 font-light leading-relaxed max-w-lg">
        Direct engineer consultation. We map out your site architecture, mobile interactions, and timeline in 15 minutes.
      </p>

      {/* Quick Meeting Overview */}
      <div className="mt-8 flex flex-col gap-2.5 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <span className="text-white/40">&bull;</span>
          <span>15-Minute High-Velocity Sprint Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40">&bull;</span>
          <span>Google Meet video link provided immediately</span>
        </div>
      </div>
    </motion.div>
  );
};
