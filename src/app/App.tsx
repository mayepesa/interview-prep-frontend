import { Suspense, useEffect, useRef, useState } from "react";
import { pages, pagesBySection, SECTIONS } from "./registry";

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

type Heading = { id: string; text: string };

/** Lee los títulos ## de la página (que carga en diferido) para armar el índice. */
function useHeadings(dependency: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const read = () => {
      const nodes = container.querySelectorAll("h2");
      setHeadings(
        [...nodes].map((node, i) => {
          node.id ||= `concepto-${i + 1}`;
          return { id: node.id, text: node.textContent ?? "" };
        }),
      );
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(container, { childList: true });
    return () => observer.disconnect();
  }, [dependency]);

  return { ref, headings };
}

export function App() {
  const route = useHashRoute();
  const index = Math.max(
    0,
    pages.findIndex((p) => p.id === route),
  );
  const current = pages[index];
  const prev = pages[index - 1];
  const next = pages[index + 1];
  const { ref, headings } = useHeadings(current?.id ?? "");

  // Con llaves: en Chrome reciente scrollTo devuelve una promesa, y un efecto solo puede devolver su cleanup.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current?.id]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>
          Interview prep
          <small>front end · teoría + ejemplos</small>
        </h1>
        <nav aria-label="Temas">
          {pagesBySection().map(([section, list]) => (
            <section key={section}>
              <h2>{SECTIONS[section]}</h2>
              <ul>
                {list.map((page) => (
                  <li key={page.id}>
                    <a
                      href={`#${page.id}`}
                      aria-current={page.id === current?.id ? "page" : undefined}
                    >
                      {page.meta.title}
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
            <header className="page-header">
              <p className="eyebrow">{SECTIONS[current.meta.section]}</p>
              <h1>{current.meta.title}</h1>
              <p className="summary">
                {/* Lo que va entre `backticks` en el resumen se muestra como código. */}
                {current.meta.summary
                  .split("`")
                  .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))}
              </p>
              {headings.length > 1 && (
                <nav className="toc" aria-label="En esta página">
                  <p className="block-label">En esta página</p>
                  <ol>
                    {headings.map((h) => (
                      <li key={h.id}>
                        <button
                          type="button"
                          className="link"
                          onClick={() =>
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          {h.text}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </header>

            <div ref={ref} className="prose">
              <Suspense fallback={<p className="summary">Cargando…</p>}>
                <current.Content />
              </Suspense>
            </div>

            <footer className="pager">
              {prev ? <a href={`#${prev.id}`}>← {prev.meta.title}</a> : <span />}
              {next ? <a href={`#${next.id}`}>{next.meta.title} →</a> : <span />}
            </footer>
            <p className="source">
              Archivo: <code>{current.path}</code>
            </p>
          </article>
        ) : (
          <p>No hay páginas.</p>
        )}
      </main>
    </div>
  );
}
