import { useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Renderizado condicional, listas y keys",
  section: "react-basics",
  order: 120,
  questions: [
    "¿Qué es el renderizado condicional?",
    "¿Por qué no podemos usar un if dentro del JSX?",
    "¿Qué es el renderizado de listas?",
    "¿Cuál es el propósito de la prop key?",
    "¿Por qué es mala práctica usar el index como key?",
  ],
  sayIt:
    "Keys tell React which item is which between renders. With the index as key, reordering or inserting items makes React reuse the wrong component and keep the wrong state, so I use a stable id from the data.",
};

type Task = { id: string; title: string };

const initialTasks: Task[] = [
  { id: "a", title: "Revisar PR" },
  { id: "b", title: "Escribir tests" },
  { id: "c", title: "Daily" },
];

// Cada fila tiene estado propio (el input). Así se ve qué estado se "pierde".
function Row({ task }: { task: Task }) {
  return (
    <li className="row">
      <span style={{ minWidth: 120 }}>{task.title}</span>
      <input placeholder="nota local" aria-label={`nota para ${task.title}`} />
    </li>
  );
}

function TaskList({ useIndexAsKey }: { useIndexAsKey: boolean }) {
  const [tasks, setTasks] = useState(initialTasks);
  const addFirst = () =>
    setTasks((prev) => [{ id: crypto.randomUUID(), title: `Nueva ${prev.length + 1}` }, ...prev]);

  return (
    <div>
      <button type="button" onClick={addFirst}>
        Agregar al inicio
      </button>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {tasks.map((task, index) => (
          <Row key={useIndexAsKey ? index : task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

function Status({ loading, error, items }: { loading: boolean; error?: string; items: string[] }) {
  // Return temprano: el if va fuera del JSX.
  if (loading) return <p>Cargando…</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <>
      {/* && para mostrar o nada; ojo con 0: {items.length && …} renderiza "0" */}
      {items.length > 0 && <p>{items.length} resultados</p>}
      {/* ternario para elegir entre dos */}
      {items.length === 0 ? <p>Sin resultados</p> : <p>Primero: {items[0]}</p>}
    </>
  );
}

export default function ConditionalAndLists() {
  const [state, setState] = useState<"loading" | "error" | "empty" | "data">("data");

  return (
    <>
      <Panel title="Condicionales: return temprano, && y ternario">
        <div className="row">
          {(["loading", "error", "empty", "data"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setState(s)} aria-pressed={state === s}>
              {s}
            </button>
          ))}
        </div>
        <Status
          loading={state === "loading"}
          error={state === "error" ? "500" : undefined}
          items={state === "data" ? ["Timesheet", "Planner"] : []}
        />
        <Note>
          No se puede usar <code>if</code> dentro del JSX porque JSX solo acepta expresiones, y{" "}
          <code>if</code> es una sentencia.
        </Note>
      </Panel>

      <Panel title="Index como key (escribe una nota y agrega una tarea)">
        <TaskList useIndexAsKey />
        <Note>
          La nota se queda en la posición, no en la tarea: React reutilizó la fila por índice.
        </Note>
      </Panel>

      <Panel title="Id estable como key">
        <TaskList useIndexAsKey={false} />
        <Snippet tone="good">{`{tasks.map((task) => <Row key={task.id} task={task} />)}`}</Snippet>
      </Panel>
    </>
  );
}
