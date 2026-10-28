import { createContext, use, useId, useState, type ReactNode } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Fragments, useId y Compound Components",
  section: "react-basics",
  order: 170,
  questions: [
    "¿Qué son los Fragments? ¿Por qué usarlos en vez de un div?",
    "¿Qué hace el hook useId?",
    "¿Qué es el Compound Components Pattern?",
    "¿Cómo puedes escribir comentarios en JSX?",
  ],
  sayIt:
    "Fragments group elements without adding a DOM node, which keeps tables and flex layouts valid. useId generates stable unique ids for accessibility attributes. Compound components share state through context, so the API reads like HTML: Tabs, Tabs.List, Tabs.Panel.",
};

// useId: ids únicos y estables, también con SSR. Para labels y aria, nunca para keys.
function Field({ label, hint }: { label: string; hint: string }) {
  const id = useId();
  return (
    <div style={{ display: "grid", gap: 4, marginBottom: 8 }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={`${id}-hint`} />
      <small id={`${id}-hint`} className="note">
        {hint}
      </small>
    </div>
  );
}

// Fragment: <tr> solo admite <td> como hijos; un <div> rompería la tabla.
function Cells({ project, hours }: { project: string; hours: number }) {
  return (
    <>
      {/* así se escribe un comentario en JSX */}
      <td>{project}</td>
      <td>{hours} h</td>
    </>
  );
}

// Compound components: Tabs + Tabs.Tab + Tabs.Panel comparten estado por contexto.
const TabsContext = createContext<{ active: string; setActive: (v: string) => void } | null>(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("Tabs.* debe usarse dentro de <Tabs>");
  return ctx;
}

function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

function TabList({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" className="row">
      {children}
    </div>
  );
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active === value}
      onClick={() => setActive(value)}
      style={{ borderColor: active === value ? "var(--accent)" : undefined }}
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

export default function FragmentsUseIdCompound() {
  return (
    <>
      <Panel title="useId para accesibilidad">
        <Field label="Proyecto" hint="Nombre como aparece en Jira" />
        <Field label="Horas" hint="Máximo 24 por día" />
        <Note>Los dos campos usan el mismo componente y aun así sus ids no chocan.</Note>
      </Panel>

      <Panel title="Fragment dentro de una tabla">
        <table>
          <tbody>
            <tr>
              <Cells project="Capacity planner" hours={12} />
            </tr>
          </tbody>
        </table>
      </Panel>

      <Panel title="Compound components">
        <Tabs defaultValue="week">
          <Tabs.List>
            <Tabs.Tab value="week">Semana</Tabs.Tab>
            <Tabs.Tab value="month">Mes</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="week">Vista semanal</Tabs.Panel>
          <Tabs.Panel value="month">Vista mensual</Tabs.Panel>
        </Tabs>
        <Snippet>{`
<Tabs defaultValue="week">
  <Tabs.List>
    <Tabs.Tab value="week">Semana</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="week">…</Tabs.Panel>
</Tabs>
        `}</Snippet>
      </Panel>
    </>
  );
}
