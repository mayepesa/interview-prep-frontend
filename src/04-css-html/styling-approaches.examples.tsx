import { useState } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import styles from "./styling-approaches.module.css";

/** Mini clsx: une las clases que no sean falsy. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** CSS Modules + clase condicional. */
export function CssModuleCard() {
  const [active, setActive] = useState(false);
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <div className={cx(styles.card, active && styles.active)}>
        Tarjeta con CSS Modules
        <br />
        <code className="note">className="{cx(styles.card, active && styles.active)}"</code>
      </div>
      <button type="button" onClick={() => setActive((a) => !a)}>
        {active ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}

/** Inline style para un valor calculado en tiempo de ejecución. */
export function InlineProgress() {
  const [hours, setHours] = useState(28);
  const percent = Math.min(100, (hours / 40) * 100);
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <label>
        Horas esta semana: {hours} / 40{" "}
        <input
          type="range"
          min={0}
          max={50}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
      </label>
      <div
        style={{ height: 12, borderRadius: 6, background: "var(--surface-2)", overflow: "hidden" }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: hours > 40 ? "var(--bad)" : "var(--accent)",
            transition: "width 200ms",
          }}
        />
      </div>
    </div>
  );
}

// styled-components: estilos en el componente, con variantes por props y un tema tipado (ver styled.d.ts).
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

export function StyledButtons() {
  return (
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
  );
}

const animationCss = `
@keyframes sa-left { from { left: 0; } to { left: calc(100% - 40px); } }
@keyframes sa-transform { from { transform: translateX(0); } to { transform: translateX(calc(var(--track) - 40px)); } }
.sa-track { position: relative; height: 40px; background: var(--surface-2); border-radius: 6px; --track: 300px; width: 300px; max-width: 100%; }
.sa-ball { position: absolute; top: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--accent); }
.sa-run .sa-left { animation: sa-left 1s ease-in-out infinite alternate; }
.sa-run .sa-transform { animation: sa-transform 1s ease-in-out infinite alternate; will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .sa-run .sa-left, .sa-run .sa-transform { animation: none; }
}
`;

/** Dos animaciones que se ven iguales: una mueve `left` (layout) y la otra `transform` (compositor). */
export function AnimationDemo() {
  const [running, setRunning] = useState(false);
  return (
    <div className={running ? "sa-run" : undefined} style={{ display: "grid", gap: 8 }}>
      <style>{animationCss}</style>
      <button type="button" onClick={() => setRunning((r) => !r)} style={{ justifySelf: "start" }}>
        {running ? "Detener" : "Animar"}
      </button>
      <span className="note">left (recalcula layout en cada frame)</span>
      <div className="sa-track">
        <div className="sa-ball sa-left" />
      </div>
      <span className="note">transform (solo compositor)</span>
      <div className="sa-track">
        <div className="sa-ball sa-transform" />
      </div>
    </div>
  );
}
