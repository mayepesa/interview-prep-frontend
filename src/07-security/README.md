# Seguridad en el front end

La vacante pide "attention to user experience, security and performance". Lo que se espera de un front end:

| Ejemplo                        | Qué muestra                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| [`xss.demo.tsx`](xss.demo.tsx) | React escapando texto, `dangerouslySetInnerHTML` sin y con sanitizar, URLs `javascript:` |
| [`sanitize.ts`](sanitize.ts)   | Un sanitizador con lista de permitidos (para entender DOMPurify), con tests              |

## Preguntas rápidas

**¿Qué es XSS?**
Inyectar código que se ejecuta en el navegador de otro usuario, por ejemplo un comentario con `<img onerror=...>`. Con eso se pueden robar datos o actuar en nombre del usuario.

**¿Cómo te protege React?**
Escapa todo lo que renderiza en `{}`. Los riesgos vuelven con `dangerouslySetInnerHTML`, `href` con URLs del usuario, `ref.current.innerHTML`, `eval` o librerías que tocan el DOM.

**¿Dónde guardas el token de sesión?**
Lo más seguro es una cookie `HttpOnly; Secure; SameSite=Lax`: el JS no puede leerla, así que un XSS no la roba. En `localStorage`, cualquier script de la página puede leerlo.

**¿Hay secretos en el front end?**
No. Todo lo que está en el bundle es público, incluidas las variables `VITE_*` o `NEXT_PUBLIC_*`. Solo van claves públicas (como el client-side ID de LaunchDarkly). Las secretas se quedan en el servidor y los `.env` fuera de Git.

**CSRF**
Un sitio malicioso hace que el navegador envíe una petición a tu app con las cookies del usuario. Se mitiga con `SameSite` en las cookies y tokens anti-CSRF.

**CORS**
El navegador bloquea respuestas de otro origen salvo que el servidor lo permita con `Access-Control-Allow-Origin`. No es una protección del servidor, sino del usuario. Se configura en el backend, no se "arregla" en el front.

**Content Security Policy (CSP)**
Un header que dice de dónde se pueden cargar scripts, estilos e imágenes. Aunque alguien inyecte un `<script>`, el navegador no lo ejecuta si su origen no está permitido.

**Trusted Types**
Una API del navegador (que React 19.x soporta) que obliga a que lo que va a `innerHTML` pase por una política de sanitización, para que no se cuele HTML sin limpiar.

**Dependencias**
`npm audit`, Dependabot o Renovate, y revisar antes de agregar una librería (mantenimiento, descargas, tamaño).

**En apps embebidas (como plugins de Jira)**
Corren dentro de otro producto: la comunicación con el host pasa por APIs controladas (en Atlassian Forge, el bridge y los permisos declarados en el manifest), y conviene asumir el mínimo de permisos necesario.
