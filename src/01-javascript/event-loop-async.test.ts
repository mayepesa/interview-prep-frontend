import { describe, expect, it, vi } from "vitest";
import {
  combinators,
  eventLoopOrder,
  parallel,
  retry,
  sequential,
  withTimeout,
  delay,
} from "./event-loop-async";

describe("event loop", () => {
  it("runs sync code, then microtasks, then macrotasks", async () => {
    expect(await eventLoopOrder()).toEqual([
      "1 sync",
      "2 async start (sync hasta el primer await)",
      "3 sync end",
      "4 promise",
      "5 microtask",
      "4b after await",
      "6 timeout",
    ]);
  });
});

describe("promises", () => {
  it("parallel is faster than sequential", async () => {
    const t0 = performance.now();
    await sequential();
    const seq = performance.now() - t0;

    const t1 = performance.now();
    await parallel();
    const par = performance.now() - t1;

    expect(par).toBeLessThan(seq);
  });

  it("knows the four combinators", async () => {
    expect(await combinators()).toEqual({
      all: [1, 2],
      settled: ["fulfilled", "rejected"],
      race: "rápida",
      any: "primera ok",
    });
  });

  it("withTimeout rejects slow promises", async () => {
    await expect(withTimeout(delay(100, "x"), 10)).rejects.toThrow("Timeout");
    await expect(withTimeout(delay(5, "x"), 50)).resolves.toBe("x");
  });

  it("retry tries again until it succeeds", async () => {
    const flaky = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("1"))
      .mockRejectedValueOnce(new Error("2"))
      .mockResolvedValue("ok");
    await expect(retry(flaky, 3, 1)).resolves.toBe("ok");
    expect(flaky).toHaveBeenCalledTimes(3);
  });
});
