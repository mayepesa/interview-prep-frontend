import { useState, type FormEvent, type MouseEvent } from "react";

function useLog(max = 8) {
  const [lines, setLines] = useState<string[]>([]);
  const add = (line: string) => setLines((prev) => [...prev, line].slice(-max));
  const reset = (line: string) => setLines([line]);
  return { lines, add, reset };
}

function LogView({ lines }: { lines: string[] }) {
  return (
    <ol className="console" aria-label="registro de eventos">
      {lines.length === 0 ? (
        <li className="muted">Los eventos aparecen aquí</li>
      ) : (
        lines.map((l, i) => <li key={i}>{l}</li>)
      )}
    </ol>
  );
}

/** Pasar parámetros con una arrow function. */
export function ParamsDemo() {
  const { lines, add } = useLog();
  const selectDay = (day: string) => add(`seleccionado: ${day}`);

  return (
    <div>
      <div className="row">
        {["Lun", "Mar", "Mié", "Jue", "Vie"].map((day) => (
          <button key={day} type="button" onClick={() => selectDay(day)}>
            {day}
          </button>
        ))}
      </div>
      <LogView lines={lines} />
    </div>
  );
}

/** preventDefault en un formulario: sin él, el navegador recargaría la página. */
export function FormDemo() {
  const { lines, add } = useLog();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    add(`guardado sin recargar: ${String(data.get("project"))} · ${String(data.get("hours"))} h`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="row">
        <input name="project" defaultValue="Timesheet" aria-label="proyecto" />
        <input
          name="hours"
          type="number"
          defaultValue={8}
          aria-label="horas"
          style={{ width: 70 }}
        />
        <button type="submit">Guardar</button>
        <a
          href="https://example.com"
          onClick={(e) => {
            e.preventDefault();
            add("el link no navegó");
          }}
        >
          Link que no navega
        </a>
      </form>
      <LogView lines={lines} />
    </div>
  );
}

/** SyntheticEvent vs evento nativo. */
export function SyntheticDemo() {
  const { lines, add } = useLog();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    add(`event.type: ${event.type}`);
    add(`event.nativeEvent: ${event.nativeEvent.constructor.name}`);
    add(`event.currentTarget: <${event.currentTarget.tagName.toLowerCase()}>`);
    add(`posición: ${event.clientX}, ${event.clientY}`);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Haz clic para inspeccionar el evento
      </button>
      <LogView lines={lines} />
    </div>
  );
}

/** Captura (de afuera hacia adentro) y burbuja (de adentro hacia afuera). */
export function PhasesDemo() {
  const { lines, add, reset } = useLog(10);
  const box = { border: "1px dashed var(--line)", padding: 12, borderRadius: 8, marginTop: 6 };

  return (
    <div>
      <section
        onClickCapture={() => reset("1. captura en <section> (baja)")}
        onClick={() => add("5. burbuja en <section> (sube)")}
        style={box}
      >
        section
        <div
          onClickCapture={() => add("2. captura en <div>")}
          onClick={() => add("4. burbuja en <div>")}
          style={{ ...box, borderColor: "var(--accent)" }}
        >
          div{" "}
          <button type="button" onClick={() => add("3. target: <button>")}>
            Haz clic aquí
          </button>
        </div>
      </section>
      <LogView lines={lines} />
    </div>
  );
}

/** stopPropagation: el clic en el botón no llega a la tarjeta. */
export function StopPropagationDemo() {
  const { lines, add } = useLog();
  const [stop, setStop] = useState(true);

  return (
    <div>
      <label>
        <input type="checkbox" checked={stop} onChange={(e) => setStop(e.target.checked)} /> Llamar
        a <code>e.stopPropagation()</code> en el botón
      </label>
      <div
        onClick={() => add("tarjeta: abrir el detalle de la tarea")}
        style={{
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: 12,
          marginTop: 8,
          cursor: "pointer",
        }}
      >
        <strong>Revisar PR #42</strong> (clic en la tarjeta abre el detalle){" "}
        <button
          type="button"
          onClick={(e) => {
            if (stop) e.stopPropagation();
            add("botón: tarea borrada");
          }}
        >
          Borrar
        </button>
      </div>
      <LogView lines={lines} />
    </div>
  );
}

const TASKS = [
  { id: "t1", title: "Revisar PR" },
  { id: "t2", title: "Escribir tests" },
  { id: "t3", title: "Daily" },
];

/** Delegación: un solo handler en la lista, el ítem se identifica con data-id. */
export function DelegationDemo() {
  const { lines, add } = useLog();

  const handleListClick = (event: MouseEvent<HTMLUListElement>) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-id]");
    if (!item) return;
    add(
      `target: <${(event.target as HTMLElement).tagName.toLowerCase()}> · currentTarget: <ul> · id: ${item.dataset.id}`,
    );
  };

  return (
    <div>
      <ul onClick={handleListClick} style={{ cursor: "pointer" }}>
        {TASKS.map((task) => (
          <li key={task.id} data-id={task.id}>
            <strong>{task.title}</strong>{" "}
            <small className="note">(clic en el texto o en el título)</small>
          </li>
        ))}
      </ul>
      <LogView lines={lines} />
    </div>
  );
}
