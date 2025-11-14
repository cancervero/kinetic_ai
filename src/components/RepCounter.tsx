import { RepCount } from '@/lib/rep';

interface RepCounterProps {
  repCount: RepCount;
  exercise: string;
}

export function RepCounter({ repCount, exercise }: RepCounterProps) {
  return (
    <div className="rep-counter">
      <h2 className="exercise-name">{formatExercise(exercise)}</h2>
      <div className="count-display">{repCount.count}</div>
      <div className="state-indicator">
        <StateIndicator state={repCount.state} />
      </div>
    </div>
  );
}

function formatExercise(exercise: string): string {
  const names: Record<string, string> = {
    squat: 'Sentadillas',
    pushup: 'Lagartijas'
  };
  return names[exercise] || exercise;
}

function StateIndicator({ state }: { state: string }) {
  const stateClass = `state-${state}`;
  return <span className={stateClass}>{state.toUpperCase()}</span>;
}
