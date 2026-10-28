import { useState, type FormEvent } from "react";
import type { Todo } from "./types";

type Filter = "all" | "active" | "completed";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TodoApp({ initialTodos = [] }: { initialTodos?: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Estado derivado: se calcula en cada render.
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done,
  );
  const left = todos.filter((t) => !t.done).length;

  const add = (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: value, done: false }]);
    setText("");
  };

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <section>
      <form onSubmit={add}>
        <label htmlFor="new-task">New task</label>
        <input id="new-task" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {visible.map((todo) => (
          <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} />
              {todo.text}
            </label>
            <button
              type="button"
              aria-label={`Delete ${todo.text}`}
              onClick={() => remove(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <footer>
        <span>
          {left} {left === 1 ? "item" : "items"} left
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <button type="button" onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}>
          Clear completed
        </button>
      </footer>
    </section>
  );
}
