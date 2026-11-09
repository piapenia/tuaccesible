/* Politica de seguridad de contenido (CSP) de todas las paginas.

   Va en <meta> porque GitHub Pages no deja configurar cabeceras HTTP propias.
   Efecto real: si alguien lograra inyectar marcado en este sitio, el
   navegador no ejecutaria el script que traiga, no dejaria que la pagina se
   conecte a ningun servidor ajeno y no permitiria reapuntar el formulario a
   otro destino.

   - script-src 'self': cualquier script tiene que vivir en el propio sitio.
     Por eso las islas de React se compilan a /assets/ y no van en linea, y
     por eso React no escribe ningun <script> en linea en estas paginas.
   - frame-ancestors no se pone: el navegador lo ignora cuando viene por
     <meta>, asi que seria una falsa tranquilidad.
   - connect-src suma el backend solo si hay VITE_API_URL (ver
     src/configuracion.js).

   Solo en desarrollo ("npm run dev") cambian dos cosas, y el sitio publicado
   no se entera porque el despliegue compila con "npm run build":
     - connect-src suma 'self' ws: para que la recarga automatica de Vite
       pueda abrir su WebSocket.
     - Se quita upgrade-insecure-requests, porque Safari lo aplica tambien a
       localhost, pide el CSS y los scripts por https y el servidor local no
       lo sirve: la pagina se ve sin estilos. Por la misma razon se quita
       cuando el backend configurado corre en localhost (pruebas locales de
       la version compilada contra el backend de Fafa). */

import { esOrigenLocal } from "./configuracion.js";

export function politicaDeSeguridad({ desarrollo, origenApi }) {
  const conexiones = [];
  if (desarrollo) conexiones.push("'self'", "ws:");
  conexiones.push("https://tuaccesible.goatcounter.com");
  if (origenApi) conexiones.push(origenApi);

  const directivas = [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    `connect-src ${conexiones.join(" ")}`,
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data: https://tuaccesible.goatcounter.com",
    "font-src 'self'",
    "form-action https://api.web3forms.com",
  ];
  if (!desarrollo && !esOrigenLocal(origenApi)) directivas.push("upgrade-insecure-requests");
  return directivas.join("; ");
}
