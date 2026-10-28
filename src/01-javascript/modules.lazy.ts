// Módulo que solo se importa con import() en browser-dom-http.mdx:
// Vite lo separa en su propio archivo (chunk) y el navegador lo descarga recién al usarlo.

export const loadedAt = new Date().toLocaleTimeString(); // corre una sola vez, al cargar el módulo

export function buildReport(hours: number[]) {
  const total = hours.reduce((sum, h) => sum + h, 0);
  return `Reporte: ${hours.length} entradas, ${total} horas`;
}
