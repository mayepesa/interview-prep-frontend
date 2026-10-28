import type { Entry, Project } from "./types";

// ¿Empezaste este ejercicio? Cambia `false` por `true` y sus tests empezarán a correr.
export const started = false;

export function hoursByProject(entries: Entry[]): Record<string, number> {
  throw new Error("TODO");
}

export function hoursByDay(entries: Entry[]): Record<string, number> {
  throw new Error("TODO");
}

export function topProjects(entries: Entry[], n: number): { project: string; hours: number }[] {
  throw new Error("TODO");
}

export function attachProjects(
  entries: Entry[],
  projects: Project[],
): (Entry & { projectName: string })[] {
  throw new Error("TODO");
}
