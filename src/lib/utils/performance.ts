export function measureFPS(): number {
  let lastTime = performance.now();
  let frames = 0;
  let fps = 0;

  return getNextFrame();

  function getNextFrame(): number {
    const now = performance.now();
    frames++;

    if (now >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (now - lastTime));
      lastTime = now;
      frames = 0;
    }

    return fps;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
