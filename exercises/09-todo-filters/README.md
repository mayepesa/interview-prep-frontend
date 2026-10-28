# 09 · Lista de tareas con filtros

**Nivel:** fácil · **Tiempo:** 30 min · **Pregunta real:** el clásico de live coding.

Construye `TodoApp` en `starter.tsx`.

Contrato:

- Un input con label **"New task"** y un botón **"Add"**. Enviar con Enter también agrega. Las tareas vacías o solo con espacios se ignoran; el input se limpia al agregar.
- Cada tarea es un `<li>` con un checkbox cuyo label es el texto de la tarea, y un botón con `aria-label="Delete <texto>"`.
- Filtros: botones **"All"**, **"Active"**, **"Completed"** con `aria-pressed`.
- Contador: **"2 items left"** (en singular: **"1 item left"**).
- Botón **"Clear completed"**.
- Prop opcional `initialTodos`.

Puntos senior para mencionar: el filtro y el contador son estado derivado (no otro `useState`), nunca mutar el array, `key` con id estable, tipar `Filter = "all" | "active" | "completed"`.
