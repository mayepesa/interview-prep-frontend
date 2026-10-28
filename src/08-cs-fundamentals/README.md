# Fundamentos de CS: big-O, estructuras de datos y algoritmos

La vacante pide "knowledge of Computer Science fundamentals: big-O, basic data structures, and algorithms". Para front end no piden algoritmos difíciles: piden que sepas **elegir la estructura correcta y decir la complejidad**.

| Archivo                                    | Contenido                                                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [`data-structures.ts`](data-structures.ts) | Stack, Queue (sin `shift`), LinkedList con `reverse`, LRU Cache, DFS y BFS                                               |
| [`algorithms.ts`](algorithms.ts)           | Two Sum, paréntesis balanceados, búsqueda binaria, anagramas, palíndromo, flatten, merge, intervalos, Fibonacci con memo |
| [`cs.test.ts`](cs.test.ts)                 | Tests de todo                                                                                                            |

Para practicar: tapa la implementación, lee el test e intenta escribirla tú. Las versiones para resolver desde cero están en [`exercises/`](../../exercises/README.md).

## Big-O en una tabla

| Complejidad | Nombre             | Ejemplo en front end                                   |
| ----------- | ------------------ | ------------------------------------------------------ |
| O(1)        | Constante          | Leer `map.get(id)`, `obj[key]`, `arr[i]`, `set.has(x)` |
| O(log n)    | Logarítmica        | Búsqueda binaria en un array ordenado                  |
| O(n)        | Lineal             | `map`, `filter`, `find`, `includes`, un `for`          |
| O(n log n)  | Lineal-logarítmica | `sort`                                                 |
| O(n²)       | Cuadrática         | Un `find` dentro de un `map` (loop anidado)            |
| O(2ⁿ)       | Exponencial        | Fibonacci recursivo sin memo                           |

> _Big-O describes how time or memory grows as the input grows. In practice, I look for nested loops: a `find` inside a `map` is O(n²), and building a Map first turns it into O(n)._

## La optimización más común en una entrevista de front end

```ts
// O(n × m): por cada entrada, busca el proyecto en otro array
entries.map((e) => ({ ...e, project: projects.find((p) => p.id === e.projectId) }));

// O(n + m): un Map primero, búsquedas O(1) después
const byId = new Map(projects.map((p) => [p.id, p]));
entries.map((e) => ({ ...e, project: byId.get(e.projectId) }));
```

## Qué estructura usar

| Necesito…                                      | Uso                          |
| ---------------------------------------------- | ---------------------------- |
| Buscar por clave rápido                        | `Map` u objeto               |
| Saber si algo ya existe / quitar duplicados    | `Set`                        |
| Deshacer, validar anidamiento                  | Pila (array con push/pop)    |
| Procesar en orden de llegada                   | Cola                         |
| Recorrer algo anidado (DOM, menú, comentarios) | Recursión (DFS) o cola (BFS) |
| Caché con límite                               | LRU (Map)                    |

## Cómo resolver un ejercicio en vivo

1. Repite el problema con tus palabras y pregunta por los casos borde (vacío, duplicados, negativos).
2. Di la solución simple primero y su complejidad ("con dos loops sería O(n²)").
3. Propón la mejor ("con un Map lo bajo a O(n)") y escríbela.
4. Prueba en voz alta con un ejemplo pequeño.
