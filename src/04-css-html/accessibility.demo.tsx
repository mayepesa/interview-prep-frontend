import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { DemoMeta } from "../app/registry";
import { Note, Panel, Snippet } from "../app/ui";

export const meta: DemoMeta = {
  title: "HTML semántico y accesibilidad",
  section: "css-html",
  order: 620,
  questions: [
    "¿Por qué importa el HTML semántico?",
    "¿Qué diferencia hay entre un <div onClick> y un <button>?",
    "¿Cómo haces accesible un formulario con errores?",
    "¿Cómo implementarías navegación con teclado en un componente propio (tabs, menú)?",
    "¿Qué es ARIA y cuándo usarlo?",
  ],
  sayIt:
    "Semantic HTML gives keyboard support, focus and screen reader meaning for free. A div with onClick has none of that. I use ARIA only to fill gaps native elements don't cover, label every input, connect errors with aria-describedby, and test with the keyboard.",
};

function FakeButton() {
  const [count, setCount] = useState(0);
  return (
    <div className="row">
      <div
        onClick={() => setCount((c) => c + 1)}
        style={{
          border: "1px solid var(--line)",
          padding: "4px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        div onClick ({count})
      </div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        button ({count})
      </button>
      <span className="note">Prueba con Tab + Enter: el div no recibe foco.</span>
    </div>
  );
}

function AccessibleForm() {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "");
        const message = /^\S+@\S+\.\S+$/.test(email)
          ? null
          : "Escribe un email válido, por ejemplo ana@empresa.com";
        setError(message);
        setSent(!message);
      }}
      style={{ display: "grid", gap: 6, maxWidth: 360 }}
    >
      <label htmlFor={`${id}-email`}>Email</label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        autoComplete="email"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" style={{ color: "var(--bad)", margin: 0 }}>
          {error}
        </p>
      )}
      <button type="submit">Suscribirme</button>
      {sent && <p role="status">¡Listo!</p>}
    </form>
  );
}

const TABS = ["Día", "Semana", "Mes"];

function KeyboardTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Patrón WAI-ARIA: flechas mueven el foco; solo la tab activa está en el orden de Tab.
  const onKeyDown = (e: KeyboardEvent) => {
    const last = TABS.length - 1;
    const next =
      e.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Vista" className="row" onKeyDown={onKeyDown}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${i}`}
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        style={{ paddingTop: 8 }}
      >
        Vista por {TABS[active]?.toLowerCase()}
      </div>
    </div>
  );
}

export default function AccessibilityDemo() {
  return (
    <>
      <Panel title="div onClick vs button">
        <FakeButton />
      </Panel>
      <Panel title="Formulario con errores accesibles">
        <AccessibleForm />
        <Note>
          label conectado con htmlFor, error conectado con aria-describedby y anunciado con
          role="alert".
        </Note>
      </Panel>
      <Panel title="Tabs con teclado (flechas, Home, End)">
        <KeyboardTabs />
      </Panel>
      <Panel title="Estructura semántica">
        <Snippet tone="good">{`
<header>…</header>
<nav aria-label="Principal">…</nav>
<main>
  <h1>Timesheet</h1>
  <section aria-labelledby="week-title"><h2 id="week-title">Semana 42</h2>…</section>
</main>
<footer>…</footer>
        `}</Snippet>
        <Note>
          Primera regla de ARIA: si existe un elemento nativo con ese comportamiento, úsalo. Revisa
          con Lighthouse, axe DevTools y navegando solo con el teclado.
        </Note>
      </Panel>
    </>
  );
}
