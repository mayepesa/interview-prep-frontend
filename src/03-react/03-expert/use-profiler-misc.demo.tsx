import {
  Children,
  cloneElement,
  isValidElement,
  Profiler,
  Suspense,
  use,
  useDebugValue,
  useState,
  useSyncExternalStore,
  type ProfilerOnRenderCallback,
  type ReactElement,
  type ReactNode,
} from "react";
import type { DemoMeta } from "../../app/registry";
import { searchProjects } from "../../app/fakeApi";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "use(promise), Profiler, cloneElement y useDebugValue",
  section: "react-expert",
  order: 420,
  questions: [
    "¿Qué es la función use y para qué se utiliza?",
    "¿Qué es el Profiler en React?",
    "¿Para qué sirve el método cloneElement?",
    "¿Qué es el hook useDebugValue?",
  ],
  sayIt:
    "use reads a promise or a context during render and suspends until the promise resolves, so Suspense shows the fallback. The Profiler component reports how long a subtree takes to render, which is how I find what to optimize. cloneElement copies an element with extra props, though composition is usually clearer.",
};

// La promesa se crea FUERA del render (o se cachea): si se creara en cada render, suspendería sin fin.
const cache = new Map<string, Promise<string[]>>();
function getProjects(query: string) {
  if (!cache.has(query)) cache.set(query, searchProjects(query, { delayMs: 800 }));
  return cache.get(query)!;
}

function ProjectList({ query }: { query: string }) {
  const projects = use(getProjects(query)); // suspende hasta que resuelve
  return <p>{projects.join(", ") || "Sin resultados"}</p>;
}

function useOnlineLabel(online: boolean) {
  useDebugValue(online ? "Online" : "Offline"); // visible en React DevTools
  return online ? "en línea" : "sin conexión";
}

// cloneElement: agrega props a cada hijo.
function ButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className="row">
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ "data-index"?: number; style?: object }>, {
              "data-index": index,
              style: { borderRadius: 999 },
            })
          : child,
      )}
    </div>
  );
}

// Las mediciones van a un store externo. Si se guardaran en el estado del padre,
// cada medición re-renderizaría el árbol medido y generaría otra medición: un bucle.
let timings: string[] = [];
const timingListeners = new Set<() => void>();
const timingsStore = {
  subscribe: (listener: () => void) => {
    timingListeners.add(listener);
    return () => timingListeners.delete(listener);
  },
  get: () => timings,
};

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  timings = [...timings, `${id} ${phase}: ${actualDuration.toFixed(2)} ms`].slice(-5);
  queueMicrotask(() => timingListeners.forEach((listener) => listener()));
};

function TimingsLog() {
  const list = useSyncExternalStore(timingsStore.subscribe, timingsStore.get);
  return (
    <ol className="log">
      {list.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ol>
  );
}

export default function UseProfilerMisc() {
  const [query, setQuery] = useState("time");
  const label = useOnlineLabel(navigator.onLine);

  return (
    <>
      <Panel title="use(promise) + Suspense">
        <div className="row">
          {["time", "plan", "report"].map((q) => (
            <button key={q} type="button" onClick={() => setQuery(q)} aria-pressed={q === query}>
              {q}
            </button>
          ))}
        </div>
        <Suspense fallback={<p>Buscando…</p>}>
          <ProjectList query={query} />
        </Suspense>
      </Panel>
      <Panel title="Profiler">
        <Profiler id="Contador" onRender={onRender}>
          <ProfiledCounter />
        </Profiler>
        <TimingsLog />
        <Note>
          En el día a día uso la pestaña Profiler de React DevTools; el componente sirve para medir
          en código.
        </Note>
      </Panel>
      <Panel title="cloneElement y useDebugValue">
        <ButtonGroup>
          <button type="button">Día</button>
          <button type="button">Semana</button>
          <button type="button">Mes</button>
        </ButtonGroup>
        <p className="note">Hook con useDebugValue: {label} (míralo en React DevTools).</p>
        <Snippet>{`cloneElement(child, { extraProp: 1 })  // copia el elemento con props nuevas`}</Snippet>
      </Panel>
    </>
  );
}

function ProfiledCounter() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN(n + 1)}>
      Clics: {n}
    </button>
  );
}
