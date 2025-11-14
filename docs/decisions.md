# Decisiones Técnicas (ADRs)

## ADR-001: MoveNet como Modelo Principal

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos un modelo de detección de pose que funcione en tiempo real en dispositivos móviles.

**Opciones consideradas:**
1. MoveNet (TensorFlow.js)
2. MediaPipe BlazePose
3. PoseNet (deprecated)
4. OpenPose (demasiado pesado)

**Decisión:** Usar MoveNet Lightning

**Razones:**
- Optimizado para inferencia en tiempo real
- Tamaño pequeño (~12MB)
- Excelente rendimiento en móvil (30+ FPS)
- Soporte oficial de TensorFlow.js
- Balanceo perfecto precisión/velocidad
- Backend WebGL bien soportado

**Consecuencias:**
- ✅ Rendimiento excelente
- ✅ Funciona offline tras primera carga
- ⚠️ Solo 17 keypoints (vs 33 de MediaPipe)
- ⚠️ Requiere WebGL (99%+ navegadores lo soportan)

---

## ADR-002: React sin Estado Global

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos gestionar estado de la aplicación (pose, contador, cámara).

**Opciones consideradas:**
1. React Context + useState
2. Redux
3. Zustand
4. Jotai
5. Solo useState local

**Decisión:** Solo useState + hooks locales

**Razones:**
- App es simple, no requiere estado global complejo
- Menos dependencias = bundle más pequeño
- Hooks custom encapsulan lógica efectivamente
- Composición de hooks es clara y testable
- YAGNI: no necesitamos Redux para esta escala

**Consecuencias:**
- ✅ Código más simple
- ✅ Bundle más pequeño
- ✅ Menos boilerplate
- ⚠️ Si crece complejidad, migrar a Context será fácil

---

## ADR-003: Arquitectura Modular Estricta

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Código debe ser mantenible, testable y escalable.

**Principios adoptados:**
- Máximo 15 líneas por función
- Máximo 150 líneas por archivo
- SOLID, DRY, KISS, YAGNI

**Decisión:** Aplicar límites estrictos

**Razones:**
- Funciones pequeñas son más fáciles de entender
- Archivos pequeños son más fáciles de navegar
- Fuerza separación de responsabilidades
- Facilita testing unitario
- Mejora reusabilidad

**Consecuencias:**
- ✅ Código altamente mantenible
- ✅ Onboarding más rápido
- ✅ Testing más simple
- ⚠️ Más archivos (pero bien organizados)

---

## ADR-004: Vite como Build Tool

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos bundler para desarrollo y producción.

**Opciones consideradas:**
1. Vite
2. Create React App (CRA)
3. Webpack manual
4. Parcel

**Decisión:** Vite

**Razones:**
- Dev server extremadamente rápido (ESM nativo)
- HMR instantáneo
- Build optimizado con Rollup
- Plugin PWA oficial
- Configuración mínima
- Futuro de React tooling

**Consecuencias:**
- ✅ DX excelente
- ✅ Builds rápidos
- ✅ PWA plugin integrado
- ✅ TypeScript support nativo

---

## ADR-005: No usar Web Workers (MVP)

**Fecha:** 2024-01

**Estado:** Aceptado temporalmente

**Contexto:**
Inferencia de ML puede ejecutarse en worker thread.

**Decisión:** Inferencia en main thread para MVP

**Razones:**
- MoveNet Lightning es suficientemente rápido
- Comunicación main↔worker agrega complejidad
- TensorFlow.js en worker requiere setup especial
- MVP prioriza simplicidad
- RequestAnimationFrame maneja bien el loop

**Consecuencias:**
- ✅ Implementación más simple
- ✅ Menos código
- ⚠️ Si rendimiento es problema, migrar a worker

**Futuro:**
- Módulo preparado en `src/workers/pose.worker.ts`
- Migración sencilla cuando sea necesario

---

## ADR-006: Smoothing con EMA

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Keypoints crudos tienen jitter (ruido frame a frame).

**Opciones consideradas:**
1. EMA (Exponential Moving Average)
2. Kalman Filter
3. OneEuro Filter
4. Simple Moving Average

**Decisión:** EMA con alpha=0.3

**Razones:**
- Implementación simple (~10 líneas)
- Performance excelente (O(1))
- Balance jitter/lag adecuado
- Memoria constante (solo frame anterior)
- Configurable fácilmente

**Consecuencias:**
- ✅ Keypoints estables
- ✅ Rendimiento óptimo
- ⚠️ Lag mínimo (~2 frames)

---

