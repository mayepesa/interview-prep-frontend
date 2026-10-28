# 12 · Sticky notes

**Nivel:** medio · **Tiempo:** 45–60 min · **Por qué:** es el take-home que reportaron candidatos a Senior Frontend en Tempo (Glassdoor).

Construye `StickyNotes` en `starter.tsx`.

Contrato (lo que verifica el test):

- Botón **"Add note"** crea una nota vacía.
- Cada nota tiene un `<textarea>` con label **"Note text"** y un botón **"Delete note"**.
- Cada nota tiene un selector de color con label **"Color"** y opciones `yellow`, `pink`, `blue`.
- Si no hay notas, se muestra **"No notes yet"**.
- Las notas se guardan en `localStorage` con la clave **`sticky-notes`** y se recuperan al montar. Si lo guardado está roto o no tiene la forma esperada, empieza vacío (sin romper la app).

Extras sin test, para hacer si te sobra tiempo (y para conversar):

- Arrastrar las notas con pointer events (guardar `x`, `y`; el offset del puntero en un ref).
- `memo` en cada nota para que escribir en una no re-renderice las demás.
- Debounce del guardado en `localStorage`.
- Atajo de teclado para crear nota.
