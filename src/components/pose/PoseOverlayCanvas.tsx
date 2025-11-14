import { useEffect, useRef, useMemo, RefObject } from 'react';
import { Keypoint } from '@/lib/pose/types';
import { renderSkeleton } from '@/lib/pose/rendering/canvas-renderer';
import { useCanvasResize } from '@/lib/pose/rendering/use-canvas-resize';
import {
  SkeletonEdge,
  RenderConfig,
  DEFAULT_RENDER_CONFIG
} from '@/lib/pose/rendering/skeleton-config';

interface PoseOverlayCanvasProps {
  keypoints: Keypoint[];
  edges: readonly SkeletonEdge[];
  videoRef: RefObject<HTMLVideoElement>;
  config?: Partial<RenderConfig>;
}

export function PoseOverlayCanvas({
  keypoints,
  edges,
  videoRef,
  config
}: PoseOverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderConfig = useMemo(
    () => ({ ...DEFAULT_RENDER_CONFIG, ...config }),
    [config]
  );

  useCanvasResize(canvasRef, videoRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderSkeleton(ctx, keypoints, edges, renderConfig);
  }, [keypoints, edges, renderConfig]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
