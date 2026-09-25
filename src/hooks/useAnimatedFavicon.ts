import { useEffect } from 'react';

/**
 * High-performance cross-browser Favicon Animator.
 * 
 * While Firefox natively animates SVG SMIL favicons, Chromium-based browsers
 * (Chrome, Edge, Brave, Opera) freeze SVG favicons on the first frame unless
 * the link element's href is dynamically updated.
 * 
 * This hook drives the elegant 6-second periodic stroke-reveal animation
 * smoothly across Chrome, Edge, and Safari at 20fps during the 2.7s reveal,
 * then pauses completely during the restful 3.3s display phase.
 * It immediately suspends execution when the browser tab is hidden to ensure
 * zero CPU/battery consumption.
 */
export function useAnimatedFavicon() {
  useEffect(() => {
    // Only run in browser environments with requestAnimationFrame
    if (typeof window === 'undefined') return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const CYCLE_DURATION = 6000; // 6 seconds loop
    const STROKE_1_DUR = 1620; // 1.62s
    const STROKE_2_DUR = 1120; // 1.12s
    const DRAW_TOTAL_DUR = STROKE_1_DUR + STROKE_2_DUR; // 2.74s

    // Offscreen canvas for crisp 64x64 rendering
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number | null = null;
    let cycleStart = performance.now();
    let isDrawingPhase = true;
    let lastRenderTime = 0;

    const baseSvgHeader = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 400 400" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FC8000"/>
      <stop offset="49.5%" stop-color="#FE5E50"/>
      <stop offset="100%" stop-color="#FF96AD"/>
    </linearGradient>
    <clipPath id="v-clip" clipPathUnits="userSpaceOnUse">
      <path d="M93.54 118.25H135.49C140.84 118.25 147.56 122.54 150.5 128.09L189.14 195.32C186.47 202.3 182.09 209.63 179.22 217.08C179.23 217.22 179.34 217.27 179.46 217.19C186.07 208.14 192.78 197.31 198.82 186.44L198.51 185.19L218.25 150.71L233.59 125.71C239.39 115.32 251.59 106.25 263.27 106.25H307.94C288.78 130.59 268.71 162.59 248.22 193.18L222.08 228.06L206.59 248.19C196.15 261.2 181.15 261.85 172.06 247.81Z"/>
    </clipPath>
`;

    const img = new Image();

    const renderFrame = (offset1: number, offset2: number) => {
      const svg = `${baseSvgHeader}
    <mask id="m" x="80" y="85" width="240" height="200" maskUnits="userSpaceOnUse">
      <g clip-path="url(#v-clip)">
        <path d="M113 105L185 233Q190 242 196 233L289 91" pathLength="100" fill="none" stroke="white" stroke-width="54" stroke-linecap="butt" stroke-linejoin="round" stroke-dasharray="100 100" stroke-dashoffset="${offset1.toFixed(1)}"/>
      </g>
      <path d="M168 108L277 274" pathLength="100" fill="none" stroke="white" stroke-width="54" stroke-linecap="butt" stroke-dasharray="100 100" stroke-dashoffset="${offset2.toFixed(1)}"/>
    </mask>
  </defs>
  <rect x="6" y="6" width="388" height="388" rx="76" ry="76" fill="#0C0C0E" stroke="rgba(255,255,255,0.18)" stroke-width="8"/>
  <path d="M 248.22,193.18 C 268.71,162.59 288.78,130.59 307.94,106.25 H 263.27 C 251.59,106.25 239.39,115.32 233.59,125.71 L 218.25,150.71 L 201.61,123.33 C 199.76,120.1 196.22,118.08 192.74,118.14 L 154.71,118.53 C 156.49,120.12 158.19,121.57 159.64,123.65 C 173.22,143.69 186.21,165.87 198.51,185.19 L 218.25,151.53 L 244.47,194.33 L 222.05,227.06 L 198.82,186.44 C 192.78,197.31 186.07,208.14 179.46,217.19 C 179.34,217.27 179.23,217.22 179.22,217.08 C 182.09,209.63 186.47,202.3 189.14,195.32 L 150.5,128.09 C 147.56,122.54 140.84,118.25 135.49,118.25 H 93.54 L 172.06,247.81 C 181.15,261.85 196.15,261.2 206.59,248.19 L 222.08,228.06 L 237.32,255.52 C 239.39,259.31 243.25,261.65 247.17,261.65 H 291.66 L 248.22,193.18 Z" fill="url(#g)" mask="url(#m)"/>
</svg>`;

      img.onload = () => {
        if (!ctx || !link) return;
        ctx.clearRect(0, 0, 64, 64);
        ctx.drawImage(img, 0, 0, 64, 64);
        link.href = canvas.toDataURL('image/png');
      };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const loop = (now: number) => {
      // If tab is inactive, suspend work
      if (document.hidden) {
        animFrameId = requestAnimationFrame(loop);
        return;
      }

      const elapsed = (now - cycleStart) % CYCLE_DURATION;

      if (elapsed < DRAW_TOTAL_DUR) {
        // Drawing phase (limit to ~20 fps to conserve CPU: 50ms interval)
        if (now - lastRenderTime >= 48) {
          lastRenderTime = now;
          isDrawingPhase = true;

          let offset1 = 100;
          let offset2 = 100;

          if (elapsed <= STROKE_1_DUR) {
            const t1 = elapsed / STROKE_1_DUR;
            // Smooth ease-out cubic
            const ease1 = 1 - Math.pow(1 - t1, 3);
            offset1 = 100 - ease1 * 100;
            offset2 = 100;
          } else {
            offset1 = 0;
            const t2 = (elapsed - STROKE_1_DUR) / STROKE_2_DUR;
            const ease2 = 1 - Math.pow(1 - t2, 3);
            offset2 = 100 - ease2 * 100;
          }

          renderFrame(offset1, offset2);
        }
      } else {
        // Resting phase: logo is fully revealed and standing still
        if (isDrawingPhase) {
          isDrawingPhase = false;
          // Set full final frame once
          renderFrame(0, 0);
        }
      }

      animFrameId = requestAnimationFrame(loop);
    };

    // Initial render of complete frame
    renderFrame(0, 0);

    // Start animation loop after 1.2s page settle
    const initialTimer = setTimeout(() => {
      cycleStart = performance.now();
      animFrameId = requestAnimationFrame(loop);
    }, 1200);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cycleStart = performance.now();
        renderFrame(0, 0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
