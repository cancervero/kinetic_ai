import { useCamera } from '@/hooks';

interface CameraFeedProps {
  onVideoRef?: (ref: React.RefObject<HTMLVideoElement>) => void;
  onReady?: (ready: boolean) => void;
}

export function CameraFeed({ onVideoRef, onReady }: CameraFeedProps) {
  const { videoRef, isReady, error } = useCamera();

  if (onVideoRef) onVideoRef(videoRef);
  if (onReady && isReady) onReady(isReady);

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
