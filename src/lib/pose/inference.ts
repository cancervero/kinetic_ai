import { PoseDetector, Pose } from './types';

export async function runInference(
  detector: PoseDetector,
  video: HTMLVideoElement
): Promise<Pose | null> {
  if (!isVideoReady(video)) return null;

  const poses = await detector.estimatePoses(video);
  return poses[0] || null;
}

function isVideoReady(video: HTMLVideoElement): boolean {
  return (
    video.readyState === video.HAVE_ENOUGH_DATA &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}

export function getVideoAspectRatio(video: HTMLVideoElement): number {
  return video.videoWidth / video.videoHeight;
}

export function getVideoDimensions(video: HTMLVideoElement) {
  return {
    width: video.videoWidth,
    height: video.videoHeight
  };
}
