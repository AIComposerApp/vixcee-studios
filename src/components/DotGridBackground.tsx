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
  className?: string;
  style?: React.CSSProperties;
}

export const DotGridBackground: React.FC<DotGridBackgroundProps> = ({
  dotColor = '#F04E23', // Exact Melius signature orange
  dotSize = 3,
  dotSpacing = 28,
  orbitSpeed = 1.5,
  impactRadius = 120,
  scaleOnHover = 1.8,
  enableRevolve = true,
  fadeEdges = true,
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
  });

  cfgRef.current.dotColor = dotColor;
  cfgRef.current.dotSize = dotSize;
  cfgRef.current.dotSpacing = dotSpacing;
  cfgRef.current.orbitSpeed = orbitSpeed;
  cfgRef.current.impactRadius = impactRadius;
  cfgRef.current.scaleOnHover = scaleOnHover;
  cfgRef.current.enableRevolve = enableRevolve;

  const dotsRef = useRef<Dot[]>([]);
  const spacingSnapRef = useRef(dotSpacing);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    let hovering = false;
    let leaveTs = 0;
    let prevTs = 0;
    let raf = 0;
    let globalAngle = 0;

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

    function resize() {
      const parent = canvas?.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas?.getBoundingClientRect();
      if (!rect) return;
      W = rect.width;
      H = rect.height;
      if (!canvas) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);
    resize();

    // Listen to mouse events on the whole section/parent container
    const targetElement = canvas.closest('section') || canvas.parentElement || canvas;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hovering = true;
    };

    const onMouseEnter = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hovering = true;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        hovering = true;
      }
    };

    const onTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
    };

    targetElement.addEventListener('mousemove', onMouseMove as EventListener);
    targetElement.addEventListener('mouseenter', onMouseEnter as EventListener);
    targetElement.addEventListener('mouseleave', onMouseLeave as EventListener);
    targetElement.addEventListener('touchmove', onTouchMove as EventListener, { passive: true });
    targetElement.addEventListener('touchend', onTouchEnd as EventListener);

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05);
      prevTs = ts;
      const cfg = cfgRef.current;
      if (spacingSnapRef.current !== cfg.dotSpacing) buildDots();
      globalAngle += cfg.orbitSpeed * dt;
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const rgb = parseColor(cfg.dotColor, canvas!);
      const mx = mouse.x;
      const my = mouse.y;
      const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000;
      const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5));

      for (const d of dotsRef.current) {
        const dx = d.bx - mx;
        const dy = d.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inRange = dist < cfg.impactRadius && dist > 0;
        let x = d.bx;
        let y = d.by;
        let scale = 1;
        let alpha = 0.3;

        if (inRange) {
          const t = dist / cfg.impactRadius;
          const inf = smoothstep(1 - t) * decay;

          if (cfg.enableRevolve) {
            // Orbital radius scales with distance from cursor edge
            const orbitR = (1 - t) * cfg.dotSpacing * 0.7 * inf;
            // Current angle along this dot's orbit
            const theta = globalAngle * d.speedMult + d.phase;

            // 3-D orbit: parametric ellipse in a tilted plane.
            // Projected unit circle onto a plane defined by inclination and ascension
            const cosA = Math.cos(d.ascension);
            const sinA = Math.sin(d.ascension);
            const cosI = Math.cos(d.inclination);
            const sinI = Math.sin(d.inclination);
            const lx = Math.cos(theta);
            const ly = Math.sin(theta) * cosI;
            const lz = Math.sin(theta) * sinI; // +1 = toward viewer, -1 = away

            // Final 2-D screen offset from the dot's rest position
            const ox = (lx * cosA - ly * sinA) * orbitR;
            const oy = (lx * sinA + ly * cosA) * orbitR;
            x = d.bx + ox;
            y = d.by + oy;

            // Depth cue: dots "behind" the plane are slightly smaller and dimmer
            const depthScale = 0.75 + 0.25 * ((lz + 1) * 0.5); // 0.75 – 1.0
            scale = (1 + (cfg.scaleOnHover - 1) * inf) * depthScale;
            alpha = (0.3 + 0.7 * inf) * depthScale;
          } else {
            scale = 1 + (cfg.scaleOnHover - 1) * inf;
            alpha = 0.3 + 0.7 * inf;
          }
        }

        const r = (cfg.dotSize / 2) * scale;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      targetElement.removeEventListener('mousemove', onMouseMove as EventListener);
      targetElement.removeEventListener('mouseenter', onMouseEnter as EventListener);
      targetElement.removeEventListener('mouseleave', onMouseLeave as EventListener);
      targetElement.removeEventListener('touchmove', onTouchMove as EventListener);
      targetElement.removeEventListener('touchend', onTouchEnd as EventListener);
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
