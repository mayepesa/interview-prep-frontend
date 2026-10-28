# JavaScript

Los entrevistadores técnicos preguntan JS puro porque muestra si entiendes lo que React hace por ti. Cada archivo `.ts` tiene un `.test.ts` al lado: **lee el test, predice el resultado y luego corre `npm run test:watch -- 01-javascript`.**

| Archivo                                            | Temas                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`closures-scope-this.ts`](closures-scope-this.ts) | Closures, memoize, once, var vs let en loops, `this`, bind, hoisting                                         |
| [`event-loop-async.ts`](event-loop-async.ts)       | Event loop, microtareas vs macrotareas, serie vs paralelo, `Promise.all/allSettled/race/any`, timeout, retry |
| [`objects-arrays.ts`](objects-arrays.ts)           | Copia superficial vs profunda, inmutabilidad, `reduce`, `groupBy`, `toSorted`, `??` vs `\|\|`                |
| [`debounce-throttle.ts`](debounce-throttle.ts)     | Implementar debounce y throttle desde cero                                                                   |

## Preguntas rápidas

**¿Qué es un closure?**
Una función que recuerda las variables del ámbito donde se creó. Debounce, memoize y los hooks de React dependen de ellos.

> _A closure is a function that keeps access to the variables of the scope where it was created. Debounce works because the returned function keeps the timer in a closure._

**¿Cómo funciona el event loop?**
JS ejecuta una cosa a la vez. Primero el código síncrono; cuando el stack se vacía, todas las microtareas (promesas, `await`); después una macrotarea (`setTimeout`, eventos) y vuelta a empezar.

> _Sync code first, then all microtasks like promise callbacks, then the next macrotask like a timeout._

**`var`, `let` y `const`**
`var` tiene ámbito de función y se eleva como `undefined`. `let` y `const` tienen ámbito de bloque y no se pueden usar antes de declararse (temporal dead zone). `const` impide reasignar, no mutar: un array `const` se puede modificar con `push`.

**¿Cómo funciona `this`?**
Depende de cómo se llama la función: como método, `this` es el objeto; suelta, es `undefined` en strict mode; con `bind/call/apply`, lo que pases; con `new`, el objeto nuevo. Las arrow functions no tienen `this` propio.

**`==` vs `===`**
`==` convierte tipos antes de comparar (`"1" == 1` es `true`). Siempre `===`.

**Copia superficial vs profunda**
Spread y `Object.assign` copian un nivel. `structuredClone` copia todo. En React importa porque el estado se actualiza creando referencias nuevas solo donde algo cambió.

**`Promise.all` vs `allSettled` vs `race` vs `any`**
`all`: todas o falla con el primer error. `allSettled`: espera todas y reporta cada resultado. `race`: la primera que termine. `any`: la primera que salga bien.

**Prototipos y clases**
Cada objeto tiene un prototipo del que hereda propiedades; `class` es sintaxis sobre ese mecanismo. En React casi no se usa herencia: se compone.

**¿Qué pasa cuando escribes una URL?**
DNS → conexión TCP/TLS → petición HTTP → el servidor responde HTML → el navegador lo parsea, pide CSS y JS, construye DOM y CSSOM, calcula layout y pinta. El JS puede bloquear el parseo si no usa `defer` o `type="module"`.

**REST y HTTP**
Recursos con URLs y métodos: `GET` lee, `POST` crea, `PUT/PATCH` actualizan, `DELETE` borra. Códigos: 2xx éxito, 3xx redirección, 4xx error del cliente (401 sin autenticar, 403 sin permiso, 404 no existe), 5xx error del servidor. CORS es el navegador protegiendo al usuario: el servidor debe permitir el origen.

**Almacenamiento en el navegador**
`localStorage` (persiste, ~5 MB, síncrono), `sessionStorage` (por pestaña), cookies (viajan al servidor; para sesiones usar `HttpOnly`, `Secure`, `SameSite`), IndexedDB (grande y asíncrono).
