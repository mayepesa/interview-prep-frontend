import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  Profiler,
  Suspense,
  use,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type FragmentInstance,
  type ProfilerOnRenderCallback,
  type ReactElement,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { searchProjects } from "../../app/fakeApi";

/* ---------- use(promise) ---------- */

// La promesa se crea FUERA del render y se cachea: si se creara en cada render, suspendería sin fin.
const cache = new Map<string, Promise<string[]>>();
function getProjects(query: string) {
  if (!cache.has(query)) cache.set(query, searchProjects(query, { delayMs: 900 }));
  return cache.get(query)!;
}

function ProjectList({ query }: { query: string }) {
  const projects = use(getProjects(query)); // suspende hasta que resuelve
  return <p>{projects.join(", ") || "Sin resultados"}</p>;
}

export function UsePromiseDemo() {
  const [query, setQuery] = useState("time");
  const [isPending, startTransition] = useTransition();
  const [withTransition, setWithTransition] = useState(false);

  const select = (q: string) => {
    if (withTransition) startTransition(() => setQuery(q));
    else setQuery(q);
  };

  return (
    <div>
      <div className="row">
        {["time", "plan", "report", "design"].map((q) => (
          <button key={q} type="button" onClick={() => select(q)} aria-pressed={q === query}>
            {q}
          </button>
        ))}
        <label className="row">
          <input
            type="checkbox"
            checked={withTransition}
            onChange={(e) => setWithTransition(e.target.checked)}
          />
          con startTransition
        </label>
      </div>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <Suspense fallback={<p>Buscando…</p>}>
          <ProjectList query={query} />
        </Suspense>
      </div>
    </div>
  );
}

/* ---------- Profiler ---------- */

// Las mediciones van a un store externo: si se guardaran en el estado del padre,
// cada medición re-renderizaría el árbol medido y generaría otra medición (un bucle).
let timings: string[] = [];
const timingListeners = new Set<() => void>();
const timingsStore = {
  subscribe: (listener: () => void) => {
    timingListeners.add(listener);
    return () => timingListeners.delete(listener);
  },
  get: () => timings,
};

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
  timings = [
    ...timings,
    `${id} · ${phase} · actual ${actualDuration.toFixed(2)} ms · base ${baseDuration.toFixed(2)} ms`,
  ].slice(-5);
  queueMicrotask(() => timingListeners.forEach((listener) => listener()));
};

function TimingsLog() {
  const list = useSyncExternalStore(timingsStore.subscribe, timingsStore.get);
  return (
    <ol className="console">
      {list.length === 0 ? (
        <li className="muted">
          {import.meta.env.DEV
            ? "Las mediciones aparecen aquí"
            : "Este es un build de producción: <Profiler> no mide. Ábrelo con npm run dev."}
        </li>
      ) : (
        list.map((t, i) => <li key={i}>{t}</li>)
      )}
    </ol>
  );
}

function HeavyCounter() {
  const [n, setN] = useState(0);
  const end = performance.now() + 4; // ~4 ms de trabajo por render
  while (performance.now() < end) {
    /* trabajo simulado */
  }
  return (
    <button type="button" onClick={() => setN(n + 1)}>
      Clics: {n}
    </button>
  );
}

export function ProfilerDemo() {
  return (
    <div>
      <Profiler id="HeavyCounter" onRender={onRender}>
        <HeavyCounter />
      </Profiler>
      <TimingsLog />
    </div>
  );
}

/* ---------- cloneElement ---------- */

export function ButtonGroup({ children, size }: { children: ReactNode; size: "sm" | "lg" }) {
  return (
    <div className="row">
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ "data-index"?: number; style?: object }>, {
              "data-index": index,
              style: { borderRadius: 999, padding: size === "lg" ? "10px 18px" : "4px 10px" },
            })
          : child,
      )}
    </div>
  );
}

export function CloneElementDemo() {
  const [size, setSize] = useState<"sm" | "lg">("sm");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <ButtonGroup size={size}>
        <button type="button">Día</button>
        <button type="button">Semana</button>
        <button type="button">Mes</button>
      </ButtonGroup>
      <label className="row">
        <input
          type="checkbox"
          checked={size === "lg"}
          onChange={(e) => setSize(e.target.checked ? "lg" : "sm")}
        />
        Tamaño grande (el grupo lo inyecta en cada hijo)
      </label>
    </div>
  );
}

/* ---------- flushSync ---------- */

export function FlushSyncDemo() {
  const [items, setItems] = useState(() => Array.from({ length: 6 }, (_, i) => `Mensaje ${i + 1}`));
  const listRef = useRef<HTMLUListElement>(null);

  const scrollToLast = () => {
    const list = listRef.current;
    list?.lastElementChild?.scrollIntoView({ block: "nearest" });
  };

  const addNormal = () => {
    setItems((prev) => [...prev, `Mensaje ${prev.length + 1}`]);
    scrollToLast(); // el DOM todavía no tiene el mensaje nuevo
  };

  const addWithFlushSync = () => {
    flushSync(() => setItems((prev) => [...prev, `Mensaje ${prev.length + 1}`]));
    scrollToLast(); // el DOM ya está actualizado
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <button type="button" onClick={addNormal}>
          Agregar (setState normal)
        </button>
        <button type="button" onClick={addWithFlushSync}>
          Agregar (flushSync)
        </button>
      </div>
      <ul ref={listRef} style={{ maxHeight: 100, overflow: "auto", margin: 0 }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Fragment ref ---------- */

export function FragmentRefDemo() {
  const fragmentRef = useRef<FragmentInstance>(null);
  return (
    <div className="row">
      <Fragment ref={fragmentRef}>
        <input placeholder="Primer campo" aria-label="primer campo" />
        <input placeholder="Segundo campo" aria-label="segundo campo" />
      </Fragment>
      <button type="button" onClick={() => fragmentRef.current?.focus()}>
        focus() del Fragment
      </button>
      <button type="button" onClick={() => fragmentRef.current?.focusLast()}>
        focusLast()
      </button>
    </div>
  );
}
