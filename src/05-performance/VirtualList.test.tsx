import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VirtualList, visibleRange } from "./VirtualList";

describe("visibleRange", () => {
  it("returns the visible rows plus overscan", () => {
    expect(visibleRange(0, 300, 30, 1000, 5)).toEqual({ start: 0, end: 15 });
    expect(visibleRange(3000, 300, 30, 1000, 5)).toEqual({ start: 95, end: 115 });
  });

  it("never goes past the end", () => {
    expect(visibleRange(29_900, 300, 30, 1000, 5).end).toBe(1000);
  });
});

describe("VirtualList", () => {
  const items = Array.from({ length: 100_000 }, (_, i) => `Fila ${i}`);

  it("renders only a window of rows", () => {
    render(<VirtualList items={items} rowHeight={30} height={300} renderRow={(t) => t} />);
    expect(screen.getAllByRole("listitem").length).toBeLessThan(30);
    expect(screen.getByText("Fila 0")).toBeInTheDocument();
  });

  it("updates the window on scroll", () => {
    render(<VirtualList items={items} rowHeight={30} height={300} renderRow={(t) => t} />);
    fireEvent.scroll(screen.getByRole("list"), { target: { scrollTop: 30_000 } });
    expect(screen.getByText("Fila 1000")).toBeInTheDocument();
    expect(screen.queryByText("Fila 0")).not.toBeInTheDocument();
  });
});
