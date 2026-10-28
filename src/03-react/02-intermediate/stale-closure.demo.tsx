import { useEffect, useRef, useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Stale closures en hooks",
  section: "react-intermediate",
  order: 300,
  questions: [
    "¿Qué es una stale closure y cómo afecta a los hooks?",
    "¿Cómo mantener los componentes puros y qué ventajas tiene?",
  ],
  sayIt:
    "Each render has its own props and state, and functions created in that render close over those values. If an effect or interval keeps an old function, it reads stale state. I fix it with the updater form of setState, by listing the value in the dependencies, or by keeping the latest value in a ref.",
};

function StaleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Este intervalo se creó en el primer render: `count` siempre vale 0 aquí.
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
    // El linter de hooks avisaría: falta `count` en las dependencias.
  }, []);

  return <output>Stale: {count} (se queda en 1)</output>;
}

function FixedCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000); // updater: no lee `count`
    return () => clearInterval(id);
  }, []);

  return <output>Con updater: {count}</output>;
}

function LatestRefAlert() {
  const [text, setText] = useState("");
  const latest = useRef(text);

  useEffect(() => {
    latest.current = text; // siempre guarda el último valor
  }, [text]);

  const sendLater = (useRefValue: boolean) => {
    const captured = text; // valor de ESTE render
    setTimeout(() => {
      window.alert(
        useRefValue ? `Ref (último): "${latest.current}"` : `Closure (viejo): "${captured}"`,
      );
    }, 2000);
  };

  return (
    <div className="row">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="mensaje"
        placeholder="Escribe, envía y sigue escribiendo"
      />
      <button type="button" onClick={() => sendLater(false)}>
        Enviar en 2 s (closure)
      </button>
      <button type="button" onClick={() => sendLater(true)}>
        Enviar en 2 s (ref)
      </button>
    </div>
  );
}

export default function StaleClosureDemo() {
  return (
    <>
      <Panel title="Intervalo con estado viejo">
        <div style={{ display: "grid", gap: 6 }}>
          <StaleCounter />
          <FixedCounter />
        </div>
        <Snippet tone="bad">{`setInterval(() => setCount(count + 1), 1000) // count siempre 0`}</Snippet>
        <Snippet tone="good">{`setInterval(() => setCount((c) => c + 1), 1000)`}</Snippet>
      </Panel>
      <Panel title="Leer el último valor desde un callback async">
        <LatestRefAlert />
        <Note>
          Componentes puros: dado el mismo input (props, estado, contexto) devuelven el mismo JSX,
          sin efectos durante el render. Por eso cada render es una "foto" con sus propios valores.
        </Note>
      </Panel>
    </>
  );
}
