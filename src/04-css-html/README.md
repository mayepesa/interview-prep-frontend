# CSS y HTML

"Excellent knowledge of CSS3 and HTML5" significa poder maquetar sin framework y explicar por qué algo se ve como se ve.

| Ejemplo                                                        | Temas                                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`styling-approaches.demo.tsx`](styling-approaches.demo.tsx)   | `className`, inline, condicionales, CSS Modules, styled-components con tema, comparación con Tailwind |
| [`layout-playground.demo.tsx`](layout-playground.demo.tsx)     | Flexbox interactivo, centrar, grid responsive sin media queries, grid areas, container queries        |
| [`cascade-specificity.demo.tsx`](cascade-specificity.demo.tsx) | Especificidad, box model, posicionamiento, stacking context, variables, `@layer`                      |
| [`accessibility.demo.tsx`](accessibility.demo.tsx)             | `div` vs `button`, formulario con errores accesibles, tabs con teclado, HTML semántico                |

## Preguntas rápidas

**Flexbox o Grid**
Flex para una dimensión (una fila de botones). Grid para dos (layout de página, calendario, timesheet).

**Unidades**
`rem` para tipografía y espaciado (respeta el tamaño de fuente del usuario), `%`/`fr` para layouts, `px` para bordes, `vh/dvh` para alto de pantalla (`dvh` considera la barra del navegador en móvil), `ch` para ancho de texto legible.

**Mobile first**
Estilos base para pantallas pequeñas y `min-width` en las media queries para crecer.

**Pseudo-clases vs pseudo-elementos**
`:hover`, `:focus-visible`, `:has()` seleccionan estados; `::before`, `::after` crean contenido. `:focus-visible` muestra el foco solo al navegar con teclado.

**Animaciones con buen rendimiento**
Animar `transform` y `opacity`. Respetar `prefers-reduced-motion`.

**Tipos de display**
`block` ocupa todo el ancho, `inline` no acepta ancho ni alto, `inline-block` sí, `none` lo quita del árbol de accesibilidad (`visibility: hidden` lo oculta pero conserva el espacio).

**Atributos de `<script>`**
`defer`: descarga en paralelo y ejecuta en orden al terminar de parsear. `async`: ejecuta en cuanto llega, sin orden. `type="module"` es `defer` por defecto.

**Accesibilidad mínima en cada PR**
Elementos nativos, labels en inputs, textos alternativos, contraste suficiente, foco visible, todo usable con teclado.
