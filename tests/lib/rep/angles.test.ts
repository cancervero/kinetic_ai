import { describe, it, expect } from 'vitest';
import {
  calculateAngle,
  getKeypointByName,
  distance
} from '@/lib/rep/angles';
import { Keypoint } from '@/lib/pose/types';

describe('rep/angles', () => {
  describe('calculateAngle', () => {
    it('should calculate 90 degree angle', () => {
      const a: Keypoint = { x: 0, y: 0, score: 0.9 };
      const b: Keypoint = { x: 0, y: 100, score: 0.9 };
      const c: Keypoint = { x: 100, y: 100, score: 0.9 };

      const angle = calculateAngle(a, b, c);

      expect(angle).toBeCloseTo(90, 1);
    });

    it('should calculate 180 degree angle', () => {
      const a: Keypoint = { x: 0, y: 100, score: 0.9 };
      const b: Keypoint = { x: 100, y: 100, score: 0.9 };
      const c: Keypoint = { x: 200, y: 100, score: 0.9 };

      const angle = calculateAngle(a, b, c);

      expect(angle).toBeCloseTo(180, 1);
    });

    it('should calculate 45 degree angle', () => {
      const a: Keypoint = { x: 0, y: 0, score: 0.9 };
      const b: Keypoint = { x: 100, y: 0, score: 0.9 };
      const c: Keypoint = { x: 100, y: 100, score: 0.9 };

      const angle = calculateAngle(a, b, c);

      expect(angle).toBeCloseTo(90, 1);
    });

    it('should handle negative coordinates', () => {
      const a: Keypoint = { x: -100, y: 0, score: 0.9 };
      const b: Keypoint = { x: 0, y: 0, score: 0.9 };
      const c: Keypoint = { x: 0, y: 100, score: 0.9 };

      const angle = calculateAngle(a, b, c);

      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(180);
    });

    it('should return angle between 0 and 180', () => {
      const a: Keypoint = { x: 10, y: 20, score: 0.9 };
      const b: Keypoint = { x: 50, y: 60, score: 0.9 };
      const c: Keypoint = { x: 90, y: 30, score: 0.9 };

      const angle = calculateAngle(a, b, c);

      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThanOrEqual(180);
    });
  });

  describe('getKeypointByName', () => {
    it('should find keypoint by name', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'nose' },
        { x: 150, y: 250, score: 0.8, name: 'left_hip' }
      ];

      const kp = getKeypointByName(keypoints, 'left_hip');

      expect(kp).toBeDefined();
      expect(kp?.x).toBe(150);
      expect(kp?.y).toBe(250);
    });

    it('should return undefined for non-existent name', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'nose' }
      ];

      const kp = getKeypointByName(keypoints, 'left_elbow');

      expect(kp).toBeUndefined();
    });

    it('should return first match for duplicate names', () => {
      const keypoints: Keypoint[] = [
        { x: 100, y: 200, score: 0.9, name: 'nose' },
        { x: 150, y: 250, score: 0.8, name: 'nose' }
      ];

      const kp = getKeypointByName(keypoints, 'nose');

      expect(kp?.x).toBe(100);
    });
  });

  describe('distance', () => {
    it('should calculate horizontal distance', () => {
      const a: Keypoint = { x: 0, y: 0, score: 0.9 };
      const b: Keypoint = { x: 100, y: 0, score: 0.9 };

      const dist = distance(a, b);

      expect(dist).toBe(100);
    });

    it('should calculate vertical distance', () => {
      const a: Keypoint = { x: 0, y: 0, score: 0.9 };
      const b: Keypoint = { x: 0, y: 100, score: 0.9 };

      const dist = distance(a, b);

      expect(dist).toBe(100);
    });

    it('should calculate diagonal distance', () => {
      const a: Keypoint = { x: 0, y: 0, score: 0.9 };
      const b: Keypoint = { x: 3, y: 4, score: 0.9 };

      const dist = distance(a, b);

      expect(dist).toBe(5);
    });

    it('should return 0 for same point', () => {
      const a: Keypoint = { x: 100, y: 200, score: 0.9 };
      const b: Keypoint = { x: 100, y: 200, score: 0.9 };

      const dist = distance(a, b);

      expect(dist).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const a: Keypoint = { x: -50, y: -50, score: 0.9 };
      const b: Keypoint = { x: 50, y: 50, score: 0.9 };

      const dist = distance(a, b);

      expect(dist).toBeCloseTo(141.42, 1);
    });
  });
});
