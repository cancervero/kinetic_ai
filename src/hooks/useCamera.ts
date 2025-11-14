import { useEffect, useRef, useState, useCallback } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCameraStream = useCallback(async (): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 }
    });
  }, []);

  const attachStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => setIsReady(true);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await getCameraStream();
      attachStream(stream);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera error';
      setError(message);
    }
  }, [getCameraStream, attachStream]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  useEffect(() => {
    void startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return { videoRef, isReady, error };
}
