import { useEffect, useRef, useState } from 'react';
import type { Pose } from '@tensorflow-models/pose-detection';
import { detectUser } from '@/lib/pose/user-detection';
import { GestureTracker } from '@/lib/pose/gesture-detection';
import {
  CalibrationSession,
  type CalibrationProfile,
} from '@/lib/pose/calibration';
import { VoiceInstructor } from '@/lib/speech/text-to-speech';

interface CalibrationFlowProps {
  pose: Pose | null;
  videoWidth: number;
  videoHeight: number;
  onComplete: (profile: CalibrationProfile) => void;
  onCancel: () => void;
}

type CalibrationStep = 'positioning' | 'gesture' | 'calibrating' | 'complete';

export function CalibrationFlow({
  pose,
  videoWidth,
  videoHeight,
  onComplete,
  onCancel,
}: CalibrationFlowProps) {
  const [step, setStep] = useState<CalibrationStep>('positioning');
  const [feedback, setFeedback] = useState('');
  const [gestureProgress, setGestureProgress] = useState(0);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const gestureTracker = useRef(new GestureTracker(1500));
  const calibrationSession = useRef(new CalibrationSession());
  const voiceInstructor = useRef(new VoiceInstructor());

  useEffect(() => {
    const instructor = voiceInstructor.current;
    instructor.announce(
      'Calibración iniciada. Colócate frente a la cámara',
      true
    );
    return () => instructor.stop();
  }, []);

  useEffect(() => {
    if (!pose || !pose.keypoints) return;

    const keypoints = pose.keypoints;
    const timestamp = Date.now();

    if (step === 'positioning') {
      const detection = detectUser(keypoints, videoWidth, videoHeight);
      setFeedback(detection.feedback);
      voiceInstructor.current.announce(detection.feedback);

      if (detection.isDetected) {
        setStep('gesture');
        voiceInstructor.current.announce(
          'Perfecto. Ahora levanta ambos brazos formando una Y',
          true
        );
      }
    } else if (step === 'gesture') {
      const gestureDetected = gestureTracker.current.update(
        keypoints,
        timestamp
      );
      const progress = gestureTracker.current.getProgress(timestamp);
      setGestureProgress(progress);

      if (gestureDetected) {
        calibrationSession.current.start();
        setStep('calibrating');
        const msg = 'Calibrando. Mantente quieto en posición de pie';
        setFeedback(msg);
        voiceInstructor.current.announce(msg, true);
      } else if (progress === 0) {
        setFeedback('Levanta ambos brazos en forma de Y');
      } else if (progress > 0.5) {
        setFeedback('Mantén la posición...');
        voiceInstructor.current.announce('Mantén la posición');
      }
    } else if (step === 'calibrating') {
      const shouldFinish = calibrationSession.current.addFrame(keypoints);
      const progress = calibrationSession.current.getProgress();
      setCalibrationProgress(progress);

      if (shouldFinish || calibrationSession.current.canFinish()) {
        const profile = calibrationSession.current.finish();
        if (profile) {
          setStep('complete');
          const msg = '¡Calibración completada exitosamente!';
          setFeedback(msg);
          voiceInstructor.current.announce(msg, true);
          playBeep();
          setTimeout(() => onComplete(profile), 2000);
        }
      }
    }
  }, [pose, step, videoWidth, videoHeight, onComplete]);

  const handleCancel = () => {
    voiceInstructor.current.stop();
    onCancel();
  };

  return (
    <div className="calibration-overlay">
      <div className="calibration-card">
        <h2>Calibración</h2>
        <p className="feedback">{feedback}</p>

        {step === 'gesture' && gestureProgress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${gestureProgress * 100}%` }}
            />
          </div>
        )}

        {step === 'calibrating' && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${calibrationProgress * 100}%` }}
            />
          </div>
        )}

        {step === 'complete' && <div className="success-icon">✓</div>}

        <button onClick={handleCancel} className="cancel-button">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function playBeep(): void {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.2
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}
