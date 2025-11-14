import { vi } from 'vitest';
import { PoseDetector } from '@/lib/pose/types';

export const createMockDetector = (): PoseDetector => ({
  estimatePoses: vi.fn().mockResolvedValue([]),
  dispose: vi.fn()
});

export const createMockVideo = (): HTMLVideoElement => {
  const video = document.createElement('video');
  Object.defineProperty(video, 'readyState', {
    writable: true,
    value: 4
  });
  Object.defineProperty(video, 'videoWidth', {
    writable: true,
    value: 640
  });
  Object.defineProperty(video, 'videoHeight', {
    writable: true,
    value: 480
  });
  return video;
};

export const createMockStream = (): MediaStream => {
  const track = {
    stop: vi.fn(),
    enabled: true,
    id: 'mock-track',
    kind: 'video',
    label: 'mock camera'
  } as any;

  return {
    getTracks: vi.fn(() => [track]),
    getVideoTracks: vi.fn(() => [track]),
    getAudioTracks: vi.fn(() => []),
    id: 'mock-stream'
  } as any;
};
