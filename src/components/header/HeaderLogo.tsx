import React from 'react';

interface HeaderLogoProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  logoStyle: React.CSSProperties;
  isWordmarkVisible: boolean;
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onNavigateHome?: () => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  targetRef,
  logoStyle,
  isWordmarkVisible,
  isScrolled,
  isMobileMenuOpen,
  onNavigateHome,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          if (onNavigateHome) {
            onNavigateHome();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="relative flex flex-col items-center justify-center group focus-visible:outline-none cursor-pointer py-1"
        aria-label="Vixcee Studios Home"
      >
        {/* Stable Target Slot */}
        <div
          id="header-logo-target"
          ref={targetRef}
          className="w-[36px] sm:w-[38px] aspect-[225/166] relative flex items-center justify-center"
        >
          <div className="w-full h-full flex items-center justify-center" style={logoStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="88.17903919219971 100.88997669219971 225.1209789276123 166.12005577087402"
              fill="none"
              className="w-full h-full pointer-events-none group-hover:brightness-110 transition-[filter] duration-200"
            >
              <defs>
                <style type="text/css">{`
                  @keyframes logoReveal { 
                    0% { transform: scale(0.94); transform-origin: 200px 185px; opacity: 0; } 
                    15% { opacity: 1; } 
                    100% { transform: scale(1); transform-origin: 200px 185px; opacity: 1; } 
                  }
                  .anim-logo { 
                    animation: logoReveal 3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                  }
                `}</style>
              </defs>
              <path
                d="M 248.22,193.18 C 268.71,162.59 288.78,130.59 307.94,106.25 H 263.27 C 251.59,106.25 239.39,115.32 233.59,125.71 L 218.25,150.71 L 201.61,123.33 C 199.76,120.1 196.22,118.08 192.74,118.14 L 154.71,118.53 C 156.49,120.12 158.19,121.57 159.64,123.65 C 173.22,143.69 186.21,165.87 198.51,185.19 L 218.25,151.53 L 244.47,194.33 L 222.05,227.06 L 198.82,186.44 C 192.78,197.31 186.07,208.14 179.46,217.19 C 179.34,217.27 179.23,217.22 179.22,217.08 C 182.09,209.63 186.47,202.3 189.14,195.32 L 150.5,128.09 C 147.56,122.54 140.84,118.25 135.49,118.25 H 93.54 L 172.06,247.81 C 181.15,261.85 196.15,261.2 206.59,248.19 L 222.08,228.06 L 237.32,255.52 C 239.39,259.31 243.25,261.65 247.17,261.65 H 291.66 L 248.22,193.18 Z"
                fill="white"
                className="anim-logo"
                id="logo-mark"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="1000"
                  to="0"
                  dur="1.9s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                />
                <animate
                  attributeName="stroke"
                  values="#FE5E50;#FFB4A2;#FFFFFF;rgba(255,255,255,0)"
                  keyTimes="0;0.35;0.75;1"
                  dur="2.6s"
                  fill="freeze"
                />
                <animate
                  attributeName="stroke-width"
                  values="3.5;3;1.5;0"
                  keyTimes="0;0.5;0.8;1"
                  dur="2.6s"
                  fill="freeze"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0;0;0.4;1"
                  keyTimes="0;0.45;0.75;1"
                  dur="3s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                />
                <animate
                  attributeName="fill"
                  values="#FE5E50;#FFA07A;#FFFFFF"
                  keyTimes="0;0.6;1"
                  dur="3s"
                  fill="freeze"
                />
              </path>
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div
          style={{
            transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'opacity, transform',
          }}
          className={`absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap ${
            !isWordmarkVisible || isScrolled || isMobileMenuOpen
              ? 'opacity-0 -translate-y-1 pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-white whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            VIXCEE STUDIOS
          </span>
        </div>
      </a>
    </div>
  );
};
