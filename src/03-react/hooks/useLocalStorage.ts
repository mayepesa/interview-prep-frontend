import { useEffect, useState } from "react";

/**
 * useState que persiste en localStorage.
 * `validate` protege de datos viejos o manipulados: lo que viene del storage es `unknown`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      return validate(parsed) ? parsed : initialValue;
    } catch {
      return initialValue; // JSON roto o storage bloqueado (modo privado)
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Sin espacio o sin permiso: la app sigue funcionando en memoria.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
