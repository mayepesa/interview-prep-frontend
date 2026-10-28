import type { Todo } from "./types";

export function TodoApp({ initialTodos = [] }: { initialTodos?: Todo[] }) {
  // TODO
  return <p>TODO: {initialTodos.length} todos</p>;
}
