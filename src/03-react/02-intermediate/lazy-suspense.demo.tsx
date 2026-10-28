import { lazy, Suspense, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { wait } from "../../app/fakeApi";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "React.lazy, import dinámico y Suspense",
  section: "react-intermediate",
  order: 260,
  questions: [
    "¿Cómo importar de forma dinámica un componente?",
    "¿Cuándo y por qué es recomendable importar componentes de forma dinámica?",
    "¿Solo se pueden cargar de forma dinámica componentes exportados por defecto?",
    "¿Qué es Suspense y para qué se usa?",
    "¿Qué es React.lazy y cómo se combina con Suspense?",
  ],
  sayIt:
    "React.lazy plus a dynamic import splits a component into its own chunk, so the initial bundle is smaller. Suspense shows a fallback while it loads. I use it for routes, modals and heavy charts that aren't visible on first paint.",
};

// Export por defecto: lazy lo espera así.
const HeavyReport = lazy(async () => {
  await wait(800); // retraso artificial para ver el fallback
  return import("./lazy/HeavyReport");
});

// Export nombrado: se adapta devolviendo { default: ... }
const NamedReport = lazy(() =>
  import("./lazy/HeavyReport").then((m) => ({ default: m.HeavyReport })),
);

export default function LazySuspenseDemo() {
  const [show, setShow] = useState(false);
  const [showNamed, setShowNamed] = useState(false);

  return (
    <>
      <Panel title="Cargar al hacer clic">
        <button type="button" onClick={() => setShow(true)} disabled={show}>
          Abrir reporte
        </button>
        {show && (
          <Suspense fallback={<p>Cargando reporte…</p>}>
            <HeavyReport />
          </Suspense>
        )}
      </Panel>
      <Panel title="Con un export nombrado">
        <button type="button" onClick={() => setShowNamed(true)} disabled={showNamed}>
          Abrir (export nombrado)
        </button>
        {showNamed && (
          <Suspense fallback={<p>Cargando…</p>}>
            <NamedReport />
          </Suspense>
        )}
        <Snippet>{`lazy(() => import("./Report").then((m) => ({ default: m.Report })))`}</Snippet>
        <Note>
          Cuándo sí: rutas, modales, editores y gráficas pesadas. Cuándo no: lo que se ve en el
          primer render, porque añade una petición extra.
        </Note>
      </Panel>
    </>
  );
}
