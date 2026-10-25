export interface ShowcaseImage {
  id: string;
  title: string;
  src: string;
}

export const getWorkPageId = (id: string): string => {
  if (id === 'carizma-luxury') return 'm-carizma-hotels';
  if (id === 'google-ai-studio') return 'm-google-ai';
  return `m-${id}`;
};

// 13 High-Performance Optimized Mobile Portrait Screenshots across 3 balanced columns
export const COLUMN_1_IMAGES: ShowcaseImage[] = [
  {
    id: 'allbirds',
    title: 'Allbirds Mens Dasher NZ',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/Allbirds-Mens-Dasher-NZ-09-25-2026_05_30_PM-portrait_zkp8ls.png',
  },
  {
    id: 'alex-hydrate',
    title: 'ALEX Hydrate',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/ALEX-hydrate-mobile-portrait_apcmge.png',
  },
  {
    id: 'balance-wellness',
    title: 'Balance Wellness',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355853/Balance-Wellness-mobile-portrait_vgprfk.png',
  },
  {
    id: 'ijaw-massage',
    title: 'IJAW Massage Plus',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355855/IJAWMASSAGEPLUS-_-Traditional-Healing-Modern-Comfort-09-25-2026_05_18_PM-portrait_orh8ey.png',
  },
  {
    id: 'aurelia-hotels',
    title: 'Aurelia Hotels',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355860/Aurelia-Hotels-mobile-portrait_yagbgb.png',
  },
];

export const COLUMN_2_IMAGES: ShowcaseImage[] = [
  {
    id: 'chesney-hotel',
    title: 'Chesney Hotel',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355855/Chesney-Hotel-mobile-portrait_cjpsj2.png',
  },
  {
    id: 'prince-of-web3',
    title: 'Prince of Web3',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355856/Prince-of-Web3-mobile-portrait_mqpqeh.png',
  },
  {
    id: 'flowstate',
    title: 'FlowState Intelligent Plumbing',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355856/FlowState-Intelligent-Plumbing-09-25-2026_05_04_PM-portrait_vvlepq.png',
  },
  {
    id: 'scribe',
    title: 'Scribe Smarter Lessons',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355857/Scribe-_-Smarter-lessons-Built-with-Scribe--09-25-2026_05_23_PM-portrait_tixcfp.png',
  },
];

export const COLUMN_3_IMAGES: ShowcaseImage[] = [
  {
    id: 'google-ai-studio',
    title: 'Google AI Studio App',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355857/My-Google-AI-Studio-App-09-25-2026_05_58_PM-portrait_d8ruby.png',
  },
  {
    id: 'sandra-osaigbovo',
    title: 'Sandra Osaigbovo',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Sandra-Osaigbovo_mobile-portrait_gy9r4g.png',
  },
  {
    id: 'shoe-finder',
    title: 'Shoe Finder',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Shoe-Finder-09-25-2026_05_31_PM-portrait_yajud6.png',
  },
  {
    id: 'carizma-luxury',
    title: 'Carizma Luxury Hotels',
    src: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_420/v1790355858/Carizma-Luxury-Hotels-mobile-portrait_emb4pi.png',
  },
];
