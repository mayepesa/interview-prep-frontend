export class LRUCache<K, V> {
  #map = new Map<K, V>();
  #capacity: number;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key)!;
    this.#map.delete(key);
    this.#map.set(key, value); // al final = el más reciente
    return value;
  }

  set(key: K, value: V): void {
    this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) {
      // la primera clave del Map es la menos usada
      this.#map.delete(this.#map.keys().next().value as K);
    }
  }

  has(key: K): boolean {
    return this.#map.has(key);
  }

  get size(): number {
    return this.#map.size;
  }
}
