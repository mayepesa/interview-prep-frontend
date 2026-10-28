import { useEffect, useState, type CSSProperties } from "react";

const box: CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--line)",
  borderRadius: 6,
  padding: "8px 12px",
};

const frame: CSSProperties = { border: "1px dashed var(--line)", padding: 8, marginTop: 12 };

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <label>
      {label}{" "}
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/** Playground de flexbox: eje principal, eje cruzado, wrap. */
export function FlexPlayground() {
  const [direction, setDirection] = useState<"row" | "column">("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState<"nowrap" | "wrap">("nowrap");

  return (
    <div>
      <div className="row">
        <Select
          label="flex-direction"
          value={direction}
          options={["row", "column"]}
          onChange={setDirection}
        />
        <Select
          label="justify-content"
          value={justify}
          options={[
            "flex-start",
            "center",
            "flex-end",
            "space-between",
            "space-around",
            "space-evenly",
          ]}
          onChange={setJustify}
        />
        <Select
          label="align-items"
          value={align}
          options={["stretch", "flex-start", "center", "flex-end", "baseline"]}
          onChange={setAlign}
        />
        <Select label="flex-wrap" value={wrap} options={["nowrap", "wrap"]} onChange={setWrap} />
      </div>
      <div
        style={{
          ...frame,
          display: "flex",
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap,
          gap: 8,
          height: direction === "row" ? 140 : 260,
        }}
      >
        {["Lun", "Mar", "Mié", "Jue", "Vie"].map((d, i) => (
          <div
            key={d}
            style={{
              ...box,
              width: wrap === "wrap" ? 140 : undefined,
              paddingBlock: i === 1 ? 20 : 8,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <pre className="snippet">
        <code>{`display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: 8px;`}</code>
      </pre>
    </div>
  );
}

/** flex-grow, flex-shrink y flex-basis en tres elementos. */
export function FlexGrowDemo() {
  const [grow, setGrow] = useState(1);
  const [width, setWidth] = useState(100);
  return (
    <div>
      <div className="row">
        <label>
          flex-grow del medio: {grow}{" "}
          <input
            type="range"
            min={0}
            max={4}
            value={grow}
            onChange={(e) => setGrow(Number(e.target.value))}
          />
        </label>
        <label>
          ancho del contenedor: {width}%{" "}
          <input
            type="range"
            min={30}
            max={100}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
      </div>
      <div style={{ ...frame, display: "flex", gap: 8, width: `${width}%` }}>
        <div style={{ ...box, flex: "0 0 120px" }}>0 0 120px (fijo)</div>
        <div
          style={{
            ...box,
            flex: `${grow} 1 0`,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {grow} 1 0 (crece)
        </div>
        <div style={{ ...box, flex: "1 1 120px" }}>1 1 120px</div>
      </div>
    </div>
  );
}

/** Centrar en las dos direcciones. */
export function CenterDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: 100,
          border: "1px dashed var(--line)",
        }}
      >
        <div style={box}>grid + place-items</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
          border: "1px dashed var(--line)",
        }}
      >
        <div style={box}>flex + justify/align</div>
      </div>
    </div>
  );
}

/** Grid responsive sin media queries. */
export function AutoFillGrid() {
  const [min, setMin] = useState(160);
  const [mode, setMode] = useState<"auto-fill" | "auto-fit">("auto-fill");
  const [count, setCount] = useState(3);
  return (
    <div>
      <div className="row">
        <label>
          mínimo: {min}px{" "}
          <input
            type="range"
            min={80}
            max={300}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
        </label>
        <Select label="modo" value={mode} options={["auto-fill", "auto-fit"]} onChange={setMode} />
        <label>
          tarjetas: {count}{" "}
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
      </div>
      <div
        style={{
          ...frame,
          display: "grid",
          gridTemplateColumns: `repeat(${mode}, minmax(${min}px, 1fr))`,
          gap: 8,
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={box}>
            Proyecto {i + 1}
          </div>
        ))}
      </div>
      <pre className="snippet">
        <code>{`grid-template-columns: repeat(${mode}, minmax(${min}px, 1fr));`}</code>
      </pre>
    </div>
  );
}

/** Layout de página con grid-template-areas. */
export function GridAreas() {
  const [narrow, setNarrow] = useState(false);
  return (
    <div>
      <label className="row">
        <input type="checkbox" checked={narrow} onChange={(e) => setNarrow(e.target.checked)} />
        simular móvil (otras áreas, mismo HTML)
      </label>
      <div
        style={{
          ...frame,
          display: "grid",
          gap: 6,
          gridTemplateAreas: narrow
            ? `"header" "main" "sidebar" "footer"`
            : `"header header" "sidebar main" "footer footer"`,
          gridTemplateColumns: narrow ? "1fr" : "140px 1fr",
        }}
      >
        <div style={{ ...box, gridArea: "header" }}>header</div>
        <div style={{ ...box, gridArea: "sidebar" }}>sidebar</div>
        <div style={{ ...box, gridArea: "main", minHeight: 80 }}>main</div>
        <div style={{ ...box, gridArea: "footer" }}>footer</div>
      </div>
    </div>
  );
}

/** Muestra qué media queries se cumplen ahora mismo. */
export function MediaQueryStatus() {
  const queries = [
    "(min-width: 640px)",
    "(min-width: 1024px)",
    "(prefers-color-scheme: dark)",
    "(prefers-reduced-motion: reduce)",
    "(hover: hover)",
  ];
  const read = () => Object.fromEntries(queries.map((q) => [q, window.matchMedia(q).matches]));
  const [matches, setMatches] = useState(read);

  useEffect(() => {
    const lists = queries.map((q) => window.matchMedia(q));
    const update = () => setMatches(read());
    lists.forEach((l) => l.addEventListener("change", update));
    return () => lists.forEach((l) => l.removeEventListener("change", update));
  }, []);

  return (
    <ul style={{ margin: 0 }}>
      {queries.map((q) => (
        <li key={q}>
          <code>{q}</code> → {matches[q] ? "✓ se cumple" : "✗ no"}
        </li>
      ))}
    </ul>
  );
}

const containerCss = `
.fgr-wrapper { container-type: inline-size; resize: horizontal; overflow: auto; border: 1px dashed var(--line); padding: 8px; width: 100%; max-width: 100%; min-width: 180px; }
.fgr-card { display: grid; gap: 8px; }
.fgr-card .fgr-thumb { background: var(--accent); border-radius: 6px; height: 60px; }
@container (min-width: 400px) {
  .fgr-card { grid-template-columns: 120px 1fr; align-items: center; }
}
`;

/** Una tarjeta que cambia según el ancho de su contenedor, no del viewport. */
export function ContainerQueryDemo() {
  return (
    <div>
      <style>{containerCss}</style>
      <div className="fgr-wrapper">
        <div className="fgr-card">
          <div className="fgr-thumb" />
          <div>
            <strong>Planner</strong>
            <p className="note" style={{ margin: 0 }}>
              Arrastra la esquina inferior derecha del recuadro para achicarlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
