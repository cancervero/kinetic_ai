# Guía para Ejecutar Kinetic AI Localmente

Esta guía te ayudará a ejecutar y probar la aplicación de detección de poses en tu computadora local.

## ✅ Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Navegador moderno** con soporte para WebGL (Chrome, Edge, Firefox)
- **Cámara web** conectada y funcionando

## 🚀 Pasos para Ejecutar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:5173` (o el puerto que esté disponible).

### 3. Abrir la aplicación

- Abre tu navegador y ve a la URL mostrada en la terminal (usualmente `http://localhost:5173`)
- **IMPORTANTE**: Debes usar HTTPS o localhost para que la cámara funcione. Vite automáticamente usa localhost.

### 4. Permitir acceso a la cámara

Cuando abras la aplicación:
1. El navegador te pedirá permiso para acceder a la cámara
2. Haz clic en "Permitir" o "Allow"
3. Espera unos segundos mientras se carga el modelo de IA

## 🎯 Cómo Usar la Aplicación

### Para Sentadillas (Squats):
1. Selecciona "Sentadillas" en el selector de ejercicio
2. Párate frente a la cámara
3. Asegúrate de que tu cuerpo completo sea visible (de pies a cabeza)
4. Haz una sentadilla:
   - **Posición inicial**: De pie con piernas rectas
   - **Baja**: Dobla las rodillas hasta ~90-135 grados
   - **Sube**: Vuelve a la posición inicial
5. El contador se incrementará cuando completes un ciclo completo (arriba → abajo → arriba)

### Para Lagartijas (Pushups):
1. Selecciona "Lagartijas" en el selector de ejercicio
2. Posiciónate en el suelo en posición de lagartija
3. Asegúrate de que tu cuerpo sea visible lateralmente
4. Haz una lagartija:
   - **Posición inicial**: Brazos extendidos
   - **Baja**: Dobla los codos hasta ~90-110 grados
   - **Sube**: Vuelve a la posición inicial
5. El contador se incrementará cuando completes un ciclo completo

## 🔍 Solución de Problemas

### ❌ "Cargando modelo..." se queda indefinidamente

**Causa**: El modelo de TensorFlow.js no se está cargando.

**Soluciones**:

1. **Abre la consola del navegador** (F12 o Ctrl+Shift+I)
2. Busca mensajes que empiecen con `[Kinetic AI]`
3. Revisa si hay errores específicos

**Posibles problemas**:

#### A) Error de WebGL
```
Error: Backend 'webgl' has not been registered
```

**Solución**:
- Verifica que tu navegador soporte WebGL: https://get.webgl.org/
- Prueba con otro navegador (Chrome o Edge recomendados)
- Actualiza tus drivers de gráficos

#### B) Error de red/CORS
```
Failed to fetch model
```

**Solución**:
- Verifica tu conexión a internet (el modelo se descarga de internet la primera vez)
- Desactiva extensiones del navegador (adblockers, VPN) temporalmente
- Limpia la caché del navegador

#### C) Error de permisos de cámara
```
Permission denied
```

**Solución**:
- Verifica que diste permiso a la cámara
- Revisa la configuración de privacidad del navegador
- En Chrome: `chrome://settings/content/camera`

### ❌ La cámara se ve pero el skeleton no aparece

**Causa**: La detección de poses no está funcionando.

**Solución**:
1. Verifica en la consola si hay errores
2. Asegúrate de que tu cuerpo esté completamente visible
3. Mejora la iluminación del ambiente
4. Muévete para que el sistema detecte movimiento

### ❌ El contador no se incrementa

**Causa**: La postura no está alcanzando los umbrales necesarios.

**Debugging**:
1. Abre la consola del navegador (F12)
2. Observa si el skeleton (líneas verdes) se dibuja sobre tu cuerpo
3. Verifica que los puntos clave (articulaciones) se detecten correctamente

**Soluciones**:
- **Sentadillas**: Baja más, asegúrate de doblar las rodillas al menos 45 grados
- **Lagartijas**: Baja más, los codos deben doblarse significativamente
- Asegúrate de hacer el movimiento completo (arriba → abajo → arriba)
- Mantén el cuerpo completo visible en el cuadro

## 📊 Logs de Debug

Para ver información detallada sobre lo que está pasando:

1. Abre la consola del navegador (F12)
2. Busca mensajes con estos prefijos:
   - `[Kinetic AI]` - Inicialización del modelo
   - `[usePoseDetection]` - Detección de poses
   - Errores en rojo

## 🔧 Configuración Avanzada

### Cambiar el modelo de IA

Por defecto usa MoveNet Lightning (rápido, menos preciso). Puedes cambiar a Thunder (lento, más preciso):

1. Edita `src/hooks/usePoseDetection.ts`
2. Cambia `modelType: 'lightning'` por `modelType: 'thunder'`
3. Recarga la página

### Ajustar sensibilidad del contador

Los umbrales de ángulos están en `src/lib/rep/thresholds.ts`:

```typescript
const SQUAT_THRESHOLDS: ExerciseThresholds = {
  topAngle: 165,      // Ángulo cuando estás arriba (casi recto)
  bottomAngle: 135,   // Ángulo cuando estás abajo (doblado)
  minDebounce: 100    // Tiempo mínimo entre transiciones (ms)
};
```

Puedes ajustar estos valores si el contador es muy sensible o muy poco sensible.

## ❓ Preguntas Frecuentes

### ¿Necesito API keys o configuración especial?

**No.** La aplicación usa modelos de IA que se ejecutan completamente en tu navegador. No necesitas:
- ❌ API keys
- ❌ Servidor backend
- ❌ Base de datos
- ❌ Credenciales de servicios cloud

Solo necesitas internet la primera vez para descargar el modelo (~5-10 MB).

### ¿Funciona offline?

Sí, después de la primera carga. El navegador cachea el modelo automáticamente.

### ¿Qué navegadores son compatibles?

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (puede ser más lento)

### ¿Por qué es lento?

La detección de poses usa IA que corre en tu GPU. Factores que afectan velocidad:
- Potencia de tu GPU
- Resolución de la cámara (640x480 por defecto)
- Modelo usado (Lightning vs Thunder)

## 📞 Soporte

Si tienes problemas no cubiertos en esta guía:

1. Revisa la consola del navegador (F12) para errores específicos
2. Verifica que cumples todos los requisitos previos
3. Prueba con otro navegador
4. Reporta el issue en el repositorio de GitHub con:
   - Mensaje de error completo
   - Navegador y versión
   - Sistema operativo
   - Screenshots si es posible
