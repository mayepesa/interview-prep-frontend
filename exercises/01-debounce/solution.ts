export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  function debounced(this: unknown, ...args: Args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  }

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
