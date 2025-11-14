import { describe, it, expect, vi, beforeEach } from 'vitest';
import { disposeDetector, isDetectorLoaded } from '@/lib/pose/loader';

// Mock TensorFlow.js
vi.mock('@tensorflow/tfjs-backend-webgl', () => ({}));
vi.mock('@tensorflow-models/pose-detection', () => ({
  createDetector: vi.fn().mockResolvedValue({
    estimatePoses: vi.fn(),
    dispose: vi.fn()
  }),
  SupportedModels: {
    MoveNet: 'MoveNet'
  },
  movenet: {
    modelType: {
      LIGHTNING: 'lightning',
      THUNDER: 'thunder'
    }
  }
}));

describe('pose/loader', () => {
  beforeEach(() => {
    disposeDetector();
  });

  describe('isDetectorLoaded', () => {
    it('should return false initially', () => {
      expect(isDetectorLoaded()).toBe(false);
    });
  });

  describe('disposeDetector', () => {
    it('should not throw when no detector loaded', () => {
      expect(() => disposeDetector()).not.toThrow();
    });

    it('should clear detector reference', () => {
      disposeDetector();
      expect(isDetectorLoaded()).toBe(false);
    });
  });
});
