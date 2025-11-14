import { Keypoint, Pose } from './types';

const DEFAULT_ALPHA = 0.3;

class KeypointSmoother {
  private history: Map<string, Keypoint> = new Map();
  private alpha: number;

  constructor(alpha = DEFAULT_ALPHA) {
    this.alpha = alpha;
  }

  smooth(keypoints: Keypoint[]): Keypoint[] {
    return keypoints.map((kp, idx) => this.smoothPoint(kp, idx));
  }

  private smoothPoint(current: Keypoint, index: number): Keypoint {
    const key = `${index}`;
    const prev = this.history.get(key);

    if (!prev) {
      this.history.set(key, current);
      return current;
    }

    const smoothed = {
      x: this.ema(prev.x, current.x),
      y: this.ema(prev.y, current.y),
      score: current.score,
      name: current.name
    };

    this.history.set(key, smoothed);
    return smoothed;
  }

  private ema(prev: number, current: number): number {
    return this.alpha * current + (1 - this.alpha) * prev;
  }

  reset(): void {
    this.history.clear();
  }
}

export function createSmoother(alpha?: number): KeypointSmoother {
  return new KeypointSmoother(alpha);
}

export function smoothPose(pose: Pose, smoother: KeypointSmoother): Pose {
  return {
    ...pose,
    keypoints: smoother.smooth(pose.keypoints)
  };
}
