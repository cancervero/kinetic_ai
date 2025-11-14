# Arquitectura

## Visión General

Kinetic AI es una Progressive Web App diseñada con arquitectura modular que separa claramente las responsabilidades en capas:

```
┌─────────────────────────────────────────┐
│         UI Layer (React)                │
│  Components | Hooks | Pages             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Business Logic Layer               │
│  Pose Engine | Rep Counter | Utils      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       External Dependencies             │
│  TensorFlow.js | MediaPipe | Browser APIs│
└─────────────────────────────────────────┘
```

## Módulos Principales

### Pose Engine (`src/lib/pose/`)

Responsable de la detección de pose usando modelos de ML.

**Flujo de datos:**
1. `loader.ts` carga el modelo MoveNet
2. `backend.ts` selecciona el backend óptimo según capacidades del dispositivo
3. `inference.ts` ejecuta predicciones frame por frame
4. `smoothing.ts` aplica EMA para suavizar keypoints

**Diagrama de flujo:**
```
Video Frame → Detector → Raw Pose → Smoother → Smooth Pose
```

### Rep Counter (`src/lib/rep/`)

Analiza keypoints para contar repeticiones de ejercicios.

**Componentes:**
- `angles.ts`: Cálculo de ángulos entre 3 keypoints
- `normalize.ts`: Normalización por altura del torso
- `thresholds.ts`: Configuración de umbrales por ejercicio
- `state-machine.ts`: FSM (top ↔ bottom)
- `exercises/`: Detectores específicos por ejercicio

**Estado de repetición:**
```
idle → top → bottom → top (count++)
```

### Hooks Layer (`src/hooks/`)

Conecta la lógica de negocio con React:

- `useCamera`: Gestiona acceso a MediaStream
- `usePoseDetection`: Loop de inferencia con RAF
- `useRepCounter`: Analiza pose y actualiza contador

## Política Offline

La app funciona offline gracias a:

1. **Service Worker** (Vite PWA Plugin)
   - Cachea app shell
   - Cachea assets estáticos
   - Strategy: Cache First para modelos ML

2. **IndexedDB** (Futuro)
   - Caché persistente de modelos
   - Historial de entrenamientos

3. **App Shell Architecture**
   - HTML/CSS/JS inicial cacheado
   - Datos cargados dinámicamente

## Comunicación Web Worker (Futuro)

```
Main Thread          Worker Thread
    │                     │
    ├──── Frame ──────────>
    │                     │
    │              [Inference]
    │                     │
    <──── Pose ───────────┤
    │                     │
```

Actualmente la inferencia se ejecuta en main thread.
Worker preparado en `src/workers/pose.worker.ts`.

## Rendimiento

- **Target**: 30 FPS en móvil, 60 FPS en desktop
- **Optimizaciones**:
  - MoveNet Lightning (modelo rápido)
  - Smoothing con EMA (reduce jitter)
  - RequestAnimationFrame para loop
  - Debounce en state machine (100ms)

## Extensibilidad

### Agregar nuevo ejercicio:

1. Crear detector en `src/lib/rep/exercises/nuevo.ts`
2. Implementar interfaz `ExerciseDetector`
3. Definir thresholds en `thresholds.ts`
4. Agregar tipo en `types.ts`

### Agregar funcionalidad premium:

1. Módulos preparados en `src/lib/premium/`
2. Implementar interfaces definidas
3. Integrar en componentes UI
