import { useRef } from "react";

/**
 * Cuenta cuántas veces se renderizó el componente que lo llama.
 * Solo para enseñar: mutar un ref durante el render no se hace en producción,
 * y con StrictMode el número se duplica en desarrollo.
 */
export function useRenderCount(): number {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}
