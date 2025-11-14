import { useEffect, useState, useRef, useCallback } from 'react';
import { Pose, loadDetector, runInference, PoseDetector } from '@/lib/pose';
import { createSmoother, smoothPose } from '@/lib/pose/smoothing';

export function usePoseDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  isReady: boolean
) {
  const [pose, setPose] = useState<Pose | null>(null);
  const [loading, setLoading] = useState(true);
  const detectorRef = useRef<PoseDetector | null>(null);
  const smootherRef = useRef(createSmoother());
  const rafRef = useRef<number>();

  const startDetection = useCallback(() => {
    const detect = async () => {
      if (videoRef.current && detectorRef.current) {
        const rawPose = await runInference(
          detectorRef.current,
          videoRef.current
        );
        if (rawPose) {
          setPose(smoothPose(rawPose, smootherRef.current));
        }
      }
      rafRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, [videoRef]);

  const initDetector = useCallback(async () => {
    try {
      console.log('[usePoseDetection] Starting detector initialization...');
      detectorRef.current = await loadDetector({
        backend: 'movenet',
        modelType: 'lightning'
      });
      console.log('[usePoseDetection] Detector loaded, starting detection loop');
      setLoading(false);
      startDetection();
    } catch (err) {
      console.error('[usePoseDetection] Detector init failed:', err);
      setLoading(false); // Stop showing loading indicator on error
    }
  }, [startDetection]);

  useEffect(() => {
    if (isReady) {
      void initDetector();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, initDetector]);

  return { pose, loading };
}
