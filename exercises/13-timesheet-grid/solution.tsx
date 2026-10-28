import { useState } from "react";

type Hours = Record<string, Record<string, string>>; // project → day → valor del input

const MAX_PER_DAY = 24;

function toHours(value: string | undefined): number {
  const n = Number(value);
  return value && Number.isFinite(n) && n > 0 ? n : 0; // vacío o negativo → 0
}

const round = (n: number) => Math.round(n * 100) / 100;

export function TimesheetGrid({ projects, days }: { projects: string[]; days: string[] }) {
  const [hours, setHours] = useState<Hours>({});

  const setCell = (project: string, day: string, value: string) =>
    setHours((prev) => ({ ...prev, [project]: { ...prev[project], [day]: value } }));

  // Todo lo de abajo es estado derivado.
  const cell = (project: string, day: string) => hours[project]?.[day] ?? "";
  const projectTotal = (project: string) =>
    round(days.reduce((sum, day) => sum + toHours(cell(project, day)), 0));
  const dayTotal = (day: string) =>
    round(projects.reduce((sum, project) => sum + toHours(cell(project, day)), 0));
  const weekTotal = round(projects.reduce((sum, project) => sum + projectTotal(project), 0));
  const overloaded = days.filter((day) => dayTotal(day) > MAX_PER_DAY);

  return (
    <section>
      <table>
        <thead>
          <tr>
            <th scope="col">Project</th>
            {days.map((day) => (
              <th key={day} scope="col">
                {day}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project}>
              <th scope="row">{project}</th>
              {days.map((day) => {
                const value = cell(project, day);
                return (
                  <td key={day}>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      aria-label={`${project} ${day}`}
                      aria-invalid={Number(value) < 0 ? true : undefined}
                      value={value}
                      onChange={(e) => setCell(project, day, e.target.value)}
                      style={{ width: 64 }}
                    />
                  </td>
                );
              })}
              <td>
                <output aria-label={`Total ${project}`}>{projectTotal(project)}</output>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            {days.map((day) => (
              <td key={day}>
                <output aria-label={`Total ${day}`}>{dayTotal(day)}</output>
              </td>
            ))}
            <td>
              <output aria-label="Total week">{weekTotal}</output>
            </td>
          </tr>
        </tfoot>
      </table>

      {overloaded.map((day) => (
        <p key={day} role="alert">
          {day}: more than 24 hours
        </p>
      ))}

      <button type="button" onClick={() => setHours({})}>
        Clear week
      </button>
    </section>
  );
}
