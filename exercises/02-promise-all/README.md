# 02 · Implementa `promiseAll` y `promiseAllSettled`

**Nivel:** medio · **Tiempo:** 20 min · **Pregunta real:** "How would you implement Promise.all?"

Sin usar `Promise.all` ni `Promise.allSettled`:

**`promiseAll(items)`**

- Recibe un array de promesas **o valores normales**.
- Resuelve con los resultados **en el mismo orden** que la entrada, aunque terminen en otro orden.
- Si una falla, rechaza con ese error en cuanto ocurre.
- Con un array vacío, resuelve `[]`.

**`promiseAllSettled(items)`**

- Nunca rechaza. Resuelve con `{ status: "fulfilled", value }` o `{ status: "rejected", reason }` por cada elemento, en orden.

Pista: `Promise.resolve(item)` convierte cualquier valor en promesa, y un contador te dice cuándo terminaron todas.
