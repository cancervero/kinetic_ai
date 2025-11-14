export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score?: number;
}

export type BackendType = 'movenet' | 'mediapipe';

export interface PoseDetector {
  estimatePoses(
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ): Promise<Pose[]>;
  dispose(): void;
}

export interface ModelConfig {
  backend: BackendType;
  modelType?: 'lightning' | 'thunder';
  enableSmoothing?: boolean;
}
