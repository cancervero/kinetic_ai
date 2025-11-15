import { useState, useRef, useEffect } from 'react';
import { CameraFeed, PoseOverlayCanvas, RepCounter } from '@/components';
import { ProfileSelection } from '@/components/profile/ProfileSelection';
import { CalibrationFlow } from '@/components/calibration/CalibrationFlow';
import { ExerciseSelection } from '@/components/exercise/ExerciseSelection';
import { usePoseDetection, useRepCounter } from '@/hooks';
import { ExerciseType } from '@/lib/rep';
import { SKELETON_EDGES } from '@/lib/pose/rendering';
import {
  getCurrentProfile,
  updateCalibration,
  clearCurrentProfile,
  type UserProfile,
} from '@/lib/storage/profile-storage';
import type { CalibrationProfile } from '@/lib/pose/calibration';

type AppState =
  | 'profile-selection'
  | 'calibration'
  | 'exercise-selection'
  | 'exercising';

export function App() {
  const [appState, setAppState] = useState<AppState>('profile-selection');
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    null
  );
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  const { pose, loading } = usePoseDetection(videoRef, isReady);
  const repCount = useRepCounter(
    pose,
    exercise ?? 'squat',
    currentProfile?.calibration?.squatThresholds
  );

  useEffect(() => {
    const profile = getCurrentProfile();
    if (profile) {
      setCurrentProfile(profile);
      if (profile.calibration) {
        setAppState('exercise-selection');
      } else {
        setAppState('calibration');
      }
    } else {
      setAppState('profile-selection');
    }
  }, []);

  const handleProfileSelected = (profile: UserProfile) => {
    setCurrentProfile(profile);
    if (profile.calibration) {
      setAppState('exercise-selection');
    } else {
      setAppState('calibration');
    }
  };

  const handleCalibrationComplete = (calibration: CalibrationProfile) => {
    if (currentProfile) {
      updateCalibration(currentProfile.alias, calibration);
      setCurrentProfile({ ...currentProfile, calibration });
      setAppState('exercise-selection');
    }
  };

  const handleCalibrationCancel = () => {
    clearCurrentProfile();
    setCurrentProfile(null);
    setAppState('profile-selection');
  };

  const handleExerciseSelected = (selectedExercise: ExerciseType) => {
    setExercise(selectedExercise);
    setAppState('exercising');
  };

  const handleChangeProfile = () => {
    clearCurrentProfile();
    setCurrentProfile(null);
    setExercise(null);
    setAppState('profile-selection');
  };

  const handleVideoRef = (ref: React.RefObject<HTMLVideoElement>) => {
    if (ref.current && videoRef.current !== ref.current) {
      (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current =
        ref.current;
    }
  };

  const getVideoSize = (): { width: number; height: number } => {
    if (videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  };

  if (appState === 'profile-selection') {
    return <ProfileSelection onProfileSelected={handleProfileSelected} />;
  }

  if (appState === 'calibration') {
    const { width, height } = getVideoSize();
    return (
      <div className="app">
        <div className="video-container">
          <CameraFeed onVideoRef={handleVideoRef} onReady={setIsReady} />
          {pose && (
            <>
              <PoseOverlayCanvas
                keypoints={pose.keypoints}
                edges={SKELETON_EDGES}
                videoRef={videoRef}
              />
              <CalibrationFlow
                pose={pose}
                videoWidth={width}
                videoHeight={height}
                onComplete={handleCalibrationComplete}
                onCancel={handleCalibrationCancel}
              />
            </>
          )}
        </div>
        {loading && <LoadingIndicator />}
      </div>
    );
  }

  if (appState === 'exercise-selection') {
    return (
      <ExerciseSelection
        onExerciseSelected={handleExerciseSelected}
        onChangeProfile={handleChangeProfile}
      />
    );
  }

  return (
    <div className="app">
      <Header profile={currentProfile} onChangeProfile={handleChangeProfile} />
      <div className="video-container">
        <CameraFeed onVideoRef={handleVideoRef} onReady={setIsReady} />
        {pose && (
          <PoseOverlayCanvas
            keypoints={pose.keypoints}
            edges={SKELETON_EDGES}
            videoRef={videoRef}
          />
        )}
      </div>
      <RepCounter repCount={repCount} exercise={exercise ?? 'squat'} />
      {loading && <LoadingIndicator />}
    </div>
  );
}

function Header({
  profile,
  onChangeProfile,
}: {
  profile: UserProfile | null;
  onChangeProfile: () => void;
}) {
  return (
    <div className="app-header">
      <h1>Kinetic AI</h1>
      {profile && (
        <button onClick={onChangeProfile} className="profile-button">
          {profile.alias}
        </button>
      )}
    </div>
  );
}

function LoadingIndicator() {
  return <div className="loading">Cargando modelo...</div>;
}
