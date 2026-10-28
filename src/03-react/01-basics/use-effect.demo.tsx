import { useEffect, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { isAbortError, searchProjects } from "../../app/fakeApi";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "useEffect: montar, suscribirse, limpiar y cancelar",
  section: "react-basics",
  order: 160,
  questions: [
    "¿Qué hace el hook useEffect? Explica casos de uso",
    "¿Cómo suscribirse a un evento en useEffect?",
    "¿Cómo ejecutar código cuando el componente se monta y se desmonta?",
    "¿Cuántos useEffect puede tener un componente?",
    "¿Cómo cancelar una petición a una API en useEffect correctamente?",
    "¿Qué es un efecto colateral (side effect)?",
  ],
  sayIt:
    "useEffect synchronizes a component with something outside React: subscriptions, timers, the network. Every effect that starts something returns a cleanup. For fetching, I abort the previous request in the cleanup so a slow old response can't overwrite a newer one.",
};

function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    // Suscribirse al montar...
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // ...y desuscribirse al desmontar (o antes de volver a correr el efecto).
    return () => window.removeEventListener("resize", onResize);
  }, []); // [] = solo al montar

  return <p>Ancho de la ventana: {width}px (cambia el tamaño)</p>;
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // sin esto, el intervalo sigue vivo tras desmontar
  }, []);
  return <p>Reloj: {now.toLocaleTimeString()}</p>;
}

function Search({ abortPrevious }: { abortPrevious: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    searchProjects(query, { signal: abortPrevious ? controller.signal : undefined })
      .then(setResults)
      .catch((err: unknown) => {
        if (!isAbortError(err)) setError("No se pudo buscar");
      });

    return () => controller.abort(); // cancela la búsqueda anterior
  }, [query, abortPrevious]); // se re-ejecuta cuando cambia query

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe rápido: 'time'"
        aria-label="buscar proyectos"
      />
      {error && <p role="alert">{error}</p>}
      <p className="note">
        Buscando “{query}” → mostrando {results.length} resultados: {results.slice(0, 4).join(", ")}
      </p>
    </div>
  );
}

export default function UseEffectDemo() {
  const [mounted, setMounted] = useState(true);

  return (
    <>
      <Panel title="Suscripciones y limpieza al desmontar">
        <button type="button" onClick={() => setMounted((m) => !m)}>
          {mounted ? "Desmontar" : "Montar"}
        </button>
        {mounted && (
          <>
            <WindowWidth />
            <Clock />
          </>
        )}
        <Note>
          Un componente puede tener todos los useEffect que necesite: mejor uno por responsabilidad
          que uno gigante.
        </Note>
      </Panel>

      <Panel title="Race condition sin abortar">
        <Search abortPrevious={false} />
        <Note>
          Las búsquedas cortas tardan más. Si escribes rápido, una respuesta vieja puede llegar
          después y pisar el resultado correcto.
        </Note>
      </Panel>

      <Panel title="Con AbortController en el cleanup">
        <Search abortPrevious />
        <Snippet tone="good">{`
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(...);
  return () => controller.abort();
}, [url]);
        `}</Snippet>
      </Panel>
    </>
  );
}
