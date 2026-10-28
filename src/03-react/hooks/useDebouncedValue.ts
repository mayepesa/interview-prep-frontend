import { useEffect, useState } from "react";

/** Devuelve `value` solo cuando dejó de cambiar durante `delayMs`. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // cada cambio cancela el timer anterior
  }, [value, delayMs]);

  return debounced;
}
