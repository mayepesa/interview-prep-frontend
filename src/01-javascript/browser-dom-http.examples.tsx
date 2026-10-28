import { useEffect, useRef, useState } from "react";

const box = (color: string) => ({
  padding: 14,
  border: `2px solid ${color}`,
  borderRadius: 8,
  marginTop: 6,
});

/**
 * Captura y burbujeo con listeners NATIVOS (addEventListener), no con props de React,
 * para ver el orden real del DOM: captura de afuera hacia adentro, burbujeo de adentro hacia afuera.
 */
export function EventPropagation() {
  const outer = useRef<HTMLDivElement>(null);
  const middle = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [stopAtMiddle, setStopAtMiddle] = useState(false);

  useEffect(() => {
    const nodes = [
      ["outer", outer.current],
      ["middle", middle.current],
      ["button", button.current],
    ] as const;
    const controller = new AbortController(); // un abort() quita todos los listeners
    const add = (line: string) => setLog((prev) => [...prev, line]);

    for (const [name, node] of nodes) {
      node?.addEventListener("click", () => add(`captura → ${name}`), {
        capture: true,
        signal: controller.signal,
      });
      node?.addEventListener(
        "click",
        (event) => {
          add(`burbujeo ← ${name}`);
          if (name === "middle" && stopAtMiddle) {
            event.stopPropagation();
            add("  stopPropagation() en middle: outer no se entera");
          }
        },
        { signal: controller.signal },
      );
    }
    return () => controller.abort();
  }, [stopAtMiddle]);

  return (
    <div>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={stopAtMiddle}
            onChange={(e) => setStopAtMiddle(e.target.checked)}
          />{" "}
          llamar stopPropagation() en middle
        </label>
        <button type="button" onClick={() => setLog([])}>
          Limpiar
        </button>
      </div>
      <div ref={outer} style={box("var(--muted)")}>
        outer
        <div ref={middle} style={box("var(--accent)")}>
          middle
          <div style={{ marginTop: 6 }}>
            <button ref={button} type="button">
              button (haz clic)
            </button>
          </div>
        </div>
      </div>
      <ol className="console">
        {log.length === 0 ? (
          <li className="muted">La salida aparece aquí</li>
        ) : (
          log.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ol>
    </div>
  );
}

/**
 * Delegación: UN solo listener nativo en la <ul> maneja los clicks de todos los <li>,
 * incluso los que se agregan después.
 */
export function EventDelegation() {
  const list = useRef<HTMLUListElement>(null);
  const [items, setItems] = useState(["Planner", "Reports", "Timesheets"]);
  const [message, setMessage] = useState("Haz clic en un proyecto");

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const onClick = (event: MouseEvent) => {
      // event.target es el elemento clickeado; closest sube hasta el <li> más cercano
      const li = (event.target as HTMLElement).closest("li");
      if (!li || !ul.contains(li)) return;
      setMessage(`Click en "${li.dataset.name}" (listener único en la <ul>)`);
    };
    ul.addEventListener("click", onClick);
    return () => ul.removeEventListener("click", onClick);
  }, []);

  return (
    <div>
      <ul ref={list} style={{ cursor: "pointer" }}>
        {items.map((name) => (
          <li key={name} data-name={name}>
            <strong>{name}</strong> <span className="muted">· {name.length} letras</span>
          </li>
        ))}
      </ul>
      <div className="row">
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, `Proyecto ${prev.length + 1}`])}
        >
          Agregar proyecto
        </button>
        <span>{message}</span>
      </div>
    </div>
  );
}
