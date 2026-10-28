// ¿Empezaste este ejercicio? Cambia `false` por `true` y sus tests empezarán a correr.
export const started = false;

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  // TODO: tu implementación
  const debounced = (...args: Args) => {
    throw new Error("TODO: implementa debounce");
  };
  debounced.cancel = () => {};
  return debounced;
}
