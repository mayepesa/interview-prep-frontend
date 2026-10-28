import { memo, useDeferredValue, useState, useTransition } from "react";

/** Lista lenta a propósito: cada fila tarda ~0.25 ms en renderizar (≈150 ms en total). */
export const SlowList = memo(function SlowList({ filter }: { filter: string }) {
  const items = Array.from({ length: 600 }, (_, i) => `Entrada ${i} · ${filter || "todas"}`);
  return (
    <ul style={{ maxHeight: 140, overflow: "auto", margin: "8px 0 0" }}>
      {items.map((item) => (
        <SlowItem key={item} text={item} />
      ))}
    </ul>
  );
});

function SlowItem({ text }: { text: string }) {
  const end = performance.now() + 0.25;
  while (performance.now() < end) {
    /* trabajo pesado simulado */
  }
  return <li>{text}</li>;
}

export function Blocking() {
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

export function WithTransition() {
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

export function WithDeferred() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text); // va "detrás" de text
  const stale = text !== deferred;
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe rápido"
        aria-label="con deferred"
      />
      {stale && <small> actualizando…</small>}
      <div style={{ opacity: stale ? 0.6 : 1 }}>
        <SlowList filter={deferred} />
      </div>
    </div>
  );
}

/** Pestañas: una transición mantiene la UI vieja interactiva mientras se renderiza la nueva. */
const TABS = ["Resumen", "Entradas (lenta)", "Ajustes"] as const;
type Tab = (typeof TABS)[number];

export function TabsWithTransition({ useTransitionForTabs }: { useTransitionForTabs: boolean }) {
  const [tab, setTab] = useState<Tab>("Resumen");
  const [isPending, startTransition] = useTransition();

  const select = (next: Tab) => {
    if (useTransitionForTabs) startTransition(() => setTab(next));
    else setTab(next);
  };

  return (
    <div>
      <div className="row">
        {TABS.map((t) => (
          <button key={t} type="button" aria-pressed={t === tab} onClick={() => select(t)}>
            {t}
          </button>
        ))}
        {isPending && <small>cargando pestaña…</small>}
      </div>
      {tab === "Resumen" && <p>32 h registradas esta semana.</p>}
      {tab === "Entradas (lenta)" && <SlowList filter="semana" />}
      {tab === "Ajustes" && <p>Zona horaria: America/Bogota</p>}
    </div>
  );
}
