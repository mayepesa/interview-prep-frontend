import { memo, useEffect, useState } from "react";
import { COLORS, STORAGE_KEY, type Color, type Note } from "./types";

const BACKGROUND: Record<Color, string> = { yellow: "#fff3a3", pink: "#ffc9de", blue: "#c4e3ff" };

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.text === "string" &&
    typeof v.x === "number" &&
    typeof v.y === "number" &&
    (COLORS as readonly unknown[]).includes(v.color)
  );
}

function loadNotes(): Note[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(data) ? data.filter(isNote) : [];
  } catch {
    return [];
  }
}

type NoteCardProps = {
  note: Note;
  onChange: (id: string, patch: Partial<Note>) => void;
  onDelete: (id: string) => void;
};

// memo: escribir en una nota no re-renderiza las demás (onChange y onDelete son estables).
const NoteCard = memo(function NoteCard({ note, onChange, onDelete }: NoteCardProps) {
  return (
    <article
      style={{
        background: BACKGROUND[note.color],
        color: "#222",
        padding: 12,
        borderRadius: 6,
        width: 200,
      }}
    >
      <label>
        Note text
        <textarea
          value={note.text}
          onChange={(e) => onChange(note.id, { text: e.target.value })}
          rows={4}
          style={{ width: "100%" }}
        />
      </label>
      <label>
        Color
        <select
          value={note.color}
          onChange={(e) => onChange(note.id, { color: e.target.value as Color })}
        >
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={() => onDelete(note.id)}>
        Delete note
      </button>
    </article>
  );
});

export function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // storage lleno o bloqueado: la app sigue en memoria
    }
  }, [notes]);

  // Funciones estables (no dependen de `notes` gracias al updater): memo funciona.
  const [actions] = useState(() => ({
    change: (id: string, patch: Partial<Note>) =>
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n))),
    remove: (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)),
  }));

  const add = () =>
    setNotes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        color: "yellow",
        x: 20 * prev.length,
        y: 20 * prev.length,
      },
    ]);

  return (
    <section>
      <button type="button" onClick={add}>
        Add note
      </button>
      {notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onChange={actions.change}
              onDelete={actions.remove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
