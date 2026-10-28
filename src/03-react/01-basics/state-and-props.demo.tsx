import { useState } from "react";
import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Estado, props y useState",
  section: "react-basics",
  order: 110,
  questions: [
    "¿Qué es el estado en React? ¿Qué diferencia hay entre props y state?",
    "¿Qué hace el hook useState?",
    "¿Por qué debemos usar una función para actualizar el estado?",
    "¿Se puede inicializar un estado con el valor de una prop? ¿Qué hay que tener en cuenta?",
    "¿Qué es el batching de actualizaciones?",
  ],
  sayIt:
    "Props come from the parent and are read-only; state belongs to the component and triggers a re-render when it changes. When the next value depends on the previous one, I use the updater function, because updates are batched.",
};

function Counter() {
  const [count, setCount] = useState(0);

  // Las 3 llamadas leen el mismo `count` del render actual: suma 1, no 3.
  const addThreeWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  // Con la función, cada actualización recibe el valor anterior en la cola: suma 3.
  const addThreeRight = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div className="row">
      <output aria-label="contador">{count}</output>
      <button type="button" onClick={addThreeWrong}>
        +3 con valor (falla)
      </button>
      <button type="button" onClick={addThreeRight}>
        +3 con función (bien)
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// Inicializar estado desde una prop: el estado SOLO toma el valor inicial.
function NameEditor({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return (
    <label className="row">
      Nombre (copia local): <input value={name} onChange={(e) => setName(e.target.value)} />
    </label>
  );
}

export default function StateAndProps() {
  const [user, setUser] = useState("Maria");

  return (
    <>
      <Panel title="Actualizar con valor vs con función">
        <Counter />
        <Note>
          React agrupa (batching) las actualizaciones de un mismo evento y renderiza una sola vez.
        </Note>
      </Panel>

      <Panel title="Estado inicializado desde una prop">
        <div className="row">
          Prop en el padre: <strong>{user}</strong>
          <button type="button" onClick={() => setUser(user === "Maria" ? "Ale" : "Maria")}>
            Cambiar prop
          </button>
        </div>
        <NameEditor initialName={user} />
        <NameEditor key={user} initialName={user} />
        <Note>
          El primer editor ignora los cambios de la prop: useState usa el valor inicial una sola
          vez. El segundo usa <code>key={"{user}"}</code>: al cambiar la key, React lo monta de
          nuevo y vuelve a leer la prop. Usa este patrón solo cuando quieras una copia editable; si
          no, lee la prop directamente.
        </Note>
        <Snippet>{`<NameEditor key={user} initialName={user} />`}</Snippet>
      </Panel>
    </>
  );
}
