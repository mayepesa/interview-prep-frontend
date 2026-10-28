# 01 · Implementa `debounce`

**Nivel:** fácil · **Tiempo:** 15 min · **Pregunta real:** "You've used debounce. Can you write it?"

Escribe `debounce(fn, wait)` en `starter.ts`:

- Devuelve una función que, al llamarse, espera `wait` ms antes de ejecutar `fn`.
- Si se vuelve a llamar antes de que pase el tiempo, reinicia la espera.
- `fn` recibe los argumentos de la **última** llamada.
- La función devuelta tiene un método `cancel()` que descarta la ejecución pendiente.

Extra: conserva el `this` con el que se llamó a la función devuelta.

Pista: un closure que guarda el id del `setTimeout`.
