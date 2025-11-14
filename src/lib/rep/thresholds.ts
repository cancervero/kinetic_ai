import { ExerciseType, ExerciseThresholds } from './types';

const SQUAT_THRESHOLDS: ExerciseThresholds = {
  topAngle: 165,
  bottomAngle: 135,
  minDebounce: 100
};

const PUSHUP_THRESHOLDS: ExerciseThresholds = {
  topAngle: 170,
  bottomAngle: 110,
  minDebounce: 100
};

const THRESHOLDS: Record<ExerciseType, ExerciseThresholds> = {
  squat: SQUAT_THRESHOLDS,
  pushup: PUSHUP_THRESHOLDS
};

export function getThresholds(exercise: ExerciseType): ExerciseThresholds {
  return THRESHOLDS[exercise];
}

export function setThresholds(
  exercise: ExerciseType,
  thresholds: Partial<ExerciseThresholds>
): void {
  THRESHOLDS[exercise] = { ...THRESHOLDS[exercise], ...thresholds };
}
