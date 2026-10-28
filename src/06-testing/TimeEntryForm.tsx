import { useState, type FormEvent } from "react";

export type TimeEntry = { project: string; hours: number; description: string };

type Props = {
  projects: string[];
  onSubmit: (entry: TimeEntry) => Promise<void>;
};

/** Formulario pequeño pero realista: validación, estado de envío y errores del servidor. */
export function TimeEntryForm({ projects, onSubmit }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof TimeEntry | "form", string>>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Guardamos el form antes del await: después, event.currentTarget ya es null.
    const form = event.currentTarget;
    const data = new FormData(form);
    const entry: TimeEntry = {
      project: String(data.get("project") ?? ""),
      hours: Number(data.get("hours")),
      description: String(data.get("description") ?? "").trim(),
    };

    const nextErrors: typeof errors = {};
    if (!entry.project) nextErrors.project = "Elige un proyecto";
    if (!(entry.hours > 0 && entry.hours <= 24)) nextErrors.hours = "Entre 0.25 y 24 horas";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("saving");
    try {
      await onSubmit(entry);
      setStatus("saved");
      form.reset();
    } catch {
      setStatus("idle");
      setErrors({ form: "No se pudo guardar. Intenta de nuevo." });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <label htmlFor="project">Proyecto</label>
      <select
        id="project"
        name="project"
        defaultValue=""
        aria-invalid={!!errors.project}
        aria-describedby={errors.project ? "project-error" : undefined}
      >
        <option value="" disabled>
          Elige…
        </option>
        {projects.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      {errors.project && (
        <span id="project-error" role="alert">
          {errors.project}
        </span>
      )}

      <label htmlFor="hours">Horas</label>
      <input
        id="hours"
        name="hours"
        type="number"
        step="0.25"
        aria-invalid={!!errors.hours}
        aria-describedby={errors.hours ? "hours-error" : undefined}
      />
      {errors.hours && (
        <span id="hours-error" role="alert">
          {errors.hours}
        </span>
      )}

      <label htmlFor="description">Descripción</label>
      <textarea id="description" name="description" />

      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Guardando…" : "Registrar horas"}
      </button>
      {status === "saved" && <p role="status">Horas registradas</p>}
      {errors.form && <p role="alert">{errors.form}</p>}
    </form>
  );
}
