import { describe, it, expect, beforeEach } from 'vitest';
import { SquatDetector, createSquatDetector } from '@/lib/rep/exercises/squat';
import {
  mockSquatTopPose,
  mockSquatBottomPose,
  mockLowScorePose
} from '../../../mockData/poses';

describe('rep/exercises/squat', () => {
  describe('createSquatDetector', () => {
    it('should create a SquatDetector instance', () => {
      const detector = createSquatDetector();

      expect(detector).toBeDefined();
      expect(detector.detect).toBeDefined();
      expect(detector.reset).toBeDefined();
    });
  });

  describe('SquatDetector', () => {
    let detector: SquatDetector;

    beforeEach(() => {
      detector = new SquatDetector();
    });

    describe('detect', () => {
      it('should return idle count for missing keypoints', () => {
        const result = detector.detect([], Date.now());

        expect(result.state).toBe('idle');
        expect(result.count).toBe(0);
      });

      it('should detect top position', () => {
        const result = detector.detect(mockSquatTopPose.keypoints, 0);

        expect(result.state).toBe('top');
      });

      it('should detect bottom position', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        const result = detector.detect(mockSquatBottomPose.keypoints, 200);

        expect(result.state).toBe('bottom');
      });

      it('should count complete rep', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        detector.detect(mockSquatBottomPose.keypoints, 200);
        const result = detector.detect(mockSquatTopPose.keypoints, 400);

        expect(result.count).toBe(1);
        expect(result.state).toBe('top');
      });

      it('should count multiple reps', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        detector.detect(mockSquatBottomPose.keypoints, 200);
        detector.detect(mockSquatTopPose.keypoints, 400);
        detector.detect(mockSquatBottomPose.keypoints, 600);
        const result = detector.detect(mockSquatTopPose.keypoints, 800);

        expect(result.count).toBe(2);
      });

      it('should handle low confidence poses', () => {
        const result = detector.detect(mockLowScorePose.keypoints, 0);

        expect(result).toBeDefined();
      });

      it('should use left knee angle', () => {
        const keypoints = mockSquatTopPose.keypoints.filter(
          kp => !kp.name?.startsWith('right')
        );

        const result = detector.detect(keypoints, 0);

        expect(result.state).not.toBe('idle');
      });

      it('should return idle if knee keypoints missing', () => {
        const keypoints = mockSquatTopPose.keypoints.filter(
          kp => kp.name !== 'left_knee'
        );

        const result = detector.detect(keypoints, 0);

        expect(result.state).toBe('idle');
        expect(result.count).toBe(0);
      });
    });

    describe('reset', () => {
      it('should reset counter', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        detector.detect(mockSquatBottomPose.keypoints, 200);
        detector.detect(mockSquatTopPose.keypoints, 400);

        detector.reset();
        const result = detector.detect(mockSquatTopPose.keypoints, 600);

        expect(result.count).toBe(0);
      });

      it('should reset state', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        detector.reset();

        const result = detector.detect(
          mockSquatBottomPose.keypoints,
          200
        );

        expect(result.state).not.toBe('top');
      });
    });

    describe('integration', () => {
      it('should follow complete rep lifecycle', () => {
        const r1 = detector.detect(mockSquatTopPose.keypoints, 0);
        expect(r1.state).toBe('top');
        expect(r1.count).toBe(0);

        const r2 = detector.detect(mockSquatBottomPose.keypoints, 200);
        expect(r2.state).toBe('bottom');
        expect(r2.count).toBe(0);

        const r3 = detector.detect(mockSquatTopPose.keypoints, 400);
        expect(r3.state).toBe('top');
        expect(r3.count).toBe(1);
      });

      it('should not count incomplete reps', () => {
        detector.detect(mockSquatTopPose.keypoints, 0);
        detector.detect(mockSquatTopPose.keypoints, 200);
        const result = detector.detect(mockSquatTopPose.keypoints, 400);

        expect(result.count).toBe(0);
      });
    });
  });
});
