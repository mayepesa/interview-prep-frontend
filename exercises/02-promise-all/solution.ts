export type Settled<T> =
  { status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown };

export function promiseAll<T>(items: readonly (T | Promise<T>)[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = new Array(items.length);
    let pending = items.length;
    if (pending === 0) return resolve([]);

    items.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        results[index] = value; // por índice: conserva el orden
        pending -= 1;
        if (pending === 0) resolve(results);
      }, reject); // el primer error rechaza todo
    });
  });
}

export function promiseAllSettled<T>(items: readonly (T | Promise<T>)[]): Promise<Settled<T>[]> {
  return promiseAll(
    items.map((item) =>
      Promise.resolve(item).then(
        (value): Settled<T> => ({ status: "fulfilled", value }),
        (reason): Settled<T> => ({ status: "rejected", reason }),
      ),
    ),
  );
}
