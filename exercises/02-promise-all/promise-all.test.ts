import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { promiseAll, promiseAllSettled } = (
  process.env.SOLUTIONS ? solution : starter
) as typeof solution;

const later = <T>(ms: number, value: T) => new Promise<T>((r) => setTimeout(() => r(value), ms));
const failLater = (ms: number, message: string) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms));

describe("02 · promiseAll", () => {
  it("keeps the input order", async () => {
    await expect(promiseAll([later(30, "a"), later(10, "b"), "c"])).resolves.toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("resolves an empty array", async () => {
    await expect(promiseAll([])).resolves.toEqual([]);
  });

  it("rejects with the first error", async () => {
    await expect(promiseAll([later(50, 1), failLater(10, "boom")])).rejects.toThrow("boom");
  });

  it("runs in parallel", async () => {
    const start = Date.now();
    await promiseAll([later(50, 1), later(50, 2), later(50, 3)]);
    expect(Date.now() - start).toBeLessThan(140);
  });
});

describe("02 · promiseAllSettled", () => {
  it("reports every result without rejecting", async () => {
    const results = await promiseAllSettled([later(10, 1), failLater(5, "x"), 3]);
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "rejected", "fulfilled"]);
    expect(results[0]).toEqual({ status: "fulfilled", value: 1 });
  });
});
