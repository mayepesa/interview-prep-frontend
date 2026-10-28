type Handler<T> = (payload: T) => void;

export class Emitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    throw new Error("TODO");
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    throw new Error("TODO");
  }

  once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    throw new Error("TODO");
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    throw new Error("TODO");
  }
}
