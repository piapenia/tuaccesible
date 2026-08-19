# Postura de seguridad de tuaccesible.com

Última revisión: 19 de agosto de 2026.

## Qué superficie hay realmente

El sitio es estático: Eleventy genera HTML y GitHub Pages lo sirve. No hay
base de datos, ni sesiones, ni panel de administración, ni código propio
corriendo en ningún servidor. Eso elimina de entrada las familias de fallos
que se llevan la mayoría de los incidentes de un sitio de consultora
(inyección SQL, subida de archivos, escalada de privilegios en el gestor de
contenidos).

Lo que queda por cuidar es más acotado y está en tres sitios: **el dato
personal que llega por los formularios**, **la cadena que construye y publica
el sitio**, y **el dominio**.

## Controles en el sitio publicado

- **Política de seguridad de contenido** declarada en cada página. Bloquea
  script que no venga de este propio dominio, prohíbe conectarse a servidores
  ajenos y fija el único destino al que un formulario puede enviarse.
- **Ningún script de terceros.** Ni fuentes web, ni redes sociales
  incrustadas, ni CDN. La analítica es GoatCounter, pero su archivo se aloja
  en este mismo dominio en lugar de cargarse desde el servidor del proveedor,
  de modo que la política sigue admitiendo solo script propio. Lo único que
  sale hacia fuera es el aviso de la visita, y la política lo limita a ese
  destino y a ningún otro.
- **Cero cookies.** Lo único que se guarda en el navegador es la preferencia
  de idioma, en almacenamiento local, y está declarado en la política de
  privacidad.
- **JavaScript solo aditivo.** El sitio entero funciona con el script
  desactivado; el único archivo que hay sirve para sugerir idioma en la
  primera visita.
- `Referrer-Policy` en `strict-origin-when-cross-origin`.
- **HTTPS forzado** por GitHub Pages, con certificado de Let's Encrypt que
  cubre el dominio raíz y el `www`. Comprobado: `http://` y `www` responden
  301 al destino correcto.
- **security.txt** en `/.well-known/`, según el RFC 9116, para que quien
  encuentre un problema sepa a dónde escribir.

## Controles en los formularios

- Destino fijo a Web3Forms, declarado también en la política de seguridad de
  contenido: aunque alguien lograra inyectar marcado, no podría reapuntar el
  formulario a otro servidor.
- Trampa antispam (`botcheck`) oculta con `display:none`, que es lo que la
  saca también del árbol de accesibilidad: un lector de pantalla no la
  anuncia.
- Página de confirmación propia (`/gracias/`, `/en/thank-you/`) en lugar de la
  página genérica del proveedor.
- Información básica de protección de datos junto al botón de envío, y
  autorización expresa de publicación en el formulario de reseñas.
- La clave de acceso de Web3Forms está pensada para ir en el HTML: es pública
  por diseño, no es un secreto filtrado. Lo que sí implica es que cualquiera
  puede usarla para enviar mensajes a nuestro buzón. La contención hoy es la
  trampa antispam; si algún día llega spam de verdad, la respuesta correcta es
  la restricción por dominio del plan de pago, no un captcha (un captcha
  visual sería un barrera de accesibilidad justo en la página de contacto de
  una consultora de accesibilidad).

## Controles en la cadena de construcción

- El flujo de trabajo arranca **sin permisos** y cada trabajo pide solo los
  suyos: construir lee, publicar publica.
- Las acciones de GitHub están **fijadas por hash de commit**, no por
  etiqueta: una etiqueta se puede mover a otro código, un hash no.
- `persist-credentials: false` en la descarga del repositorio, para no dejar
  el token de Actions escrito en el disco del ejecutor.
- Dependabot vigila semanalmente las acciones y los paquetes de npm.
- Antes de publicar nada corren dos comprobaciones que pueden cortar el
  despliegue: el verificador de contraste sobre el CSS real y `pa11y-ci`
  contra WCAG2AAA en las 22 páginas.

## Avisos de npm que quedan abiertos a propósito

`npm audit` informa de seis vulnerabilidades altas. Las seis vienen de una
sola: `extract-zip`, arrastrado por el Chrome que usa `pa11y-ci` para
auditar. **No tiene versión corregida publicada**, así que no hay a dónde
actualizar, y `npm audit fix --force` solo devuelve el proyecto a una versión
anterior con otros avisos distintos.

Por qué se acepta: el fallo consiste en extraer un archivo comprimido
malicioso. El único archivo comprimido que se extrae en esta cadena es la
compilación de Chrome que descarga Google por HTTPS. Además, todo esto ocurre
en el entorno de integración continua, no en el sitio publicado: ningún
visitante toca ese código. Revisar cuando Dependabot proponga una versión
nueva de `pa11y-ci`.

## Lo que GitHub Pages no deja hacer

GitHub Pages no permite configurar cabeceras HTTP propias. Por eso faltan, y
no por descuido:

- `Strict-Transport-Security` (HSTS). El redirección de `http://` a `https://`
  funciona, pero la primera visita de alguien que teclee el dominio sin
  protocolo viaja en claro antes del redireccionamiento.
- `X-Frame-Options` y `frame-ancestors`. La política de seguridad de contenido
  declarada por `<meta>` no puede fijar `frame-ancestors`: el navegador lo
  ignora ahí. Ponerlo sería una tranquilidad falsa.
- `X-Content-Type-Options` y `Permissions-Policy`.

Las tres se resuelven de una sola vez poniendo un proxy delante (Cloudflare
tiene plan gratuito), lo que implica mover los servidores de nombres del
dominio. Es una decisión de coste y de mantenimiento, no un fallo del sitio.

## Dominio y correo

- SPF publicado y correcto para el proveedor de correo.
- **Sin DMARC.** Es el hueco con más impacto real que queda: sin una política
  DMARC publicada, cualquiera puede enviar correo que aparente venir de
  `@tuaccesible.com`, y quien lo reciba no tiene forma automática de
  detectarlo. Para una consultora que manda informes y facturas por correo,
  eso es lo primero que hay que cerrar. Se arregla con un solo registro TXT.
- Sin CAA y sin DNSSEC. Segundo y tercer nivel de prioridad, muy por detrás
  del anterior.
