import { useState } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import type { DemoMeta } from "../app/registry";
import { Note, Panel, Snippet } from "../app/ui";
import styles from "./styling-approaches.module.css";

export const meta: DemoMeta = {
  title: "Formas de dar estilos: className, inline, CSS Modules, styled-components",
  section: "css-html",
  order: 600,
  questions: [
    "¿Cómo aplicar clases CSS a un componente y por qué no se puede usar class?",
    "¿Cómo aplicar estilos en línea?",
    "¿Cómo aplicar estilos de forma condicional?",
    "CSS-in-JS vs CSS Modules vs utility classes (Tailwind): ¿cuándo usar cada uno?",
  ],
  sayIt:
    "I've used styled-components for component libraries, because theming and props-based variants are easy, and Tailwind for product work, because it's fast and keeps styles consistent. CSS Modules are a good middle ground with zero runtime. Whatever the tool, I want design tokens as the single source of truth.",
};

// styled-components: estilos dentro del componente, con variantes por props y tema.
const theme = { radius: "8px", accent: "var(--accent)", danger: "var(--bad)" };

const Button = styled.button<{ $variant?: "primary" | "danger" }>`
  border-radius: ${(p) => p.theme.radius};
  padding: 6px 14px;
  ${(p) =>
    p.$variant === "primary" &&
    css`
      background: ${p.theme.accent};
      color: white;
      border-color: transparent;
    `}
  ${(p) =>
    p.$variant === "danger" &&
    css`
      color: ${p.theme.danger};
      border-color: ${p.theme.danger};
    `}
`;

export default function StylingApproaches() {
  const [active, setActive] = useState(false);

  return (
    <>
      <Panel title="className (no class) y clases condicionales">
        <div className={active ? `${styles.card} ${styles.active}` : styles.card}>
          Tarjeta con CSS Modules
        </div>
        <button type="button" onClick={() => setActive((a) => !a)} style={{ marginTop: 8 }}>
          Activar / desactivar
        </button>
        <Note>
          JSX usa <code>className</code> porque <code>class</code> es palabra reservada en
          JavaScript (igual que <code>htmlFor</code> en vez de <code>for</code>). Para muchas clases
          condicionales se usa la librería <code>clsx</code>.
        </Note>
        <Snippet>{`className={clsx(styles.card, active && styles.active)}`}</Snippet>
      </Panel>

      <Panel title="Estilos en línea">
        <div
          style={{
            padding: 8,
            borderRadius: 6,
            background: active ? "var(--surface-2)" : "transparent",
          }}
        >
          Objeto con propiedades en camelCase: <code>{"style={{ backgroundColor: 'red' }}"}</code>
        </div>
        <Note>
          Útiles para valores dinámicos (una posición, un ancho calculado). No admiten :hover ni
          media queries, y llenan el HTML.
        </Note>
      </Panel>

      <Panel title="styled-components con tema y variantes">
        <ThemeProvider theme={theme}>
          <div className="row">
            <Button type="button">Default</Button>
            <Button type="button" $variant="primary">
              Primary
            </Button>
            <Button type="button" $variant="danger">
              Danger
            </Button>
          </div>
        </ThemeProvider>
        <Note>
          El prefijo <code>$</code> (transient prop) evita que <code>variant</code> llegue al DOM
          como atributo. Costo: runtime en el navegador y más difícil con Server Components.
        </Note>
      </Panel>

      <Panel title="Comparación rápida">
        <table>
          <thead>
            <tr>
              <th align="left">Enfoque</th>
              <th align="left">A favor</th>
              <th align="left">En contra</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSS Modules</td>
              <td>Sin runtime, CSS normal, sin choques</td>
              <td>Variantes más verbosas</td>
            </tr>
            <tr>
              <td>styled-components</td>
              <td>Tema y variantes por props</td>
              <td>Runtime, peso extra, SSR más complejo</td>
            </tr>
            <tr>
              <td>Tailwind</td>
              <td>Rápido, consistente, sin nombres de clases</td>
              <td>Clases largas en el JSX</td>
            </tr>
            <tr>
              <td>Inline</td>
              <td>Valores dinámicos</td>
              <td>Sin pseudo-clases ni media queries</td>
            </tr>
          </tbody>
        </table>
      </Panel>
    </>
  );
}
