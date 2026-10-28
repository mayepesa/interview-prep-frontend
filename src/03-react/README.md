# React

Los conceptos siguen el orden de [preguntas-entrevista-react](https://github.com/midudev/preguntas-entrevista-react) de midudev (licencia MIT). Este repo no copia sus respuestas: las resume con palabras propias y les suma un ejemplo que puedes ejecutar.

- Los temas prácticos son ejemplos en vivo: `npm run dev` y elige uno en el menú.
- Los temas teóricos (los que no se pueden "ver" en el navegador) están en este archivo.

## Mapa: pregunta → ejemplo

| Tema                                                                                 | Ejemplo                                                                                       |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Qué es React, componentes, JSX, elemento vs componente, props, children, composición | [`01-basics/components-jsx-props`](01-basics/components-jsx-props.demo.tsx)                   |
| Estado vs props, useState, updater, estado desde props, batching                     | [`01-basics/state-and-props`](01-basics/state-and-props.demo.tsx)                             |
| Renderizado condicional, listas, keys, index como key                                | [`01-basics/conditional-and-lists`](01-basics/conditional-and-lists.demo.tsx)                 |
| Eventos, parámetros, preventDefault, SyntheticEvent, captura                         | [`01-basics/events`](01-basics/events.demo.tsx)                                               |
| Subir el estado, estado derivado                                                     | [`01-basics/lifting-state`](01-basics/lifting-state.demo.tsx)                                 |
| useReducer, inmutabilidad                                                            | [`01-basics/use-reducer`](01-basics/use-reducer.demo.tsx) (+ test)                            |
| useEffect, suscripciones, montar/desmontar, cancelar fetch                           | [`01-basics/use-effect`](01-basics/use-effect.demo.tsx)                                       |
| Fragments, useId, Compound Components                                                | [`01-basics/fragments-useid-compound`](01-basics/fragments-useid-compound.demo.tsx)           |
| Estilos: className, inline, condicionales, styled-components                         | [`04-css-html/styling-approaches`](../04-css-html/styling-approaches.demo.tsx)                |
| Custom hooks, reglas de los hooks, testear hooks                                     | [`02-intermediate/custom-hooks`](02-intermediate/custom-hooks.demo.tsx) + [`hooks/`](hooks/)  |
| Controlados vs no controlados, formularios                                           | [`02-intermediate/controlled-uncontrolled`](02-intermediate/controlled-uncontrolled.demo.tsx) |
| Refs, useRef, forwardRef / ref como prop, useImperativeHandle                        | [`02-intermediate/refs`](02-intermediate/refs.demo.tsx)                                       |
| Qué causa un re-render, memo, useMemo, useCallback, React Compiler                   | [`02-intermediate/memoization`](02-intermediate/memoization.demo.tsx)                         |
| Context, evitar re-renders con Context, `use`                                        | [`02-intermediate/context`](02-intermediate/context.demo.tsx)                                 |
| Error Boundaries                                                                     | [`02-intermediate/error-boundaries`](02-intermediate/error-boundaries.demo.tsx)               |
| React.lazy, import dinámico, Suspense                                                | [`02-intermediate/lazy-suspense`](02-intermediate/lazy-suspense.demo.tsx)                     |
| useActionState, useOptimistic, useFormStatus, Server Actions                         | [`02-intermediate/actions-react19`](02-intermediate/actions-react19.demo.tsx)                 |
| HOC, render props, clases vs funciones                                               | [`02-intermediate/hoc-render-props`](02-intermediate/hoc-render-props.demo.tsx)               |
| useEffect vs useLayoutEffect, useInsertionEffect                                     | [`02-intermediate/layout-effect`](02-intermediate/layout-effect.demo.tsx)                     |
| Stale closures, componentes puros                                                    | [`02-intermediate/stale-closure`](02-intermediate/stale-closure.demo.tsx)                     |
| useSyncExternalStore, Zustand por dentro, Flux                                       | [`02-intermediate/sync-external-store`](02-intermediate/sync-external-store.demo.tsx)         |
| useTransition, startTransition, useDeferredValue, Concurrent React                   | [`03-expert/concurrent`](03-expert/concurrent.demo.tsx)                                       |
| Portales, StrictMode                                                                 | [`03-expert/portals-strict-mode`](03-expert/portals-strict-mode.demo.tsx)                     |
| `use(promise)`, Profiler, cloneElement, useDebugValue                                | [`03-expert/use-profiler-misc`](03-expert/use-profiler-misc.demo.tsx)                         |
| Listas de miles de elementos (virtualización)                                        | [`05-performance/virtualized-list`](../05-performance/virtualized-list.demo.tsx)              |
| dangerouslySetInnerHTML, XSS                                                         | [`07-security/xss`](../07-security/xss.demo.tsx)                                              |
| Testing de componentes y hooks                                                       | [`06-testing`](../06-testing/README.md)                                                       |
| Errores típicos                                                                      | [`04-common-errors/common-errors`](04-common-errors/common-errors.demo.tsx)                   |

## Teoría (sin ejemplo ejecutable)

### ¿Es React una librería o un framework?

Una librería para construir interfaces: se encarga de la vista y deja el routing, los datos y el build a otras herramientas. Next.js o React Router (modo framework) sí son frameworks construidos sobre React.

> _React is a UI library. Frameworks like Next.js add routing, data fetching and rendering strategies on top of it._

### Virtual DOM y reconciliación

Cada render produce un árbol de elementos (objetos JS). React lo compara con el anterior (_diffing_) y aplica al DOM real solo las diferencias. Reglas del diff: si cambia el tipo del elemento, desmonta y monta de nuevo; en listas, usa `key` para emparejar hijos.

> _React keeps a lightweight description of the UI, diffs it against the previous one, and only touches the DOM where something changed._

**Shadow DOM vs Virtual DOM:** el Shadow DOM es una API del navegador para encapsular estilos y DOM de un Web Component. El Virtual DOM es una técnica de React para calcular cambios. No tienen relación.

### React Fiber

La arquitectura interna de reconciliación (desde React 16). Divide el render en unidades de trabajo que se pueden pausar, priorizar o descartar. Es lo que hace posible Concurrent React, Suspense y las transiciones.

### Concurrent React

React puede preparar varias versiones de la UI y cambiar de prioridad: un input (urgente) interrumpe el render de una lista pesada (transición). Ver el ejemplo de `useTransition`.

### React Compiler

Un compilador (estable desde 2025) que analiza tus componentes y agrega memoización automática. Reduce la necesidad de escribir `useMemo`, `useCallback` y `memo` a mano, siempre que el código siga las reglas de React (componentes puros, sin mutar props ni estado).

> _The React Compiler memoizes automatically, so manual useMemo and useCallback become the exception. It relies on components being pure._

### SSR, hidratación y streaming

- **CSR** (client side rendering): el servidor envía HTML vacío y JS; el navegador construye todo. Simple, pero el primer contenido tarda y el SEO sufre.
- **SSR** (server side rendering): el servidor genera el HTML con contenido; el usuario ve algo antes y los buscadores lo leen.
- **Hidratación**: el JS del cliente "se engancha" al HTML del servidor, agregando los event handlers. Si el HTML del servidor y el del primer render del cliente no coinciden, hay un _hydration mismatch_ (típico con `Date.now()`, `Math.random()` o `window`).
- **Streaming** (`renderToPipeableStream` en Node, `renderToReadableStream` en Web Streams): envía el HTML por partes. Las secciones dentro de `<Suspense>` llegan cuando están listas, sin bloquear el resto.
- **`createRoot` vs `hydrateRoot`**: `createRoot` renderiza desde cero en el cliente; `hydrateRoot` reutiliza HTML que vino del servidor. `ReactDOM.render` es la API vieja (eliminada en React 19).

### Server Components vs Client Components (Next.js App Router)

- **Server Components** (por defecto): se ejecutan solo en el servidor, pueden leer la base de datos o secretos, no envían su JS al cliente y no pueden usar estado, efectos ni eventos.
- **Client Components** (`"use client"`): se hidratan en el navegador; pueden usar hooks y eventos.
- Patrón: datos en el servidor, interactividad en hojas pequeñas de cliente.
- Un Server Component no puede crear un Context; se renderiza un Provider que es Client Component y se le pasan los datos como props.

### Validar props

Hoy con TypeScript (en compilación). `PropTypes` validaba en ejecución y fue eliminado de React 19; se ve en código legado.

### Exports nombrados vs por defecto

Los nombrados son más fáciles de buscar y refactorizar, el editor los autoimporta con el nombre correcto y evitan que cada archivo invente un nombre distinto. `React.lazy` espera un export por defecto, pero se adapta con `.then((m) => ({ default: m.Name }))`.

### flushSync

Fuerza a React a aplicar una actualización de estado de forma síncrona, saltándose el batching. Casi nunca se necesita; un caso real es medir el DOM justo después de agregar un elemento (por ejemplo, para hacer scroll al último).

### ViewTransition y Fragment Refs

APIs nuevas (React 19.x, canal canary en algunos casos): `ViewTransition` anima cambios entre estados usando la View Transitions API del navegador; las _Fragment refs_ permiten obtener un ref a los nodos DOM de un Fragment. Basta con saber que existen.

### ¿Por qué no mutar el estado?

React compara el estado anterior y el nuevo con `Object.is`. Si mutas el objeto, la referencia es la misma y React cree que nada cambió: no re-renderiza o lo hace con datos inconsistentes. Además rompe el modo concurrente y la memoización.

### ¿Qué JavaScript necesitas para React?

Módulos (import/export), destructuring, spread, arrow functions, template literals, `map`/`filter`/`reduce`, promesas y async/await, optional chaining. Todo está en [`01-javascript`](../01-javascript/README.md).
