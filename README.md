# interview-prep-frontend

Repaso práctico para entrevistas de front end senior: React, JavaScript, TypeScript, CSS y HTML, performance, testing, seguridad, fundamentos de CS, code review y comunicación técnica.

Todo es ejecutable: los conceptos de UI son ejemplos en vivo en el navegador, y los de lógica tienen tests que puedes leer, romper y volver a arreglar. Los conceptos de React siguen el orden de [preguntas-entrevista-react](https://github.com/midudev/preguntas-entrevista-react) de midudev.

**Convención:** el código está en inglés y las explicaciones en español. Cada tema trae una frase en inglés (_Say it in the interview_) para decir tal cual en una entrevista.

## Empezar

```bash
nvm use            # Node 22.12 o superior
npm install
npm run dev        # ejemplos en vivo en http://localhost:5173
```

| Comando                   | Qué hace                                                                      |
| ------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`             | Abre los ejemplos con un menú por sección                                     |
| `npm test`                | Corre los tests de los conceptos                                              |
| `npm run test:watch`      | Igual, en modo watch (`npm run test:watch -- 01-javascript` para una carpeta) |
| `npm run practice`        | Ejercicios contra tus soluciones, en modo watch                               |
| `npm run check:solutions` | Verifica que las soluciones de referencia pasan                               |
| `npm run typecheck`       | Chequeo de tipos (incluye los tests de tipos)                                 |
| `npm run check`           | Todo lo anterior junto                                                        |

## Estructura

```
src/
├── 01-javascript/       Closures, this, event loop, promesas, arrays, debounce/throttle
├── 02-typescript/       Generics, uniones discriminadas, type guards, utility types, tipar React
├── 03-react/
│   ├── 01-basics/       Componentes, JSX, estado, eventos, listas, useEffect, useReducer…
│   ├── 02-intermediate/ Custom hooks, refs, memo, context, error boundaries, lazy, React 19…
│   ├── 03-expert/       Concurrent React, portales, StrictMode, use(), Profiler
│   ├── 04-common-errors/
│   ├── hooks/           useDebouncedValue, useLocalStorage, useAsync (con tests)
│   └── README.md        Mapa pregunta → ejemplo + teoría (SSR, Fiber, Compiler, RSC…)
├── 04-css-html/         Formas de dar estilos, Flexbox/Grid, especificidad, accesibilidad
├── 05-performance/      Virtualización, debounce vs throttle, Web Vitals
├── 06-testing/          Testing Library, mocks de red, timers falsos
├── 07-security/         XSS, sanitización, tokens, CORS, CSP
├── 08-cs-fundamentals/  Big-O, estructuras de datos, algoritmos
├── 09-code-review/      Un PR con problemas para revisar, y su versión corregida
├── 10-soft-skills/      Explicar decisiones, trabajar sin spec, frases en inglés
└── app/                 La app que muestra los ejemplos
exercises/               13 ejercicios con tests: escribes en starter, los tests te dicen si está bien
```

## Qué estudiar según la vacante

Pensado para una vacante como _Senior Frontend Developer_ en productos SaaS (por ejemplo, apps de Jira Cloud):

| Requisito de la vacante                                           | Dónde repasarlo                                                                                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Código legible, mantenible y testeable en TypeScript y JavaScript | [`01-javascript`](src/01-javascript/README.md), [`02-typescript`](src/02-typescript/README.md)                                           |
| Tests unitarios, de integración y de performance                  | [`06-testing`](src/06-testing/README.md)                                                                                                 |
| Revisar código de otros                                           | [`09-code-review`](src/09-code-review/README.md)                                                                                         |
| UX, seguridad y performance                                       | [`04-css-html`](src/04-css-html/README.md), [`07-security`](src/07-security/README.md), [`05-performance`](src/05-performance/README.md) |
| Excelente TypeScript, JavaScript, CSS3 y HTML5                    | Las secciones 01, 02 y 04                                                                                                                |
| Interfaces complejas                                              | [`03-react`](src/03-react/README.md) y los ejercicios 11 a 13                                                                            |
| Big-O, estructuras de datos y algoritmos                          | [`08-cs-fundamentals`](src/08-cs-fundamentals/README.md) y los ejercicios 03, 06 y 07                                                    |
| Explicar decisiones, trabajar sin spec, equipo multicultural      | [`10-soft-skills`](src/10-soft-skills/README.md)                                                                                         |

## Plan sugerido de 7 días

| Día | Repaso                                     | Práctica                                                       |
| --- | ------------------------------------------ | -------------------------------------------------------------- |
| 1   | JavaScript: closures, `this`, event loop   | Ejercicios 01, 04                                              |
| 2   | React básico e intermedio (menú de la app) | Ejercicios 08, 09                                              |
| 3   | TypeScript y CSS/HTML                      | Ejercicio 05 + maquetar un layout sin Tailwind                 |
| 4   | Performance y React experto                | Ejercicios 10, 11                                              |
| 5   | Fundamentos de CS                          | Ejercicios 03, 06, 07                                          |
| 6   | Testing, seguridad y code review           | Ejercicio 12 + revisar `09-code-review/before.tsx` en voz alta |
| 7   | Soft skills y frases en inglés             | Ejercicio 13 cronometrado, explicando en inglés                |

## Créditos

- Las preguntas de React están basadas en [midudev/preguntas-entrevista-react](https://github.com/midudev/preguntas-entrevista-react) (MIT). Las respuestas y los ejemplos de este repo son propios.
