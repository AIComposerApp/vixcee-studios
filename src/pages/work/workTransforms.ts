import { DeviceMode } from '../../components/ElasticDock.tsx';

interface ItemTransformParams {
  index: number;
  total: number;
  deviceMode: DeviceMode;
  isDesktopViewport: boolean;
  windowWidth: number;
  isCurrentFocused: boolean;
  anyFocused: boolean;
  isZoomed: boolean;
  isSwitchingDevice: boolean;
}

export const computeItemTransform = ({
  index,
  total,
  deviceMode,
  isDesktopViewport,
  windowWidth,
  isCurrentFocused,
  anyFocused,
  isZoomed,
  isSwitchingDevice,
}: ItemTransformParams) => {
  const isMobile = deviceMode === 'mobile';

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

  const cols = isMobile ? 4 : 3;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const totalRows = Math.ceil(total / cols);

  const xPitch = isDesktopViewport ? (isMobile ? 240 : 580) : isMobile ? 185 : 450;
  const yPitch = isDesktopViewport ? (isMobile ? 440 : 380) : isMobile ? 360 : 310;

  const xPos = (col - (cols - 1) / 2) * xPitch;
  const yPos = (row - (totalRows - 1) / 2) * yPitch;

  if (anyFocused) {
    return {
      transform: `translate3d(${xPos * 0.72}px, ${yPos * 0.72}px, 0px) scale(0.48)`,
      opacity: 0.15,
      zIndex: 5,
      pointerEvents: 'none' as const,
    };
  }

  const baseOverviewScale = isDesktopViewport ? 0.88 : 0.72;
  const clusterScale = isZoomed ? 1.25 : baseOverviewScale;

  return {
    transform: `translate3d(${xPos * clusterScale}px, ${yPos * clusterScale}px, 0px) scale(${clusterScale})`,
    opacity: isSwitchingDevice ? 0 : 1,
    zIndex: 10 + index,
    pointerEvents: 'auto' as const,
  };
};
