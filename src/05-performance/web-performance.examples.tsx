import { lazy, Suspense, useState } from "react";

const HeavyReport = lazy(() => import("./web-performance.lazy"));

/** Code splitting: el componente del reporte se descarga solo cuando se pide. */
export function LazyReport() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        type="button"
        onClick={() => setShow(true)}
        disabled={show}
        style={{ justifySelf: "start" }}
      >
        Ver reporte
      </button>
      {show && (
        <Suspense fallback={<p className="note">Descargando el chunk del reporte…</p>}>
          <HeavyReport />
        </Suspense>
      )}
    </div>
  );
}

/** CLS: un banner que llega tarde empuja el contenido, salvo que tenga su espacio reservado. */
export function LayoutShiftDemo() {
  const [reserve, setReserve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(0);

  const reload = () => {
    setLoaded(false);
    setKey((k) => k + 1);
    setTimeout(() => setLoaded(true), 900);
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <label className="row">
          <input type="checkbox" checked={reserve} onChange={(e) => setReserve(e.target.checked)} />
          reservar el espacio (min-height / width y height)
        </label>
        <button type="button" onClick={reload}>
          Simular carga
        </button>
      </div>
      <div key={key} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 8 }}>
        <div style={{ minHeight: reserve ? 60 : undefined }}>
          {loaded ? (
            <div
              style={{
                height: 60,
                background: "var(--accent)",
                color: "white",
                borderRadius: 6,
                display: "grid",
                placeItems: "center",
              }}
            >
              Banner que llegó tarde
            </div>
          ) : reserve ? (
            <div style={{ height: 60, background: "var(--surface-2)", borderRadius: 6 }} />
          ) : null}
        </div>
        <p style={{ margin: "8px 0 0" }}>
          Intenta hacer clic en este botón justo antes de que aparezca el banner:{" "}
          <button type="button">Eliminar entrada</button>
        </p>
      </div>
    </div>
  );
}

function busy(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // trabajo síncrono que bloquea el hilo principal
  }
}

const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** INP: una tarea larga bloquea la página; partirla en trozos le deja responder al usuario. */
export function LongTaskDemo() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("—");

  const blocking = () => {
    setStatus("procesando…");
    setTimeout(() => {
      busy(1500); // una sola tarea de 1.5 s
      setStatus("listo (una tarea larga de 1500 ms)");
    }, 50);
  };

  const chunked = async () => {
    setStatus("procesando en trozos…");
    for (let i = 0; i < 30; i++) {
      busy(50); // 30 tareas de 50 ms
      await yieldToMain(); // devuelve el control: el navegador puede pintar y atender teclas
    }
    setStatus("listo (30 tareas de 50 ms)");
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
      <div className="row">
        <button type="button" onClick={blocking}>
          Procesar bloqueando
        </button>
        <button type="button" onClick={chunked}>
          Procesar en trozos
        </button>
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe aquí mientras procesa"
        aria-label="texto de prueba"
      />
      <p style={{ margin: 0 }}>Estado: {status}</p>
    </div>
  );
}
