import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Error Boundaries",
  section: "react-intermediate",
  order: 250,
  questions: [
    "¿Qué son los Error Boundaries?",
    "¿Qué errores NO captura un Error Boundary?",
    "¿Por qué siguen siendo componentes de clase?",
  ],
  sayIt:
    "An error boundary catches errors thrown while rendering its children and shows a fallback instead of unmounting the whole app. It doesn't catch errors in event handlers or async code, so I handle those with try/catch. I place them around independent widgets and report the error to Sentry in componentDidCatch.",
};

type Props = { fallback: (error: Error, reset: () => void) => ReactNode; children: ReactNode };

// Todavía no hay hook para esto: se escribe como clase (o se usa react-error-boundary).
class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error }; // actualiza el estado para mostrar el fallback
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Aquí iría Sentry.captureException(error, { extra: info })
    console.info("Reportado a monitoreo:", error.message, info.componentStack?.split("\n")[1]);
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error
      ? this.props.fallback(this.state.error, this.reset)
      : this.props.children;
  }
}

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

function EventHandlerError() {
  const [message, setMessage] = useState<string | null>(null);
  const onClick = () => {
    try {
      throw new Error("error en un handler");
    } catch (error) {
      setMessage((error as Error).message + " → capturado con try/catch");
    }
  };
  return (
    <div className="row">
      <button type="button" onClick={onClick}>
        Error en evento
      </button>
      {message}
    </div>
  );
}

const fallback = (error: Error, reset: () => void) => (
  <div className="alert" role="alert">
    {error.message}
    <button type="button" onClick={reset}>
      Reintentar
    </button>
  </div>
);

export default function ErrorBoundariesDemo() {
  return (
    <>
      <Panel title="Un boundary por widget">
        <div style={{ display: "grid", gap: 8 }}>
          <ErrorBoundary fallback={fallback}>
            <BuggyWidget name="Gráfica de horas" />
          </ErrorBoundary>
          <ErrorBoundary fallback={fallback}>
            <BuggyWidget name="Lista de proyectos" />
          </ErrorBoundary>
        </div>
        <Note>Rompe uno: el otro sigue funcionando. Sin boundary, React desmonta toda la app.</Note>
      </Panel>
      <Panel title="Lo que NO captura">
        <EventHandlerError />
        <Note>
          No captura errores en event handlers, código async (setTimeout, promesas), SSR ni errores
          del propio boundary.
        </Note>
      </Panel>
    </>
  );
}