## ADR-007: TypeScript Strict Mode

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos type safety.

**Decisión:** TypeScript con strict: true

**Razones:**
- Catch errores en compile-time
- IntelliSense mejorado
- Refactoring seguro
- Documentación via tipos
- Estándar de la industria

**Consecuencias:**
- ✅ Menos bugs en runtime
- ✅ DX mejorado
- ⚠️ Curva de aprendizaje inicial

---

## ADR-008: Placeholders para Features Premium

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos arquitectura extensible para features futuras.

**Decisión:** Crear módulos placeholder documentados

**Módulos preparados:**
- `src/lib/premium/feedback/` - Retroalimentación avanzada
- `src/lib/premium/avatar/` - Coach 3D
- `src/lib/premium/audio/` - Text-to-Speech

**Razones:**
- Arquitectura extensible desde día 1
- Documentación clara de roadmap
- Interfaces definidas facilitan implementación futura
- No afecta bundle size (tree-shaking)

**Consecuencias:**
- ✅ Arquitectura preparada
- ✅ Roadmap claro
- ✅ Sin overhead en bundle

---

## ADR-009: State Machine para Rep Counter

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos lógica robusta para contar reps.

**Opciones consideradas:**
1. FSM (Finite State Machine)
2. Simple if/else
3. Peak detection algorithm
4. ML classifier

**Decisión:** FSM con 3 estados (idle, top, bottom)

**Razones:**
- Lógica clara y predecible
- Fácil de debuggear
- Debounce integrado naturalmente
- Extensible a más estados
- Performance óptima

**Consecuencias:**
- ✅ Contador robusto
- ✅ Fácil de testear
- ✅ Configurable via thresholds

---

## ADR-010: CSS Vanilla (No Tailwind/Styled-Components)

**Fecha:** 2024-01

**Estado:** Aceptado

**Contexto:**
Necesitamos estilos para la UI.

**Decisión:** CSS vanilla en archivo único

**Razones:**
- App es pequeña (~100 líneas CSS)
- No justifica dependencia adicional
- Performance óptimo (sin runtime)
- Fácil de mantener para esta escala
- YAGNI

**Consecuencias:**
- ✅ Sin dependencias extra
- ✅ Bundle más pequeño
- ⚠️ Si crece, considerar CSS modules

---

## Consideraciones de Rendimiento

### Targets

- **Desktop:** 60 FPS
- **Móvil:** 30 FPS mínimo
- **TTI:** <3 segundos
- **Bundle:** <1MB (sin modelo ML)

### Métricas Actuales

- **Bundle size:** ~400KB (gzipped)
- **Modelo ML:** 12MB (cacheado)
- **FPS móvil:** 30-40 (Pixel 5)
- **FPS desktop:** 60 (Chrome)

### Optimizaciones Aplicadas

1. **MoveNet Lightning** (modelo más rápido)
2. **RequestAnimationFrame** (sincroniza con refresh)
3. **EMA Smoothing** (O(1), mínimo overhead)
4. **Debounce** (reduce cómputo innecesario)
5. **Code Splitting** (Vite automático)
6. **Tree Shaking** (Vite automático)

---

## Alternativas No Seleccionadas

### MediaPipe (no en MVP)

**Por qué no:**
- Más complejo de integrar
- Mayor tamaño de bundle
- MoveNet es suficiente para MVP

**Cuándo reconsiderar:**
- Si necesitamos 33 keypoints
- Si necesitamos hand/face tracking
- Si MoveNet da problemas

### Redux/Zustand

**Por qué no:**
- Estado es simple
- Overhead innecesario
- YAGNI

**Cuándo reconsiderar:**
- Si agregamos múltiples páginas
- Si estado se vuelve complejo
- Si necesitamos time-travel debugging

### WebRTC (streaming a servidor)

**Por qué no:**
- Privacidad (todo local es mejor)
- Latencia
- Requiere backend
- Costo de servidor

**Cuándo reconsiderar:**
- Si queremos entrenar modelos custom
- Si necesitamos multi-usuario
- Si dispositivo es muy débil

---

## Decisiones Pendientes

### Testing Framework

**Opciones:**
- Vitest (ya en package.json)
- Jest
- Testing Library

**Estado:** Por decidir

### CI/CD

**Opciones:**
- GitHub Actions
- Vercel auto-deploy
- Netlify

**Estado:** Por decidir

### Analytics

**Opciones:**
- Google Analytics
- Plausible
- Sin analytics (privacidad)

**Estado:** Por decidir (inclinado a Plausible o ninguno)
