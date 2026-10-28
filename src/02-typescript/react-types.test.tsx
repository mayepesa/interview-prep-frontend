import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Action, Button, Select } from "./react-types";

type Project = { id: number; name: string };
const projects: Project[] = [
  { id: 1, name: "Planner" },
  { id: 2, name: "Reports" },
];

describe("typed React components", () => {
  it("Button forwards native props", async () => {
    const onClick = vi.fn();
    render(<Button aria-label="guardar" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "guardar" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("generic Select returns the full object", async () => {
    const onChange = vi.fn<(p: Project) => void>();
    render(
      <Select
        options={projects}
        value={projects[0]!}
        onChange={onChange}
        getLabel={(p) => p.name}
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "Reports");
    expect(onChange).toHaveBeenCalledWith({ id: 2, name: "Reports" });
  });

  it("dependent props are enforced", () => {
    render(
      <Action as="link" href="/docs">
        Docs
      </Action>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    // @ts-expect-error: un link sin href no compila
    expect(() => <Action as="link">Sin href</Action>).toBeDefined();
  });
});
