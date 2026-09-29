import React, { useState, useEffect } from 'react';
import { db } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { Check, ArrowRight, Loader2, ChevronLeft, Lock } from 'lucide-react';
import { ScrollReveal } from '../components/motion/ScrollMotion.tsx';

interface AiCodingPromptsPageProps {
  onNavigateHome: () => void;
  onNavigateWork?: () => void;
  onNavigateCaseStudies?: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
}

const HEADLINE_WORDS = ['Stop', 'burning', 'tokens', 'on', 'bad', 'generations.'];

export const AiCodingPromptsPage: React.FC<AiCodingPromptsPageProps> = ({
  onNavigateHome,
  dockStage = 'docked',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize animation trigger with loading screen clearance
  const [shouldAnimate, setShouldAnimate] = useState(dockStage !== 'initial');

  useEffect(() => {
    if (dockStage === 'docking' || dockStage === 'docked') {
      setShouldAnimate(true);
    }
  }, [dockStage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'prompt_waitlist'), {
        email: trimmed,
        createdAt: new Date().toISOString(),
        source: 'ai_coding_prompts_page',
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Failed to join prompt waitlist:', err);
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0c0c0e] text-white flex flex-col items-center justify-between pt-24 sm:pt-32 lg:pt-36 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      
      {/* Subtle Top Navigation Breadcrumb */}
      <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-10 flex items-center justify-start">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer group py-1.5"
        >
          <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Editorial & Capture Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* The Hook (Headline) - Word-by-Word Rise with Soft Lens Blur */}
        <h1 className="font-light tracking-[-0.015em] text-[28px] sm:text-4xl md:text-6xl lg:text-[74px] leading-[1.18] md:leading-[1.08] [word-spacing:0.08em] text-white text-balance max-w-4xl">
          {HEADLINE_WORDS.map((word, idx) => (
            <span
              key={idx}
              className={`inline-block mr-[0.24em] last:mr-0 ${
                shouldAnimate ? 'animate-word-lens' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${idx * 75}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* The Tease (Subheadline) - Smooth single-block reveal */}
        <p
          className={`mt-5 sm:mt-6 text-[13px] sm:text-base md:text-[19px] text-white/80 font-light leading-relaxed max-w-2xl text-balance ${
            shouldAnimate ? 'animate-block-reveal' : 'opacity-0'
          }`}
          style={{
            animationDelay: '480ms',
          }}
        >
          The exact one-shot prompts we use for fluid animations and production-ready server logic. Dropping this Friday.
        </p>

        {/* The Capture (Form) Container with Ambient Animated Flow Gradient Glow Behind It */}
        <div
          className={`relative mt-8 sm:mt-12 w-full max-w-xl will-change-[transform,opacity] ${
            shouldAnimate ? 'animate-word-lens' : 'opacity-0'
          }`}
          style={{
            animationDelay: '880ms',
          }}
        >
          {/* Animated Ember Horizon Flow Gradient Behind the Form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] sm:w-[135%] h-[260px] sm:h-[320px] pointer-events-none overflow-visible -z-10">
            {/* Primary warm amber/orange horizon pulse */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none animate-ember-flow opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(252, 128, 0, 0.65) 0%, rgba(240, 78, 35, 0.40) 35%, rgba(180, 35, 10, 0.15) 65%, transparent 85%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Secondary intense deep coral core */}
            <div
              className="absolute inset-0 w-[85%] h-[80%] top-[10%] left-[7.5%] pointer-events-none animate-ember-drift-1 opacity-75"
              style={{
                background:
                  'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255, 60, 20, 0.60) 0%, rgba(254, 94, 80, 0.30) 35%, transparent 75%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Ambient wide horizon wash */}
            <div
              className="absolute inset-0 w-[120%] h-[120%] -top-[10%] -left-[10%] pointer-events-none animate-ember-drift-2 opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse 85% 65% at 50% 50%, rgba(252, 128, 0, 0.45) 0%, rgba(240, 78, 35, 0.28) 35%, transparent 85%)',
                filter: 'blur(55px)',
              }}
            />
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-[#141418]/95 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#F04E23]/20 via-[#FF661F]/15 to-[#FFAA00]/20 border border-[#F04E23]/40 flex items-center justify-center text-white mb-3.5 shadow-[0_0_24px_rgba(240,78,35,0.30)]">
                <Check className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-white tracking-tight">
                You're on the early access list!
              </p>
              <p className="text-xs sm:text-sm text-white/60 font-light mt-1.5 text-center max-w-sm">
                Watch your inbox this Friday for the first batch of prompt recipes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-xl bg-[#121316]/95 backdrop-blur-xl shadow-2xl shadow-black/90 transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  disabled={status === 'loading'}
                  className="flex-1 w-full bg-transparent px-4 py-3 sm:py-2.5 text-sm sm:text-base text-white placeholder-white/35 focus:outline-none disabled:opacity-50"
                  aria-label="Email for prompt early access"
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 sm:px-7 py-3 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] hover:brightness-110 text-white rounded-xl sm:rounded-lg active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#F04E23]/25 hover:shadow-lg hover:shadow-[#F04E23]/40 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>GET EARLY ACCESS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <p className="text-xs sm:text-sm text-red-400 mt-2 text-left w-full pl-2">
                  {errorMessage}
                </p>
              )}

              {/* The Microcopy */}
              <p className="text-xs sm:text-[13px] text-white/45 font-light mt-3 sm:mt-3.5 tracking-wide text-balance">
                No spam. Just the first batch of optimized prompts sent straight to your inbox.
              </p>
            </form>
          )}
        </div>

      </div>

      {/* Landscape Skeleton Teaser: Scroll-Triggered Viewport Reveal with Staggered Cards */}
      <div className="relative w-full max-w-5xl mx-auto mt-14 sm:mt-20 pointer-events-none select-none">
        
        {/* Soft bottom fade mask gradient into pure black background */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-[#0c0c0e]/60 to-[#0c0c0e]" />
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 z-30 bg-[#0c0c0e]" />

        {/* Faded Minimal Padlock Icon Centered Over the Skeleton Grid */}
        <div className="absolute inset-0 z-25 flex items-center justify-center -translate-y-4 sm:-translate-y-6 pointer-events-none">
          <ScrollReveal delay={180} duration={950} yOffset={18}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#111215]/85 border border-white/[0.06] flex items-center justify-center text-white/40 opacity-35 shadow-lg shadow-black/80">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 opacity-35">
          {[120, 180, 240, 300, 360, 420].map((staggerDelay, idx) => (
            <ScrollReveal
              key={idx}
              delay={staggerDelay}
              duration={950}
              yOffset={24}
              threshold={0.08}
            >
              <div className="h-28 sm:h-36 lg:h-44 rounded-xl sm:rounded-2xl bg-[#111215] border border-white/[0.04]" />
            </ScrollReveal>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AiCodingPromptsPage;
