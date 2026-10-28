export {
  binarySearch,
  isAnagram,
  isBalanced,
  mergeIntervals,
  twoSum,
} from "../../src/08-cs-fundamentals/algorithms";

// O(n)
export function chunk<T>(list: T[], size: number): T[][] {
  if (size <= 0) throw new Error("size must be positive");
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
