import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { StaticDotGrid } from '../components/StaticDotGrid.tsx';
import { ElasticDock, DeviceMode, DockState } from '../components/ElasticDock.tsx';
import { ALL_WORK_ITEMS } from './work/workData.ts';
import { EmberHorizonBackground } from './work/EmberHorizonBackground.tsx';
import { WorkGridItem } from './work/WorkGridItem.tsx';
import { computeItemTransform } from './work/workTransforms.ts';
import { X } from 'lucide-react';

interface WorkPageProps {
  onSelectCaseStudy: (slug: string) => void;
  onOpenBookCall: () => void;
  onNavigateHome: () => void;
  onNavigateCaseStudies?: () => void;
  dockStage?: 'initial' | 'docking' | 'docked';
  initialFocusedItemId?: string | null;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onSelectCaseStudy,
  onOpenBookCall,
  dockStage = 'docked',
  initialFocusedItemId,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFocusedItemId) {
      const match = ALL_WORK_ITEMS.find((it) => it.id === initialFocusedItemId);
      if (match) {
        setDeviceMode(match.device);
      }
      setFocusedItemId(initialFocusedItemId);
    }
  }, [initialFocusedItemId]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isSwitchingDevice, setIsSwitchingDevice] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const isDraggingRef = useRef(false);
  const isReturningRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const hasMovedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktopViewport = windowWidth >= 1024;

  const filteredItems = useMemo(() => {
    return ALL_WORK_ITEMS.filter((item) => item.device === deviceMode);
  }, [deviceMode]);

  const focusedItem = useMemo(() => {
    if (!focusedItemId) return null;
    return ALL_WORK_ITEMS.find((item) => item.id === focusedItemId) || null;
  }, [focusedItemId]);

  useEffect(() => {
    ALL_WORK_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.imageUrl;
    });
  }, []);

  const EASE_CURVE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const DURATION_MS = 600;

  const applyStageTransform = useCallback((x: number, y: number, transition = false) => {
    if (!stageRef.current) return;
    if (transition) {
      stageRef.current.style.transition = `transform ${DURATION_MS}ms ${EASE_CURVE}`;
    } else {
      stageRef.current.style.transition = 'none';
    }
    stageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }, []);

  useEffect(() => {
    const loop = () => {
      if (!focusedItemId && !isReturningRef.current) {
        if (isDesktopViewport && !isDraggingRef.current) {
          const dx = targetPanRef.current.x - panRef.current.x;
          const dy = targetPanRef.current.y - panRef.current.y;

          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            panRef.current.x += dx * 0.08;
            panRef.current.y += dy * 0.08;
            applyStageTransform(panRef.current.x, panRef.current.y, false);
          }
        } else if (!isDraggingRef.current) {
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

  const handleDismissFocus = useCallback(() => {
    isReturningRef.current = true;
    velocityRef.current = { vx: 0, vy: 0 };
    setFocusedItemId(null);
    applyStageTransform(panRef.current.x, panRef.current.y, true);

    setTimeout(() => {
      isReturningRef.current = false;
    }, DURATION_MS + 50);
  }, [applyStageTransform]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedItemId) {
          handleDismissFocus();
        } else if (isZoomed) {
          setIsZoomed(false);
          panRef.current = { x: 0, y: 0 };
          targetPanRef.current = { x: 0, y: 0 };
          velocityRef.current = { vx: 0, vy: 0 };
          applyStageTransform(0, 0, true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItemId, isZoomed, applyStageTransform, handleDismissFocus]);

  useEffect(() => {
    if (focusedItemId) {
      velocityRef.current = { vx: 0, vy: 0 };
      applyStageTransform(0, 0, true);
    }
  }, [focusedItemId, applyStageTransform]);

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
      const windowW = window.innerWidth || 1200;
      const windowH = window.innerHeight || 800;

      const normX = (e.clientX - windowW / 2) / (windowW / 2);
      const normY = (e.clientY - windowH / 2) / (windowH / 2);

      const exploreRangeX = deviceMode === 'laptop' ? 280 : 420;
      const exploreRangeY = deviceMode === 'laptop' ? 220 : 660;

      targetPanRef.current = {
        x: -normX * exploreRangeX,
        y: -normY * exploreRangeY,
      };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

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

  const getItemTransform = useCallback(
    (index: number, total: number, isCurrentFocused: boolean, anyFocused: boolean) => {
      return computeItemTransform({
        index,
        total,
        deviceMode,
        isDesktopViewport,
        windowWidth,
        isCurrentFocused,
        anyFocused,
        isZoomed,
        isSwitchingDevice,
      });
    },
    [deviceMode, isZoomed, isSwitchingDevice, isDesktopViewport, windowWidth]
  );

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
    panRef.current = { x: 0, y: 0 };
    targetPanRef.current = { x: 0, y: 0 };
    velocityRef.current = { vx: 0, vy: 0 };
    applyStageTransform(0, 0, true);
  };

  const currentDockState: DockState = focusedItemId
    ? 'focused'
    : isZoomed
    ? 'zoomed'
    : 'overview';

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
      <StaticDotGrid
        dotColor="rgba(240, 78, 35, 0.35)"
        dotSize={2.5}
        dotSpacing={30}
      />

      <EmberHorizonBackground />

      {/* ORTHOGONAL 2D CLUSTER STAGE */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center"
        onClick={(e) => {
          if (
            focusedItemId &&
            (e.target as HTMLElement).tagName !== 'BUTTON' &&
            (e.target as HTMLElement).tagName !== 'A'
          ) {
            handleDismissFocus();
          }
        }}
      >
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

            return (
              <WorkGridItem
                key={item.id}
                item={item}
                itemStyle={itemStyle}
                isDesktopViewport={isDesktopViewport}
                durationMs={DURATION_MS}
                easeCurve={EASE_CURVE}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasMovedRef.current) {
                    if (focusedItemId !== item.id) {
                      setFocusedItemId(item.id);
                    }
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {focusedItemId && (
        <div
          className="md:hidden fixed top-[88px] right-4 z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDismissFocus}
            className="w-8 h-8 rounded-full border border-white/20 text-white bg-[#0c0c0e]/85 backdrop-blur-xl active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-2xl"
            aria-label="Close focus"
          >
            <X className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      )}

      <ElasticDock
        dockState={currentDockState}
        deviceMode={deviceMode}
        setDeviceMode={handleDeviceModeChange}
        onToggleZoom={toggleZoom}
        onOpenAction={handlePrimaryAction}
        hasCaseStudy={Boolean(focusedItem?.caseStudySlug)}
      />
    </div>
  );
};
