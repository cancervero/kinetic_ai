import { useEffect, useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await getCameraStream();
      attachStream(stream);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function getCameraStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 }
    });
  }

  function attachStream(stream: MediaStream) {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => setIsReady(true);
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  }

  function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Camera error';
  }

  return { videoRef, isReady, error };
}
