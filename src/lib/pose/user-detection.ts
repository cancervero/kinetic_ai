import type { Keypoint } from '@tensorflow-models/pose-detection';

export interface DetectionResult {
  isDetected: boolean;
  feedback: string;
  isCentered: boolean;
  isInFrame: boolean;
  hasRequiredKeypoints: boolean;
}

const REQUIRED_KEYPOINTS = [
  'left_hip',
  'right_hip',
  'left_shoulder',
  'right_shoulder',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
];

const MIN_CONFIDENCE = 0.5;
const CENTER_TOLERANCE = 0.15;
const FRAME_MARGIN = 0.05;

function getKeypoint(keypoints: Keypoint[], name: string): Keypoint | null {
  return keypoints.find((kp) => kp.name === name) ?? null;
}

function isKeypointValid(kp: Keypoint | null): boolean {
  return kp !== null && (kp.score ?? 0) >= MIN_CONFIDENCE;
}

function checkRequiredKeypoints(keypoints: Keypoint[]): boolean {
  return REQUIRED_KEYPOINTS.every((name) => {
    const kp = getKeypoint(keypoints, name);
    return isKeypointValid(kp);
  });
}

function checkCentered(keypoints: Keypoint[], frameWidth: number): boolean {
  const leftHip = getKeypoint(keypoints, 'left_hip');
  const rightHip = getKeypoint(keypoints, 'right_hip');

  if (!leftHip || !rightHip) return false;

  const centerX = (leftHip.x + rightHip.x) / 2;
  const frameCenterX = frameWidth / 2;
  const offset = Math.abs(centerX - frameCenterX) / frameWidth;

  return offset < CENTER_TOLERANCE;
}

function checkInFrame(
  keypoints: Keypoint[],
  width: number,
  height: number
): boolean {
  const validKeypoints = keypoints.filter((kp) => isKeypointValid(kp));

  return validKeypoints.every(
    (kp) =>
      kp.x > width * FRAME_MARGIN &&
      kp.x < width * (1 - FRAME_MARGIN) &&
      kp.y > height * FRAME_MARGIN &&
      kp.y < height * (1 - FRAME_MARGIN)
  );
}

function generateFeedback(
  hasKeypoints: boolean,
  isInFrame: boolean,
  isCentered: boolean,
  keypoints: Keypoint[],
  frameWidth: number
): string {
  if (!hasKeypoints) return 'No se detecta una persona completa';
  if (!isInFrame) return 'Aléjate un poco para que te veas completo';
  if (!isCentered) {
    const leftHip = getKeypoint(keypoints, 'left_hip');
    const rightHip = getKeypoint(keypoints, 'right_hip');
    if (!leftHip || !rightHip) return 'Muévete al centro';

    const centerX = (leftHip.x + rightHip.x) / 2;
    return centerX < frameWidth / 2
      ? 'Muévete un poco a la derecha'
      : 'Muévete un poco a la izquierda';
  }
  return 'Perfecto, mantén la posición';
}

export function detectUser(
  keypoints: Keypoint[],
  frameWidth: number,
  frameHeight: number
): DetectionResult {
  const hasRequiredKeypoints = checkRequiredKeypoints(keypoints);
  const isInFrame = checkInFrame(keypoints, frameWidth, frameHeight);
  const isCentered = checkCentered(keypoints, frameWidth);

  const isDetected = hasRequiredKeypoints && isInFrame && isCentered;
  const feedback = generateFeedback(
    hasRequiredKeypoints,
    isInFrame,
    isCentered,
    keypoints,
    frameWidth
  );

  return {
    isDetected,
    feedback,
    isCentered,
    isInFrame,
    hasRequiredKeypoints,
  };
}
