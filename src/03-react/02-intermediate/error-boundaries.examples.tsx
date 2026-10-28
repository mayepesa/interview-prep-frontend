import { Component, useState, type ErrorInfo, type ReactNode } from "react";

type Props = {
  fallback: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
};

/** Error boundary mínimo. Todavía no hay hook para esto: se escribe como clase. */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error }; // render phase: decide mostrar el fallback
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info); // commit phase: reportar (Sentry, logs)
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error
      ? this.props.fallback(this.state.error, this.reset)
      : this.props.children;
  }
}

const fallback = (error: Error, reset: () => void) => (
  <div className="alert" role="alert">
    {error.message}{" "}
    <button type="button" onClick={reset}>
      Reintentar
    </button>
  </div>
);

function BuggyWidget({ name }: { name: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error(`${name} falló al renderizar`);
  return (
    <div className="row">
      {name} funcionando
      <button type="button" onClick={() => setBroken(true)}>
        Romper
      </button>
    </div>
  );
}

/** Un boundary por widget: si uno se rompe, el otro sigue. */
export function TwoWidgets() {
  const [reports, setReports] = useState<string[]>([]);
  const onError = (error: Error) =>
    setReports((r) => [...r.slice(-3), `reportado: ${error.message}`]);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <ErrorBoundary fallback={fallback} onError={onError}>
        <BuggyWidget name="Gráfica de horas" />
      </ErrorBoundary>
      <ErrorBoundary fallback={fallback} onError={onError}>
        <BuggyWidget name="Lista de proyectos" />
      </ErrorBoundary>
      <ol className="console">
        {reports.length === 0 ? (
          <li className="muted">Aquí aparece lo que se enviaría a Sentry</li>
        ) : (
          reports.map((r, i) => <li key={i}>{r}</li>)
        )}
      </ol>
    </div>
  );
}

/** Errores en handlers y en código async: el boundary no se entera. */
export function NotCaught() {
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((l) => [...l.slice(-3), line]);

  const onClick = () => {
    try {
      throw new Error("error en un event handler");
    } catch (error) {
      add(`${(error as Error).message} → capturado con try/catch`);
    }
  };

  const onAsync = () => {
    Promise.reject(new Error("error en una promesa")).catch((error: Error) =>
      add(`${error.message} → capturado con .catch()`),
    );
  };

  return (
    <ErrorBoundary fallback={fallback}>
      <div style={{ display: "grid", gap: 8 }}>
        <div className="row">
          <button type="button" onClick={onClick}>
            Error en evento
          </button>
          <button type="button" onClick={onAsync}>
            Error async
          </button>
        </div>
        <ol className="console">
          {log.length === 0 ? (
            <li className="muted">El boundary no ve estos errores</li>
          ) : (
            log.map((l, i) => <li key={i}>{l}</li>)
          )}
        </ol>
      </div>
    </ErrorBoundary>
  );
}

/** Llevar un error async al boundary: lanzarlo dentro de un setState. */
function SaveButton() {
  const [, setState] = useState(0);
  const save = async () => {
    try {
      await Promise.reject(new Error("La API respondió 500"));
    } catch (error) {
      // El updater corre durante el render: ahí el boundary SÍ lo ve.
      setState(() => {
        throw error;
      });
    }
  };
  return (
    <button type="button" onClick={save}>
      Guardar (falla)
    </button>
  );
}

export function AsyncToBoundary() {
  return (
    <ErrorBoundary fallback={fallback}>
      <SaveButton />
    </ErrorBoundary>
  );
}
