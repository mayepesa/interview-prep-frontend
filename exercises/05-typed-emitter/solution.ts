type Handler<T> = (payload: T) => void;

export class Emitter<Events extends Record<string, unknown>> {
  #handlers: { [K in keyof Events]?: Set<Handler<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    (this.#handlers[event] ??= new Set()).add(handler);
    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    this.#handlers[event]?.delete(handler);
  }

  once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    const wrapper: Handler<Events[K]> = (payload) => {
      this.off(event, wrapper);
      handler(payload);
    };
    return this.on(event, wrapper);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    // Copia: si un handler se desuscribe durante el emit, no altera esta iteración.
    for (const handler of [...(this.#handlers[event] ?? [])]) handler(payload);
  }
}
