import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { PoseDetector, ModelConfig } from './types';

let cachedDetector: PoseDetector | null = null;

export async function loadMoveNet(
  modelType: 'lightning' | 'thunder' = 'lightning'
): Promise<PoseDetector> {
  if (cachedDetector) return cachedDetector;

  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType[
        modelType.toUpperCase() as 'LIGHTNING' | 'THUNDER'
      ]
    }
  );

  cachedDetector = detector as PoseDetector;
  return cachedDetector;
}

export async function loadDetector(config: ModelConfig): Promise<PoseDetector> {
  if (config.backend === 'movenet') {
    return loadMoveNet(config.modelType);
  }
  throw new Error('MediaPipe not implemented yet');
}

export function disposeDetector(): void {
  if (cachedDetector) {
    cachedDetector.dispose();
    cachedDetector = null;
  }
}

export function isDetectorLoaded(): boolean {
  return cachedDetector !== null;
}
