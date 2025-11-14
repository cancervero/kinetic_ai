import { useEffect, RefObject } from 'react';

export function useCanvasResize(
  canvasRef: RefObject<HTMLCanvasElement>,
  videoRef: RefObject<HTMLVideoElement>
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const updateSize = (): void => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(video);

    return () => observer.disconnect();
  }, [canvasRef, videoRef]);
}
