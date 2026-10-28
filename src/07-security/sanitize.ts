/**
 * Sanitizador mínimo con lista de permitidos, para entender la idea.
 * En producción usa DOMPurify: cubre muchísimos casos que este no.
 */
const ALLOWED_TAGS = new Set(["B", "I", "EM", "STRONG", "P", "UL", "OL", "LI", "A", "BR", "CODE"]);
const ALLOWED_ATTRS: Record<string, string[]> = { A: ["href", "title"] };

export function sanitizeHtml(dirty: string): string {
  const doc = new DOMParser().parseFromString(`<div>${dirty}</div>`, "text/html");
  const root = doc.body.firstElementChild!;

  const clean = (node: Element) => {
    for (const child of [...node.children]) {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(
          ...(child.tagName === "SCRIPT" || child.tagName === "STYLE" ? [] : [...child.childNodes]),
        );
        continue;
      }
      for (const attr of [...child.attributes]) {
        const allowed = ALLOWED_ATTRS[child.tagName]?.includes(attr.name) ?? false;
        if (!allowed || !isSafeUrl(attr.name, attr.value)) child.removeAttribute(attr.name);
      }
      clean(child);
    }
  };

  // Repetimos hasta que no cambie: desenvolver un tag puede dejar hijos no permitidos al descubierto.
  let previous = "";
  while (previous !== root.innerHTML) {
    previous = root.innerHTML;
    clean(root);
  }
  return root.innerHTML;
}

/** Bloquea javascript:, data: y otros esquemas en href. */
export function isSafeUrl(attrName: string, value: string): boolean {
  if (attrName !== "href") return true;
  try {
    const url = new URL(value, "https://example.com");
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}
