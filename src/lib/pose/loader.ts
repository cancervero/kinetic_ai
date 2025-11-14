import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { PoseDetector, ModelConfig } from './types';

let cachedDetector: PoseDetector | null = null;
let backendInitialized = false;

async function initializeBackend(): Promise<void> {
  if (backendInitialized) {
    console.log('[Kinetic AI] Backend already initialized:', tf.getBackend());
    return;
  }

  console.log('[Kinetic AI] Initializing TensorFlow.js backend...');

  try {
    // Force WebGL backend only
    await tf.setBackend('webgl');
    await tf.ready();

    const currentBackend = tf.getBackend();
    backendInitialized = true;

    console.log('[Kinetic AI] Backend initialized successfully:', currentBackend);

    if (currentBackend !== 'webgl') {
      console.warn('[Kinetic AI] Expected webgl backend but got:', currentBackend);
    }
  } catch (error) {
    console.error('[Kinetic AI] Backend initialization failed:', error);
    console.error('[Kinetic AI] Make sure your browser supports WebGL: https://get.webgl.org/');
    throw new Error('Failed to initialize TensorFlow.js WebGL backend. Please check browser compatibility.');
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
