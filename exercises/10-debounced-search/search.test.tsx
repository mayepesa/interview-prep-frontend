import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";
import type { SearchFn } from "./types";

const { ProjectSearch } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

/**
 * Simula escribir letra por letra. Usamos fireEvent (síncrono) en vez de userEvent
 * porque userEvent espera timers reales y aquí el reloj es falso.
 */
function typeText(input: HTMLElement, text: string) {
  const start = (input as HTMLInputElement).value;
  for (let i = 1; i <= text.length; i++)
    fireEvent.change(input, { target: { value: start + text.slice(0, i) } });
}

/** API controlable: cada llamada devuelve una promesa que el test resuelve a mano. */
function controllableSearch() {
  const calls: {
    query: string;
    signal: AbortSignal;
    resolve: (r: string[]) => void;
    reject: (e: Error) => void;
  }[] = [];
  const search = vi.fn<SearchFn>(
    (query, signal) =>
      new Promise((resolve, reject) => {
        calls.push({ query, signal, resolve, reject });
      }),
  );
  return { search, calls };
}

suite("10 · debounced search", () => {
  it("does not search for empty input", async () => {
    const { search } = controllableSearch();
    render(<ProjectSearch search={search} />);
    typeText(screen.getByLabelText("Search projects"), "   ");
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(search).not.toHaveBeenCalled();
  });

  it("debounces into one call and shows loading then results", async () => {
    const { search, calls } = controllableSearch();
    render(<ProjectSearch search={search} />);

    typeText(screen.getByLabelText("Search projects"), "time");
    await act(() => vi.advanceTimersByTimeAsync(299));
    expect(search).not.toHaveBeenCalled();

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(search).toHaveBeenCalledTimes(1);
    expect(calls[0]?.query).toBe("time");
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");

    await act(async () => calls[0]?.resolve(["Time tracker", "Timesheets"]));
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Time tracker",
      "Timesheets",
    ]);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an empty state", async () => {
    const { search, calls } = controllableSearch();
    render(<ProjectSearch search={search} />);
    typeText(screen.getByLabelText("Search projects"), "zzz");
    await act(() => vi.advanceTimersByTimeAsync(300));
    await act(async () => calls[0]?.resolve([]));
    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });

  it("shows an error", async () => {
    const { search, calls } = controllableSearch();
    render(<ProjectSearch search={search} />);
    typeText(screen.getByLabelText("Search projects"), "x");
    await act(() => vi.advanceTimersByTimeAsync(300));
    await act(async () => calls[0]?.reject(new Error("500")));
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("aborts the previous request and ignores stale responses", async () => {
    const { search, calls } = controllableSearch();
    render(<ProjectSearch search={search} />);
    const input = screen.getByLabelText("Search projects");

    typeText(input, "pl");
    await act(() => vi.advanceTimersByTimeAsync(300));
    typeText(input, "an");
    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(calls).toHaveLength(2);
    expect(calls[0]?.signal.aborted).toBe(true);

    await act(async () => calls[1]?.resolve(["Planner"]));
    await act(async () => calls[0]?.resolve(["Old result"]));

    expect(screen.getByText("Planner")).toBeInTheDocument();
    expect(screen.queryByText("Old result")).not.toBeInTheDocument();
  });
});
