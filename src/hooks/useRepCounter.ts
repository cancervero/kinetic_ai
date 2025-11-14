import { useEffect, useRef, useState } from 'react';
import { Pose } from '@/lib/pose';
import {
  ExerciseType,
  RepCount,
  ExerciseDetector,
  ExerciseThresholds,
} from '@/lib/rep';
import { createSquatDetector, createPushupDetector } from '@/lib/rep/exercises';

export function useRepCounter(
  pose: Pose | null,
  exercise: ExerciseType,
  thresholds?: ExerciseThresholds
) {
  const [repCount, setRepCount] = useState<RepCount>({
    count: 0,
    state: 'idle',
    lastTransition: 0,
  });
  const detectorRef = useRef<ExerciseDetector | null>(null);

  useEffect(() => {
    detectorRef.current = createDetector(exercise, thresholds);
    return () => detectorRef.current?.reset();
  }, [exercise, thresholds]);

  useEffect(() => {
    if (pose && detectorRef.current) {
      const result = detectorRef.current.detect(pose.keypoints, Date.now());
      setRepCount(result);
    }
  }, [pose]);

  return repCount;
}

function createDetector(
  exercise: ExerciseType,
  thresholds?: ExerciseThresholds
): ExerciseDetector {
  if (exercise === 'squat') return createSquatDetector(thresholds);
  if (exercise === 'pushup') return createPushupDetector(thresholds);
  throw new Error(`Unknown exercise: ${exercise}`);
}
