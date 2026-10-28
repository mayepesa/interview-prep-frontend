/**
 * Debounce: ejecuta `fn` cuando dejan de llegar llamadas durante `wait` ms.
 * Uso típico: buscador, autoguardado, resize.
 *
 * Funciona gracias a un closure: `timer` sobrevive entre llamadas.
 */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

/**
 * Throttle: ejecuta `fn` como máximo una vez cada `wait` ms.
 * Uso típico: scroll, mousemove, analytics de eventos frecuentes.
 * Esta versión ejecuta la primera llamada al instante y la última al final del intervalo.
 */
export function throttle<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  let last = 0;
  let trailing: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | null = null;

  return (...args: Args) => {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      clearTimeout(trailing);
      trailing = undefined;
      last = now;
      fn(...args);
      return;
    }

    pendingArgs = args; // guardamos la última llamada para ejecutarla al final
    trailing ??= setTimeout(() => {
      last = Date.now();
      trailing = undefined;
      if (pendingArgs) fn(...pendingArgs);
      pendingArgs = null;
    }, remaining);
  };
}
