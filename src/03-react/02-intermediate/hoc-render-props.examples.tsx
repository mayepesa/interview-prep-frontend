import { Component, useState, type ComponentType, type PointerEvent, type ReactNode } from "react";

type Point = { x: number; y: number };

const areaStyle = {
  height: 70,
  border: "1px dashed var(--line)",
  borderRadius: 8,
  padding: 8,
  touchAction: "none",
} as const;

/** La lógica compartida: posición del puntero relativa a un elemento. */
export function usePointer() {
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
  };
  return { position, onPointerMove };
}

/* ---------- 1. HOC ---------- */

export function withPointer<P extends object>(Wrapped: ComponentType<P & { position: Point }>) {
  function WithPointer(props: P) {
    const { position, onPointerMove } = usePointer();
    return (
      <div onPointerMove={onPointerMove} style={areaStyle}>
        <Wrapped {...props} position={position} />
      </div>
    );
  }
  WithPointer.displayName = `withPointer(${Wrapped.displayName ?? Wrapped.name})`;
  return WithPointer;
}

function Coordinates({ position, label }: { position: Point; label: string }) {
  return (
    <span>
      {label}: x = {position.x}, y = {position.y}
    </span>
  );
}

const CoordinatesWithPointer = withPointer<{ label: string }>(Coordinates);

export function HocDemo() {
  return <CoordinatesWithPointer label="HOC" />;
}

/* ---------- 2. Render prop ---------- */

export function PointerTracker({ children }: { children: (position: Point) => ReactNode }) {
  const { position, onPointerMove } = usePointer();
  return (
    <div onPointerMove={onPointerMove} style={areaStyle}>
      {children(position)}
    </div>
  );
}

export function RenderPropDemo() {
  return (
    <PointerTracker>
      {({ x, y }) => (
        <span>
          Render prop: {x > 150 ? "derecha" : "izquierda"} ({x}, {y})
        </span>
      )}
    </PointerTracker>
  );
}

/* ---------- 3. Hook ---------- */

export function HookDemo() {
  const { position, onPointerMove } = usePointer();
  return (
    <div onPointerMove={onPointerMove} style={areaStyle}>
      Hook: x = {position.x}, y = {position.y}
    </div>
  );
}

/* ---------- Clase vs función ---------- */

export class ClassCounter extends Component<{ step: number }, { count: number }> {
  state = { count: 0 };

  // Arrow function como propiedad: así `this` no se pierde al pasarla a onClick.
  increment = () => this.setState((s) => ({ count: s.count + this.props.step }));

  render() {
    return (
      <button type="button" onClick={this.increment}>
        Clase: {this.state.count}
      </button>
    );
  }
}

export function FunctionCounter({ step }: { step: number }) {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((c) => c + step)}>
      Función: {count}
    </button>
  );
}
