import { describe, it, expect, vi } from 'vitest';
import {
  runInference,
  getVideoAspectRatio,
  getVideoDimensions
} from '@/lib/pose/inference';
import { createMockDetector, createMockVideo } from '../../mockData/mocks';
import { mockSquatTopPose } from '../../mockData/poses';

describe('pose/inference', () => {
  describe('runInference', () => {
    it('should return null if video not ready', async () => {
      const detector = createMockDetector();
      const video = createMockVideo();
      Object.defineProperty(video, 'readyState', { value: 0 });

      const result = await runInference(detector, video);

      expect(result).toBeNull();
      expect(detector.estimatePoses).not.toHaveBeenCalled();
    });

    it('should return null if video has no dimensions', async () => {
      const detector = createMockDetector();
      const video = createMockVideo();
      Object.defineProperty(video, 'videoWidth', { value: 0 });

      const result = await runInference(detector, video);

      expect(result).toBeNull();
    });

    it('should run inference on ready video', async () => {
      const detector = createMockDetector();
      detector.estimatePoses = vi.fn().mockResolvedValue([mockSquatTopPose]);
      const video = createMockVideo();

      const result = await runInference(detector, video);

      expect(detector.estimatePoses).toHaveBeenCalledWith(video);
      expect(result).toEqual(mockSquatTopPose);
    });

    it('should return null if no poses detected', async () => {
      const detector = createMockDetector();
      detector.estimatePoses = vi.fn().mockResolvedValue([]);
      const video = createMockVideo();

      const result = await runInference(detector, video);

      expect(result).toBeNull();
    });

    it('should return first pose if multiple detected', async () => {
      const detector = createMockDetector();
      const pose1 = mockSquatTopPose;
      const pose2 = { ...mockSquatTopPose, score: 0.5 };
      detector.estimatePoses = vi.fn().mockResolvedValue([pose1, pose2]);
      const video = createMockVideo();

      const result = await runInference(detector, video);

      expect(result).toEqual(pose1);
    });
  });

  describe('getVideoAspectRatio', () => {
    it('should calculate correct aspect ratio', () => {
      const video = createMockVideo();
      const ratio = getVideoAspectRatio(video);

      expect(ratio).toBe(640 / 480);
      expect(ratio).toBeCloseTo(1.333, 2);
    });

    it('should handle different dimensions', () => {
      const video = createMockVideo();
      Object.defineProperty(video, 'videoWidth', { value: 1920 });
      Object.defineProperty(video, 'videoHeight', { value: 1080 });

      const ratio = getVideoAspectRatio(video);

      expect(ratio).toBeCloseTo(1.777, 2);
    });
  });

  describe('getVideoDimensions', () => {
    it('should return video dimensions', () => {
      const video = createMockVideo();
      const dims = getVideoDimensions(video);

      expect(dims.width).toBe(640);
      expect(dims.height).toBe(480);
    });

    it('should return correct dimensions for different sizes', () => {
      const video = createMockVideo();
      Object.defineProperty(video, 'videoWidth', { value: 1280 });
      Object.defineProperty(video, 'videoHeight', { value: 720 });

      const dims = getVideoDimensions(video);

      expect(dims.width).toBe(1280);
      expect(dims.height).toBe(720);
    });
  });
});
