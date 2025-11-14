import { Keypoint } from '../pose/types';

export type ExerciseType = 'squat' | 'pushup';

export type RepState = 'idle' | 'top' | 'bottom';

export interface RepCount {
  count: number;
  state: RepState;
  lastTransition: number;
}

export interface ExerciseThresholds {
  topAngle: number;
  bottomAngle: number;
  minDebounce: number;
}

export interface ExerciseDetector {
  detect(keypoints: Keypoint[], timestamp: number): RepCount;
  reset(): void;
}
