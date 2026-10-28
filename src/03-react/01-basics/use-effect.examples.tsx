import { useEffect, useState } from "react";
import { isAbortError, searchProjects } from "../../app/fakeApi";

/** Se suscribe al evento resize al montar y se desuscribe al desmontar. */
export function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <p>Ancho de la ventana: {width}px</p>;
}

/** Un intervalo con su cleanup. */
export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Hora: {now.toLocaleTimeString()}</p>;
}

/** Monta y desmonta los hijos para ver los cleanups en acción. */
export function MountToggle({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setMounted((m) => !m)}>
        {mounted ? "Desmontar" : "Montar"}
      </button>
      {mounted && children}
    </div>
  );
}

/** Muestra en qué orden corren render, efecto y cleanup. */
export function EffectLifecycle() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((prev) => [...prev.slice(-7), line]);

  useEffect(() => {
    add(`efecto con count = ${count}`);
    return () => add(`cleanup del efecto con count = ${count}`);
  }, [count]);

  return (
    <div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        count: {count} (+1)
      </button>
      <ol className="console">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Buscador que pide datos cada vez que cambia la búsqueda.
 * Con `abortPrevious = false` aparece la race condition.
 */
export function ProjectSearch({ abortPrevious }: { abortPrevious: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    searchProjects(query, { signal: abortPrevious ? controller.signal : undefined })
      .then(setResults)
      .catch((error: unknown) => {
        if (!isAbortError(error)) setResults([]);
      });

    return () => controller.abort();
  }, [query, abortPrevious]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe rápido: time"
        aria-label="buscar proyectos"
      />
      <p>
        Buscaste <strong>“{query}”</strong> → se muestran resultados de {results.length} proyectos:{" "}
        {results.slice(0, 3).join(", ") || "—"}
      </p>
    </div>
  );
}
