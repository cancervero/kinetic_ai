import { describe, it, expect, beforeEach } from 'vitest';
import { createSmoother, smoothPose } from '@/lib/pose/smoothing';
import { Keypoint, Pose } from '@/lib/pose/types';

describe('pose/smoothing', () => {
  describe('createSmoother', () => {
    it('should create smoother with default alpha', () => {
      const smoother = createSmoother();
      expect(smoother).toBeDefined();
      expect(smoother.smooth).toBeDefined();
      expect(smoother.reset).toBeDefined();
    });

    it('should create smoother with custom alpha', () => {
      const smoother = createSmoother(0.5);
      expect(smoother).toBeDefined();
    });
  });

  describe('KeypointSmoother', () => {
    it('should return same keypoint on first call', () => {
      const smoother = createSmoother();
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'nose' }
      ];

      const smoothed = smoother.smooth(keypoints);

      expect(smoothed[0].x).toBe(100);
      expect(smoothed[0].y).toBe(200);
    });

    it('should smooth keypoints on subsequent calls', () => {
      const smoother = createSmoother(0.5);
      const kp1: Keypoint[] = [{ x: 100, y: 200, score: 0.9 }];
      const kp2: Keypoint[] = [{ x: 120, y: 220, score: 0.9 }];

      smoother.smooth(kp1);
      const smoothed = smoother.smooth(kp2);

      expect(smoothed[0].x).toBeGreaterThan(100);
      expect(smoothed[0].x).toBeLessThan(120);
      expect(smoothed[0].y).toBeGreaterThan(200);
      expect(smoothed[0].y).toBeLessThan(220);
    });

    it('should preserve score and name', () => {
      const smoother = createSmoother();
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.85, name: 'left_hip' }
      ];

      const smoothed = smoother.smooth(keypoints);

      expect(smoothed[0].score).toBe(0.85);
      expect(smoothed[0].name).toBe('left_hip');
    });

    it('should reset history', () => {
      const smoother = createSmoother();
      const kp1: Keypoint[] = [{ x: 100, y: 200, score: 0.9 }];
      const kp2: Keypoint[] = [{ x: 120, y: 220, score: 0.9 }];

      smoother.smooth(kp1);
      smoother.reset();
      const smoothed = smoother.smooth(kp2);

      expect(smoothed[0].x).toBe(120);
      expect(smoothed[0].y).toBe(220);
    });
  });

  describe('smoothPose', () => {
    it('should smooth all keypoints in pose', () => {
      const smoother = createSmoother();
      const pose: Pose = {
        keypoints: [
          { x: 100, y: 200, score: 0.9 },
          { x: 150, y: 250, score: 0.8 }
        ],
        score: 0.85
      };

      const smoothed = smoothPose(pose, smoother);

      expect(smoothed.keypoints).toHaveLength(2);
      expect(smoothed.score).toBe(0.85);
    });

    it('should preserve pose structure', () => {
      const smoother = createSmoother();
      const pose: Pose = {
        keypoints: [{ x: 100, y: 200, score: 0.9, name: 'nose' }],
        score: 0.9
      };

      const smoothed = smoothPose(pose, smoother);

      expect(smoothed).toHaveProperty('keypoints');
      expect(smoothed).toHaveProperty('score');
      expect(smoothed.keypoints[0]).toHaveProperty('name');
    });
  });
});
