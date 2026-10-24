import React from 'react';

export const PromptIcon: React.FC<{ className?: string; variant?: 'gradient' | 'white' }> = ({
  className = 'w-4 h-4',
  variant = 'gradient',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    {variant === 'gradient' ? (
      <>
        <defs>
          <linearGradient id="prompt-grad-hdr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F04E23" />
            <stop offset="50%" stopColor="#FF661F" />
            <stop offset="100%" stopColor="#FFAA00" />
          </linearGradient>
        </defs>
        <path
          d="M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
          stroke="url(#prompt-grad-hdr)"
          strokeWidth="1.75"
        />
        <path
          d="M8.5 9.5L11.5 12L8.5 14.5"
          stroke="url(#prompt-grad-hdr)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 14.5H15.5"
          stroke="url(#prompt-grad-hdr)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <path
          d="M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8.5 9.5L11.5 12L8.5 14.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13 14.5H15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const HeaderFaviconLogo: React.FC<{ className?: string }> = ({
  className = 'w-7 h-7 sm:w-8 sm:h-8',
}) => (
  <img
    src="/favicon.svg"
    alt="Vixcee Studios Logo"
    width={40}
    height={40}
    className={`${className} object-contain select-none`}
    loading="eager"
    decoding="sync"
  />
);

export const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.46A6.19 6.19 0 0 0 15.8 15.7V8.5a8.28 8.28 0 0 0 4.84 1.56V6.69h-.05z" />
  </svg>
);
