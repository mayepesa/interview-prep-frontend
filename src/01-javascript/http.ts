// ─── fetch con manejo de errores ─────────────────────────────────────────────
// fetch solo RECHAZA la promesa por errores de red (sin conexión, CORS, DNS) o por abort.
// Un 404 o un 500 llegan como respuesta "exitosa" con res.ok === false: hay que revisarlo a mano.

/** Error HTTP con el status, para que la UI decida qué mostrar (401 → login, 404 → no existe…). */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** GET/POST de JSON que lanza HttpError si el status no es 2xx. `fetchImpl` permite probarlo sin red. */
export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  fetchImpl: FetchLike = fetch,
): Promise<T> {
  const res = await fetchImpl(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new HttpError(res.status, body || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T; // No Content: no hay JSON que leer
  return (await res.json()) as T;
}

/** Qué hacer según el tipo de error: es lo que se pregunta en la entrevista. */
export function describeFetchError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") return "cancelada: ignorar";
  if (error instanceof HttpError) {
    if (error.status === 401) return "401: sesión vencida → ir al login";
    if (error.status === 403) return "403: sin permiso → mostrar aviso";
    if (error.status === 404) return "404: no existe → estado vacío";
    if (error.status >= 500) return `${error.status}: error del servidor → reintentar`;
    return `${error.status}: error del cliente → revisar la petición`;
  }
  if (error instanceof TypeError) return "error de red (sin conexión o CORS) → reintentar";
  return "error inesperado";
}

/** Una API falsa que responde con el status pedido: `/status/404`, `/status/200`… */
export const fakeFetch: FetchLike = async (url) => {
  if (url.includes("offline")) throw new TypeError("Failed to fetch");
  const status = Number(url.match(/status\/(\d{3})/)?.[1] ?? 200);
  if (status === 204) return new Response(null, { status });
  const body = status < 300 ? JSON.stringify({ id: 1, name: "Planner" }) : `Error ${status}`;
  return new Response(body, {
    status,
    headers: { "Content-Type": status < 300 ? "application/json" : "text/plain" },
  });
};
