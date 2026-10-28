import { memo, useCallback, useMemo, useRef, useState } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

function PlainChild() {
  const renders = useRenderCount();
  return <RenderCount label="Hijo sin props" count={renders} />;
}

const MemoChild = memo(function MemoChild() {
  const renders = useRenderCount();
  return <RenderCount label="Hijo con memo" count={renders} />;
});

/** Cuando el padre cambia su estado, todos sus hijos se renderizan (salvo los memoizados). */
export function ParentRerender() {
  const renders = useRenderCount();
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Estado del padre: {count}
        </button>
        <RenderCount label="Padre" count={renders} />
      </div>
      <PlainChild />
      <MemoChild />
    </div>
  );
}

type Entry = { id: number; project: string; hours: number };

const ENTRIES: Entry[] = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  project: ["Planner", "Timesheets", "Reports"][i % 3]!,
  hours: (i % 8) + 1,
}));

function sumByProject(entries: Entry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) totals[e.project] = (totals[e.project] ?? 0) + e.hours;
  return totals;
}

/** Cuenta cuántas veces corre el cálculo con y sin useMemo. */
export function UseMemoDemo() {
  const [note, setNote] = useState("");
  const [minHours, setMinHours] = useState(1);
  const plainRuns = useRef(0);
  const memoRuns = useRef(0);

  // Sin useMemo: corre en cada render.
  plainRuns.current += 1;
  const plain = sumByProject(ENTRIES.filter((e) => e.hours >= minHours));

  // Con useMemo: solo cuando cambia minHours.
  const memoized = useMemo(() => {
    memoRuns.current += 1;
    return sumByProject(ENTRIES.filter((e) => e.hours >= minHours));
  }, [minHours]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota (no afecta al cálculo)"
        aria-label="nota"
      />
      <label className="row">
        Horas mínimas
        <input
          type="range"
          min={1}
          max={8}
          value={minHours}
          onChange={(e) => setMinHours(Number(e.target.value))}
        />
        {minHours}
      </label>
      <small>
        Total Planner: {plain.Planner ?? 0} h (sin useMemo) · {memoized.Planner ?? 0} h (con
        useMemo)
      </small>
      <div className="row">
        <span className="render-count">cálculo sin useMemo: {plainRuns.current} veces</span>
        <span className="render-count">cálculo con useMemo: {memoRuns.current} veces</span>
      </div>
    </div>
  );
}

type ChartProps = { totals: Record<string, number>; onSelect: (project: string) => void };

const MemoChart = memo(function MemoChart({ totals, onSelect }: ChartProps) {
  const renders = useRenderCount();
  return (
    <div>
      <RenderCount label="MemoChart" count={renders} />
      <div className="row" style={{ marginTop: 8 }}>
        {Object.entries(totals).map(([project, hours]) => (
          <button key={project} type="button" onClick={() => onSelect(project)}>
            {project}: {hours} h
          </button>
        ))}
      </div>
    </div>
  );
});

/** memo solo funciona si las props son estables: useMemo para el objeto, useCallback para la función. */
export function StablePropsDemo() {
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [stable, setStable] = useState(true);

  const memoTotals = useMemo(() => sumByProject(ENTRIES), []);
  const memoSelect = useCallback((p: string) => setSelected(p), []);

  const totals = stable ? memoTotals : { ...memoTotals }; // copia = referencia nueva
  const onSelect = stable ? memoSelect : (p: string) => setSelected(p);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Escribe aquí (re-renderiza el padre)"
        aria-label="nota"
      />
      <label className="row">
        <input type="checkbox" checked={stable} onChange={(e) => setStable(e.target.checked)} />
        Props estables (useMemo + useCallback)
      </label>
      <MemoChart totals={totals} onSelect={onSelect} />
      <small>Seleccionado: {selected ?? "—"}</small>
    </div>
  );
}
