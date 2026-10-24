import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BUDGET_TIERS, INTEREST_OPTIONS } from './types.ts';

export interface StepProjectProps {
  estimatedBudget: string;
  setEstimatedBudget: (v: string) => void;
  additionalInterests: string[];
  setAdditionalInterests: React.Dispatch<React.SetStateAction<string[]>>;
  projectNotes: string;
  setProjectNotes: (v: string) => void;
  foreseenChallenges: string;
  setForeseenChallenges: (v: string) => void;
  errorMsg: string;
  onPrev: () => void;
  onNext: () => void;
}

export const StepProject: React.FC<StepProjectProps> = ({
  estimatedBudget,
  setEstimatedBudget,
  additionalInterests,
  setAdditionalInterests,
  projectNotes,
  setProjectNotes,
  foreseenChallenges,
  setForeseenChallenges,
  errorMsg,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      {/* Estimated budget (web) */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          Estimated budget (web)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = estimatedBudget === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setEstimatedBudget(isSelected ? '' : tier)}
                className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-center rounded-[4px] text-[11px] sm:text-xs font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold border border-white shadow-sm'
                    : 'glass-refraction-chip text-white/80 hover:text-white'
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>

      {/* I'm also interested in */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          I'm also interested in
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = additionalInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => {
                  setAdditionalInterests((prev) =>
                    prev.includes(interest)
                      ? prev.filter((i) => i !== interest)
                      : [...prev, interest]
                  );
                }}
                className={`py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-[4px] text-[11px] sm:text-xs font-medium transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00] text-white font-semibold shadow-md shadow-[#F04E23]/25'
                    : 'glass-refraction-chip text-white/70 hover:text-white'
                }`}
              >
                <span>{interest}</span>
                {isSelected && <span className="text-[10px] leading-none">&bull;</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tell us about your project */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          Tell us about your project
        </label>
        <textarea
          rows={2}
          value={projectNotes}
          onChange={(e) => setProjectNotes(e.target.value)}
          placeholder="Please share anything that will help prepare for our meeting."
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200 resize-none"
        />
      </div>

      {/* Are there any challenges you foresee? */}
      <div>
        <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium mb-1 sm:mb-1.5">
          Are there any challenges you foresee?
        </label>
        <input
          type="text"
          value={foreseenChallenges}
          onChange={(e) => setForeseenChallenges(e.target.value)}
          placeholder="e.g. Tight deadline, custom integrations, design migration..."
          className="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
        />
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-2.5 sm:p-3 rounded-[4px] bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Step 2 Actions: Back and Next */}
      <div className="pt-1.5 sm:pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="w-1/3 h-10 sm:h-11 rounded-[4px] bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium text-xs tracking-wider transition-all duration-150 border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-2/3 h-10 sm:h-11 rounded-[4px] bg-white text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-150 hover:bg-white/90 active:scale-[0.98] border border-white cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Next: Pick Time</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
