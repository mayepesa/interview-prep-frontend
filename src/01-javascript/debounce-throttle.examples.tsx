import { useEffect, useMemo, useState } from "react";
import { isAbortError, searchProjects } from "../app/fakeApi";
import { useDebouncedValue } from "../03-react/hooks/useDebouncedValue";
import { debounce, throttle } from "./debounce-throttle";

const boxStyle = {
  height: 140,
  border: "1px dashed var(--accent)",
  borderRadius: 8,
  display: "grid",
  placeItems: "center",
  userSelect: "none",
} as const;

/** Cuenta los eventos mousemove crudos, con throttle y con debounce. */
export function MouseMoveCounter() {
  const [counts, setCounts] = useState({ raw: 0, throttled: 0, debounced: 0 });

  // useMemo: las funciones se crean UNA vez; si se recrearan en cada render, perderían su timer.
  const handlers = useMemo(
    () => ({
      throttled: throttle(() => setCounts((c) => ({ ...c, throttled: c.throttled + 1 })), 300),
      debounced: debounce(() => setCounts((c) => ({ ...c, debounced: c.debounced + 1 })), 300),
    }),
    [],
  );

  useEffect(() => () => handlers.debounced.cancel(), [handlers]);

  const onMove = () => {
    setCounts((c) => ({ ...c, raw: c.raw + 1 }));
    handlers.throttled();
    handlers.debounced();
  };

  return (
    <div>
      <div style={boxStyle} onMouseMove={onMove} onTouchMove={onMove}>
        Mueve el mouse aquí dentro
      </div>
      <table style={{ marginTop: 12 }}>
        <tbody>
          <tr>
            <td>Eventos crudos</td>
            <td>
              <strong>{counts.raw}</strong>
            </td>
          </tr>
          <tr>
            <td>Throttle (máx. 1 cada 300 ms)</td>
            <td>
              <strong>{counts.throttled}</strong>
            </td>
          </tr>
          <tr>
            <td>Debounce (300 ms sin eventos)</td>
            <td>
              <strong>{counts.debounced}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={() => setCounts({ raw: 0, throttled: 0, debounced: 0 })}>
        Reset
      </button>
    </div>
  );
}

/**
 * Buscador que cuenta cuántas "peticiones" sale a hacer.
 * Con `debounced` usa la función debounce() del módulo y cancela al desmontar.
 */
export function KeystrokeSearch({ debounced }: { debounced: boolean }) {
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const search = useMemo(() => {
    const run = (q: string) => {
      setRequests((n) => n + 1);
      searchProjects(q, { delayMs: 150 }).then(setResults);
    };
    return debounced ? debounce(run, 400) : Object.assign(run, { cancel: () => {} });
  }, [debounced]);

  useEffect(() => () => search.cancel(), [search]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
        placeholder="Escribe: planner"
        aria-label={debounced ? "buscar con debounce" : "buscar sin debounce"}
      />
      <p>
        Teclas: <strong>{query.length}</strong> · Peticiones: <strong>{requests}</strong> ·
        Resultados: {results.slice(0, 3).join(", ") || "—"}
      </p>
    </div>
  );
}

/** El patrón más común en React: debounce del VALOR con useDebouncedValue + AbortController. */
export function DebouncedValueSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    searchProjects(debouncedQuery, { signal: controller.signal, delayMs: 150 })
      .then(setResults)
      .catch((error: unknown) => {
        if (!isAbortError(error)) setResults([]);
      });
    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe: report"
        aria-label="buscar con useDebouncedValue"
      />
      <p>
        Escribiste <strong>“{query}”</strong> · se busca <strong>“{debouncedQuery}”</strong> →{" "}
        {results.slice(0, 3).join(", ") || "—"}
      </p>
    </div>
  );
}
