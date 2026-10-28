# 04 · ¿Qué imprime este código?

**Nivel:** medio · **Tiempo:** 10 min · **Pregunta real:** "What's the output order?"

Abre `snippets.ts`: hay tres funciones que escriben en un log. **Sin ejecutarlas**, escribe en `starter.ts` el orden en que crees que aparecen los mensajes. El test ejecuta el código real y compara con tu predicción.

Regla: síncrono → todas las microtareas (promesas, `await`, `queueMicrotask`) → una macrotarea (`setTimeout`) → microtareas otra vez → …

Explica cada respuesta en voz alta, en inglés.
