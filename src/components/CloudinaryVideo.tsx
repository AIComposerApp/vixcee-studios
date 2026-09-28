import React, { useState, useEffect, useRef } from 'react';

interface CloudinaryVideoProps {
  videoUrl: string;
  posterUrl: string;
  title: string;
  aspectRatio?: 'video' | 'portrait' | 'square' | 'wide';
  className?: string;
  alwaysAutoplay?: boolean;
}

/**
 * Extracts public_id from Cloudinary embed player URLs and builds a high-performance direct CDN MP4 stream.
 * Parameters:
 * - f_auto: automatic optimal format (AV1, VP9, or H.264 based on client support)
 * - q_auto: optimal visual quality with minimal byte footprint
 * - vc_h264: universally supported, ultra-fast GPU hardware decode
 */
export const getDirectVideoUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  const match = videoUrl.match(/public_id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://res.cloudinary.com/divndlntm/video/upload/f_auto,q_auto,vc_h264/${match[1]}.mp4`;
  }
  if (videoUrl.includes('/video/upload/')) {
    return videoUrl;
  }
  return videoUrl;
};

export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  videoUrl,
  posterUrl,
  title,
  aspectRatio = 'video',
  className = '',
  alwaysAutoplay = true,
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const directMp4Url = getDirectVideoUrl(videoUrl);
  const isEmbedFallback = hasError || !directMp4Url.includes('.mp4');

  useEffect(() => {
    setIsVideoReady(false);
    setHasError(false);

    // Eagerly pre-buffer and trigger video playback with zero delay
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoReady(true);
          })
          .catch(() => {
            // Autoplay policy handled silently
          });
      }
    }
  }, [directMp4Url]);

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
      className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-[#0c0c0e] group select-none pointer-events-none ${className}`}
    >
      {/* 1. Fast High-Fidelity Poster Image - Paints immediately with high priority */}
      <img
        src={posterUrl}
        alt={title}
        decoding="sync"
        fetchPriority="high"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
          isVideoReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 2. Direct GPU Accelerated Native HTML5 Video - Instant C++ decoding, zero iframe delay */}
      {!isEmbedFallback && (
        <video
          ref={videoRef}
          src={directMp4Url}
          poster={posterUrl}
          autoPlay={alwaysAutoplay}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setIsVideoReady(true)}
          onPlaying={() => setIsVideoReady(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3. Fallback Embed Player (Only if direct streaming fails) */}
      {isEmbedFallback && (
        <iframe
          src={`${videoUrl}&autoplay=true&muted=true&loop=true&controls=false&playsinline=true&preload=auto&showLogo=false&hideContextMenu=true&bigPlayButton=false`}
          title={title}
          className="absolute inset-0 w-full h-full border-0 pointer-events-none select-none scale-[1.01]"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          loading="eager"
        />
      )}

      {/* Touch Shielding Overlay: Prevents inadvertent player interruptions */}
      <div className="absolute inset-0 z-20 pointer-events-auto cursor-default" />
    </div>
  );
};
export default CloudinaryVideo;
