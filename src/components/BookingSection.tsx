import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VerticalTextRoller } from './VerticalTextRoller.tsx';
import { ScrollReveal } from './motion/ScrollMotion.tsx';
import { WordLensReveal } from './motion/WordLensReveal.tsx';
import { db, auth } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { UserPlus, Globe, ChevronDown, Calendar, Check, ExternalLink, Download } from 'lucide-react';

interface DayItem {
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

interface CountryCode {
  name: string;
  code: string;
  dial: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
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

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

const BUDGET_TIERS = ['< $5k', '$5k – $10k', '$10k – $25k', '$25k+'];
const INTEREST_OPTIONS = ['Branding', 'Strategy', 'Communication'];

const GOOGLE_MEET_URL = 'https://meet.google.com/vix-cees-tud';
const GOOGLE_MEET_ICON_URL =
  'https://res.cloudinary.com/divndlntm/image/upload/v1790608317/Google_Meet_icon__2026.svg_xykxnz.webp';

// Official Google Meet Icon asset without any container box
const OfficialGoogleMeetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 shrink-0' }) => (
  <img
    src={GOOGLE_MEET_ICON_URL}
    alt="Google Meet"
    draggable={false}
    className={`${className} object-contain select-none pointer-events-none`}
  />
);

export const BookingSection: React.FC = () => {
  // Required & Intake Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location] = useState('Google Meet');

  // Country code selector state
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneNational, setPhoneNational] = useState('');
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryPickerRef = useRef<HTMLDivElement>(null);

  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useState('');
  const [currentWebsite, setCurrentWebsite] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [foreseenChallenges, setForeseenChallenges] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [additionalInterests, setAdditionalInterests] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Section ref
  const sectionRef = useRef<HTMLElement>(null);

  // Cal.com / Linear style active week offset (0 = current upcoming week, 1 = next week, etc.)
  const [weekOffset, setWeekOffset] = useState(0);

  // Firestore real-time booked appointments lookup: { "YYYY-MM-DD": ["11:30 AM", "03:00 PM"] }
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({});

