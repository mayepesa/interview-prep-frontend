import { memo, useCallback, useMemo, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

export const meta: DemoMeta = {
  title: "Re-renders, React.memo, useMemo y useCallback",
  section: "react-intermediate",
  order: 230,
  questions: [
    "¿Qué provoca un re-render en un componente?",
    "¿Cómo funciona React.memo y cuándo es útil?",
    "¿Para qué sirve useMemo? ¿Es buena idea usarlo siempre?",
    "¿Para qué sirve useCallback? ¿Es buena idea usarlo siempre?",
    "¿Cuál es la diferencia entre useCallback y useMemo?",
    "¿Qué es el React Compiler?",
  ],
  sayIt:
    "A component re-renders when its state changes, its parent re-renders, or a context it reads changes. React.memo skips a child when its props are shallowly equal, which only works if I keep object and function props stable with useMemo and useCallback. I measure with the Profiler first; the React Compiler can now add this memoization automatically.",
};

type Entry = { id: number; project: string; hours: number };

const ENTRIES: Entry[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  project: ["Planner", "Timesheets", "Reports"][i % 3]!,
  hours: (i % 8) + 1,
}));

// Sin memo: se re-renderiza cada vez que el padre lo hace.
function Chart({
  totals,
  onSelect,
}: {
  totals: Record<string, number>;
  onSelect: (p: string) => void;
}) {
  const renders = useRenderCount();
  return (
    <div>
      <span className="render-count">Chart sin memo: {renders}</span>
      <div className="row" style={{ marginTop: 8 }}>
        {Object.entries(totals).map(([project, hours]) => (
          <button key={project} type="button" onClick={() => onSelect(project)}>
            {project}: {hours} h
          </button>
        ))}
      </div>
    </div>
  );
}

const MemoChart = memo(function MemoChart(props: {
  totals: Record<string, number>;
  onSelect: (p: string) => void;
}) {
  const renders = useRenderCount();
  return (
    <div>
      <span className="render-count">Chart con memo: {renders}</span>
      <div className="row" style={{ marginTop: 8 }}>
        {Object.entries(props.totals).map(([project, hours]) => (
          <button key={project} type="button" onClick={() => props.onSelect(project)}>
            {project}: {hours} h
          </button>
        ))}
      </div>
    </div>
  );
});

function sumByProject(entries: Entry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) totals[e.project] = (totals[e.project] ?? 0) + e.hours;
  return totals;
}

export default function MemoizationDemo() {
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [stable, setStable] = useState(true);

  // useMemo: guarda el RESULTADO de un cálculo entre renders.
  const memoTotals = useMemo(() => sumByProject(ENTRIES), []);
  const freshTotals = sumByProject(ENTRIES); // objeto nuevo en cada render

  // useCallback: guarda la FUNCIÓN. Es useMemo(() => fn, deps).
  const memoSelect = useCallback((p: string) => setSelected(p), []);
  const freshSelect = (p: string) => setSelected(p);

  return (
    <>
      <Panel title="Escribe en el input y mira los contadores">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota (re-renderiza el padre)"
          aria-label="nota"
        />
        <label className="row" style={{ marginTop: 8 }}>
          <input type="checkbox" checked={stable} onChange={(e) => setStable(e.target.checked)} />
          Pasar props estables (useMemo + useCallback)
        </label>
        <p>Seleccionado: {selected ?? "—"}</p>
        <div style={{ display: "grid", gap: 12 }}>
          <Chart
            totals={stable ? memoTotals : freshTotals}
            onSelect={stable ? memoSelect : freshSelect}
          />
          <MemoChart
            totals={stable ? memoTotals : freshTotals}
            onSelect={stable ? memoSelect : freshSelect}
          />
        </div>
        <Note>
          Con props estables, el Chart con memo deja de re-renderizar. Desmarca la casilla: memo
          deja de servir porque el objeto y la función son nuevos en cada render.
        </Note>
      </Panel>

      <Panel title="¿Usarlos siempre? No">
        <ul>
          <li>Memoizar también cuesta: comparar dependencias y guardar valores.</li>
          <li>
            Úsalos cuando el cálculo es caro, o cuando el valor va a un hijo con memo o a deps de un
            efecto.
          </li>
          <li>Primero mide con el Profiler de React DevTools.</li>
        </ul>
        <Snippet>{`
useMemo(() => compute(a, b), [a, b])   // guarda un valor
useCallback((x) => handle(x, a), [a])  // guarda una función
// useCallback(fn, deps) === useMemo(() => fn, deps)
        `}</Snippet>
      </Panel>
    </>
  );
}
