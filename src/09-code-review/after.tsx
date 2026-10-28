// La versión después del review. Compárala con before.tsx y con los comentarios de la página.

import { useEffect, useState } from "react";

type Entry = { id: string; hours: number; description: string };

type Props = {
  userId: string;
  title: string;
  onSelect: (entry: Entry) => void;
};

type State = { status: "loading" } | { status: "error" } | { status: "success"; entries: Entry[] };

function isEntry(value: unknown): value is Entry {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "hours" in value &&
    typeof value.hours === "number" &&
    "description" in value &&
    typeof value.description === "string"
  );
}

export function WeeklyHours({ userId, title, onSelect }: Props) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    // La clave secreta vive en el backend; el front llama a su propia API.
    fetch(`/api/entries?user=${encodeURIComponent(userId)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        const entries = Array.isArray(data) ? data.filter(isEntry) : [];
        setState({ status: "success", entries });
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setState({ status: "error" });
      });

    return () => controller.abort();
  }, [userId]);

  if (state.status === "loading") return <p role="status">Loading…</p>;
  if (state.status === "error") return <p role="alert">Could not load your hours.</p>;

  const { entries } = state;
  const total = entries.reduce((sum, entry) => sum + entry.hours, 0); // estado derivado

  return (
    <section aria-labelledby="weekly-hours-title">
      {entries.length > 0 && <h3 id="weekly-hours-title">{title}</h3>}
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <button type="button" onClick={() => onSelect(entry)}>
              {entry.description} · {entry.hours} h
            </button>
          </li>
        ))}
      </ul>
      <p>Total: {total} h</p>
    </section>
  );
}
