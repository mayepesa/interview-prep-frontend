import { memo, useDeferredValue, useState, useTransition } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Concurrent React: useTransition y useDeferredValue",
  section: "react-expert",
  order: 400,
  questions: [
    "¿Para qué sirve useTransition y cuándo usarlo?",
    "¿Qué es startTransition y en qué se diferencia de actualizar el estado normal?",
    "¿Para qué sirve useDeferredValue?",
    "¿Qué es Concurrent React y qué problemas resuelve?",
    "¿Cómo se complementan useMemo, useCallback, useTransition y useDeferredValue?",
  ],
  sayIt:
    "Concurrent React can interrupt a render to handle something more urgent. With useTransition I mark an update as non-urgent so typing stays responsive while a heavy list renders; useDeferredValue does the same when I only control the value, not the setter.",
};

// Lista lenta a propósito: cada fila tarda ~0.3 ms en renderizar.
const SlowList = memo(function SlowList({ filter }: { filter: string }) {
  const items = Array.from({ length: 600 }, (_, i) => `Entrada ${i} · ${filter || "todas"}`);
  return (
    <ul style={{ maxHeight: 160, overflow: "auto" }}>
      {items.map((item) => (
        <SlowItem key={item} text={item} />
      ))}
    </ul>
  );
});

function SlowItem({ text }: { text: string }) {
  const end = performance.now() + 0.3;
  while (performance.now() < end) {
    /* trabajo pesado simulado */
  }
  return <li>{text}</li>;
}

function Blocking() {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe rápido"
        aria-label="sin transición"
      />
      <SlowList filter={text} />
    </div>
  );
}

function WithTransition() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value); // urgente: el input responde ya
          startTransition(() => setFilter(e.target.value)); // no urgente, interrumpible
        }}
        placeholder="Escribe rápido"
        aria-label="con transición"
      />
      {isPending && <small> actualizando…</small>}
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <SlowList filter={filter} />
      </div>
    </div>
  );
}

function WithDeferred() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text); // va "detrás" de text
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe rápido"
        aria-label="con deferred"
      />
      <div style={{ opacity: text !== deferred ? 0.6 : 1 }}>
        <SlowList filter={deferred} />
      </div>
    </div>
  );
}

export default function ConcurrentDemo() {
  return (
    <>
      <Panel title="Sin transición: el input se traba">
        <Blocking />
      </Panel>
      <Panel title="useTransition: el input sigue fluido">
        <WithTransition />
      </Panel>
      <Panel title="useDeferredValue: lo mismo, cuando solo tienes el valor">
        <WithDeferred />
        <Note>
          SlowList usa memo: sin él, la lista se renderizaría igual con el valor urgente y no
          ganarías nada. Para filtrar en el servidor, la respuesta correcta es debounce, no
          transiciones.
        </Note>
      </Panel>
    </>
  );
}
