// ─── Generics ────────────────────────────────────────────────────────────────
// Un tipo con parámetros: la misma función sirve para muchos tipos sin perder seguridad.

export function first<T>(list: readonly T[]): T | undefined {
  return list[0];
}

/** Restricción con extends: T debe tener `id`. */
export function byId<T extends { id: string }>(list: readonly T[]): Record<string, T> {
  return Object.fromEntries(list.map((item) => [item.id, item]));
}

/** keyof + generics: la clave debe existir en el objeto, y el retorno tiene el tipo correcto. */
export function pluck<T, K extends keyof T>(list: readonly T[], key: K): T[K][] {
  return list.map((item) => item[key]);
}

// ─── Uniones discriminadas ───────────────────────────────────────────────────
// Un campo literal (`status`) dice en qué caso estás. Imposible tener data y error a la vez.

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export function describe<T>(state: RequestState<T>): string {
  switch (state.status) {
    case "idle":
      return "Sin empezar";
    case "loading":
      return "Cargando…";
    case "success":
      return `Listo (${JSON.stringify(state.data)})`; // aquí TS sabe que existe data
    case "error":
      return `Error: ${state.error}`;
    default:
      return assertNever(state); // si agregas un caso y no lo manejas, no compila
  }
}

export function assertNever(value: never): never {
  throw new Error(`Caso no manejado: ${JSON.stringify(value)}`);
}

// ─── Narrowing y type guards ─────────────────────────────────────────────────

export type Entry = { id: string; project: string; hours: number };

/** Type guard: valida datos que vienen de afuera (API, localStorage) como `unknown`. */
export function isEntry(value: unknown): value is Entry {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "project" in value &&
    typeof value.project === "string" &&
    "hours" in value &&
    typeof value.hours === "number"
  );
}

export function parseEntries(json: string): Entry[] {
  const data: unknown = JSON.parse(json); // unknown, nunca any
  if (!Array.isArray(data)) return [];
  return data.filter(isEntry);
}

// ─── Utility types ───────────────────────────────────────────────────────────

export type EntryDraft = Omit<Entry, "id">; // sin id: lo pone el servidor
export type EntryPatch = Partial<EntryDraft>; // todos opcionales
export type EntryPreview = Pick<Entry, "project" | "hours">;
export type HoursByDay = Record<"mon" | "tue" | "wed" | "thu" | "fri", number>;
export type ReadonlyEntry = Readonly<Entry>;

export function applyPatch(entry: Entry, patch: EntryPatch): Entry {
  return { ...entry, ...patch };
}

// ─── Derivar tipos de valores (as const + typeof) ────────────────────────────

export const STATUSES = ["draft", "submitted", "approved"] as const;
export type Status = (typeof STATUSES)[number]; // "draft" | "submitted" | "approved"

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

/** satisfies valida la forma sin perder los tipos literales. */
export const STATUS_LABEL = {
  draft: "Borrador",
  submitted: "Enviado",
  approved: "Aprobado",
} satisfies Record<Status, string>;

// ─── Tipos avanzados que conviene reconocer ──────────────────────────────────

/** Template literal types. */
export type EventName = `on${Capitalize<"click" | "change">}`; // "onClick" | "onChange"

/** Mapped type: convierte cada propiedad en una función getter. */
export type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

/** Conditional type + infer: saca el tipo que resuelve una promesa. */
export type Awaited2<T> = T extends Promise<infer U> ? U : T;

/** ReturnType y Parameters de funciones existentes. */
export type ParseResult = ReturnType<typeof parseEntries>; // Entry[]
export type ApplyPatchParams = Parameters<typeof applyPatch>; // [Entry, EntryPatch]
