import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { debounce } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

suite("01 · debounce", () => {
  it("waits before calling", () => {
    const fn = vi.fn();
    const d = debounce(fn, 200);
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("restarts the wait on every call and uses the last arguments", () => {
    const fn = vi.fn();
    const d = debounce(fn, 200);
    d("a");
    vi.advanceTimersByTime(150);
    d("ab");
    vi.advanceTimersByTime(150);
    d("abc");
    vi.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith("abc");
  });

  it("can be cancelled", () => {
    const fn = vi.fn();
    const d = debounce(fn, 200);
    d();
    d.cancel();
    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();
  });

  it("keeps working after firing", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d(1);
    vi.advanceTimersByTime(100);
    d(2);
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([[1], [2]]);
  });
});
