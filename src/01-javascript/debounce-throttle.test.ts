import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce, throttle } from "./debounce-throttle";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("debounce", () => {
  it("calls once with the last arguments after the wait", () => {
    const fn = vi.fn();
    const search = debounce(fn, 300);

    search("t");
    search("ti");
    search("time");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("time");
  });

  it("restarts the timer on every call", () => {
    const fn = vi.fn();
    const save = debounce(fn, 300);
    save();
    vi.advanceTimersByTime(200);
    save();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("can be cancelled", () => {
    const fn = vi.fn();
    const save = debounce(fn, 300);
    save();
    save.cancel();
    vi.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("throttle", () => {
  it("runs immediately, then at most once per interval with the last call", () => {
    const fn = vi.fn();
    const onScroll = throttle(fn, 100);

    onScroll(1); // inmediata
    onScroll(2);
    onScroll(3); // queda pendiente
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });
});
