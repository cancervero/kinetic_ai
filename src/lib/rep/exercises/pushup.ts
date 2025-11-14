import { Keypoint } from '../../pose/types';
import { ExerciseDetector, RepCount } from '../types';
import { calculateAngle, getKeypointByName } from '../angles';
import { getThresholds } from '../thresholds';
import { RepStateMachine } from '../state-machine';

export class PushupDetector implements ExerciseDetector {
  private machine: RepStateMachine;

  constructor() {
    const thresholds = getThresholds('pushup');
    this.machine = new RepStateMachine(thresholds);
  }

  detect(keypoints: Keypoint[], timestamp: number): RepCount {
    const angle = this.getElbowAngle(keypoints);
    if (angle === null) return this.getIdleCount();
    return this.machine.update(angle, timestamp);
  }

  private getElbowAngle(keypoints: Keypoint[]): number | null {
    const shoulder = getKeypointByName(keypoints, 'left_shoulder');
    const elbow = getKeypointByName(keypoints, 'left_elbow');
    const wrist = getKeypointByName(keypoints, 'left_wrist');

    if (!shoulder || !elbow || !wrist) return null;
    return calculateAngle(shoulder, elbow, wrist);
  }

  private getIdleCount(): RepCount {
    return { count: 0, state: 'idle', lastTransition: 0 };
  }

  reset(): void {
    this.machine.reset();
  }
}

export function createPushupDetector(): ExerciseDetector {
  return new PushupDetector();
}
