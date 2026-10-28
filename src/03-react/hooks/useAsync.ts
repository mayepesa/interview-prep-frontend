import { useEffect, useState } from "react";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

/**
 * Ejecuta una función async cuando cambian sus dependencias y cancela la anterior.
 * El estado es una unión discriminada: no existe "loading con error" a la vez.
 *
 * En producción usaría React Query (caché, reintentos, dedupe); este hook
 * muestra lo que esa librería resuelve por dentro.
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });

    return () => controller.abort();
    // Las dependencias las define quien llama, igual que en useEffect.
  }, deps);

  return state;
}
