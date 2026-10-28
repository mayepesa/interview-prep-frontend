# Testing

La vacante dice "create unit tests, sometimes integration and performance tests". Esta carpeta tiene los patrones que más se preguntan, y el resto del repo tiene más tests para leer:

| Archivo                                                                                  | Patrón                                                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`TimeEntryForm.test.tsx`](TimeEntryForm.test.tsx)                                       | Formulario: `userEvent`, queries por rol y label, validación accesible, estado de envío, error del servidor |
| [`ProjectSearch.test.tsx`](ProjectSearch.test.tsx)                                       | Mock de `fetch`, timers falsos con debounce, `findBy` para lo asíncrono                                     |
| [`../03-react/hooks/hooks.test.ts`](../03-react/hooks/hooks.test.ts)                     | Testear hooks con `renderHook` y `act`                                                                      |
| [`../03-react/01-basics/use-reducer.test.ts`](../03-react/01-basics/use-reducer.test.ts) | Reducer como función pura                                                                                   |
| [`../05-performance/VirtualList.test.tsx`](../05-performance/VirtualList.test.tsx)       | Lógica pura + componente, `fireEvent.scroll`                                                                |
| [`../02-typescript/types.test.ts`](../02-typescript/types.test.ts)                       | Tests de tipos con `expectTypeOf` y `@ts-expect-error`                                                      |

## Preguntas rápidas

**¿Qué testeas en un componente?**
El comportamiento que ve el usuario: qué se renderiza, qué pasa al interactuar, qué se envía. No el estado interno ni nombres de funciones, para que un refactor no rompa los tests.

> _I test behavior, not implementation: what the user sees and what happens when they interact. That way tests survive refactors._

**Unit vs integration vs E2E**

- _Unit_: una función o un hook aislado. Rápidos, muchos.
- _Integration_: varios componentes juntos, con la red simulada (MSW). Dan más confianza por test.
- _E2E_: el navegador real contra la app (Playwright, Cypress). Pocos, para los flujos críticos (login, registrar horas, pagar).

**¿Qué query de Testing Library usas?**
En orden: `getByRole` (con `name`), `getByLabelText`, `getByText`, y `getByTestId` solo como último recurso. Si no puedes encontrar algo por rol, probablemente tampoco es accesible.

**`getBy` vs `queryBy` vs `findBy`**
`getBy` falla si no existe. `queryBy` devuelve `null` (para afirmar que algo NO está). `findBy` espera, para lo asíncrono.

**`userEvent` vs `fireEvent`**
`userEvent` simula la secuencia real (foco, keydown, input, keyup); `fireEvent` dispara un solo evento. Prefiero `userEvent`.

**¿Cómo testeas algo con timers?**
`vi.useFakeTimers()` y `vi.advanceTimersByTime(ms)`. Con `userEvent` hay que pasarle `advanceTimers`.

**¿Cómo mockeas la red?**
Para un caso aislado, `vi.stubGlobal("fetch", ...)`. En un proyecto real, MSW: define handlers por endpoint y sirve igual en tests, Storybook y desarrollo.

**¿Y los tests de performance?**
Presupuestos de tamaño del bundle en CI, Lighthouse CI para Web Vitals, y para componentes el `Profiler` o tests que cuentan renders. En el día a día: medir antes y después del cambio.

**¿Qué cobertura buscas?**
No un número fijo. Me importa cubrir la lógica de negocio, los casos borde y los flujos críticos. Un 100% de cobertura con tests frágiles vale menos que un 70% de tests que atrapan bugs reales.
