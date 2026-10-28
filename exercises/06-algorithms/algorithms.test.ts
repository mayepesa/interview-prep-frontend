import { describe, expect, it } from "vitest";
import * as solution from "./solution";
import * as starter from "./starter";

const { twoSum, isBalanced, binarySearch, mergeIntervals, chunk, isAnagram } = (
  process.env.SOLUTIONS ? solution : starter
) as typeof solution;

// Los tests de un ejercicio no corren hasta que pongas `started = true` en starter.
const suite = process.env.SOLUTIONS || starter.started ? describe : describe.skip;

suite("06 · algorithms", () => {
  it("twoSum", () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
    expect(twoSum([1, 2, 3], 100)).toBeNull();
  });

  it("isBalanced", () => {
    expect(isBalanced("fn(a[0], { b: 1 })")).toBe(true);
    expect(isBalanced("(]")).toBe(false);
    expect(isBalanced("((")).toBe(false);
    expect(isBalanced(")(")).toBe(false);
    expect(isBalanced("")).toBe(true);
  });

  it("binarySearch", () => {
    const sorted = [1, 4, 9, 16, 25, 36, 49];
    expect(binarySearch(sorted, 1)).toBe(0);
    expect(binarySearch(sorted, 49)).toBe(6);
    expect(binarySearch(sorted, 10)).toBe(-1);
    expect(binarySearch([], 1)).toBe(-1);
  });

  it("mergeIntervals", () => {
    expect(
      mergeIntervals([
        [1, 3],
        [8, 10],
        [2, 6],
        [15, 18],
      ]),
    ).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
    expect(
      mergeIntervals([
        [1, 4],
        [4, 5],
      ]),
    ).toEqual([[1, 5]]);
    expect(mergeIntervals([])).toEqual([]);
  });

  it("chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 3)).toEqual([]);
  });

  it("isAnagram", () => {
    expect(isAnagram("listen", "silent")).toBe(true);
    expect(isAnagram("aab", "abb")).toBe(false);
  });
});
