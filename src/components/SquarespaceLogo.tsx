import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const SquarespaceLogo: React.FC<LogoProps> = ({
  className = 'h-5',
  showWordmark = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 text-white ${className}`}>
      {/* Official Squarespace Monogram / Emblem */}
      <svg
        className="h-5 w-auto shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12.637 20.477c-.504.498-1.319.498-1.823 0l-7.3-7.218a5.132 5.132 0 0 1 0-7.291l.86-.85c.504-.499 1.32-.499 1.824 0l7.3 7.218a5.132 5.132 0 0 1 0 7.291l-.86.85zm-4.992-8.59l4.568 4.517a2.566 2.566 0 0 0 3.619 0l.86-.85a2.566 2.566 0 0 0 0-3.645l-4.568-4.518a2.566 2.566 0 0 0-3.619 0l-.86.85a2.566 2.566 0 0 0 0 3.646z" />
        <path d="M11.363 3.523c.504-.498 1.319-.498 1.823 0l7.3 7.218a5.132 5.132 0 0 1 0 7.291l-.86.85c-.504.499-1.32.499-1.824 0l-7.3-7.218a5.132 5.132 0 0 1 0-7.291l.86-.85zm4.992 8.59l-4.568-4.517a2.566 2.566 0 0 0-3.619 0l-.86.85a2.566 2.566 0 0 0 0 3.645l4.568 4.518a2.566 2.566 0 0 0 3.619 0l.86-.85a2.566 2.566 0 0 0 0-3.646z" />
      </svg>
      {showWordmark && (
        <span className="font-sans text-[15px] font-semibold uppercase tracking-[0.14em] text-white">
          SQUARESPACE
        </span>
      )}
    </div>
  );
};
