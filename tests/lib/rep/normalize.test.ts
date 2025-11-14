import { describe, it, expect } from 'vitest';
import {
  getTorsoHeight,
  normalizeKeypoints,
  isValidPose
} from '@/lib/rep/normalize';
import { Keypoint } from '@/lib/pose/types';

describe('rep/normalize', () => {
  describe('getTorsoHeight', () => {
    it('should calculate torso height from shoulder to hip', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 100, score: 0.9, name: 'left_shoulder' },
        { x: 100, y: 200, score: 0.9, name: 'left_hip' }
      ];

      const height = getTorsoHeight(keypoints);

      expect(height).toBe(100);
    });

    it('should return 1 if shoulder not found', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'left_hip' }
      ];

      const height = getTorsoHeight(keypoints);

      expect(height).toBe(1);
    });

    it('should return 1 if hip not found', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 100, score: 0.9, name: 'left_shoulder' }
      ];

      const height = getTorsoHeight(keypoints);

      expect(height).toBe(1);
    });

    it('should handle diagonal torso', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 100, score: 0.9, name: 'left_shoulder' },
        { x: 150, y: 200, score: 0.9, name: 'left_hip' }
      ];

      const height = getTorsoHeight(keypoints);

      expect(height).toBeCloseTo(111.8, 1);
    });
  });

  describe('normalizeKeypoints', () => {
    it('should normalize keypoints by torso height', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'nose' },
        { x: 200, y: 400, score: 0.8, name: 'hip' }
      ];

      const normalized = normalizeKeypoints(keypoints, 100);

      expect(normalized[0].x).toBe(1);
      expect(normalized[0].y).toBe(2);
      expect(normalized[1].x).toBe(2);
      expect(normalized[1].y).toBe(4);
    });

    it('should preserve score and name', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.85, name: 'left_knee' }
      ];

      const normalized = normalizeKeypoints(keypoints, 50);

      expect(normalized[0].score).toBe(0.85);
      expect(normalized[0].name).toBe('left_knee');
    });

    it('should handle torso height of 1', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9 }
      ];

      const normalized = normalizeKeypoints(keypoints, 1);

      expect(normalized[0].x).toBe(100);
      expect(normalized[0].y).toBe(200);
    });

    it('should normalize all keypoints', () => {
      const keypoints: Keypoint[] = [
        { x: 50, y: 100, score: 0.9 },
        { x: 100, y: 200, score: 0.8 },
        { x: 150, y: 300, score: 0.7 }
      ];

      const normalized = normalizeKeypoints(keypoints, 50);

      expect(normalized).toHaveLength(3);
      expect(normalized[0].x).toBe(1);
      expect(normalized[1].x).toBe(2);
      expect(normalized[2].x).toBe(3);
    });
  });

  describe('isValidPose', () => {
    it('should return true for high score keypoints', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9 },
        { x: 150, y: 250, score: 0.8 }
      ];

      const valid = isValidPose(keypoints, 0.3);

      expect(valid).toBe(true);
    });

    it('should return false if any keypoint below threshold', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9 },
        { x: 150, y: 250, score: 0.2 }
      ];

      const valid = isValidPose(keypoints, 0.3);

      expect(valid).toBe(false);
    });

    it('should use default threshold of 0.3', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.35 }
      ];

      const valid = isValidPose(keypoints);

      expect(valid).toBe(true);
    });

    it('should handle keypoints without score', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200 }
      ];

      const valid = isValidPose(keypoints);

      expect(valid).toBe(true);
    });

    it('should return true for empty array', () => {
      const valid = isValidPose([]);

      expect(valid).toBe(true);
    });
  });
});
