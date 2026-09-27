import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { StaticDotGrid } from '../components/StaticDotGrid.tsx';
import { ElasticDock, DeviceMode, DockState } from '../components/ElasticDock.tsx';
import { X } from 'lucide-react';

interface WorkItem {
  id: string;
  title: string;
  device: 'mobile' | 'laptop';
  industryLabel: string;
  imageUrl: string;
  caseStudySlug?: string;
}

// 19 unique device mockups: exactly 13 mobile portraits + 6 laptops, zero duplicates
const ALL_WORK_ITEMS: WorkItem[] = [
  // --- MOBILES (13 Unique Items, Front Face Silhouettes) ---
  {
    id: 'm-alex-hydrate',
    title: 'ALEX Hydrate',
    device: 'mobile',
    industryLabel: 'E-commerce & Lifestyle',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/ALEX-hydrate-mobile-portrait_apcmge.png',
    caseStudySlug: 'alex-hydrate',
  },
  {
    id: 'm-allbirds',
    title: 'Allbirds Mens Dasher NZ',
    device: 'mobile',
    industryLabel: 'E-commerce & Footwear',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/Allbirds-Mens-Dasher-NZ-09-25-2026_05_30_PM-portrait_zkp8ls.png',
  },
  {
    id: 'm-balance-wellness',
    title: 'Balance Wellness',
    device: 'mobile',
    industryLabel: 'Wellness & Sanctuary',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355853/Balance-Wellness-mobile-portrait_vgprfk.png',
    caseStudySlug: 'balance-wellness',
  },
  {
    id: 'm-ijaw-massage',
    title: 'IJAW Massage Plus',
    device: 'mobile',
    industryLabel: 'Wellness & Healing',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355855/IJAWMASSAGEPLUS-_-Traditional-Healing-Modern-Comfort-09-25-2026_05_18_PM-portrait_orh8ey.png',
  },
  {
    id: 'm-aurelia-hotels',
    title: 'Aurelia Hotels',
    device: 'mobile',
    industryLabel: 'Luxury Hospitality',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355860/Aurelia-Hotels-mobile-portrait_yagbgb.png',
  },
  {
    id: 'm-chesney-hotel',
    title: 'Chesney Hotel',
    device: 'mobile',
    industryLabel: 'Boutique Hospitality',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355855/Chesney-Hotel-mobile-portrait_cjpsj2.png',
  },
  {
    id: 'm-carizma-hotels',
    title: 'Carizma Luxury Hotels',
    device: 'mobile',
    industryLabel: 'Hotel Front-Desk',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Carizma-Luxury-Hotels-mobile-portrait_emb4pi.png',
    caseStudySlug: 'carizma-hotels',
  },
  {
    id: 'm-prince-of-web3',
    title: 'Prince of Web3',
    device: 'mobile',
    industryLabel: 'Web3 Strategy',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355856/Prince-of-Web3-mobile-portrait_mqpqeh.png',
    caseStudySlug: 'prince-of-web3',
  },
  {
    id: 'm-flowstate',
    title: 'FlowState Intelligent Plumbing',
    device: 'mobile',
    industryLabel: 'SaaS & Field Services',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355856/FlowState-Intelligent-Plumbing-09-25-2026_05_04_PM-portrait_vvlepq.png',
  },
  {
    id: 'm-scribe',
    title: 'Scribe Mobile Platform',
    device: 'mobile',
    industryLabel: 'AI & EdTech',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355857/Scribe-_-Smarter-lessons-Built-with-Scribe--09-25-2026_05_23_PM-portrait_tixcfp.png',
    caseStudySlug: 'scribe',
  },
  {
    id: 'm-google-ai',
    title: 'Google AI Studio App',
    device: 'mobile',
    industryLabel: 'AI & Developer Tools',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355857/My-Google-AI-Studio-App-09-25-2026_05_58_PM-portrait_d8ruby.png',
  },
  {
    id: 'm-sandra',
    title: 'Sandra Osaigbovo',
    device: 'mobile',
    industryLabel: 'Brand & Personal Flagship',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Sandra-Osaigbovo_mobile-portrait_gy9r4g.png',
  },
  {
    id: 'm-shoe-finder',
    title: 'Shoe Finder',
    device: 'mobile',
    industryLabel: 'E-commerce & App',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_500/v1790355858/Shoe-Finder-09-25-2026_05_31_PM-portrait_yajud6.png',
  },

  // --- LAPTOPS (6 Unique Flagships, Front Face Silhouettes) ---
  {
    id: 'l-prince-of-web3',
    title: 'Prince of Web3',
    device: 'laptop',
    industryLabel: 'Web3 & Blockchain Strategy',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358838/Prince-of-Web3-bg-front_cg3ig1.png',
    caseStudySlug: 'prince-of-web3',
  },
  {
    id: 'l-alex-hydrate',
    title: 'ALEX Hydrate',
    device: 'laptop',
    industryLabel: 'E-commerce & Wellness',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358976/ALEX-_-Form-Follows-Hydration-bg-front_aunbom.png',
    caseStudySlug: 'alex-hydrate',
  },
  {
    id: 'l-carizma-hotels',
    title: 'Carizma Luxury Hotels',
    device: 'laptop',
    industryLabel: 'Hospitality & Operations',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790358728/Carizma-Luxury-Hotels-_-bg-front_xemluu.png',
    caseStudySlug: 'carizma-hotels',
  },
  {
    id: 'l-scribe',
    title: 'Scribe AI Lessons',
    device: 'laptop',
    industryLabel: 'EdTech & AI',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790457424/Scribe-_-Smarter-lessons-Built-with-Scribe--09-26-2026_06_19_PM-front_hnr7yv.png',
    caseStudySlug: 'scribe',
  },
  {
    id: 'l-balance-wellness',
    title: 'Balance Wellness',
    device: 'laptop',
    industryLabel: 'Wellness & Lifestyle',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790458343/Balance-Wellness-Coach-Brand-Identity-Design-System-09-26-2026_06_26_PM-front_qyubod.png',
    caseStudySlug: 'balance-wellness',
  },
  {
    id: 'l-netrovert',
    title: 'Netrovert Protocol',
    device: 'laptop',
    industryLabel: 'Web3 & Narrative',
    imageUrl: 'https://res.cloudinary.com/divndlntm/image/upload/f_auto,q_auto,w_1000/v1790458991/My-Google-AI-Studio-App-09-26-2026_10_40_PM-front_ontekw.png',
    caseStudySlug: 'netrovert',
  },
];

