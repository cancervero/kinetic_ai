import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { createMockVideo } from '../mockData/mocks';

//Mock pose module
vi.mock('@/lib/pose', () => {
  const mockDetector = { estimatePoses: vi.fn() };
  const mockPose = {
    keypoints: [],
    score: 0.9
  };

  return {
    loadDetector: vi.fn(() => Promise.resolve(mockDetector)),
    runInference: vi.fn(() => Promise.resolve(mockPose)),
    createSmoother: vi.fn(() => ({ smooth: vi.fn() })),
    smoothPose: vi.fn((pose) => pose)
  };
});

describe('hooks/usePoseDetection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requestAnimationFrame to prevent infinite loops
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize with loading state', () => {
    const videoRef = { current: null };
    const { result } = renderHook(() =>
      usePoseDetection(videoRef, false)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.pose).toBeNull();
  });

  it('should not load detector if not ready', async () => {
    const videoRef = { current: null };
    const { loadDetector } = await vi.importMock<typeof import('@/lib/pose')>('@/lib/pose');

    renderHook(() => usePoseDetection(videoRef, false));

    expect(loadDetector).not.toHaveBeenCalled();
  });

  it('should load detector when ready', async () => {
    const video = createMockVideo();
    const videoRef = { current: video };
    const { loadDetector } = await vi.importMock<typeof import('@/lib/pose')>('@/lib/pose');

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
    const { loadDetector } = await vi.importMock<typeof import('@/lib/pose')>('@/lib/pose');
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
