/** Módulo que se carga bajo demanda: Vite lo pone en su propio chunk porque solo se importa con import(). */
export default function HeavyReport() {
  const rows = Array.from({ length: 5 }, (_, i) => ({ week: 40 + i, hours: 32 + ((i * 7) % 9) }));
  return (
    <table>
      <thead>
        <tr>
          <th align="left">Semana</th>
          <th align="left">Horas</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.week}>
            <td>{r.week}</td>
            <td>
              {"▇".repeat(r.hours / 4)} {r.hours} h
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
