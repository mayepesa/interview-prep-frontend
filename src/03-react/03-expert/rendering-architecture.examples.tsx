type Log = (...values: unknown[]) => void;

function Greeting({ name, hours }: { name: string; hours: number }) {
  return (
    <section>
      <h2>Hola, {name}</h2>
      <p>{`Esta semana: ${hours} h`}</p>
      <button>Registrar horas</button>
    </section>
  );
}

/** SSR en el navegador: renderToString convierte componentes en un string de HTML. */
export async function renderGreetingToString(log: Log) {
  const { renderToString } = await import("react-dom/server");
  const html = renderToString(<Greeting name="María" hours={32} />);
  log("HTML que enviaría el servidor:");
  log(html);
  log("Es solo texto: el botón todavía no tiene onClick. Eso lo agrega la hidratación.");
}

function Clock({ time }: { time: string }) {
  return <p>{`Hora: ${time}`}</p>;
}

/** Hidratar un HTML "del servidor" con el mismo contenido o con uno distinto. */
export async function hydrate(log: Log, { mismatch }: { mismatch: boolean }) {
  const { hydrateRoot } = await import("react-dom/client");
  const serverTime = "10:00:00";
  const clientTime = mismatch ? new Date().toLocaleTimeString("es") : serverTime;

  const container = document.createElement("div");
  container.innerHTML = `<p>Hora: ${serverTime}</p>`; // lo que "mandó el servidor"
  log(`HTML del servidor: ${container.innerHTML}`);
  log(`El cliente renderiza: <p>Hora: ${clientTime}</p>`);

  let errors = 0;
  const root = hydrateRoot(container, <Clock time={clientTime} />, {
    onRecoverableError: (error) => {
      errors += 1;
      log(`onRecoverableError → ${String((error as Error).message).slice(0, 120)}…`);
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 150));
  log(
    errors === 0
      ? "Hidratación sin errores: React reutilizó el DOM."
      : "React descartó ese HTML y lo volvió a renderizar en el cliente.",
  );
  log(`HTML final: ${container.innerHTML}`);
  root.unmount();
}
