import { describe, it, expect, beforeEach } from 'vitest';
import { RepStateMachine } from '@/lib/rep/state-machine';

describe('rep/state-machine', () => {
  const defaultThresholds = {
    topAngle: 170,
    bottomAngle: 100,
    minDebounce: 100
  };

  describe('constructor', () => {
    it('should initialize with idle state', () => {
      const machine = new RepStateMachine(defaultThresholds);
      const count = machine.update(120, 0);

      expect(count.state).toBe('idle');
      expect(count.count).toBe(0);
    });
  });

  describe('state transitions', () => {
    it('should transition from idle to top', () => {
      const machine = new RepStateMachine(defaultThresholds);

      const count = machine.update(165, 0);

      expect(count.state).toBe('top');
      expect(count.count).toBe(0);
    });

    it('should transition from top to bottom', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      const count = machine.update(85, 150);

      expect(count.state).toBe('bottom');
      expect(count.count).toBe(0);
    });

    it('should increment count on bottom to top transition', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      machine.update(85, 150);
      const count = machine.update(165, 300);

      expect(count.state).toBe('top');
      expect(count.count).toBe(1);
    });

    it('should count multiple reps', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      machine.update(85, 150);
      machine.update(165, 300);
      machine.update(85, 450);
      const count = machine.update(165, 600);

      expect(count.count).toBe(2);
    });
  });

  describe('debounce', () => {
    it('should not transition if within debounce window', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      const count = machine.update(85, 50);

      expect(count.state).toBe('top');
    });

    it('should transition after debounce window', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      const count = machine.update(85, 150);

      expect(count.state).toBe('bottom');
    });

    it('should respect custom debounce time', () => {
      const machine = new RepStateMachine({
        ...defaultThresholds,
        minDebounce: 200
      });

      machine.update(165, 0);
      const count1 = machine.update(85, 150);
      const count2 = machine.update(85, 250);

      expect(count1.state).toBe('top');
      expect(count2.state).toBe('bottom');
    });
  });

  describe('angle thresholds', () => {
    it('should stay in current state for mid-range angles', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      const count = machine.update(120, 150);

      expect(count.state).toBe('top');
    });

    it('should require angle >= topAngle for top state', () => {
      const machine = new RepStateMachine(defaultThresholds);

      const count1 = machine.update(159, 0);
      const count2 = machine.update(160, 200);

      expect(count1.state).toBe('idle');
      expect(count2.state).toBe('top');
    });

    it('should require angle <= bottomAngle for bottom state', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      const count1 = machine.update(91, 150);
      const count2 = machine.update(90, 300);

      expect(count1.state).toBe('top');
      expect(count2.state).toBe('bottom');
    });
  });

  describe('reset', () => {
    it('should reset count to 0', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      machine.update(85, 150);
      machine.update(165, 300);
      machine.reset();
      const count = machine.update(120, 500);

      expect(count.count).toBe(0);
    });

    it('should reset state to idle', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      machine.reset();
      const count = machine.update(120, 200);

      expect(count.state).toBe('idle');
    });

    it('should reset last transition time', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 0);
      machine.reset();
      const count = machine.update(165, 50);

      expect(count.state).toBe('top');
    });
  });

  describe('getCount', () => {
    it('should return RepCount object', () => {
      const machine = new RepStateMachine(defaultThresholds);

      const count = machine.update(165, 100);

      expect(count).toHaveProperty('count');
      expect(count).toHaveProperty('state');
      expect(count).toHaveProperty('lastTransition');
    });

    it('should track last transition time', () => {
      const machine = new RepStateMachine(defaultThresholds);

      machine.update(165, 100);
      const count = machine.update(85, 250);

      expect(count.lastTransition).toBe(250);
    });
  });
});
