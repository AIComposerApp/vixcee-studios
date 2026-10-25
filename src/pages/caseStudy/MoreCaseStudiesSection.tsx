import React from 'react';
import { CaseStudy } from '../../data/caseStudies/types.ts';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton.tsx';
import { ChevronRight } from 'lucide-react';

interface MoreCaseStudiesSectionProps {
  otherStudies: CaseStudy[];
  onSelectCaseStudy: (slug: string) => void;
  prewarmImage: (url: string) => void;
}

export const MoreCaseStudiesSection: React.FC<MoreCaseStudiesSectionProps> = ({
  otherStudies,
  onSelectCaseStudy,
  prewarmImage,
}) => {
  return (
    <section className="py-16 border-t border-white/[0.08] max-w-[1240px] mx-auto px-6 lg:px-12 text-left">
      <h3 className="text-xl sm:text-2xl font-normal text-white mb-8">
        More case studies
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherStudies.map((study) => (
          <div
            key={study.id}
            onClick={() => onSelectCaseStudy(study.slug)}
            onMouseEnter={() => prewarmImage(study.imageUrl)}
            className="flex flex-col items-start cursor-pointer group"
          >
            <div className="w-full mb-3">
              <ImageWithSkeleton
                src={study.imageUrl}
                alt={study.title}
                aspectRatioClass="aspect-[16/10]"
                containerClassName="rounded-md"
              />
            </div>
            <h4 className="text-[14px] font-medium text-white leading-snug mb-3 line-clamp-2">
              {study.title}
            </h4>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all group-hover:bg-white/95 shadow-sm">
              <span>Read more</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
