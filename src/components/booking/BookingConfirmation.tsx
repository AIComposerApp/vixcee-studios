import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { OfficialGoogleMeetIcon, OfficialGoogleCalendarIcon } from './Icons.tsx';
import { DayItem } from './types.ts';

interface BookingConfirmationProps {
  name: string;
  email: string;
  selectedDate: DayItem | null;
  selectedTime: string | null;
  confirmedMeetUrl: string;
  onReset: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  name,
  email,
  selectedDate,
  selectedTime,
  confirmedMeetUrl,
  onReset,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(confirmedMeetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const getGoogleCalendarUrl = () => {
    if (!selectedDate || !selectedTime) return '#';
    const [year, month, day] = selectedDate.dateString.split('-').map(Number);
    const isPM = selectedTime.includes('PM');
    const [timePart] = selectedTime.split(' ');
    const [rawH, rawM] = timePart.split(':').map(Number);
    let hours = rawH;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const startDate = new Date(year, month - 1, day, hours, rawM);
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatCalDate = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}${pad(d.getUTCMinutes())}00Z`;

    const title = encodeURIComponent(`Vixcee Studios Consultation with ${name}`);
    const details = encodeURIComponent(
      `15-Minute High-Velocity Sprint Consultation with Vixcee Studios.\n\nJoin Google Meet: ${confirmedMeetUrl}`
    );
    const location = encodeURIComponent(confirmedMeetUrl);
    const dates = `${formatCalDate(startDate)}/${formatCalDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="text-center py-8 px-4 animate-fade-in flex flex-col items-center">
      {/* Monochrome Minimal Check Icon */}
      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 shadow-inner">
        <Check className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h3 className="font-light tracking-[-0.015em] text-white text-2xl sm:text-3xl leading-snug">
        You’re on the calendar.
      </h3>
      <p className="mt-3 text-sm sm:text-base text-white/80 max-w-md mx-auto font-light leading-relaxed">
        We’ve reserved{' '}
        <span className="text-white font-medium">
          {selectedDate?.dayFull}, {selectedDate?.formattedDate} at {selectedTime}
        </span>{' '}
        for <span className="text-white font-medium">{name}</span>.
      </p>
      <p className="mt-2 text-xs sm:text-[13px] text-white/50 max-w-md mx-auto font-light">
        A confirmation invite with meeting details has been dispatched to{' '}
        <span className="text-white/80 font-mono select-all">{email}</span>.
      </p>

      {/* Informative Google Meet Reference Card */}
      <div className="mt-6 w-full max-w-md p-4 rounded-xl bg-white/[0.04] border border-white/12 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <OfficialGoogleMeetIcon className="w-6 h-6 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono font-medium">
              Google Meet Details
            </p>
            <p className="text-sm font-medium text-white truncate font-mono select-all mt-0.5">
              {confirmedMeetUrl}
            </p>
            <p className="text-[11px] text-white/50 mt-1 font-light">
              Join link will be active at your scheduled time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-medium transition-all active:scale-[0.98] cursor-pointer shrink-0 self-start sm:self-center"
          title="Copy meeting link"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white/70" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Calendar Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white text-black font-semibold text-xs tracking-wide hover:bg-white/90 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
        >
          <OfficialGoogleCalendarIcon className="w-4 h-4 shrink-0" />
          <span>Add to Google Calendar</span>
          <ExternalLink className="w-3 h-3 text-black/50 ml-0.5" />
        </a>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
        >
          Book Another Call
        </button>
      </div>
    </div>
  );
};
