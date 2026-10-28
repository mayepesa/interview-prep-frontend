// PR #142: "Add weekly hours widget"
// Ejercicio: antes de leer los comentarios de la página "Code review", busca los problemas.
// Compila y "funciona", pero tiene al menos 10 problemas.

import { useEffect, useState } from "react";

const API_KEY = "sk_live_EXAMPLE_NOT_REAL"; // para la API de reportes

export default function WeeklyHours(props: any) {
  const [entries, setEntries] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.example.com/entries?user=" + props.userId + "&key=" + API_KEY)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let t = 0;
    for (let i = 0; i < entries.length; i++) {
      t = t + entries[i].hours;
    }
    setTotal(t);
  }, [entries]);

  useEffect(() => {
    window.addEventListener("resize", () => console.log(window.innerWidth));
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {entries.length && <h3>{props.title}</h3>}
      {entries.map((e, i) => (
        <div key={i} onClick={() => props.onSelect(e)}>
          <span dangerouslySetInnerHTML={{ __html: e.description }} />
          {e.hours}h
        </div>
      ))}
      <div>Total: {total}</div>
    </div>
  );
}
