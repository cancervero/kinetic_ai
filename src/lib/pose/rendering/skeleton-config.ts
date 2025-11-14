/**
 * Skeleton configuration for pose visualization
 * Defines edges connecting keypoint pairs
 */

export type SkeletonEdge = readonly [string, string];

export const SKELETON_EDGES: readonly SkeletonEdge[] = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle']
] as const;

export interface RenderConfig {
  keypointRadius: number;
  keypointColor: string;
  lineWidth: number;
  lineColor: string;
  minConfidence: number;
}

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  keypointRadius: 5,
  keypointColor: '#00ff00',
  lineWidth: 2,
  lineColor: '#00ff00',
  minConfidence: 0.3
};
