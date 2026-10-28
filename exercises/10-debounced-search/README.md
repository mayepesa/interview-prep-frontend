# 10 · Buscador con debounce y cancelación

**Nivel:** medio · **Tiempo:** 35 min · **Pregunta real:** "Build an autocomplete that calls an API." (el ejercicio #1 de live coding en front end)

Construye `ProjectSearch` en `starter.tsx`. Recibe:

- `search(query, signal) => Promise<string[]>`: la API (en el test es falsa).
- `delay` (opcional, 300 ms por defecto).

Contrato:

- Input con label **"Search projects"**.
- Con el input vacío (o solo espacios) no se llama a la API ni se muestra nada.
- Debounce: escribir rápido "time" hace **una sola** llamada, `delay` ms después de la última tecla.
- Mientras carga: un elemento con `role="status"` y el texto **"Loading…"**.
- Resultados como `<li>` dentro de una lista.
- Sin resultados: el texto **"No projects found"**.
- Error: `role="alert"` con **"Something went wrong"**.
- Al buscar algo nuevo, **aborta** la petición anterior (`signal.aborted` debe quedar en `true`) y nunca muestra una respuesta vieja.

Mientras lo escribes, di en voz alta: _"I debounce to avoid a request per keystroke, and I abort stale requests so an old response can't overwrite a newer one."_

Extra para conversar: ¿qué cambiaría con React Query? (caché por query, dedupe, reintentos, `placeholderData`).
