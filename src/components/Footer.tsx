import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { db } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';

interface FooterProps {
  onOpenPrompts?: () => void;
  onOpenBookCall?: () => void;
  onNavigateCaseStudies?: () => void;
  onNavigateHome?: () => void;
  onNavigateWork?: () => void;
}

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.46A6.19 6.19 0 0 0 15.8 15.7V8.5a8.28 8.28 0 0 0 4.84 1.56V6.69h-.05z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({
  onOpenPrompts,
  onOpenBookCall,
  onNavigateCaseStudies,
  onNavigateHome,
  onNavigateWork,
}) => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setSubscribeMsg('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setSubscribeMsg('Please agree to terms and conditions to subscribe.');
      return;
    }

    setIsSubmitting(true);
    setSubscribeMsg('');

    try {
      // Store subscriber in Firestore
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.trim().toLowerCase(),
        agreedToTerms: true,
        subscribedAt: new Date().toISOString(),
        source: 'footer_newsletter',
        status: 'active',
      });

      // Dispatch automated welcome email via server SMTP
      try {
        await fetch('/api/send-newsletter-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
      } catch (mailErr) {
        console.warn('[Welcome email dispatch note]', mailErr);
      }

      setIsSubscribed(true);
      setIsSubmitting(false);
    } catch (err) {
      console.warn('[Newsletter Firestore fallback]', err);
      // Still show confirmed state to user
      setIsSubscribed(true);
      setIsSubmitting(false);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateWork) {
      onNavigateWork();
    } else {
      const el = document.getElementById('work-showcase') || document.getElementById('work');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToCaseStudies = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateCaseStudies) {
      onNavigateCaseStudies();
    } else {
      const el = document.getElementById('case-studies') || document.getElementById('bento-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenBookCall) {
      onOpenBookCall();
    } else {
      const el = document.getElementById('book-call');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#000000] text-white overflow-hidden select-none isolate"
      aria-label="Footer"
    >
      {/* ============================================================ */}
      {/* SOFT FLUID AMBIENT EMBER DIFFUSION (No Hard Boundary Lines)  */}
      {/* ============================================================ */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        aria-hidden="true"
      >
        {/* Soft Ambient Top Feather Diffusion */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[110%] sm:w-[85%] h-[320px] rounded-full pointer-events-none opacity-40 blur-[70px]"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(240, 78, 35, 0.35) 0%, rgba(180, 35, 10, 0.12) 55%, transparent 80%)',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
        
        {/* ============================================================ */}
        {/* TOP SECTION: Main Content & Newsletter (Two-Column Structure) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Brand & Navigation */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Logo at Top Left */}
            <a
              href="/"
              onClick={scrollToTop}
              className="flex items-center gap-3 group cursor-pointer mb-7 sm:mb-8 focus:outline-none"
              aria-label="Vixcee Studios Home"
            >
              <div className="w-9 h-auto aspect-[225/166] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="88.17903919219971 100.88997669219971 225.1209789276123 166.12005577087402"
                  fill="none"
                  className="w-full h-full text-white group-hover:brightness-110 transition-[filter] duration-200"
                >
                  <path
                    d="M 248.22,193.18 C 268.71,162.59 288.78,130.59 307.94,106.25 H 263.27 C 251.59,106.25 239.39,115.32 233.59,125.71 L 218.25,150.71 L 201.61,123.33 C 199.76,120.1 196.22,118.08 192.74,118.14 L 154.71,118.53 C 156.49,120.12 158.19,121.57 159.64,123.65 C 173.22,143.69 186.21,165.87 198.51,185.19 L 218.25,151.53 L 244.47,194.33 L 222.05,227.06 L 198.82,186.44 C 192.78,197.31 186.07,208.14 179.46,217.19 C 179.34,217.27 179.23,217.22 179.22,217.08 C 182.09,209.63 186.47,202.3 189.14,195.32 L 150.5,128.09 C 147.56,122.54 140.84,118.25 135.49,118.25 H 93.54 L 172.06,247.81 C 181.15,261.85 196.15,261.2 206.59,248.19 L 222.08,228.06 L 237.32,255.52 C 239.39,259.31 243.25,261.65 247.17,261.65 H 291.66 L 248.22,193.18 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-lg font-light tracking-[-0.02em] text-white">
                Vixcee Studios
              </span>
            </a>

            {/* Navigation Links: "Home", "Prompts", "Work", "Case studies", "Contact" */}
            <nav className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 text-sm text-white/70 font-medium">
              <a
                href="/"
                onClick={scrollToTop}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Home
              </a>
              <a
                href="#prompts"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenPrompts) onOpenPrompts();
                }}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Prompts
              </a>
              <a
                href="#work"
                onClick={scrollToWork}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Work
              </a>
              <a
                href="#case-studies"
                onClick={scrollToCaseStudies}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Case studies
              </a>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Contact
              </a>
            </nav>

            {/* Official Direct Contact & Social Links Dock */}
            <div className="flex items-center gap-2.5 mt-7">
              <a
                href="mailto:hello@vixceestudios.com"
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                aria-label="Send direct message to hello@vixceestudios.com"
                title="hello@vixceestudios.com"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@vixcee.design"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                aria-label="Vixcee Studios on TikTok"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/vixceevibes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                aria-label="Vixcee Studios on X"
                title="X"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/mathew-victor-449a11388"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                aria-label="Mathew Victor on LinkedIn"
                title="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Newsletter Integration */}
          <div className="lg:col-span-7 flex flex-col text-left lg:pl-6">
            {/* Heading: "Stay in the loop" (bold text) */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2.5">
              Stay in the loop
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-lg mb-5">
              New prompts, templates, and case studies delivered when they drop. No noise, just useful work.
            </p>

            {/* Form */}
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-white flex items-center gap-3 animate-fade-in max-w-md">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </span>
                <p className="text-xs sm:text-sm font-medium">
                  You’re in the loop. We’ll deliver updates directly to your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 max-w-md w-full">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-11 sm:h-12 px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 sm:h-12 px-6 rounded-[4px] bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-[0.98] border border-white transition-all duration-150 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSubmitting ? 'Signing up...' : 'Sign up'}
                  </button>
                </div>

                {subscribeMsg && (
                  <p className="text-xs text-red-300 font-medium mt-1">{subscribeMsg}</p>
                )}

                {/* Checkbox Disclaimer */}
                <label className="flex items-center gap-2.5 cursor-pointer mt-2.5 select-none group text-left">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border border-white/30 bg-white/[0.08] text-white accent-white focus:ring-0 focus:outline-none cursor-pointer shrink-0 transition-all group-hover:border-white/60"
                  />
                  <span className="text-[11px] sm:text-xs text-white/50 leading-normal font-light group-hover:text-white/70 transition-colors">
                    by subscribing, you&apos;re confirming that you agree with our terms and conditions
                  </span>
                </label>
              </form>
            )}
          </div>

        </div>

        {/* ============================================================ */}
        {/* BOTTOM SECTION: Legal, Socials & Copyright                  */}
        {/* ============================================================ */}
        <div className="mt-12 sm:mt-16 pt-7 sm:pt-8 border-t border-white/[0.10] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
          
          {/* Left Side: Legal Links */}
          <div className="flex items-center gap-6 order-2 md:order-1">
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Terms of Service
            </a>
            <a
              href="#cookies"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Cookies Settings
            </a>
          </div>

          {/* Center: Social Links & Direct Mail */}
          <div className="flex items-center gap-3 order-1 md:order-2">
            <a
              href="mailto:hello@vixceestudios.com"
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Send direct message to hello@vixceestudios.com"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.tiktok.com/@vixcee.design"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Vixcee Studios on TikTok"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://x.com/vixceevibes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Vixcee Studios on X"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mathew-victor-449a11388"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Mathew Victor on LinkedIn"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Side: Copyright */}
          <div className="text-white/45 font-light text-center md:text-right order-3">
            &copy; 2026 Vixcee Studios. All rights reserved.
          </div>

        </div>

      </div>
    </footer>
  );
};
