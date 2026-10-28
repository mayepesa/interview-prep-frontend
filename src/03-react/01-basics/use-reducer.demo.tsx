import { useReducer, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "useReducer",
  section: "react-basics",
  order: 150,
  questions: [
    "¿Qué hace el hook useReducer?",
    "¿Cuándo usar useReducer en vez de useState?",
    "¿Por qué no se debe mutar el estado directamente?",
  ],
  sayIt:
    "useReducer centralizes state transitions in one pure function. I reach for it when several values change together or the next state depends on an action type. The reducer is easy to unit test because it's just input and output.",
};

type Todo = { id: string; text: string; done: boolean };

// Unión discriminada: TypeScript sabe qué payload trae cada acción.
type Action =
  | { type: "added"; text: string }
  | { type: "toggled"; id: string }
  | { type: "removed"; id: string }
  | { type: "cleared_done" };

// Función pura: mismo estado + misma acción = mismo resultado. Nunca muta.
export function todosReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "added":
      return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggled":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "removed":
      return state.filter((t) => t.id !== action.id);
    case "cleared_done":
      return state.filter((t) => !t.done);
  }
}

export default function UseReducerDemo() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: "1", text: "Repasar useEffect", done: true },
    { id: "2", text: "Practicar debounce", done: false },
  ]);
  const [text, setText] = useState("");

  return (
    <Panel title="Lista de tareas con reducer">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          dispatch({ type: "added", text: text.trim() });
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="nueva tarea" />
        <button type="submit">Agregar</button>
        <button type="button" onClick={() => dispatch({ type: "cleared_done" })}>
          Limpiar hechas
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="row">
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => dispatch({ type: "toggled", id: todo.id })}
              />{" "}
              <span style={{ textDecoration: todo.done ? "line-through" : undefined }}>
                {todo.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: "removed", id: todo.id })}
              aria-label={`borrar ${todo.text}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <Note>
        Si mutas el array (<code>state.push(...)</code>) la referencia no cambia, React compara con{" "}
        <code>Object.is</code> y no re-renderiza. Por eso siempre se devuelve un objeto nuevo. El
        reducer tiene tests en <code>use-reducer.test.ts</code>.
      </Note>
    </Panel>
  );
}
