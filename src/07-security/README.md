# Seguridad en el front end

Página de teoría con ejemplos en vivo (sección **Seguridad** en `npm run dev`):

- [`security.mdx`](security.mdx): XSS y cómo escapa React, `dangerouslySetInnerHTML` + sanitización, URLs `javascript:`, dónde guardar tokens, secretos en el bundle, CSRF y `SameSite`, CORS, CSP, Trusted Types, dependencias, apps embebidas (Forge).

Código con tests: [`sanitize.ts`](sanitize.ts) + [`sanitize.test.ts`](sanitize.test.ts) (sanitizador mínimo con allowlist, para entender DOMPurify).
