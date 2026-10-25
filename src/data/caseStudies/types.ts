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
