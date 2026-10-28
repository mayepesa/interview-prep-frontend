import type { SearchFn } from "./types";

export function ProjectSearch({ search, delay = 300 }: { search: SearchFn; delay?: number }) {
  // TODO
  return (
    <p>
      TODO {typeof search} {delay}
    </p>
  );
}
