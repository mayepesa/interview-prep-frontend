import { describe, expect, it, vi } from "vitest";
import {
  callDetached,
  callWithBind,
  createCounter,
  hoisting,
  loopWithLet,
  loopWithVar,
  memoize,
  once,
  timer,
} from "./closures-scope-this";

describe("closures", () => {
  it("keeps private state between calls", () => {
    const counter = createCounter(10);
    counter.increment();
    counter.increment();
    expect(counter.value()).toBe(12);
    expect(createCounter().value()).toBe(0); // cada closure tiene su propia variable
  });

  it("memoize caches results", () => {
    const slow = vi.fn((n: number) => n * 2);
    const fast = memoize(slow);
    expect(fast(4)).toBe(8);
    expect(fast(4)).toBe(8);
    expect(slow).toHaveBeenCalledTimes(1);
  });

  it("once runs a single time", () => {
    const init = vi.fn(() => "ready");
    const initOnce = once(init);
    initOnce();
    initOnce();
    expect(init).toHaveBeenCalledTimes(1);
  });
});

describe("var vs let", () => {
  it("var shares one binding across iterations", () => {
    expect(loopWithVar()).toEqual([3, 3, 3]);
  });
  it("let creates a binding per iteration", () => {
    expect(loopWithLet()).toEqual([0, 1, 2]);
  });
});

describe("this", () => {
  it("depends on how the function is called", () => {
    expect(timer.regular()).toBe("timer");
    expect(callDetached()).toBeUndefined();
    expect(callWithBind()).toBe("bound");
  });

  it("arrow functions use the surrounding this", () => {
    expect(timer.arrowInside()).toBe("timer");
  });
});

describe("hoisting", () => {
  it("function declarations are available before their line", () => {
    expect(hoisting()).toBe("function");
  });
});
