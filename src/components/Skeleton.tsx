import { Pose } from '@/lib/pose';

interface SkeletonProps {
  pose: Pose | null;
  width: number;
  height: number;
}

const CONNECTIONS = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle']
];

export function Skeleton({ pose, width, height }: SkeletonProps) {
  if (!pose) return null;

  return (
    <svg className="skeleton-overlay" width={width} height={height}>
      {CONNECTIONS.map((conn, i) => (
        <Connection key={i} pose={pose} names={conn} />
      ))}
      {pose.keypoints.map((kp, i) => (
        <Keypoint key={i} x={kp.x} y={kp.y} score={kp.score} />
      ))}
    </svg>
  );
}

function Connection({ pose, names }: { pose: Pose; names: string[] }) {
  const a = pose.keypoints.find(k => k.name === names[0]);
  const b = pose.keypoints.find(k => k.name === names[1]);
  if (!a || !b) return null;

  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke="#00ff00"
      strokeWidth="2"
    />
  );
}

function Keypoint({ x, y, score = 1 }: { x: number; y: number; score?: number }) {
  if (score < 0.3) return null;
  return <circle cx={x} cy={y} r="4" fill="#00ff00" />;
}
