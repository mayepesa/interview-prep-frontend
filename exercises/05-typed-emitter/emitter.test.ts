import { describe, expect, it, vi } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { Emitter } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

type TimerEvents = { start: { project: string }; stop: { seconds: number }; reset: undefined };

describe("05 · typed emitter", () => {
  it("calls handlers in order with the payload", () => {
    const emitter = new Emitter<TimerEvents>();
    const calls: string[] = [];
    emitter.on("start", (p) => calls.push(`1:${p.project}`));
    emitter.on("start", (p) => calls.push(`2:${p.project}`));
    emitter.emit("start", { project: "Planner" });
    expect(calls).toEqual(["1:Planner", "2:Planner"]);
  });

  it("on returns an unsubscribe function", () => {
    const emitter = new Emitter<TimerEvents>();
    const handler = vi.fn();
    const unsubscribe = emitter.on("stop", handler);
    unsubscribe();
    emitter.emit("stop", { seconds: 3 });
    expect(handler).not.toHaveBeenCalled();
  });

  it("off removes a handler", () => {
    const emitter = new Emitter<TimerEvents>();
    const handler = vi.fn();
    emitter.on("reset", handler);
    emitter.off("reset", handler);
    emitter.emit("reset", undefined);
    expect(handler).not.toHaveBeenCalled();
  });

  it("once runs a single time", () => {
    const emitter = new Emitter<TimerEvents>();
    const handler = vi.fn();
    emitter.once("stop", handler);
    emitter.emit("stop", { seconds: 1 });
    emitter.emit("stop", { seconds: 2 });
    expect(handler).toHaveBeenCalledExactlyOnceWith({ seconds: 1 });
  });

  it("survives unsubscribing during emit", () => {
    const emitter = new Emitter<TimerEvents>();
    const second = vi.fn();
    const unsubscribe = emitter.on("reset", () => unsubscribe());
    emitter.on("reset", second);
    emitter.emit("reset", undefined);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("is type-safe (checked by npm run typecheck)", () => {
    const emitter = new Emitter<TimerEvents>();
    // @ts-expect-error: el evento no existe
    expect(() => emitter.on("pause", () => {})).toBeDefined();
    // @ts-expect-error: payload incorrecto
    expect(() => emitter.emit("stop", { project: "x" })).toBeDefined();
  });
});
