import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { PromptIcon } from './PromptIcon.tsx';

interface PromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPromptId?: string | null;
}

interface PromptCard {
  id: string;
  title: string;
  category: string;
  agent: string;
  description: string;
  promptText: string;
}

const CURATED_PROMPTS: PromptCard[] = [
  {
    id: 'clean-code-first-shot',
    title: 'Clean Code From The First Shot',
    category: 'Frontend & Architecture',
    agent: 'Claude / Cursor / Gemini',
    description: 'Prompts that give your AI coding agent clear direction. Less debugging and fewer wasted generations.',
    promptText: `Act as a principal frontend software engineer. Generate clean, maintainable, production-ready React + TypeScript code from the very first shot.
Key architectural guidelines:
1. Pure functional components, strict prop types, zero 'any'.
2. Semantic HTML elements with complete ARIA roles and visible keyboard focus states.
3. Separation of concerns: business logic in custom hooks, presentation in pure components.
4. Tailwind CSS styling adhering to strict design tokens (60-30-10 distribution).
5. Zero placeholder stubs: every interactive handler must be implemented with working state management.`,
  },
  {
    id: 'high-end-motion',
    title: 'High-End Motion On The First Try',
    category: 'Animations & Micro-interactions',
    agent: 'Cursor / v0 / Claude',
    description: 'Prompts that give your AI coding agent exact parameters for easing and timing. Smoother transitions and less endless tweaking.',
    promptText: `Implement high-end web micro-interactions and transitions with precise physical timing:
1. Easing curves: Use cubic-bezier(0.16, 1, 0.3, 1) for natural spring settling; never linear or generic ease.
2. Latency budget: Micro-interactions <= 180ms. Entrances <= 350ms with staggered 40ms delays.
3. Compositor-only: Animate transform (translate3d, scale) and opacity only. Never animate width, height, or top/left.
4. Accessibility: Always respect prefers-reduced-motion media query with instant fallback states.
5. GPU acceleration: Apply will-change strictly during active transitions, clean up on settled state.`,
  },
  {
    id: 'production-server-logic',
    title: 'Production-Ready Server Logic Immediately',
    category: 'Backend & APIs',
    agent: 'Gemini / Claude / Cursor',
    description: 'Prompts that give your AI coding agent precise architecture guidelines. Secure API endpoints and less endless debugging.',
    promptText: `Architect production-ready backend API endpoints and server workflows with zero security shortcuts:
1. Strict schema validation: Validate all incoming payloads with Zod before processing.
2. Idempotency & resilience: Implement idempotency keys for mutations; handle retries with exponential backoff.
3. Auth & RBAC: Enforce bearer token validation and tenant-level isolation on every protected route.
4. Structured error responses: Return uniform JSON errors ({ error: { code, message, details } }) with accurate HTTP status codes.
5. Zero secrets exposure: Ensure client builds never leak environment credentials or service role keys.`,
  },
  {
    id: 'mobile-first-cro',
    title: 'Mobile-First Conversion Architecture',
    category: 'Layout & CRO',
    agent: 'Claude / Cursor / Gemini',
    description: 'Prompts your AI to generate high-converting mobile viewport hierarchy, avoiding desktop clumping and sticky overload.',
    promptText: `Act as a principal frontend conversion architect. Build a mobile-first landing hero section for my web product.
Key requirements:
1. Viewport-first presence: 100svh framing on mobile, no layout shifts. Top navigation height <= 60px.
2. Direct headline-to-value proposition: 1 clear H1 (< 8 words), 1 concrete supporting subhead (max 2 lines).
3. Dual CTA hierarchy: Single primary action (high contrast, min-h 48px touch target) + subtle secondary link.
4. WCAG AA compliance: All body text >= 16px to prevent iOS auto-zoom, contrast ratio >= 4.5:1.
5. Zero pill slop: No arbitrary pill badges, no fake metrics, no code comment prefixes.`,
  },
  {
    id: 'clean-design-system',
    title: 'Clean Neo-Grotesque Aesthetic System',
    category: 'Styling & Tokens',
    agent: 'Cursor / v0 / Claude',
    description: 'Forces your AI coding agent to use disciplined typography, sophisticated neutrals, and zero-pill UI rules.',
    promptText: `Generate a production-ready UI theme and hero component with strict anti-slop rules:
- Typography: Display in high-character neo-grotesque sans with letter-spacing -0.04em, paired with clean geometric body prose.
- Palette: 60-30-10 distribution. 60% obsidian dark canvas (#0c0c0e), 30% structural surfaces with hairline borders (rgba(255,255,255,0.08)), 10% pure white accent.
- Spacing: Container padding >= 24px, buttons with 2:1 horizontal-to-vertical padding ratio.
- Micro-interactions: 150ms cubic-bezier transition curves for hovers; compositor-only (transform, opacity).`,
  },
  {
    id: 'speed-seo-stack',
    title: 'Instant Speed & Lightweight React Stack',
    category: 'Performance & SEO',
    agent: 'Gemini / Claude 3.7',
    description: 'Configures Next.js/Vite apps with lightweight bundle footprint, zero third-party script lag, and semantic SEO.',
    promptText: `Refactor this page component for sub-second LCP and 100/100 Lighthouse score:
1. Ensure all SVGs are inlined or local vector components with explicit width/height.
2. Eliminate layout thrashing: reserve aspect ratios for all hero media.
3. Render semantic Schema.org Organization and WebSite JSON-LD in the document head.
4. Ensure all interactive controls have aria-label, visible focus-visible rings, and responsive touch padding.`,
  },
];

export const PromptsModal: React.FC<PromptsModalProps> = ({
  isOpen,
  onClose,
  targetPromptId,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && targetPromptId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`prompt-${targetPromptId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetPromptId]);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#111215] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-white/10 text-white flex items-center justify-center">
                <PromptIcon variant="original" className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-[#F04E23] font-semibold font-mono">
                AI Coding Prompts
              </span>
            </div>
            <h2 className="text-2xl font-light tracking-tight text-white">
              Optimized prompts for your AI agent
            </h2>
            <p className="text-sm text-white/60">
              Copy and paste directly into Cursor, Claude, Gemini, or v0 to get clean, mobile-first code without burning tokens.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompts list */}
        <div ref={containerRef} className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {CURATED_PROMPTS.map((prompt) => {
            const isCopied = copiedId === prompt.id;
            const isTarget = targetPromptId === prompt.id;
            return (
              <div
                id={`prompt-${prompt.id}`}
                key={prompt.id}
                className={`p-5 rounded-lg border transition-all group ${
                  isTarget
                    ? 'border-[#F04E23]/70 bg-[#F04E23]/[0.04] ring-1 ring-[#F04E23]/50'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div>
                    <h3 className="text-base font-medium text-white">{prompt.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                      <span className="text-[#FF661F]/90 font-medium">{prompt.category}</span>
                      <span>·</span>
                      <span className="font-mono text-white/40">{prompt.agent}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(prompt.id, prompt.promptText)}
                    className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white text-black hover:bg-white/90 active:scale-95'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-white/70 mb-3">{prompt.description}</p>

                <div className="bg-[#0b0c0e] border border-white/5 rounded-md p-3.5 font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-36">
                  {prompt.promptText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/50">
          <span>Need custom AI coding workflows for your team?</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
