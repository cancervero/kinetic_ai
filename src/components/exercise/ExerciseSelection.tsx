import type { ExerciseType } from '@/lib/rep/types';

interface ExerciseSelectionProps {
  onExerciseSelected: (exercise: ExerciseType) => void;
  onChangeProfile: () => void;
}

const EXERCISES: Array<{
  type: ExerciseType;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'squat',
    name: 'Sentadillas',
    description: 'Cuenta tus sentadillas automáticamente',
    icon: '🏋️',
  },
  {
    type: 'pushup',
    name: 'Flexiones',
    description: 'Cuenta tus flexiones de pecho',
    icon: '💪',
  },
];

export function ExerciseSelection({
  onExerciseSelected,
  onChangeProfile,
}: ExerciseSelectionProps) {
  return (
    <div className="exercise-selection">
      <div className="exercise-card">
        <h2>Selecciona un ejercicio</h2>
        <div className="exercise-list">
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.type}
              className="exercise-button"
              onClick={() => onExerciseSelected(exercise.type)}
            >
              <span className="exercise-icon">{exercise.icon}</span>
              <div className="exercise-info">
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onChangeProfile} className="change-profile-button">
          Cambiar perfil
        </button>
      </div>
    </div>
  );
}
