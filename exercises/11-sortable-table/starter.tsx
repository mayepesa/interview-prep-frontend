import type { Entry } from "./types";

// ¿Empezaste este ejercicio? Cambia `false` por `true` y sus tests empezarán a correr.
export const started = false;

export function EntriesTable({ entries, pageSize = 5 }: { entries: Entry[]; pageSize?: number }) {
  // TODO
  return (
    <p>
      TODO {entries.length} {pageSize}
    </p>
  );
}
