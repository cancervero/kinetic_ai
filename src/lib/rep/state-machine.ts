import { RepState, RepCount, ExerciseThresholds } from './types';

export class RepStateMachine {
  private count = 0;
  private state: RepState = 'idle';
  private lastTransition = 0;
  private thresholds: ExerciseThresholds;

  constructor(thresholds: ExerciseThresholds) {
    this.thresholds = thresholds;
  }

  update(angle: number, timestamp: number): RepCount {
    const debounced = this.isDebounced(timestamp);
    const newState = this.getNextState(angle, debounced);

    if (this.shouldIncrement(newState)) {
      this.count++;
      this.lastTransition = timestamp;
    }

    this.state = newState;
    return this.getCount();
  }

  private isDebounced(timestamp: number): boolean {
    return timestamp - this.lastTransition < this.thresholds.minDebounce;
  }

  private getNextState(angle: number, debounced: boolean): RepState {
    if (debounced) return this.state;

    if (angle >= this.thresholds.topAngle) return 'top';
    if (angle <= this.thresholds.bottomAngle) return 'bottom';
    return this.state;
  }

  private shouldIncrement(newState: RepState): boolean {
    return this.state === 'bottom' && newState === 'top';
  }

  private getCount(): RepCount {
    return {
      count: this.count,
      state: this.state,
      lastTransition: this.lastTransition
    };
  }

  reset(): void {
    this.count = 0;
    this.state = 'idle';
    this.lastTransition = 0;
  }
}
