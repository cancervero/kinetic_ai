import { useEffect, useRef, useState } from 'react';
import type { Pose } from '@tensorflow-models/pose-detection';
import { detectUser } from '@/lib/pose/user-detection';
import { GestureTracker } from '@/lib/pose/gesture-detection';
import {
  CalibrationSession,
  type CalibrationProfile,
} from '@/lib/pose/calibration';

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

  useEffect(() => {
    if (!pose || !pose.keypoints) return;

    const keypoints = pose.keypoints;
    const timestamp = Date.now();

    if (step === 'positioning') {
      const detection = detectUser(keypoints, videoWidth, videoHeight);
      setFeedback(detection.feedback);

      if (detection.isDetected) {
        setStep('gesture');
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
        setFeedback('¡Calibrando! Mantente quieto...');
      } else if (progress === 0) {
        setFeedback('Levanta ambos brazos formando una "Y" para iniciar');
      } else {
        setFeedback('Mantén la posición...');
      }
    } else if (step === 'calibrating') {
      const shouldFinish = calibrationSession.current.addFrame(keypoints);
      const progress = calibrationSession.current.getProgress();
      setCalibrationProgress(progress);

      if (shouldFinish || calibrationSession.current.canFinish()) {
        const profile = calibrationSession.current.finish();
        if (profile) {
          setStep('complete');
          setFeedback('¡Calibración completada!');
          playBeep();
          setTimeout(() => onComplete(profile), 1000);
        }
      }
    }
  }, [pose, step, videoWidth, videoHeight, onComplete]);

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

        {step === 'complete' && (
          <div className="success-icon">✓</div>
        )}

        <button onClick={onCancel} className="cancel-button">
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
