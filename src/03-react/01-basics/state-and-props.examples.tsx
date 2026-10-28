import { useRef, useState } from "react";
import { RenderCount } from "../../app/ui";
import { useRenderCount } from "../../app/useRenderCount";

/** Cada instancia tiene su propio estado. */
export function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      {label}: {count}
    </button>
  );
}

/** El estado es una foto del render: después de setCount, count sigue igual en este handler. */
export function SnapshotDemo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const handleClick = () => {
    setCount(count + 1);
    setMessage(`Dentro del handler, después de setCount, count todavía vale ${count}`);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        count: {count} (+1)
      </button>
      <p className="note">{message || "Haz clic y lee el mensaje"}</p>
    </div>
  );
}

/** Actualizar con valor vs con función (updater). */
export function UpdaterDemo() {
  const [count, setCount] = useState(0);

  const addThreeWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const addThreeRight = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div className="row">
      <output aria-label="contador" style={{ minWidth: 32, fontWeight: 700 }}>
        {count}
      </output>
      <button type="button" onClick={addThreeWrong}>
        +3 con valor (suma 1)
      </button>
      <button type="button" onClick={addThreeRight}>
        +3 con función (suma 3)
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

/** Varias actualizaciones en el mismo evento (incluso dentro de un setTimeout) → un solo render. */
export function BatchingDemo() {
  const renders = useRenderCount();
  const [hours, setHours] = useState(0);
  const [entries, setEntries] = useState(0);
  const [saved, setSaved] = useState(false);

  const updateAll = () => {
    setHours((h) => h + 8);
    setEntries((e) => e + 1);
    setSaved(true);
  };

  return (
    <div>
      <div className="row">
        <button type="button" onClick={updateAll}>
          3 setState en el clic
        </button>
        <button type="button" onClick={() => setTimeout(updateAll, 0)}>
          3 setState en un setTimeout
        </button>
        <RenderCount label="BatchingDemo" count={renders} />
      </div>
      <p>
        {hours} h · {entries} registros · {saved ? "guardado" : "sin guardar"}
      </p>
    </div>
  );
}

/** useState solo usa la prop como valor INICIAL. */
function NameEditor({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return (
    <input value={name} onChange={(e) => setName(e.target.value)} aria-label="nombre editable" />
  );
}

export function InitialStateFromProps() {
  const [user, setUser] = useState("Maria");

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        Prop en el padre: <strong>{user}</strong>
        <button type="button" onClick={() => setUser(user === "Maria" ? "Ale" : "Maria")}>
          Cambiar usuario
        </button>
      </div>
      <label className="row">
        Sin key (ignora la prop): <NameEditor initialName={user} />
      </label>
      <label className="row">
        Con key=&#123;user&#125; (se reinicia): <NameEditor key={user} initialName={user} />
      </label>
    </div>
  );
}

type Item = { id: number; text: string };

/** Mutar el array no cambia la referencia: React no ve el cambio. */
export function MutationDemo() {
  const [items, setItems] = useState<Item[]>([{ id: 1, text: "Revisar PR" }]);

  const addMutating = () => {
    items.push({ id: items.length + 1, text: `Mutado ${items.length + 1}` });
    setItems(items); // misma referencia → Object.is(prev, next) === true → no hay render
  };

  const addImmutable = () => {
    setItems((prev) => [...prev, { id: prev.length + 1, text: `Copia ${prev.length + 1}` }]);
  };

  return (
    <div>
      <div className="row">
        <button type="button" onClick={addMutating}>
          push + setItems(items)
        </button>
        <button type="button" onClick={addImmutable}>
          setItems([...prev, nuevo])
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

/** useState(fn()) llama a fn en cada render; useState(fn) solo en el primero. */
export function LazyInitDemo() {
  // Contadores de llamadas solo para enseñar (mutar un ref en render no se hace en producción).
  const calls = useRef({ eager: 0, lazy: 0 });
  const loadDraft = (kind: "eager" | "lazy") => {
    calls.current[kind] += 1;
    return "borrador";
  };

  const [eager, setEager] = useState(loadDraft("eager"));
  const [lazy, setLazy] = useState(() => loadDraft("lazy"));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label className="row">
        <code>useState(loadDraft())</code>
        <input value={eager} onChange={(e) => setEager(e.target.value)} aria-label="estado eager" />
        <span className="render-count">llamadas: {calls.current.eager}</span>
      </label>
      <label className="row">
        <code>{"useState(() => loadDraft())"}</code>
        <input value={lazy} onChange={(e) => setLazy(e.target.value)} aria-label="estado lazy" />
        <span className="render-count">llamadas: {calls.current.lazy}</span>
      </label>
    </div>
  );
}

function Child() {
  const renders = useRenderCount();
  return <RenderCount label="Child (sin props)" count={renders} />;
}

/** El hijo se re-renderiza cuando el padre se re-renderiza, aunque no reciba props. */
export function RerenderDemo() {
  const renders = useRenderCount();
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Estado del padre: {count}
        </button>
        <RenderCount label="Parent" count={renders} />
      </div>
      <Child />
    </div>
  );
}
