# Modelos de Pose

## MoveNet (TensorFlow.js)

### Descripción

MoveNet es un modelo de detección de pose ultra-rápido desarrollado por Google.
Optimizado para inferencia en tiempo real en dispositivos móviles.

**Variantes:**
- **Lightning**: Rápido, ideal para móvil (utilizamos este)
- **Thunder**: Más preciso, mayor latencia

### Integración

```typescript
import { loadMoveNet } from '@/lib/pose';

const detector = await loadMoveNet('lightning');
const poses = await detector.estimatePoses(videoElement);
```

**Archivo:** `src/lib/pose/loader.ts`

### Keypoints

MoveNet detecta 17 keypoints:

```
0: nose
1: left_eye
2: right_eye
3: left_ear
4: right_ear
5: left_shoulder
6: right_shoulder
7: left_elbow
8: right_elbow
9: left_wrist
10: right_wrist
11: left_hip
12: right_hip
13: left_knee
14: right_knee
15: left_ankle
16: right_ankle
```

### Performance

- **FPS**: ~30-60 en móvil, ~60 en desktop
- **Latencia**: ~30ms por frame
- **Tamaño del modelo**: ~12MB
- **Backend**: WebGL (TensorFlow.js)

## MediaPipe BlazePose (Fallback)

### Descripción

BlazePose es el modelo de Google para detección de pose de alta fidelidad.
Detecta 33 keypoints (más detallado que MoveNet).

**Estado actual:** Placeholder, no implementado en MVP.

### Integración (Futuro)

```typescript
// Pendiente implementación
import { loadMediaPipe } from '@/lib/pose';
const detector = await loadMediaPipe();
```

### Diferencias con MoveNet

| Característica | MoveNet | MediaPipe |
|---------------|---------|-----------|
| Keypoints | 17 | 33 |
| Velocidad | Muy rápido | Rápido |
| Precisión | Alta | Muy alta |
| Tamaño | 12MB | ~20MB |
| Uso | General | Detallado |

## Backend Selector

El sistema selecciona automáticamente el mejor backend:

```typescript
import { getRecommendedBackend } from '@/lib/pose';

const backend = getRecommendedBackend();
// 'movenet' en la mayoría de casos
```

**Lógica de selección** (`src/lib/pose/backend.ts`):

1. Detecta capacidades del dispositivo (GPU, WebGL, mobile)
2. Para MVP, siempre retorna 'movenet'
3. Futuro: fallback a MediaPipe si falla MoveNet

## Umbrales de Inferencia

### Confidence Score

Cada keypoint tiene un score de confianza (0-1).

**Threshold actual:** 0.3 (30%)

```typescript
// src/lib/rep/normalize.ts
function isValidPose(keypoints, minScore = 0.3) {
  return keypoints.every(kp => kp.score >= minScore);
}
```

**Ajustar threshold:**
- ↑ Mayor threshold = más estricto, menos detecciones
- ↓ Menor threshold = más permisivo, más falsos positivos

## Caché de Modelos

### Service Worker

Vite PWA cachea automáticamente modelos desde CDN:

```javascript
// vite.config.ts
runtimeCaching: [{
  urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
  handler: 'CacheFirst',
  options: {
    cacheName: 'tf-models-cache',
    expiration: {
      maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
    }
  }
}]
```

### Primera carga

1. Usuario abre app por primera vez
2. Se descarga modelo (~12MB)
3. Service Worker lo cachea
4. Subsecuentes cargas: instantáneas (caché local)

## Troubleshooting

### Modelo no carga

**Error:** "Failed to load model"

**Soluciones:**
1. Verificar conexión a internet (primera carga)
2. Limpiar caché del navegador
3. Verificar que WebGL está habilitado

### Baja precisión

**Síntomas:** Keypoints inestables, detección errática

**Soluciones:**
1. Mejorar iluminación
2. Aumentar smoothing alpha (`src/lib/pose/smoothing.ts`)
3. Verificar que la cámara no está obstruida
4. Mantener distancia apropiada (1-2 metros)

### Bajo rendimiento

**Síntomas:** <20 FPS, lag visible

**Soluciones:**
1. Ya estamos usando Lightning (modelo más rápido)
2. Reducir resolución de video (640x480 actual)
3. Cerrar otras apps/pestañas
4. Usar device con GPU más potente
