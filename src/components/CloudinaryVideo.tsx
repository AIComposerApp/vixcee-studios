import React, { useState, useEffect, useRef } from 'react';

interface CloudinaryVideoProps {
  videoUrl: string;
  posterUrl: string;
  title: string;
  aspectRatio?: 'video' | 'portrait' | 'square' | 'wide';
  className?: string;
  alwaysAutoplay?: boolean;
}

export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  videoUrl,
  posterUrl,
  title,
  aspectRatio = 'video',
  className = '',
  alwaysAutoplay = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(alwaysAutoplay);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lazy-mount observer: Only mount heavy iframe when scrolled near the container
  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Parse embed URL to ensure seamless mute, loop, and no controls
  const getEmbedUrl = () => {
    try {
      const url = new URL(videoUrl);
      url.searchParams.set('autoplay', 'true');
      url.searchParams.set('muted', 'true');
      url.searchParams.set('loop', 'true');
      url.searchParams.set('controls', 'false');
      url.searchParams.set('fluid', 'true');
      return url.toString();
    } catch {
      return `${videoUrl}&autoplay=true&muted=true&loop=true&controls=false`;
    }
  };

  const shouldPlay = (alwaysAutoplay || isHovered || isPlaying) && isNearViewport;

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[9/16]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-[16/9]';

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-[#141519] group select-none ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsPlaying(true);
      }}
      onMouseLeave={() => {
        if (!alwaysAutoplay) setIsHovered(false);
      }}
      onClick={() => setIsPlaying((prev) => !prev)}
    >
      {/* Background Poster Image - Paints instantly with high priority */}
      <img
        src={posterUrl}
        alt={title}
        decoding="async"
        fetchPriority="high"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          shouldPlay ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Cloudinary Player Embed - Only hydrated when scrolled near */}
      {shouldPlay && (
        <iframe
          src={getEmbedUrl()}
          title={title}
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          loading="lazy"
        />
      )}

      {/* Hover Indication Badge (when not playing yet) */}
      {!shouldPlay && (
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          <span>Hover to preview</span>
        </div>
      )}
    </div>
  );
};
