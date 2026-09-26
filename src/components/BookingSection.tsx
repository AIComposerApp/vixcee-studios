import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VerticalTextRoller } from './VerticalTextRoller.tsx';
import { db, auth } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export const BookingSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Section ref
  const sectionRef = useRef<HTMLElement>(null);

  // Cal.com / Linear style active week offset (0 = current upcoming week, 1 = next week, etc.)
  const [weekOffset, setWeekOffset] = useState(0);

  // Firestore real-time booked appointments lookup: { "YYYY-MM-DD": ["11:30 AM", "03:00 PM"] }
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({});

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

    // Compute the starting Monday for the week
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    // If today is Sunday, shift to tomorrow (Monday). Otherwise, align to Monday of the current week.
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

  // Unified Month & Year Display (e.g., "September 2026" or "Sep – Oct 2026")
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
        // Find first non-past day
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
      const firstAvailable = TIME_SLOTS.find((s) => !bookedForDay.includes(s));
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [selectedDate, bookedMap, selectedTime]);

  // --------------------------------------------------------------------------
  // HOLD-AND-DRAG HOOK WITH SPRING VELOCITY DAMPING
  // --------------------------------------------------------------------------
  const useSpringDragScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const animId = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      isDown.current = true;
      startX.current = e.pageX - containerRef.current.offsetLeft;
      scrollStart.current = containerRef.current.scrollLeft;
      lastX.current = e.pageX;
      lastTime.current = performance.now();
      velocity.current = 0;
      if (animId.current) cancelAnimationFrame(animId.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDown.current || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = x - startX.current;
      containerRef.current.scrollLeft = scrollStart.current - walk;

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

      // Springy momentum damping (gentle decay)
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

  // Submit Handler: Saves to Firestore & Sends Resend Email
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

    // Double booking guard
    const bookedForDay = bookedMap[selectedDate.dateString] || [];
    if (bookedForDay.includes(selectedTime)) {
      setErrorMsg('This time slot was just reserved. Please select another slot.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // 1. Store in Firestore
      await addDoc(collection(db, 'bookings'), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        date: selectedDate.dateString,
        dayLabel: selectedDate.dayFull,
        formattedDate: selectedDate.formattedDate,
        timeSlot: selectedTime,
        projectNotes: projectNotes.trim() || '',
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
            date: `${selectedDate.dayFull}, ${selectedDate.formattedDate}`,
            timeSlot: selectedTime,
            projectNotes: projectNotes.trim(),
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
    setProjectNotes('');
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Clean Unboxed Text with Animated Symbol & Hero H2 */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left py-2 sm:py-6 lg:pr-6">
            
            {/* Animated SVG Symbol */}
            <div className="mb-6 sm:mb-8 flex items-center">
              <img
                src="https://res.cloudinary.com/divndlntm/image/upload/v1790414220/vixceestudios_symbol_reveal_01a0cf05-642a-74af-b172-cc2054f40851_u7e4sz.svg"
                alt="Vixcee Studios Symbol"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain select-none pointer-events-none"
                loading="eager"
              />
            </div>

            {/* Exact Hero H2 Headline with Interchanging VerticalTextRoller */}
            <h2 className="font-light tracking-[-0.015em] text-white leading-[1.08] text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[54px] select-none [word-spacing:0.08em]">
              Your{' '}
              <VerticalTextRoller words={['sites', 'tools', 'apps']} />{' '}
              live in days, not weeks
            </h2>

            {/* Clean Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-lg">
              Direct engineer consultation. We map out your site architecture, mobile interactions, and timeline in 15 minutes.
            </p>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Cal.com / Linear Style Glass Form              */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 glass-refraction-panel rounded-3xl p-7 sm:p-9 lg:p-10 flex flex-col justify-center relative transform-gpu will-change-[backdrop-filter]">
            
            {isConfirmed ? (
              /* Success / Confirmed State */
              <div className="text-center py-10 px-4 animate-fade-in">
                <h3 className="font-light tracking-[-0.015em] text-white text-2xl sm:text-3xl leading-snug">
                  You’re on the calendar.
                </h3>
                <p className="mt-3 text-sm sm:text-base text-white/70 max-w-sm mx-auto font-light leading-relaxed">
                  We’ve reserved{' '}
                  <span className="text-white font-medium">
                    {selectedDate.dayFull} ({selectedDate.formattedDate}) at {selectedTime}
                  </span>{' '}
                  for <span className="text-white font-medium">{name}</span>. A calendar invitation & confirmation email have been sent to{' '}
                  <span className="text-white font-medium">{email}</span>.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-8 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-white/90 active:scale-[0.98] cursor-pointer"
                >
                  Book Another Call
                </button>
              </div>
            ) : (
              /* Streamlined Cal.com-Style Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                
                {/* 1. Name Input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                  />
                </div>

                {/* 2. Email Input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Work or Personal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
                  />
                </div>

                {/* 3. CAL.COM / LINEAR STYLE CALENDAR RIBBON & SLOT MATRIX */}
                <div>
                  {/* Unified Month Header with Inline Week Stepper */}
                  <div className="flex items-center justify-between mb-2.5 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tracking-wide text-white">
                        {displayedMonthYear}
                      </span>
                      {weekOffset > 0 && (
                        <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
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
                        className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
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
                        className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
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
                            className={`py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
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
                              <span className="text-[8px] uppercase tracking-tighter text-red-300 mt-1">
                                Full
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instant Time Slot Grid (2x3 Matrix - All Slots Visible in 1 View) */}
                  <div className="mt-3">
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
                            className={`py-2.5 px-2 text-center rounded-xl text-xs font-mono transition-all duration-150 active:scale-95 ${
                              isBooked
                                ? 'opacity-30 cursor-not-allowed bg-white/[0.02] border border-white/5 line-through'
                                : isSelected
                                ? 'bg-white text-black font-bold border border-white'
                                : 'glass-refraction-chip text-white/85 hover:text-white'
                            }`}
                          >
                            <span>{slot}</span>
                            {isBooked && (
                              <span className="block text-[9px] text-red-300 leading-tight">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Project Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/90 font-medium mb-1.5">
                    Project Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Briefly describe what you're building..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* 5. Clean White Confirm Button (Zero Glow) */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-white text-black font-semibold text-sm tracking-wide transition-all duration-150 hover:bg-white/90 active:scale-[0.98] border border-white cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Saving to calendar & sending confirmation...
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
