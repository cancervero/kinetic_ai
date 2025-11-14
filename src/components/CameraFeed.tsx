import { useCamera } from '@/hooks';
import { useEffect } from 'react';

interface CameraFeedProps {
  onVideoRef?: (ref: React.RefObject<HTMLVideoElement>) => void;
  onReady?: (ready: boolean) => void;
}

export function CameraFeed({ onVideoRef, onReady }: CameraFeedProps) {
  const { videoRef, isReady, error } = useCamera();

  useEffect(() => {
    if (onVideoRef) onVideoRef(videoRef);
  }, [videoRef, onVideoRef]);

  useEffect(() => {
    if (onReady && isReady) onReady(isReady);
  }, [isReady, onReady]);

  if (error) return <ErrorDisplay message={error} />;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="camera-feed"
    />
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return <div className="error">Camera Error: {message}</div>;
}
