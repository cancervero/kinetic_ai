import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/Skeleton';
import { mockSquatTopPose } from '../mockData/poses';

describe('components/Skeleton', () => {
  it('should render nothing for null pose', () => {
    const { container } = render(
      <Skeleton pose={null} width={640} height={480} />
    );

    expect(container.querySelector('svg')).toBeNull();
  });

  it('should render SVG for valid pose', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={640} height={480} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should set correct SVG dimensions', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={800} height={600} />
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('800');
    expect(svg?.getAttribute('height')).toBe('600');
  });

  it('should render keypoint circles', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={640} height={480} />
    );

    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('should render connection lines', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={640} height={480} />
    );

    const lines = container.querySelectorAll('line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should have skeleton-overlay class', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={640} height={480} />
    );

    const svg = container.querySelector('.skeleton-overlay');
    expect(svg).toBeTruthy();
  });

  it('should filter low confidence keypoints', () => {
    const lowConfidencePose = {
      ...mockSquatTopPose,
      keypoints: mockSquatTopPose.keypoints.map((kp, i) => ({
        ...kp,
        score: i === 0 ? 0.1 : 0.9
      }))
    };

    const { container } = render(
      <Skeleton pose={lowConfidencePose} width={640} height={480} />
    );

    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeLessThan(lowConfidencePose.keypoints.length);
  });

  it('should handle pose with no keypoints', () => {
    const emptyPose = { ...mockSquatTopPose, keypoints: [] };

    const { container } = render(
      <Skeleton pose={emptyPose} width={640} height={480} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render with different dimensions', () => {
    const { container } = render(
      <Skeleton pose={mockSquatTopPose} width={1920} height={1080} />
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('1920');
    expect(svg?.getAttribute('height')).toBe('1080');
  });
});
