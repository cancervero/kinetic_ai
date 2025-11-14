import { Keypoint } from '../pose/types';
import { distance, getKeypointByName } from './angles';

export function getTorsoHeight(keypoints: Keypoint[]): number {
  const shoulder = getKeypointByName(keypoints, 'left_shoulder');
  const hip = getKeypointByName(keypoints, 'left_hip');

  if (!shoulder || !hip) return 1;
  return distance(shoulder, hip);
}

export function normalizeKeypoints(
  keypoints: Keypoint[],
  torsoHeight: number
): Keypoint[] {
  return keypoints.map(kp => ({
    ...kp,
    x: kp.x / torsoHeight,
    y: kp.y / torsoHeight
  }));
}

export function isValidPose(keypoints: Keypoint[], minScore = 0.3): boolean {
  return keypoints.every(kp => (kp.score ?? 1) >= minScore);
}
