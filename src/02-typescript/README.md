# TypeScript

La teoría y los ejemplos están en las páginas `.mdx` (ábrelas con `npm run dev`, sección **TypeScript**). Los bloques de código muestran en comentarios el tipo inferido o el error exacto del compilador.

| Página                                         | Temas                                                                                                                                                                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`ts-basics.mdx`](ts-basics.mdx)               | Por qué TS, inferencia, `type` vs `interface`, uniones e intersecciones, literales, `any`/`unknown`/`never`, narrowing, type guards, uniones discriminadas con `never` exhaustivo, opcional y `readonly`, `as` y `!`, `strict` y `noUncheckedIndexedAccess` |
| [`generics-utility.mdx`](generics-utility.mdx) | Generics (restricciones, `keyof`, defaults), utility types, `typeof`, indexed access, `as const`, `satisfies`, mapped, conditional + `infer`, template literal types                                                                                        |
| [`typing-react.mdx`](typing-react.mdx)         | Props, `children`/`ReactNode`, eventos, `useState`/`useRef`/`useReducer`, extender props nativas, componentes genéricos, props discriminadas, context, custom hooks con `as const`                                                                          |

Los tipos de ejemplo viven en `types.ts` y `react-types.tsx`, con tests que prueban **tipos** además de valores (`expectTypeOf` y `@ts-expect-error`).
