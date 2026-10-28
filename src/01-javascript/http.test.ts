import { describe, expect, it } from "vitest";
import { describeFetchError, fakeFetch, fetchJson, HttpError } from "./http";

describe("fetchJson", () => {
  it("returns the parsed JSON on 2xx", async () => {
    await expect(fetchJson("/status/200", undefined, fakeFetch)).resolves.toEqual({
      id: 1,
      name: "Planner",
    });
  });

  it("returns undefined on 204", async () => {
    await expect(fetchJson("/status/204", undefined, fakeFetch)).resolves.toBeUndefined();
  });

  it("throws HttpError when res.ok is false", async () => {
    const error = await fetchJson("/status/404", undefined, fakeFetch).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
  });

  it("lets network errors through as TypeError", async () => {
    await expect(fetchJson("/offline", undefined, fakeFetch)).rejects.toThrow(TypeError);
  });
});

describe("describeFetchError", () => {
  it("maps each kind of error to an action", () => {
    expect(describeFetchError(new HttpError(401, ""))).toMatch(/login/);
    expect(describeFetchError(new HttpError(503, ""))).toMatch(/reintentar/);
    expect(describeFetchError(new TypeError("Failed to fetch"))).toMatch(/red/);
    expect(describeFetchError(new DOMException("", "AbortError"))).toMatch(/cancelada/);
  });
});
