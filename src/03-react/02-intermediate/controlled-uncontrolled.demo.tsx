import { useRef, useState, type FormEvent } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

export const meta: DemoMeta = {
  title: "Componentes controlados y no controlados",
  section: "react-intermediate",
  order: 210,
  questions: [
    "¿Qué diferencia hay entre componentes controlados y no controlados? Ventajas y desventajas",
    "¿Cómo manejarías un formulario con muchos campos?",
  ],
  sayIt:
    "A controlled input keeps its value in React state, so I can validate or format on every keystroke, but it re-renders on each change. An uncontrolled input keeps the value in the DOM and I read it on submit. For big forms I use React Hook Form, which is uncontrolled by default and validates with a schema.",
};

function ControlledForm() {
  const renders = useRenderCount();
  const [email, setEmail] = useState("");
  const valid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <span className="render-count">renders: {renders}</span>
      <label>
        Email <input value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
      </label>
      <small style={{ color: valid ? "var(--good)" : "var(--muted)" }}>
        {email ? (valid ? "Email válido" : "Sigue escribiendo…") : "Validación en vivo"}
      </small>
    </div>
  );
}

function UncontrolledForm() {
  const renders = useRenderCount();
  const nameRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dos formas de leer: con ref o con FormData.
    const fromRef = nameRef.current?.value ?? "";
    const fromForm = new FormData(e.currentTarget).get("hours");
    setSubmitted(`${fromRef} · ${String(fromForm)} h`);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 6 }}>
      <span className="render-count">renders: {renders}</span>
      <label>
        Proyecto <input ref={nameRef} defaultValue="Planner" />
      </label>
      <label>
        Horas <input name="hours" type="number" defaultValue={4} />
      </label>
      <button type="submit">Enviar</button>
      {submitted && <small>Enviado: {submitted}</small>}
    </form>
  );
}

export default function ControlledUncontrolled() {
  return (
    <>
      <Panel title="Controlado: el valor vive en el estado">
        <ControlledForm />
        <Note>
          Cada tecla re-renderiza. A cambio puedes transformar (minúsculas) y validar en vivo.
        </Note>
      </Panel>
      <Panel title="No controlado: el valor vive en el DOM">
        <UncontrolledForm />
        <Note>
          Escribir no re-renderiza: el contador no se mueve hasta enviar. Usa{" "}
          <code>defaultValue</code>, no <code>value</code>.
        </Note>
      </Panel>
    </>
  );
}
