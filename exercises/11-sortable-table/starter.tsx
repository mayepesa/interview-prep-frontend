import type { Entry } from "./types";

export function EntriesTable({ entries, pageSize = 5 }: { entries: Entry[]; pageSize?: number }) {
  // TODO
  return (
    <p>
      TODO {entries.length} {pageSize}
    </p>
  );
}
