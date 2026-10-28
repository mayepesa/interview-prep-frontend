import { useSyncExternalStore } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

export const meta: DemoMeta = {
  title: "useSyncExternalStore: un mini Zustand",
  section: "react-intermediate",
  order: 310,
  questions: [
    "¿Para qué sirve el hook useSyncExternalStore?",
    "¿Cómo funciona por dentro una librería como Zustand?",
    "¿Qué es Flux?",
  ],
  sayIt:
    "useSyncExternalStore subscribes a component to a store that lives outside React, safely with concurrent rendering. Zustand is built on it: a store holds state, components subscribe with a selector, and they only re-render when their selected slice changes.",
};

// Un store mínimo, igual en espíritu a Zustand.
function createStore<S>(initial: S) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getState: () => state,
    setState: (update: (s: S) => S) => {
      state = update(state);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const timerStore = createStore({ project: "Planner", seconds: 0, running: false });
let interval: number | undefined;

const actions = {
  toggle() {
    const running = !timerStore.getState().running;
    timerStore.setState((s) => ({ ...s, running }));
    window.clearInterval(interval);
    if (running)
      interval = window.setInterval(
        () => timerStore.setState((s) => ({ ...s, seconds: s.seconds + 1 })),
        1000,
      );
  },
  rename(project: string) {
    timerStore.setState((s) => ({ ...s, project }));
  },
};

// Hook con selector: el componente solo se actualiza si cambia lo que selecciona.
function useTimer<T>(selector: (s: ReturnType<typeof timerStore.getState>) => T): T {
  return useSyncExternalStore(timerStore.subscribe, () => selector(timerStore.getState()));
}

function Seconds() {
  const seconds = useTimer((s) => s.seconds);
  const renders = useRenderCount();
  return (
    <p>
      Segundos: {seconds} <span className="render-count">{renders}</span>
    </p>
  );
}

function ProjectName() {
  const project = useTimer((s) => s.project);
  const renders = useRenderCount();
  return (
    <label className="row">
      Proyecto <input value={project} onChange={(e) => actions.rename(e.target.value)} />
      <span className="render-count">{renders}</span>
    </label>
  );
}

function Toggle() {
  const running = useTimer((s) => s.running);
  return (
    <button type="button" onClick={actions.toggle}>
      {running ? "Pausar" : "Iniciar"}
    </button>
  );
}

export default function SyncExternalStoreDemo() {
  return (
    <>
      <Panel title="Store fuera de React con selectores">
        <Toggle />
        <Seconds />
        <ProjectName />
        <Note>
          Con el timer corriendo, solo Seconds se re-renderiza cada segundo; ProjectName no, porque
          su selector devuelve el mismo string. El store sigue vivo aunque cambies de ejemplo.
        </Note>
      </Panel>
      <Panel title="Flux en una línea">
        <Snippet>{`acción → dispatcher/store → nueva vista (flujo unidireccional)`}</Snippet>
        <Note>Redux y Zustand siguen esta idea: el estado solo cambia mediante acciones.</Note>
      </Panel>
    </>
  );
}
