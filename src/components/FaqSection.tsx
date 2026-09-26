import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How fast is delivery?',
    answer:
      'Most websites go live in five to seven days. The onboarding form gives me what I need to move fast without cutting corners.',
  },
  {
    question: 'Are the prompts free?',
    answer:
      'Yes. The prompt gallery is free when you sign up with your email. You get immediate access to optimized prompts for animations and functionality.',
  },
  {
    question: 'What is an AI coding agent?',
    answer:
      'It is a tool that writes code based on your instructions. The prompts I provide are built to give these agents clear direction so you get quality output on the first shot.',
  },
  {
    question: 'How does onboarding work?',
    answer:
      'You fill out a short form about your business and needs. Then you get a custom website plan with a clear timeline and scope before any work begins.',
  },
  {
    question: 'What do templates cost?',
    answer:
      'The full templated website prompts are coming soon. Join the waitlist to get notified when they launch and to receive early access pricing.',
  },
];

export const FaqSection: React.FC = () => {
  // Exclusive single-open state: opening one question automatically closes any other
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#0c0c0e] text-white py-20 sm:py-24 md:py-28 overflow-hidden select-none"
      aria-label="Frequently Asked Questions"
    >
      <div className="w-full max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Centered Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.025em] leading-tight">
            FAQs
          </h2>
          <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-white/70 font-light leading-relaxed text-balance">
            Answers to common questions about prompts, timelines, and the onboarding process
          </p>
        </div>

        {/* Two-Column Seamless Grid (No demarcating lines, pure dark background) */}
        <div className="mt-14 sm:mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20 gap-y-8 sm:gap-y-10 items-start">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="flex flex-col">
                {/* Interactive Accordion Trigger */}
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="group flex items-start justify-between gap-4 text-left w-full py-1.5 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm transition-colors"
                >
                  <span className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug group-hover:text-white/90 transition-colors">
                    {item.question}
                  </span>

                  {/* Line indicator that fluidly morphs into an X */}
                  <span
                    className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    {/* Morphing Line Segment 1 */}
                    <span
                      className={`absolute w-3.5 h-[1.5px] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? 'rotate-45 bg-white'
                          : 'rotate-0 bg-white/60 group-hover:bg-white'
                      }`}
                    />
                    {/* Morphing Line Segment 2 */}
                    <span
                      className={`absolute w-3.5 h-[1.5px] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? '-rotate-45 bg-white'
                          : 'rotate-0 bg-white/60 group-hover:bg-white'
                      }`}
                    />
                  </span>
                </button>

                {/* Animated Drawer with Height & Text Fade In/Out */}
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`text-sm sm:text-base text-white/70 font-light leading-relaxed pr-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? 'opacity-100 translate-y-0 pt-2.5 sm:pt-3'
                          : 'opacity-0 -translate-y-2 pt-0'
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