interface WorkPageProps {
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onNavigateHome: () => void;
  onNavigateCaseStudies?: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onSelectCaseStudy,
  onOpenBookCall,
  dockStage = 'docked',
}) => {
  // Strict Device Separation: Only Mobile or Laptop
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');

  // Inspection focus state
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  // Fluid crossfade transition state when switching between Mobile & Desktop
  const [isSwitchingDevice, setIsSwitchingDevice] = useState(false);

  // Direct DOM ref for buttery 60fps pan updates (ZERO React state re-rendering while moving!)
  const stageRef = useRef<HTMLDivElement | null>(null);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // Smooth cursor follow target on desktop
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const isDraggingRef = useRef(false);
  const isReturningRef = useRef(false); // Lock to prevent inertia loop from interfering with return transition
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const hasMovedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Viewport width tracker for responsive desktop scaling
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktopViewport = windowWidth >= 1024;

  // Filter items based on active device
  const filteredItems = useMemo(() => {
    return ALL_WORK_ITEMS.filter((item) => item.device === deviceMode);
  }, [deviceMode]);

  const focusedItem = useMemo(() => {
    if (!focusedItemId) return null;
    return ALL_WORK_ITEMS.find((item) => item.id === focusedItemId) || null;
  }, [focusedItemId]);

  // Pre-load all assets
  useEffect(() => {
    ALL_WORK_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.imageUrl;
    });
  }, []);

  // Apple standard ease-out curve
  const EASE_CURVE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const DURATION_MS = 600;

  // Update DOM transform helper with unified easing
  const applyStageTransform = useCallback((x: number, y: number, transition = false) => {
    if (!stageRef.current) return;
    if (transition) {
      stageRef.current.style.transition = `transform ${DURATION_MS}ms ${EASE_CURVE}`;
    } else {
      stageRef.current.style.transition = 'none';
    }
    stageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }, []);

  // ============================================================
  // DESKTOP NATURAL CURSOR MOVEMENT & TOUCH MOMENTUM GLIDE
  // On desktop: Moving external mouse smoothly navigates around canvas
  // On mobile: Touch drag with weighted inertia & rubber-band boundaries
  // ============================================================
  useEffect(() => {
    const loop = () => {
      if (!focusedItemId && !isReturningRef.current) {
        if (isDesktopViewport && !isDraggingRef.current) {
          // Desktop Smooth Mouse Follow: Lerp smoothly towards targetPanRef with weighted damping
          const dx = targetPanRef.current.x - panRef.current.x;
          const dy = targetPanRef.current.y - panRef.current.y;

          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            panRef.current.x += dx * 0.08;
            panRef.current.y += dy * 0.08;
            applyStageTransform(panRef.current.x, panRef.current.y, false);
          }
        } else if (!isDraggingRef.current) {
          // Mobile Touch Drag Inertia & Boundary spring
          velocityRef.current.vx *= 0.85;
          velocityRef.current.vy *= 0.85;

          const maxPanX = 480;
          const maxPanY = 480;

          const isOutOfBoundsX = Math.abs(panRef.current.x) > maxPanX;
          const isOutOfBoundsY = Math.abs(panRef.current.y) > maxPanY;

          if (isOutOfBoundsX) {
            const targetX = Math.sign(panRef.current.x) * maxPanX;
            panRef.current.x += (targetX - panRef.current.x) * 0.12;
          } else {
            panRef.current.x += velocityRef.current.vx;
          }

          if (isOutOfBoundsY) {
            const targetY = Math.sign(panRef.current.y) * maxPanY;
            panRef.current.y += (targetY - panRef.current.y) * 0.12;
          } else {
            panRef.current.y += velocityRef.current.vy;
          }

          if (
            Math.abs(velocityRef.current.vx) > 0.05 ||
            Math.abs(velocityRef.current.vy) > 0.05 ||
            isOutOfBoundsX ||
            isOutOfBoundsY
          ) {
            applyStageTransform(panRef.current.x, panRef.current.y, false);
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [focusedItemId, isDesktopViewport, applyStageTransform]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedItemId) {
          handleDismissFocus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItemId]);

  // Butter-smooth dismiss handler that locks out conflicting loops
  const handleDismissFocus = () => {
    isReturningRef.current = true;
    velocityRef.current = { vx: 0, vy: 0 };
    setFocusedItemId(null);
    applyStageTransform(panRef.current.x, panRef.current.y, true);

    // Reset returning lock after the transition completes smoothly
    setTimeout(() => {
      isReturningRef.current = false;
    }, DURATION_MS + 50);
  };

  // When focused item changes, center stage smoothly
  useEffect(() => {
    if (focusedItemId) {
      velocityRef.current = { vx: 0, vy: 0 };
      applyStageTransform(0, 0, true);
    }
  }, [focusedItemId, applyStageTransform]);

  // RESTORED FLUID MODE TRANSITION (Subtle Spring Crossfade)
  const handleDeviceModeChange = (mode: DeviceMode) => {
    if (mode === deviceMode) return;
    setFocusedItemId(null);
    setIsSwitchingDevice(true);

    panRef.current = { x: 0, y: 0 };
    targetPanRef.current = { x: 0, y: 0 };
    velocityRef.current = { vx: 0, vy: 0 };
    applyStageTransform(0, 0, true);

    setTimeout(() => {
      setDeviceMode(mode);
      setTimeout(() => {
        setIsSwitchingDevice(false);
      }, 50);
    }, 220);
  };

  // ============================================================
  // DESKTOP MOUSE HANDLERS (NATURAL MOUSE MOVE AROUND CANVAS)
  // Also supports click-to-drag if user chooses to grab
  // ============================================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (focusedItemId) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: panRef.current.x,
      startY: panRef.current.y,
    };
    velocityRef.current = { vx: 0, vy: 0 };
    if (stageRef.current) {
      stageRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (focusedItemId) return;

    if (isDraggingRef.current) {
      // Active Mouse Drag
      const deltaX = (e.clientX - dragStartRef.current.mouseX) * 0.65;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) * 0.65;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMovedRef.current = true;
      }

      const nextX = dragStartRef.current.startX + deltaX;
      const nextY = dragStartRef.current.startY + deltaY;

      velocityRef.current = {
        vx: nextX - panRef.current.x,
        vy: nextY - panRef.current.y,
      };

      panRef.current = { x: nextX, y: nextY };
      targetPanRef.current = { x: nextX, y: nextY };
      applyStageTransform(nextX, nextY, false);
    } else if (isDesktopViewport) {
      // Desktop External Mouse Move (Free, fluid exploration without needing to hold down)
      const windowW = window.innerWidth || 1200;
      const windowH = window.innerHeight || 800;

      // Map cursor coordinates from center of screen (-1 to +1)
      const normX = (e.clientX - windowW / 2) / (windowW / 2);
      const normY = (e.clientY - windowH / 2) / (windowH / 2);

      // Max range to explore with external mouse without dragging
      const exploreRangeX = deviceMode === 'laptop' ? 260 : 340;
      const exploreRangeY = deviceMode === 'laptop' ? 180 : 260;

      // Negative direction for natural parallax camera navigation
      targetPanRef.current = {
        x: -normX * exploreRangeX,
        y: -normY * exploreRangeY,
      };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // TOUCH DRAG HANDLERS (WEIGHTED WITH RUBBER-BAND TENSION FOR MOBILE)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (focusedItemId || e.touches.length !== 1) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    const touch = e.touches[0];
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      startX: panRef.current.x,
      startY: panRef.current.y,
    };
    velocityRef.current = { vx: 0, vy: 0 };
    if (stageRef.current) {
      stageRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || focusedItemId || e.touches.length !== 1) return;
    const touch = e.touches[0];

    let deltaX = (touch.clientX - dragStartRef.current.mouseX) * 0.65;
    let deltaY = (touch.clientY - dragStartRef.current.mouseY) * 0.65;

    const maxPanX = 480;
    const maxPanY = 480;
    const prospectiveX = dragStartRef.current.startX + deltaX;
    const prospectiveY = dragStartRef.current.startY + deltaY;

    if (Math.abs(prospectiveX) > maxPanX) {
      const overX = Math.abs(prospectiveX) - maxPanX;
      deltaX = Math.sign(prospectiveX) * (maxPanX + overX * 0.35) - dragStartRef.current.startX;
    }
    if (Math.abs(prospectiveY) > maxPanY) {
      const overY = Math.abs(prospectiveY) - maxPanY;
      deltaY = Math.sign(prospectiveY) * (maxPanY + overY * 0.35) - dragStartRef.current.startY;
    }

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }

    const nextX = dragStartRef.current.startX + deltaX;
    const nextY = dragStartRef.current.startY + deltaY;

    velocityRef.current = {
      vx: nextX - panRef.current.x,
      vy: nextY - panRef.current.y,
    };

    panRef.current = { x: nextX, y: nextY };
    applyStageTransform(nextX, nextY, false);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // ============================================================
  // BALANCED DESKTOP & MOBILE VIEWPORT GEOMETRY CALCULATOR
  // Pure front-view orthogonal coordinates with zero overlaps
  // ============================================================
  const getItemTransform = useCallback(
    (index: number, total: number, isCurrentFocused: boolean, anyFocused: boolean) => {
      const isMobile = deviceMode === 'mobile';

      // 1. Focused Item: centered at (0,0), scale computed dynamically to never clip
      if (isCurrentFocused) {
        const baseWidth = isMobile
          ? isDesktopViewport
            ? 180
            : 135
          : isDesktopViewport
          ? 480
          : 380;
        const maxAllowedW = isMobile
          ? Math.min(windowWidth * 0.58, 260)
          : Math.min(windowWidth * 0.86, 780);
        const targetScale = maxAllowedW / baseWidth;

        return {
          transform: `translate3d(0px, 0px, 0px) scale(${targetScale})`,
          opacity: 1,
          zIndex: 60,
          pointerEvents: 'auto' as const,
        };
      }

      // Background Grid Coordinates:
      const cols = isMobile ? 4 : 3;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const totalRows = Math.ceil(total / cols);

      // Responsive spacing: On desktop (≥1024px), scale up pitch to fill the display
      const xPitch = isDesktopViewport ? (isMobile ? 240 : 580) : isMobile ? 185 : 450;
      const yPitch = isDesktopViewport ? (isMobile ? 440 : 380) : isMobile ? 360 : 310;

      const xPos = (col - (cols - 1) / 2) * xPitch;
      const yPos = (row - (totalRows - 1) / 2) * yPitch;

      // When another item is focused: surrounding items stay at their position, dim to 0.15 and scale down
      if (anyFocused) {
        return {
          transform: `translate3d(${xPos * 0.72}px, ${yPos * 0.72}px, 0px) scale(0.48)`,
          opacity: 0.15,
          zIndex: 5,
          pointerEvents: 'none' as const,
        };
      }

      // Overview scale: 0.88x on desktop, 0.72x on mobile
      const clusterScale = isDesktopViewport ? 0.88 : 0.72;

      return {
        transform: `translate3d(${xPos * clusterScale}px, ${yPos * clusterScale}px, 0px) scale(${clusterScale})`,
        opacity: isSwitchingDevice ? 0 : 1,
        zIndex: 10 + index,
        pointerEvents: 'auto' as const,
      };
    },
    [deviceMode, isSwitchingDevice, isDesktopViewport, windowWidth]
  );

  // Determine Dock State
  const currentDockState: DockState = focusedItemId ? 'focused' : 'overview';

  // Primary Action handler for State C (CTA)
  const handlePrimaryAction = () => {
    if (!focusedItem) return;
    if (focusedItem.caseStudySlug) {
      onSelectCaseStudy(focusedItem.caseStudySlug);
    } else {
      onOpenBookCall();
    }
  };

  return (
    <div
      className={`relative w-full h-screen bg-[#0c0c0e] text-white overflow-hidden select-none touch-none transition-opacity duration-700 ease-out ${
        dockStage === 'initial' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        cursor: focusedItemId ? 'default' : isDesktopViewport ? 'default' : isDraggingRef.current ? 'grabbing' : 'grab',
      }}
    >
      {/* ============================================================ */}
      {/* 1. STATIC DOT GRID BACKGROUND (SILKY-SMOOTH 60FPS)           */}
      {/* ============================================================ */}
      <StaticDotGrid
        dotColor="rgba(240, 78, 35, 0.35)"
        dotSize={2.5}
        dotSpacing={30}
      />

      {/* Subtle top vignette for clean header blending */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent z-[2]" />

      {/* ============================================================ */}
      {/* 2. ORTHOGONAL 2D CLUSTER STAGE (DIRECT DOM PANNING, NO LAG)  */}
      {/* ============================================================ */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center"
        onClick={(e) => {
          // If in focus mode and clicking the backdrop, dismiss focus
          if (
            focusedItemId &&
            (e.target as HTMLElement).tagName !== 'BUTTON' &&
            (e.target as HTMLElement).tagName !== 'A'
          ) {
            handleDismissFocus();
          }
        }}
      >
        {/* Directly Controlled Pan Stage (No State Re-render Delay) */}
        <div
          ref={stageRef}
          className="relative flex items-center justify-center will-change-transform"
          style={{
            transform: 'translate3d(0px, 0px, 0px)',
          }}
        >
          {filteredItems.map((item, index) => {
            const isCurrentFocused = focusedItemId === item.id;
            const anyFocused = focusedItemId !== null;
            const itemStyle = getItemTransform(
              index,
              filteredItems.length,
              isCurrentFocused,
              anyFocused
            );
            const isLaptop = item.device === 'laptop';

            // Item width responsive to viewport: larger on desktop, compact on mobile
            const itemWidth = isDesktopViewport
              ? isLaptop
                ? '480px'
                : '180px'
              : isLaptop
              ? '380px'
              : '135px';

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasMovedRef.current) {
                    if (focusedItemId !== item.id) {
                      setFocusedItemId(item.id);
                    }
                  }
                }}
                className="absolute flex flex-col items-center select-none cursor-pointer"
                style={{
                  ...itemStyle,
                  width: itemWidth,
                  transition: `transform ${DURATION_MS}ms ${EASE_CURVE}, opacity ${DURATION_MS}ms ease-out`,
                }}
              >
                {/* RAW TRANSPARENT PNG SILHOUETTES */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  draggable={false}
                  className="w-full h-auto max-h-[52vh] object-contain pointer-events-none select-none"
                />

                {/* ============================================================ */}
                {/* NON-INTRUSIVE FOCUS OVERLAYS (Only on Focused Item)          */}
                {/* ============================================================ */}
                {isCurrentFocused && (
                  <>
                    {/* 
                      [✕] Dismiss Button: 
                      - Hidden on desktop (clicking backdrop or dock dismisses focus naturally)
                      - Positioned on MOBILE by the right side (clearly visible beside the phone)
                    */}
                    <div
                      className="md:hidden absolute top-2 -right-4 sm:-right-6 pointer-events-auto z-50 animate-in fade-in zoom-in-95 duration-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={handleDismissFocus}
                        className="w-8 h-8 rounded-full border border-white/40 text-white hover:border-white bg-black/60 backdrop-blur-md active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                        aria-label="Close focus"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom: Minimal Project Title and Subtitle with smooth fade-in */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none z-50 whitespace-nowrap animate-in fade-in duration-400">
                      <h3 className="text-[17px] font-semibold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[12.5px] text-white/60 font-light mt-0.5">
                        {item.industryLabel}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ELASTIC MORPHING BOTTOM CONTROLLER (SINGLE PERSISTENT DOM) */}
      {/* ============================================================ */}
      <ElasticDock
        dockState={currentDockState}
        deviceMode={deviceMode}
        setDeviceMode={handleDeviceModeChange}
        onOpenAction={handlePrimaryAction}
        hasCaseStudy={Boolean(focusedItem?.caseStudySlug)}
      />
    </div>
  );
};
