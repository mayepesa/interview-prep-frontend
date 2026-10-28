import type { SearchFn } from "./types";

// ¿Empezaste este ejercicio? Cambia `false` por `true` y sus tests empezarán a correr.
export const started = false;

export function ProjectSearch({ search, delay = 300 }: { search: SearchFn; delay?: number }) {
  // TODO
  return (
    <p>
      TODO {typeof search} {delay}
    </p>
  );
}
