import { useState, type CSSProperties } from "react";
import type { DemoMeta } from "../app/registry";
import { Note, Panel, Snippet } from "../app/ui";

export const meta: DemoMeta = {
  title: "Flexbox y Grid: playground",
  section: "css-html",
  order: 610,
  questions: [
    "¿Flexbox o Grid? ¿Cuándo usar cada uno?",
    "¿Cómo centrar un elemento vertical y horizontalmente?",
    "¿Cómo harías un layout de dashboard responsive sin media queries?",
    "¿Qué son las container queries?",
  ],
  sayIt:
    "Flexbox is one-dimensional, great for a row of buttons or a toolbar. Grid is two-dimensional, for page layouts and calendars. For a responsive card grid I use repeat(auto-fill, minmax(200px, 1fr)), which needs no media queries.",
};

const box: CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--line)",
  borderRadius: 6,
  padding: "8px 12px",
};

export default function LayoutPlayground() {
  const [justify, setJustify] = useState<CSSProperties["justifyContent"]>("flex-start");
  const [align, setAlign] = useState<CSSProperties["alignItems"]>("stretch");
  const [direction, setDirection] = useState<CSSProperties["flexDirection"]>("row");
  const [min, setMin] = useState(160);

  return (
    <>
      <Panel title="Flexbox (una dimensión)">
        <div className="row">
          <label>
            justify-content{" "}
            <select value={String(justify)} onChange={(e) => setJustify(e.target.value)}>
              {[
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            align-items{" "}
            <select value={String(align)} onChange={(e) => setAlign(e.target.value)}>
              {["stretch", "flex-start", "center", "flex-end", "baseline"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            flex-direction{" "}
            <select
              value={String(direction)}
              onChange={(e) => setDirection(e.target.value as CSSProperties["flexDirection"])}
            >
              {["row", "column"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: justify,
            alignItems: align,
            flexDirection: direction,
            gap: 8,
            height: 140,
            marginTop: 12,
            border: "1px dashed var(--line)",
            padding: 8,
          }}
        >
          <div style={box}>Lun</div>
          <div style={{ ...box, paddingBlock: 20 }}>Mar</div>
          <div style={box}>Mié</div>
        </div>
        <Snippet>{`display: flex; justify-content: ${justify}; align-items: ${align}; flex-direction: ${direction}; gap: 8px;`}</Snippet>
      </Panel>

      <Panel title="Centrar (la pregunta clásica)">
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: 80,
            border: "1px dashed var(--line)",
          }}
        >
          <div style={box}>Centrado</div>
        </div>
        <Snippet>{`display: grid; place-items: center;   /* o: display:flex; justify-content:center; align-items:center */`}</Snippet>
      </Panel>

      <Panel title="Grid responsive sin media queries">
        <label>
          minmax mínimo: {min}px{" "}
          <input
            type="range"
            min={100}
            max={300}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
            gap: 8,
            marginTop: 12,
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={box}>
              Proyecto {i + 1}
            </div>
          ))}
        </div>
        <Snippet>{`grid-template-columns: repeat(auto-fill, minmax(${min}px, 1fr));`}</Snippet>
      </Panel>

      <Panel title="Grid con áreas (layout de página)">
        <div
          style={{
            display: "grid",
            gridTemplateAreas: `"header header" "sidebar main" "footer footer"`,
            gridTemplateColumns: "120px 1fr",
            gap: 6,
          }}
        >
          <div style={{ ...box, gridArea: "header" }}>header</div>
          <div style={{ ...box, gridArea: "sidebar" }}>sidebar</div>
          <div style={{ ...box, gridArea: "main", minHeight: 80 }}>main</div>
          <div style={{ ...box, gridArea: "footer" }}>footer</div>
        </div>
      </Panel>

      <Panel title="Container queries">
        <Snippet>{`
.card-wrapper { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}
        `}</Snippet>
        <Note>
          Las media queries miran el viewport; las container queries miran el ancho del contenedor.
          Son ideales para componentes reutilizables que viven en sidebars o en columnas anchas.
        </Note>
      </Panel>
    </>
  );
}
