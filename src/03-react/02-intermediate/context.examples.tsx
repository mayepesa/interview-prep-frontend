import { createContext, memo, use, useMemo, useState, type ReactNode } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

type Theme = "dark" | "light";

const boxStyle = (theme: Theme) => ({
  padding: 10,
  borderRadius: 8,
  background: theme === "dark" ? "#222" : "#eee",
  color: theme === "dark" ? "#eee" : "#222",
});

/* ---------- 1. Crear y consumir ---------- */

type ThemeContextValue = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Hook de consumo: falla con un mensaje claro si falta el Provider. */
function useTheme() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const value = useMemo(
    () => ({ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme],
  );
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

function Toolbar() {
  // No recibe ni pasa props: los nietos leen el contexto directamente.
  return (
    <div className="row">
      <ThemedCard />
      <ThemeToggle />
    </div>
  );
}

function ThemedCard() {
  const { theme } = useTheme();
  return <div style={boxStyle(theme)}>Tema actual: {theme}</div>;
}

function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button type="button" onClick={toggle}>
      Cambiar tema
    </button>
  );
}

export function BasicContextDemo() {
  return (
    <ThemeProvider>
      <Toolbar />
    </ThemeProvider>
  );
}

/* ---------- 2. use() dentro de un if ---------- */

const UserContext = createContext<{ name: string } | null>({ name: "María" });

export function ConditionalUse() {
  const [show, setShow] = useState(false);
  return (
    <div className="row">
      <label className="row">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
        Mostrar usuario
      </label>
      <Greeting show={show} />
    </div>
  );
}

function Greeting({ show }: { show: boolean }) {
  if (!show) return <span>(oculto)</span>;
  const user = use(UserContext); // use sí puede ir después de un return / dentro de un if
  return <span>Hola, {user?.name}</span>;
}

/* ---------- 3. Re-renders: un contexto con todo vs contextos separados ---------- */

const NaiveContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

function NaiveProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  // Objeto nuevo en cada render: todos los consumidores se renderizan cuando cambia algo.
  const value = { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
  return <NaiveContext value={value}>{children}</NaiveContext>;
}

const NaiveBox = memo(function NaiveBox() {
  const { theme } = use(NaiveContext);
  const renders = useRenderCount();
  return (
    <div style={boxStyle(theme)}>
      Tema: {theme} <RenderCount label="lee theme" count={renders} />
    </div>
  );
});

const NaiveButton = memo(function NaiveButton() {
  const { toggle } = use(NaiveContext);
  const renders = useRenderCount();
  return (
    <button type="button" onClick={toggle}>
      Cambiar tema <RenderCount label="solo usa toggle" count={renders} />
    </button>
  );
});

export function NaiveContextDemo() {
  return (
    <NaiveProvider>
      <div style={{ display: "grid", gap: 8 }}>
        <NaiveBox />
        <NaiveButton />
      </div>
    </NaiveProvider>
  );
}

const ThemeValueContext = createContext<Theme>("dark");
const ThemeActionsContext = createContext<{ toggle: () => void } | null>(null);

function SplitProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  // Las acciones no dependen del tema: se crean una vez.
  const actions = useMemo(
    () => ({ toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [],
  );
  return (
    <ThemeValueContext value={theme}>
      <ThemeActionsContext value={actions}>{children}</ThemeActionsContext>
    </ThemeValueContext>
  );
}

const SplitBox = memo(function SplitBox() {
  const theme = use(ThemeValueContext);
  const renders = useRenderCount();
  return (
    <div style={boxStyle(theme)}>
      Tema: {theme} <RenderCount label="lee theme" count={renders} />
    </div>
  );
});

const SplitButton = memo(function SplitButton() {
  const actions = use(ThemeActionsContext);
  const renders = useRenderCount();
  return (
    <button type="button" onClick={() => actions?.toggle()}>
      Cambiar tema <RenderCount label="solo usa toggle" count={renders} />
    </button>
  );
});

export function SplitContextDemo() {
  return (
    <SplitProvider>
      <div style={{ display: "grid", gap: 8 }}>
        <SplitBox />
        <SplitButton />
      </div>
    </SplitProvider>
  );
}
