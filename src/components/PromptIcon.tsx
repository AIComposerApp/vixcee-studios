import React, { useId } from 'react';

interface PromptIconProps {
  variant?: 'black' | 'white' | 'original' | 'brand' | 'header-logo';
  className?: string;
}

export const PromptIcon: React.FC<PromptIconProps> = ({
  variant = 'original',
  className = 'w-4 h-4',
}) => {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const lightningGradId = `lightning-orange-${safeId}`;
  const motionGradId = `motion-coral-${safeId}`;
  const brandGradId = `header-logo-brand-${safeId}`;

  if (variant === 'brand' || variant === 'header-logo') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1021 1024"
        className={className}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={brandGradId}
            x1="120"
            y1="140"
            x2="880"
            y2="880"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F04E23" offset="0%" />
            <stop stopColor="#FF661F" offset="50%" />
            <stop stopColor="#FFAA00" offset="100%" />
          </linearGradient>
        </defs>
        <g
          id={`motion-streaks-brand-${safeId}`}
          fill={`url(#${brandGradId})`}
          stroke={`url(#${brandGradId})`}
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            id="upper-streak-brand"
            d="m225 342h230c13 0 24 4 27 12 3 7-4 14-10 20l-17 18c-4 4-8 6-14 6h-216c-17 0-29-11-29-27s12-29 29-29z"
          />
          <path
            id="middle-streak-brand"
            d="m111 459h252c5 0 9 4 12 9s1 9-3 14l-24 26c-4 4-8 7-14 7h-224c-16 0-28-12-28-27 0-16 13-29 29-29z"
          />
          <path
            id="lower-streak-brand"
            d="m223 578h106c12 0 18 2 26 7 9 5 24 5 36 5h32c16 0 26 7 26 20 0 14-14 22-31 22h-193c-17 0-29-10-29-27 0-15 11-27 27-27z"
          />
        </g>
        <g id={`lightning-bolt-brand-${safeId}`}>
          <path
            d="m722 168c9-7 19-7 26-1 8 6 9 15 5 27l-70 214c-3 9-1 14 9 14h190c11 0 18 7 19 16 2 8-4 15-11 22l-399 397c-9 9-17 13-26 7-10-5-12-14-8-25l108-263c4-9 0-13-8-13h-168c-10 0-17-5-19-13-3-7 0-13 6-20l339-355z"
            fill={`url(#${brandGradId})`}
            stroke={`url(#${brandGradId})`}
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'white') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1021 1024"
        className={className}
        fill="none"
        aria-hidden="true"
      >
        <g
          id="motion-streaks-white"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            id="upper-streak-w"
            d="m225 342h230c13 0 24 4 27 12 3 7-4 14-10 20l-17 18c-4 4-8 6-14 6h-216c-17 0-29-11-29-27s12-29 29-29z"
          />
          <path
            id="middle-streak-w"
            d="m111 459h252c5 0 9 4 12 9s1 9-3 14l-24 26c-4 4-8 7-14 7h-224c-16 0-28-12-28-27 0-16 13-29 29-29z"
          />
          <path
            id="lower-streak-w"
            d="m223 578h106c12 0 18 2 26 7 9 5 24 5 36 5h32c16 0 26 7 26 20 0 14-14 22-31 22h-193c-17 0-29-10-29-27 0-15 11-27 27-27z"
          />
        </g>
        <g id="lightning-bolt-white">
          <path
            d="m722 168c9-7 19-7 26-1 8 6 9 15 5 27l-70 214c-3 9-1 14 9 14h190c11 0 18 7 19 16 2 8-4 15-11 22l-399 397c-9 9-17 13-26 7-10-5-12-14-8-25l108-263c4-9 0-13-8-13h-168c-10 0-17-5-19-13-3-7 0-13 6-20l339-355z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'black') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1021 1024"
        className={className}
        fill="none"
        aria-hidden="true"
      >
        <g
          id="motion-streaks-black"
          fill="#000000"
          stroke="#000000"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            id="upper-streak-b"
            d="m225 342h230c13 0 24 4 27 12 3 7-4 14-10 20l-17 18c-4 4-8 6-14 6h-216c-17 0-29-11-29-27s12-29 29-29z"
          />
          <path
            id="middle-streak-b"
            d="m111 459h252c5 0 9 4 12 9s1 9-3 14l-24 26c-4 4-8 7-14 7h-224c-16 0-28-12-28-27 0-16 13-29 29-29z"
          />
          <path
            id="lower-streak-b"
            d="m223 578h106c12 0 18 2 26 7 9 5 24 5 36 5h32c16 0 26 7 26 20 0 14-14 22-31 22h-193c-17 0-29-10-29-27 0-15 11-27 27-27z"
          />
        </g>
        <g id="lightning-bolt-black">
          <path
            d="m722 168c9-7 19-7 26-1 8 6 9 15 5 27l-70 214c-3 9-1 14 9 14h190c11 0 18 7 19 16 2 8-4 15-11 22l-399 397c-9 9-17 13-26 7-10-5-12-14-8-25l108-263c4-9 0-13-8-13h-168c-10 0-17-5-19-13-3-7 0-13 6-20l339-355z"
            fill="#000000"
            stroke="#000000"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1021 1024"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={lightningGradId}
          x1="380"
          x2="798"
          y1="530"
          y2="588"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff5104" offset="0" />
          <stop stopColor="#ff5000" offset="0.53" />
          <stop stopColor="#ff5505" offset="1" />
        </linearGradient>
        <linearGradient
          id={motionGradId}
          x1="97"
          x2="472"
          y1="350"
          y2="631"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffa18d" offset="0" />
          <stop stopColor="#ff9c88" offset="1" />
        </linearGradient>
      </defs>
      <g
        id="motion-streaks"
        fill={`url(#${motionGradId})`}
        stroke="#ffb4a4"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          id="upper-streak"
          d="m225 342h230c13 0 24 4 27 12 3 7-4 14-10 20l-17 18c-4 4-8 6-14 6h-216c-17 0-29-11-29-27s12-29 29-29z"
        />
        <path
          id="middle-streak"
          d="m111 459h252c5 0 9 4 12 9s1 9-3 14l-24 26c-4 4-8 7-14 7h-224c-16 0-28-12-28-27 0-16 13-29 29-29z"
        />
        <path
          id="lower-streak"
          d="m223 578h106c12 0 18 2 26 7 9 5 24 5 36 5h32c16 0 26 7 26 20 0 14-14 22-31 22h-193c-17 0-29-10-29-27 0-15 11-27 27-27z"
        />
      </g>
      <g id="lightning-bolt">
        <path
          d="m722 168c9-7 19-7 26-1 8 6 9 15 5 27l-70 214c-3 9-1 14 9 14h190c11 0 18 7 19 16 2 8-4 15-11 22l-399 397c-9 9-17 13-26 7-10-5-12-14-8-25l108-263c4-9 0-13-8-13h-168c-10 0-17-5-19-13-3-7 0-13 6-20l339-355z"
          fill={`url(#${lightningGradId})`}
          stroke="#ff823d"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
};
