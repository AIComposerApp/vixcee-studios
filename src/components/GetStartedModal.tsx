import React, { useState } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TemplateOption {
  id: string;
  name: string;
  category: string;
  desc: string;
  accent: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'almar',
    name: 'Almar',
    category: 'Online Store & Commerce',
    desc: 'Clean, elevated storefront designed for luxury goods, ceramics, and lifestyle brands.',
    accent: 'from-amber-900/40 to-stone-900',
  },
  {
    id: 'suhama',
    name: 'Suhama',
    category: 'Portfolio & Photography',
    desc: 'Editorial grid layout celebrating high-resolution visual storytelling and architectural stills.',
    accent: 'from-zinc-800 to-stone-950',
  },
  {
    id: 'reseda',
    name: 'Reseda',
    category: 'Services & Consultancy',
    desc: 'Modern typography and structured layout engineered for client conversions and appointments.',
    accent: 'from-slate-900 to-neutral-900',
  },
  {
    id: 'paloma',
    name: 'Paloma',
    category: 'Artisan & Hospitality',
    desc: 'Warm earthy tones with rich menus, booking integration, and custom event announcements.',
    accent: 'from-amber-950/60 to-zinc-950',
  },
];

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('almar');
  const [siteName, setSiteName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  if (!isOpen) return null;

  const handleStartSite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsStarted(true);
    }, 900);
  };

  const handleReset = () => {
    setIsStarted(false);
    setSiteName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#111215] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-white p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isStarted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Squarespace Studio</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Make your site real.</h2>
              <p className="text-white/60 text-sm mt-1">
                Start with a world-class template, customize with our drag-and-drop builder, and launch.
              </p>
            </div>

            <form onSubmit={handleStartSite} className="space-y-6">
              <div>
                <label htmlFor="site-name-input" className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                  What is your website called?
                </label>
                <input
                  id="site-name-input"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Studio Kihara, Apex Coffee, Elena Vance..."
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-md text-white placeholder-white/30 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2.5">
                  Choose a starting point:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate === tmpl.id;
                    return (
                      <button
                        type="button"
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={`text-left p-3.5 rounded-lg border transition-all relative ${
                          isSelected
                            ? 'border-white bg-white/10 shadow-md'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{tmpl.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-[11px] text-white/50 block mt-0.5">{tmpl.category}</span>
                        <p className="text-xs text-white/70 mt-2 line-clamp-2 leading-relaxed">{tmpl.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-white/50">Start for free. No credit card required.</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold text-xs uppercase tracking-wider rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-[#F04E23]/30"
                >
                  {isSubmitting ? (
                    <span>Creating your workspace...</span>
                  ) : (
                    <>
                      <span>Start Building</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-light text-white mb-2">Welcome to {siteName || 'Your Website'}!</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
              Your custom workspace using the <span className="text-white font-medium capitalize">{selectedTemplate}</span> layout is ready. You have a 14-day free trial to customize every detail.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-white/90 transition-all cursor-pointer"
              >
                Go to Site Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
