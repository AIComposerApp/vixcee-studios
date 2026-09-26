import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  aspectRatioClass?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  aspectRatioClass = 'aspect-[16/10]',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#141519] ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Shimmer Skeleton Placeholder (shown until image completes loading) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-[#141519] overflow-hidden select-none pointer-events-none">
          {/* Subtle luminous shimmer wave */}
          <div
            className="absolute inset-0 w-full h-full animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 70%, transparent 100%)',
            }}
          />
          {/* Minimalist camera/frame silhouette */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              className="w-7 h-7 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Image with zero layout shift and smooth fade-in */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
