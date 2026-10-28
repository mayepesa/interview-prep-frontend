import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("typescript", typescript);

/** Muestra un archivo real del repo con resaltado de sintaxis y números de línea. */
export function CodeFile({ code, name }: { code: string; name: string }) {
  // highlight.js escapa el código antes de agregar sus <span>, así que el HTML es seguro.
  const html = hljs.highlight(code.trimEnd(), { language: "typescript" }).value;
  const lines = html.split("\n");

  return (
    <figure className="code-file">
      <figcaption>{name}</figcaption>
      <pre>
        <code className="hljs">
          {lines.map((line, i) => (
            <span key={i} className="code-line">
              <span className="line-number">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: line || " " }} />
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
