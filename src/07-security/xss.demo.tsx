import { useState } from "react";
import type { DemoMeta } from "../app/registry";
import { Note, Panel, Snippet } from "../app/ui";
import { isSafeUrl, sanitizeHtml } from "./sanitize";

export const meta: DemoMeta = {
  title: "XSS, dangerouslySetInnerHTML y URLs peligrosas",
  section: "security",
  order: 800,
  questions: [
    "¿Cómo inyectar HTML directamente en un componente de React? ¿Qué riesgo tiene?",
    "¿Qué es XSS y cómo te protege React?",
    "¿Dónde guardas un token de sesión en el front end?",
    "¿Qué son CSRF, CORS y Content Security Policy?",
    "¿Qué son Trusted Types?",
  ],
  sayIt:
    "React escapes everything it renders, so text from users can't run as code. The risk comes back with dangerouslySetInnerHTML, javascript: URLs, or touching the DOM directly. If I must render HTML, I sanitize it with DOMPurify, and I never put secrets in the bundle.",
};

const PAYLOAD =
  '<p>Comentario con <strong>formato</strong></p><img src="x" onerror="document.title=\'hackeado\'">';

export default function XssDemo() {
  const [html, setHtml] = useState(PAYLOAD);
  const [url, setUrl] = useState("javascript:alert('xss')");
  const [unsafeOn, setUnsafeOn] = useState(false);

  return (
    <>
      <Panel title="Texto normal: React escapa todo">
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
          aria-label="HTML del usuario"
        />
        <div className="panel" style={{ marginTop: 8 }}>
          {html}
        </div>
        <Note>Se ve como texto: el &lt;img onerror&gt; no se ejecuta.</Note>
      </Panel>

      <Panel title="dangerouslySetInnerHTML sin sanitizar">
        <label className="row">
          <input
            type="checkbox"
            checked={unsafeOn}
            onChange={(e) => setUnsafeOn(e.target.checked)}
          />
          Renderizar sin sanitizar (cambia el título de la pestaña)
        </label>
        {unsafeOn && <div className="panel" dangerouslySetInnerHTML={{ __html: html }} />}
        <button type="button" onClick={() => (document.title = "Interview prep · Front end")}>
          Restaurar título
        </button>
      </Panel>

      <Panel title="Con sanitización">
        <div className="panel" dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
        <Snippet tone="good">{`<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />`}</Snippet>
      </Panel>

      <Panel title="URLs con javascript:">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%" }}
          aria-label="URL del usuario"
        />
        <p>
          {isSafeUrl("href", url) ? (
            <a href={url}>Enlace seguro</a>
          ) : (
            <span style={{ color: "var(--bad)" }}>URL bloqueada: esquema no permitido</span>
          )}
        </p>
        <Note>
          React 19 bloquea las URLs javascript: en href, pero validar el esquema sigue siendo buena
          práctica.
        </Note>
      </Panel>
    </>
  );
}
