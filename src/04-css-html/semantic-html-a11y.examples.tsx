import { useId, useRef, useState, type KeyboardEvent } from "react";

/** Un div con onClick frente a un button: prueba los dos solo con el teclado. */
export function DivVsButton() {
  const [divCount, setDivCount] = useState(0);
  const [buttonCount, setButtonCount] = useState(0);
  return (
    <div className="row">
      <div
        onClick={() => setDivCount((c) => c + 1)}
        style={{
          border: "1px solid var(--line)",
          padding: "4px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        div onClick ({divCount})
      </div>
      <button type="button" onClick={() => setButtonCount((c) => c + 1)}>
        button ({buttonCount})
      </button>
    </div>
  );
}

/** Formulario con label, error conectado por aria-describedby y anunciado con role="alert". */
export function AccessibleForm() {
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

/** Tabs con el patrón WAI-ARIA: flechas mueven el foco (roving tabindex), Home/End van a los extremos. */
export function KeyboardTabs() {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent) => {
    const last = TABS.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = keys[e.key];
    if (next === undefined) return;
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
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            style={i === active ? { borderColor: "var(--accent)" } : undefined}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        style={{ paddingTop: 8 }}
      >
        Vista por {TABS[active]?.toLowerCase()}
      </div>
    </div>
  );
}

/** Contraste WCAG entre dos colores. */
function luminance(hex: string) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#999999");
  const [bg, setBg] = useState("#ffffff");
  const ratio = contrastRatio(fg, bg);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <label>
          Texto <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
        </label>
        <label>
          Fondo <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
        </label>
      </div>
      <p style={{ color: fg, background: bg, padding: 12, borderRadius: 6, margin: 0 }}>
        Registraste 7.5 horas esta semana
      </p>
      <p style={{ margin: 0 }}>
        Contraste <strong>{ratio.toFixed(2)}:1</strong> · texto normal{" "}
        {ratio >= 4.5 ? "✓ AA" : "✗ no pasa AA"} · texto grande{" "}
        {ratio >= 3 ? "✓ AA" : "✗ no pasa AA"}
      </p>
    </div>
  );
}
