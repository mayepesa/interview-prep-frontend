import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";
import { STORAGE_KEY } from "./types";

const { StickyNotes } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

beforeEach(() => localStorage.clear());

describe("12 · sticky notes", () => {
  it("shows an empty state and adds notes", async () => {
    const user = userEvent.setup();
    render(<StickyNotes />);
    expect(screen.getByText("No notes yet")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add note" }));
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(screen.getAllByLabelText("Note text")).toHaveLength(2);
    expect(screen.queryByText("No notes yet")).not.toBeInTheDocument();
  });

  it("edits, recolors and deletes a note", async () => {
    const user = userEvent.setup();
    render(<StickyNotes />);
    await user.click(screen.getByRole("button", { name: "Add note" }));
    await user.click(screen.getByRole("button", { name: "Add note" }));

    const [first, second] = screen.getAllByLabelText("Note text");
    await user.type(first!, "Call Alina");
    await user.type(second!, "Prepare demo");
    await user.selectOptions(screen.getAllByLabelText("Color")[1]!, "pink");
    expect(screen.getAllByLabelText("Color")[1]).toHaveValue("pink");

    await user.click(screen.getAllByRole("button", { name: "Delete note" })[0]!);
    const remaining = screen.getAllByLabelText("Note text");
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toHaveValue("Prepare demo");
  });

  it("persists notes in localStorage and restores them", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<StickyNotes />);
    await user.click(screen.getByRole("button", { name: "Add note" }));
    await user.type(screen.getByLabelText("Note text"), "Remember me");
    unmount();

    expect(localStorage.getItem(STORAGE_KEY)).toContain("Remember me");
    render(<StickyNotes />);
    expect(screen.getByLabelText("Note text")).toHaveValue("Remember me");
  });

  it("ignores broken storage", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    render(<StickyNotes />);
    expect(screen.getByText("No notes yet")).toBeInTheDocument();
  });

  it("ignores stored items with the wrong shape", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1, text: 2 }, "x"]));
    render(<StickyNotes />);
    expect(screen.getByText("No notes yet")).toBeInTheDocument();
  });
});
