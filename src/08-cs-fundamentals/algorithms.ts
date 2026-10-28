// Algoritmos típicos de screening para front end. Cada uno con su complejidad:
// dila en voz alta en la entrevista aunque no te la pregunten.

/** Two Sum. Hash map: O(n) tiempo, O(n) memoria (el doble loop sería O(n²)). */
export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // valor → índice
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i]!;
    if (seen.has(needed)) return [seen.get(needed)!, i];
    seen.set(nums[i]!, i);
  }
  return null;
}

/** Paréntesis balanceados. Pila: O(n). */
export function isBalanced(text: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const char of text) {
    if ("([{".includes(char)) stack.push(char);
    else if (char in pairs && stack.pop() !== pairs[char]) return false;
  }
  return stack.length === 0;
}

/** Búsqueda binaria en un array ORDENADO. O(log n). */
export function binarySearch(sorted: number[], target: number): number {
  let low = 0;
  let high = sorted.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = sorted[mid]!;
    if (value === target) return mid;
    if (value < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

/** Anagramas. Contar letras: O(n). (Ordenar ambos strings sería O(n log n)). */
export function isAnagram(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const c of a) counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const c of b) {
    const n = counts.get(c);
    if (!n) return false;
    counts.set(c, n - 1);
  }
  return true;
}

/** Palíndromo con dos punteros. O(n) tiempo, O(1) memoria. */
export function isPalindrome(text: string): boolean {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

/** Aplanar un array anidado sin .flat(Infinity). Recursión: O(n) elementos totales. */
export type Nested<T> = (T | Nested<T>)[];

export function flatten<T>(list: Nested<T>): T[] {
  const out: T[] = [];
  for (const item of list) {
    if (Array.isArray(item)) out.push(...flatten(item));
    else out.push(item);
  }
  return out;
}

/** Fusionar dos arrays ordenados (el paso clave de merge sort). O(n + m). */
export function mergeSorted(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) out.push(a[i]! <= b[j]! ? a[i++]! : b[j++]!);
  return [...out, ...a.slice(i), ...b.slice(j)];
}

/** Fusionar intervalos que se solapan (ej. bloques de horas en un calendario). O(n log n) por el sort. */
export function mergeIntervals(intervals: [number, number][]): [number, number][] {
  const sorted = intervals.toSorted((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = out.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}

/** Primer carácter que no se repite. Dos pasadas: O(n). */
export function firstUniqueChar(text: string): string | null {
  const counts = new Map<string, number>();
  for (const c of text) counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const c of text) if (counts.get(c) === 1) return c;
  return null;
}

/** Fibonacci con memoización: de O(2^n) a O(n). */
export function fib(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
