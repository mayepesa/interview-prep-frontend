import { useEffect, useEffectEvent, useRef, useState } from "react";

/** El intervalo se creó en el primer render: `count` siempre vale 0 ahí dentro. */
export function StaleCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []); // falta `count`: el linter de hooks avisaría (a propósito, para ver el bug)
  return <output>Stale: {count} (se queda en 1)</output>;
}

export function FixedCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000); // updater: no lee `count`
    return () => clearInterval(id);
  }, []);
  return <output>Con updater: {count}</output>;
}

export function Counters() {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <StaleCounter />
      <FixedCounter />
    </div>
  );
}

/** Un setTimeout lee el valor del render en que se creó; un ref lee el último. */
export function LatestValue() {
  const [text, setText] = useState("hola");
  const latest = useRef(text);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    latest.current = text; // siempre guarda el último valor
  }, [text]);

  const sendLater = () => {
    const captured = text; // valor de ESTE render
    setTimeout(() => {
      setLog((l) => [...l.slice(-3), `closure: "${captured}" · ref: "${latest.current}"`]);
    }, 2000);
  };

  return (
    <div>
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="mensaje" />
        <button type="button" onClick={sendLater}>
          Enviar en 2 s
        </button>
      </div>
      <ol className="console">
        {log.length === 0 ? (
          <li className="muted">Haz clic y sigue escribiendo antes de 2 s</li>
        ) : (
          log.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ol>
    </div>
  );
}

/** useEffectEvent: el efecto no se reinicia al cambiar `step`, pero lee su último valor. */
export function EffectEventCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const onTick = useEffectEvent(() => setCount((c) => c + step));

  useEffect(() => {
    const id = setInterval(() => onTick(), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="row">
      <output>count: {count}</output>
      <label className="row">
        paso
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          style={{ width: 60 }}
        />
      </label>
    </div>
  );
}

/* ---------- Estado derivado ---------- */

const ENTRIES = [
  { id: 1, project: "Planner", hours: 3 },
  { id: 2, project: "Reports", hours: 5 },
  { id: 3, project: "Planner", hours: 2 },
  { id: 4, project: "Billing", hours: 4 },
];

export function DerivedState() {
  const [filter, setFilter] = useState("");
  // Todo esto se CALCULA: no hay useState ni useEffect para ello.
  const visible = ENTRIES.filter((e) => e.project.toLowerCase().includes(filter.toLowerCase()));
  const total = visible.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar (plan)"
        aria-label="filtrar"
      />
      <ul>
        {visible.map((e) => (
          <li key={e.id}>
            {e.project}: {e.hours} h
          </li>
        ))}
      </ul>
      <strong>Total: {total} h</strong>
    </div>
  );
}
