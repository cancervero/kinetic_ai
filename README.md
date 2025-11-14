# Kinetic AI

PWA para detección de postura y conteo de repeticiones de ejercicios usando visión computacional.

## Características

- ✅ Detección de pose en tiempo real con MoveNet (TensorFlow.js)
- ✅ Contador de repeticiones para sentadillas y lagartijas
- ✅ Progressive Web App (funciona offline)
- ✅ Arquitectura modular y mantenible
- ✅ Código TypeScript 100% tipado
- ✅ Diseño responsive para móvil y desktop

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Build para producción

```bash
npm run build
npm run preview
```

## Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests con UI interactiva
npm run test:ui

# Tests en modo CI (run once)
npm run test:run
```

Ver [docs/testing.md](./docs/testing.md) para documentación completa de testing.

## Estructura del Proyecto

```
kinetic_ai/
├── public/              # Assets estáticos
│   ├── manifest.json    # Manifest PWA
│   └── icons/           # Iconos de la app
├── src/
│   ├── lib/             # Lógica de negocio
│   │   ├── pose/        # Motor de detección de pose
│   │   ├── rep/         # Contador de repeticiones
│   │   ├── utils/       # Utilidades
│   │   └── premium/     # Funcionalidades premium (placeholders)
│   ├── components/      # Componentes React
│   ├── hooks/           # React hooks personalizados
│   ├── styles/          # Estilos CSS
│   └── workers/         # Web Workers (placeholder)
├── docs/                # Documentación técnica
└── tests/               # Tests (pendiente)
```

## Módulos Principales

### Pose Engine (`src/lib/pose/`)
- `loader.ts`: Carga de modelos TensorFlow
- `backend.ts`: Selector de backend (MoveNet/MediaPipe)
- `inference.ts`: Ejecución de inferencia
- `smoothing.ts`: Suavizado de keypoints (EMA)

### Rep Counter (`src/lib/rep/`)
- `angles.ts`: Cálculo de ángulos entre keypoints
- `thresholds.ts`: Umbrales configurables por ejercicio
- `state-machine.ts`: Máquina de estados para contar reps
- `exercises/`: Lógica específica por ejercicio

## Uso en Móvil

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"
4. Acepta permisos de cámara cuando se soliciten

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú (tres puntos)
3. Selecciona "Agregar a pantalla de inicio"
4. Acepta permisos de cámara cuando se soliciten

## Testing de Cámara

La app requiere permisos de cámara. En desarrollo local:
- Desktop: funciona en localhost
- Móvil: requiere HTTPS o usar ngrok/similar

## Documentación Adicional

- [Arquitectura](./docs/architecture.md)
- [Modelos de Pose](./docs/pose-models.md)
- [Contador de Repeticiones](./docs/rep-counter.md)
- [PWA](./docs/pwa.md)
- [Decisiones Técnicas](./docs/decisions.md)

## Tecnologías

- React 18
- TypeScript
- Vite
- TensorFlow.js
- MoveNet
- Vite PWA Plugin

## Licencia

Consultar archivo LICENSE
