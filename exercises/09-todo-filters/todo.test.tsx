import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { TodoApp } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

const initialTodos = [
  { id: "1", text: "Review PR", done: false },
  { id: "2", text: "Write tests", done: true },
  { id: "3", text: "Daily", done: false },
];

describe("09 · todo with filters", () => {
  it("adds tasks with the button and with Enter, ignoring empty ones", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    const input = screen.getByLabelText("New task");

    await user.type(input, "Plan sprint");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(input, "Fix bug{Enter}");
    expect(input).toHaveValue("");

    await user.type(input, "   {Enter}");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("2 items left")).toBeInTheDocument();
  });

  it("toggles, filters and counts", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={initialTodos} />);
    expect(screen.getByText("2 items left")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Review PR"));
    expect(screen.getByText("1 item left")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Daily")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("deletes and clears completed", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={initialTodos} />);

    await user.click(screen.getByRole("button", { name: "Delete Daily" }));
    expect(screen.queryByText("Daily")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
