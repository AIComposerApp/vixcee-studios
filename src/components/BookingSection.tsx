import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, auth } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  CountryCode,
  COUNTRY_CODES,
  GOOGLE_MEET_URL,
} from './booking/types.ts';
import { BookingConfirmation } from './booking/BookingConfirmation.tsx';
import { BookingHeroInfo } from './booking/BookingHeroInfo.tsx';
import { StepWizardNav } from './booking/StepWizardNav.tsx';
import { StepContact } from './booking/StepContact.tsx';
import { StepProject } from './booking/StepProject.tsx';
import { StepSchedule } from './booking/StepSchedule.tsx';
import { useBookingSchedule } from './booking/useBookingSchedule.ts';

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

  const {
    weekOffset,
    setWeekOffset,
    weekDays,
    displayedMonthYear,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    daysDrag,
  } = useBookingSchedule();

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
          <BookingHeroInfo />

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
                <StepWizardNav
                  currentStep={currentStep}
                  onSelectStep={(step) => setCurrentStep(step as 1 | 2 | 3)}
                  canAdvanceToStep={() => validateStep1()}
                />

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
