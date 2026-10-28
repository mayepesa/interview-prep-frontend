import { describe as group, expect, expectTypeOf, it } from "vitest";
import {
  applyPatch,
  byId,
  describe,
  first,
  isStatus,
  parseEntries,
  pluck,
  STATUS_LABEL,
  type Awaited2,
  type Entry,
  type EventName,
  type Getters,
  type ParseResult,
  type RequestState,
  type Status,
} from "./types";

const entries: Entry[] = [
  { id: "a", project: "Planner", hours: 2 },
  { id: "b", project: "Reports", hours: 5 },
];

group("generics", () => {
  it("keep the element type", () => {
    expectTypeOf(first(entries)).toEqualTypeOf<Entry | undefined>();
    expectTypeOf(first([1, 2])).toEqualTypeOf<number | undefined>();
  });

  it("pluck returns the type of the chosen key", () => {
    const hours = pluck(entries, "hours");
    expectTypeOf(hours).toEqualTypeOf<number[]>();
    expect(hours).toEqual([2, 5]);
    // @ts-expect-error: "minutes" no existe en Entry
    pluck(entries, "minutes");
  });

  it("byId indexes by id", () => {
    expect(byId(entries).b?.project).toBe("Reports");
  });
});

group("discriminated unions", () => {
  it("narrow by status", () => {
    const states: RequestState<number>[] = [
      { status: "idle" },
      { status: "loading" },
      { status: "success", data: 3 },
      { status: "error", error: "500" },
    ];
    expect(states.map(describe)).toEqual(["Sin empezar", "Cargando…", "Listo (3)", "Error: 500"]);
  });

  it("make impossible states unrepresentable", () => {
    // @ts-expect-error: success sin data no compila
    const broken: RequestState<number> = { status: "success" };
    expect(broken).toBeDefined();
  });
});

group("type guards", () => {
  it("filter unknown data", () => {
    const json = JSON.stringify([...entries, { id: 1 }, null, "x"]);
    expect(parseEntries(json)).toEqual(entries);
    expectTypeOf<ParseResult>().toEqualTypeOf<Entry[]>();
  });
});

group("utility and derived types", () => {
  it("Partial patches", () => {
    expect(applyPatch(entries[0]!, { hours: 3 }).hours).toBe(3);
  });

  it("as const + typeof derive unions", () => {
    expectTypeOf<Status>().toEqualTypeOf<"draft" | "submitted" | "approved">();
    expect(isStatus("approved")).toBe(true);
    expect(isStatus("deleted")).toBe(false);
    expectTypeOf(STATUS_LABEL.draft).toEqualTypeOf<string>();
  });

  it("advanced types", () => {
    expectTypeOf<EventName>().toEqualTypeOf<"onClick" | "onChange">();
    expectTypeOf<Getters<{ hours: number }>>().toEqualTypeOf<{ getHours: () => number }>();
    expectTypeOf<Awaited2<Promise<string>>>().toEqualTypeOf<string>();
  });
});
