import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DayItem, TIME_SLOTS } from './types.ts';

export interface StepScheduleProps {
  displayedMonthYear: string;
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  weekDays: DayItem[];
  selectedDate: DayItem | null;
  setSelectedDate: (d: DayItem) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  bookedMap: Record<string, string[]>;
  daysDrag: {
    ref: React.RefObject<HTMLDivElement | null>;
    props: React.DOMAttributes<HTMLDivElement>;
  };
  isSubmitting: boolean;
  errorMsg: string;
  onPrev: () => void;
}

export const StepSchedule: React.FC<StepScheduleProps> = ({
  displayedMonthYear,
  weekOffset,
  setWeekOffset,
  weekDays,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  bookedMap,
  daysDrag,
  isSubmitting,
  errorMsg,
  onPrev,
}) => {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      {/* Unified Month Header with Inline Week Stepper */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-medium">
            Schedule Date &bull; {displayedMonthYear}
          </span>
          {weekOffset > 0 && (
            <span className="text-[9px] sm:text-[10px] text-white/50 font-mono uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-[4px] bg-white/[0.06] border border-white/10">
              +{weekOffset} {weekOffset === 1 ? 'wk' : 'wks'}
            </span>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
            className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-[4px] bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
            aria-label="Previous week"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            disabled={weekOffset >= 8}
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-[4px] bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
            aria-label="Next week"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Weekly Day Strip */}
      <div className="relative">
        <div
          ref={daysDrag.ref}
          {...daysDrag.props}
          className="grid grid-cols-6 gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 px-0.5 cursor-grab active:cursor-grabbing select-none"
        >
          {weekDays.map((day) => {
            const isSelected = selectedDate?.dateString === day.dateString;
            const bookedSlotsForDay = bookedMap[day.dateString] || [];
            const isFullyBooked = bookedSlotsForDay.length >= TIME_SLOTS.length;
            const isUnavailable = day.isPast || isFullyBooked;

            return (
              <button
                key={day.id}
                type="button"
                disabled={isUnavailable}
                onClick={() => {
                  if (!isUnavailable) setSelectedDate(day);
                }}
                className={`py-1.5 sm:py-2 px-1 rounded-[4px] flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                  isUnavailable
                    ? 'opacity-25 cursor-not-allowed bg-white/[0.02] border border-white/5 line-through'
                    : isSelected
                    ? 'bg-white text-black font-semibold border border-white'
                    : 'glass-refraction-chip text-white/85 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider leading-none">
                  {day.dayShort}
                </span>
                <span
                  className={`text-xs sm:text-sm md:text-base font-semibold mt-1 leading-none ${
                    isSelected ? 'text-black' : 'text-white'
                  }`}
                >
                  {day.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Time Slot Grid */}
      <div>
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/80 font-medium">
            Select Time
          </span>
          <span className="text-[10px] sm:text-[11px] text-white/40 font-mono">
            15-min call
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            const bookedForDay = bookedMap[selectedDate?.dateString || ''] || [];
            const isBooked = bookedForDay.includes(slot);

            return (
              <button
                key={slot}
                type="button"
                disabled={isBooked}
                onClick={() => {
                  if (!isBooked) setSelectedTime(slot);
                }}
                className={`py-2 sm:py-2.5 px-1.5 sm:px-2 text-center rounded-[4px] text-xs font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
                  isBooked
                    ? 'opacity-25 cursor-not-allowed bg-white/[0.02] border border-white/5 line-through'
                    : isSelected
                    ? 'bg-white text-black font-bold border border-white shadow-sm'
                    : 'glass-refraction-chip text-white/85 hover:text-white'
                }`}
              >
                <span>{slot}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-2.5 sm:p-3 rounded-[4px] bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Step 3 Actions: Back and Final Confirm Button */}
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
          type="submit"
          disabled={isSubmitting}
          className="w-2/3 h-10 sm:h-11 rounded-[4px] bg-white text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-150 hover:bg-white/90 active:scale-[0.98] border border-white cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Confirming...</span>
            </span>
          ) : (
            <span>Confirm 15-Min Call &rarr;</span>
          )}
        </button>
      </div>
    </div>
  );
};
