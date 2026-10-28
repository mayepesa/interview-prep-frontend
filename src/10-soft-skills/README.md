# Soft skills y comunicación técnica en inglés

La mitad de los requisitos de la vacante no son de código: explicar decisiones, trabajar sin spec completa, comunicarse en un equipo multicultural, aprender lo que no sabes. Se evalúan en cómo hablas durante toda la entrevista, no en una pregunta aparte.

## Explicar una decisión técnica

Estructura: **contexto → opciones → elección → trade-off.**

> _We needed to share UI between three teams. The options were copying components, a monorepo, or a published library. I chose an npm library documented in Storybook, because teams deployed independently. The trade-off was versioning: we had to be careful with breaking changes, so we used semantic versioning and a changelog._

Frases útiles:

- _The main trade-off here is… / I chose X over Y because…_
- _It depends on… If the list is small, I'd keep it simple; if it grows, I'd virtualize it._
- _What I'd measure first is…_

## Empezar sin especificación completa

Lo que quieren oír: que no te bloqueas, que preguntas lo justo y que haces visibles tus supuestos.

> _If the spec isn't complete, I list my assumptions, ask the questions that would change the design, and start with the parts that won't change. I share a draft early, like a small proof of concept or a short technical note, so the team can correct me before I go too far._

Preguntas que haces antes de codear un ejercicio en vivo:

- _What should happen when the list is empty / the request fails?_
- _How much data are we talking about: tens or thousands of rows?_
- _Do we need to support keyboard users / mobile here?_
- _Can I assume the API returns X, or should I handle Y?_

## Escribir una especificación técnica con el equipo

Plantilla corta que puedes mencionar:

1. **Problem**: qué duele y a quién.
2. **Goals / non-goals**: qué entra y qué no.
3. **Proposal**: componentes, flujo de datos, API.
4. **Alternatives considered**: y por qué no.
5. **Risks and open questions**.
6. **Rollout**: feature flag, métricas, cómo revertir.

> _For the micro frontends proposal at N5 Now, I wrote a short document with the problem, the options and the rollout plan, and we reviewed it together before building a proof of concept._

## Cuando no sabes algo

Nunca te quedes callada ni inventes. Di lo que sabes, cómo lo averiguarías y conéctalo con algo que hiciste.

> _I haven't used that in production. My understanding is that it works like…, and I'd confirm it by reading the docs and building a small example. Something similar I did was…_

**Java/Kotlin** (es un plus, no un requisito):

> _I haven't worked with Java or Kotlin professionally; my experience is JavaScript and TypeScript. I'm comfortable reading backend code to understand an API, and I'd be happy to learn._

## Equipo multicultural y remoto

- Escribir claro y asíncrono: contexto, lo que pasó, lo que necesitas y para cuándo.
- Confirmar lo entendido: _"Just to make sure I got it: you'd like… right?"_
- No asumir que el silencio es acuerdo; preguntar directamente en llamadas.
- Cuidar los husos horarios: dejar notas para quien empieza después.

> _Working remotely, I over-communicate in writing: I post updates before I'm asked, I write down decisions from calls, and I flag blockers early instead of at the end of the sprint._

## Trabajar con producto, diseño, QA y technical writers

- **Producto**: entender el problema y la métrica, no solo el ticket.
- **Diseño**: preguntar por estados vacíos, de error y de carga; avisar temprano si algo es caro de construir.
- **QA**: compartir los casos borde que ya probé y cómo reproducir.
- **Technical writers**: explicar el comportamiento visible y los cambios que afectan a la documentación.

## Frases para ganar tiempo y sonar natural

- _Let me think about that for a second._
- _Good question. Let me start with the simple version and then improve it._
- _Could you repeat the last part? I want to make sure I understand._
- _I'm going to talk through my approach before I write code._
