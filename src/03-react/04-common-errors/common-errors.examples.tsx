import { useState } from "react";

type Task = { id: number; title: string };

let nextId = 3;

/** Con index como key, el texto escrito en un input se queda en la posición, no en la tarea. */
export function KeyBugDemo({ useIdAsKey }: { useIdAsKey: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Revisar PR" },
    { id: 2, title: "Escribir tests" },
  ]);

  const addFirst = () =>
    setTasks((prev) => [{ id: nextId++, title: `Tarea nueva ${nextId - 1}` }, ...prev]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button type="button" onClick={addFirst}>
        Agregar al principio
      </button>
      <ul style={{ margin: 0 }}>
        {tasks.map((task, index) => (
          <li key={useIdAsKey ? task.id : index} className="row">
            <span style={{ minWidth: 130 }}>{task.title}</span>
            <input placeholder="nota" aria-label={`nota de ${task.title}`} style={{ width: 140 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
