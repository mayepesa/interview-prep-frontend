# Code review

La vacante dice "review your peers' code". Es común que en la entrevista te muestren código y te pidan revisarlo en voz alta.

**Ejercicio:** abre [`before.tsx`](before.tsx), pon un timer de 10 minutos y anota todo lo que comentarías. Después compara con la lista de abajo y con [`after.tsx`](after.tsx).

## Los comentarios del review

Cada comentario dice la severidad, para separar lo que bloquea de lo opcional.

| #   | Severidad     | Problema                                                                                            | Sugerencia                                            |
| --- | ------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | 🔴 Bloquea    | Clave secreta `sk_live_…` en el bundle: cualquiera la ve en DevTools                                | Moverla al backend y llamar a nuestra propia API      |
| 2   | 🔴 Bloquea    | `dangerouslySetInnerHTML` con texto del usuario: XSS                                                | Renderizar como texto, o sanitizar con DOMPurify      |
| 3   | 🟠 Importante | El efecto usa `props.userId` pero las deps están vacías: si cambia el usuario, muestra datos viejos | `[userId]` en las dependencias                        |
| 4   | 🟠 Importante | Sin cleanup: race condition si cambia `userId`, y setState tras desmontar                           | `AbortController` y `return () => controller.abort()` |
| 5   | 🟠 Importante | No maneja errores: si falla, se queda en "Loading…" para siempre                                    | `.catch` y un estado de error visible                 |
| 6   | 🟠 Importante | Listener de `resize` que nunca se quita: memory leak                                                | Quitarlo en el cleanup (y quitar el `console.log`)    |
| 7   | 🟡 Sugerencia | `total` es estado derivado: un efecto extra y un render de más                                      | Calcularlo en el render con `reduce`                  |
| 8   | 🟡 Sugerencia | `{entries.length && …}` pinta un "0" cuando no hay entradas                                         | `entries.length > 0 &&`                               |
| 9   | 🟡 Sugerencia | `key={i}`                                                                                           | Usar `entry.id`                                       |
| 10  | 🟡 Sugerencia | `any` en props y datos: perdemos los tipos                                                          | Tipar `Props` y validar la respuesta de la API        |
| 11  | 🟡 Sugerencia | `div` con `onClick`: no funciona con teclado                                                        | `button`                                              |
| 12  | 🟡 Sugerencia | `loading`, `entries` y el error pueden contradecirse                                                | Una unión discriminada por `status`                   |
| 13  | ⚪ Nit        | URL armada con `+` y sin `encodeURIComponent`                                                       | Template literal y encoding                           |

## Cómo comentar

- Pregunta en vez de ordenar: _"What happens here if `userId` changes while the request is in flight?"_
- Explica el porqué y propón algo concreto: _"This key ends up in the bundle, so anyone can read it. Could we proxy the call through our API?"_
- Separa lo que bloquea de lo opcional: _"Non-blocking: we could derive `total` during render instead of keeping it in state."_
- Reconoce lo bueno: _"Nice catch on the empty state."_
- Si algo se discute mucho por escrito, propón una llamada corta.

> _When I review, I first check that the change does what the ticket says and handles edge cases. Then security, correctness and performance, then readability and tests. I label comments as blocking or non-blocking and suggest a concrete fix._
