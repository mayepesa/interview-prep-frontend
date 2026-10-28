import { useState } from "react";
import { isSafeUrl, sanitizeHtml } from "./sanitize";

const PAYLOAD =
  '<p>Comentario con <strong>formato</strong></p><img src="x" onerror="document.title=\'hackeado\'">';
const ORIGINAL_TITLE = typeof document === "undefined" ? "" : document.title;

function HtmlInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      style={{ width: "100%" }}
      aria-label="HTML que escribió el usuario"
    />
  );
}

const output = { border: "1px solid var(--line)", borderRadius: 6, padding: 8, marginTop: 8 };

/** React escapa lo que va entre llaves: el HTML se muestra como texto. */
export function EscapedText() {
  const [html, setHtml] = useState(PAYLOAD);
  return (
    <div>
      <HtmlInput value={html} onChange={setHtml} />
      <div style={output}>{html}</div>
    </div>
  );
}

/** dangerouslySetInnerHTML sin sanitizar: el onerror se ejecuta. */
export function UnsafeHtml() {
  const [html, setHtml] = useState(PAYLOAD);
  const [on, setOn] = useState(false);
  return (
    <div>
      <HtmlInput value={html} onChange={setHtml} />
      <div className="row" style={{ marginTop: 8 }}>
        <label className="row">
          <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
          renderizar sin sanitizar
        </label>
        <button type="button" onClick={() => (document.title = ORIGINAL_TITLE)}>
          Restaurar título de la pestaña
        </button>
      </div>
      {on && <div style={output} dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
}

/** El mismo HTML pasado por un sanitizador con lista de permitidos. */
export function SanitizedHtml() {
  const [html, setHtml] = useState(PAYLOAD + '<a href="javascript:alert(1)">ver más</a>');
  const clean = sanitizeHtml(html);
  return (
    <div>
      <HtmlInput value={html} onChange={setHtml} />
      <div style={output} dangerouslySetInnerHTML={{ __html: clean }} />
      <pre className="snippet">
        <code>{clean}</code>
      </pre>
    </div>
  );
}

/** Validar el esquema de una URL antes de ponerla en un href. */
export function SafeLink() {
  const [url, setUrl] = useState("javascript:alert('xss')");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="URL del perfil del usuario"
      />
      <p style={{ margin: 0 }}>
        {isSafeUrl("href", url) ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Abrir el sitio web del usuario
          </a>
        ) : (
          <span style={{ color: "var(--bad)" }}>
            URL bloqueada: solo se permiten http, https y mailto
          </span>
        )}
      </p>
    </div>
  );
}
