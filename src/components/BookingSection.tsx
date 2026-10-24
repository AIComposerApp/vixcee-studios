import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { VerticalTextRoller } from './VerticalTextRoller.tsx';
import { WordLensReveal } from './motion/WordLensReveal.tsx';
import { db, auth } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  DayItem,
  CountryCode,
  COUNTRY_CODES,
  GOOGLE_MEET_URL,
} from './booking/types.ts';
import { BookingConfirmation } from './booking/BookingConfirmation.tsx';
import { StepContact } from './booking/StepContact.tsx';
import { StepProject } from './booking/StepProject.tsx';
import { StepSchedule } from './booking/StepSchedule.tsx';

const bookingLeftTransition = {
  duration: 3.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

const bookingRightTransition = {
  duration: 2.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const BookingSection: React.FC = () => {
  // Required & Intake Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location] = useState('Google Meet');

  // Country code selector state
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneNational, setPhoneNational] = useState('');

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

  // Meeting resolution states
  const [confirmedMeetUrl, setConfirmedMeetUrl] = useState(GOOGLE_MEET_URL);

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

  const [selectedDate, setSelectedDate] = useState<DayItem | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Synchronize selected date when switching weeks or mounting
  useEffect(() => {
    if (weekDays.length > 0) {
      const match = weekDays.find((d) => d.dateString === selectedDate?.dateString);
      if (!match) {
        const firstAvailable = weekDays.find((d) => !d.isPast) || weekDays[0];
        setSelectedDate(firstAvailable);
      }
    }
  }, [weekDays, selectedDate]);

  // Springy Physics Drag Hook for Days Strip
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

  const daysDrag = {
    ref: containerRef,
    props: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };

  // 3-Step Wizard Navigation State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const validateStep1 = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }
    if (!phoneNational.trim()) {
      setErrorMsg('Please enter your phone number for text notifications');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextFromStep2 = () => {
    setErrorMsg('');
    setCurrentStep(3);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1));
  };

  // Submit Handler: Saves to Firestore & Dispatches Email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (currentStep !== 3) {
      setCurrentStep(3);
      return;
    }

    if (!selectedDate) {
      setErrorMsg('Please select a date for your call.');
      return;
    }

    if (!selectedTime) {
      setErrorMsg('Please select a convenient time slot.');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dial} ${phoneNational.trim()}`;

    // Double booking guard
    const bookedForDay = bookedMap[selectedDate.dateString] || [];
    if (bookedForDay.includes(selectedTime)) {
      setErrorMsg('This time slot is no longer available. Please select another slot.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    let finalMeetUrl = GOOGLE_MEET_URL;
    let finalCalendarLink: string | null = null;
    let finalEventId: string | null = null;

    try {
      const meetRes = await fetch('/api/create-calendar-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: fullPhoneNumber,
          dateString: selectedDate.dateString,
          timeSlot: selectedTime,
          projectNotes: projectNotes.trim(),
          foreseenChallenges: foreseenChallenges.trim(),
          estimatedBudget: estimatedBudget || '',
          additionalInterests: additionalInterests || [],
          currentWebsite: currentWebsite.trim(),
        }),
      });

      if (meetRes.ok) {
        const meetData = await meetRes.json();
        if (meetData.meetUrl) finalMeetUrl = meetData.meetUrl;
        if (meetData.calendarHtmlLink) finalCalendarLink = meetData.calendarHtmlLink;
        if (meetData.calendarEventId) finalEventId = meetData.calendarEventId;
      }
    } catch (backendMeetErr) {
      console.warn('[Backend Meeting Creation Note]', backendMeetErr);
    }

    setConfirmedMeetUrl(finalMeetUrl);

    try {
      // 1. Store all intake fields in Firestore
      await addDoc(collection(db, 'bookings'), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhoneNumber,
        countryCode: selectedCountry.code,
        countryDial: selectedCountry.dial,
        location: location.trim(),
        meetUrl: finalMeetUrl,
        calendarLink: finalCalendarLink || '',
        calendarEventId: finalEventId || '',
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
            meetUrl: finalMeetUrl,
            calendarLink: finalCalendarLink || '',
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
    setCurrentStep(1);
    setSelectedTime('');
    setSelectedDate(null);
    setConfirmedMeetUrl(GOOGLE_MEET_URL);
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
      id="book-call"
      className="relative w-full bg-[#000000] text-white pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 overflow-visible select-none isolate"
      aria-label="Book a call with Vixcee Studios"
    >
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Clean Unboxed Text with Animated Symbol & Hero H2 */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-start text-left py-2 sm:py-6"
            initial={{ opacity: 0, y: 64 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={bookingLeftTransition}
          >
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
            <WordLensReveal
              as="h2"
              delay={0}
              stagger={60}
              immediate={true}
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
            <p className="mt-5 text-[13px] sm:text-base md:text-[18px] text-white/70 font-light leading-relaxed max-w-lg">
              Direct engineer consultation. We map out your site architecture, mobile interactions, and timeline in 15 minutes.
            </p>

            {/* Quick Meeting Overview */}
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
          </motion.div>

          {/* RIGHT COLUMN: Linear Double-Wall Obsidian Glass Form */}
          <motion.div
            className="lg:col-span-7 glass-refraction-panel rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 flex flex-col justify-start relative transform-gpu will-change-[backdrop-filter]"
            initial={{ opacity: 0, y: 72 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={bookingRightTransition}
          >
            {isConfirmed ? (
              <BookingConfirmation
                name={name}
                email={email}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                confirmedMeetUrl={confirmedMeetUrl}
                onReset={handleReset}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col text-left">
                {/* 3-Step Wizard Navigation Header with Linear Segmented Track */}
                <div className="pb-4 mb-4 border-b border-white/[0.08] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
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
                          if (validateStep1()) setCurrentStep(2);
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
                          if (validateStep1()) setCurrentStep(3);
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

                  {/* 3-Segment Linear Pill Progress Track */}
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

                {/* STEP 1: CONTACT */}
                {currentStep === 1 && (
                  <StepContact
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    phoneNational={phoneNational}
                    setPhoneNational={setPhoneNational}
                    showGuests={showGuests}
                    setShowGuests={setShowGuests}
                    guests={guests}
                    setGuests={setGuests}
                    currentWebsite={currentWebsite}
                    setCurrentWebsite={setCurrentWebsite}
                    errorMsg={errorMsg}
                    onNext={handleNextFromStep1}
                  />
                )}

                {/* STEP 2: PROJECT */}
                {currentStep === 2 && (
                  <StepProject
                    estimatedBudget={estimatedBudget}
                    setEstimatedBudget={setEstimatedBudget}
                    additionalInterests={additionalInterests}
                    setAdditionalInterests={setAdditionalInterests}
                    projectNotes={projectNotes}
                    setProjectNotes={setProjectNotes}
                    foreseenChallenges={foreseenChallenges}
                    setForeseenChallenges={setForeseenChallenges}
                    errorMsg={errorMsg}
                    onPrev={handlePrevStep}
                    onNext={handleNextFromStep2}
                  />
                )}

                {/* STEP 3: SCHEDULE */}
                {currentStep === 3 && (
                  <StepSchedule
                    displayedMonthYear={displayedMonthYear}
                    weekOffset={weekOffset}
                    setWeekOffset={setWeekOffset}
                    weekDays={weekDays}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    bookedMap={bookedMap}
                    daysDrag={daysDrag}
                    isSubmitting={isSubmitting}
                    errorMsg={errorMsg}
                    onPrev={handlePrevStep}
                  />
                )}
              </form>
            )}
          </motion.div>

        </div>
      </div>

      {/* ACTIVELY ANIMATING EMBER HORIZON GLOW FLOW */}
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
        <div
          className="absolute -bottom-10 left-1/2 w-[110%] sm:w-[90%] h-[320px] rounded-full animate-ember-drift-1"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(252, 128, 0, 0.70) 0%, rgba(240, 78, 35, 0.45) 30%, rgba(180, 35, 10, 0.18) 60%, transparent 85%)',
          }}
        />

        <div
          className="absolute -bottom-16 left-1/2 w-[100%] sm:w-[85%] h-[300px] rounded-full animate-ember-drift-2"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 100%, rgba(255, 60, 20, 0.65) 0%, rgba(254, 94, 80, 0.35) 35%, transparent 75%)',
          }}
        />

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
