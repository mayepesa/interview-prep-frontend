import { createElement, type ReactNode } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Componentes, JSX, props y children",
  section: "react-basics",
  order: 100,
  questions: [
    "¿Qué es React? ¿Qué significa que sea declarativo?",
    "¿Qué es un componente? ¿Cómo se crea?",
    "¿Qué es JSX y cómo se transforma?",
    "¿Cuál es la diferencia entre componente y elemento?",
    "¿Qué son las props? ¿Para qué sirve children?",
    "¿Qué es la composición y por qué React la prefiere a la herencia?",
  ],
  sayIt:
    "A component is a function that receives props and returns elements. Elements are plain objects describing the UI; React compares them and updates the DOM. I compose small components with children instead of inheriting from base classes.",
};

// Un componente es una función que recibe props y devuelve elementos.
type BadgeProps = { label: string; tone?: "info" | "success" };

function Badge({ label, tone = "info" }: BadgeProps) {
  const color = tone === "success" ? "var(--good)" : "var(--accent)";
  return (
    <span style={{ color, border: `1px solid ${color}`, borderRadius: 999, padding: "0 8px" }}>
      {label}
    </span>
  );
}

// children permite componer: Card no sabe qué va adentro.
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 12 }}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export default function ComponentsJsxProps() {
  // JSX es azúcar sintáctico: el compilador lo convierte en llamadas a jsx()/createElement.
  const withJsx = <Badge label="Con JSX" />;
  const withoutJsx = createElement(Badge, { label: "Sin JSX", tone: "success" });

  return (
    <>
      <Panel title="JSX vs createElement: el mismo resultado">
        <div className="row">
          {withJsx}
          {withoutJsx}
        </div>
        <Snippet>{`
<Badge label="Con JSX" />
// se compila a:
jsx(Badge, { label: "Con JSX" })
        `}</Snippet>
      </Panel>

      <Panel title="Componente vs elemento">
        <Note>
          <code>Badge</code> es el componente (la función). <code>{"<Badge />"}</code> es un
          elemento: un objeto que describe qué renderizar. Mira su forma real:
        </Note>
        <Snippet>{JSON.stringify({ type: "Badge", props: withJsx.props }, null, 2)}</Snippet>
      </Panel>

      <Panel title="children y composición">
        <Card title="Resumen semanal">
          <p>Card no sabe qué hay adentro: recibe cualquier contenido por children.</p>
          <Badge label="32 h registradas" tone="success" />
        </Card>
        <Note>
          Declarativo = describes <em>qué</em> quieres ver según el estado, no <em>cómo</em> cambiar
          el DOM paso a paso. React se encarga de las operaciones.
        </Note>
      </Panel>
    </>
  );
}
