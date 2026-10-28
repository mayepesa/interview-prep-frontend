import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "HOCs, render props y por qué hoy se usan hooks",
  section: "react-intermediate",
  order: 280,
  questions: [
    "¿Qué son los High Order Components (HOC)?",
    "¿Qué son las render props?",
    "¿Qué son mejores, los componentes de clase o los funcionales?",
  ],
  sayIt:
    "HOCs and render props were the ways to share logic before hooks. A HOC wraps a component and injects props; a render prop passes a function as a child. Today I'd write a custom hook, which shares the same logic without extra wrapper components, but I still see HOCs in older codebases and libraries.",
};

function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

// 1. HOC: función que recibe un componente y devuelve otro con props extra.
function withOnline<P extends object>(Wrapped: ComponentType<P & { online: boolean }>) {
  function WithOnline(props: P) {
    const online = useOnline();
    return <Wrapped {...props} online={online} />;
  }
  WithOnline.displayName = `withOnline(${Wrapped.displayName ?? Wrapped.name})`;
  return WithOnline;
}

function StatusView({ online, label }: { online: boolean; label: string }) {
  return (
    <p>
      {label}: {online ? "en línea" : "sin conexión"}
    </p>
  );
}

// P = las props que sigue recibiendo desde afuera (sin `online`, que lo inyecta el HOC).
const StatusFromHoc = withOnline<{ label: string }>(StatusView);

// 2. Render prop: el componente llama a una función que decide qué pintar.
function Online({ children }: { children: (online: boolean) => ReactNode }) {
  return <>{children(useOnline())}</>;
}

// 3. Hook: la forma actual.
function StatusFromHook() {
  const online = useOnline();
  return <p>Hook: {online ? "en línea" : "sin conexión"}</p>;
}

export default function HocRenderProps() {
  return (
    <>
      <Panel title="La misma lógica, tres formas">
        <StatusFromHoc label="HOC" />
        <Online>{(online) => <p>Render prop: {online ? "en línea" : "sin conexión"}</p>}</Online>
        <StatusFromHook />
        <Note>Desconecta el wifi o usa DevTools → Network → Offline para verlos cambiar.</Note>
      </Panel>
      <Panel title="Comparación">
        <Snippet>{`
const Status = withOnline(View)           // HOC
<Online>{(online) => <View />}</Online>   // render prop
const online = useOnline()                // hook ✓
        `}</Snippet>
        <Note>
          Clases vs funciones: las funciones con hooks son más cortas, más fáciles de testear y
          componer. Las clases solo siguen siendo necesarias para Error Boundaries.
        </Note>
      </Panel>
    </>
  );
}
