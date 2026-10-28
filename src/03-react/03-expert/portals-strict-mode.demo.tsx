import { StrictMode, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Portales y StrictMode",
  section: "react-expert",
  order: 410,
  questions: [
    "¿Qué son los portales en React?",
    "¿Qué es el StrictMode?",
    "¿Por qué StrictMode renderiza dos veces la aplicación?",
  ],
  sayIt:
    "A portal renders children into another DOM node, like document.body, which avoids overflow and z-index problems for modals and tooltips, while events still bubble through the React tree. StrictMode, only in development, renders and runs effects twice to expose impure renders and missing cleanups.",
};

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus(); // foco al abrir (accesibilidad)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Se renderiza en <body>, fuera del contenedor con overflow: hidden.
  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgb(0 0 0 / 0.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 10,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surface)", padding: 20, borderRadius: 10, minWidth: 280 }}
      >
        <h3 id="modal-title" style={{ marginTop: 0 }}>
          Modal en un portal
        </h3>
        {children}
        <button ref={closeRef} type="button" onClick={onClose}>
          Cerrar (Esc)
        </button>
      </div>
    </div>,
    document.body,
  );
}

function EffectLog({ label }: { label: string }) {
  const [log, setLog] = useState<string[]>([]);
  useEffect(() => {
    setLog((l) => [...l, "efecto montado"]);
    return () => setLog((l) => [...l, "cleanup"]);
  }, []);
  return (
    <div>
      <strong>{label}</strong>
      <ol className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

export default function PortalsStrictMode() {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <Panel title="Portal">
        <div
          onClick={() => setClicks((c) => c + 1)}
          style={{ overflow: "hidden", height: 60, border: "1px dashed var(--line)", padding: 8 }}
        >
          Contenedor con overflow hidden.{" "}
          <button type="button" onClick={() => setOpen(true)}>
            Abrir modal
          </button>
        </div>
        <p className="note">Clics que burbujearon al contenedor: {clicks}</p>
        {open && (
          <Modal onClose={() => setOpen(false)}>
            <p>Estoy en document.body, pero los eventos burbujean por el árbol de React.</p>
          </Modal>
        )}
      </Panel>
      <Panel title="StrictMode ejecuta efectos dos veces (solo en desarrollo)">
        <div className="row" style={{ alignItems: "flex-start", gap: 24 }}>
          <EffectLog label="Sin StrictMode" />
          <StrictMode>
            <EffectLog label="Con StrictMode" />
          </StrictMode>
        </div>
        <Note>
          Con StrictMode verás montado → cleanup → montado. Si tu efecto se rompe con eso, le falta
          un cleanup. En producción corre una sola vez.
        </Note>
      </Panel>
    </>
  );
}
