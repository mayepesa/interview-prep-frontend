import { useEffect, useState } from "react";
import type { SearchFn } from "./types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: string[] }
  | { status: "error" };

export function ProjectSearch({ search, delay = 300 }: { search: SearchFn; delay?: number }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState({ status: "loading" });
      search(trimmed, controller.signal)
        .then((results) => {
          if (!controller.signal.aborted) setState({ status: "success", results });
        })
        .catch(() => {
          if (!controller.signal.aborted) setState({ status: "error" });
        });
    }, delay);

    // Una tecla nueva cancela el timer pendiente y la petición en curso.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, delay, search]);

  return (
    <div>
      <label htmlFor="project-search">Search projects</label>
      <input
        id="project-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {state.status === "loading" && <p role="status">Loading…</p>}
      {state.status === "error" && <p role="alert">Something went wrong</p>}
      {state.status === "success" &&
        (state.results.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <ul>
            {state.results.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ))}
    </div>
  );
}
