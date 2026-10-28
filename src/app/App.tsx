import { Component, useEffect, useState, type ReactNode } from "react";
import { demos, demosBySection, SECTIONS } from "./registry";

function useHashRoute(): string {
  const read = () => decodeURIComponent(window.location.hash.slice(1));
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

class DemoBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="alert" role="alert">
          <strong>Este ejemplo lanzó un error:</strong> {this.state.error.message}
          <button type="button" onClick={() => this.setState({ error: null })}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const route = useHashRoute();
  const current = demos.find((demo) => demo.id === route) ?? demos[0];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>
          Interview prep
          <small>front end</small>
        </h1>
        <nav aria-label="Ejemplos">
          {demosBySection().map(([section, list]) => (
            <section key={section}>
              <h2>{SECTIONS[section]}</h2>
              <ul>
                {list.map((demo) => (
                  <li key={demo.id}>
                    <a
                      href={`#${demo.id}`}
                      aria-current={demo.id === current?.id ? "page" : undefined}
                    >
                      {demo.meta.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>

      <main className="content">
        {current ? (
          <article key={current.id}>
            <p className="eyebrow">{SECTIONS[current.meta.section]}</p>
            <h2>{current.meta.title}</h2>
            <p className="source">
              Código: <code>{current.path}</code>
            </p>

            <details open className="questions">
              <summary>Preguntas que responde ({current.meta.questions.length})</summary>
              <ul>
                {current.meta.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </details>

            <div className="demo">
              <DemoBoundary>
                <current.Component />
              </DemoBoundary>
            </div>

            <blockquote className="say-it">
              <span>Say it in the interview</span>
              {current.meta.sayIt}
            </blockquote>
          </article>
        ) : (
          <p>No hay ejemplos.</p>
        )}
      </main>
    </div>
  );
}
