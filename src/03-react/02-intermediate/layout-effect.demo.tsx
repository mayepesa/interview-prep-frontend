import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "useEffect vs useLayoutEffect",
  section: "react-intermediate",
  order: 290,
  questions: [
    "¿Qué diferencia hay entre useEffect y useLayoutEffect?",
    "¿Qué hace el hook useLayoutEffect?",
    "¿Para qué sirve useInsertionEffect?",
  ],
  sayIt:
    "useEffect runs after the browser paints; useLayoutEffect runs after the DOM updates but before paint. I only use the layout version when I need to measure the DOM and adjust before the user sees it, like positioning a tooltip, because it blocks painting.",
};

// Medimos el tooltip y lo subimos sobre el botón.
function measure(el: HTMLDivElement | null, setTop: (n: number) => void) {
  const height = el?.getBoundingClientRect().height ?? 0;
  // Bloqueo artificial de 120 ms para que el salto sea visible.
  const end = performance.now() + 120;
  while (performance.now() < end) {
    /* espera activa */
  }
  setTop(-height - 6);
}

const tooltipStyle = {
  position: "absolute",
  left: 0,
  background: "var(--accent)",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  whiteSpace: "nowrap",
} as const;

// Dos componentes separados: elegir el hook con un if rompería las reglas de los hooks.
function TooltipWithEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useEffect(() => measure(ref.current, setTop), []); // después del paint: se ve el salto
  return (
    <div ref={ref} role="tooltip" style={{ ...tooltipStyle, top }}>
      Medido con useEffect
    </div>
  );
}

function TooltipWithLayoutEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useLayoutEffect(() => measure(ref.current, setTop), []); // antes del paint: sin salto
  return (
    <div ref={ref} role="tooltip" style={{ ...tooltipStyle, top }}>
      Medido con useLayoutEffect
    </div>
  );
}

function Demo({ useLayout }: { useLayout: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", marginTop: 40 }}>
      {open && (useLayout ? <TooltipWithLayoutEffect /> : <TooltipWithEffect />)}
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {open ? "Ocultar" : "Mostrar"} tooltip
      </button>
    </div>
  );
}

export default function LayoutEffectDemo() {
  return (
    <>
      <Panel title="Con useEffect (puede verse un salto)">
        <Demo useLayout={false} />
      </Panel>
      <Panel title="Con useLayoutEffect (sin salto)">
        <Demo useLayout />
        <Note>
          useInsertionEffect corre aún antes y es para librerías de CSS-in-JS (como
          styled-components) que insertan estilos.
        </Note>
      </Panel>
    </>
  );
}
