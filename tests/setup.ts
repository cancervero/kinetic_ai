import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock MediaDevices API
global.navigator.mediaDevices = {
  getUserMedia: vi.fn(),
  enumerateDevices: vi.fn(),
  getSupportedConstraints: vi.fn(),
  getDisplayMedia: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
} as any;

// Mock HTMLVideoElement
Object.defineProperty(HTMLVideoElement.prototype, 'readyState', {
  get: vi.fn(() => 4)
});

Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', {
  get: vi.fn(() => 640)
});

Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', {
  get: vi.fn(() => 480)
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb(0);
  return 0;
});

global.cancelAnimationFrame = vi.fn();
