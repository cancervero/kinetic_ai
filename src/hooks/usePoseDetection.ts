import { useEffect, useState, useRef } from 'react';
import { Pose, loadDetector, runInference } from '@/lib/pose';
import { createSmoother, smoothPose } from '@/lib/pose/smoothing';

export function usePoseDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  isReady: boolean
) {
  const [pose, setPose] = useState<Pose | null>(null);
  const [loading, setLoading] = useState(true);
  const detectorRef = useRef<any>(null);
  const smootherRef = useRef(createSmoother());
  const rafRef = useRef<number>();

  useEffect(() => {
    if (isReady) initDetector();
    return cleanup;
  }, [isReady]);

  async function initDetector() {
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
  }

  function startDetection() {
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
  }

  function cleanup() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  return { pose, loading };
}
