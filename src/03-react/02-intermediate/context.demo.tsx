import { createContext, memo, use, useMemo, useState, type ReactNode } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

export const meta: DemoMeta = {
  title: "Context y cómo evitar re-renders",
  section: "react-intermediate",
  order: 240,
  questions: [
    "¿Qué es el contexto? ¿Cómo se crea y se consume?",
    "¿Cómo evitar re-renders innecesarios al usar Context?",
    "¿Qué es la función use?",
    "¿Cuándo usar Context y cuándo una librería de estado (Zustand, Redux)?",
  ],
  sayIt:
    "Context passes data deep without prop drilling, but every consumer re-renders when the value changes. I keep values small, memoize the value object, and split state and setters into separate contexts. For frequently changing global state I prefer Zustand, where components subscribe to a slice.",
};

type Theme = "dark" | "light";

// Patrón: un contexto para el valor y otro para las acciones (que nunca cambian).
const ThemeValueContext = createContext<Theme>("dark");
const ThemeActionsContext = createContext<{ toggle: () => void } | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  // Sin useMemo, el objeto sería nuevo en cada render y todos los consumidores se renderizarían.
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

// `use` (React 19) lee un contexto; a diferencia de useContext, se puede llamar dentro de un if.
const ThemedBox = memo(function ThemedBox() {
  const theme = use(ThemeValueContext);
  const renders = useRenderCount();
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: theme === "dark" ? "#222" : "#eee",
        color: theme === "dark" ? "#eee" : "#222",
      }}
    >
      Tema: {theme} <span className="render-count">lee el valor: {renders}</span>
    </div>
  );
});

const ToggleButton = memo(function ToggleButton() {
  const actions = use(ThemeActionsContext);
  const renders = useRenderCount();
  return (
    <button type="button" onClick={() => actions?.toggle()}>
      Cambiar tema <span className="render-count">solo acciones: {renders}</span>
    </button>
  );
});

const Unrelated = memo(function Unrelated() {
  const renders = useRenderCount();
  return <span className="render-count">no usa contexto: {renders}</span>;
});

export default function ContextDemo() {
  return (
    <>
      <Panel title="Contextos separados para valor y acciones">
        <ThemeProvider>
          <div style={{ display: "grid", gap: 8 }}>
            <ThemedBox />
            <ToggleButton />
            <Unrelated />
          </div>
        </ThemeProvider>
        <Note>
          Al cambiar el tema, solo se renderiza ThemedBox. El botón lee un contexto que nunca
          cambia, así que no se vuelve a renderizar.
        </Note>
      </Panel>
      <Panel title="Crear y consumir">
        <Snippet>{`
const ThemeContext = createContext<Theme>("dark");

<ThemeContext value={theme}>{children}</ThemeContext>  // React 19 (antes: .Provider)

const theme = use(ThemeContext);  // o useContext(ThemeContext)
        `}</Snippet>
      </Panel>
    </>
  );
}
