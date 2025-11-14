import { Keypoint } from '../pose/types';

export function calculateAngle(
  a: Keypoint,
  b: Keypoint,
  c: Keypoint
): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) -
                  Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

export function getKeypointByName(
  keypoints: Keypoint[],
  name: string
): Keypoint | undefined {
  return keypoints.find(kp => kp.name === name);
}

export function distance(a: Keypoint, b: Keypoint): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

export function calculateKneeAngle(keypoints: Keypoint[]): number {
  const leftHip = getKeypointByName(keypoints, 'left_hip');
  const leftKnee = getKeypointByName(keypoints, 'left_knee');
  const leftAnkle = getKeypointByName(keypoints, 'left_ankle');

  if (!leftHip || !leftKnee || !leftAnkle) {
    return 180;
  }

  return calculateAngle(leftHip, leftKnee, leftAnkle);
}
