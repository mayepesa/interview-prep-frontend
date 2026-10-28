import { createContext, Fragment, use, useId, useState, type ReactNode } from "react";

/** Dos celdas que se insertan dentro de un <tr>: un <div> rompería la tabla. */
function Cells({ project, hours }: { project: string; hours: number }) {
  return (
    <>
      <td style={{ paddingRight: 16 }}>{project}</td>
      <td>{hours} h</td>
    </>
  );
}

export function FragmentTable() {
  return (
    <table>
      <tbody>
        <tr>
          <Cells project="Capacity planner" hours={12} />
        </tr>
        <tr>
          <Cells project="Timesheet" hours={32} />
        </tr>
      </tbody>
    </table>
  );
}

function ActionsWithDiv() {
  return (
    <div>
      <button type="button">Editar</button>
      <button type="button">Borrar</button>
    </div>
  );
}

function ActionsWithFragment() {
  return (
    <>
      <button type="button">Editar</button>
      <button type="button">Borrar</button>
    </>
  );
}

/** Mismo contenedor flex: con un <div> los botones pierden el gap y se agrupan. */
export function FragmentFlexDemo() {
  const toolbar = {
    display: "flex",
    gap: 12,
    justifyContent: "space-between",
    border: "1px dashed var(--line)",
    padding: 8,
    borderRadius: 8,
  } as const;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div>
        <code>{"<div>"}</code> extra:
        <div style={toolbar}>
          <strong>Revisar PR</strong>
          <ActionsWithDiv />
        </div>
      </div>
      <div>
        <code>{"<>…</>"}</code> Fragment:
        <div style={toolbar}>
          <strong>Revisar PR</strong>
          <ActionsWithFragment />
        </div>
      </div>
    </div>
  );
}

const GLOSSARY = [
  { term: "Fragment", definition: "Agrupa elementos sin agregar un nodo al DOM." },
  { term: "useId", definition: "Genera un id único y estable para atributos de accesibilidad." },
  {
    term: "Compound components",
    definition: "Componentes que trabajan juntos y comparten estado implícito.",
  },
];

/** Fragment con key: cada término produce dos elementos hermanos (dt + dd). */
export function Glossary() {
  return (
    <dl>
      {GLOSSARY.map((item) => (
        <Fragment key={item.term}>
          <dt>
            <strong>{item.term}</strong>
          </dt>
          <dd style={{ marginBottom: 8 }}>{item.definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

/** useId: ids únicos y estables para conectar label, input y descripción. */
function Field({ label, hint, type = "text" }: { label: string; hint: string; type?: string }) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div style={{ display: "grid", gap: 4, marginBottom: 8 }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} aria-describedby={hintId} />
      <small id={hintId} className="note">
        {hint} · <code>id = {id}</code>
      </small>
    </div>
  );
}

export function UseIdDemo() {
  return (
    <div>
      <Field label="Proyecto" hint="Nombre como aparece en Jira" />
      <Field label="Horas" hint="Máximo 24 por día" type="number" />
    </div>
  );
}

// ---- Compound components: Tabs ----

type TabsContextValue = { active: string; setActive: (value: string) => void };

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("Tabs.* debe usarse dentro de <Tabs>");
  return ctx;
}

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

function TabList({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" className="row" style={{ marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  const selected = active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => setActive(value)}
      style={{
        borderColor: selected ? "var(--accent)" : undefined,
        fontWeight: selected ? 700 : undefined,
      }}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === value ? <div role="tabpanel">{children}</div> : null;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export function TabsDemo() {
  return (
    <Tabs defaultValue="week">
      <Tabs.List>
        <Tabs.Tab value="week">Semana</Tabs.Tab>
        <Tabs.Tab value="month">Mes</Tabs.Tab>
        <Tabs.Tab value="year">Año</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="week">Vista semanal: 40 h registradas.</Tabs.Panel>
      <Tabs.Panel value="month">Vista mensual: 168 h registradas.</Tabs.Panel>
      <Tabs.Panel value="year">
        <p style={{ margin: 0 }}>Vista anual, con contenido libre adentro:</p>
        <ul>
          <li>Q1: 480 h</li>
          <li>Q2: 512 h</li>
        </ul>
      </Tabs.Panel>
    </Tabs>
  );
}

function LooseTab() {
  return <Tabs.Tab value="week">Tab suelto</Tabs.Tab>;
}

/** Usar una pieza fuera del padre lanza un error claro (lo atrapa el error boundary del ejemplo). */
export function TabOutsideTabs() {
  const [show, setShow] = useState(false);
  return show ? (
    <LooseTab />
  ) : (
    <button type="button" onClick={() => setShow(true)}>
      Renderizar Tabs.Tab fuera de Tabs
    </button>
  );
}
