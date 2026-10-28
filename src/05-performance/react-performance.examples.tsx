import {
  Profiler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ProfilerOnRenderCallback,
} from "react";
import { wait } from "../app/fakeApi";
import { RenderCount } from "../app/ui";
import { useRenderCount } from "../app/useRenderCount";
import { VirtualList } from "./VirtualList";

type Row = { id: number; user: string; project: string; hours: number };

const PROJECTS = ["Planner", "Timesheets", "Reports", "Structure"];

export const ROWS: Row[] = Array.from({ length: 100_000 }, (_, i) => ({
  id: i,
  user: `Usuario ${i % 250}`,
  project: PROJECTS[i % 4]!,
  hours: (i % 8) + 1,
}));

function RowView({ id, user, project, hours }: Row) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 1fr 60px",
        gap: 8,
        padding: "6px 12px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span className="note">#{id}</span>
      <span>{user}</span>
      <span>{project}</span>
      <span>{hours} h</span>
    </div>
  );
}

/** Una lista "cara": 400 filas, para que se note cuando se re-renderiza sin motivo. */
function SlowList() {
  const renders = useRenderCount();
  return (
    <div>
      <RenderCount label="SlowList" count={renders} />
      <div
        style={{
          height: 80,
          overflow: "auto",
          marginTop: 6,
          border: "1px solid var(--line)",
          borderRadius: 6,
        }}
      >
        {ROWS.slice(0, 400).map((r) => (
          <RowView key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}

/** El estado del input vive en el padre: cada tecla re-renderiza la lista. */
export function StateTooHigh() {
  const [note, setNote] = useState("");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Escribe una nota"
        aria-label="nota (estado arriba)"
      />
      <SlowList />
    </div>
  );
}

function NoteInput() {
  const [note, setNote] = useState("");
  return (
    <input
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Escribe una nota"
      aria-label="nota (estado colocado)"
    />
  );
}

/** El estado vive en el componente que lo usa: la lista no se entera. */
export function StateColocated() {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <NoteInput />
      <SlowList />
    </div>
  );
}

/** 100 000 filas virtualizadas contra N filas sin virtualizar, midiendo el tiempo hasta el commit. */
export function VirtualizationDemo() {
  const [mode, setMode] = useState<"virtual" | "naive">("virtual");
  const [naiveCount, setNaiveCount] = useState(5_000);
  const [ms, setMs] = useState<number | null>(null);
  const [nodes, setNodes] = useState(0);
  const start = useRef(performance.now());
  const container = useRef<HTMLDivElement>(null);

  const choose = (next: "virtual" | "naive", count = naiveCount) => {
    start.current = performance.now();
    setMs(null);
    setNaiveCount(count);
    setMode(next);
  };

  useLayoutEffect(() => {
    setMs(performance.now() - start.current);
    setNodes(container.current?.querySelectorAll("*").length ?? 0);
  }, [mode, naiveCount]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <button type="button" aria-pressed={mode === "virtual"} onClick={() => choose("virtual")}>
          Virtualizada (100 000)
        </button>
        <button
          type="button"
          aria-pressed={mode === "naive" && naiveCount === 5_000}
          onClick={() => choose("naive", 5_000)}
        >
          Sin virtualizar (5 000)
        </button>
        <button
          type="button"
          aria-pressed={mode === "naive" && naiveCount === 20_000}
          onClick={() => choose("naive", 20_000)}
        >
          Sin virtualizar (20 000)
        </button>
      </div>
      <p style={{ margin: 0 }}>
        Render + commit: <strong>{ms === null ? "…" : `${ms.toFixed(0)} ms`}</strong> · nodos en el
        DOM: <strong>{nodes.toLocaleString()}</strong>
      </p>
      <div ref={container}>
        {mode === "virtual" ? (
          <VirtualList
            items={ROWS}
            rowHeight={32}
            height={320}
            renderRow={(row) => <RowView {...row} />}
          />
        ) : (
          <div
            role="list"
            style={{
              height: 320,
              overflowY: "auto",
              border: "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            {ROWS.slice(0, naiveCount).map((row) => (
              <div key={row.id} role="listitem" style={{ height: 32 }}>
                <RowView {...row} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** "Servidor" falso: filtra y pagina, y devuelve solo una página. */
async function fetchEntries(query: string, page: number, pageSize: number, signal: AbortSignal) {
  await wait(300, signal);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? ROWS.filter((r) => r.user.toLowerCase().includes(q) || r.project.toLowerCase().includes(q))
    : ROWS;
  return { total: filtered.length, items: filtered.slice(page * pageSize, (page + 1) * pageSize) };
}

/** Paginación y filtro en el servidor: el cliente solo recibe 20 filas. */
export function ServerPagination() {
  const pageSize = 20;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<{ total: number; items: Row[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchEntries(query, page, pageSize, controller.signal)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [query, page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0); // un filtro nuevo vuelve a la primera página
        }}
        placeholder="Filtrar: Planner, Usuario 12…"
        aria-label="filtrar entradas"
      />
      <div className="row">
        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          ← Anterior
        </button>
        <span>
          Página {page + 1} de {pages.toLocaleString()} · {data?.total.toLocaleString() ?? "…"}{" "}
          resultados {loading && "· cargando…"}
        </span>
        <button type="button" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
          Siguiente →
        </button>
      </div>
      <div
        style={{
          height: 200,
          overflow: "auto",
          border: "1px solid var(--line)",
          borderRadius: 8,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {data?.items.map((r) => (
          <RowView key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}

/** Muestra las líneas del Profiler. Tiene su propio estado para que actualizarlo no vuelva a renderizar lo medido. */
function ProfilerLog({ register }: { register: (push: (line: string) => void) => void }) {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => register((line) => setLines((prev) => [...prev.slice(-5), line])), [register]);
  return (
    <ol className="console">
      {lines.length === 0 ? (
        <li className="muted">
          {import.meta.env.PROD
            ? "Este es un build de producción: <Profiler> no mide aquí. Ábrelo con npm run dev."
            : "La salida aparece aquí"}
        </li>
      ) : (
        lines.map((l, i) => <li key={i}>{l}</li>)
      )}
    </ol>
  );
}

/** <Profiler> mide cuánto tarda en renderizar un subárbol. */
export function ProfilerDemo() {
  const [count, setCount] = useState(0);
  // Las líneas esperan en `pending` hasta que el log se registra (el primer render ocurre antes).
  const push = useRef<((line: string) => void) | null>(null);
  const pending = useRef<string[]>([]);
  const register = useCallback((fn: (line: string) => void) => {
    push.current = fn;
    pending.current.forEach(fn);
    pending.current = [];
  }, []);

  const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    const line = `${id} · ${phase} · actual ${actualDuration.toFixed(1)} ms · base ${baseDuration.toFixed(1)} ms`;
    if (push.current) push.current(line);
    else pending.current.push(line);
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button type="button" onClick={() => setCount((c) => c + 1)} style={{ justifySelf: "start" }}>
        Re-render ({count})
      </button>
      <Profiler id="EntriesTable" onRender={onRender}>
        <div
          style={{ height: 60, overflow: "auto", border: "1px solid var(--line)", borderRadius: 6 }}
        >
          {ROWS.slice(0, 1000).map((r) => (
            <RowView key={r.id} {...r} />
          ))}
        </div>
      </Profiler>
      <ProfilerLog register={register} />
    </div>
  );
}
