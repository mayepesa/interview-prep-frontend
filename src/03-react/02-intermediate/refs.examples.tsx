import { useCallback, useImperativeHandle, useRef, useState, type Ref } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

/** Mismo contador con useState y con useRef: el ref cambia pero no re-renderiza. */
export function RefVsState() {
  const renders = useRenderCount();
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <RenderCount label="componente" count={renders} />
      <div className="row">
        <button type="button" onClick={() => setStateCount((c) => c + 1)}>
          useState: {stateCount}
        </button>
        <button
          type="button"
          onClick={() => {
            refCount.current += 1;
          }}
        >
          useRef: {refCount.current}
        </button>
      </div>
    </div>
  );
}

/** El id del intervalo no se muestra: va en un ref. */
export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  const start = () => {
    if (timerRef.current !== null) return; // ya está corriendo
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

/** Ref a un nodo del DOM para enfocar y hacer scroll. */
export function FocusAndScroll() {
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLLIElement>(null);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <input ref={inputRef} placeholder="Comentario" aria-label="comentario" />
        <button type="button" onClick={() => inputRef.current?.focus()}>
          Enfocar
        </button>
        <button type="button" onClick={() => endRef.current?.scrollIntoView({ block: "nearest" })}>
          Ir al final de la lista
        </button>
      </div>
      <ul style={{ maxHeight: 90, overflow: "auto", margin: 0 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i} ref={i === 19 ? endRef : undefined}>
            Entrada {i + 1}
            {i === 19 && " (la última)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** React 19: `ref` es una prop más en componentes función. */
export function TextInput({ ref, label }: { ref?: Ref<HTMLInputElement>; label: string }) {
  return (
    <label>
      {label} <input ref={ref} />
    </label>
  );
}

export function RefAsPropDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="row">
      <TextInput ref={inputRef} label="Horas" />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Enfocar el input del hijo
      </button>
    </div>
  );
}

export type SearchHandle = { focus: () => void; clear: () => void };

/** Expone solo focus() y clear(), no el nodo completo. */
export function SearchBox({ ref }: { ref?: Ref<SearchHandle> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));
  return <input ref={inputRef} placeholder="Buscar…" aria-label="buscar" />;
}

export function ImperativeDemo() {
  const searchRef = useRef<SearchHandle>(null);
  return (
    <div className="row">
      <SearchBox ref={searchRef} />
      <button type="button" onClick={() => searchRef.current?.focus()}>
        focus()
      </button>
      <button type="button" onClick={() => searchRef.current?.clear()}>
        clear()
      </button>
    </div>
  );
}

/** Callback ref con cleanup (React 19): se llama al montar el nodo y limpia al quitarlo. */
export function CallbackRefDemo() {
  const [show, setShow] = useState(true);
  const [width, setWidth] = useState<number | null>(null);

  // Estable con useCallback: si fuera inline, React haría cleanup + setup en cada render.
  const measureRef = useCallback((node: HTMLDivElement) => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry!.contentRect.width)),
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      setWidth(null);
    };
  }, []);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button type="button" onClick={() => setShow((s) => !s)}>
        {show ? "Quitar" : "Poner"} la caja
      </button>
      {show && (
        <div
          ref={measureRef}
          style={{
            resize: "horizontal",
            overflow: "auto",
            border: "1px dashed var(--line)",
            padding: 8,
            width: 220,
            maxWidth: "100%",
          }}
        >
          Arrastra la esquina para cambiar mi ancho
        </div>
      )}
      <small>Ancho medido: {width === null ? "—" : `${width}px`}</small>
    </div>
  );
}
