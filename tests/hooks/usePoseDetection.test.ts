import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { createMockDetector, createMockVideo } from '../mockData/mocks';
import { mockSquatTopPose } from '../mockData/poses';
import { useRef } from 'react';

// Mock pose loader
vi.mock('@/lib/pose', () => ({
  loadDetector: vi.fn().mockResolvedValue(createMockDetector()),
  runInference: vi.fn().mockResolvedValue(mockSquatTopPose),
  createSmoother: vi.fn(() => ({
    smooth: vi.fn((kps) => kps)
  })),
  smoothPose: vi.fn((pose) => pose)
}));

describe('hooks/usePoseDetection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const videoRef = { current: null };
    const { result } = renderHook(() =>
      usePoseDetection(videoRef, false)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.pose).toBeNull();
  });

  it('should not load detector if not ready', () => {
    const { loadDetector } = require('@/lib/pose');
    const videoRef = { current: null };

    renderHook(() => usePoseDetection(videoRef, false));

    expect(loadDetector).not.toHaveBeenCalled();
  });

  it('should load detector when ready', async () => {
    const { loadDetector } = require('@/lib/pose');
    const video = createMockVideo();
    const videoRef = { current: video };

    renderHook(() => usePoseDetection(videoRef, true));

    await waitFor(() => {
      expect(loadDetector).toHaveBeenCalled();
    });
  });

  it('should update loading state after detector loads', async () => {
    const video = createMockVideo();
    const videoRef = { current: video };

    const { result } = renderHook(() =>
      usePoseDetection(videoRef, true)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle detector load failure', async () => {
    const { loadDetector } = require('@/lib/pose');
    loadDetector.mockRejectedValueOnce(new Error('Load failed'));

    const video = createMockVideo();
    const videoRef = { current: video };

    const { result } = renderHook(() =>
      usePoseDetection(videoRef, true)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
  });

  it('should cancel animation frame on unmount', async () => {
    const cancelAnimationFrame = vi.spyOn(
      global,
      'cancelAnimationFrame'
    );
    const video = createMockVideo();
    const videoRef = { current: video };

    const { unmount } = renderHook(() =>
      usePoseDetection(videoRef, true)
    );

    await waitFor(() => {
      expect(cancelAnimationFrame).not.toHaveBeenCalled();
    });

    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
