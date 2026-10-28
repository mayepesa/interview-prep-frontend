import { useEffect, useRef, useState } from "react";

/** Contador escrito "a mano" con la API del DOM: tú decides cada paso. */
export function ImperativeCounter() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let count = 0;
    const label = document.createElement("p");
    label.textContent = "Clics: 0";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "+1";
    button.addEventListener("click", () => {
      count += 1;
      label.textContent = `Clics: ${count}`; // 1. actualizar el texto
      label.style.color = count >= 5 ? "var(--bad)" : ""; // 2. acordarse del color
    });
    host.append(label, button);

    return () => host.replaceChildren(); // limpiar lo que creamos
  }, []);

  return <div ref={hostRef} />;
}

/** El mismo contador en React: describes la UI para cada valor de count. */
export function DeclarativeCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p style={{ color: count >= 5 ? "var(--bad)" : undefined }}>Clics: {count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function TypingBox() {
  const [text, setText] = useState("");
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Escribe algo aquí"
      aria-label="texto de prueba"
    />
  );
}

/** Muestra las reglas del diffing: mismo tipo conserva estado; otro tipo u otra key lo reinician. */
export function ReconciliationDemo() {
  const [asSection, setAsSection] = useState(false);
  const [version, setVersion] = useState(0);
  const [highlight, setHighlight] = useState(false);

  const style = {
    border: `2px solid ${highlight ? "var(--accent)" : "var(--line)"}`,
    padding: 8,
    borderRadius: 8,
  };
  const box = <TypingBox key={version} />;

  return (
    <div>
      <div className="row">
        <button type="button" onClick={() => setHighlight((h) => !h)}>
          Cambiar solo el estilo
        </button>
        <button type="button" onClick={() => setAsSection((s) => !s)}>
          Cambiar el tipo: div ↔ section
        </button>
        <button type="button" onClick={() => setVersion((v) => v + 1)}>
          Cambiar la key
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        {asSection ? <section style={style}>{box}</section> : <div style={style}>{box}</div>}
      </div>
      <p className="note">
        Contenedor actual: <code>{asSection ? "<section>" : "<div>"}</code> · key del input ={" "}
        {version}
      </p>
    </div>
  );
}

/** Un shadow root real: su CSS no sale y el CSS de afuera no entra. */
export function ShadowDomDemo() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>p { color: #e5534b; font-weight: bold; margin: 4px 0; }</style>
      <p>Párrafo dentro del Shadow DOM: el estilo rojo vive aquí adentro.</p>`;
  }, []);

  return (
    <div>
      <div ref={hostRef} />
      <p style={{ margin: "4px 0" }}>
        Párrafo normal, fuera del shadow root: el CSS de adentro no lo alcanza.
      </p>
    </div>
  );
}
