import { useState, type ReactNode } from "react";

const SECTIONS = [
  { title: "¿Qué es Timesheet?", body: "Una app para registrar horas dentro de Jira." },
  { title: "¿Cómo exporto un reporte?", body: "Desde Reports → Exportar a CSV o Excel." },
  { title: "¿Hay app móvil?", body: "Sí, para iOS y Android." },
];

/** Cada panel decide solo si está abierto: no pueden coordinarse. */
function LocalPanel({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "6px 0" }}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        {isOpen ? "▾" : "▸"} {title}
      </button>
      {isOpen && <p style={{ margin: "6px 0" }}>{children}</p>}
    </div>
  );
}

export function AccordionLocalState() {
  return (
    <div>
      {SECTIONS.map((s) => (
        <LocalPanel key={s.title} title={s.title}>
          {s.body}
        </LocalPanel>
      ))}
    </div>
  );
}

/** Panel controlado: recibe isOpen y avisa con onToggle. */
function Panel({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "6px 0" }}>
      <button type="button" onClick={onToggle} aria-expanded={isOpen}>
        {isOpen ? "▾" : "▸"} {title}
      </button>
      {isOpen && <p style={{ margin: "6px 0" }}>{children}</p>}
    </div>
  );
}

/** El estado sube al padre: solo un panel abierto a la vez. */
export function AccordionLiftedState() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div>
      {SECTIONS.map((s, index) => (
        <Panel
          key={s.title}
          title={s.title}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        >
          {s.body}
        </Panel>
      ))}
    </div>
  );
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const;
type Day = (typeof DAYS)[number];
type WeekHours = Record<Day, number>;

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

function WeekTotal({ hours }: { hours: WeekHours }) {
  // Estado derivado: se calcula en el render, no se guarda.
  const total = Object.values(hours).reduce((sum, h) => sum + h, 0);
  return (
    <p>
      Total semanal: <strong>{total} h</strong>{" "}
      {total > 40 && <span style={{ color: "var(--bad)" }}>· {total - 40} h extra</span>}
    </p>
  );
}

/** Mini timesheet: los inputs y el total comparten el estado del padre. */
export function Timesheet() {
  const [hours, setHours] = useState<WeekHours>({ Lun: 8, Mar: 8, Mié: 8, Jue: 8, Vie: 8 });

  return (
    <div>
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
    </div>
  );
}

type Project = { id: string; name: string; hours: number };

/** Guardar el id seleccionado (no el objeto) y derivar el resto. */
export function SelectedProject() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", name: "Timesheet", hours: 32 },
    { id: "p2", name: "Planner", hours: 12 },
  ]);
  const [selectedId, setSelectedId] = useState("p1");

  const selected = projects.find((p) => p.id === selectedId); // derivado: siempre actualizado

  const addHour = (id: string) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, hours: p.hours + 1 } : p)));

  return (
    <div>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="row">
            <label>
              <input
                type="radio"
                checked={p.id === selectedId}
                onChange={() => setSelectedId(p.id)}
              />{" "}
              {p.name} · {p.hours} h
            </label>
            <button type="button" onClick={() => addHour(p.id)}>
              +1 h
            </button>
          </li>
        ))}
      </ul>
      <p>
        Seleccionado: <strong>{selected?.name}</strong> con {selected?.hours} h
      </p>
    </div>
  );
}
