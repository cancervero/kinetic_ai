import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepCounter } from '@/components/RepCounter';

describe('components/RepCounter', () => {
  const mockRepCount = {
    count: 5,
    state: 'top' as const,
    lastTransition: 1000
  };

  it('should render count', () => {
    render(<RepCounter repCount={mockRepCount} exercise="squat" />);

    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should render exercise name in Spanish', () => {
    render(<RepCounter repCount={mockRepCount} exercise="squat" />);

    expect(screen.getByText('Sentadillas')).toBeTruthy();
  });

  it('should render pushup name in Spanish', () => {
    render(<RepCounter repCount={mockRepCount} exercise="pushup" />);

    expect(screen.getByText('Lagartijas')).toBeTruthy();
  });

  it('should render state indicator', () => {
    render(<RepCounter repCount={mockRepCount} exercise="squat" />);

    expect(screen.getByText('TOP')).toBeTruthy();
  });

  it('should render bottom state', () => {
    const bottomCount = { ...mockRepCount, state: 'bottom' as const };
    render(<RepCounter repCount={bottomCount} exercise="squat" />);

    expect(screen.getByText('BOTTOM')).toBeTruthy();
  });

  it('should render idle state', () => {
    const idleCount = { ...mockRepCount, state: 'idle' as const };
    render(<RepCounter repCount={idleCount} exercise="squat" />);

    expect(screen.getByText('IDLE')).toBeTruthy();
  });

  it('should render zero count', () => {
    const zeroCount = { ...mockRepCount, count: 0 };
    render(<RepCounter repCount={zeroCount} exercise="squat" />);

    expect(screen.getByText('0')).toBeTruthy();
  });

  it('should render large count', () => {
    const largeCount = { ...mockRepCount, count: 999 };
    render(<RepCounter repCount={largeCount} exercise="squat" />);

    expect(screen.getByText('999')).toBeTruthy();
  });

  it('should have rep-counter class', () => {
    const { container } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(container.querySelector('.rep-counter')).toBeTruthy();
  });

  it('should have count-display class', () => {
    const { container } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(container.querySelector('.count-display')).toBeTruthy();
  });

  it('should have state-indicator class', () => {
    const { container } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(container.querySelector('.state-indicator')).toBeTruthy();
  });

  it('should apply state-specific class', () => {
    const { container } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(container.querySelector('.state-top')).toBeTruthy();
  });

  it('should update count when prop changes', () => {
    const { rerender } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(screen.getByText('5')).toBeTruthy();

    const newCount = { ...mockRepCount, count: 10 };
    rerender(<RepCounter repCount={newCount} exercise="squat" />);

    expect(screen.getByText('10')).toBeTruthy();
  });

  it('should update state when prop changes', () => {
    const { rerender } = render(
      <RepCounter repCount={mockRepCount} exercise="squat" />
    );

    expect(screen.getByText('TOP')).toBeTruthy();

    const newCount = { ...mockRepCount, state: 'bottom' as const };
    rerender(<RepCounter repCount={newCount} exercise="squat" />);

    expect(screen.getByText('BOTTOM')).toBeTruthy();
  });
});
