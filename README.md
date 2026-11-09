# tuaccesible.com

Código del sitio [tuaccesible.com](https://tuaccesible.com). Las páginas están escritas como componentes de [React](https://react.dev/) y [Vite](https://vite.dev/) las convierte en HTML estático al compilar. Lo que publica GitHub Pages son archivos HTML comunes: se leen sin JavaScript y ninguna página descarga React, salvo las que tengan una isla (hoy, ninguna).

Por qué así y no una aplicación React de una sola página: el sitio funciona completo sin JavaScript, su política de seguridad de contenido no deja correr script en línea y pasa pa11y en WCAG2AAA. Una aplicación de una sola página rompe esas tres cosas.

## Qué necesitas

- Git.
- Node.js 22.13 o posterior. Sirve la versión LTS que ofrece [nodejs.org](https://nodejs.org/). Para saber cuál tienes, escribe `node --version` en la terminal. Si usas nvm o fnm, el archivo `.nvmrc` ya dice cuál usar.

## Levantar el sitio en tu equipo

1. Clona el repositorio y entra en la carpeta:

   ```bash
   git clone https://github.com/piapenia/tuaccesible.git
   cd tuaccesible
   ```

2. Instala las dependencias. `npm ci` instala exactamente las versiones de `package-lock.json`, así todo el equipo trabaja con lo mismo:

   ```bash
   npm ci
   ```

3. Levanta el servidor local:

   ```bash
   npm run dev
   ```

   `npm run serve`, el comando de antes, sigue funcionando y hace lo mismo.

4. Abre en el navegador la dirección que aparece en la terminal, en la línea que empieza con `Sitio en`. Normalmente es `http://localhost:5173/`. Si ese puerto está ocupado, el servidor avisa y usa el siguiente libre (5174, 5175...).

Cada vez que guardas un archivo de `src/` o de `public/`, la pestaña se recarga sola. Para apagar el servidor, pulsa Ctrl+C en la terminal.

El servidor solo responde a tu propia computadora. Para abrir el sitio desde el celular u otro equipo conectado a la misma red, por ejemplo para probarlo con TalkBack o VoiceOver, levántalo así:

```bash
npm run dev -- --host
```

La terminal muestra entonces la dirección para el otro equipo, del tipo `http://192.168.0.10:5173/`. Mientras esté así, lo puede abrir cualquiera conectado a esa red: úsalo solo en una red de confianza y apágalo al terminar.

## Si algo falla

### La instalación tarda mucho o falla al descargar Chrome

`npm ci` descarga dos versiones de Chrome, varios cientos de MB, que solo usa el control de accesibilidad (`pa11y-ci`). Para editar y ver el sitio no hacen falta. Para instalar sin ellas, borra la carpeta `node_modules` si quedó a medias y vuelve a instalar así:

- En PowerShell:

  ```powershell
  $env:PUPPETEER_SKIP_DOWNLOAD="true"; npm ci
  ```

- En el Símbolo del sistema (cmd), en dos líneas:

  ```bat
  set PUPPETEER_SKIP_DOWNLOAD=true
  npm ci
  ```

- En macOS o Linux:

  ```bash
  PUPPETEER_SKIP_DOWNLOAD=true npm ci
  ```

### PowerShell dice que la ejecución de scripts está deshabilitada

El mensaje es del tipo "No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la ejecución de scripts está deshabilitada en este sistema". Escribe `npm.cmd` en lugar de `npm` (por ejemplo `npm.cmd ci` y `npm.cmd run dev`), o usa el Símbolo del sistema en vez de PowerShell.

### npm avisa de la versión de Node

Si aparece `EBADENGINE` o `Unsupported engine`, tu Node es anterior a la 22.13. Instala la versión LTS de nodejs.org y vuelve a empezar desde `npm ci`.

### La página se ve sin estilos

No abras los archivos `.html` con doble clic. Las rutas del sitio empiezan en la raíz (`/css/global.css`) y solo funcionan cuando un servidor las sirve. Usa `npm run dev`, o `npm run preview` para ver lo compilado.

### La compilación se corta con un mensaje sobre una página

Es a propósito. `npm run build` revisa cada página y se corta con un mensaje que dice qué archivo arreglar si falta el título, la descripción, el idioma o la página del otro idioma, o si dos páginas no se apuntan entre sí (ver "Editar o crear una página"). `npm run dev` hace la misma revisión y muestra el mensaje en la terminal y en la pestaña.

## Comandos

- `npm run dev`: servidor local con recarga automática, en `http://localhost:5173/`. Con `npm run dev -- --host` también se abre desde otros equipos de tu red.
- `npm run build`: compila el sitio en `dist/`, que es exactamente lo que se publica. Para compilar en otra carpeta: `node scripts/construir.js --salida otra-carpeta`. Como la compilación vacía esa carpeta antes de escribir, solo acepta `dist/`, una carpeta nueva o vacía, o una compilación anterior del sitio; cualquier otra la rechaza sin tocarla.
- `npm run preview`: sirve lo compilado en `http://localhost:8080/`. Corre antes `npm run build`.
- `npm test`: corre las pruebas del cliente de la API (`src/api/`), de las islas y del control de la carpeta de salida.
- `npm run verificar:contraste`: el mismo control de contraste que se hace antes de publicar. Lee los colores de `public/css/global.css` y falla si algún par queda por debajo del mínimo.
- `npm run generar:og`: regenera las dos tarjetas para redes sociales. Solo hace falta si cambian el lema o el logotipo, y necesita la fuente Century Gothic instalada.

Para correr el control de accesibilidad igual que antes de publicar, hace falta haber instalado Chrome (sin `PUPPETEER_SKIP_DOWNLOAD`) y tener libre el puerto 8080. Compila y sirve lo compilado:

```bash
npm run build
npm run preview
```

Y en otra terminal, dentro de la misma carpeta:

```bash
npx pa11y-ci
```

## Cómo está organizado

- `src/`: el código del sitio.
  - `paginas/`: una página por archivo. Las de español están sueltas en esta carpeta y las de inglés en `paginas/en/`.
  - `componentes/`: lo que comparten las páginas.
    - `Sitio.jsx`: el esqueleto visible de todas las páginas: enlace para saltar al contenido, aviso de idioma, cabecera, contenido y pie.
    - `Encabezado.jsx`, `PieDePagina.jsx`, `AvisoIdioma.jsx` y `Logo.jsx`: las partes de ese esqueleto.
    - `Desplegable.jsx` y `DatosEstructurados.jsx`: piezas para usar dentro de las páginas.
    - `formularios/`: `FormularioWeb3Forms.jsx` y `ProteccionDeDatos.jsx`, para los formularios de contacto y de reseñas.
    - `Isla.jsx`: marca una parte interactiva (ver "Partes interactivas: las islas").
  - `islas/`: los componentes interactivos y su lista, `registro.js`. Hoy está vacía.
  - `api/`: el cliente que habla con el backend del servicio de testing.
  - `documento.js`: el `<head>` de todas las páginas y los scripts del final.
  - `seguridad.js`: la política de seguridad de contenido.
  - `configuracion.js`: la dirección del backend, que sale de `VITE_API_URL`.
  - `navegacion.js`: los enlaces del menú principal, en los dos idiomas.
  - `sitio.js`: la dirección del sitio y el correo de contacto.
  - `renderizar.jsx`: convierte cada página en un documento HTML y arma el sitemap y el robots.txt.
  - `cliente.jsx`: el JavaScript que llega al navegador en las páginas con islas.
  - `utilidades/`: dos funciones chicas, una que escapa texto para el HTML y otra que escribe los datos para buscadores.
- `public/`: se copia tal cual al sitio publicado: `css/global.css`, `img/`, `js/lang.js` (el aviso de idioma), `js/count.js` (GoatCounter), `CNAME` y `.well-known/security.txt`.
- `scripts/`: `construir.js` (lo que corre `npm run build`) y `desarrollo.js` (lo que corre `npm run dev`).
- `tools/`: el verificador de contraste y el generador de tarjetas sociales.
- `docs/`: `contrato-api.md`, el contrato propuesto con el backend.
- `dist/`: lo que genera la compilación. No se sube al repositorio.

## Editar o crear una página

El nombre del archivo es la dirección de la página:

- `src/paginas/index.jsx` es `/`.
- `src/paginas/servicios.jsx` es `/servicios/`.
- `src/paginas/en/index.jsx` es `/en/`.
- `src/paginas/en/services.jsx` es `/en/services/`.
- `src/paginas/404.jsx` es `/404.html`, la página que GitHub Pages muestra cuando una dirección no existe.

Cada archivo tiene dos partes: los datos de la página y su contenido. Por ejemplo, el principio de `src/paginas/contacto.jsx`:

```jsx
export const pagina = {
  idioma: "es",
  titulo: "Contacto",
  descripcion: "Escríbenos por correo o completa el formulario.",
  rutaAlternativa: "/en/contact/",
};

export default function Contacto() {
  return (
    <>
      <h1>Contacto</h1>
      <p className="lede">Como prefieras: un correo directo o el formulario de aquí abajo.</p>
    </>
  );
}
```

- `idioma`: `"es"` o `"en"`. Va al atributo `lang` de la página.
- `titulo`: el título de la pestaña y de la tarjeta al compartir. El sitio le agrega ` · tuaccesible.com`.
- `descripcion`: la descripción para buscadores y redes.
- `rutaAlternativa`: la misma página en el otro idioma. La usan el conmutador de idioma y los `hreflang`. Esa otra página tiene que apuntar de vuelta a esta; si no, la compilación se corta y dice cuáles son.
- `noindex: true`, opcional: para páginas que no tienen que aparecer en buscadores ni en el sitemap, como las de confirmación de formulario.

Para crear una página nueva alcanza con crear el archivo: aparece sola en el sitio, en el sitemap y en la compilación. Dos cosas son a mano: si va en el menú, se agrega en `src/navegacion.js`, y su dirección se suma a `.pa11yci.json` para que el control de accesibilidad la revise antes de publicar.

### Cómo se escribe el contenido

El contenido es JSX, que se parece mucho a HTML. Las diferencias que aparecen en este sitio:

- `class` se escribe `className` y `for` se escribe `htmlFor`:

  ```jsx
  <label htmlFor="name">Nombre (obligatorio)</label>
  ```

- Las etiquetas que no tienen cierre terminan en `/>`: `<br />`, `<img ... />`, `<input ... />`.
- Algunos atributos van con mayúscula en el medio (`autoComplete`, `tabIndex`, `hrefLang`) y los números van entre llaves: `rows={6}`, `tabIndex={-1}`.
- Las entidades funcionan como en HTML, por ejemplo `&nbsp;`. Las llaves son especiales: para escribir una como texto, se escribe `{"{"}`.
- Los comentarios dentro del contenido van así: `{/* comentario */}`.
- Los espacios. Dentro de un mismo renglón, funcionan como en HTML. Pero un salto de renglón entre dos elementos se come el espacio que hubiera entre ellos. Por eso, donde dos elementos en renglones distintos tienen que quedar separados en pantalla, el primero termina con `{" "}`. Es el caso de la casilla de autorización del formulario de reseñas:

  ```jsx
  <input type="checkbox" id="consent" name="consent_publicacion" value="Sí" required />{" "}
  <label htmlFor="consent">Autorizo a publicar esta reseña y el nombre que escribí arriba en tuaccesible.com (obligatorio)</label>
  ```

  Sin ese `{" "}`, la casilla y su texto quedarían pegados. Los párrafos de texto con enlaces van en un solo renglón, como `<p>Escríbenos a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>`, y ahí no hay nada que pensar.

### Piezas que ya existen

- `<Desplegable resumen="Qué incluye la auditoría exprés">...</Desplegable>`: un bloque que se abre y se cierra, hecho con el `<details>` nativo del navegador.
- `<FormularioWeb3Forms idioma="es" asunto="Nueva consulta desde tuaccesible.com">...</FormularioWeb3Forms>`: la etiqueta del formulario, los campos ocultos de Web3Forms y la trampa antispam. Dentro van los campos visibles y el botón.
- `<ProteccionDeDatos>...</ProteccionDeDatos>`: el recuadro de protección de datos que va junto al botón de envío.
- `<DatosEstructurados datos={...} />`: un bloque de datos para buscadores (schema.org).

Cada una explica en su archivo cuándo usarla y por qué está hecha así.

## Partes interactivas: las islas

Una isla es la única forma de que una página cargue React en el navegador. Sirve solo cuando algo necesita JavaScript de verdad, como el formulario del servicio de testing que va a hablar con el backend. Para lo demás, primero lo que el navegador ya trae: enlaces, formularios, `<details>`.

Para crear una:

1. Escribe el componente en `src/islas/`, por ejemplo `src/islas/Analizador.jsx`.
2. Agrégalo a la lista de `src/islas/registro.js`:

   ```js
   import { Analizador } from "./Analizador.jsx";

   export const islas = { Analizador };
   ```

3. Úsalo en una página:

   ```jsx
   import { Isla } from "../componentes/Isla.jsx";

   <Isla nombre="Analizador" props={{ idioma: "es" }} />
   ```

Qué pasa al compilar: el componente se dibuja como el resto de la página, así que su contenido inicial está en el HTML aunque no cargue el JavaScript. Esa página, y solo esa, carga un archivo `/assets/cliente-....js`. En el navegador, React toma ese HTML ya dibujado y le conecta los eventos.

Cada isla lleva su propio prefijo para los `id` que crea `useId`, así que dos islas en la misma página nunca repiten un `id`, como el que une una etiqueta con su campo. No hace falta hacer nada para que funcione.

Dos cuidados:

- Las `props` quedan escritas en el código fuente de la página, a la vista de cualquiera. Solo datos simples (textos, números, listas) y nada privado.
- Las llamadas al backend van en un manejador de eventos (`onSubmit`, `onClick`) o en un `useEffect`, nunca mientras se dibuja el componente: la isla también se dibuja al compilar, en Node, y ahí no tiene que salir ningún pedido.

## Conectar con el backend

El backend del servicio de testing lo programa Fafa en su propio repositorio, con Node.js, Express y PostgreSQL. En local corre en `http://localhost:3000` y tiene que permitir, con CORS, los dos orígenes del sitio: `http://localhost:5173` (`npm run dev`) y `http://localhost:8080` (`npm run preview`).

Para trabajar con los dos a la vez:

1. En una terminal, el backend, como diga el README de su repositorio.
2. En otra, este sitio con `npm run dev`.

No hace falta configurar nada más: `.env.development` ya fija `VITE_API_URL=http://localhost:3000`. Si tu backend usa otro puerto, no cambies ese archivo: crea `.env.development.local` (no se sube a GitHub) con tu valor, por ejemplo `VITE_API_URL=http://localhost:3001`.

La política de seguridad suma esa dirección a `connect-src` sola. En el sitio publicado no hay `VITE_API_URL` todavía: la política queda como siempre y el cliente informa que el servicio no está configurado, sin intentar ninguna conexión.

Cómo probar la versión compilada contra el backend local, los pedidos que existen, el formato de error y las reglas de privacidad están en [el contrato con el backend](docs/contrato-api.md).

## Cómo se publica

Cada push a la rama `master` dispara `.github/workflows/deploy.yml`. En orden: instala con `npm ci`, corre las pruebas, el control de contraste, la compilación y `pa11y-ci` con WCAG 2 nivel AAA en las 25 direcciones de `.pa11yci.json`. Si todo pasa, publica `dist/` en tuaccesible.com. Si algo falla, no se publica nada. Para proponer un cambio sin publicarlo, trabaja en una rama propia y abre un pull request.

En `deploy.yml`, `upload-pages-artifact` lleva `include-hidden-files: true`. No quites esa línea: sin ella, desde la versión 4 de esa acción, el sitio deja de publicar `.well-known/security.txt`. Cuando Dependabot proponga una versión nueva de la acción, comprueba después de publicar que `https://tuaccesible.com/.well-known/security.txt` siga respondiendo.

## Antes de tocar ciertas cosas

- Colores, logotipo o tipografía: lee `MARCA.md`.
- Scripts, formularios o servicios externos: lee `SEGURIDAD.md` y los comentarios de `src/seguridad.js`, donde vive la política de seguridad de contenido. Un script nuevo tiene que vivir en `public/js/` o ser una isla, porque la política no deja cargar scripts de otros dominios ni escritos dentro del HTML.
- El destino de los formularios: si deja de ser Web3Forms, hay que cambiar también `form-action` en `src/seguridad.js`, o el navegador bloquea el envío.
- Con `npm run dev`, la política es un poco más abierta que en el sitio publicado, para que funcionen la recarga automática y Safari en `localhost`. El sitio publicado no cambia: el despliegue compila con `npm run build`, y ahí esa excepción no se aplica.
