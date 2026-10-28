# 07 · Caché LRU

**Nivel:** medio · **Tiempo:** 20 min · **Pregunta real:** "Design a cache for API responses with a size limit."

Implementa `LRUCache` en `starter.ts`:

- `new LRUCache(capacity)`
- `get(key)` devuelve el valor o `undefined`, y marca la clave como **recién usada**.
- `set(key, value)` agrega o actualiza. Si se supera la capacidad, elimina la clave **menos usada recientemente**.
- `has(key)` y `size`.
- `get` y `set` en **O(1)**.

Pista: `Map` recuerda el orden de inserción. Borrar y volver a insertar mueve una clave al final.

Extra para conversar: ¿cómo agregarías expiración por tiempo (TTL)? ¿En qué se parece a la caché de React Query?
