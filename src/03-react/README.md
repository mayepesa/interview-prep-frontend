# React

La teoría y los ejemplos están en las páginas `.mdx` de esta carpeta (ábrelas con `npm run dev`). Cada página sigue el orden de [preguntas-entrevista-react](https://github.com/midudev/preguntas-entrevista-react) de midudev; las explicaciones y los ejemplos son propios.

| Nivel                                 | Páginas                                                                                                                                                                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Principiante (`01-basics/`)           | ¿Qué es React? · Componentes, JSX y props · Estado, props y useState · Condicionales, listas y keys · Eventos · Subir el estado · useEffect · useReducer · Fragments, useId y Compound Components                                                   |
| Intermedio (`02-intermediate/`)       | Custom hooks · Controlados vs no controlados · Refs y useRef · Re-renders y memoización · Context · Error Boundaries · lazy y Suspense · Actions (React 19) · HOC y render props · useLayoutEffect · Stale closures y pureza · useSyncExternalStore |
| Experto (`03-expert/`)                | Concurrent React · Portales y StrictMode · use y otras APIs · Arquitectura de renderizado (SSR, hidratación, Server Components, Fiber, Compiler)                                                                                                    |
| Errores típicos (`04-common-errors/`) | Los mensajes de error más comunes, por qué pasan y cómo se arreglan                                                                                                                                                                                 |

Cada página tiene al lado su `.examples.tsx` con los componentes que ves en vivo. Los hooks reutilizables están en [`hooks/`](hooks/), con tests.
