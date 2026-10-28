import type { ReactNode } from "react";

/** Bloque con título para separar partes de un ejemplo. */
export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

/** Fragmento de código de solo lectura, para mostrar el patrón sin abrir el archivo. */
export function Snippet({ children, tone }: { children: string; tone?: "bad" | "good" }) {
  return (
    <pre className={`snippet ${tone ?? ""}`}>
      {tone && <span className="tone">{tone === "bad" ? "✗ Evitar" : "✓ Mejor"}</span>}
      <code>{children.trim()}</code>
    </pre>
  );
}

/** Explicación corta en español dentro del ejemplo. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>;
}

/** Cuenta los renders de un componente para ver re-renders en vivo. */
export function RenderCount({ label, count }: { label: string; count: number }) {
  return (
    <span className="render-count">
      {label}: {count} render{count === 1 ? "" : "s"}
    </span>
  );
}
