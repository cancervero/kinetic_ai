import type { Keypoint } from '@tensorflow-models/pose-detection';

const MIN_CONFIDENCE = 0.5;
const Y_ARM_ANGLE_MIN = 30;
const Y_ARM_ANGLE_MAX = 80;

function getKeypoint(keypoints: Keypoint[], name: string): Keypoint | null {
  return keypoints.find((kp) => kp.name === name) ?? null;
}

function isKeypointValid(kp: Keypoint | null): boolean {
  return kp !== null && (kp.score ?? 0) >= MIN_CONFIDENCE;
}

function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  const radians =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

function isArmRaised(
  shoulder: Keypoint,
  elbow: Keypoint,
  wrist: Keypoint
): boolean {
  if (!isKeypointValid(shoulder)) return false;
  if (!isKeypointValid(elbow)) return false;
  if (!isKeypointValid(wrist)) return false;

  const isWristAboveShoulder = wrist.y < shoulder.y;
  const angle = calculateAngle(shoulder, elbow, wrist);
  const isAngleValid = angle >= Y_ARM_ANGLE_MIN && angle <= Y_ARM_ANGLE_MAX;

  return isWristAboveShoulder && isAngleValid;
}

export function isGestureY(keypoints: Keypoint[]): boolean {
  const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
  const leftElbow = getKeypoint(keypoints, 'left_elbow');
  const leftWrist = getKeypoint(keypoints, 'left_wrist');

  const rightShoulder = getKeypoint(keypoints, 'right_shoulder');
  const rightElbow = getKeypoint(keypoints, 'right_elbow');
  const rightWrist = getKeypoint(keypoints, 'right_wrist');

  if (!leftShoulder || !leftElbow || !leftWrist) return false;
  if (!rightShoulder || !rightElbow || !rightWrist) return false;

  const leftArmRaised = isArmRaised(leftShoulder, leftElbow, leftWrist);
  const rightArmRaised = isArmRaised(rightShoulder, rightElbow, rightWrist);

  return leftArmRaised && rightArmRaised;
}

export class GestureTracker {
  private gestureStartTime: number | null = null;
  private readonly requiredDuration: number;

  constructor(requiredDurationMs: number = 1500) {
    this.requiredDuration = requiredDurationMs;
  }

  update(keypoints: Keypoint[], timestamp: number): boolean {
    const isGesture = isGestureY(keypoints);

    if (isGesture) {
      if (this.gestureStartTime === null) {
        this.gestureStartTime = timestamp;
      }
      const duration = timestamp - this.gestureStartTime;
      return duration >= this.requiredDuration;
    } else {
      this.gestureStartTime = null;
      return false;
    }
  }

  reset(): void {
    this.gestureStartTime = null;
  }

  getProgress(currentTime: number): number {
    if (this.gestureStartTime === null) return 0;
    const elapsed = currentTime - this.gestureStartTime;
    return Math.min(elapsed / this.requiredDuration, 1);
  }
}
