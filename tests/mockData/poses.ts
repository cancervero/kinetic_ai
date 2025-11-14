import { Pose, Keypoint } from '@/lib/pose/types';

export const createKeypoint = (
  x: number,
  y: number,
  score = 0.9,
  name?: string
): Keypoint => ({ x, y, score, name });

export const mockSquatTopPose: Pose = {
  keypoints: [
    createKeypoint(320, 100, 0.95, 'nose'),
    createKeypoint(310, 95, 0.92, 'left_eye'),
    createKeypoint(330, 95, 0.92, 'right_eye'),
    createKeypoint(300, 100, 0.88, 'left_ear'),
    createKeypoint(340, 100, 0.88, 'right_ear'),
    createKeypoint(280, 150, 0.95, 'left_shoulder'),
    createKeypoint(360, 150, 0.95, 'right_shoulder'),
    createKeypoint(260, 200, 0.93, 'left_elbow'),
    createKeypoint(380, 200, 0.93, 'right_elbow'),
    createKeypoint(250, 250, 0.91, 'left_wrist'),
    createKeypoint(390, 250, 0.91, 'right_wrist'),
    createKeypoint(280, 250, 0.96, 'left_hip'),
    createKeypoint(360, 250, 0.96, 'right_hip'),
    createKeypoint(285, 360, 0.94, 'left_knee'),
    createKeypoint(355, 360, 0.94, 'right_knee'),
    createKeypoint(280, 470, 0.92, 'left_ankle'),
    createKeypoint(360, 470, 0.92, 'right_ankle')
  ],
  score: 0.93
};

export const mockSquatBottomPose: Pose = {
  keypoints: [
    createKeypoint(320, 200, 0.95, 'nose'),
    createKeypoint(310, 195, 0.92, 'left_eye'),
    createKeypoint(330, 195, 0.92, 'right_eye'),
    createKeypoint(300, 200, 0.88, 'left_ear'),
    createKeypoint(340, 200, 0.88, 'right_ear'),
    createKeypoint(280, 250, 0.95, 'left_shoulder'),
    createKeypoint(360, 250, 0.95, 'right_shoulder'),
    createKeypoint(260, 300, 0.93, 'left_elbow'),
    createKeypoint(380, 300, 0.93, 'right_elbow'),
    createKeypoint(250, 350, 0.91, 'left_wrist'),
    createKeypoint(390, 350, 0.91, 'right_wrist'),
    createKeypoint(280, 350, 0.96, 'left_hip'),
    createKeypoint(360, 350, 0.96, 'right_hip'),
    createKeypoint(230, 380, 0.94, 'left_knee'),
    createKeypoint(410, 380, 0.94, 'right_knee'),
    createKeypoint(220, 430, 0.92, 'left_ankle'),
    createKeypoint(420, 430, 0.92, 'right_ankle')
  ],
  score: 0.93
};

export const mockPushupTopPose: Pose = {
  keypoints: [
    createKeypoint(320, 200, 0.95, 'nose'),
    createKeypoint(310, 195, 0.92, 'left_eye'),
    createKeypoint(330, 195, 0.92, 'right_eye'),
    createKeypoint(300, 200, 0.88, 'left_ear'),
    createKeypoint(340, 200, 0.88, 'right_ear'),
    createKeypoint(280, 220, 0.95, 'left_shoulder'),
    createKeypoint(360, 220, 0.95, 'right_shoulder'),
    createKeypoint(245, 225, 0.93, 'left_elbow'),
    createKeypoint(395, 225, 0.93, 'right_elbow'),
    createKeypoint(210, 230, 0.91, 'left_wrist'),
    createKeypoint(430, 230, 0.91, 'right_wrist'),
    createKeypoint(280, 300, 0.96, 'left_hip'),
    createKeypoint(360, 300, 0.96, 'right_hip'),
    createKeypoint(280, 350, 0.94, 'left_knee'),
    createKeypoint(360, 350, 0.94, 'right_knee'),
    createKeypoint(280, 400, 0.92, 'left_ankle'),
    createKeypoint(360, 400, 0.92, 'right_ankle')
  ],
  score: 0.93
};

export const mockPushupBottomPose: Pose = {
  keypoints: [
    createKeypoint(320, 260, 0.95, 'nose'),
    createKeypoint(310, 255, 0.92, 'left_eye'),
    createKeypoint(330, 255, 0.92, 'right_eye'),
    createKeypoint(300, 260, 0.88, 'left_ear'),
    createKeypoint(340, 260, 0.88, 'right_ear'),
    createKeypoint(280, 280, 0.95, 'left_shoulder'),
    createKeypoint(360, 280, 0.95, 'right_shoulder'),
    createKeypoint(255, 300, 0.93, 'left_elbow'),
    createKeypoint(385, 300, 0.93, 'right_elbow'),
    createKeypoint(210, 270, 0.91, 'left_wrist'),
    createKeypoint(430, 270, 0.91, 'right_wrist'),
    createKeypoint(280, 300, 0.96, 'left_hip'),
    createKeypoint(360, 300, 0.96, 'right_hip'),
    createKeypoint(280, 350, 0.94, 'left_knee'),
    createKeypoint(360, 350, 0.94, 'right_knee'),
    createKeypoint(280, 400, 0.92, 'left_ankle'),
    createKeypoint(360, 400, 0.92, 'right_ankle')
  ],
  score: 0.93
};

export const mockLowScorePose: Pose = {
  keypoints: mockSquatTopPose.keypoints.map(kp => ({
    ...kp,
    score: 0.2
  })),
  score: 0.2
};
