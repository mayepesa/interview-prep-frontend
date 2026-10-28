import { useState, type ReactNode } from "react";

type Props<T> = {
  items: readonly T[];
  rowHeight: number;
  height: number;
  overscan?: number;
  renderRow: (item: T, index: number) => ReactNode;
};

/** Qué filas hay que pintar para un scrollTop dado. Pura, así se puede testear sola. */
export function visibleRange(
  scrollTop: number,
  height: number,
  rowHeight: number,
  total: number,
  overscan = 5,
) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, Math.ceil((scrollTop + height) / rowHeight) + overscan);
  return { start, end };
}

/**
 * Virtualización (windowing): solo existen en el DOM las filas visibles más un margen.
 * 100 000 filas → ~30 nodos. En producción: @tanstack/react-virtual o react-window.
 */
export function VirtualList<T>({ items, rowHeight, height, overscan = 5, renderRow }: Props<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const { start, end } = visibleRange(scrollTop, height, rowHeight, items.length, overscan);

  return (
    <div
      role="list"
      tabIndex={0}
      aria-label={`${items.length} filas`}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{
        height,
        overflowY: "auto",
        position: "relative",
        border: "1px solid var(--line)",
        borderRadius: 8,
      }}
    >
      {/* Un div alto que da el tamaño real del scroll */}
      <div style={{ height: items.length * rowHeight, position: "relative" }}>
        {items.slice(start, end).map((item, i) => {
          const index = start + i;
          return (
            <div
              key={index}
              role="listitem"
              style={{
                position: "absolute",
                top: index * rowHeight,
                height: rowHeight,
                left: 0,
                right: 0,
              }}
            >
              {renderRow(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
