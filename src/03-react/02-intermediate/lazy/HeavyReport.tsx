// Este componente vive en su propio chunk: solo se descarga cuando se renderiza.
export function HeavyReport() {
  return (
    <div className="panel">
      <strong>Reporte mensual</strong>
      <p className="note">
        Cargado bajo demanda con React.lazy. Mira la pestaña Network: es otro archivo .js.
      </p>
    </div>
  );
}

export default HeavyReport;
