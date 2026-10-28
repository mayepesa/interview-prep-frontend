import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { TimesheetGrid } = (process.env.SOLUTIONS ? solution : starter) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

const projects = ["Planner", "Reports"];
const days = ["Mon", "Tue", "Wed"];

const total = (label: string) => screen.getByLabelText(`Total ${label}`).textContent;

suite("13 · timesheet grid", () => {
  it("renders an empty grid with zero totals", () => {
    render(<TimesheetGrid projects={projects} days={days} />);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(6);
    expect(screen.getByLabelText("Planner Mon")).toHaveValue(null);
    expect(total("week")).toBe("0");
  });

  it("computes totals per project, per day and per week, with decimals", async () => {
    const user = userEvent.setup();
    render(<TimesheetGrid projects={projects} days={days} />);

    await user.type(screen.getByLabelText("Planner Mon"), "4");
    await user.type(screen.getByLabelText("Planner Tue"), "1.5");
    await user.type(screen.getByLabelText("Reports Mon"), "3");

    expect(total("Planner")).toBe("5.5");
    expect(total("Reports")).toBe("3");
    expect(total("Mon")).toBe("7");
    expect(total("Wed")).toBe("0");
    expect(total("week")).toBe("8.5");
  });

  it("marks negative values as invalid and ignores them", async () => {
    const user = userEvent.setup();
    render(<TimesheetGrid projects={projects} days={days} />);
    await user.type(screen.getByLabelText("Reports Wed"), "-2");
    expect(screen.getByLabelText("Reports Wed")).toHaveAttribute("aria-invalid", "true");
    expect(total("Reports")).toBe("0");
  });

  it("warns when a day goes over 24 hours", async () => {
    const user = userEvent.setup();
    render(<TimesheetGrid projects={projects} days={days} />);
    await user.type(screen.getByLabelText("Planner Tue"), "20");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Reports Tue"), "5");
    expect(screen.getByRole("alert")).toHaveTextContent("Tue: more than 24 hours");
  });

  it("clears the week", async () => {
    const user = userEvent.setup();
    render(<TimesheetGrid projects={projects} days={days} />);
    await user.type(screen.getByLabelText("Planner Mon"), "8");
    await user.click(screen.getByRole("button", { name: "Clear week" }));
    expect(screen.getByLabelText("Planner Mon")).toHaveValue(null);
    expect(total("week")).toBe("0");
  });
});
