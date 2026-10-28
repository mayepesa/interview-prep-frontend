export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  // TODO: tu implementación
  const debounced = (...args: Args) => {
    throw new Error("TODO: implementa debounce");
  };
  debounced.cancel = () => {};
  return debounced;
}
