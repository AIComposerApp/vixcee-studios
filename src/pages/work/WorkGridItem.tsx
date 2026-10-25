import React from 'react';
import type { WorkItem } from './workData.ts';

interface WorkGridItemProps {
  item: WorkItem;
  itemStyle: React.CSSProperties;
  isDesktopViewport: boolean;
  durationMs: number;
  easeCurve: string;
  onClick: (e: React.MouseEvent) => void;
}

export const WorkGridItem: React.FC<WorkGridItemProps> = ({
  item,
  itemStyle,
  isDesktopViewport,
  durationMs,
  easeCurve,
  onClick,
}) => {
  const isLaptop = item.device === 'laptop';
  const itemWidth = isDesktopViewport
    ? isLaptop
      ? '480px'
      : '180px'
    : isLaptop
    ? '380px'
    : '135px';

  return (
    <div
      onClick={onClick}
      className="absolute flex flex-col items-center select-none cursor-pointer"
      style={{
        ...itemStyle,
        width: itemWidth,
        transition: `transform ${durationMs}ms ${easeCurve}, opacity ${durationMs}ms ease-out`,
      }}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        draggable={false}
        className="w-full h-auto max-h-[52vh] object-contain pointer-events-none select-none"
      />
    </div>
  );
};
