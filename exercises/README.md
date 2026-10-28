# Ejercicios con tests

Cada carpeta tiene:

- `README.md`: el enunciado y el contrato que verifica el test.
- `starter.ts(x)`: **aquí escribes tu solución.**
- `*.test.ts(x)`: los tests. No hace falta modificarlos.
- `solution.ts(x)`: una solución comentada. Ábrela solo al terminar.

```bash
npm run practice                    # modo watch: corre los ejercicios que ya empezaste
npm run practice -- 08-accessible   # solo uno
npm run check:solutions             # verifica que las soluciones de referencia pasan
```

**Los tests de un ejercicio no corren hasta que lo empiezas.** Al principio `npm run practice` muestra los 13 ejercicios como _skipped_ (en amarillo): eso es lo esperado, no un error. Para empezar uno:

1. Abre su `starter.ts(x)`.
2. Cambia `export const started = false;` por `true`. Sus tests empiezan a correr y fallan en rojo, porque todavía no lo resolviste.
3. Escribe tu solución hasta que todos sus tests pasen a verde.

## Cómo practicar para el live coding

1. Lee el README del ejercicio y **pon un timer** con el tiempo sugerido.
2. Antes de escribir código, explica tu plan **en voz alta y en inglés**, como si alguien te mirara.
3. Haz que funcione primero, luego mejora (tipos, casos borde, accesibilidad).
4. Cuando pase, compara con `solution` y anota una cosa que harías distinto.
5. Repite el que peor te salió dos días después, sin mirar nada.

## Lista

| #   | Ejercicio                                                   | Tema                                           | Nivel       | Tiempo     |
| --- | ----------------------------------------------------------- | ---------------------------------------------- | ----------- | ---------- |
| 01  | [debounce](01-debounce/README.md)                           | Closures, timers                               | Fácil       | 15 min     |
| 02  | [promiseAll](02-promise-all/README.md)                      | Promesas, orden, errores                       | Medio       | 20 min     |
| 03  | [Transformar datos](03-data-transforms/README.md)           | reduce, Map, big-O                             | Fácil       | 20 min     |
| 04  | [¿Qué imprime?](04-event-loop-predict/README.md)            | Event loop                                     | Medio       | 10 min     |
| 05  | [Emitter tipado](05-typed-emitter/README.md)                | Generics, `keyof`                              | Medio       | 25 min     |
| 06  | [Algoritmos](06-algorithms/README.md)                       | Two Sum, pila, búsqueda binaria, intervalos    | Fácil–medio | 10 min c/u |
| 07  | [Caché LRU](07-lru-cache/README.md)                         | Map, O(1)                                      | Medio       | 20 min     |
| 08  | [Tabs accesibles](08-accessible-tabs/README.md)             | React, ARIA, teclado                           | Fácil       | 25 min     |
| 09  | [Todo con filtros](09-todo-filters/README.md)               | Estado, estado derivado, listas                | Fácil       | 30 min     |
| 10  | [Buscador con debounce](10-debounced-search/README.md)      | useEffect, debounce, AbortController           | Medio       | 35 min     |
| 11  | [Tabla con orden y paginación](11-sortable-table/README.md) | useMemo, `aria-sort`, paginación               | Medio       | 40 min     |
| 12  | [Sticky notes](12-sticky-notes/README.md)                   | CRUD, localStorage, validación, memo           | Medio       | 45–60 min  |
| 13  | [Timesheet semanal](13-timesheet-grid/README.md)            | Grilla editable, totales derivados, validación | Medio–alto  | 60 min     |
