export type Todo = { id: string; text: string; done: boolean };

/** Unión discriminada: el campo `type` le dice a TypeScript qué datos trae cada acción. */
export type TodoAction =
  | { type: "added"; id: string; text: string }
  | { type: "toggled"; id: string }
  | { type: "removed"; id: string }
  | { type: "cleared_done" };

/**
 * Reducer puro: mismo estado + misma acción = mismo resultado.
 * No muta `state`, no hace peticiones y no genera ids (el id llega en la acción).
 */
export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "added":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "removed":
      return state.filter((t) => t.id !== action.id);
    case "cleared_done":
      return state.filter((t) => !t.done);
    default: {
      // Si alguien agrega una acción a la unión y olvida manejarla, esto no compila.
      const unhandled: never = action;
      throw new Error(`Acción desconocida: ${JSON.stringify(unhandled)}`);
    }
  }
}
