import { Keypoint } from '../../pose/types';
import { ExerciseDetector, RepCount } from '../types';
import { calculateAngle, getKeypointByName } from '../angles';
import { getThresholds } from '../thresholds';
import { RepStateMachine } from '../state-machine';

export class SquatDetector implements ExerciseDetector {
  private machine: RepStateMachine;

  constructor() {
    const thresholds = getThresholds('squat');
    this.machine = new RepStateMachine(thresholds);
  }

  detect(keypoints: Keypoint[], timestamp: number): RepCount {
    const angle = this.getKneeAngle(keypoints);
    if (angle === null) return this.getIdleCount();
    return this.machine.update(angle, timestamp);
  }

  private getKneeAngle(keypoints: Keypoint[]): number | null {
    const hip = getKeypointByName(keypoints, 'left_hip');
    const knee = getKeypointByName(keypoints, 'left_knee');
    const ankle = getKeypointByName(keypoints, 'left_ankle');

    if (!hip || !knee || !ankle) return null;
    return calculateAngle(hip, knee, ankle);
  }

  private getIdleCount(): RepCount {
    return { count: 0, state: 'idle', lastTransition: 0 };
  }

  reset(): void {
    this.machine.reset();
  }
}

export function createSquatDetector(): ExerciseDetector {
  return new SquatDetector();
}
