import type { DemoMeta } from "../../app/registry";
import { searchProjects } from "../../app/fakeApi";
import { Note, Panel, Snippet } from "../../app/ui";
import { useAsync } from "../hooks/useAsync";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const meta: DemoMeta = {
  title: "Custom hooks",
  section: "react-intermediate",
  order: 200,
  questions: [
    "¿Cómo crear un hook personalizado?",
    "¿Cuáles son las reglas de los hooks?",
    "¿Cómo puedo hacer testing de un hook?",
  ],
  sayIt:
    "A custom hook is a function starting with 'use' that calls other hooks, so I can reuse stateful logic instead of UI. Here a debounced value, a validated localStorage state and an async hook combine into a search in a few lines, and each one has its own tests with renderHook.",
};

const isString = (v: unknown): v is string => typeof v === "string";

export default function CustomHooksDemo() {
  const [query, setQuery] = useLocalStorage("demo:query", "", isString);
  const debounced = useDebouncedValue(query, 400);
  const state = useAsync(
    (signal) => searchProjects(debounced, { signal, delayMs: 300 }),
    [debounced],
  );

  return (
    <>
      <Panel title="Tres hooks compuestos: localStorage + debounce + async">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar proyecto"
          aria-label="buscar"
        />
        <p className="note">
          Escrito: “{query}” · Buscado: “{debounced}” · Estado: <strong>{state.status}</strong>
        </p>
        {state.status === "success" && (
          <ul>
            {state.data.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <Note>Recarga la página: la búsqueda sigue ahí gracias a useLocalStorage.</Note>
      </Panel>

      <Panel title="Reglas de los hooks">
        <ul>
          <li>Solo en el nivel superior: nunca dentro de if, loops o funciones anidadas.</li>
          <li>Solo desde componentes o desde otros hooks.</li>
          <li>React identifica cada hook por el orden de llamada; un if cambiaría ese orden.</li>
        </ul>
        <Snippet tone="bad">{`if (isAdmin) { const [x, setX] = useState(0) }`}</Snippet>
        <Snippet tone="good">{`const [x, setX] = useState(0)\nif (!isAdmin) return null`}</Snippet>
      </Panel>
    </>
  );
}
