import type { ComponentType } from "react";

export const SECTIONS = {
  "react-basics": "React · Principiante",
  "react-intermediate": "React · Intermedio",
  "react-expert": "React · Experto",
  "react-errors": "React · Errores típicos",
  "css-html": "CSS y HTML",
  performance: "Performance",
  security: "Seguridad",
} as const;

export type SectionId = keyof typeof SECTIONS;

export type DemoMeta = {
  title: string;
  section: SectionId;
  order: number;
  /** Preguntas de entrevista que este ejemplo responde. */
  questions: string[];
  /** Una frase en inglés para decirla tal cual en la entrevista. */
  sayIt: string;
};

export type Demo = {
  id: string;
  path: string;
  meta: DemoMeta;
  Component: ComponentType;
};

type DemoModule = { meta: DemoMeta; default: ComponentType };

const modules = import.meta.glob<DemoModule>("../**/*.demo.tsx", { eager: true });

export const demos: Demo[] = Object.entries(modules)
  .map(([path, mod]) => ({
    id: path.replace("../", "").replace(".demo.tsx", ""),
    path: `src/${path.replace("../", "")}`,
    meta: mod.meta,
    Component: mod.default,
  }))
  .sort((a, b) => a.meta.order - b.meta.order);

export function demosBySection(): [SectionId, Demo[]][] {
  return (Object.keys(SECTIONS) as SectionId[])
    .map((section): [SectionId, Demo[]] => [
      section,
      demos.filter((demo) => demo.meta.section === section),
    ])
    .filter(([, list]) => list.length > 0);
}
