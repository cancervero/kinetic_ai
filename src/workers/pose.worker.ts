/**
 * Pose Detection Web Worker (PLACEHOLDER)
 *
 * Este worker está preparado para ejecutar inferencia de pose
 * en un thread separado para mejorar el rendimiento.
 *
 * Implementación pendiente para versiones futuras.
 * Por ahora, la inferencia se ejecuta en el main thread.
 */

self.addEventListener('message', (e) => {
  console.log('Pose worker received:', e.data);
  // TODO: Implement pose inference in worker
});

export {};
