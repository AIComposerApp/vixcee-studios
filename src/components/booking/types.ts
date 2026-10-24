export interface DayItem {
  id: string;
  dateString: string; // YYYY-MM-DD
  dayShort: string; // Mon, Tue, etc.
  dayFull: string; // Monday, Tuesday
  dayNum: number; // 28
  monthName: string; // September
  monthShort: string; // Sep
  year: number; // 2026
  formattedDate: string; // Sep 28, 2026
  isPast?: boolean;
}

export interface CountryCode {
  name: string;
  code: string;
  dial: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
  { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
  { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
  { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
  { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
];

export const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export const BUDGET_TIERS = ['< $5k', '$5k – $10k', '$10k – $25k', '$25k+'];
export const INTEREST_OPTIONS = ['Branding', 'Strategy', 'Communication'];

export const GOOGLE_MEET_URL = 'https://meet.google.com/vdd-fxch-jcm';
export const GOOGLE_MEET_ICON_URL =
  'https://res.cloudinary.com/divndlntm/image/upload/v1790608317/Google_Meet_icon__2026.svg_xykxnz.webp';

export const GOOGLE_CALENDAR_ICON_URL =
  'https://res.cloudinary.com/divndlntm/image/upload/v1790687052/Google_Calendar_icon__2026.svg_vqawcb.webp';
