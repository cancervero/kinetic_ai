import { BackendType } from './types';

interface DeviceCapabilities {
  gpu: boolean;
  mobile: boolean;
  webgl: boolean;
}

export function detectCapabilities(): DeviceCapabilities {
  return {
    gpu: hasGPU(),
    mobile: isMobile(),
    webgl: hasWebGL()
  };
}

function hasGPU(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return !!gl;
}

function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export function selectBackend(caps: DeviceCapabilities): BackendType {
  if (caps.mobile || !caps.gpu) {
    return 'movenet';
  }
  return 'movenet';
}

export function getRecommendedBackend(): BackendType {
  const caps = detectCapabilities();
  return selectBackend(caps);
}
