import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAsync } from "./useAsync";
import { useDebouncedValue } from "./useDebouncedValue";
import { useLocalStorage } from "./useLocalStorage";

// Cómo testear un hook: renderHook lo monta dentro de un componente de prueba.

describe("useDebouncedValue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("only updates after the value stops changing", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    rerender({ value: "abc" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("abc");
  });
});

describe("useLocalStorage", () => {
  const isNumber = (v: unknown): v is number => typeof v === "number";
  beforeEach(() => localStorage.clear());

  it("persists the value", () => {
    const { result } = renderHook(() => useLocalStorage("hours", 8, isNumber));
    act(() => result.current[1](6));
    expect(localStorage.getItem("hours")).toBe("6");
  });

  it("ignores stored values that fail validation", () => {
    localStorage.setItem("hours", JSON.stringify("not a number"));
    const { result } = renderHook(() => useLocalStorage("hours", 8, isNumber));
    expect(result.current[0]).toBe(8);
  });

  it("survives broken JSON", () => {
    localStorage.setItem("hours", "{oops");
    const { result } = renderHook(() => useLocalStorage("hours", 8, isNumber));
    expect(result.current[0]).toBe(8);
  });
});

describe("useAsync", () => {
  it("goes from loading to success", async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve(42), []));
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current).toEqual({ status: "success", data: 42 }));
  });

  it("exposes errors", async () => {
    const { result } = renderHook(() => useAsync(() => Promise.reject(new Error("boom")), []));
    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("aborts the previous call when deps change", async () => {
    const signals: AbortSignal[] = [];
    const { rerender } = renderHook(
      ({ id }) =>
        useAsync(
          (signal) => {
            signals.push(signal);
            return new Promise<number>(() => {});
          },
          [id],
        ),
      { initialProps: { id: 1 } },
    );
    rerender({ id: 2 });
    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });
});
