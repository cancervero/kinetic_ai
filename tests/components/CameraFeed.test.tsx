import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CameraFeed } from '@/components/CameraFeed';
import { createMockStream } from '../mockData/mocks';

// Mock useCamera hook
vi.mock('@/hooks', () => ({
  useCamera: vi.fn(() => ({
    videoRef: { current: null },
    isReady: false,
    error: null
  }))
}));

describe('components/CameraFeed', () => {
  it('should render video element', () => {
    render(<CameraFeed />);
    const video = document.querySelector('video');
    expect(video).toBeTruthy();
  });

  it('should apply correct video attributes', () => {
    render(<CameraFeed />);
    const video = document.querySelector('video');

    expect(video?.autoplay).toBe(true);
    expect(video?.muted).toBe(true);
  });

  it('should display error message on camera error', async () => {
    const { useCamera } = await vi.importMock<typeof import('@/hooks')>('@/hooks');
    useCamera.mockReturnValue({
      videoRef: { current: null },
      isReady: false,
      error: 'Camera permission denied'
    });

    render(<CameraFeed />);

    expect(screen.getByText(/Camera Error/i)).toBeTruthy();
    expect(screen.getByText(/permission denied/i)).toBeTruthy();
  });

  it('should call onVideoRef callback', () => {
    const onVideoRef = vi.fn();
    render(<CameraFeed onVideoRef={onVideoRef} />);

    expect(onVideoRef).toHaveBeenCalled();
  });

  it('should call onReady callback when ready', async () => {
    const { useCamera } = await vi.importMock<typeof import('@/hooks')>('@/hooks');
    useCamera.mockReturnValue({
      videoRef: { current: document.createElement('video') },
      isReady: true,
      error: null
    });

    const onReady = vi.fn();
    render(<CameraFeed onReady={onReady} />);

    expect(onReady).toHaveBeenCalledWith(true);
  });

  it('should not call onReady when not ready', async () => {
    const { useCamera } = await vi.importMock<typeof import('@/hooks')>('@/hooks');
    useCamera.mockReturnValue({
      videoRef: { current: null },
      isReady: false,
      error: null
    });

    const onReady = vi.fn();
    render(<CameraFeed onReady={onReady} />);

    expect(onReady).not.toHaveBeenCalled();
  });

  it('should have camera-feed class', () => {
    render(<CameraFeed />);
    const video = document.querySelector('.camera-feed');
    expect(video).toBeTruthy();
  });

  it('should handle no callbacks gracefully', () => {
    expect(() => render(<CameraFeed />)).not.toThrow();
  });
});
