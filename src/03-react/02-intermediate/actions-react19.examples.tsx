import { useActionState, useOptimistic, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { wait } from "../../app/fakeApi";

/* ---------- Action con useTransition (sin formulario) ---------- */

export function TransitionAction() {
  const [name, setName] = useState("Planner");
  const [saved, setSaved] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      await wait(800); // la "petición"
      startTransition(() => setSaved(name)); // tras un await, se vuelve a marcar como transición
    });
  };

  return (
    <div className="row">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="nombre del proyecto"
      />
      <button type="button" onClick={save} disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar"}
      </button>
      {saved && <span>Guardado: {saved}</span>}
    </div>
  );
}

/* ---------- useActionState + useFormStatus ---------- */

type SaveState = { ok: boolean; message: string } | null;

async function saveHours(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await wait(800);
  const hours = Number(formData.get("hours"));
  if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return { ok: false, message: "Las horas deben estar entre 1 y 24" };
  }
  return { ok: true, message: `Guardadas ${hours} h` };
}

// useFormStatus lee el estado del <form> padre: no hace falta pasar props.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

export function HoursForm() {
  const [state, formAction, isPending] = useActionState(saveHours, null);
  return (
    <form action={formAction} className="row">
      <label>
        Horas <input name="hours" type="number" defaultValue={8} style={{ width: 70 }} />
      </label>
      <SubmitButton />
      {state && (
        <span style={{ color: state.ok ? "var(--good)" : "var(--bad)" }}>{state.message}</span>
      )}
      {isPending && <small className="muted">isPending = true</small>}
    </form>
  );
}

/* ---------- useOptimistic ---------- */

type Comment = { id: string; text: string; sending?: boolean };

async function postComment(text: string): Promise<Comment> {
  await wait(1200);
  if (text.toLowerCase().includes("error")) throw new Error("El servidor rechazó el comentario");
  return { id: crypto.randomUUID(), text };
}

export function OptimisticComments() {
  const [comments, setComments] = useState<Comment[]>([{ id: "1", text: "Buen PR 👍" }]);
  const [optimistic, addOptimistic] = useOptimistic(comments, (current, text: string) => [
    ...current,
    { id: `temp-${text}`, text, sending: true },
  ]);
  const [error, setError] = useState<string | null>(null);

  const submit = async (formData: FormData) => {
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;
    setError(null);
    addOptimistic(text); // se ve al instante
    try {
      const saved = await postComment(text);
      setComments((prev) => [...prev, saved]);
    } catch (e) {
      setError((e as Error).message); // al terminar la Action, el optimista desaparece solo
    }
  };

  return (
    <div>
      <ul>
        {optimistic.map((c) => (
          <li key={c.id} style={{ opacity: c.sending ? 0.5 : 1 }}>
            {c.text} {c.sending && <small>(enviando…)</small>}
          </li>
        ))}
      </ul>
      <form action={submit} className="row">
        <input name="text" placeholder='Prueba también con "error"' aria-label="comentario" />
        <button type="submit">Comentar</button>
      </form>
      {error && (
        <p role="alert" style={{ color: "var(--bad)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- action vs formAction ---------- */

export function ActionVsFormAction() {
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((l) => [...l.slice(-3), line]);

  const publish = async (formData: FormData) => {
    await wait(300);
    add(`publish("${String(formData.get("title"))}")`);
  };
  const saveDraft = async (formData: FormData) => {
    await wait(300);
    add(`saveDraft("${String(formData.get("title"))}")`);
  };

  return (
    <div>
      <form action={publish} className="row">
        <input name="title" defaultValue="Release notes" aria-label="título" />
        <button type="submit">Publicar</button>
        <button type="submit" formAction={saveDraft}>
          Guardar borrador
        </button>
      </form>
      <ol className="console">
        {log.length === 0 ? (
          <li className="muted">Qué función se llamó</li>
        ) : (
          log.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ol>
    </div>
  );
}
