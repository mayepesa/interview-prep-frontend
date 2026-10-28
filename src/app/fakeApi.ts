/**
 * API falsa para los ejemplos: responde con retraso y respeta AbortSignal,
 * igual que fetch. Así los ejemplos funcionan sin red.
 */
export const PROJECTS = [
  "Atlas migration",
  "Billing dashboard",
  "Capacity planner",
  "Customer portal",
  "Design system",
  "Expense reports",
  "Jira integration",
  "Mobile timesheets",
  "Onboarding flow",
  "Payroll export",
  "Reporting API",
  "Resource planning",
  "Search service",
  "Team calendar",
  "Time tracker",
] as const;

export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export async function searchProjects(
  query: string,
  { signal, delayMs }: { signal?: AbortSignal; delayMs?: number } = {},
): Promise<string[]> {
  // Las búsquedas cortas tardan más a propósito: así se ve la "race condition".
  const delay = delayMs ?? Math.max(150, 900 - query.length * 150);
  await wait(delay, signal);
  const q = query.trim().toLowerCase();
  return PROJECTS.filter((p) => p.toLowerCase().includes(q));
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
