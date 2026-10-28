import type { DemoMeta } from "../app/registry";
import { Note, Panel, Snippet } from "../app/ui";

export const meta: DemoMeta = {
  title: "Cascada, especificidad, box model y posicionamiento",
  section: "css-html",
  order: 630,
  questions: [
    "¿Qué es la especificidad en CSS?",
    "¿Qué es el box model? ¿Qué hace box-sizing: border-box?",
    "¿Diferencias entre position relative, absolute, fixed y sticky?",
    "¿Qué crea un stacking context y por qué falla un z-index?",
    "¿Qué son las CSS custom properties (variables)?",
    "¿Qué son las cascade layers (@layer)?",
  ],
  sayIt:
    "Specificity decides which rule wins: inline styles beat ids, ids beat classes, classes beat elements; on a tie, the last rule wins. I keep specificity flat with single classes, and use custom properties as design tokens so theming is just changing variables.",
};

const css = `
.spec-demo p { color: var(--muted); }           /* (0,1,1) */
.spec-demo .note-a { color: var(--accent); }     /* (0,2,0) gana */
#spec-id { color: var(--good); }                  /* (1,0,0) gana a las clases */
.spec-demo .tie { color: var(--bad); }
.spec-demo .tie { color: var(--good); }           /* empate: gana la última */
.box-content { box-sizing: content-box; width: 160px; padding: 16px; border: 4px solid var(--accent); }
.box-border  { box-sizing: border-box;  width: 160px; padding: 16px; border: 4px solid var(--good); }
`;

export default function CascadeSpecificity() {
  return (
    <>
      <style>{css}</style>
      <Panel title="Especificidad">
        <div className="spec-demo">
          <p>Elemento dentro de .spec-demo → gris</p>
          <p className="note-a">Dos clases → acento</p>
          <p className="note-a" id="spec-id">
            Id → verde (gana a las clases)
          </p>
          <p className="tie">Misma especificidad → gana la última regla (verde)</p>
          <p style={{ color: "var(--bad)" }}>Inline → gana a todo salvo !important</p>
        </div>
        <Snippet>{css.trim().split("\n").slice(0, 5).join("\n")}</Snippet>
      </Panel>

      <Panel title="Box model">
        <div style={{ display: "grid", gap: 8 }}>
          <div className="box-content">content-box: mide 160 + 32 + 8 = 200px</div>
          <div className="box-border">border-box: mide 160px exactos</div>
        </div>
        <Note>
          Por eso casi todos los proyectos empiezan con{" "}
          <code>* {"{ box-sizing: border-box }"}</code>.
        </Note>
      </Panel>

      <Panel title="Posicionamiento y stacking context">
        <ul>
          <li>
            <b>relative</b>: se mueve respecto a su posición normal y sirve de referencia para hijos
            absolute.
          </li>
          <li>
            <b>absolute</b>: sale del flujo; se ubica respecto al ancestro posicionado más cercano.
          </li>
          <li>
            <b>fixed</b>: respecto al viewport (ojo: un ancestro con transform lo rompe).
          </li>
          <li>
            <b>sticky</b>: normal hasta cruzar un umbral (top: 0), luego se pega dentro de su
            contenedor.
          </li>
        </ul>
        <Note>
          z-index solo compara elementos dentro del mismo stacking context. transform, opacity &lt;
          1, filter o position + z-index crean uno nuevo; por eso un modal con z-index: 9999 puede
          quedar debajo. Solución típica: renderizarlo en un portal.
        </Note>
      </Panel>

      <Panel title="Variables y capas">
        <Snippet>{`
:root { --accent: #3558d8; }
[data-theme="dark"] { --accent: #7b9cff; }
.button { background: var(--accent); }

@layer reset, components, utilities;  /* el orden de las capas decide, no la especificidad */
        `}</Snippet>
      </Panel>
    </>
  );
}
