import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRepCounter } from '@/hooks/useRepCounter';
import {
  mockSquatTopPose,
  mockSquatBottomPose
} from '../mockData/poses';

describe('hooks/useRepCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('initialization', () => {
    it('should initialize with zero count', () => {
      const { result } = renderHook(() =>
        useRepCounter(null, 'squat')
      );

      expect(result.current.count).toBe(0);
      expect(result.current.state).toBe('idle');
    });

    it('should accept squat exercise type', () => {
      const { result } = renderHook(() =>
        useRepCounter(null, 'squat')
      );

      expect(result.current).toBeDefined();
    });

    it('should accept pushup exercise type', () => {
      const { result } = renderHook(() =>
        useRepCounter(null, 'pushup')
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('pose detection', () => {
    it('should not update for null pose', () => {
      const { result } = renderHook(() =>
        useRepCounter(null, 'squat')
      );

      expect(result.current.count).toBe(0);
    });

    it('should detect top position', () => {
      const { result, rerender } = renderHook(
        ({ pose }) => useRepCounter(pose, 'squat'),
        { initialProps: { pose: null } }
      );

      rerender({ pose: mockSquatTopPose });

      expect(result.current.state).toBe('top');
    });

    it('should detect bottom position', () => {
      const { result, rerender } = renderHook(
        ({ pose }) => useRepCounter(pose, 'squat'),
        { initialProps: { pose: null } }
      );

      rerender({ pose: mockSquatTopPose });
      vi.advanceTimersByTime(150);
      rerender({ pose: mockSquatBottomPose });

      expect(result.current.state).toBe('bottom');
    });

    it('should count complete rep', () => {
      const { result, rerender } = renderHook(
        ({ pose }) => useRepCounter(pose, 'squat'),
        { initialProps: { pose: null } }
      );

      rerender({ pose: mockSquatTopPose });
      vi.advanceTimersByTime(150);
      rerender({ pose: mockSquatBottomPose });
      vi.advanceTimersByTime(150);
      rerender({ pose: mockSquatTopPose });

      expect(result.current.count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exercise switching', () => {
    it('should reset on exercise change', () => {
      const { result, rerender } = renderHook(
        ({ exercise }) => useRepCounter(mockSquatTopPose, exercise),
        { initialProps: { exercise: 'squat' as const } }
      );

      rerender({ exercise: 'pushup' });

      expect(result.current.count).toBe(0);
    });

    it('should create new detector for new exercise', () => {
      const { result, rerender } = renderHook(
        ({ exercise }) => useRepCounter(null, exercise),
        { initialProps: { exercise: 'squat' as const } }
      );

      const initialResult = result.current;

      rerender({ exercise: 'pushup' });

      expect(result.current).toBeDefined();
    });
  });

  describe('cleanup', () => {
    it('should cleanup detector on unmount', () => {
      const { unmount } = renderHook(() =>
        useRepCounter(null, 'squat')
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle missing keypoints', () => {
      const poseWithoutKeypoints = {
        ...mockSquatTopPose,
        keypoints: []
      };

      const { result } = renderHook(() =>
        useRepCounter(poseWithoutKeypoints, 'squat')
      );

      expect(result.current.state).toBe('idle');
    });

    it('should handle partial keypoints', () => {
      const partialPose = {
        ...mockSquatTopPose,
        keypoints: mockSquatTopPose.keypoints.slice(0, 5)
      };

      const { result } = renderHook(() =>
        useRepCounter(partialPose, 'squat')
      );

      expect(result.current).toBeDefined();
    });
  });
});
