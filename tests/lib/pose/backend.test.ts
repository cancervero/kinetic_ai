import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectCapabilities,
  selectBackend,
  getRecommendedBackend
} from '@/lib/pose/backend';

describe('pose/backend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectCapabilities', () => {
    it('should detect GPU capability', () => {
      const caps = detectCapabilities();
      expect(caps).toHaveProperty('gpu');
      expect(typeof caps.gpu).toBe('boolean');
    });

    it('should detect mobile device', () => {
      const caps = detectCapabilities();
      expect(caps).toHaveProperty('mobile');
      expect(typeof caps.mobile).toBe('boolean');
    });

    it('should detect WebGL support', () => {
      const caps = detectCapabilities();
      expect(caps).toHaveProperty('webgl');
      expect(typeof caps.webgl).toBe('boolean');
    });
  });

  describe('selectBackend', () => {
    it('should select movenet for mobile', () => {
      const backend = selectBackend({
        gpu: true,
        mobile: true,
        webgl: true
      });
      expect(backend).toBe('movenet');
    });

    it('should select movenet for desktop without GPU', () => {
      const backend = selectBackend({
        gpu: false,
        mobile: false,
        webgl: true
      });
      expect(backend).toBe('movenet');
    });

    it('should select movenet for desktop with GPU', () => {
      const backend = selectBackend({
        gpu: true,
        mobile: false,
        webgl: true
      });
      expect(backend).toBe('movenet');
    });
  });

  describe('getRecommendedBackend', () => {
    it('should return a valid backend type', () => {
      const backend = getRecommendedBackend();
      expect(['movenet', 'mediapipe']).toContain(backend);
    });

    it('should return movenet by default', () => {
      const backend = getRecommendedBackend();
      expect(backend).toBe('movenet');
    });
  });
});
