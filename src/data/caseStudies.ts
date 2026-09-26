export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  services: string[];
  industry: string;
  platform: string;
  role: string;
  year: string;
  videoUrl: string;
  imageUrl: string;
  shortSummary: string;
  clientQuote?: {
    quote: string;
    author: string;
    role: string;
  };
  metrics?: { label: string; value: string }[];
  overview: string[];
  challenge: {
    intro: string;
    points: string[];
    summary: string;
  };
  direction: {
    title: string;
    description: string[];
    questions: string[];
  };
  experience: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
  };
  visualLanguage: {
    title: string;
    intro: string;
    items: { label: string; text: string }[];
  };
  result: {
    title: string;
    paragraphs: string[];
    quote?: string;
  };
  keyFeatures: { title: string; description: string }[];
  takeaway: {
    heading: string;
    text: string;
    quote: string;
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'prince-of-web3',
    slug: 'prince-of-web3',
    title: 'Prince of Web3',
    subtitle: 'Building a premium digital presence for a Web3 growth strategist.',
    tagline: 'Architecting the Future of Web3 Narratives.',
    services: ['Web Design', 'UI/UX', 'Brand Experience', 'Development'],
    industry: 'Web3 / Crypto / Blockchain',
    platform: 'Web',
    role: 'Design & Development',
    year: '2025',
    videoUrl: 'https://player.cloudinary.com/embed/?cloud_name=divndlntm&public_id=princeofweb3_case_studies_hgcunf',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
    shortSummary: 'A dark, immersive digital headquarters designed to communicate authority, expertise, and momentum for a high-profile Web3 marketing strategist and KOL.',
    clientQuote: {
      quote: "Vixcee Studios created a digital presence that feels as established and high-velocity as the network behind our name. The turnaround in days completely blew past our expectations.",
      author: "Prince",
      role: "Lead Strategist & KOL, Prince of Web3"
    },
    metrics: [
      { label: 'Audience Reach', value: '28K+' },
      { label: 'Campaigns Delivered', value: '50+' },
      { label: 'Ecosystem Experience', value: '4+ Yrs' },
      { label: 'Delivery Turnaround', value: '5 Days' },
    ],
    overview: [
      'Prince of Web3 is a Web3 marketing strategist, KOL, community builder, and business development professional working across the fast-moving crypto ecosystem.',
      'The goal was simple: create a digital presence that felt as credible and established as the network behind the name.',
      'The result is a dark, immersive website designed to communicate authority, expertise, and momentum — while making a complex range of Web3 services easy to understand.',
    ],
    challenge: {
      intro: 'Web3 moves fast. Attention is fragmented, trust is difficult to earn, and a personal brand often has only a few seconds to establish credibility. Prince of Web3 already had the experience, network, and track record — including 50+ campaigns and a growing audience — but that story needed a stronger digital home.',
      points: [
        'Establish immediate credibility without relying on gimmicks',
        'Turn a personal brand into a recognizable professional identity',
        'Communicate a wide range of Web3 expertise without overwhelming visitors',
        'Showcase campaigns and results as proof of experience',
        'Make the path from discovery to consultation feel effortless',
        'Capture the energy of Web3 without falling into the usual crypto aesthetic',
      ],
      summary: 'The challenge was finding the balance between authority and personality, sophistication and energy, information and immersion.',
    },
    direction: {
      title: 'Digital Headquarters for a Web3 Strategist',
      description: [
        'Instead of building another predictable crypto website filled with gradients, coins, dashboards, and futuristic clichés, I approached the experience as a digital headquarters for a Web3 strategist.',
        'The visual language is intentionally dark and editorial. Large typography creates authority. Controlled motion adds energy. Glowing accents and abstract blockchain-inspired visuals introduce the Web3 context without allowing the technology to overpower the brand.',
      ],
      questions: [
        'Who is Prince?',
        'What does he do?',
        'Why should I trust him?',
        'What has he achieved?',
        'How can I work with him?',
      ],
    },
    experience: {
      title: 'The Experience Architecture',
      intro: 'A deliberate journey designed to move visitors from initial curiosity to high-intent conversations.',
      sections: [
        {
          heading: 'A Strong First Impression',
          body: 'The hero section immediately establishes the positioning: "Architecting the Future of Web3 Narratives." Rather than leading with a long explanation, the interface combines a bold statement with key credibility markers and clear actions.',
        },
        {
          heading: 'Turning Experience Into Proof',
          body: 'Instead of simply stating Prince understands Web3 marketing, the experience gives visitors tangible proof: 28K+ Followers, 50+ Successful Campaigns, and 4+ Years of Web3 Experience. Credibility is built directly into the interface.',
        },
        {
          heading: 'Making Complex Services Easy to Understand',
          body: 'KOL management, community building, AMAs, partnerships, and launch campaigns are unified under one clear growth engine — helping visitors understand not only what Prince offers, but how the pieces work together.',
        },
        {
          heading: 'Storytelling Through Case Studies',
          body: 'Previous campaigns are treated as more than portfolio thumbnails. Each project introduces a problem space, communicates the strategic role, and highlights measurable outcomes.',
        },
      ],
    },
    visualLanguage: {
      title: 'Visual Direction & Design System',
      intro: 'A bespoke editorial aesthetic sitting between a high-end strategy firm and a contemporary digital publication.',
      items: [
        { label: 'Dark Editorial Layouts', text: 'Creating a premium, focused environment for the strategic narrative.' },
        { label: 'Oversized Typography', text: 'Giving the brand confidence and making key statements impossible to miss.' },
        { label: 'Subtle Web3 Visuals', text: 'Abstract networks, light, depth, and digital textures without cliché tropes.' },
        { label: 'High-Contrast Interfaces', text: 'Calls-to-action and conversion points remain immediately accessible.' },
        { label: 'Controlled Motion', text: 'Kinetic cues reflecting the continuous momentum of the crypto landscape.' },
      ],
    },
    result: {
      title: 'The Result',
      paragraphs: [
        'The final experience gives Prince of Web3 a central digital platform for communicating his expertise, showcasing his work, and converting attention into conversations.',
        'It brings together personal branding, social proof, services, case studies, insights, partnerships, and conversion into one cohesive experience.',
        'More importantly, the website does not try to compete with the personality behind the brand — it gives that personality a stronger stage.',
      ],
      quote: 'Don\'t just participate in the Web3 narrative. Architect it.',
    },
    keyFeatures: [
      { title: 'Personal Brand Positioning', description: 'A clear identity built around Web3 strategy, growth, partnerships, and influence.' },
      { title: 'Conversion-Focused Structure', description: 'A deliberate journey from introduction to proof to consultation.' },
      { title: 'Services Architecture', description: 'A structured presentation of the different ways Prince works with Web3 projects.' },
      { title: 'Success Stories', description: 'Campaign-focused case studies designed to demonstrate tangible outcomes.' },
      { title: 'Social Proof', description: 'Testimonials, partnerships, audience metrics, and campaign results integrated throughout.' },
      { title: 'Insights Platform', description: 'A dedicated space for long-form Web3 analysis, strategy, and industry perspectives.' },
      { title: 'Responsive Velocity', description: 'Maintaining pristine clarity and micro-interactions across every device viewport.' },
    ],
    takeaway: {
      heading: 'The Takeaway',
      text: 'A personal brand doesn\'t need to look personal. It can feel like a company. It can feel like a publication. It can feel like a strategy firm. For Prince of Web3, the goal was to create something that could hold all three — while still feeling unmistakably human.',
      quote: 'Don\'t just participate in the Web3 narrative. Architect it.',
    },
  },
  {
    id: 'carizma-hotels',
    slug: 'carizma-hotels',
    title: 'Carizma Hotels',
    subtitle: 'Designing a smarter front desk for modern hotel operations.',
    tagline: 'A hotel doesn\'t run on its website. It runs behind the front desk.',
    services: ['Product Design', 'UI/UX', 'Web App', 'Development'],
    industry: 'Hospitality / Hotel Operations',
    platform: 'Web Application',
    role: 'Design & Development',
    year: '2025',
    videoUrl: 'https://player.cloudinary.com/embed/?cloud_name=divndlntm&public_id=carizma_hotels_case_studies_1_abfvo7',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
    shortSummary: 'A centralized Front Desk & Operations Terminal for a multi-location luxury hotel chain to manage inventory, walk-ins, and multi-channel bookings with zero friction.',
    clientQuote: {
      quote: "The operations terminal transformed our everyday front-desk speed. Checking in walk-ins and managing reservations went from minutes of confusion to under 60 seconds.",
      author: "Adewale O.",
      role: "Operations Director, Carizma Luxury Hotels"
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
        'What\'s already reserved?',
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
      quote: 'A hotel doesn\'t run on its website. It runs behind the front desk.',
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
      quote: 'A hotel doesn\'t run on its website. It runs behind the front desk.',
    },
  },
  {
    id: 'scribe',
    slug: 'scribe',
    title: 'Scribe',
    subtitle: 'Reimagining how people create, learn, and share knowledge with AI.',
    tagline: 'Make knowledge easier to understand, interact with, and remember.',
    services: ['Product Design', 'UI/UX', 'Web Design', 'Development'],
    industry: 'AI / EdTech',
    platform: 'Web',
    role: 'Design & Development',
    year: '2025',
    videoUrl: 'https://player.cloudinary.com/embed/?cloud_name=divndlntm&public_id=scribe_case_studies_1_hzceav',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_900/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
    shortSummary: 'A clean, editorial interface that combines structured learning modules, AI-powered generation, and effortless interactions to keep users focused on knowledge.',
    clientQuote: {
      quote: "By letting the content lead and hiding the technical complexity of AI, our learners stay completely immersed. The craft and speed from Vixcee was unmatched.",
      author: "Elena Rostova",
      role: "Head of Product, Scribe EdTech"
    },
    metrics: [
      { label: 'Cognitive Load', value: 'Minimized' },
      { label: 'AI Interaction', value: 'Seamless' },
      { label: 'Reading Focus', value: '100%' },
      { label: 'Build Sprint', value: '5 Days' },
    ],
    overview: [
      'Scribe is an AI-powered learning platform built around a simple idea: learning should feel less like consuming information and more like interacting with it.',
      'The challenge was to translate that idea into a digital experience that felt intelligent without feeling complicated.',
      'The result is a clean, editorial interface that combines structured content, AI-powered functionality, and subtle interactions into an experience designed to keep users focused on what matters — the knowledge itself.',
    ],
    challenge: {
      intro: 'AI products often have a familiar problem: they can be incredibly powerful, but the interfaces surrounding them tend to feel technical, crowded, or difficult to navigate. Scribe needed to communicate the possibilities of AI while remaining approachable enough for someone to understand the product almost immediately.',
      points: [
        'Explain the product without overwhelming the user',
        'Make AI feel approachable and humane rather than technical',
        'Create a clear, intuitive path through the learning platform',
        'Give content enough space and whitespace to breathe',
        'Build trust around a new AI product category',
        'Feel modern without relying on generic "AI" glowing purple aesthetics',
      ],
      summary: 'The goal wasn\'t simply to make Scribe look futuristic. It was to make it feel effortless.',
    },
    direction: {
      title: 'Let the Content Lead',
      description: [
        'The design direction started with one principle: Let the content lead.',
        'Instead of filling the interface with unnecessary visual effects, the experience uses typography, whitespace, hierarchy, and carefully placed interactions to create a sense of clarity.',
        'AI becomes part of the experience rather than the entire visual identity. The interface feels intelligent through the way information is organized and presented.',
      ],
      questions: [
        'How do people naturally absorb complex topics?',
        'How can AI clarify rather than clutter?',
        'What keeps a learner engaged over long sessions?',
        'How do we present AI outputs as trustworthy knowledge?',
      ],
    },
    experience: {
      title: 'The Learning Experience',
      intro: 'Structured around natural human comprehension, progressive disclosure, and invisible AI orchestration.',
      sections: [
        {
          heading: 'A Clear Introduction',
          body: 'The first interaction with Scribe is intentionally simple. The hero communicates what the product does while giving users an immediate reason to explore further, progressively introducing capabilities.',
        },
        {
          heading: 'Designed Around Learning',
          body: 'The interface is structured around how people naturally consume information: clear sections, strong typographic hierarchy, and visual breathing room create an experience closer to reading and exploration than software dashboards.',
        },
        {
          heading: 'AI Without the Complexity',
          body: 'Presenting AI functionality without technical jargon. The interface keeps prompt engineering and algorithmic complexity hidden — users interact with the outcome directly.',
        },
        {
          heading: 'Building the Brand Through the Product',
          body: 'Every micro-interaction communicates quality. Consistency from typography and spacing to navigation and responsive feedback makes the platform feel considered at every level: thoughtful.',
        },
      ],
    },
    visualLanguage: {
      title: 'Visual Direction & Typography',
      intro: 'Sitting harmoniously between an editorial publication, a modern academy, and a next-generation software tool.',
      items: [
        { label: 'Editorial Typography', text: 'Giving the platform a sense of authority and making information effortless to digest.' },
        { label: 'Generous Whitespace', text: 'Preventing cognitive overload during deep learning and reading sessions.' },
        { label: 'Clean Component Architecture', text: 'Creating familiarity while remaining distinctly fresh and modern.' },
        { label: 'Subtle Motion & Feedback', text: 'Providing responsive interaction feedback without distracting from the core text.' },
      ],
    },
    result: {
      title: 'The Result',
      paragraphs: [
        'The final experience gives Scribe a digital identity that feels modern, approachable, and product-first.',
        'Rather than presenting AI as something complicated or futuristic, the website positions it as something that can naturally fit into the way people learn and work.',
      ],
      quote: 'Make knowledge easier to understand, interact with, and remember.',
    },
    keyFeatures: [
      { title: 'Interactive Learning Units', description: 'Bite-sized, modular lessons with instant AI-assisted clarity check-ins.' },
      { title: 'Distraction-Free Reading', description: 'Editorial typography calibrated for high reading retention and eye comfort.' },
      { title: 'Contextual AI Notes', description: 'Intelligent margin highlights providing instant definitions and summaries.' },
      { title: 'Progressive Knowledge Journey', description: 'Structured mastery pathways guiding learners from foundational to advanced concepts.' },
    ],
    takeaway: {
      heading: 'The Takeaway',
      text: 'The best AI interfaces make the artificial intelligence feel almost invisible. When the interface gets out of the way, understanding takes center stage.',
      quote: 'Make knowledge easier to understand, interact with, and remember.',
    },
  },
];
