import React from 'react';

interface StepWizardNavProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  canAdvanceToStep: (step: number) => boolean;
}

export const StepWizardNav: React.FC<StepWizardNavProps> = ({
  currentStep,
  onSelectStep,
  canAdvanceToStep,
}) => {
  return (
    <div className="pb-4 mb-4 border-b border-white/[0.08] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => onSelectStep(1)}
            className={`transition-colors cursor-pointer tracking-wider ${
              currentStep === 1
                ? 'text-white font-semibold'
                : currentStep > 1
                ? 'text-white/70 hover:text-white'
                : 'text-white/30'
            }`}
          >
            Contact
          </button>

          <span className="text-white/20 text-[10px] select-none">/</span>

          <button
            type="button"
            onClick={() => {
              if (canAdvanceToStep(2)) onSelectStep(2);
            }}
            className={`transition-colors cursor-pointer tracking-wider ${
              currentStep === 2
                ? 'text-white font-semibold'
                : currentStep > 2
                ? 'text-white/70 hover:text-white'
                : 'text-white/30'
            }`}
          >
            Project
          </button>

          <span className="text-white/20 text-[10px] select-none">/</span>

          <button
            type="button"
            onClick={() => {
              if (canAdvanceToStep(3)) onSelectStep(3);
            }}
            className={`transition-colors cursor-pointer tracking-wider ${
              currentStep === 3
                ? 'text-white font-semibold'
                : 'text-white/30'
            }`}
          >
            Schedule
          </button>
        </div>

        <span className="hidden sm:inline-block text-[11px] text-white/40 font-mono tracking-wider">
          Step {currentStep} of 3
        </span>
      </div>

      {/* 3-Segment Linear Progress Track */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {[1, 2, 3].map((step) => {
          const isComplete = currentStep > step;
          const isActive = currentStep === step;
          return (
            <div
              key={step}
              className="h-1 rounded-full overflow-hidden bg-white/[0.08] transition-all duration-300"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isComplete
                    ? 'w-full bg-white/70'
                    : isActive
                    ? 'w-full bg-gradient-to-r from-[#F04E23] via-[#FF661F] to-[#FFAA00]'
                    : 'w-0 bg-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
