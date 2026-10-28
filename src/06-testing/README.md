# Testing

Página de teoría con ejemplos (sección **Testing** en `npm run dev`):

- [`testing.mdx`](testing.mdx): por qué testear, pirámide y trofeo, Vitest y mocks, React Testing Library (queries, `getBy`/`queryBy`/`findBy`, `userEvent`), UI asíncrona, `fetch` y MSW, timers falsos, `renderHook`, cobertura, Playwright, tests de performance.

Tests para leer y correr (`npm run test:watch`):

- [`TimeEntryForm.test.tsx`](TimeEntryForm.test.tsx): formulario con `userEvent`, queries por rol y label, errores accesibles, estado de envío.
- [`ProjectSearch.test.tsx`](ProjectSearch.test.tsx): mock de `fetch`, timers falsos con debounce, `findBy`.
- [`../03-react/hooks/hooks.test.ts`](../03-react/hooks/hooks.test.ts): hooks con `renderHook` y `act`.
- [`../05-performance/VirtualList.test.tsx`](../05-performance/VirtualList.test.tsx): lógica pura + componente, `fireEvent.scroll`.
