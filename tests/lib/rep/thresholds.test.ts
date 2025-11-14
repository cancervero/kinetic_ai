import { describe, it, expect, beforeEach } from 'vitest';
import { getThresholds, setThresholds } from '@/lib/rep/thresholds';

describe('rep/thresholds', () => {
  describe('getThresholds', () => {
    it('should return squat thresholds', () => {
      const thresholds = getThresholds('squat');

      expect(thresholds).toHaveProperty('topAngle');
      expect(thresholds).toHaveProperty('bottomAngle');
      expect(thresholds).toHaveProperty('minDebounce');
    });

    it('should return pushup thresholds', () => {
      const thresholds = getThresholds('pushup');

      expect(thresholds).toHaveProperty('topAngle');
      expect(thresholds).toHaveProperty('bottomAngle');
      expect(thresholds).toHaveProperty('minDebounce');
    });

    it('should have valid squat angle ranges', () => {
      const thresholds = getThresholds('squat');

      expect(thresholds.topAngle).toBeGreaterThan(thresholds.bottomAngle);
      expect(thresholds.topAngle).toBeLessThanOrEqual(180);
      expect(thresholds.bottomAngle).toBeGreaterThanOrEqual(0);
    });

    it('should have valid pushup angle ranges', () => {
      const thresholds = getThresholds('pushup');

      expect(thresholds.topAngle).toBeGreaterThan(thresholds.bottomAngle);
      expect(thresholds.topAngle).toBeLessThanOrEqual(180);
      expect(thresholds.bottomAngle).toBeGreaterThanOrEqual(0);
    });

    it('should have positive debounce times', () => {
      const squatThresholds = getThresholds('squat');
      const pushupThresholds = getThresholds('pushup');

      expect(squatThresholds.minDebounce).toBeGreaterThan(0);
      expect(pushupThresholds.minDebounce).toBeGreaterThan(0);
    });
  });

  describe('setThresholds', () => {
    beforeEach(() => {
      // Reset to defaults
      setThresholds('squat', {
        topAngle: 165,
        bottomAngle: 100,
        minDebounce: 100
      });
    });

    it('should update topAngle', () => {
      setThresholds('squat', { topAngle: 170 });
      const thresholds = getThresholds('squat');

      expect(thresholds.topAngle).toBe(170);
    });

    it('should update bottomAngle', () => {
      setThresholds('squat', { bottomAngle: 80 });
      const thresholds = getThresholds('squat');

      expect(thresholds.bottomAngle).toBe(80);
    });

    it('should update minDebounce', () => {
      setThresholds('squat', { minDebounce: 150 });
      const thresholds = getThresholds('squat');

      expect(thresholds.minDebounce).toBe(150);
    });

    it('should update multiple values', () => {
      setThresholds('squat', {
        topAngle: 165,
        bottomAngle: 85
      });
      const thresholds = getThresholds('squat');

      expect(thresholds.topAngle).toBe(165);
      expect(thresholds.bottomAngle).toBe(85);
    });

    it('should preserve other values when updating one', () => {
      const original = getThresholds('squat');
      setThresholds('squat', { topAngle: 170 });
      const updated = getThresholds('squat');

      expect(updated.bottomAngle).toBe(original.bottomAngle);
      expect(updated.minDebounce).toBe(original.minDebounce);
    });

    it('should work independently for different exercises', () => {
      setThresholds('squat', { topAngle: 170 });
      setThresholds('pushup', { topAngle: 165 });

      expect(getThresholds('squat').topAngle).toBe(170);
      expect(getThresholds('pushup').topAngle).toBe(165);
    });
  });
});
