export const COLORS = ["yellow", "pink", "blue"] as const;
export type Color = (typeof COLORS)[number];
export type Note = { id: string; text: string; color: Color; x: number; y: number };
export const STORAGE_KEY = "sticky-notes";
