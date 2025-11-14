import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCamera } from '@/hooks/useCamera';
import { createMockStream } from '../mockData/mocks';

describe('hooks/useCamera', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with not ready state', () => {
    const { result } = renderHook(() => useCamera());

    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.videoRef.current).toBeNull();
  });

  it('should request camera permissions', async () => {
    const mockStream = createMockStream();
    const getUserMedia = vi.fn().mockResolvedValue(mockStream);
    global.navigator.mediaDevices.getUserMedia = getUserMedia;

    renderHook(() => useCamera());

    await waitFor(() => {
      expect(getUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
    });
  });

  it('should set error on camera failure', async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new Error('Camera not found'));
    global.navigator.mediaDevices.getUserMedia = getUserMedia;

    const { result } = renderHook(() => useCamera());

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('should handle permission denied', async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new Error('Permission denied'));
    global.navigator.mediaDevices.getUserMedia = getUserMedia;

    const { result } = renderHook(() => useCamera());

    await waitFor(() => {
      expect(result.current.error).toContain('Permission denied');
    });
  });

  it('should cleanup on unmount', async () => {
    const mockStream = createMockStream();
    const track = mockStream.getTracks()[0];
    const getUserMedia = vi.fn().mockResolvedValue(mockStream);
    global.navigator.mediaDevices.getUserMedia = getUserMedia;

    const { unmount } = renderHook(() => useCamera());

    await waitFor(() => {
      expect(getUserMedia).toHaveBeenCalled();
    });

    unmount();

    expect(track.stop).toHaveBeenCalled();
  });

  it('should provide video ref', () => {
    const { result } = renderHook(() => useCamera());

    expect(result.current.videoRef).toBeDefined();
    expect(result.current.videoRef.current).toBeNull();
  });
});
