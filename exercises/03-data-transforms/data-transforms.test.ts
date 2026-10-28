import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";
import type { Entry } from "./types";

const { hoursByProject, hoursByDay, topProjects, attachProjects } = (
  process.env.SOLUTIONS ? solution : starter
) as typeof solution;

const entries: Entry[] = [
  { id: "1", projectId: "p1", project: "Planner", date: "2026-11-03", hours: 3 },
  { id: "2", projectId: "p2", project: "Reports", date: "2026-11-02", hours: 5 },
  { id: "3", projectId: "p1", project: "Planner", date: "2026-11-02", hours: 2 },
  { id: "4", projectId: "p3", project: "Billing", date: "2026-11-04", hours: 5 },
  { id: "5", projectId: "p9", project: "Ghost", date: "2026-11-04", hours: 1 },
];

describe("03 · data transforms", () => {
  it("hoursByProject", () => {
    expect(hoursByProject(entries)).toEqual({ Planner: 5, Reports: 5, Billing: 5, Ghost: 1 });
    expect(hoursByProject([])).toEqual({});
  });

  it("hoursByDay sorted by date", () => {
    const result = hoursByDay(entries);
    expect(result).toEqual({ "2026-11-02": 7, "2026-11-03": 3, "2026-11-04": 6 });
    expect(Object.keys(result)).toEqual(["2026-11-02", "2026-11-03", "2026-11-04"]);
  });

  it("topProjects breaks ties by name", () => {
    expect(topProjects(entries, 2)).toEqual([
      { project: "Billing", hours: 5 },
      { project: "Planner", hours: 5 },
    ]);
  });

  it("attachProjects joins by id", () => {
    const result = attachProjects(entries, [
      { id: "p1", name: "Capacity Planner" },
      { id: "p2", name: "Reports" },
      { id: "p3", name: "Billing" },
    ]);
    expect(result[0]?.projectName).toBe("Capacity Planner");
    expect(result[4]?.projectName).toBe("Unknown");
    expect(result).toHaveLength(entries.length);
  });
});
