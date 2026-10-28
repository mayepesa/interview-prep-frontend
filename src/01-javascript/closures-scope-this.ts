// ─── Closures ────────────────────────────────────────────────────────────────
// Una función "recuerda" las variables del lugar donde se creó, aunque ese lugar ya terminó.

export function createCounter(start = 0) {
  let count = start; // privada: solo la ven las funciones de abajo
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

// memoize: un closure que guarda resultados.
export function memoize<A extends string | number, R>(fn: (arg: A) => R) {
  const cache = new Map<A, R>();
  return (arg: A): R => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// once: un closure que recuerda si ya se ejecutó.
export function once<Args extends unknown[], R>(fn: (...args: Args) => R) {
  let called = false;
  let result: R;
  return (...args: Args): R => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

// ─── var vs let en loops (pregunta clásica) ─────────────────────────────────
// Con var hay UNA variable para todo el loop; con let, una por iteración.
export function loopWithVar(): number[] {
  const fns: (() => number)[] = [];
  // var a propósito, para mostrar el problema
  for (var i = 0; i < 3; i++) fns.push(() => i);
  return fns.map((f) => f()); // [3, 3, 3]
}

export function loopWithLet(): number[] {
  const fns: (() => number)[] = [];
  for (let i = 0; i < 3; i++) fns.push(() => i);
  return fns.map((f) => f()); // [0, 1, 2]
}

// ─── this ────────────────────────────────────────────────────────────────────
// `this` depende de CÓMO se llama la función, no de dónde se escribió.
// Las arrow functions no tienen this propio: usan el del lugar donde se definieron.

export const timer = {
  label: "timer",
  regular() {
    return this?.label;
  },
  arrowInside() {
    const inner = () => this.label; // hereda this de arrowInside
    return inner();
  },
};

export function callDetached() {
  const fn = timer.regular;
  return fn(); // llamada suelta: this es undefined en módulos (strict mode)
}

export function callWithBind() {
  const fn = timer.regular.bind({ label: "bound" });
  return fn();
}

// ─── Hoisting ────────────────────────────────────────────────────────────────
// Las declaraciones de función se elevan completas; var se eleva como undefined;
// let/const se elevan pero no se pueden usar antes de declararlas (temporal dead zone).
export function hoisting() {
  const beforeDeclaration = typeof hoisted; // "function": se puede llamar antes
  function hoisted() {
    return "ok";
  }
  return beforeDeclaration;
}
