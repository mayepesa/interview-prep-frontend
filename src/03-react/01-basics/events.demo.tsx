import { useState, type FormEvent, type MouseEvent } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Eventos",
  section: "react-basics",
  order: 130,
  questions: [
    "¿Cómo añadir un evento a un componente?",
    "¿Cómo pasar un parámetro a una función que maneja un evento?",
    "¿Cómo prevenir el comportamiento por defecto de un evento?",
    "¿Qué es el SyntheticEvent?",
    "¿Cómo acceder al evento nativo del navegador?",
    "¿Cómo registrar un evento en la fase de captura?",
  ],
  sayIt:
    "React wraps native events in a SyntheticEvent with the same API across browsers. I pass parameters with an arrow function, call preventDefault on form submits, and use onClickCapture when I need the capture phase.",
};

export default function Events() {
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((prev) => [...prev, line].slice(-8));

  // Pasar parámetros: una arrow function que llama al handler.
  const select = (day: string) => add(`seleccionado: ${day}`);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // evita que el navegador recargue la página
    const data = new FormData(event.currentTarget);
    add(`submit sin recargar: ${String(data.get("hours"))} h`);
  };

  const onNative = (event: MouseEvent<HTMLButtonElement>) => {
    add(`synthetic: ${event.type} · nativo: ${event.nativeEvent.constructor.name}`);
  };

  return (
    <>
      <Panel title="Handlers con parámetros">
        <div className="row">
          {["Lun", "Mar", "Mié"].map((day) => (
            <button key={day} type="button" onClick={() => select(day)}>
              {day}
            </button>
          ))}
        </div>
        <Snippet tone="bad">{`onClick={select(day)} // se ejecuta en el render, no al hacer clic`}</Snippet>
        <Snippet tone="good">{`onClick={() => select(day)}`}</Snippet>
      </Panel>

      <Panel title="preventDefault en un formulario">
        <form onSubmit={onSubmit} className="row">
          <label>
            Horas <input name="hours" type="number" defaultValue={8} />
          </label>
          <button type="submit">Guardar</button>
        </form>
      </Panel>

      <Panel title="SyntheticEvent, evento nativo y fase de captura">
        <div
          onClickCapture={() => add("1. captura en el div (baja)")}
          onClick={() => add("3. burbuja en el div (sube)")}
        >
          <button
            type="button"
            onClick={(e) => {
              add("2. clic en el botón");
              onNative(e);
            }}
          >
            Haz clic y mira el orden
          </button>
        </div>
        <Note>
          La captura va de afuera hacia adentro antes del target; la burbuja vuelve de adentro hacia
          afuera. <code>e.stopPropagation()</code> corta la burbuja.
        </Note>
      </Panel>

      <ol className="log" aria-label="registro de eventos">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </>
  );
}
