export type Settled<T> =
  { status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown };

export function promiseAll<T>(items: readonly (T | Promise<T>)[]): Promise<T[]> {
  return Promise.reject(new Error("TODO: implementa promiseAll"));
}

export function promiseAllSettled<T>(items: readonly (T | Promise<T>)[]): Promise<Settled<T>[]> {
  return Promise.reject(new Error("TODO: implementa promiseAllSettled"));
}
