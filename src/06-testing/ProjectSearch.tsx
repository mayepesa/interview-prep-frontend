import { useEffect, useState } from "react";
import { useDebouncedValue } from "../03-react/hooks/useDebouncedValue";

type Project = { id: number; name: string };

/** Componente que hace fetch real: sirve para practicar mocks de red y timers falsos. */
export function ProjectSearch() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!debounced) {
      setProjects([]);
      return;
    }
    const controller = new AbortController();
    setError(false);
    fetch(`/api/projects?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Project[]>;
      })
      .then(setProjects)
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [debounced]);

  return (
    <div>
      <label>
        Buscar proyecto <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {error && <p role="alert">Error al buscar</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
