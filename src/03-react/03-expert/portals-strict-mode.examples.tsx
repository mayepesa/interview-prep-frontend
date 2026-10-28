import { StrictMode, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus(); // foco al abrir (accesibilidad)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus(); // devolver el foco al cerrar
    };
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
        aria-labelledby="portal-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          color: "var(--ink)",
          padding: 20,
          borderRadius: 10,
          minWidth: 280,
        }}
      >
        <h3 id="portal-modal-title" style={{ marginTop: 0 }}>
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

/** El modal escapa del overflow, pero los eventos siguen burbujeando por el árbol de React. */
export function PortalDemo({ usePortal }: { usePortal: boolean }) {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);
  const close = () => setOpen(false);

  return (
    <div>
      <div
        onClick={() => setClicks((c) => c + 1)}
        style={{
          overflow: "hidden",
          height: 70,
          border: "1px dashed var(--line)",
          padding: 8,
          position: "relative",
        }}
      >
        Contenedor con overflow: hidden.{" "}
        <button type="button" onClick={() => setOpen(true)}>
          Abrir modal
        </button>
        {open &&
          (usePortal ? (
            <Modal onClose={close}>
              <p>Estoy en document.body, pero el clic burbujea hasta el contenedor de React.</p>
            </Modal>
          ) : (
            <div
              style={{
                position: "absolute",
                top: 40,
                left: 8,
                background: "var(--surface)",
                padding: 12,
                border: "1px solid var(--line)",
                borderRadius: 8,
              }}
            >
              <strong>Modal sin portal</strong>
              <p>Me corta el overflow del contenedor…</p>
              <button type="button" onClick={close}>
                Cerrar
              </button>
            </div>
          ))}
      </div>
      <p className="note">Clics que burbujearon al contenedor: {clicks}</p>
    </div>
  );
}

function EffectLog({ label }: { label: string }) {
  const [log, setLog] = useState<string[]>([]);
  useEffect(() => {
    setLog((l) => [...l, "efecto (setup)"]);
    return () => setLog((l) => [...l, "cleanup"]);
  }, []);
  return (
    <div>
      <strong>{label}</strong>
      <ol className="console">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

export function StrictModeDemo() {
  return (
    <div className="row" style={{ alignItems: "flex-start", gap: 24 }}>
      <EffectLog label="Sin StrictMode" />
      <StrictMode>
        <EffectLog label="Con StrictMode" />
      </StrictMode>
    </div>
  );
}

/** Detectar si este build es de desarrollo (StrictMode solo actúa ahí). */
export function BuildMode() {
  return (
    <small className="note">
      Este build es de{" "}
      {import.meta.env.DEV
        ? "desarrollo: StrictMode está activo"
        : "producción: StrictMode no hace nada aquí; prueba con npm run dev"}
      .
    </small>
  );
}
