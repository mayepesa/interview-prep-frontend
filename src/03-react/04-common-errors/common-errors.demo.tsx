import type { DemoMeta } from "../../app/registry";
import { Note, Panel, Snippet } from "../../app/ui";

export const meta: DemoMeta = {
  title: "Errores típicos y cómo leerlos",
  section: "react-errors",
  order: 500,
  questions: [
    "Warning: Each child in a list should have a unique key prop",
    "React Hook useXXX is called conditionally",
    "Can't perform a React state update on an unmounted component",
    "Too many re-renders. React limits the number of renders to prevent an infinite loop",
    "Objects are not valid as a React child",
    "Maximum update depth exceeded",
  ],
  sayIt:
    "Most React errors map to a few causes: missing keys in lists, hooks called conditionally, async work that finishes after unmount, or setting state during render. When I see one, I read the component stack in the console, reproduce it, and fix the cause rather than silencing the warning.",
};

export default function CommonErrors() {
  return (
    <>
      <Panel title="Each child in a list should have a unique key prop">
        <Snippet tone="bad">{`items.map((item) => <Row item={item} />)`}</Snippet>
        <Snippet tone="good">{`items.map((item) => <Row key={item.id} item={item} />)`}</Snippet>
        <Note>La key va en el elemento que devuelve el map, no dentro de Row.</Note>
      </Panel>

      <Panel title="React Hook is called conditionally">
        <Snippet tone="bad">{`
if (!user) return null;
const [tab, setTab] = useState("week"); // se salta en algunos renders
        `}</Snippet>
        <Snippet tone="good">{`
const [tab, setTab] = useState("week");
if (!user) return null; // los returns tempranos van DESPUÉS de los hooks
        `}</Snippet>
      </Panel>

      <Panel title="State update on an unmounted component">
        <Snippet tone="bad">{`
useEffect(() => {
  fetch(url).then((r) => r.json()).then(setData); // puede llegar tras desmontar
}, [url]);
        `}</Snippet>
        <Snippet tone="good">{`
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then((r) => r.json()).then(setData)
    .catch((e) => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort();
}, [url]);
        `}</Snippet>
        <Note>
          React 18+ ya no muestra este warning, pero el problema (y la race condition) sigue
          existiendo.
        </Note>
      </Panel>

      <Panel title="Too many re-renders">
        <Snippet tone="bad">{`<button onClick={setCount(count + 1)}>  // se llama en el render → bucle`}</Snippet>
        <Snippet tone="good">{`<button onClick={() => setCount(count + 1)}>`}</Snippet>
        <Snippet tone="bad">{`
function Total({ items }) {
  const [total, setTotal] = useState(0);
  setTotal(sum(items)); // setState durante el render → bucle
}
        `}</Snippet>
        <Snippet tone="good">{`const total = sum(items); // estado derivado: se calcula`}</Snippet>
      </Panel>

      <Panel title="Maximum update depth exceeded">
        <Snippet tone="bad">{`
useEffect(() => {
  setFilters({ ...filters, page: 1 }); // cambia filters → efecto otra vez → …
}, [filters]);
        `}</Snippet>
        <Note>
          Un efecto que actualiza su propia dependencia. Suele significar que ese estado debería
          calcularse o actualizarse en el event handler, no en un efecto.
        </Note>
      </Panel>

      <Panel title="Objects are not valid as a React child">
        <Snippet tone="bad">{`<p>{user}</p>  // user es un objeto`}</Snippet>
        <Snippet tone="good">{`<p>{user.name}</p>  // o JSON.stringify(user) para depurar`}</Snippet>
      </Panel>
    </>
  );
}
