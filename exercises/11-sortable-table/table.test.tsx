import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";
import type { Entry } from "./types";

const { EntriesTable } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

const entries: Entry[] = [
  { id: "1", project: "Reports", date: "2026-11-03", hours: 2 },
  { id: "2", project: "Billing", date: "2026-11-01", hours: 8 },
  { id: "3", project: "Planner", date: "2026-11-05", hours: 10 },
  { id: "4", project: "Structure", date: "2026-11-02", hours: 1 },
  { id: "5", project: "Analytics", date: "2026-11-04", hours: 4 },
  { id: "6", project: "Timesheets", date: "2026-10-30", hours: 6 },
  { id: "7", project: "Cost tracker", date: "2026-11-06", hours: 3 },
];

/** Primera columna de cada fila del tbody. */
function projects() {
  const body = screen.getAllByRole("rowgroup")[1]!;
  return within(body)
    .getAllByRole("row")
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent);
}

describe("11 · sortable table", () => {
  it("renders the first page in the original order", () => {
    render(<EntriesTable entries={entries} pageSize={3} />);
    expect(projects()).toEqual(["Reports", "Billing", "Planner"]);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    for (const th of screen.getAllByRole("columnheader"))
      expect(th).not.toHaveAttribute("aria-sort");
  });

  it("sorts ascending, then descending", async () => {
    const user = userEvent.setup();
    render(<EntriesTable entries={entries} pageSize={10} />);

    await user.click(screen.getByRole("button", { name: "Project" }));
    expect(projects()).toEqual([
      "Analytics",
      "Billing",
      "Cost tracker",
      "Planner",
      "Reports",
      "Structure",
      "Timesheets",
    ]);
    expect(screen.getByRole("columnheader", { name: "Project" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await user.click(screen.getByRole("button", { name: "Project" }));
    expect(projects()[0]).toBe("Timesheets");
    expect(screen.getByRole("columnheader", { name: "Project" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });

  it("sorts numbers numerically and dates chronologically", async () => {
    const user = userEvent.setup();
    render(<EntriesTable entries={entries} pageSize={10} />);

    await user.click(screen.getByRole("button", { name: "Hours" }));
    expect(projects()).toEqual([
      "Structure",
      "Reports",
      "Cost tracker",
      "Analytics",
      "Timesheets",
      "Billing",
      "Planner",
    ]);

    await user.click(screen.getByRole("button", { name: "Date" }));
    expect(projects()[0]).toBe("Timesheets");
    expect(screen.getByRole("columnheader", { name: "Hours" })).not.toHaveAttribute("aria-sort");
  });

  it("paginates and resets to page 1 when sorting", async () => {
    const user = userEvent.setup();
    render(<EntriesTable entries={entries} pageSize={3} />);
    const prev = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });

    expect(prev).toBeDisabled();
    await user.click(next);
    await user.click(next);
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    expect(projects()).toEqual(["Cost tracker"]);
    expect(next).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Project" }));
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });
});
