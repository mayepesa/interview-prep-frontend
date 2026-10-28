# interview-prep-frontend

Una guía de estudio para entrevistas de front end senior: **teoría y, debajo, un ejemplo** de cada concepto. Cubre JavaScript, TypeScript, React (de principiante a experto), CSS y HTML, performance, testing, seguridad, fundamentos de CS, code review y comunicación técnica.

Cada concepto es una pregunta típica de entrevista y sigue el mismo orden:

1. **Teoría**: qué es, cómo funciona, por qué importa, cuándo usarlo y cuándo no.
2. **Ejemplo**: el código mínimo que muestra la idea.
3. **Pruébalo**: el ejemplo funcionando en el navegador, o un botón **Ejecutar** que muestra la salida del código.
4. **Dilo en la entrevista**: una o dos frases en inglés para responder en voz alta.

Además hay 13 ejercicios de live coding con tests, en `exercises/`.

## Empezar

```bash
nvm use            # Node 22.12 o superior
npm install
npm run dev        # abre la guía en http://localhost:5173
```

Empieza por la página **Cómo usar esta guía** del menú.

| Comando                   | Qué hace                                                                          |
| ------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`             | Abre la guía: teoría y ejemplos en vivo, con un menú por tema                     |
| `npm run practice`        | Ejercicios de live coding en modo watch (ver [`exercises/`](exercises/README.md)) |
| `npm test`                | Corre los tests del código de los ejemplos                                        |
| `npm run check:solutions` | Verifica que las soluciones de referencia de los ejercicios pasan                 |
| `npm run typecheck`       | Chequeo de tipos                                                                  |
| `npm run check`           | Todo lo anterior junto                                                            |

## Estructura

```
src/
├── 00-start/            Cómo usar esta guía y plan de estudio
├── 01-javascript/       Scope, closures, this, event loop, objetos y arrays, debounce/throttle, navegador y HTTP
├── 02-typescript/       Fundamentos, generics y utility types, tipar React
├── 03-react/
│   ├── 01-basics/       Qué es React, JSX, estado, listas, eventos, useEffect, useReducer…
│   ├── 02-intermediate/ Custom hooks, refs, memoización, context, error boundaries, React 19…
│   ├── 03-expert/       Concurrent React, portales, use(), SSR y Server Components
│   └── 04-common-errors/
├── 04-css-html/         HTML semántico y accesibilidad, cascada, Flexbox/Grid, formas de dar estilos
├── 05-performance/      Performance web (Core Web Vitals, carga) y performance en React
├── 06-testing/          Testing con Vitest y Testing Library
├── 07-security/         XSS, tokens, CORS, CSRF, CSP
├── 08-cs-fundamentals/  Big-O, estructuras de datos, algoritmos
├── 09-code-review/      Qué revisar y un PR con 13 problemas para practicar
├── 10-soft-skills/      Explicar decisiones, trabajar sin spec, equipo remoto
└── app/                 La app que muestra la guía
exercises/               13 ejercicios con tests
```

Cada tema es un archivo `.mdx` (markdown con componentes de React). Al lado está su `.examples.tsx`, con los componentes que ves en vivo: puedes editarlos y la página se actualiza al guardar.

## Créditos

Los conceptos de React siguen el orden de [midudev/preguntas-entrevista-react](https://github.com/midudev/preguntas-entrevista-react) (MIT). Las explicaciones y los ejemplos de esta guía son propios.
