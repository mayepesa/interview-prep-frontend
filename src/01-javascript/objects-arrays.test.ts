import { describe, expect, it } from "vitest";
import {
  addTag,
  allTags,
  allTagged,
  deepCopy,
  describeUser,
  entries,
  groupByProject,
  hasMeetings,
  hoursByProject,
  longEntries,
  projectNames,
  sameReference,
  shallowCopy,
  sortedByHours,
  totalHours,
  withNullish,
  withOr,
} from "./objects-arrays";

const entry = { id: "1", project: "Planner", hours: 3, tags: ["dev"] };

describe("copies", () => {
  it("shallow copies share nested arrays", () => {
    const copy = shallowCopy(entry);
    expect(sameReference(copy, entry)).toBe(false);
    expect(sameReference(copy.tags, entry.tags)).toBe(true);
  });

  it("deep copies do not share anything", () => {
    const copy = deepCopy(entry);
    expect(sameReference(copy.tags, entry.tags)).toBe(false);
    expect(copy).toEqual(entry);
  });

  it("immutable updates create new references only where something changed", () => {
    const next = addTag(entry, "review");
    expect(next.tags).toEqual(["dev", "review"]);
    expect(entry.tags).toEqual(["dev"]);
  });
});

describe("array methods", () => {
  it("reduce, map, filter, some, every, flatMap", () => {
    expect(totalHours(entries)).toBe(14);
    expect(projectNames(entries)).toEqual(["Planner", "Timesheets", "Reports"]);
    expect(longEntries(entries, 4).map((e) => e.id)).toEqual(["2", "4"]);
    expect(hasMeetings(entries)).toBe(true);
    expect(allTagged(entries)).toBe(false);
    expect(allTags(entries)).toEqual(["dev", "review", "dev", "meeting"]);
  });

  it("groups in one pass", () => {
    expect(hoursByProject(entries)).toEqual({ Planner: 5, Timesheets: 5, Reports: 4 });
    expect(groupByProject(entries).Planner).toHaveLength(2);
  });

  it("toSorted does not mutate", () => {
    const sorted = sortedByHours(entries);
    expect(sorted[0]?.id).toBe("2");
    expect(entries[0]?.id).toBe("1");
  });
});

describe("modern syntax", () => {
  it("destructuring with defaults and optional chaining", () => {
    expect(describeUser()).toBe("Anónimo · sin equipo");
    expect(describeUser({ name: "Maria", team: { name: "Front" } })).toBe("Maria · Front");
  });

  it("?? keeps 0, || does not", () => {
    expect(withNullish(0)).toBe(0);
    expect(withOr(0)).toBe(10);
    expect(withNullish(null)).toBe(10);
  });
});
