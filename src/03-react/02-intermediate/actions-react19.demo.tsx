import { useActionState, useOptimistic, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { DemoMeta } from "../../app/registry";
import { wait } from "../../app/fakeApi";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "React 19: Actions, useActionState, useOptimistic y useFormStatus",
  section: "react-intermediate",
  order: 270,
  questions: [
    "¿Para qué sirve el hook useActionState?",
    "¿Qué problema resuelve el hook useOptimistic?",
    "¿Cómo funciona useFormStatus?",
    "¿Qué son las Server Actions y cómo se usan con formularios?",
    "¿Cuál es la diferencia entre la prop action y formAction?",
  ],
  sayIt:
    "In React 19 a form's action can be an async function. useActionState gives me the result and a pending flag, useFormStatus lets a submit button know the form is pending, and useOptimistic shows the expected result immediately and rolls back if the request fails.",
};

type SaveState = { message: string; ok: boolean } | null;

async function saveHours(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await wait(700);
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

function ActionStateForm() {
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
      {isPending && <span className="note">(isPending)</span>}
    </form>
  );
}

type Comment = { id: string; text: string; sending?: boolean };

async function postComment(text: string): Promise<Comment> {
  await wait(1200);
  if (text.toLowerCase().includes("error")) throw new Error("El servidor rechazó el comentario");
  return { id: crypto.randomUUID(), text };
}

function OptimisticComments() {
  const [comments, setComments] = useState<Comment[]>([{ id: "1", text: "Buen PR 👍" }]);
  const [optimistic, addOptimistic] = useOptimistic(comments, (current, text: string) => [
    ...current,
    { id: `temp-${text}`, text, sending: true },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      addOptimistic(text); // se ve al instante
      try {
        const saved = await postComment(text);
        setComments((prev) => [...prev, saved]);
      } catch (e) {
        setError((e as Error).message); // al terminar la transición, el optimista desaparece solo
      }
    });
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
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default function ActionsReact19() {
  return (
    <>
      <Panel title="useActionState + useFormStatus">
        <ActionStateForm />
        <Note>Prueba con 30 para ver el error de validación.</Note>
      </Panel>
      <Panel title="useOptimistic">
        <OptimisticComments />
        <Note>
          El comentario aparece antes de que responda el servidor. Si falla, se revierte solo.
        </Note>
      </Panel>
      <Panel title="action vs formAction">
        <Snippet>{`
<form action={save}>                         // acción del formulario
  <button type="submit">Guardar</button>
  <button formAction={saveDraft}>Borrador</button>  // otro botón, otra acción
</form>
        `}</Snippet>
        <Note>
          En Next.js, una Server Action es una función con <code>"use server"</code> que se ejecuta
          en el servidor y se pasa igual a <code>action</code>.
        </Note>
      </Panel>
    </>
  );
}
