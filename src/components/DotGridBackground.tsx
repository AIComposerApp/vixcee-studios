import React, { useEffect, useRef } from 'react';

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function resolveVar(raw: string, el: HTMLElement): string {
  const s = raw.trim();
  if (!s.startsWith('var(')) return s;
  const inner = s.slice(4, -1).trim();
  const commaIdx = inner.indexOf(',');
  const varName = (commaIdx !== -1 ? inner.slice(0, commaIdx) : inner).trim();
  const fallback = commaIdx !== -1 ? inner.slice(commaIdx + 1).trim() : '';
  try {
    const resolved = getComputedStyle(el).getPropertyValue(varName).trim();
    if (resolved) return resolved;
  } catch (_) {}
  if (fallback) return resolveVar(fallback, el);
  return '#F04E23';
}

function parseColor(raw: string, el: HTMLElement): { r: number; g: number; b: number } {
  const color = resolveVar(raw, el);
  if (color.startsWith('rgb')) {
    const m = color.match(/[\d.]+/g) || [];
    return {
      r: Number(m[0]) || 240,
      g: Number(m[1]) || 78,
      b: Number(m[2]) || 35,
    };
  }
  let h = color.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (isNaN(n)) return { r: 240, g: 78, b: 35 };
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

interface Dot {
  bx: number;
  by: number;
  inclination: number;
  ascension: number;
  phase: number;
  speedMult: number;
}

export interface DotGridBackgroundProps {
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  orbitSpeed?: number;
  impactRadius?: number;
  scaleOnHover?: number;
  enableRevolve?: boolean;
  fadeEdges?: boolean;
  desktopAndTabletOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const DotGridBackground: React.FC<DotGridBackgroundProps> = ({
  dotColor = '#F04E23',
  dotSize = 3,
  dotSpacing = 28,
  orbitSpeed = 1.5,
  impactRadius = 120,
  scaleOnHover = 1.8,
  enableRevolve = true,
  fadeEdges = true,
  desktopAndTabletOnly = true,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cfgRef = useRef({
    dotColor,
    dotSize,
    dotSpacing,
    orbitSpeed,
    impactRadius,
    scaleOnHover,
    enableRevolve,
    desktopAndTabletOnly,
  });

  cfgRef.current.dotColor = dotColor;
  cfgRef.current.dotSize = dotSize;
  cfgRef.current.dotSpacing = dotSpacing;
  cfgRef.current.orbitSpeed = orbitSpeed;
  cfgRef.current.impactRadius = impactRadius;
  cfgRef.current.scaleOnHover = scaleOnHover;
  cfgRef.current.enableRevolve = enableRevolve;
  cfgRef.current.desktopAndTabletOnly = desktopAndTabletOnly;

  const dotsRef = useRef<Dot[]>([]);
  const spacingSnapRef = useRef(dotSpacing);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to avoid mobile 3x/4x GPU overload
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    let hovering = false;
    let leaveTs = 0;
    let prevTs = 0;
    let raf: number | null = null;
    let globalAngle = 0;
    let isVisible = true;

    // Cache pre-parsed colors
    let cachedColor = cfgRef.current.dotColor;
    let rgb = parseColor(cachedColor, canvas);
    let baseFill = `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`;

    function updateColor() {
      if (cachedColor !== cfgRef.current.dotColor) {
        cachedColor = cfgRef.current.dotColor;
        rgb = parseColor(cachedColor, canvas!);
        baseFill = `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`;
      }
    }

    function buildDots() {
      const sp = cfgRef.current.dotSpacing;
      spacingSnapRef.current = sp;
      dotsRef.current = [];
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dotsRef.current.push({
            bx: c * sp,
            by: r * sp,
            inclination: Math.random() * Math.PI,
            ascension: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            speedMult: 0.7 + Math.random() * 0.6,
          });
        }
      }
    }

    function isInteractionAllowed(): boolean {
      if (!cfgRef.current.desktopAndTabletOnly) return true;
      if (typeof window === 'undefined') return true;
      // Hover effects and dot distortion are strictly enabled for desktop and tablet (>= 768px).
      // Mobile screens (< 768px) remain static so touch gestures scroll natively without accidental distortion.
      return window.innerWidth >= 768;
    }

    let lastW = 0;
    let lastH = 0;

    function resize() {
      const parent = canvas?.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const newW = Math.round(rect.width);
      const newH = Math.round(rect.height);

      // On mobile devices, ignore vertical-only fluctuations caused by browser address bar showing/hiding
      if (lastW > 0 && Math.abs(newW - lastW) < 2 && Math.abs(newH - lastH) < 140) {
        return;
      }

      lastW = newW;
      lastH = newH;
      W = newW;
      H = newH;
      if (!canvas) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      // If on mobile, ensure any residual interaction state is immediately cleared
      if (!isInteractionAllowed()) {
        mouse.x = -9999;
        mouse.y = -9999;
        hovering = false;
      }

      buildDots();
      drawFrame(performance.now());
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);
    resize();

    const targetElement = canvas.closest('section') || canvas.parentElement || canvas;

    function wakeLoop() {
      if (!raf && isVisible) {
        prevTs = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isInteractionAllowed()) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hovering = true;
      wakeLoop();
    };

    const onMouseEnter = (e: MouseEvent) => {
      if (!isInteractionAllowed()) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hovering = true;
      wakeLoop();
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
      wakeLoop();
    };

    targetElement.addEventListener('mousemove', onMouseMove as EventListener);
    targetElement.addEventListener('mouseenter', onMouseEnter as EventListener);
    targetElement.addEventListener('mouseleave', onMouseLeave as EventListener);

    function drawFrame(ts: number): boolean {
      if (!ctx || W === 0 || H === 0) return false;
      const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05);
      prevTs = ts;
      const cfg = cfgRef.current;
      updateColor();

      if (spacingSnapRef.current !== cfg.dotSpacing) buildDots();
      globalAngle += cfg.orbitSpeed * dt;

      ctx.clearRect(0, 0, W, H);

      const mx = mouse.x;
      const my = mouse.y;
      const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000;
      const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5));
      const hasActiveInteraction = hovering || decay > 0.005;

      const baseR = cfg.dotSize / 2;
      const dynamicDots: { x: number; y: number; r: number; alpha: number }[] = [];

      // Single batched path for ALL undisturbed background dots
      ctx.beginPath();
      const dots = dotsRef.current;
      const impactR = cfg.impactRadius;
      const impactRSq = impactR * impactR;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let inRange = false;

        if (hasActiveInteraction) {
          const dx = d.bx - mx;
          const dy = d.by - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < impactRSq && distSq > 0) {
            inRange = true;
            const dist = Math.sqrt(distSq);
            const t = dist / impactR;
            const inf = smoothstep(1 - t) * decay;

            let x = d.bx;
            let y = d.by;
            let scale = 1;
            let alpha = 0.3;

            if (cfg.enableRevolve) {
              const orbitR = (1 - t) * cfg.dotSpacing * 0.7 * inf;
              const theta = globalAngle * d.speedMult + d.phase;
              const cosA = Math.cos(d.ascension);
              const sinA = Math.sin(d.ascension);
              const cosI = Math.cos(d.inclination);
              const sinI = Math.sin(d.inclination);
              const lx = Math.cos(theta);
              const ly = Math.sin(theta) * cosI;
              const lz = Math.sin(theta) * sinI;

              const ox = (lx * cosA - ly * sinA) * orbitR;
              const oy = (lx * sinA + ly * cosA) * orbitR;
              x = d.bx + ox;
              y = d.by + oy;

              const depthScale = 0.75 + 0.25 * ((lz + 1) * 0.5);
              scale = (1 + (cfg.scaleOnHover - 1) * inf) * depthScale;
              alpha = (0.3 + 0.7 * inf) * depthScale;
            } else {
              scale = 1 + (cfg.scaleOnHover - 1) * inf;
              alpha = 0.3 + 0.7 * inf;
            }

            dynamicDots.push({ x, y, r: baseR * scale, alpha });
          }
        }

        if (!inRange) {
          ctx.moveTo(d.bx + baseR, d.by);
          ctx.arc(d.bx, d.by, baseR, 0, Math.PI * 2);
        }
      }

      // Draw all undisturbed dots in a SINGLE fill call
      ctx.fillStyle = baseFill;
      ctx.fill();

      // Draw dynamic disturbed dots
      if (dynamicDots.length > 0) {
        for (let j = 0; j < dynamicDots.length; j++) {
          const dd = dynamicDots[j];
          ctx.beginPath();
          ctx.arc(dd.x, dd.y, dd.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${dd.alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      return hasActiveInteraction;
    }

    function loop(ts: number) {
      if (!isVisible) {
        raf = null;
        return;
      }

      const continueAnimation = drawFrame(ts);
      if (continueAnimation) {
        raf = requestAnimationFrame(loop);
      } else {
        // Sleep animation when mouse is gone and decay is done!
        raf = null;
      }
    }

    // Observer to sleep completely when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          wakeLoop();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(canvas);

    // Initial render
    wakeLoop();

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      targetElement.removeEventListener('mousemove', onMouseMove as EventListener);
      targetElement.removeEventListener('mouseenter', onMouseEnter as EventListener);
      targetElement.removeEventListener('mouseleave', onMouseLeave as EventListener);
    };
  }, []);

  const maskStyles: React.CSSProperties = fadeEdges
    ? {
        WebkitMaskImage:
          'radial-gradient(ellipse 85% 75% at 50% 50%, #000 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 80%, transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 85% 75% at 50% 50%, #000 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 80%, transparent 100%)',
      }
    : {};

  return (
    <div
      className={`isolate shrink-0 overflow-hidden pointer-events-none absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        ...maskStyles,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          ...style,
        }}
        className="pointer-events-none absolute inset-0 z-0"
      />
    </div>
  );
};
