import { useMemo, useState } from "react";
import type { Entry } from "./types";

type Column = "project" | "date" | "hours";
type Sort = { column: Column; direction: "ascending" | "descending" } | null;

const COLUMNS: { key: Column; label: string }[] = [
  { key: "project", label: "Project" },
  { key: "date", label: "Date" },
  { key: "hours", label: "Hours" },
];

function compare(a: Entry, b: Entry, column: Column): number {
  if (column === "hours") return a.hours - b.hours;
  return a[column].localeCompare(b[column]); // las fechas ISO se ordenan bien como texto
}

export function EntriesTable({ entries, pageSize = 5 }: { entries: Entry[]; pageSize?: number }) {
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return entries;
    const factor = sort.direction === "ascending" ? 1 : -1;
    return entries.toSorted((a, b) => compare(a, b, sort.column) * factor);
  }, [entries, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (column: Column) => {
    setSort((prev) =>
      prev?.column === column && prev.direction === "ascending"
        ? { column, direction: "descending" }
        : { column, direction: "ascending" },
    );
    setPage(1);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} aria-sort={sort?.column === col.key ? sort.direction : undefined}>
                <button type="button" onClick={() => toggleSort(col.key)}>
                  {col.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.project}</td>
              <td>{entry.date}</td>
              <td>{entry.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Pagination">
        <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </nav>
    </div>
  );
}
