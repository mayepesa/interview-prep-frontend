import type { Entry, Project } from "./types";

// O(n)
export function hoursByProject(entries: Entry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) totals[e.project] = (totals[e.project] ?? 0) + e.hours;
  return totals;
}

// O(n + d log d), d = días distintos
export function hoursByDay(entries: Entry[]): Record<string, number> {
  const totals = new Map<string, number>();
  for (const e of entries) totals.set(e.date, (totals.get(e.date) ?? 0) + e.hours);
  return Object.fromEntries([...totals].sort(([a], [b]) => a.localeCompare(b)));
}

// O(n + p log p), p = proyectos distintos
export function topProjects(entries: Entry[], n: number) {
  return Object.entries(hoursByProject(entries))
    .map(([project, hours]) => ({ project, hours }))
    .sort((a, b) => b.hours - a.hours || a.project.localeCompare(b.project))
    .slice(0, n);
}

// O(n + m): Map primero, búsquedas O(1) después
export function attachProjects(entries: Entry[], projects: Project[]) {
  const names = new Map(projects.map((p) => [p.id, p.name]));
  return entries.map((e) => ({ ...e, projectName: names.get(e.projectId) ?? "Unknown" }));
}
