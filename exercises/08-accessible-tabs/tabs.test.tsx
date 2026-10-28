import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { Tabs } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

const tabs = [
  { id: "day", label: "Day", content: "Daily view" },
  { id: "week", label: "Week", content: "Weekly view" },
  { id: "month", label: "Month", content: "Monthly view" },
];

suite("08 · accessible tabs", () => {
  it("starts on the first tab with correct ARIA", () => {
    render(<Tabs tabs={tabs} />);
    const [day, week] = screen.getAllByRole("tab");
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(day).toHaveAttribute("aria-selected", "true");
    expect(week).toHaveAttribute("aria-selected", "false");
    expect(day).toHaveAttribute("tabindex", "0");
    expect(week).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel", { name: "Day" })).toHaveTextContent("Daily view");
  });

  it("switches on click", async () => {
    render(<Tabs tabs={tabs} />);
    await userEvent.click(screen.getByRole("tab", { name: "Month" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Monthly view");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  });

  it("supports arrows, Home and End, moving focus", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);
    await user.click(screen.getByRole("tab", { name: "Day" }));

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Week" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Weekly view");

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Month" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Day" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Month" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Daily view");
  });
});
