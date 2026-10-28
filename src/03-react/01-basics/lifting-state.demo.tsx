import { useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Subir el estado (lifting state up)",
  section: "react-basics",
  order: 140,
  questions: [
    "¿Qué significa la expresión 'subir el estado'?",
    "¿Qué es el estado derivado y por qué conviene calcularlo en el render?",
  ],
  sayIt:
    "When two siblings need the same data, I move the state to their closest common parent and pass it down with props. Anything I can calculate from that state, like a total, I compute during render instead of storing it twice.",
};

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const;
type Day = (typeof DAYS)[number];

function HoursInput({
  day,
  value,
  onChange,
}: {
  day: Day;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      {day}
      <input
        type="number"
        min={0}
        max={24}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 64 }}
      />
    </label>
  );
}

function WeekTotal({ hours }: { hours: Record<Day, number> }) {
  // Estado derivado: se calcula, no se guarda en otro useState.
  const total = Object.values(hours).reduce((sum, h) => sum + h, 0);
  return (
    <p>
      Total semanal: <strong>{total} h</strong> {total > 40 && "· horas extra"}
    </p>
  );
}

export default function LiftingState() {
  // El estado vive en el padre común de los inputs y del total.
  const [hours, setHours] = useState<Record<Day, number>>({
    Lun: 8,
    Mar: 8,
    Mié: 8,
    Jue: 8,
    Vie: 8,
  });

  return (
    <Panel title="Mini timesheet: inputs y total comparten estado">
      <div className="row">
        {DAYS.map((day) => (
          <HoursInput
            key={day}
            day={day}
            value={hours[day]}
            onChange={(value) => setHours((prev) => ({ ...prev, [day]: value }))}
          />
        ))}
      </div>
      <WeekTotal hours={hours} />
      <Note>
        Si cada input tuviera su propio estado, el total no podría leerlos. Subir el estado al padre
        hace que haya una sola fuente de verdad.
      </Note>
    </Panel>
  );
}
