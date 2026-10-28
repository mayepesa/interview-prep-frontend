import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

const box: CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--line)",
  borderRadius: 6,
  padding: "6px 10px",
};

const specificityCss = `
.cbm-spec p { color: var(--muted); }            /* (0,1,1) */
.cbm-spec .note { color: var(--accent); }        /* (0,2,0) */
#cbm-id { color: var(--good); }                  /* (1,0,0) */
.cbm-spec .tie { color: var(--bad); }            /* (0,2,0) */
.cbm-spec .tie { color: var(--good); }           /* (0,2,0), va después: gana */
`;

/** Varias reglas compiten por el mismo color: gana la de mayor especificidad. */
export function SpecificityDemo() {
  return (
    <div className="cbm-spec">
      <style>{specificityCss}</style>
      <p>p dentro de .cbm-spec → gris (0,1,1)</p>
      <p className="note">.note → acento (0,2,0)</p>
      <p className="note" id="cbm-id">
        #cbm-id → verde: un id gana a cualquier cantidad de clases
      </p>
      <p className="tie">Empate (0,2,0) → gana la última regla: verde</p>
      <p style={{ color: "var(--bad)" }}>style inline → gana a todas las reglas</p>
    </div>
  );
}

/** Mide el ancho real con content-box y border-box. */
export function BoxSizingDemo() {
  const [sizing, setSizing] = useState<"content-box" | "border-box">("content-box");
  const [padding, setPadding] = useState(16);
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);

  useLayoutEffect(() => {
    setMeasured(ref.current?.offsetWidth ?? 0);
  }, [sizing, padding]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <label>
          box-sizing{" "}
          <select value={sizing} onChange={(e) => setSizing(e.target.value as typeof sizing)}>
            <option>content-box</option>
            <option>border-box</option>
          </select>
        </label>
        <label>
          padding: {padding}px{" "}
          <input
            type="range"
            min={0}
            max={40}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
          />
        </label>
      </div>
      <div
        ref={ref}
        style={{
          boxSizing: sizing,
          width: 200,
          padding,
          border: "4px solid var(--accent)",
          background: "var(--surface-2)",
        }}
      >
        width: 200px
      </div>
      <p style={{ margin: 0 }}>
        Ancho real en pantalla: <strong>{measured}px</strong>
      </p>
    </div>
  );
}

/** Cambia position del recuadro rojo y haz scroll dentro del contenedor. */
export function PositionDemo() {
  const [position, setPosition] = useState<"static" | "relative" | "absolute" | "sticky">("static");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label>
        position{" "}
        <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)}>
          <option>static</option>
          <option>relative</option>
          <option>absolute</option>
          <option>sticky</option>
        </select>
        <code style={{ marginLeft: 8 }}>top: 10px; left: 40px;</code>
      </label>
      <div
        style={{
          position: "relative",
          height: 180,
          overflowY: "auto",
          border: "1px dashed var(--line)",
          padding: 8,
        }}
      >
        <div style={box}>Hermano 1</div>
        <div style={{ ...box, position, top: 10, left: 40, borderColor: "var(--bad)", zIndex: 1 }}>
          Yo (position: {position})
        </div>
        <div style={box}>Hermano 3</div>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} className="note" style={{ margin: "8px 0" }}>
            Contenido para hacer scroll {i + 1}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Un modal con z-index: 9999 dentro de un padre con transform queda debajo de un hermano con z-index: 2. */
export function StackingContextDemo() {
  const [transform, setTransform] = useState(true);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label className="row">
        <input
          type="checkbox"
          checked={transform}
          onChange={(e) => setTransform(e.target.checked)}
        />
        el padre tiene <code>transform: translateZ(0)</code> (crea un stacking context)
      </label>
      <div style={{ position: "relative", height: 120 }}>
        <div
          style={{
            ...box,
            transform: transform ? "translateZ(0)" : undefined,
            position: "absolute",
            inset: "0 40% 30% 0",
          }}
        >
          Padre
          <div
            style={{
              ...box,
              position: "absolute",
              top: 40,
              left: 60,
              width: 200,
              zIndex: 9999,
              background: "var(--accent)",
              color: "white",
            }}
          >
            Modal z-index: 9999
          </div>
        </div>
        <div
          style={{
            ...box,
            position: "absolute",
            top: 50,
            left: 120,
            width: 220,
            height: 60,
            zIndex: 2,
            background: "var(--bad)",
            color: "white",
          }}
        >
          Hermano z-index: 2
        </div>
      </div>
    </div>
  );
}

/** Una variable CSS controla el color de todos los hijos. */
export function CustomPropertiesDemo() {
  const [hue, setHue] = useState(220);
  return (
    <div style={{ "--brand-hue": hue, display: "grid", gap: 8 } as CSSProperties}>
      <style>{`
        .cbm-token { background: hsl(var(--brand-hue) 70% 50%); color: white; border: 0; }
        .cbm-token-outline { border: 2px solid hsl(var(--brand-hue) 70% 50%); color: hsl(var(--brand-hue) 70% 60%); background: none; }
      `}</style>
      <label>
        --brand-hue: {hue}{" "}
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
        />
      </label>
      <div className="row">
        <button type="button" className="cbm-token">
          Guardar
        </button>
        <button type="button" className="cbm-token-outline">
          Cancelar
        </button>
      </div>
    </div>
  );
}

/** rem siempre mira al root; em se multiplica en cada nivel. */
export function UnitsDemo() {
  return (
    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ fontSize: "1.2em" }}>
        <strong>em (1.2em anidado)</strong>
        <div style={{ fontSize: "1.2em" }}>
          nivel 2
          <div style={{ fontSize: "1.2em" }}>
            nivel 3<div style={{ fontSize: "1.2em" }}>nivel 4: ¡crece!</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: "1.2rem" }}>
        <strong>rem (1.2rem anidado)</strong>
        <div style={{ fontSize: "1.2rem" }}>
          nivel 2
          <div style={{ fontSize: "1.2rem" }}>
            nivel 3<div style={{ fontSize: "1.2rem" }}>nivel 4: igual</div>
          </div>
        </div>
      </div>
    </div>
  );
}
