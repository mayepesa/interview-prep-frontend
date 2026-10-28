import { describe, expect, it } from "vitest";
import {
  binarySearch,
  fib,
  firstUniqueChar,
  flatten,
  isAnagram,
  isBalanced,
  isPalindrome,
  mergeIntervals,
  mergeSorted,
  twoSum,
} from "./algorithms";
import { bfs, dfs, LinkedList, LRUCache, Queue, Stack, type TreeNode } from "./data-structures";

describe("data structures", () => {
  it("Stack is LIFO", () => {
    const s = new Stack<number>();
    s.push(1);
    s.push(2);
    expect(s.peek()).toBe(2);
    expect(s.pop()).toBe(2);
    expect(s.size).toBe(1);
  });

  it("Queue is FIFO", () => {
    const q = new Queue<number>();
    for (let i = 0; i < 100; i++) q.enqueue(i);
    expect(q.dequeue()).toBe(0);
    expect(q.dequeue()).toBe(1);
    expect(q.size).toBe(98);
  });

  it("LinkedList reverses in place", () => {
    const list = new LinkedList<number>();
    [3, 2, 1].forEach((n) => list.prepend(n));
    expect(list.toArray()).toEqual([1, 2, 3]);
    list.reverse();
    expect(list.toArray()).toEqual([3, 2, 1]);
  });

  it("LRUCache evicts the least recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a"); // ahora "b" es el menos usado
    cache.set("c", 3);
    expect(cache.keys()).toEqual(["a", "c"]);
    expect(cache.get("b")).toBeUndefined();
  });

  it("DFS and BFS visit in different orders", () => {
    const tree: TreeNode = {
      name: "root",
      children: [{ name: "a", children: [{ name: "a1" }] }, { name: "b" }],
    };
    const depthFirst: string[] = [];
    dfs(tree, (n) => depthFirst.push(n.name));
    expect(depthFirst).toEqual(["root", "a", "a1", "b"]);
    expect(bfs(tree)).toEqual(["root", "a", "b", "a1"]);
  });
});

describe("algorithms", () => {
  it("twoSum", () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([1, 2], 10)).toBeNull();
  });

  it("isBalanced", () => {
    expect(isBalanced("{[()]}")).toBe(true);
    expect(isBalanced("([)]")).toBe(false);
    expect(isBalanced("((")).toBe(false);
  });

  it("binarySearch", () => {
    expect(binarySearch([1, 3, 5, 7, 9], 7)).toBe(3);
    expect(binarySearch([1, 3, 5], 4)).toBe(-1);
  });

  it("isAnagram and isPalindrome", () => {
    expect(isAnagram("listen", "silent")).toBe(true);
    expect(isAnagram("abc", "abd")).toBe(false);
    expect(isPalindrome("Anita lava la tina")).toBe(true);
    expect(isPalindrome("Tempo")).toBe(false);
  });

  it("flatten", () => {
    expect(flatten([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("mergeSorted and mergeIntervals", () => {
    expect(mergeSorted([1, 4, 7], [2, 3, 8])).toEqual([1, 2, 3, 4, 7, 8]);
    expect(
      mergeIntervals([
        [9, 11],
        [13, 15],
        [10, 12],
      ]),
    ).toEqual([
      [9, 12],
      [13, 15],
    ]);
  });

  it("firstUniqueChar and fib", () => {
    expect(firstUniqueChar("aabbcdd")).toBe("c");
    expect(firstUniqueChar("aabb")).toBeNull();
    expect(fib(50)).toBe(12_586_269_025);
  });
});
