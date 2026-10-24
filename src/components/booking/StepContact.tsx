import React from 'react';
import { UserPlus, Globe, ArrowRight } from 'lucide-react';
import { OfficialGoogleMeetIcon } from './Icons.tsx';
import { CountryPicker } from './CountryPicker.tsx';
import { CountryCode } from './types.ts';

export interface StepContactProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (c: CountryCode) => void;
  phoneNational: string;
  setPhoneNational: (v: string) => void;
  showGuests: boolean;
  setShowGuests: (v: boolean) => void;
  guests: string;
  setGuests: (v: string) => void;
  currentWebsite: string;
  setCurrentWebsite: (v: string) => void;
  errorMsg: string;
  onNext: () => void;
}

export const StepContact: React.FC<StepContactProps> = ({
  name,
  setName,
  email,
  setEmail,
  selectedCountry,
  setSelectedCountry,
  phoneNational,
  setPhoneNational,
  showGuests,
  setShowGuests,
  guests,
  setGuests,
  currentWebsite,
  setCurrentWebsite,
  errorMsg,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      {/* Name & Email (2-Column on sm+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Your name * */}
        <div>
          <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
            Your name <span className="text-white/40">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
          />
        </div>

        {/* Email address * */}
        <div>
          <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
            Email address <span className="text-white/40">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            className="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* Location (Options: Google Meet) */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          Location
        </label>
        <div className="flex items-center gap-2.5 sm:gap-3 h-10 sm:h-11 px-3 sm:px-3.5 rounded-[4px] bg-white/[0.06] border border-white/20 text-white text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)]">
          <OfficialGoogleMeetIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="font-medium text-white/95">Google Meet</span>
          <span className="ml-auto text-[10px] sm:text-[11px] text-white/40 font-mono">Video link provided</span>
        </div>
      </div>

      {/* Phone number (Text notifications) * with International Country Picker */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          Phone number (Text notifications) <span className="text-white/40">*</span>
        </label>

        <CountryPicker
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          phoneNational={phoneNational}
          onChangePhoneNational={setPhoneNational}
        />

        <p className="mt-1 text-[10px] sm:text-[11px] text-white/45 leading-relaxed">
          By entering your phone number you consent to receive SMS notifications for this event.
        </p>
      </div>

      {/* Add guests & Current website (if redesign) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
        {/* Add guests */}
        <div>
          {!showGuests ? (
            <button
              type="button"
              onClick={() => setShowGuests(true)}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer py-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-white/60" />
              <span className="underline underline-offset-4 decoration-white/30">Add guests</span>
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium">
                  Add guests
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowGuests(false);
                    setGuests('');
                  }}
                  className="text-[10px] sm:text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="guest@company.com"
                className="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Current website (if redesign) */}
        <div>
          <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
            Current website (if redesign)
          </label>
          <div className="relative">
            <input
              type="text"
              value={currentWebsite}
              onChange={(e) => setCurrentWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 sm:h-11 pl-8 sm:pl-9 pr-3 sm:px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
            />
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/35 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-2.5 sm:p-3 rounded-[4px] bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Step 1 Actions: Next button */}
      <div className="pt-1.5 sm:pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-10 sm:h-11 rounded-[4px] bg-white text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-150 hover:bg-white/90 active:scale-[0.98] border border-white cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Next: Project Details</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
