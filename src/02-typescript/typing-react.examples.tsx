import {
  createContext,
  use,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Action, Button, Select } from "./react-types";

// ─── Props y children ────────────────────────────────────────────────────────

type ProjectCardProps = {
  name: string;
  hours: number;
  status?: "active" | "archived"; // opcional con default
  onOpen: (name: string) => void;
};

export function ProjectCard({ name, hours, status = "active", onOpen }: ProjectCardProps) {
  return (
    <div className="panel">
      <strong>{name}</strong> · {hours} h · <em>{status}</em>{" "}
      <button type="button" onClick={() => onOpen(name)}>
        Abrir
      </button>
    </div>
  );
}

export function ProjectCardDemo() {
  const [opened, setOpened] = useState("—");
  return (
    <div>
      <ProjectCard name="Planner" hours={12} onOpen={setOpened} />
      <ProjectCard name="Reports" hours={3} status="archived" onOpen={setOpened} />
      <p>Último abierto: {opened}</p>
    </div>
  );
}

type CardProps = { title: string; actions?: ReactNode; children: ReactNode };

export function Card({ title, actions, children }: CardProps) {
  return (
    <section className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function CardDemo() {
  return (
    <Card title="Horas de la semana" actions={<button type="button">Exportar</button>}>
      <p>
        children puede ser texto, {"números: "}
        {42}, elementos…
      </p>
      {null}
      {false}
      <ul>
        {["lun 8 h", "mar 6 h"].map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </Card>
  );
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export function TypedForm() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setName("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // sin esto, el navegador recarga la página
    const data = new FormData(e.currentTarget); // currentTarget: el <form>, tipado
    setLog((prev) => [...prev.slice(-3), `enviado: ${String(data.get("name"))} · ${hours} h`]);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <input
          name="name"
          value={name}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
          placeholder="Proyecto (Esc borra)"
          aria-label="proyecto"
        />
        <input
          type="number"
          min={0}
          value={hours}
          onChange={(e) => setHours(e.target.valueAsNumber || 0)} // inline: e se infiere solo
          aria-label="horas"
          style={{ width: 80 }}
        />
        <button type="submit">Enviar</button>
      </div>
      <ol className="console">
        {log.length === 0 ? (
          <li className="muted">La salida aparece aquí</li>
        ) : (
          log.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ol>
    </form>
  );
}

// ─── useState, useRef, useReducer ────────────────────────────────────────────

type User = { id: string; name: string };

type TimerState =
  | { status: "idle" }
  | { status: "running"; startedAt: number }
  | { status: "stopped"; seconds: number };
type TimerAction =
  { type: "start"; now: number } | { type: "stop"; now: number } | { type: "reset" };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "start":
      return { status: "running", startedAt: action.now };
    case "stop":
      return state.status === "running"
        ? { status: "stopped", seconds: Math.round((action.now - state.startedAt) / 100) / 10 }
        : state;
    case "reset":
      return { status: "idle" };
  }
}

export function HooksDemo() {
  const [user, setUser] = useState<User | null>(null); // la unión no se puede inferir de null
  const inputRef = useRef<HTMLInputElement>(null); // ref a un elemento del DOM
  const clicks = useRef(0); // ref a un valor mutable: useRef<number>
  const [timer, dispatch] = useReducer(timerReducer, { status: "idle" });

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <button type="button" onClick={() => setUser(user ? null : { id: "u1", name: "Ana" })}>
          {user ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
        <span>{user ? `Hola, ${user.name}` : "Sin usuario (null)"}</span>
      </div>
      <div className="row">
        <input ref={inputRef} placeholder="useRef<HTMLInputElement>" aria-label="input con ref" />
        <button
          type="button"
          onClick={() => {
            clicks.current += 1;
            inputRef.current?.focus(); // current puede ser null
            if (inputRef.current) inputRef.current.value = `foco #${clicks.current}`;
          }}
        >
          Dar foco
        </button>
      </div>
      <div className="row">
        <button type="button" onClick={() => dispatch({ type: "start", now: Date.now() })}>
          Start
        </button>
        <button type="button" onClick={() => dispatch({ type: "stop", now: Date.now() })}>
          Stop
        </button>
        <button type="button" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </button>
        <span>
          {timer.status === "idle" && "Cronómetro en cero"}
          {timer.status === "running" && "Corriendo…"}
          {timer.status === "stopped" && `Paró en ${timer.seconds} s`}
        </span>
      </div>
    </div>
  );
}

// ─── Props nativas, genéricos y props discriminadas (componentes de react-types.tsx) ──

export function ButtonDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="row">
      <Button variant="primary" onClick={() => setCount((c) => c + 1)} aria-label="sumar">
        Sumar ({count})
      </Button>
      <Button disabled title="las props nativas pasan solas">
        Deshabilitado
      </Button>
    </div>
  );
}

type Project = { id: number; name: string; hours: number };
const PROJECTS: Project[] = [
  { id: 1, name: "Planner", hours: 12 },
  { id: 2, name: "Reports", hours: 3 },
  { id: 3, name: "Timesheets", hours: 7 },
];

export function SelectDemo() {
  const [project, setProject] = useState<Project>(PROJECTS[0]!);
  return (
    <div className="row">
      <Select options={PROJECTS} value={project} onChange={setProject} getLabel={(p) => p.name} />
      <span>
        onChange recibe el objeto completo: <code>{JSON.stringify(project)}</code>
      </span>
    </div>
  );
}

export function ActionDemo() {
  const [clicked, setClicked] = useState(0);
  return (
    <div className="row">
      <Action as="button" onClick={() => setClicked((c) => c + 1)}>
        Soy un botón ({clicked})
      </Action>
      <Action as="link" href="#02-typescript/typing-react">
        Soy un link
      </Action>
    </div>
  );
}

// ─── Context tipado ──────────────────────────────────────────────────────────

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}

/** El hook tira un error claro si se usa fuera del provider, y devuelve el tipo sin null. */
export function useTheme(): ThemeContextValue {
  const value = use(ThemeContext);
  if (!value) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return value;
}

function ThemedBox() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: dark ? "#1b1e27" : "#f6f7fb",
        color: dark ? "#e6e8ef" : "#1b1e27",
        border: "1px solid var(--line)",
      }}
    >
      Tema: <strong>{theme}</strong>{" "}
      <button type="button" onClick={toggle} style={{ color: "inherit" }}>
        Cambiar
      </button>
    </div>
  );
}

export function ThemeDemo() {
  return (
    <ThemeProvider>
      <ThemedBox />
    </ThemeProvider>
  );
}

/** Sin provider: el hook lanza y el error boundary de <Live> lo muestra. */
export function ThemeWithoutProvider() {
  const [show, setShow] = useState(false);
  return show ? (
    <ThemedBox />
  ) : (
    <button type="button" onClick={() => setShow(true)}>
      Renderizar ThemedBox sin provider
    </button>
  );
}

// ─── Custom hook con tupla as const ──────────────────────────────────────────

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const; // readonly [boolean, () => void], no (boolean | (() => void))[]
}

export function ToggleDemo() {
  const [open, toggleOpen] = useToggle();
  const [compact, toggleCompact] = useToggle(true);
  return (
    <div className="row">
      <button type="button" onClick={toggleOpen}>
        Detalles: {open ? "abiertos" : "cerrados"}
      </button>
      <button type="button" onClick={toggleCompact}>
        Vista: {compact ? "compacta" : "amplia"}
      </button>
    </div>
  );
}