  // Close country picker on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setIsCountryPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Filter countries by search query
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_CODES;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  // Auth session initialization
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((e) => console.log('[Firebase Auth]', e.message));
      }
    });
    return () => unsubAuth();
  }, []);

  // Listen to Firestore bookings in real time to prevent double booking
  useEffect(() => {
    try {
      const q = query(collection(db, 'bookings'));
      const unsubFirestore = onSnapshot(
        q,
        (snapshot) => {
          const map: Record<string, string[]> = {};
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.date && data.timeSlot && data.status !== 'cancelled') {
              if (!map[data.date]) {
                map[data.date] = [];
              }
              map[data.date].push(data.timeSlot);
            }
          });
          setBookedMap(map);
        },
        (err) => {
          console.warn('[Firestore Listen Error]', err);
        }
      );
      return () => unsubFirestore();
    } catch (err) {
      console.warn('[Firestore Init Error]', err);
    }
  }, []);

  // Generate 6-day week strip (Monday through Saturday) for the active weekOffset
  const weekDays: DayItem[] = useMemo(() => {
    const list: DayItem[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Compute starting Monday for the week
    const dayOfWeek = now.getDay();
    const diffToMon = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon + weekOffset * 7);

    // Build 6 days: Monday through Saturday
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dateString = d.toISOString().split('T')[0];
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = d.toLocaleDateString('en-US', { month: 'long' });
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const dayNum = d.getDate();
      const isPast = d < now;

      list.push({
        id: `${dateString}`,
        dateString,
        dayShort,
        dayFull,
        dayNum,
        monthName,
        monthShort,
        year,
        formattedDate: `${monthShort} ${dayNum}, ${year}`,
        isPast,
      });
    }

    return list;
  }, [weekOffset]);

  // Unified Month & Year Display
  const displayedMonthYear = useMemo(() => {
    if (weekDays.length === 0) return 'September 2026';
    const first = weekDays[0];
    const last = weekDays[weekDays.length - 1];
    if (first.monthName === last.monthName) {
      return `${first.monthName} ${first.year}`;
    }
    return `${first.monthShort} – ${last.monthShort} ${last.year}`;
  }, [weekDays]);

  const [selectedDate, setSelectedDate] = useState<DayItem>(weekDays[0]);
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');

  // Synchronize selected date when switching weeks
  useEffect(() => {
    if (weekDays.length > 0) {
      const match = weekDays.find((d) => d.dateString === selectedDate?.dateString);
      if (!match) {
        const firstAvailable = weekDays.find((d) => !d.isPast) || weekDays[0];
        setSelectedDate(firstAvailable);
      }
    }
  }, [weekDays, selectedDate]);

  // Adjust selected time if current selection is booked for the day
  useEffect(() => {
    if (!selectedDate) return;
    const bookedForDay = bookedMap[selectedDate.dateString] || [];
    if (bookedForDay.includes(selectedTime)) {
      const nextFree = TIME_SLOTS.find((s) => !bookedForDay.includes(s));
      if (nextFree) setSelectedTime(nextFree);
    }
  }, [selectedDate, bookedMap, selectedTime]);

  // Springy Physics Drag Hook for Days Strip
  const useSpringDragScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const animId = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      isDown.current = true;
      startX.current = e.pageX - containerRef.current.offsetLeft;
      scrollLeft.current = containerRef.current.scrollLeft;
      velocity.current = 0;
      lastX.current = e.pageX;
      lastTime.current = performance.now();
      if (animId.current) cancelAnimationFrame(animId.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDown.current || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.2;
      containerRef.current.scrollLeft = scrollLeft.current - walk;

      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        velocity.current = (e.pageX - lastX.current) / dt;
      }
      lastX.current = e.pageX;
      lastTime.current = now;
    };

    const handleMouseUp = () => {
      if (!isDown.current || !containerRef.current) return;
      isDown.current = false;

      let v = velocity.current * 14;
      const friction = 0.92;
      const step = () => {
        if (!containerRef.current || Math.abs(v) < 0.25) return;
        containerRef.current.scrollLeft -= v;
        v *= friction;
        animId.current = requestAnimationFrame(step);
      };
      animId.current = requestAnimationFrame(step);
    };

    return {
      ref: containerRef,
      props: {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
      },
    };
  };

  const daysDrag = useSpringDragScroll();

  // Generate .ics calendar download
  const handleDownloadIcs = () => {
    if (!selectedDate) return;
    const [year, month, day] = selectedDate.dateString.split('-').map(Number);
    const isPM = selectedTime.includes('PM');
    const [timePart] = selectedTime.split(' ');
    const [rawH, rawM] = timePart.split(':').map(Number);
    let hours = rawH;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const startDate = new Date(Date.UTC(year, month - 1, day, hours, rawM));
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000);

    const formatIcs = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vixcee Studios//Booking Consultation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:vixcee-booking-${Date.now()}@vixceestudios.com`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(startDate)}`,
      `DTEND:${formatIcs(endDate)}`,
      'SUMMARY:Vixcee Studios • 15-Minute Strategy Consultation',
      `DESCRIPTION:High-velocity sprint architecture consultation.\\n\\nGoogle Meet Link: ${GOOGLE_MEET_URL}`,
      `LOCATION:${GOOGLE_MEET_URL}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vixcee-Studios-Consultation-${selectedDate.dateString}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Submit Handler: Saves to Firestore & Dispatches Email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!phoneNational.trim()) {
      setErrorMsg('Please enter your phone number for text notifications');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dial} ${phoneNational.trim()}`;

    // Double booking guard
    const bookedForDay = bookedMap[selectedDate.dateString] || [];
    if (bookedForDay.includes(selectedTime)) {
      setErrorMsg('This time slot was just reserved. Please select another slot.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // 1. Store all intake fields in Firestore
      await addDoc(collection(db, 'bookings'), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhoneNumber,
        countryCode: selectedCountry.code,
        countryDial: selectedCountry.dial,
        location: location.trim(),
        meetUrl: GOOGLE_MEET_URL,
        guests: guests.trim(),
        currentWebsite: currentWebsite.trim(),
        projectNotes: projectNotes.trim(),
        foreseenChallenges: foreseenChallenges.trim(),
        estimatedBudget: estimatedBudget || '',
        additionalInterests: additionalInterests || [],
        date: selectedDate.dateString,
        dayLabel: selectedDate.dayFull,
        formattedDate: selectedDate.formattedDate,
        timeSlot: selectedTime,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });

      // 2. Trigger automated personalized email via Resend server endpoint
      try {
        await fetch('/api/send-booking-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: fullPhoneNumber,
            location: location.trim(),
            meetUrl: GOOGLE_MEET_URL,
            guests: guests.trim(),
            currentWebsite: currentWebsite.trim(),
            date: `${selectedDate.dayFull}, ${selectedDate.formattedDate}`,
            timeSlot: selectedTime,
            projectNotes: projectNotes.trim(),
            foreseenChallenges: foreseenChallenges.trim(),
            estimatedBudget: estimatedBudget || '',
            additionalInterests: additionalInterests || [],
          }),
        });
      } catch (emailErr) {
        console.warn('[Email Dispatch Warning]', emailErr);
      }

      setIsSubmitting(false);
      setIsConfirmed(true);
    } catch (err: any) {
      console.error('[Booking Error]', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Unable to confirm appointment. Please try again.');
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setName('');
    setEmail('');
    setPhoneNational('');
    setGuests('');
    setShowGuests(false);
    setCurrentWebsite('');
    setProjectNotes('');
    setForeseenChallenges('');
    setEstimatedBudget('');
    setAdditionalInterests([]);
    setErrorMsg('');
  };

  return (
    <section
      ref={sectionRef}
      id="book-call"
      className="relative w-full bg-[#000000] text-white pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 overflow-hidden select-none isolate"
      aria-label="Book a call with Vixcee Studios"
    >
      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN CONTENT GRID                                 */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Clean Unboxed Text with Animated Symbol & Hero H2 */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col justify-start text-left py-2 sm:py-6 lg:sticky lg:top-28">
            
            {/* Animated SVG Symbol */}
            <ScrollReveal delay={0}>
              <div className="mb-6 sm:mb-8 flex items-center">
                <img
                  src="https://res.cloudinary.com/divndlntm/image/upload/v1790414220/vixceestudios_symbol_reveal_01a0cf05-642a-74af-b172-cc2054f40851_u7e4sz.svg"
                  alt="Vixcee Studios Symbol"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            </ScrollReveal>

            {/* Exact Hero H2 Headline with Interchanging VerticalTextRoller */}
            <WordLensReveal
              as="h2"
              delay={80}
              stagger={75}
              className="text-[28px] sm:text-4xl md:text-5xl lg:text-[56px] font-light tracking-[-0.015em] leading-[1.14] md:leading-[1.08] text-white text-balance [word-spacing:0.08em] select-none"
              words={[
                'Your',
                <VerticalTextRoller key="roller" words={['sites', 'tools', 'apps']} />,
                'live',
                'in',
                'days,',
                'not',
                'weeks',
              ]}
            />

            {/* Clean Subtitle */}
            <ScrollReveal delay={180}>
              <p className="mt-5 text-[13px] sm:text-base md:text-[18px] text-white/70 font-light leading-relaxed max-w-lg">
                Direct engineer consultation. We map out your site architecture, mobile interactions, and timeline in 15 minutes.
              </p>
            </ScrollReveal>

            {/* Quick Meeting Overview - Clean Monochrome without colored dots */}
            <ScrollReveal delay={240}>
              <div className="mt-8 flex flex-col gap-2.5 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <span className="text-white/40">&bull;</span>
                  <span>15-Minute High-Velocity Sprint Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">&bull;</span>
                  <span>Google Meet video link provided immediately</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Linear Double-Wall Obsidian Glass Form         */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 glass-refraction-panel rounded-3xl p-6 sm:p-8 lg:p-9 flex flex-col justify-center relative transform-gpu will-change-[backdrop-filter]">
            
            {isConfirmed ? (
              /* Success / Confirmed State with Live Meet Link & Calendar CTA */
              <div className="text-center py-8 px-4 animate-fade-in flex flex-col items-center">
                
                {/* Monochrome Minimal Check Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                  <Check className="w-6 h-6 stroke-[1.5]" />
                </div>

                <h3 className="font-light tracking-[-0.015em] text-white text-2xl sm:text-3xl leading-snug">
                  You’re on the calendar.
                </h3>
                <p className="mt-3 text-sm sm:text-base text-white/70 max-w-md mx-auto font-light leading-relaxed">
                  We’ve reserved{' '}
                  <span className="text-white font-medium">
                    {selectedDate.dayFull} ({selectedDate.formattedDate}) at {selectedTime}
                  </span>{' '}
                  via <span className="text-white font-medium">Google Meet</span> for <span className="text-white font-medium">{name}</span>.
                </p>

                {/* Instant Google Meet Join Card */}
                <div className="mt-6 w-full max-w-md p-4 rounded-xl bg-white/[0.04] border border-white/15 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <OfficialGoogleMeetIcon className="w-6 h-6 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider font-mono">Google Meet Room</p>
                      <p className="text-sm font-medium text-white select-all">{GOOGLE_MEET_URL}</p>
                    </div>
                  </div>
                  <a
                    href={GOOGLE_MEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    <span>Join Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Download .ics Button */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-white/70" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-lg text-white/60 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Book Another Call
                  </button>
                </div>

              </div>
            ) : (
              /* Complete Intake Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 text-left">
                
                {/* Section Header */}
                <div className="pb-1 border-b border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/50 font-semibold font-mono">
                    Consultation Details
                  </span>
                  <span className="text-[11px] text-white/40 font-mono">
                    * Required fields
                  </span>
                </div>

                {/* 1. Name & Email (2-Column on sm+) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Your name * */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                      Your name <span className="text-white/40">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-11 px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                    />
                  </div>

                  {/* Email address * */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                      Email address <span className="text-white/40">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full h-11 px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 2. Location (Options: Google Meet - Authentic borderless Google Meet icon) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Location
                  </label>
                  <div className="flex items-center gap-3 h-11 px-3.5 rounded-[4px] bg-white/[0.06] border border-white/20 text-white text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)]">
                    <OfficialGoogleMeetIcon className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-white/95">Google Meet</span>
                    <span className="ml-auto text-[11px] text-white/40 font-mono">Video call link provided</span>
                  </div>
                </div>

                {/* 3. Phone number (Text notifications) * with International Country Picker */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Phone number (Text notifications) <span className="text-white/40">*</span>
                  </label>

                  <div className="relative flex items-center" ref={countryPickerRef}>
                    {/* Country Code Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCountryPickerOpen((prev) => !prev)}
                      className="h-11 px-3 rounded-l-[4px] bg-white/[0.08] border-y border-l border-white/20 text-white text-xs font-mono flex items-center gap-1.5 hover:bg-white/[0.12] transition-colors cursor-pointer select-none shrink-0"
                      aria-label="Select country code"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <span className="font-medium">{selectedCountry.dial}</span>
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>

                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      required
                      value={phoneNational}
                      onChange={(e) => setPhoneNational(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="flex-1 h-11 px-4 rounded-r-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                    />

                    {/* Country Picker Dropdown Panel */}
                    {isCountryPickerOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-72 max-h-64 overflow-y-auto rounded-xl bg-[#141418] border border-white/15 shadow-2xl z-50 p-2 scrollbar-thin scrollbar-thumb-white/20 animate-in fade-in zoom-in-95 duration-150">
                        {/* Search Input */}
                        <div className="sticky top-0 bg-[#141418] pb-1.5 z-10">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country or code..."
                            className="w-full h-8 px-2.5 rounded bg-white/[0.07] border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-white/30"
                            autoFocus
                          />
                        </div>

                        {/* Country Options List */}
                        <div className="space-y-0.5 mt-1">
                          {filteredCountries.map((c) => {
                            const isSelected = selectedCountry.code === c.code;
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setIsCountryPickerOpen(false);
                                  setCountrySearch('');
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${
                                  isSelected
                                    ? 'bg-white text-black font-semibold'
                                    : 'text-white/80 hover:bg-white/[0.08] hover:text-white'
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span>{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <span className="font-mono text-[11px] opacity-70 shrink-0 ml-2">
                                  {c.dial}
                                </span>
                              </button>
                            );
                          })}
                          {filteredCountries.length === 0 && (
                            <p className="text-xs text-white/40 text-center py-3">No country found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-1.5 text-[11px] text-white/45 leading-relaxed">
                    By entering your phone number you consent to receive SMS messages for this event. SMS rates may apply.
                  </p>
                </div>

                {/* 4. Add guests & Current website (if redesign) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Add guests */}
                  <div>
                    {!showGuests ? (
                      <button
                        type="button"
                        onClick={() => setShowGuests(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer py-2"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-white/60" />
                        <span className="underline underline-offset-4 decoration-white/30">Add guests</span>
                      </button>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs uppercase tracking-wider text-white/90 font-medium">
                            Add guests
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setShowGuests(false);
                              setGuests('');
                            }}
                            className="text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          placeholder="guest@company.com"
                          className="w-full h-11 px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* Current website (if redesign) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                      Current website (if redesign)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentWebsite}
                        onChange={(e) => setCurrentWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full h-11 pl-9 pr-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                      />
                      <Globe className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 5. CALENDAR RIBBON & TIME SLOT MATRIX */}
                <div className="pt-2">
                  {/* Unified Month Header with Inline Week Stepper */}
                  <div className="flex items-center justify-between mb-2.5 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-white/90 font-medium">
                        Schedule Date &bull; {displayedMonthYear}
                      </span>
                      {weekOffset > 0 && (
                        <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-white/[0.06] border border-white/10">
                          +{weekOffset} {weekOffset === 1 ? 'wk' : 'wks'}
                        </span>
                      )}
                    </div>

                    {/* Minimalist Prev / Next Week Stepper Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={weekOffset === 0}
                        onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-[4px] bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
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
                        className="w-7 h-7 rounded-[4px] bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                        aria-label="Next week"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Weekly Day Strip (Monday - Saturday) with Touch/Mouse Drag */}
                  <div className="relative mb-3">
                    <div
                      ref={daysDrag.ref}
                      {...daysDrag.props}
                      className="grid grid-cols-6 gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-0.5 cursor-grab active:cursor-grabbing select-none"
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
                            className={`py-2 px-1 rounded-[4px] flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
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
                              className={`text-sm sm:text-base font-semibold mt-1 leading-none ${
                                isSelected ? 'text-black' : 'text-white'
                              }`}
                            >
                              {day.dayNum}
                            </span>
                            {isFullyBooked && (
                              <span className="text-[8px] uppercase tracking-tighter text-white/40 mt-1">
                                Full
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instant Time Slot Grid (2x3 Matrix - All Slots Visible in 1 View) */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-white/70 font-medium">
                        Select Time &bull; {selectedDate?.dayShort}, {selectedDate?.formattedDate}
                      </span>
                      <span className="text-[11px] text-white/40 font-mono">
                        15-min call
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTime === slot;
                        const bookedForDay = bookedMap[selectedDate?.dateString] || [];
                        const isBooked = bookedForDay.includes(slot);

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => {
                              if (!isBooked) setSelectedTime(slot);
                            }}
                            className={`py-2.5 px-2 text-center rounded-[4px] text-xs font-mono transition-all duration-150 active:scale-95 ${
                              isBooked
                                ? 'opacity-30 cursor-not-allowed bg-white/[0.02] border border-white/5 line-through'
                                : isSelected
                                ? 'bg-white text-black font-bold border border-white'
                                : 'glass-refraction-chip text-white/85 hover:text-white'
                            }`}
                          >
                            <span>{slot}</span>
                            {isBooked && (
                              <span className="block text-[9px] text-white/40 leading-tight">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 6. Estimated budget (web) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
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
                          className={`py-2 px-2 text-center rounded-[4px] text-xs font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
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

                {/* 7. I'm also interested in (Options: Branding, Strategy, Communication) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    I'm also interested in
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                          className={`py-1.5 px-3 rounded-[4px] text-xs font-medium transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
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

                {/* 8. Tell us about your project */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Tell us about your project
                  </label>
                  <textarea
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Please share anything that will help prepare for our meeting."
                    className="w-full px-4 py-2.5 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200 resize-none"
                  />
                </div>

                {/* 9. Are there any challenges you foresee? */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Are there any challenges you foresee?
                  </label>
                  <input
                    type="text"
                    value={foreseenChallenges}
                    onChange={(e) => setForeseenChallenges(e.target.value)}
                    placeholder="e.g. Tight deadline, custom integrations, design migration..."
                    className="w-full h-11 px-4 rounded-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-[4px] bg-white/[0.08] border border-white/20 text-white text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* 10. Clean White Confirm Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-[4px] bg-white text-black font-semibold text-sm tracking-wide transition-all duration-150 hover:bg-white/90 active:scale-[0.98] border border-white cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Confirming 15-Min Call...</span>
                      </span>
                    ) : (
                      <span>Confirm 15-Min Call &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* ACTIVELY ANIMATING EMBER HORIZON GLOW FLOW (Zero-Lag Shaders) */}
      {/* ============================================================ */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[320px] sm:h-[400px] overflow-hidden select-none"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 75%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 75%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {/* Animated Moving Radiant Glow Layer 1 (Amber Gold Core) */}
        <div
          className="absolute -bottom-10 left-1/2 w-[110%] sm:w-[90%] h-[320px] rounded-full animate-ember-drift-1"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(252, 128, 0, 0.70) 0%, rgba(240, 78, 35, 0.45) 30%, rgba(180, 35, 10, 0.18) 60%, transparent 85%)',
          }}
        />

        {/* Animated Moving Radiant Glow Layer 2 (Crimson Coral Cross Drift) */}
        <div
          className="absolute -bottom-16 left-1/2 w-[100%] sm:w-[85%] h-[300px] rounded-full animate-ember-drift-2"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 100%, rgba(255, 60, 20, 0.65) 0%, rgba(254, 94, 80, 0.35) 35%, transparent 75%)',
          }}
        />

        {/* Dynamic Continuous Fluid Horizon Mesh Wave */}
        <div
          className="w-full h-full animate-ember-flow"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 100%, rgba(252, 128, 0, 0.55) 0%, rgba(240, 78, 35, 0.38) 30%, rgba(220, 45, 10, 0.20) 60%, transparent 90%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.1) 75%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.1) 75%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
};
