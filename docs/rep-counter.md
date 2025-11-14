# Contador de Repeticiones

## Explicación Matemática

### Cálculo de Ángulos

El ángulo entre tres keypoints A, B, C se calcula usando vectores:

```
Vector BA = (A.x - B.x, A.y - B.y)
Vector BC = (C.x - B.x, C.y - B.y)

θ = atan2(BC.y, BC.x) - atan2(BA.y, BA.x)
angle = |θ * 180 / π|

if angle > 180:
    angle = 360 - angle
```

**Implementación:** `src/lib/rep/angles.ts:calculateAngle()`

### Normalización

Para robustez ante diferentes distancias de cámara, normalizamos por altura del torso:

```
torsoHeight = distance(shoulder, hip)

normalizedKeypoints = keypoints.map(kp => {
  x: kp.x / torsoHeight,
  y: kp.y / torsoHeight
})
```

**Implementación:** `src/lib/rep/normalize.ts`

## Detección de Top/Bottom

### Máquina de Estados

```
        ┌─────┐
        │ IDLE│
        └──┬──┘
           │ angle ≥ topThreshold
        ┌──▼──┐
        │ TOP │
        └──┬──┘
           │ angle ≤ bottomThreshold
        ┌──▼──────┐
        │ BOTTOM  │
        └──┬──────┘
           │ angle ≥ topThreshold (COUNT++)
           └────────> TOP
```

**Implementación:** `src/lib/rep/state-machine.ts`

### Debounce

Mínimo 100ms entre transiciones para evitar rebotes:

```typescript
if (timestamp - lastTransition < minDebounce) {
  return currentState; // No cambiar estado
}
```

## Ejercicios Soportados

### Sentadillas (Squat)

**Keypoints usados:**
- Hip (cadera)
- Knee (rodilla) ← vértice del ángulo
- Ankle (tobillo)

**Ángulo medido:** Ángulo de la rodilla

**Thresholds:**
```typescript
{
  topAngle: 160,    // Posición de pie (casi extendido)
  bottomAngle: 90,  // Posición abajo (90°)
  minDebounce: 100  // ms
}
```

**Archivo:** `src/lib/rep/exercises/squat.ts`

### Lagartijas (Pushup)

**Keypoints usados:**
- Shoulder (hombro)
- Elbow (codo) ← vértice del ángulo
- Wrist (muñeca)

**Ángulo medido:** Ángulo del codo

**Thresholds:**
```typescript
{
  topAngle: 160,    // Brazos extendidos
  bottomAngle: 80,  // Brazos flexionados
  minDebounce: 100  // ms
}
```

**Archivo:** `src/lib/rep/exercises/pushup.ts`

## Configuración de Thresholds

### Valores Iniciales

Definidos en `src/lib/rep/thresholds.ts`:

```typescript
const SQUAT_THRESHOLDS = {
  topAngle: 160,
  bottomAngle: 90,
  minDebounce: 100
};
```

### Modificar Thresholds

**Opción 1: Editar archivo**

```typescript
// src/lib/rep/thresholds.ts
const SQUAT_THRESHOLDS = {
  topAngle: 170,    // Más estricto
  bottomAngle: 80,  // Más profundo
  minDebounce: 150  // Más lento
};
```

**Opción 2: Runtime (API)**

```typescript
import { setThresholds } from '@/lib/rep';

setThresholds('squat', {
  topAngle: 170,
  bottomAngle: 80
});
```

### Ajuste por Dificultad

| Nivel | Top Angle | Bottom Angle |
|-------|-----------|--------------|
| Fácil | 150 | 100 |
| Medio | 160 | 90 |
| Difícil | 170 | 80 |

## Extender a Nuevos Ejercicios

### Paso 1: Definir Tipo

```typescript
// src/lib/rep/types.ts
export type ExerciseType = 'squat' | 'pushup' | 'plank'; // agregar
```

### Paso 2: Agregar Thresholds

```typescript
// src/lib/rep/thresholds.ts
const PLANK_THRESHOLDS = {
  topAngle: 180,
  bottomAngle: 160,
  minDebounce: 2000 // 2 segundos
};

const THRESHOLDS = {
  squat: SQUAT_THRESHOLDS,
  pushup: PUSHUP_THRESHOLDS,
  plank: PLANK_THRESHOLDS
};
```

### Paso 3: Crear Detector

```typescript
// src/lib/rep/exercises/plank.ts
import { ExerciseDetector, RepCount } from '../types';
import { calculateAngle, getKeypointByName } from '../angles';
import { getThresholds } from '../thresholds';
import { RepStateMachine } from '../state-machine';

export class PlankDetector implements ExerciseDetector {
  private machine: RepStateMachine;

  constructor() {
    const thresholds = getThresholds('plank');
    this.machine = new RepStateMachine(thresholds);
  }

  detect(keypoints: Keypoint[], timestamp: number): RepCount {
    const angle = this.getHipAngle(keypoints);
    if (angle === null) return this.getIdleCount();
    return this.machine.update(angle, timestamp);
  }

  private getHipAngle(keypoints: Keypoint[]): number | null {
    const shoulder = getKeypointByName(keypoints, 'left_shoulder');
    const hip = getKeypointByName(keypoints, 'left_hip');
    const knee = getKeypointByName(keypoints, 'left_knee');

    if (!shoulder || !hip || !knee) return null;
    return calculateAngle(shoulder, hip, knee);
  }

  private getIdleCount(): RepCount {
    return { count: 0, state: 'idle', lastTransition: 0 };
  }

  reset(): void {
    this.machine.reset();
  }
}

export function createPlankDetector(): ExerciseDetector {
  return new PlankDetector();
}
```

### Paso 4: Integrar en Hook

```typescript
// src/hooks/useRepCounter.ts
function createDetector(exercise: ExerciseType): ExerciseDetector {
  if (exercise === 'squat') return createSquatDetector();
  if (exercise === 'pushup') return createPushupDetector();
  if (exercise === 'plank') return createPlankDetector(); // agregar
  throw new Error(`Unknown exercise: ${exercise}`);
}
```

## Troubleshooting

### Contador no incrementa

**Causas posibles:**
1. Ángulo no alcanza thresholds
2. Debounce muy alto
3. Keypoints no detectados (score bajo)
4. Movimiento muy rápido

**Soluciones:**
1. Verificar thresholds con console.log
2. Reducir minDebounce
3. Mejorar iluminación/posición
4. Moverse más despacio

### Cuenta repeticiones incorrectas

**Síntomas:** Cuenta doble, cuenta sin movimiento

**Soluciones:**
1. Aumentar minDebounce (evita rebotes)
2. Ajustar thresholds (más estrictos)
3. Mejorar smoothing alpha
4. Verificar que keypoints correctos están siendo usados

### Diferentes lados del cuerpo

Por defecto usamos keypoints del lado izquierdo (`left_*`).

**Para promedio de ambos lados:**

```typescript
private getKneeAngle(keypoints: Keypoint[]): number | null {
  const leftAngle = this.calculateLeftKnee(keypoints);
  const rightAngle = this.calculateRightKnee(keypoints);

  if (leftAngle && rightAngle) {
    return (leftAngle + rightAngle) / 2;
  }
  return leftAngle || rightAngle || null;
}
```
