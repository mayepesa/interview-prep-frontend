# 03 · Transformar datos de una API

**Nivel:** fácil · **Tiempo:** 20 min · **Pregunta real:** "Here's the API response. Show me hours per project and per day."

Recibes entradas de horas como las de un timesheet. Implementa en `starter.ts`:

1. `hoursByProject(entries)` → `{ [project]: totalHoras }`
2. `hoursByDay(entries)` → `{ [date]: totalHoras }`, con las fechas ordenadas de forma ascendente (el orden de las claves importa).
3. `topProjects(entries, n)` → los `n` proyectos con más horas: `[{ project, hours }]`, de mayor a menor; en empate, por nombre.
4. `attachProjects(entries, projects)` → cada entrada con su `projectName` sacado de la lista `projects` por `projectId`. **Hazlo en O(n + m), no con un `find` dentro del `map`.** Si el proyecto no existe, `projectName: "Unknown"`.

Di la complejidad de cada función en voz alta mientras la escribes.
