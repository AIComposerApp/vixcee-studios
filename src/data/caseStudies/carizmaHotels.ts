import type { CaseStudy } from './types.ts';

export const carizmaHotels: CaseStudy = {
  id: 'carizma-hotels',
  slug: 'carizma-hotels',
  title: 'Carizma Hotels',
  subtitle: 'Designing a smarter front desk for modern hotel operations.',
  tagline: "A hotel doesn't run on its website. It runs behind the front desk.",
  services: ['Product Design', 'UI/UX', 'Web App', 'Development'],
  industry: 'Hospitality / Hotel Operations',
  platform: 'Web Application',
  role: 'Design & Development',
  year: '2025',
  videoUrl: 'https://player.cloudinary.com/embed/?cloud_name=divndlntm&public_id=carizma_hotels_case_studies_1_abfvo7',
  imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_800/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
  shortSummary: 'A centralized Front Desk & Operations Terminal for a multi-location luxury hotel chain to manage inventory, walk-ins, and multi-channel bookings with zero friction.',
  clientQuote: {
    quote: "The operations terminal transformed our everyday front-desk speed. Checking in walk-ins and managing reservations went from minutes of confusion to under 60 seconds.",
    author: "Adewale O.",
    role: "Operations Director, Carizma Luxury Hotels",
  },
  metrics: [
    { label: 'Check-In Speed', value: '<60s' },
    { label: 'Branch Visibility', value: '100%' },
    { label: 'Booking Channels', value: 'Unified' },
    { label: 'Inventory Sync', value: 'Realtime' },
  ],
  overview: [
    'Carizma Hotels is a multi-location hotel operation with a growing need for a faster and more organized way to manage reservations, room inventory, and front-desk activity.',
    'The idea was to move everyday hotel operations into one centralized digital workspace — giving staff a clear view of what is available, what is reserved, and what needs attention.',
    'The result is a purpose-built Front Desk & Operations Terminal designed around the realities of hotel staff.',
  ],
  challenge: {
    intro: 'Hotel front desks deal with information from multiple sources every day: walk-in guests, WhatsApp bookings, reservations, payments, room availability, and different hotel branches. When these processes are handled separately, information becomes fragmented.',
    points: [
      'Give staff an immediate view of room inventory across all tiers',
      'Make walk-in reservations fast to create in high-pressure situations',
      'Keep bookings organized across multiple branches (Ikeja GRA, Abule-Egba, Oshodi)',
      'Separate reservation statuses clearly to prevent double-bookings',
      'Support different booking channels (Walk-in vs. WhatsApp)',
      'Make frequently used actions easy to access with minimal clicks',
      'Feel operational and efficient without becoming visually overwhelming',
    ],
    summary: 'The goal was to create one operational interface where staff could quickly understand the state of the property and act without jumping between systems.',
  },
  direction: {
    title: 'Digital Control Center for the Front Desk',
    description: [
      'Rather than trying to make the interface look like a consumer-facing hotel website, the focus was on speed, clarity, and information density.',
      'The most important operational information is always close at hand, structured around the exact sequence of questions front-desk personnel answer every day.',
    ],
    questions: [
      'What rooms are available?',
      "What's already reserved?",
      'Who is checking in?',
      'Where did the booking come from?',
      'What needs attention?',
    ],
  },
  experience: {
    title: 'The Operational Terminal',
    intro: 'Engineered specifically for operational efficiency, rapid walk-in entry, and real-time multi-branch synchronization.',
    sections: [
      {
        heading: 'The Live Dashboard',
        body: 'The main dashboard divides inventory into clear statuses: Available, Reserved / Pending, and Currently Occupied. Staff understand property state at a glance with an integrated branch selector for the growing hotel network.',
      },
      {
        heading: 'Making Walk-In Bookings Faster',
        body: 'Staff can select a branch, enter guest info, choose dates, specify guest count, select channel (Walk-in vs. WhatsApp), add notes, and assign a room in a single lightning-fast flow.',
      },
      {
        heading: 'One Place for Every Reservation',
        body: 'The Reservations Registry acts as the operational history. Staff filter reservations by Branch, Status, and Booking Source with explicit states: Confirmed, Pending, Awaiting Payment, Completed, and Cancelled.',
      },
      {
        heading: 'Designed for Multi-Location Operations',
        body: 'The interface is built to scale across branches including Ikeja GRA, Abule-Egba, and Oshodi, giving headquarters centralized visibility while empowering branch staff.',
      },
    ],
  },
  visualLanguage: {
    title: 'Visual Direction & Interface Mechanics',
    intro: 'A compact, status-driven interface balancing luxury hospitality brand identity with ruthless operational utility.',
    items: [
      { label: 'Clear Information Hierarchy', text: 'Important guest and room data identified in split seconds.' },
      { label: 'Compact Operational Layouts', text: 'Designed around frequent clicks rather than decorative fluff.' },
      { label: 'Status-Driven UI', text: 'Room availability and reservation states immediately recognizable.' },
      { label: 'Structured Forms', text: 'Predictable workflows preventing errors during busy check-in hours.' },
      { label: 'Dark Premium Palette', text: 'Connecting the tool back to the luxury positioning of Carizma Hotels.' },
    ],
  },
  result: {
    title: 'The Result',
    paragraphs: [
      'The final product brings inventory, reservations, walk-ins, booking channels, and multi-branch operations into one centralized workspace.',
      'Instead of designing another hotel website focused primarily on guests, the project focuses on the people behind the hotel — giving front-desk staff the tools they need to manage the operation more efficiently.',
    ],
    quote: "A hotel doesn't run on its website. It runs behind the front desk.",
  },
  keyFeatures: [
    { title: 'Instant Room Matrix', description: 'Real-time color-coded availability across standard, deluxe, and executive suites.' },
    { title: 'Sub-60s Walk-in Entry', description: 'Streamlined intake workflow cutting reservation creation time by over 70%.' },
    { title: 'WhatsApp Channel Attribution', description: 'Direct tracking and classification for bookings originating via messaging.' },
    { title: 'Multi-Branch Switcher', description: 'Instant context toggle between Ikeja GRA, Abule-Egba, and Oshodi properties.' },
    { title: 'Unified Registry', description: 'Comprehensive audit trail with instant search, filtering, and status updates.' },
  ],
  takeaway: {
    heading: 'The Takeaway',
    text: 'Great product design in hospitality happens behind the scenes. By removing friction from front-desk staff workflows, guest satisfaction increases naturally.',
    quote: "A hotel doesn't run on its website. It runs behind the front desk.",
  },
};
