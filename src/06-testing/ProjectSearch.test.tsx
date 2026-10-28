import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectSearch } from "./ProjectSearch";

// Mock de fetch con vi.stubGlobal. En proyectos grandes se usa MSW (Mock Service Worker),
// que intercepta las peticiones a nivel de red y sirve igual para tests y para desarrollo.

const fetchMock = vi.fn();

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

const ok = (data: unknown) => Promise.resolve(new Response(JSON.stringify(data), { status: 200 }));

describe("ProjectSearch", () => {
  it("debounces typing into a single request", async () => {
    fetchMock.mockImplementation(() => ok([{ id: 1, name: "Time tracker" }]));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ProjectSearch />);

    await user.type(screen.getByLabelText("Buscar proyecto"), "time");
    expect(fetchMock).not.toHaveBeenCalled();

    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/projects?q=time");
    expect(await screen.findByText("Time tracker")).toBeInTheDocument();
  });

  it("shows an error when the API fails", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(new Response("", { status: 500 })));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ProjectSearch />);

    await user.type(screen.getByLabelText("Buscar proyecto"), "x");
    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(await screen.findByRole("alert")).toHaveTextContent("Error al buscar");
  });
});
