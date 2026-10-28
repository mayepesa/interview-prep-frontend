import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";

/** Secciones en el orden en que aparecen en el menú. */
export const SECTIONS = {
  start: "Empezar",
  javascript: "JavaScript",
  typescript: "TypeScript",
  "react-basics": "React · Principiante",
  "react-intermediate": "React · Intermedio",
  "react-expert": "React · Experto",
  "react-errors": "React · Errores típicos",
  "css-html": "CSS y HTML",
  performance: "Performance",
  testing: "Testing",
  security: "Seguridad",
  cs: "Fundamentos de CS",
  "code-review": "Code review",
  "soft-skills": "Soft skills",
} as const;

export type SectionId = keyof typeof SECTIONS;

/** Lo que exporta cada página .mdx con `export const meta = { … }`. */
export type PageMeta = {
  title: string;
  section: SectionId;
  /** Orden dentro de la sección. */
  order: number;
  /** Una o dos frases: qué vas a aprender en esta página. */
  summary: string;
};

export type Page = {
  id: string;
  path: string;
  meta: PageMeta;
  Content: ComponentType<{ components?: MDXComponents }>;
};

type PageModule = { meta: PageMeta; default: Page["Content"] };

// Todas las páginas se cargan al inicio: es una app local de estudio, y así
// cambiar de página es instantáneo.
const modules = import.meta.glob<PageModule>("../**/*.mdx", { eager: true });

const sectionOrder = Object.keys(SECTIONS) as SectionId[];

export const pages: Page[] = Object.entries(modules)
  .map(([path, mod]) => ({
    id: path.replace("../", "").replace(/\.mdx$/, ""),
    path: `src/${path.replace("../", "")}`,
    meta: mod.meta,
    Content: mod.default,
  }))
  .sort(
    (a, b) =>
      sectionOrder.indexOf(a.meta.section) - sectionOrder.indexOf(b.meta.section) ||
      a.meta.order - b.meta.order,
  );

export function pagesBySection(): [SectionId, Page[]][] {
  return sectionOrder
    .map((section): [SectionId, Page[]] => [
      section,
      pages.filter((p) => p.meta.section === section),
    ])
    .filter(([, list]) => list.length > 0);
}
