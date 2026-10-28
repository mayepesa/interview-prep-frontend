# 05 · Event emitter tipado (TypeScript)

**Nivel:** medio · **Tiempo:** 25 min · **Pregunta real:** "Implement a small pub/sub. Make it type-safe."

Completa la clase `Emitter<Events>` en `starter.ts`. `Events` es un mapa de nombre de evento → tipo del payload:

```ts
type TimerEvents = { start: { project: string }; stop: { seconds: number }; reset: undefined };
const emitter = new Emitter<TimerEvents>();
emitter.on("stop", (payload) => payload.seconds); // payload es { seconds: number }
```

- `on(event, handler)` registra y **devuelve una función para desuscribirse**.
- `off(event, handler)` desuscribe.
- `emit(event, payload)` llama a todos los handlers de ese evento, en el orden en que se registraron.
- `once(event, handler)` se ejecuta una sola vez.
- Un handler que se desuscribe durante un `emit` no debe romper la iteración.

Los tipos ya están en las firmas: el test incluye chequeos con `@ts-expect-error` que se validan con `npm run typecheck`.
