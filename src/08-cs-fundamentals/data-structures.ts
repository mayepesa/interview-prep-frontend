// Estructuras de datos que conviene saber implementar y explicar, con su complejidad.

/** Pila (LIFO). push/pop O(1). Usos: deshacer/rehacer, validar paréntesis, el call stack. */
export class Stack<T> {
  #items: T[] = [];
  push(item: T) {
    this.#items.push(item);
  }
  pop(): T | undefined {
    return this.#items.pop();
  }
  peek(): T | undefined {
    return this.#items.at(-1);
  }
  get size() {
    return this.#items.length;
  }
}

/**
 * Cola (FIFO). enqueue/dequeue O(1).
 * Array.shift() es O(n) porque mueve todos los elementos; por eso se usa un índice de cabeza.
 * Usos: BFS, colas de tareas, el event loop.
 */
export class Queue<T> {
  #items: T[] = [];
  #head = 0;
  enqueue(item: T) {
    this.#items.push(item);
  }
  dequeue(): T | undefined {
    if (this.#head >= this.#items.length) return undefined;
    const item = this.#items[this.#head++];
    if (this.#head > 32 && this.#head * 2 > this.#items.length) {
      this.#items = this.#items.slice(this.#head); // compacta de vez en cuando
      this.#head = 0;
    }
    return item;
  }
  get size() {
    return this.#items.length - this.#head;
  }
}

/** Lista enlazada simple. Insertar al inicio O(1), buscar O(n). */
type ListNode<T> = { value: T; next: ListNode<T> | null };

export class LinkedList<T> {
  head: ListNode<T> | null = null;

  prepend(value: T) {
    this.head = { value, next: this.head };
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let node = this.head; node; node = node.next) out.push(node.value);
    return out;
  }

  /** Clásico de entrevista: invertir en el lugar. O(n) tiempo, O(1) memoria. */
  reverse() {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }
}

/**
 * Caché LRU (least recently used): get/set O(1).
 * Map recuerda el orden de inserción, así que el primero es el menos usado.
 * Usos: cachear respuestas de una API con un límite de memoria.
 */
export class LRUCache<K, V> {
  #map = new Map<K, V>();
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key)!;
    this.#map.delete(key);
    this.#map.set(key, value); // lo mueve al final: recién usado
    return value;
  }

  set(key: K, value: V) {
    this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.capacity) {
      const oldest = this.#map.keys().next().value as K;
      this.#map.delete(oldest);
    }
  }

  keys(): K[] {
    return [...this.#map.keys()];
  }
}

/** Árbol: recorrido en profundidad (DFS) y en anchura (BFS). Así se recorre el DOM o un menú anidado. */
export type TreeNode = { name: string; children?: TreeNode[] };

export function dfs(node: TreeNode, visit: (n: TreeNode, depth: number) => void, depth = 0) {
  visit(node, depth);
  node.children?.forEach((child) => dfs(child, visit, depth + 1));
}

export function bfs(root: TreeNode): string[] {
  const order: string[] = [];
  const queue = new Queue<TreeNode>();
  queue.enqueue(root);
  while (queue.size > 0) {
    const node = queue.dequeue()!;
    order.push(node.name);
    node.children?.forEach((child) => queue.enqueue(child));
  }
  return order;
}
