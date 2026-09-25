import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow 2:00 PM EST');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 800);
  };

  const handleReset = () => {
    setStep('form');
    setName('');
    setEmail('');
    setProjectDetails('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#111215] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-6 md:p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 font-semibold font-mono mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>15-Minute Strategy Call</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight">Let's discuss your project</h2>
              <p className="text-sm text-white/60 mt-1">
                Tell me what you're building. We'll map out your mobile-first website and timeline.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-md text-white placeholder-white/30 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-md text-white placeholder-white/30 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Tomorrow 2:00 PM EST', 'Tomorrow 4:30 PM EST', 'Friday 11:00 AM EST', 'Friday 3:00 PM EST'].map(
                    (slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 text-xs rounded border text-left transition-all ${
                          selectedSlot === slot
                            ? 'border-white bg-white/10 text-white font-medium'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Project Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Briefly describe what you need..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-md text-white placeholder-white/30 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming schedule...</span>
                  ) : (
                    <>
                      <span>Confirm 15-Min Call</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-2">You're on the calendar!</h3>
            <p className="text-sm text-white/70 max-w-sm mx-auto mb-2">
              We've sent an invite to <span className="text-white font-medium">{email}</span> for{' '}
              <span className="text-white font-medium">{selectedSlot}</span>.
            </p>
            <p className="text-xs text-white/40 mb-6">Looking forward to reviewing your site architecture.</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-white/90 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
