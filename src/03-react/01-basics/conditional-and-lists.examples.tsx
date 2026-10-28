import { useState } from "react";

type Status = "loading" | "error" | "empty" | "data";

/** Return temprano para los casos especiales; el caso normal al final. */
function ResultsView({
  loading,
  error,
  items,
}: {
  loading: boolean;
  error?: string;
  items: string[];
}) {
  if (loading) return <p>Cargando…</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (items.length === 0) return <p>Sin resultados</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function EarlyReturnDemo() {
  const [status, setStatus] = useState<Status>("data");
  return (
    <div>
      <div className="row">
        {(["loading", "error", "empty", "data"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s}>
            {s}
          </button>
        ))}
      </div>
      <ResultsView
        loading={status === "loading"}
        error={status === "error" ? "500 Internal Server Error" : undefined}
        items={status === "data" ? ["Timesheet", "Planner"] : []}
      />
    </div>
  );
}

/** && y ternario dentro del JSX. */
export function InlineConditionsDemo() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [unread, setUnread] = useState(2);
  return (
    <div>
      <div className="row">
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />{" "}
          Es admin
        </label>
        <button type="button" onClick={() => setUnread((n) => n + 1)}>
          + notificación
        </button>
        <button type="button" onClick={() => setUnread(0)}>
          Marcar leídas
        </button>
      </div>
      <p>Hola, Maria {isAdmin && <strong>(admin)</strong>}</p>
      <p>{unread > 0 ? `Tienes ${unread} notificaciones` : "Estás al día"}</p>
    </div>
  );
}

/** La trampa del 0: {count && ...} muestra un "0" suelto. */
export function ZeroPitfallDemo() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div className="row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          + tarea ({count})
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Dejar en 0
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        <div>
          <code>{"{count && <p>…</p>}"}</code>
          <div style={{ border: "1px dashed var(--bad)", padding: 8, minHeight: 40 }}>
            {count && <p style={{ margin: 0 }}>{count} tareas pendientes</p>}
          </div>
        </div>
        <div>
          <code>{"{count > 0 && <p>…</p>}"}</code>
          <div style={{ border: "1px dashed var(--good)", padding: 8, minHeight: 40 }}>
            {count > 0 && <p style={{ margin: 0 }}>{count} tareas pendientes</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  { id: "p1", name: "Timesheet", hours: 32, billable: true },
  { id: "p2", name: "Capacity planner", hours: 12, billable: false },
  { id: "p3", name: "Time reports", hours: 20, billable: true },
  { id: "p4", name: "Onboarding", hours: 4, billable: false },
];

/** filter + map: la forma típica de renderizar una lista. */
export function ProjectListDemo() {
  const [onlyBillable, setOnlyBillable] = useState(false);
  const visible = onlyBillable ? PROJECTS.filter((p) => p.billable) : PROJECTS;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={onlyBillable}
          onChange={(e) => setOnlyBillable(e.target.checked)}
        />{" "}
        Solo facturables
      </label>
      <ul>
        {visible.map((project) => (
          <li key={project.id}>
            {project.name} · {project.hours} h
          </li>
        ))}
      </ul>
    </div>
  );
}

type Task = { id: string; title: string };

const initialTasks: Task[] = [
  { id: "a", title: "Revisar PR" },
  { id: "b", title: "Escribir tests" },
  { id: "c", title: "Daily" },
];

/** Cada fila tiene estado propio (el input no controlado). Así se ve qué estado se "pierde". */
function TaskRow({ task }: { task: Task }) {
  return (
    <li className="row">
      <span style={{ minWidth: 120 }}>{task.title}</span>
      <input placeholder="nota local" aria-label={`nota para ${task.title}`} />
    </li>
  );
}

let nextId = 1;

export function TaskListDemo({ indexAsKey }: { indexAsKey: boolean }) {
  const [tasks, setTasks] = useState(initialTasks);
  const addFirst = () =>
    setTasks((prev) => [{ id: `new-${nextId++}`, title: `Nueva ${prev.length + 1}` }, ...prev]);

  return (
    <div>
      <div className="row">
        <button type="button" onClick={addFirst}>
          Agregar al inicio
        </button>
        <button type="button" onClick={() => setTasks(initialTasks)}>
          Reset
        </button>
      </div>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {tasks.map((task, index) => (
          <TaskRow key={indexAsKey ? index : task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

type Priority = "low" | "medium" | "high";

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "var(--muted)",
  medium: "var(--accent)",
  high: "var(--bad)",
};

/** className condicional, style con objeto y data-attribute. */
export function ConditionalStylesDemo() {
  const [priority, setPriority] = useState<Priority>("medium");
  const [done, setDone] = useState(false);

  return (
    <div>
      <div className="row">
        {(["low", "medium", "high"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            aria-pressed={priority === p}
          >
            {p}
          </button>
        ))}
        <label>
          <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} /> Hecha
        </label>
      </div>
      <p
        className={["task", done && "task--done"].filter(Boolean).join(" ")}
        data-priority={priority}
        style={{
          borderLeft: `4px solid ${PRIORITY_COLORS[priority]}`,
          paddingLeft: 8,
          textDecoration: done ? "line-through" : undefined,
          opacity: done ? 0.6 : 1,
        }}
      >
        Preparar demo para el cliente
      </p>
    </div>
  );
}
