# 08 · Tabs accesibles (calentamiento de React)

**Nivel:** fácil · **Tiempo:** 25 min · **Pregunta real:** "Build a tabs component. How would a keyboard user use it?"

Construye `Tabs` en `starter.tsx`. Recibe `tabs: { id, label, content }[]`.

Contrato (el test lo verifica):

- Un contenedor con `role="tablist"`.
- Cada pestaña es un `<button role="tab">` con `aria-selected` y `aria-controls`.
- La primera pestaña está activa al inicio.
- Solo la pestaña activa tiene `tabIndex={0}`; las demás `-1`.
- Un solo `role="tabpanel"` visible, con `aria-labelledby` apuntando a su pestaña.
- Clic cambia de pestaña.
- Teclado: `ArrowRight` / `ArrowLeft` (dan la vuelta), `Home` y `End`. El foco se mueve con la selección.

Para conversar: ¿lo harías con compound components (`<Tabs.List>`, `<Tabs.Panel>`)? Mira `src/03-react/01-basics/fragments-useid-compound.demo.tsx`.
