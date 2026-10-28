import { useImperativeHandle, useRef, useState, type Ref } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Refs: useRef, ref como prop y useImperativeHandle",
  section: "react-intermediate",
  order: 220,
  questions: [
    "¿Qué son las refs? ¿Cómo funciona useRef?",
    "¿Qué diferencia hay entre useRef y useState?",
    "¿Qué son las Forward Refs? ¿En React 19 se necesita todavía forwardRef?",
    "¿Para qué sirve el hook useImperativeHandle?",
  ],
  sayIt:
    "A ref is a mutable box that survives renders without causing one. I use it for DOM nodes, timers and previous values. Since React 19, ref is a regular prop for function components, so forwardRef is no longer needed; useImperativeHandle lets me expose a small API instead of the whole DOM node.",
};

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null); // no se muestra en pantalla → ref, no estado

  const start = () => {
    if (timerRef.current !== null) return;
    const startedAt = Date.now() - elapsed;
    timerRef.current = window.setInterval(() => setElapsed(Date.now() - startedAt), 100);
  };
  const stop = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <div className="row">
      <output>{(elapsed / 1000).toFixed(1)} s</output>
      <button type="button" onClick={start}>
        Iniciar
      </button>
      <button type="button" onClick={stop}>
        Parar
      </button>
      <button
        type="button"
        onClick={() => {
          stop();
          setElapsed(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}

// React 19: `ref` llega como una prop más. Antes había que envolver en forwardRef.
function TextInput({ ref, label }: { ref?: Ref<HTMLInputElement>; label: string }) {
  return (
    <label>
      {label} <input ref={ref} />
    </label>
  );
}

// useImperativeHandle: expone solo lo que el padre necesita.
type SearchHandle = { focus: () => void; clear: () => void };

function SearchBox({ ref }: { ref?: Ref<SearchHandle> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));
  return <input ref={inputRef} placeholder="Buscar…" aria-label="buscar" />;
}

export default function RefsDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<SearchHandle>(null);

  return (
    <>
      <Panel title="useRef para guardar un timer">
        <Stopwatch />
        <Note>
          El id del intervalo no se muestra, así que va en un ref: cambiarlo no necesita re-render.
        </Note>
      </Panel>

      <Panel title="ref como prop (React 19)">
        <div className="row">
          <TextInput ref={inputRef} label="Comentario" />
          <button type="button" onClick={() => inputRef.current?.focus()}>
            Enfocar
          </button>
        </div>
        <Snippet>{`function TextInput({ ref, label }: { ref?: Ref<HTMLInputElement>; label: string })`}</Snippet>
      </Panel>

      <Panel title="useImperativeHandle">
        <div className="row">
          <SearchBox ref={searchRef} />
          <button type="button" onClick={() => searchRef.current?.focus()}>
            focus()
          </button>
          <button type="button" onClick={() => searchRef.current?.clear()}>
            clear()
          </button>
        </div>
        <Note>El padre no puede tocar el input directamente; solo usa focus() y clear().</Note>
      </Panel>
    </>
  );
}
