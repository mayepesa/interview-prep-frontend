# 13 · Timesheet semanal (estilo Tempo)

**Nivel:** medio–alto · **Tiempo:** 60 min · **Por qué:** es el producto de Tempo en miniatura. Te da algo concreto de qué hablar: _"To prepare, I built a small weekly timesheet grid."_

Construye `TimesheetGrid` en `starter.tsx`. Recibe `projects: string[]` y `days: string[]`.

Contrato:

- Un `<table>`: una fila por proyecto, una columna por día, y una columna **Total**.
- Cada celda es un `<input type="number">` con `aria-label="<proyecto> <día>"`, por ejemplo `"Planner Mon"`. Empiezan vacías.
- Totales calculados en vivo, cada uno en un `<output>`:
  - por proyecto: `aria-label="Total <proyecto>"`
  - por día: `aria-label="Total <día>"`
  - semana: `aria-label="Total week"`
- Acepta decimales (`1.5`). Las celdas vacías cuentan como 0.
- Un valor negativo marca la celda con `aria-invalid="true"` y no suma.
- Si un día supera 24 horas, se muestra un `role="alert"` con el texto **"<día>: more than 24 hours"**.
- Botón **"Clear week"** que vacía todo.

Puntos senior para mencionar: el estado es un mapa `{ [project]: { [day]: string } }` (strings para no pelear con el input), los totales son estado derivado, y con muchos proyectos memoizarías las filas o virtualizarías.
