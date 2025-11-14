import type { Keypoint } from '@tensorflow-models/pose-detection';

export interface CalibrationProfile {
  limbLengths: {
    leftThigh: number;
    rightThigh: number;
    leftShin: number;
    rightShin: number;
  };
  baselineAngles: {
    leftKnee: number;
    rightKnee: number;
    leftHip: number;
    rightHip: number;
  };
  squatThresholds: {
    topAngle: number;
    bottomAngle: number;
    minDebounce: number;
  };
  noiseMargin: number;
  createdAt: string;
}

interface FrameData {
  leftKneeAngle: number;
  rightKneeAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  leftThighLength: number;
  rightThighLength: number;
  leftShinLength: number;
  rightShinLength: number;
}

const MIN_FRAMES = 60;
const MAX_FRAMES = 120;
const SQUAT_DEPTH_FACTOR = 0.75;

function getKeypoint(keypoints: Keypoint[], name: string): Keypoint | null {
  return keypoints.find((kp) => kp.name === name) ?? null;
}

function distance(p1: Keypoint, p2: Keypoint): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  const radians =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

function extractFrameData(keypoints: Keypoint[]): FrameData | null {
  const leftHip = getKeypoint(keypoints, 'left_hip');
  const rightHip = getKeypoint(keypoints, 'right_hip');
  const leftKnee = getKeypoint(keypoints, 'left_knee');
  const rightKnee = getKeypoint(keypoints, 'right_knee');
  const leftAnkle = getKeypoint(keypoints, 'left_ankle');
  const rightAnkle = getKeypoint(keypoints, 'right_ankle');
  const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
  const rightShoulder = getKeypoint(keypoints, 'right_shoulder');

  if (
    !leftHip ||
    !rightHip ||
    !leftKnee ||
    !rightKnee ||
    !leftAnkle ||
    !rightAnkle ||
    !leftShoulder ||
    !rightShoulder
  )
    return null;

  return {
    leftKneeAngle: calculateAngle(leftHip, leftKnee, leftAnkle),
    rightKneeAngle: calculateAngle(rightHip, rightKnee, rightAnkle),
    leftHipAngle: calculateAngle(leftShoulder, leftHip, leftKnee),
    rightHipAngle: calculateAngle(rightShoulder, rightHip, rightKnee),
    leftThighLength: distance(leftHip, leftKnee),
    rightThighLength: distance(rightHip, rightKnee),
    leftShinLength: distance(leftKnee, leftAnkle),
    rightShinLength: distance(rightKnee, rightAnkle),
  };
}

function average(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = average(values);
  const squareDiffs = values.map((val) => (val - avg) ** 2);
  return Math.sqrt(average(squareDiffs));
}

function calculateNoiseMargin(frames: FrameData[]): number {
  const leftKneeAngles = frames.map((f) => f.leftKneeAngle);
  const rightKneeAngles = frames.map((f) => f.rightKneeAngle);

  const leftStdDev = standardDeviation(leftKneeAngles);
  const rightStdDev = standardDeviation(rightKneeAngles);

  return Math.max(leftStdDev, rightStdDev) * 2;
}

export class CalibrationSession {
  private frames: FrameData[] = [];
  private isActive = false;

  start(): void {
    this.frames = [];
    this.isActive = true;
  }

  addFrame(keypoints: Keypoint[]): boolean {
    if (!this.isActive) return false;

    const frameData = extractFrameData(keypoints);
    if (!frameData) return false;

    this.frames.push(frameData);
    return this.frames.length >= MAX_FRAMES;
  }

  canFinish(): boolean {
    return this.frames.length >= MIN_FRAMES;
  }

  getProgress(): number {
    return Math.min(this.frames.length / MAX_FRAMES, 1);
  }

  finish(): CalibrationProfile | null {
    if (!this.canFinish()) return null;

    this.isActive = false;

    const avgLeftKnee = average(this.frames.map((f) => f.leftKneeAngle));
    const avgRightKnee = average(this.frames.map((f) => f.rightKneeAngle));
    const avgLeftHip = average(this.frames.map((f) => f.leftHipAngle));
    const avgRightHip = average(this.frames.map((f) => f.rightHipAngle));

    const noiseMargin = calculateNoiseMargin(this.frames);

    const topAngle = Math.max(avgLeftKnee, avgRightKnee) - noiseMargin;
    const bottomAngle = topAngle * SQUAT_DEPTH_FACTOR;

    return {
      limbLengths: {
        leftThigh: average(this.frames.map((f) => f.leftThighLength)),
        rightThigh: average(this.frames.map((f) => f.rightThighLength)),
        leftShin: average(this.frames.map((f) => f.leftShinLength)),
        rightShin: average(this.frames.map((f) => f.rightShinLength)),
      },
      baselineAngles: {
        leftKnee: avgLeftKnee,
        rightKnee: avgRightKnee,
        leftHip: avgLeftHip,
        rightHip: avgRightHip,
      },
      squatThresholds: {
        topAngle: Math.round(topAngle),
        bottomAngle: Math.round(bottomAngle),
        minDebounce: 100,
      },
      noiseMargin: Math.round(noiseMargin),
      createdAt: new Date().toISOString(),
    };
  }
}
