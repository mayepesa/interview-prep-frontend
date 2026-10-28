import { describe, expect, it } from "vitest";
import { todosReducer } from "./use-reducer.demo";

describe("todosReducer", () => {
  const initial = [{ id: "1", text: "a", done: false }];

  it("adds a todo without mutating the previous state", () => {
    const next = todosReducer(initial, { type: "added", text: "b" });
    expect(next).toHaveLength(2);
    expect(initial).toHaveLength(1);
    expect(next).not.toBe(initial);
  });

  it("toggles only the matching todo", () => {
    const next = todosReducer(initial, { type: "toggled", id: "1" });
    expect(next[0]?.done).toBe(true);
    expect(initial[0]?.done).toBe(false);
  });

  it("clears done todos", () => {
    const state = [
      { id: "1", text: "a", done: true },
      { id: "2", text: "b", done: false },
    ];
    expect(todosReducer(state, { type: "cleared_done" })).toEqual([state[1]]);
  });
});
