# 11 · Tabla con orden y paginación

**Nivel:** medio · **Tiempo:** 40 min · **Pregunta real:** "Here's some data from an API. Show it in a table the user can sort and page through." Es el tipo de UI que se construye en productos como Tempo (reportes, timesheets).

Construye `EntriesTable` en `starter.tsx`. Recibe `entries` y `pageSize` (5 por defecto).

Contrato:

- Un `<table>` con encabezados **Project**, **Date** y **Hours**. Cada encabezado contiene un `<button>` con ese nombre.
- Al principio, las filas salen en el orden recibido y ningún encabezado tiene `aria-sort`.
- Clic en un encabezado: orden ascendente (`aria-sort="ascending"` en su `<th>`). Otro clic: descendente. Clic en otra columna: ascendente en esa.
- Texto ordena alfabéticamente, fechas cronológicamente, horas numéricamente.
- Paginación: botones **Previous** y **Next** (deshabilitados en los extremos) y el texto **"Page 1 of 3"**.
- Al cambiar el orden, vuelve a la página 1.
- La fila de encabezados no cuenta como fila de datos: usa `<thead>` y `<tbody>`.

Puntos senior para mencionar: `useMemo` para el orden, `toSorted` para no mutar la prop, y que con miles de filas el orden y la paginación irían al servidor.
