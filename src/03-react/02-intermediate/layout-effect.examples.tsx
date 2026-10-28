import { useEffect, useInsertionEffect, useLayoutEffect, useRef, useState } from "react";

/* ---------- Orden de ejecución ---------- */

function Probe({ onDone }: { onDone: (lines: string[]) => void }) {
  const lines = useRef<string[]>([]);
  if (lines.current.length === 0) lines.current.push("1. render (se calcula el JSX)");

  useInsertionEffect(() => {
    lines.current.push("2. useInsertionEffect (antes de los layout effects)");
  }, []);

  useLayoutEffect(() => {
    lines.current.push("3. useLayoutEffect (DOM listo, aún sin pintar)");
  }, []);

  useEffect(() => {
    lines.current.push("4. useEffect (después de pintar)");
    onDone([...lines.current]);
  }, [onDone]);

  return null;
}

export function EffectOrder() {
  const [run, setRun] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  return (
    <div>
      <button type="button" onClick={() => setRun((r) => r + 1)}>
        Montar un componente
      </button>
      {run > 0 && <Probe key={run} onDone={setLines} />}
      <ol className="console">
        {lines.length === 0 ? (
          <li className="muted">El orden aparece aquí</li>
        ) : (
          lines.map((l) => <li key={l}>{l}</li>)
        )}
      </ol>
    </div>
  );
}

/* ---------- Tooltip medido ---------- */

// Bloqueo artificial para que el "salto" se vea en una computadora rápida.
function slowMeasure(el: HTMLDivElement | null): number {
  const height = el?.getBoundingClientRect().height ?? 0;
  const end = performance.now() + 150;
  while (performance.now() < end) {
    /* espera activa */
  }
  return -height - 6;
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
  useEffect(() => setTop(slowMeasure(ref.current)), []); // después del paint: se ve el salto
  return (
    <div ref={ref} role="tooltip" style={{ ...tooltipStyle, top }}>
      Medido con useEffect
    </div>
  );
}

function TooltipWithLayoutEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useLayoutEffect(() => setTop(slowMeasure(ref.current)), []); // antes del paint: sin salto
  return (
    <div ref={ref} role="tooltip" style={{ ...tooltipStyle, top }}>
      Medido con useLayoutEffect
    </div>
  );
}

export function TooltipDemo({ layout }: { layout: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", marginTop: 40 }}>
      {open && (layout ? <TooltipWithLayoutEffect /> : <TooltipWithEffect />)}
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {open ? "Ocultar" : "Mostrar"} tooltip
      </button>
    </div>
  );
}
