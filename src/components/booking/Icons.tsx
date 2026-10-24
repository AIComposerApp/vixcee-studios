import React from 'react';
import { GOOGLE_MEET_ICON_URL, GOOGLE_CALENDAR_ICON_URL } from './types.ts';

export const OfficialGoogleMeetIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5 shrink-0',
}) => (
  <img
    src={GOOGLE_MEET_ICON_URL}
    alt="Google Meet"
    draggable={false}
    className={`${className} object-contain select-none pointer-events-none`}
  />
);

export const OfficialGoogleCalendarIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4 shrink-0',
}) => (
  <img
    src={GOOGLE_CALENDAR_ICON_URL}
    alt="Google Calendar"
    draggable={false}
    className={`${className} object-contain select-none pointer-events-none`}
  />
);
