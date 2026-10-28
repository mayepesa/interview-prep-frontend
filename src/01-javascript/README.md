# JavaScript

La teoría y los ejemplos están en las páginas `.mdx` (ábrelas con `npm run dev`, sección **JavaScript**). Casi todos los ejemplos tienen un botón **▶ Ejecutar** para ver la salida real.

| Página                                               | Temas                                                                                                                                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`scope-closures-this.mdx`](scope-closures-this.mdx) | Tipos y valor vs referencia, scope, `var`/`let`/`const`, hoisting y TDZ, closures (counter, memoize, once, `for` + `setTimeout`), `this`, `bind`/`call`/`apply`, arrow functions, `==` vs `===` |
| [`event-loop-async.mdx`](event-loop-async.mdx)       | Call stack, event loop, microtareas vs macrotareas, promesas y async/await, errores, serie vs paralelo, `Promise.all/allSettled/race/any`, timeout, retry, `AbortController`                    |
| [`objects-arrays.mdx`](objects-arrays.mdx)           | Copias, inmutabilidad, igualdad por referencia, métodos de arrays, `Object.groupBy`, destructuring, rest/spread, `?.`, `??` vs `\|\|`, prototipos y clases, Map/Set                             |
| [`debounce-throttle.mdx`](debounce-throttle.mdx)     | Debounce y throttle desde cero, cuándo usar cada uno, debounce en React                                                                                                                         |
| [`browser-dom-http.mdx`](browser-dom-http.mdx)       | DOM, captura/burbujeo/delegación, qué pasa al escribir una URL, critical rendering path, `defer`/`async`, HTTP y REST, `fetch` y `res.ok`, CORS, almacenamiento, módulos ES                     |

El código que usan las páginas vive en módulos `.ts` con su `.test.ts` al lado (`closures-scope-this.ts`, `event-loop-async.ts`, `objects-arrays.ts`, `debounce-throttle.ts`, `http.ts`). Para practicar: lee el test, predice el resultado y corre `npm run test:watch -- 01-javascript`.
