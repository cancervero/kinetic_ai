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
      detectorRef.current = await loadDetector({
        backend: 'movenet',
        modelType: 'lightning'
      });
      setLoading(false);
      startDetection();
    } catch (err) {
      console.error('Detector init failed:', err);
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
