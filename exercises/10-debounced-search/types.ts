export type SearchFn = (query: string, signal: AbortSignal) => Promise<string[]>;
