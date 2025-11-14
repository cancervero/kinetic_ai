import { useState, useRef } from 'react';
import { CameraFeed, Skeleton, RepCounter } from '@/components';
import { usePoseDetection, useRepCounter } from '@/hooks';
import { ExerciseType } from '@/lib/rep';

export function App() {
  const [exercise, setExercise] = useState<ExerciseType>('squat');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  const { pose, loading } = usePoseDetection(videoRef, isReady);
  const repCount = useRepCounter(pose, exercise);

  const handleVideoRef = (ref: React.RefObject<HTMLVideoElement>) => {
    if (ref.current && videoRef.current !== ref.current) {
      (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = ref.current;
    }
  };

  return (
    <div className="app">
      <Header />
      <ExerciseSelector current={exercise} onChange={setExercise} />
      <div className="video-container">
        <CameraFeed
          onVideoRef={handleVideoRef}
          onReady={setIsReady}
        />
        <Skeleton pose={pose} width={640} height={480} />
      </div>
      <RepCounter repCount={repCount} exercise={exercise} />
      {loading && <LoadingIndicator />}
    </div>
  );
}

function Header() {
  return <h1 className="app-header">Kinetic AI</h1>;
}

function ExerciseSelector({
  current,
  onChange
}: {
  current: ExerciseType;
  onChange: (ex: ExerciseType) => void;
}) {
  return (
    <div className="exercise-selector">
      <button onClick={() => onChange('squat')} disabled={current === 'squat'}>
        Sentadillas
      </button>
      <button onClick={() => onChange('pushup')} disabled={current === 'pushup'}>
        Lagartijas
      </button>
    </div>
  );
}

function LoadingIndicator() {
  return <div className="loading">Cargando modelo...</div>;
}
