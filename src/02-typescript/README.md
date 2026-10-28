# TypeScript

"Excellent TypeScript" suele ser el primer requisito. Los tests de esta carpeta prueban **tipos** además de valores: `expectTypeOf` falla en `npm run typecheck` si un tipo no es el esperado, y `@ts-expect-error` asegura que algo incorrecto NO compile.

| Archivo                              | Temas                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`types.ts`](types.ts)               | Generics, `keyof`, uniones discriminadas, `never` exhaustivo, type guards, `unknown`, utility types, `as const`, `satisfies`, template literal, mapped y conditional types |
| [`react-types.tsx`](react-types.tsx) | Extender props nativas, componentes genéricos, props que dependen entre sí                                                                                                 |

## Preguntas rápidas

**¿Qué son los generics?**
Tipos con parámetros: una función o componente sirve para muchos tipos sin perder la información. `first<T>(list: T[]): T | undefined`.

> _Generics let one function or component work with many types while keeping them connected, like a Select whose options and onChange share the same type._

**`interface` vs `type`**
Casi intercambiables para objetos. `interface` se puede extender y fusionar (útil para APIs públicas y para ampliar tipos de librerías, como el tema de styled-components). `type` además expresa uniones, intersecciones y tipos derivados.

**`unknown` vs `any`**
`any` apaga el chequeo. `unknown` obliga a validar antes de usar. Todo lo que viene de la red o de `localStorage` entra como `unknown` y pasa por un type guard.

**¿Qué es una unión discriminada?**
Una unión donde un campo literal identifica cada caso (`status: "success" | "error"`). Después de revisar ese campo, TS sabe qué propiedades existen. Hace imposibles los estados imposibles.

**¿Para qué sirve `never`?**
Para el chequeo exhaustivo: en el `default` de un `switch`, si alguien agrega un caso nuevo y no lo maneja, el código deja de compilar.

**`as const` y `satisfies`**
`as const` mantiene los literales (`"draft"` en vez de `string`) y hace todo `readonly`. `satisfies` valida que un objeto cumple un tipo sin perder sus tipos literales.

**Utility types que hay que conocer**
`Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Parameters`, `Awaited`, `NonNullable`.

**¿Cómo tipas los eventos en React?**
`ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent<HTMLButtonElement>`. Si escribes el handler inline, TS los infiere.

**`strict` y `noUncheckedIndexedAccess`**
`strict` activa los chequeos importantes (como null). `noUncheckedIndexedAccess` hace que `list[0]` sea `T | undefined`, que es la verdad. Este repo usa ambos.
