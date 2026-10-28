import { lazy, Suspense, useState } from "react";
import { wait } from "../../app/fakeApi";

// Export por defecto: lazy lo espera así. El wait() es artificial, para ver el fallback.
const HeavyReport = lazy(async () => {
  await wait(1000);
  return import("./lazy/HeavyReport");
});

// Export nombrado: se adapta devolviendo { default: ... }.
const NamedReport = lazy(async () => {
  await wait(1000);
  return import("./lazy/HeavyReport").then((m) => ({ default: m.HeavyReport }));
});

/** Carga el componente la primera vez que se muestra. */
export function LazyReportDemo() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setShow((s) => !s)}>
        {show ? "Cerrar" : "Abrir"} reporte
      </button>
      {show && (
        <Suspense fallback={<p>Cargando reporte…</p>}>
          <HeavyReport />
        </Suspense>
      )}
    </div>
  );
}

export function NamedLazyDemo() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setShow((s) => !s)}>
        {show ? "Cerrar" : "Abrir"} (export nombrado)
      </button>
      {show && (
        <Suspense fallback={<p>Cargando…</p>}>
          <NamedReport />
        </Suspense>
      )}
    </div>
  );
}

/** Un import dinámico "a mano", sin React: devuelve una promesa del módulo. */
export async function loadReportModule(): Promise<string[]> {
  const mod = await import("./lazy/HeavyReport");
  return Object.keys(mod);
}
