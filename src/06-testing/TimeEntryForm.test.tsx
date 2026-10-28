import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TimeEntryForm } from "./TimeEntryForm";

// Testing Library: se prueba lo que ve y hace el usuario, no la implementación.
// Prioridad de queries: getByRole > getByLabelText > getByText > getByTestId.

const projects = ["Planner", "Reports"];

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const user = userEvent.setup();
  render(<TimeEntryForm projects={projects} onSubmit={onSubmit} />);
  return { user, onSubmit };
}

describe("TimeEntryForm", () => {
  it("submits a valid entry", async () => {
    const { user, onSubmit } = setup();

    await user.selectOptions(screen.getByLabelText("Proyecto"), "Planner");
    await user.type(screen.getByLabelText("Horas"), "2.5");
    await user.type(screen.getByLabelText("Descripción"), "  Code review  ");
    await user.click(screen.getByRole("button", { name: "Registrar horas" }));

    expect(onSubmit).toHaveBeenCalledWith({
      project: "Planner",
      hours: 2.5,
      description: "Code review",
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Horas registradas");
  });

  it("shows accessible validation errors and does not submit", async () => {
    const { user, onSubmit } = setup();

    await user.click(screen.getByRole("button", { name: "Registrar horas" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Elige un proyecto")).toBeInTheDocument();
    expect(screen.getByLabelText("Horas")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Horas")).toHaveAccessibleDescription("Entre 0.25 y 24 horas");
  });

  it("disables the button while saving", async () => {
    let finish!: () => void;
    const { user } = setup(vi.fn(() => new Promise<void>((resolve) => (finish = resolve))));

    await user.selectOptions(screen.getByLabelText("Proyecto"), "Reports");
    await user.type(screen.getByLabelText("Horas"), "1");
    await user.click(screen.getByRole("button", { name: "Registrar horas" }));

    expect(screen.getByRole("button", { name: "Guardando…" })).toBeDisabled();
    finish();
    expect(await screen.findByRole("button", { name: "Registrar horas" })).toBeEnabled();
  });

  it("shows a server error", async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new Error("500")));

    await user.selectOptions(screen.getByLabelText("Proyecto"), "Reports");
    await user.type(screen.getByLabelText("Horas"), "1");
    await user.click(screen.getByRole("button", { name: "Registrar horas" }));

    expect(await screen.findByText("No se pudo guardar. Intenta de nuevo.")).toBeInTheDocument();
  });
});
