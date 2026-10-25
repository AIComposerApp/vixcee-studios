export interface WorkItem {
  id: string;
  title: string;
  device: 'mobile' | 'laptop';
  industryLabel: string;
  imageUrl: string;
  caseStudySlug?: string;
}

// 19 unique device mockups: exactly 13 mobile portraits + 6 laptops, zero duplicates
export const ALL_WORK_ITEMS: WorkItem[] = [
  // --- MOBILES (13 Unique Items, Front Face Silhouettes) ---
  {
    id: 'm-alex-hydrate',
    title: 'ALEX Hydrate',
    device: 'mobile',
    industryLabel: 'E-commerce & Lifestyle',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/ALEX-hydrate-mobile-portrait_apcmge.png',
    caseStudySlug: 'alex-hydrate',
  },
  {
    id: 'm-allbirds',
    title: 'Allbirds Mens Dasher NZ',
    device: 'mobile',
    industryLabel: 'E-commerce & Footwear',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/Allbirds-Mens-Dasher-NZ-09-25-2026_05_30_PM-portrait_zkp8ls.png',
  },
  {
    id: 'm-balance-wellness',
    title: 'Balance Wellness',
    device: 'mobile',
    industryLabel: 'Wellness & Sanctuary',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/Balance-Wellness-mobile-portrait_vgprfk.png',
    caseStudySlug: 'balance-wellness',
  },
  {
    id: 'm-ijaw-massage',
    title: 'IJAW Massage Plus',
    device: 'mobile',
    industryLabel: 'Wellness & Healing',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355855/IJAWMASSAGEPLUS-_-Traditional-Healing-Modern-Comfort-09-25-2026_05_18_PM-portrait_orh8ey.png',
  },
  {
    id: 'm-aurelia-hotels',
    title: 'Aurelia Hotels',
    device: 'mobile',
    industryLabel: 'Luxury Hospitality',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355860/Aurelia-Hotels-mobile-portrait_yagbgb.png',
  },
  {
    id: 'm-chesney-hotel',
    title: 'Chesney Hotel',
    device: 'mobile',
    industryLabel: 'Boutique Hospitality',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355855/Chesney-Hotel-mobile-portrait_cjpsj2.png',
  },
  {
    id: 'm-carizma-hotels',
    title: 'Carizma Luxury Hotels',
    device: 'mobile',
    industryLabel: 'Hotel Front-Desk',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Carizma-Luxury-Hotels-mobile-portrait_emb4pi.png',
    caseStudySlug: 'carizma-hotels',
  },
  {
    id: 'm-prince-of-web3',
    title: 'Prince of Web3',
    device: 'mobile',
    industryLabel: 'Web3 Strategy',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355856/Prince-of-Web3-mobile-portrait_mqpqeh.png',
    caseStudySlug: 'prince-of-web3',
  },
  {
    id: 'm-flowstate',
    title: 'FlowState Intelligent Plumbing',
    device: 'mobile',
    industryLabel: 'SaaS & Field Services',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355856/FlowState-Intelligent-Plumbing-09-25-2026_05_04_PM-portrait_vvlepq.png',
  },
  {
    id: 'm-scribe',
    title: 'Scribe Mobile Platform',
    device: 'mobile',
    industryLabel: 'AI & EdTech',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355857/Scribe-_-Smarter-lessons-Built-with-Scribe--09-25-2026_05_23_PM-portrait_tixcfp.png',
    caseStudySlug: 'scribe',
  },
  {
    id: 'm-google-ai',
    title: 'Google AI Studio App',
    device: 'mobile',
    industryLabel: 'AI & Developer Tools',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355857/My-Google-AI-Studio-App-09-25-2026_05_58_PM-portrait_d8ruby.png',
  },
  {
    id: 'm-sandra',
    title: 'Sandra Osaigbovo',
    device: 'mobile',
    industryLabel: 'Brand & Personal Flagship',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Sandra-Osaigbovo_mobile-portrait_gy9r4g.png',
  },
  {
    id: 'm-shoe-finder',
    title: 'Shoe Finder',
    device: 'mobile',
    industryLabel: 'E-commerce & App',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Shoe-Finder-09-25-2026_05_31_PM-portrait_yajud6.png',
  },

  // --- LAPTOPS (6 Unique Flagships, Front Face Silhouettes) ---
  {
    id: 'l-prince-of-web3',
    title: 'Prince of Web3',
    device: 'laptop',
    industryLabel: 'Web3 & Blockchain Strategy',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
    caseStudySlug: 'prince-of-web3',
  },
  {
    id: 'l-alex-hydrate',
    title: 'ALEX Hydrate',
    device: 'laptop',
    industryLabel: 'E-commerce & Wellness',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
    caseStudySlug: 'alex-hydrate',
  },
  {
    id: 'l-carizma-hotels',
    title: 'Carizma Luxury Hotels',
    device: 'laptop',
    industryLabel: 'Hospitality & Operations',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
    caseStudySlug: 'carizma-hotels',
  },
  {
    id: 'l-scribe',
    title: 'Scribe AI Lessons',
    device: 'laptop',
    industryLabel: 'EdTech & AI',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790457424/Scribe-_-Smarter-lessons-Built-with-Scribe--09-26-2026_06_19_PM-front_hnr7yv.png',
    caseStudySlug: 'scribe',
  },
  {
    id: 'l-balance-wellness',
    title: 'Balance Wellness',
    device: 'laptop',
    industryLabel: 'Wellness & Lifestyle',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790458343/Balance-Wellness-Coach-Brand-Identity-Design-System-09-26-2026_06_26_PM-front_qyubod.png',
    caseStudySlug: 'balance-wellness',
  },
  {
    id: 'l-netrovert',
    title: 'Netrovert Protocol',
    device: 'laptop',
    industryLabel: 'Web3 & Narrative',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790458991/My-Google-AI-Studio-App-09-26-2026_10_40_PM-front_ontekw.png',
    caseStudySlug: 'netrovert',
  },
];
