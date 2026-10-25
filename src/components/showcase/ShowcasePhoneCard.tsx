import React from 'react';
import type { ShowcaseImage } from './showcaseData.ts';

interface ShowcasePhoneCardProps {
  item: ShowcaseImage;
  idx: number;
  onNavigateWork?: (id: string) => void;
  workId: string;
  onLoad: () => void;
  isDesktop?: boolean;
}

export const ShowcasePhoneCard: React.FC<ShowcasePhoneCardProps> = ({
  item,
  idx,
  onNavigateWork,
  workId,
  onLoad,
  isDesktop = false,
}) => {
  return (
    <div
      onClick={() => onNavigateWork && onNavigateWork(workId)}
      className={`w-full shrink-0 flex items-center justify-center aspect-[500/985] cursor-pointer active:scale-95 transition-transform duration-300 ${
        isDesktop ? 'group/phone' : 'overflow-hidden'
      }`}
    >
      <img
        src={item.src}
        alt={item.title}
        onLoad={onLoad}
        loading={idx < 2 ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={idx < 2 ? 'high' : 'low'}
        className={`w-full h-auto object-contain select-none pointer-events-none block ${
          isDesktop ? 'group-hover/phone:scale-[1.02] transition-transform duration-300' : ''
        }`}
      />
    </div>
  );
};
