import { Component, useState, type ReactNode } from "react";

/**
 * Bloques para escribir las páginas de teoría (.mdx).
 * Cada concepto sigue el mismo orden: teoría → <Example> (código + <Live>) → <SayIt>.
 */

/** Un ejemplo concreto debajo de la teoría: el código y, si aplica, la versión en vivo. */
export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="example">
      <p className="block-label">Ejemplo{title ? `: ${title}` : ""}</p>
      {children}
    </section>
  );
}

/** El ejemplo funcionando: para tocarlo, no solo leerlo. */
export function Live({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="live">
      <p className="block-label">Pruébalo{hint ? ` · ${hint}` : ""}</p>
      <LiveBoundary>{children}</LiveBoundary>
    </div>
  );
}

/** La frase en inglés para decir en la entrevista. */
export function SayIt({ children }: { children: ReactNode }) {
  return (
    <blockquote className="say-it">
      <span>Dilo en la entrevista</span>
      {children}
    </blockquote>
  );
}

/** Un error común o una trampa típica de entrevista. */
export function Pitfall({
  children,
  title = "Error común",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <aside className="callout pitfall">
      <strong>{title}</strong>
      {children}
    </aside>
  );
}

/** Un dato extra, un atajo o una buena práctica. */
export function Tip({ children, title = "Tip" }: { children: ReactNode; title?: string }) {
  return (
    <aside className="callout tip">
      <strong>{title}</strong>
      {children}
    </aside>
  );
}

/** Dos versiones lado a lado: lo que se evita y lo que se recomienda. */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare">{children}</div>;
}

export function Bad({ children }: { children: ReactNode }) {
  return (
    <div className="compare-side bad">
      <p className="block-label">✗ Evitar</p>
      {children}
    </div>
  );
}

export function Good({ children }: { children: ReactNode }) {
  return (
    <div className="compare-side good">
      <p className="block-label">✓ Mejor</p>
      {children}
    </div>
  );
}

type Log = (...values: unknown[]) => void;

function format(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Ejecuta código de JavaScript puro y muestra lo que imprime.
 * `run` recibe `log`, que funciona como console.log pero escribe en la página.
 */
export function Run({
  run,
  label = "Ejecutar",
}: {
  run: (log: Log) => void | Promise<void>;
  label?: string;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const execute = async () => {
    const output: string[] = [];
    setLines([]);
    setRunning(true);
    const log: Log = (...values) => {
      output.push(values.map(format).join(" "));
      setLines([...output]);
    };
    try {
      await run(log);
    } catch (error) {
      log(`Error: ${(error as Error).message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="live">
      <div className="row">
        <button type="button" onClick={execute} disabled={running}>
          {running ? "Ejecutando…" : `▶ ${label}`}
        </button>
        {lines.length > 0 && (
          <button type="button" onClick={() => setLines([])}>
            Limpiar
          </button>
        )}
      </div>
      <ol className="console" aria-label="salida" aria-live="polite">
        {lines.length === 0 ? (
          <li className="muted">La salida aparece aquí</li>
        ) : (
          lines.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ol>
    </div>
  );
}

class LiveBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="alert" role="alert">
        El ejemplo lanzó un error: {this.state.error.message}
        <button type="button" onClick={() => this.setState({ error: null })}>
          Reintentar
        </button>
      </div>
    );
  }
}
