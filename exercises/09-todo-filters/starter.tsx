import type { Todo } from "./types";

// ¿Empezaste este ejercicio? Cambia `false` por `true` y sus tests empezarán a correr.
export const started = false;

export function TodoApp({ initialTodos = [] }: { initialTodos?: Todo[] }) {
  // TODO
  return <p>TODO: {initialTodos.length} todos</p>;
}
