import { useState, type FormEvent } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

/** Controlado: el valor vive en el estado y se transforma en cada tecla. */
export function ControlledEmail() {
  const renders = useRenderCount();
  const [email, setEmail] = useState("");
  const valid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <RenderCount label="ControlledEmail" count={renders} />
      <label>
        Email{" "}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          aria-label="email"
        />
      </label>
      <small style={{ color: valid ? "var(--good)" : "var(--muted)" }}>
        {email
          ? valid
            ? "Email válido"
            : "Sigue escribiendo…"
          : "Prueba con MAYÚSCULAS: se convierten al vuelo"}
      </small>
    </div>
  );
}

/** No controlado: el DOM guarda los valores y se leen al enviar con FormData. */
export function UncontrolledForm() {
  const renders = useRenderCount();
  const [submitted, setSubmitted] = useState<Record<string, FormDataEntryValue> | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitted(data);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 6 }}>
      <RenderCount label="UncontrolledForm" count={renders} />
      <label>
        Proyecto <input name="project" defaultValue="Planner" />
      </label>
      <label>
        Horas <input name="hours" type="number" defaultValue={4} />
      </label>
      <label>
        <input name="billable" type="checkbox" defaultChecked /> Facturable
      </label>
      <button type="submit">Enviar</button>
      {submitted && <code>{JSON.stringify(submitted)}</code>}
    </form>
  );
}

/** value sin onChange: React deja el input de solo lectura. */
export function ReadOnlyTrap() {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label>
        value sin onChange <input value="no puedes cambiarme" />
      </label>
      <label>
        defaultValue <input defaultValue="a mí sí" />
      </label>
    </div>
  );
}
