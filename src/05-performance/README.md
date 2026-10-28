# Performance

"Experience with performance optimization" está en casi todas las vacantes senior. La regla de oro para la entrevista: **primero mido, después optimizo.**

| Ejemplo                                                                                                    | Qué muestra                                               |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`virtualized-list.demo.tsx`](virtualized-list.demo.tsx) + [`VirtualList.tsx`](VirtualList.tsx)            | Virtualización de 100 000 filas escrita a mano, con tests |
| [`debounce-throttle.demo.tsx`](debounce-throttle.demo.tsx)                                                 | Debounce vs throttle con un contador en vivo              |
| [`../03-react/02-intermediate/memoization.demo.tsx`](../03-react/02-intermediate/memoization.demo.tsx)     | memo, useMemo, useCallback con contadores de render       |
| [`../03-react/03-expert/concurrent.demo.tsx`](../03-react/03-expert/concurrent.demo.tsx)                   | useTransition y useDeferredValue                          |
| [`../03-react/02-intermediate/lazy-suspense.demo.tsx`](../03-react/02-intermediate/lazy-suspense.demo.tsx) | Code splitting con React.lazy                             |

## Cómo responder "¿cómo optimizas el rendimiento?"

1. **Medir**: Lighthouse, Core Web Vitals, React DevTools Profiler, pestaña Performance, análisis del bundle (`vite-bundle-visualizer`).
2. **Red y carga**: code splitting por ruta, lazy loading de lo que no se ve, imágenes en AVIF/WebP con `width`/`height` y `loading="lazy"`, fuentes con `font-display: swap`, caché HTTP, CDN.
3. **Datos**: caché de servidor con React Query, paginación, no pedir lo mismo dos veces, debounce en búsquedas, abortar peticiones viejas.
4. **Render**: evitar re-renders (estado cerca de donde se usa, memo donde mide), virtualizar listas, transiciones para trabajo pesado.
5. **Vigilar**: monitoreo real en producción (RUM) con Datadog o Sentry, y presupuestos de tamaño en CI.

> _I start by measuring with Lighthouse and the React Profiler. Then it depends on what I find: splitting the bundle, caching server data with React Query, debouncing inputs, memoizing expensive components or virtualizing long lists. In production I watch Web Vitals in our monitoring tool._

## Core Web Vitals

| Métrica                             | Mide                                                  | Bueno    | Cómo mejorarla                                                                                  |
| ----------------------------------- | ----------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | Cuándo aparece el contenido principal                 | ≤ 2.5 s  | Imagen principal priorizada (`fetchpriority="high"`), SSR, menos JS bloqueante                  |
| **INP** (Interaction to Next Paint) | Cuánto tarda la página en responder a una interacción | ≤ 200 ms | Partir tareas largas, transiciones, menos trabajo en handlers                                   |
| **CLS** (Cumulative Layout Shift)   | Cuánto salta el layout                                | ≤ 0.1    | Reservar espacio (tamaño en imágenes, skeletons del mismo tamaño), no insertar contenido arriba |

INP reemplazó a FID en 2024.

## Otras preguntas

**¿Qué es el critical rendering path?** HTML → DOM, CSS → CSSOM, juntos → render tree → layout → paint → composite. El CSS bloquea el render y el JS sin `defer` bloquea el parseo.

**Reflow vs repaint.** Cambiar tamaño o posición obliga a recalcular el layout (caro). Cambiar color solo repinta. Animar `transform` y `opacity` no causa ninguno de los dos: lo hace la GPU.

**Tree shaking.** El bundler elimina el código que no se importa. Funciona con módulos ES; importar `lodash` completo lo rompe, `lodash-es` o imports por función no.

**¿Cómo detectas un memory leak?** Pestaña Memory de DevTools: snapshots antes y después de una acción. Causas típicas en React: listeners o intervalos sin cleanup, suscripciones no canceladas.
