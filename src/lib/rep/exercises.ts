import { Keypoint } from '../pose/types';
import { RepStateMachine } from './state-machine';
import { getThresholds } from './thresholds';
import { calculateKneeAngle } from './angles';
import type { ExerciseDetector, ExerciseThresholds, RepCount } from './types';

class SquatDetector implements ExerciseDetector {
  private machine: RepStateMachine;

  constructor(thresholds?: ExerciseThresholds) {
    const defaultThresholds = getThresholds('squat');
    this.machine = new RepStateMachine(thresholds ?? defaultThresholds);
  }

  detect(keypoints: Keypoint[], timestamp: number): RepCount {
    const angle = calculateKneeAngle(keypoints);
    return this.machine.update(angle, timestamp);
  }

  reset(): void {
    this.machine.reset();
  }
}

class PushupDetector implements ExerciseDetector {
  private machine: RepStateMachine;

  constructor(thresholds?: ExerciseThresholds) {
    const defaultThresholds = getThresholds('pushup');
    this.machine = new RepStateMachine(thresholds ?? defaultThresholds);
  }

  detect(keypoints: Keypoint[], timestamp: number): RepCount {
    const angle = calculateKneeAngle(keypoints);
    return this.machine.update(angle, timestamp);
  }

  reset(): void {
    this.machine.reset();
  }
}

export function createSquatDetector(
  thresholds?: ExerciseThresholds
): ExerciseDetector {
  return new SquatDetector(thresholds);
}

export function createPushupDetector(
  thresholds?: ExerciseThresholds
): ExerciseDetector {
  return new PushupDetector(thresholds);
}
