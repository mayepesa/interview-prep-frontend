import { useSyncExternalStore } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

/* ---------- 1. Suscribirse a una API del navegador ---------- */

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function useWindowWidth() {
  return useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth, // getSnapshot: un número, siempre comparable
    () => 1024, // getServerSnapshot: valor para SSR
  );
}

export function WindowWidthLabel() {
  const width = useWindowWidth();
  return (
    <p>
      Ancho de la ventana: <strong>{width}px</strong> ({width < 700 ? "móvil" : "escritorio"})
    </p>
  );
}

/* ---------- 2. Un mini Zustand ---------- */

export function createStore<S>(initial: S) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getState: () => state,
    setState: (update: (s: S) => S) => {
      state = update(state); // estado inmutable: referencia nueva
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

type TimerState = { project: string; seconds: number; running: boolean };
const timerStore = createStore<TimerState>({ project: "Planner", seconds: 0, running: false });
let interval: number | undefined;

const actions = {
  toggle() {
    const running = !timerStore.getState().running;
    timerStore.setState((s) => ({ ...s, running }));
    window.clearInterval(interval);
    if (running) {
      interval = window.setInterval(
        () => timerStore.setState((s) => ({ ...s, seconds: s.seconds + 1 })),
        1000,
      );
    }
  },
  rename(project: string) {
    timerStore.setState((s) => ({ ...s, project }));
  },
};

// Hook con selector: el componente solo se actualiza si cambia lo que selecciona.
function useTimer<T>(selector: (s: TimerState) => T): T {
  return useSyncExternalStore(timerStore.subscribe, () => selector(timerStore.getState()));
}

function Seconds() {
  const seconds = useTimer((s) => s.seconds);
  const renders = useRenderCount();
  return (
    <p className="row">
      Segundos: {seconds} <RenderCount label="Seconds" count={renders} />
    </p>
  );
}

function ProjectName() {
  const project = useTimer((s) => s.project);
  const renders = useRenderCount();
  return (
    <label className="row">
      Proyecto <input value={project} onChange={(e) => actions.rename(e.target.value)} />
      <RenderCount label="ProjectName" count={renders} />
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

export function TimerStoreDemo() {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <Toggle />
      <Seconds />
      <ProjectName />
    </div>
  );
}

/* ---------- 3. Reducer estilo Redux (lógica pura) ---------- */

export type Action = { type: "added"; hours: number } | { type: "reset" };

export function hoursReducer(state: { total: number; entries: number }, action: Action) {
  switch (action.type) {
    case "added":
      return { total: state.total + action.hours, entries: state.entries + 1 };
    case "reset":
      return { total: 0, entries: 0 };
  }
}
