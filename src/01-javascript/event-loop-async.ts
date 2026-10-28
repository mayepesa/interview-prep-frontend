// ─── Event loop ──────────────────────────────────────────────────────────────
// 1. Se ejecuta todo el código síncrono (call stack).
// 2. Cuando el stack queda vacío, se vacía TODA la cola de microtareas
//    (promesas, queueMicrotask, await).
// 3. Luego se toma UNA macrotarea (setTimeout, eventos, I/O) y se repite.

/** Devuelve el orden en que se imprimen los logs. Predícelo antes de mirar el test. */
export function eventLoopOrder(): Promise<string[]> {
  const log: string[] = [];

  log.push("1 sync");
  setTimeout(() => log.push("6 timeout"), 0);
  Promise.resolve().then(() => log.push("4 promise"));
  queueMicrotask(() => log.push("5 microtask"));
  (async () => {
    log.push("2 async start (sync hasta el primer await)");
    await null;
    log.push("4b after await");
  })();
  log.push("3 sync end");

  return new Promise((resolve) => setTimeout(() => resolve(log), 10));
}

// ─── Promesas y async/await ──────────────────────────────────────────────────

export const delay = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const failAfter = (ms: number, message: string) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms));

/** En serie: ~300 ms. Cada await espera al anterior. */
export async function sequential() {
  const a = await delay(100, "a");
  const b = await delay(100, "b");
  const c = await delay(100, "c");
  return [a, b, c];
}

/** En paralelo: ~100 ms. Se lanzan todas y se espera el conjunto. */
export async function parallel() {
  return Promise.all([delay(100, "a"), delay(100, "b"), delay(100, "c")]);
}

/**
 * Los cuatro combinadores:
 * - all: todas o falla con el primer error
 * - allSettled: espera todas y te dice cuál falló
 * - race: la primera que termine (bien o mal)
 * - any: la primera que salga bien
 */
export async function combinators() {
  const all = await Promise.all([delay(10, 1), delay(20, 2)]);
  const settled = await Promise.allSettled([delay(10, "ok"), failAfter(10, "falló")]);
  const race = await Promise.race([delay(50, "lenta"), delay(10, "rápida")]);
  const any = await Promise.any([failAfter(5, "x"), delay(20, "primera ok")]);
  return { all, settled: settled.map((r) => r.status), race, any };
}

/** Timeout para cualquier promesa (pregunta típica). */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, failAfter(ms, `Timeout tras ${ms} ms`)]);
}

/** Reintentos con espera creciente (backoff exponencial). */
export async function retry<T>(fn: () => Promise<T>, attempts = 3, baseMs = 50): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) await delay(baseMs * 2 ** i, null);
    }
  }
  throw lastError;
}
