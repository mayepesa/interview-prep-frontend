import { useState } from "react";
import type { DemoMeta } from "../app/registry";
import { Note, Panel } from "../app/ui";
import { VirtualList } from "./VirtualList";

export const meta: DemoMeta = {
  title: "Listas de miles de filas: virtualización",
  section: "performance",
  order: 700,
  questions: [
    "¿Qué problemas aparecen al mostrar listas de miles o millones de datos?",
    "¿Qué soluciones implementarías para listas muy grandes?",
    "¿Cómo optimizarías una tabla con muchas filas (como un timesheet de todo un equipo)?",
  ],
  sayIt:
    "Rendering thousands of rows creates thousands of DOM nodes, so the first render, scrolling and memory all suffer. I virtualize the list so only visible rows exist, paginate or use infinite scroll from the API, and memoize rows so one change doesn't re-render all of them.",
};

const ROWS = Array.from({ length: 100_000 }, (_, i) => ({
  id: i,
  user: `Usuario ${i % 250}`,
  project: ["Planner", "Timesheets", "Reports", "Structure"][i % 4]!,
  hours: (i % 8) + 1,
}));

export default function VirtualizedListDemo() {
  const [mode, setMode] = useState<"virtual" | "naive">("virtual");
  const naiveCount = 5_000; // con 100 000 nodos el navegador se congelaría

  return (
    <>
      <Panel title="100 000 filas">
        <div className="row">
          <button
            type="button"
            aria-pressed={mode === "virtual"}
            onClick={() => setMode("virtual")}
          >
            Virtualizada (100 000)
          </button>
          <button type="button" aria-pressed={mode === "naive"} onClick={() => setMode("naive")}>
            Sin virtualizar ({naiveCount.toLocaleString()})
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          {mode === "virtual" ? (
            <VirtualList
              items={ROWS}
              rowHeight={32}
              height={320}
              renderRow={(row) => <RowView {...row} />}
            />
          ) : (
            <div
              style={{
                height: 320,
                overflowY: "auto",
                border: "1px solid var(--line)",
                borderRadius: 8,
              }}
            >
              {ROWS.slice(0, naiveCount).map((row) => (
                <div key={row.id} style={{ height: 32 }}>
                  <RowView {...row} />
                </div>
              ))}
            </div>
          )}
        </div>
        <Note>
          Abre DevTools → Elements: la virtualizada tiene unas 20 filas en el DOM. Cambia de modo y
          nota cuánto tarda en aparecer la versión sin virtualizar.
        </Note>
      </Panel>
      <Panel title="Otras técnicas para tablas grandes">
        <ul>
          <li>Paginación o infinite scroll desde la API (no traer 100 000 filas).</li>
          <li>Filtrar y ordenar en el servidor; en el cliente, con useMemo.</li>
          <li>
            Filas con <code>memo</code> e ids estables como key.
          </li>
          <li>Debounce en los filtros de texto.</li>
          <li>
            <code>content-visibility: auto</code> en CSS para secciones largas.
          </li>
        </ul>
      </Panel>
    </>
  );
}

function RowView({ id, user, project, hours }: (typeof ROWS)[number]) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 1fr 60px",
        gap: 8,
        padding: "6px 12px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span className="note">#{id}</span>
      <span>{user}</span>
      <span>{project}</span>
      <span>{hours} h</span>
    </div>
  );
}
