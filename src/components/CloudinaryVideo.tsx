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

  const isEmbedPlayer = videoUrl.includes('player.cloudinary.com/embed') || videoUrl.includes('/embed');
  const isDirectImage = !isEmbedPlayer && (videoUrl.endsWith('.png') || videoUrl.endsWith('.jpg') || videoUrl.endsWith('.webp') || videoUrl.includes('/image/upload/'));

  // Parse embed URL to ensure seamless instant autoplay, mute, loop, and zero controls/overlays
  const getEmbedUrl = () => {
    try {
      const url = new URL(videoUrl);
      url.searchParams.set('autoplay', 'true');
      url.searchParams.set('muted', 'true');
      url.searchParams.set('loop', 'true');
      url.searchParams.set('controls', 'false');
      url.searchParams.set('playsinline', 'true');
      url.searchParams.set('preload', 'auto');
      url.searchParams.set('showLogo', 'false');
      url.searchParams.set('hideContextMenu', 'true');
      url.searchParams.set('bigPlayButton', 'false');
      url.searchParams.set('showJumpControls', 'false');
      url.searchParams.set('fluid', 'true');
      url.searchParams.set('colors[accent]', 'transparent');
      return url.toString();
    } catch {
      return `${videoUrl}&autoplay=true&muted=true&loop=true&controls=false&playsinline=true&preload=auto&showLogo=false&hideContextMenu=true&bigPlayButton=false`;
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
      className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-[#141519] group select-none pointer-events-none ${className}`}
    >
      {/* Background Poster Image - Paints instantly with high priority */}
      <img
        src={posterUrl}
        alt={title}
        decoding="async"
        fetchPriority="high"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
          shouldPlay && !isDirectImage ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Cloudinary Player Embed - Completely suppressed from user touches/taps */}
      {shouldPlay && isEmbedPlayer && (
        <iframe
          src={getEmbedUrl()}
          title={title}
          className="absolute inset-0 w-full h-full border-0 pointer-events-none select-none scale-[1.01]"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          loading="eager"
        />
      )}

      {/* Direct Image or Video asset preview */}
      {shouldPlay && isDirectImage && (
        <img
          src={videoUrl}
          alt={`${title} Preview`}
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500 pointer-events-none"
        />
      )}

      {/* Touch Shielding Overlay: absorbs all mobile taps so player controls are never triggered */}
      <div className="absolute inset-0 z-20 pointer-events-auto cursor-default" />
    </div>
  );
};
