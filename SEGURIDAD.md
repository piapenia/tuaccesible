# Postura de seguridad de tuaccesible.com

Última revisión: 9 de noviembre de 2026.

## Qué superficie hay realmente

El sitio es estático: las páginas son componentes de React que Vite
convierte en HTML al compilar, y GitHub Pages sirve ese HTML. No hay base de
datos, ni sesiones, ni panel de administración, ni código propio corriendo
en ningún servidor. Eso elimina de entrada las familias de fallos
que se llevan la mayoría de los incidentes de un sitio de consultora
(inyección SQL, subida de archivos, escalada de privilegios en el gestor de
contenidos).

Lo que queda por cuidar es más acotado y está en tres sitios: **el dato
personal que llega por los formularios**, **la cadena que construye y publica
el sitio**, y **el dominio**.

## Controles en el sitio publicado

- **Política de seguridad de contenido** declarada en cada página. Bloquea
  script que no venga de este propio dominio, prohíbe conectarse a servidores
  ajenos y fija el único destino al que un formulario puede enviarse. Vive en
  `src/seguridad.js`. Cuando el servicio de testing tenga backend publicado,
  su dirección (`VITE_API_URL`) se suma a `connect-src` y a ninguna otra
  directiva; hoy el sitio publicado no tiene ninguna.
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
  desactivado. React se usa para escribir las páginas, pero corre al
  compilar, no en el navegador: hoy ninguna página carga React. Las partes
  que más adelante lo necesiten (las islas) se compilan como archivos del
  propio dominio, solo las cargan las páginas que las usan y su contenido
  inicial también está en el HTML. El único script propio que corre en todas
  las páginas sigue siendo el que sugiere idioma en la primera visita.
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
  una consultora de accesibilidad). La clave está escrita en un solo lugar,
  `src/componentes/formularios/FormularioWeb3Forms.jsx`.

## Controles en la cadena de construcción

- El flujo de trabajo arranca **sin permisos** y cada trabajo pide solo los
  suyos: construir lee, publicar publica.
- Las acciones de GitHub están **fijadas por hash de commit**, no por
  etiqueta: una etiqueta se puede mover a otro código, un hash no.
- `persist-credentials: false` en la descarga del repositorio, para no dejar
  el token de Actions escrito en el disco del ejecutor.
- Dependabot vigila semanalmente las acciones y los paquetes de npm.
- La versión de Node sale de `.nvmrc`, la misma en integración continua y en
  las computadoras. Hoy es la 26, la LTS activa.
- Antes de publicar nada corren cuatro comprobaciones que pueden cortar el
  despliegue: las pruebas (`npm test`), el verificador de contraste sobre el
  CSS real, la compilación (que también se corta si una página no declara
  título, descripción, idioma o su versión en el otro idioma, o si dos
  páginas no se apuntan entre sí) y `pa11y-ci` contra WCAG2AAA en las 25
  páginas de `.pa11yci.json`.
- `upload-pages-artifact` va en la v5 con `include-hidden-files: true`.
  Desde la v4, esa acción deja fuera del sitio publicado todo archivo cuyo
  nombre empieza con punto, y con eso `.well-known/security.txt`; esa línea
  lo vuelve a incluir. Está anotado junto a la acción en `deploy.yml`, y
  después de cada versión nueva hay que comprobar que
  `https://tuaccesible.com/.well-known/security.txt` siga respondiendo.
- La compilación revisa `VITE_API_URL` antes de escribir nada
  (`scripts/backend-seguro.js`). Una dirección `http://localhost` en la
  política de seguridad sirve para probar lo compilado contra el backend
  local, pero publicada dejaría conectarse por http y quitaría
  `upgrade-insecure-requests`. Por eso, en GitHub Actions, una dirección que
  no sea https corta el despliegue; en una computadora la compilación sigue,
  pero avisa al final de qué archivo o variable salió la dirección. Lo que
  se usa con `npm run dev` va en `.env.development` y
  `.env.development.local`, que la compilación no lee.

## Avisos de npm

`npm audit` no informa ninguna vulnerabilidad (comprobado el 9 de noviembre
de 2026). Los seis avisos altos que había venían de `extract-zip`, que
llegaba con el Chrome de `pa11y-ci` 4; desaparecieron al pasar a `pa11y-ci` 5
con la migración a React.

## El servicio de testing que viene

El backend del servicio de testing (Node.js, Express y PostgreSQL) vive en
otro repositorio y no es parte de este sitio estático. Trae una superficie
que aquí no existe: una base de datos y una API pública. Lo que ya está
decidido del lado del sitio:

- El sitio solo puede conectarse a la dirección de `VITE_API_URL`; la
  política de seguridad no deja ninguna otra.
- El cliente (`src/api/`) manda los pedidos sin cookies ni credenciales,
  valida los datos antes de enviarlos y nunca muestra en pantalla el texto
  que devuelve el servidor.
- La dirección que se analiza viaja sin query ni fragmento, que es donde
  suelen ir correos y tokens.
- La tabla guarda seis columnas y ningún dato personal; los logs, sin IP.

El contrato propuesto, con una tabla de referencia y las preguntas abiertas,
está en `docs/contrato-api.md`. Cuando el servicio se publique, este
documento tiene que sumar los controles del backend (validación, límite de
pedidos, copias de seguridad de la base), y la política de privacidad del
sitio tiene que contar qué se guarda y para qué.

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
