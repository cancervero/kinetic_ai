import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { PoseDetector, ModelConfig } from './types';

let cachedDetector: PoseDetector | null = null;
let backendInitialized = false;

async function initializeBackend(): Promise<void> {
  if (backendInitialized) return;

  console.log('[Kinetic AI] Initializing TensorFlow.js backend...');

  try {
    await tf.setBackend('webgl');
    await tf.ready();
    backendInitialized = true;
    console.log('[Kinetic AI] Backend initialized successfully:', tf.getBackend());
  } catch (error) {
    console.error('[Kinetic AI] Backend initialization failed:', error);
    throw new Error('Failed to initialize TensorFlow.js backend');
  }
}

export async function loadMoveNet(
  modelType: 'lightning' | 'thunder' = 'lightning'
): Promise<PoseDetector> {
  if (cachedDetector) return cachedDetector;

  // Initialize TensorFlow.js backend first
  await initializeBackend();

  console.log('[Kinetic AI] Loading MoveNet model:', modelType);

  const modelTypeKey = modelType === 'lightning'
    ? poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    : poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;

  try {
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: modelTypeKey }
    );

    cachedDetector = detector as PoseDetector;
    console.log('[Kinetic AI] MoveNet model loaded successfully');
    return cachedDetector;
  } catch (error) {
    console.error('[Kinetic AI] Failed to load MoveNet model:', error);
    throw error;
  }
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
