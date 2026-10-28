import { useState } from "react";
import { searchProjects } from "../../app/fakeApi";
import { useAsync } from "../hooks/useAsync";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useLocalStorage } from "../hooks/useLocalStorage";

/** Un custom hook mínimo: encapsula un booleano y sus acciones. */
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const;
}

function Switch({ label }: { label: string }) {
  const [on, toggle] = useToggle();
  return (
    <button type="button" onClick={toggle} aria-pressed={on}>
      {label}: {on ? "ON" : "OFF"}
    </button>
  );
}

/** Dos componentes usan el mismo hook: comparten la lógica, NO el estado. */
export function ToggleDemo() {
  return (
    <div className="row">
      <Switch label="Notificaciones" />
      <Switch label="Modo oscuro" />
    </div>
  );
}

/** useDebouncedValue en vivo: el valor "debounced" llega cuando dejas de escribir. */
export function DebounceDemo() {
  const [text, setText] = useState("");
  const debounced = useDebouncedValue(text, 500);
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe y para"
        aria-label="texto a debouncear"
      />
      <p>
        Escrito: <strong>“{text}”</strong> · Debounced (500 ms): <strong>“{debounced}”</strong>
      </p>
    </div>
  );
}

const isString = (v: unknown): v is string => typeof v === "string";

/** Tres hooks compuestos: localStorage + debounce + async. */
export function ProjectFinder() {
  const [query, setQuery] = useLocalStorage("study:custom-hooks:query", "", isString);
  const debounced = useDebouncedValue(query, 400);
  const state = useAsync(
    (signal) => searchProjects(debounced, { signal, delayMs: 300 }),
    [debounced],
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar proyecto"
        aria-label="buscar proyecto"
      />
      <p className="note">
        Escrito: “{query}” · Buscado: “{debounced}” · Estado: <strong>{state.status}</strong>
      </p>
      {state.status === "success" && (
        <ul>
          {state.data.slice(0, 5).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
