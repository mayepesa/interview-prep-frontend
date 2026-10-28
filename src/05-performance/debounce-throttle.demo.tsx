import { useEffect, useMemo, useState } from "react";
import type { DemoMeta } from "../app/registry";
import { debounce, throttle } from "../01-javascript/debounce-throttle";
import { Note, Panel } from "../app/ui";

export const meta: DemoMeta = {
  title: "Debounce vs throttle en vivo",
  section: "performance",
  order: 710,
  questions: [
    "¿Qué diferencia hay entre debounce y throttle?",
    "¿Cómo evitarías hacer una petición por cada tecla?",
    "¿Cómo optimizarías un handler de scroll o mousemove?",
  ],
  sayIt:
    "Debounce waits until events stop, then runs once: perfect for a search box. Throttle runs at most once per interval while events keep coming: right for scroll or mousemove. I've used debounce in search and filter inputs to avoid a request per keystroke.",
};

export default function DebounceThrottleDemo() {
  const [counts, setCounts] = useState({ raw: 0, debounced: 0, throttled: 0 });

  const handlers = useMemo(
    () => ({
      debounced: debounce(() => setCounts((c) => ({ ...c, debounced: c.debounced + 1 })), 300),
      throttled: throttle(() => setCounts((c) => ({ ...c, throttled: c.throttled + 1 })), 300),
    }),
    [],
  );

  useEffect(() => () => handlers.debounced.cancel(), [handlers]);

  const onMove = () => {
    setCounts((c) => ({ ...c, raw: c.raw + 1 }));
    handlers.debounced();
    handlers.throttled();
  };

  return (
    <>
      <Panel title="Mueve el mouse sobre el recuadro">
        <div
          onMouseMove={onMove}
          style={{
            height: 140,
            border: "1px dashed var(--accent)",
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
          }}
        >
          Mueve el mouse aquí
        </div>
        <table style={{ marginTop: 12 }}>
          <tbody>
            <tr>
              <td>Eventos crudos</td>
              <td>
                <strong>{counts.raw}</strong>
              </td>
            </tr>
            <tr>
              <td>Throttle (máx. 1 cada 300 ms)</td>
              <td>
                <strong>{counts.throttled}</strong>
              </td>
            </tr>
            <tr>
              <td>Debounce (300 ms sin eventos)</td>
              <td>
                <strong>{counts.debounced}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" onClick={() => setCounts({ raw: 0, debounced: 0, throttled: 0 })}>
          Reset
        </button>
        <Note>
          Las implementaciones están en <code>src/01-javascript/debounce-throttle.ts</code>, con
          tests. En React, para un input, también sirve el hook <code>useDebouncedValue</code>.
        </Note>
      </Panel>
    </>
  );
}
