import { Keypoint } from '../types';
import { RenderConfig, SkeletonEdge } from './skeleton-config';

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawKeypoint(
  ctx: CanvasRenderingContext2D,
  keypoint: Keypoint,
  config: RenderConfig
): void {
  if ((keypoint.score ?? 1) < config.minConfidence) return;

  ctx.beginPath();
  ctx.arc(keypoint.x, keypoint.y, config.keypointRadius, 0, 2 * Math.PI);
  ctx.fillStyle = config.keypointColor;
  ctx.fill();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Keypoint,
  to: Keypoint,
  config: RenderConfig
): void {
  const minScore = Math.min(from.score ?? 1, to.score ?? 1);
  if (minScore < config.minConfidence) return;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = config.lineWidth;
  ctx.stroke();
}

export function findKeypoint(
  keypoints: Keypoint[],
  name: string
): Keypoint | undefined {
  return keypoints.find(kp => kp.name === name);
}

export function drawEdge(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  edge: SkeletonEdge,
  config: RenderConfig
): void {
  const [name1, name2] = edge;
  const kp1 = findKeypoint(keypoints, name1);
  const kp2 = findKeypoint(keypoints, name2);

  if (kp1 && kp2) {
    drawLine(ctx, kp1, kp2, config);
  }
}

export function renderSkeleton(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  edges: readonly SkeletonEdge[],
  config: RenderConfig
): void {
  clearCanvas(ctx);

  edges.forEach(edge => drawEdge(ctx, keypoints, edge, config));
  keypoints.forEach(kp => drawKeypoint(ctx, kp, config));
}
