import { useReducer, useState } from "react";
import { todosReducer, type Todo } from "./todos-reducer";

type CounterState = { count: number; step: number };
type CounterAction =
  | { type: "incremented" }
  | { type: "decremented" }
  | { type: "step_changed"; step: number }
  | { type: "reset" };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "incremented":
      return { ...state, count: state.count + state.step };
    case "decremented":
      return { ...state, count: state.count - state.step };
    case "step_changed":
      return { ...state, step: action.step };
    case "reset":
      return { count: 0, step: 1 };
  }
}

/** El ejemplo mínimo: estado + acción → nuevo estado. */
export function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  return (
    <div className="row">
      <button type="button" onClick={() => dispatch({ type: "decremented" })}>
        −{state.step}
      </button>
      <output style={{ minWidth: 40, textAlign: "center", fontWeight: 700 }}>{state.count}</output>
      <button type="button" onClick={() => dispatch({ type: "incremented" })}>
        +{state.step}
      </button>
      <label>
        paso{" "}
        <input
          type="number"
          min={1}
          value={state.step}
          onChange={(e) => dispatch({ type: "step_changed", step: Number(e.target.value) })}
          style={{ width: 60 }}
        />
      </label>
      <button type="button" onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>
    </div>
  );
}

const INITIAL_TODOS: Todo[] = [
  { id: "1", text: "Repasar useEffect", done: true },
  { id: "2", text: "Practicar debounce", done: false },
];

/** Lista de tareas: toda la lógica de cambios vive en todosReducer. */
export function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, INITIAL_TODOS);
  const [text, setText] = useState("");
  const pending = todos.filter((t) => !t.done).length;

  return (
    <div>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          dispatch({ type: "added", id: crypto.randomUUID(), text: text.trim() });
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="nueva tarea"
          placeholder="Nueva tarea"
        />
        <button type="submit">Agregar</button>
        <button type="button" onClick={() => dispatch({ type: "cleared_done" })}>
          Limpiar hechas
        </button>
      </form>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
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
      <p className="note">{pending} pendientes</p>
    </div>
  );
}

/** Reducer que muta: devuelve la misma referencia y React no re-renderiza. */
function mutatingReducer(
  state: Todo[],
  action: { type: "added"; id: string; text: string },
): Todo[] {
  state.push({ id: action.id, text: action.text, done: false });
  return state;
}

function immutableReducer(
  state: Todo[],
  action: { type: "added"; id: string; text: string },
): Todo[] {
  return [...state, { id: action.id, text: action.text, done: false }];
}

export function MutationInReducerDemo({ mutate }: { mutate: boolean }) {
  const [todos, dispatch] = useReducer(mutate ? mutatingReducer : immutableReducer, [
    { id: "a", text: "Tarea inicial", done: false },
  ]);

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "added", id: crypto.randomUUID(), text: `Tarea ${todos.length + 1}` })
        }
      >
        Agregar tarea
      </button>
      <span className="note"> · tareas en pantalla: {todos.length}</span>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}
