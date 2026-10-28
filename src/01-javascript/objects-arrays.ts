// ─── Copias superficiales vs profundas ───────────────────────────────────────

export type Entry = { id: string; project: string; hours: number; tags: string[] };

/** Spread copia UN nivel: los arrays y objetos anidados se comparten. */
export function shallowCopy(entry: Entry): Entry {
  return { ...entry };
}

/** structuredClone copia todo (no copia funciones ni instancias de clases propias). */
export function deepCopy(entry: Entry): Entry {
  return structuredClone(entry);
}

/** Actualización inmutable de un campo anidado, como en un reducer de React. */
export function addTag(entry: Entry, tag: string): Entry {
  return { ...entry, tags: [...entry.tags, tag] };
}

// ─── Igualdad ────────────────────────────────────────────────────────────────
// === compara valores primitivos y REFERENCIAS de objetos. React usa Object.is.
export const sameReference = (a: object, b: object) => a === b;

// ─── Métodos de arrays que hay que dominar ───────────────────────────────────

export const entries: Entry[] = [
  { id: "1", project: "Planner", hours: 3, tags: ["dev"] },
  { id: "2", project: "Timesheets", hours: 5, tags: ["review"] },
  { id: "3", project: "Planner", hours: 2, tags: ["dev", "meeting"] },
  { id: "4", project: "Reports", hours: 4, tags: [] },
];

export const totalHours = (list: Entry[]) => list.reduce((sum, e) => sum + e.hours, 0);

export const projectNames = (list: Entry[]) => [...new Set(list.map((e) => e.project))];

export const longEntries = (list: Entry[], min: number) => list.filter((e) => e.hours >= min);

export const hasMeetings = (list: Entry[]) => list.some((e) => e.tags.includes("meeting"));

export const allTagged = (list: Entry[]) => list.every((e) => e.tags.length > 0);

export const allTags = (list: Entry[]) => list.flatMap((e) => e.tags);

/** Agrupar con reduce: O(n), una sola pasada. */
export function hoursByProject(list: Entry[]): Record<string, number> {
  return list.reduce<Record<string, number>>((acc, e) => {
    acc[e.project] = (acc[e.project] ?? 0) + e.hours;
    return acc;
  }, {});
}

/** Object.groupBy (ES2024) hace lo mismo sin reduce. */
export function groupByProject(list: Entry[]) {
  return Object.groupBy(list, (e) => e.project);
}

/** sort muta el array; toSorted (ES2023) devuelve uno nuevo. */
export const sortedByHours = (list: Entry[]) => list.toSorted((a, b) => b.hours - a.hours);

// ─── Destructuring, rest, optional chaining, nullish ─────────────────────────

export function describeUser(user?: { name?: string; team?: { name?: string } }) {
  const { name = "Anónimo", team } = user ?? {};
  return `${name} · ${team?.name ?? "sin equipo"}`;
}

/** ?? solo reemplaza null/undefined; || también reemplaza 0 y "". */
export const withNullish = (value: number | null) => value ?? 10;
export const withOr = (value: number | null) => value || 10;
