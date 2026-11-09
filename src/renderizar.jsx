/* Convierte cada pagina de src/paginas/ en un documento HTML completo.

   Lo usan los dos scripts de scripts/: el servidor de desarrollo, que dibuja
   la pagina cada vez que el navegador la pide, y la compilacion, que las
   dibuja todas una vez y las escribe en dist/.

   La direccion de cada pagina sale del nombre de su archivo:
     src/paginas/index.jsx           ->  /
     src/paginas/servicios.jsx       ->  /servicios/
     src/paginas/en/index.jsx        ->  /en/
     src/paginas/en/services.jsx     ->  /en/services/
     src/paginas/404.jsx             ->  /404.html
   Para crear una pagina nueva alcanza con crear el archivo: aparece sola en
   el sitio, en el sitemap y en la compilacion. */

import { renderToStaticMarkup } from "react-dom/server";
import { Sitio } from "./componentes/Sitio.jsx";
import { ContextoIslas } from "./componentes/Isla.jsx";
import { documentoHtml } from "./documento.js";
import { origenApi } from "./configuracion.js";
import { sitio } from "./sitio.js";

const modulos = import.meta.glob("./paginas/**/*.jsx", { eager: true });

function rutaDesdeArchivo(archivo) {
  const relativo = archivo.replace(/^\.\/paginas\//, "").replace(/\.jsx$/, "");
  if (relativo === "404") return "/404.html";
  if (relativo === "index") return "/";
  if (relativo.endsWith("/index")) return `/${relativo.slice(0, -"index".length)}`;
  return `/${relativo}/`;
}

function archivoDeSalida(ruta) {
  return ruta.endsWith(".html") ? ruta : `${ruta}index.html`;
}

function validar(archivo, modulo) {
  const donde = `src/paginas/${archivo.replace(/^\.\/paginas\//, "")}`;
  const datos = modulo.pagina;
  if (typeof modulo.default !== "function") {
    throw new Error(`${donde} tiene que exportar el componente de la pagina con "export default function ..."`);
  }
  if (!datos) {
    throw new Error(`${donde} tiene que exportar "export const pagina = { idioma, titulo, descripcion, rutaAlternativa }"`);
  }
  for (const campo of ["idioma", "titulo", "descripcion", "rutaAlternativa"]) {
    if (!datos[campo]) throw new Error(`${donde}: falta "${campo}" en export const pagina`);
  }
  if (datos.idioma !== "es" && datos.idioma !== "en") {
    throw new Error(`${donde}: idioma tiene que ser "es" o "en", no "${datos.idioma}"`);
  }
}

export const paginas = Object.entries(modulos)
  .map(([archivo, modulo]) => {
    validar(archivo, modulo);
    const ruta = rutaDesdeArchivo(archivo);
    return { ...modulo.pagina, ruta, archivo: archivoDeSalida(ruta), Componente: modulo.default };
  })
  .sort((a, b) => a.ruta.localeCompare(b.ruta));

/* Cada pagina indexable y su version en el otro idioma tienen que apuntarse
   entre si: los buscadores ignoran un hreflang que no es reciproco. */
for (const pagina of paginas) {
  const otra = paginas.find((p) => p.ruta === pagina.rutaAlternativa);
  if (!otra) {
    throw new Error(`La pagina ${pagina.ruta} dice que su version en el otro idioma es ${pagina.rutaAlternativa}, y esa pagina no existe`);
  }
  if (!pagina.noindex && !otra.noindex && otra.rutaAlternativa !== pagina.ruta) {
    throw new Error(`${pagina.ruta} apunta a ${otra.ruta}, pero ${otra.ruta} apunta a ${otra.rutaAlternativa}: tienen que apuntarse entre si`);
  }
}

export function buscarPagina(ruta) {
  return paginas.find((p) => p.ruta === ruta || p.archivo === ruta) ?? null;
}

/* React 19 agrega por su cuenta un <link rel="preload" as="image"> por cada
   imagen que encuentra (hoy, el retrato de las paginas de equipo) y lo pone
   al principio de lo que dibuja: dentro del <body>, antes del enlace de
   salto. Se quita para que cada pagina sea exactamente el marcado que se
   escribio. Si algun dia conviene precargar una imagen, se declara a mano en
   src/documento.js. */
function quitarPrecargasAutomaticas(html) {
  let resto = html;
  for (;;) {
    const coincidencia = resto.match(/^<link (?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*\/>/);
    if (!coincidencia) return resto;
    resto = resto.slice(coincidencia[0].length);
  }
}

/* desarrollo: true en "npm run dev".
   hojaDeEstilos: direccion del CSS que enlazan todas las paginas. En la
   compilacion es el archivo que genero Vite (con su hash en el nombre); en
   "npm run dev", /src/estilos/sitio.css, que Vite compila al pedirlo.
   scriptCliente: direccion del JavaScript de las islas, o null si todavia no
   se compilo. Solo se usa si la pagina tiene alguna <Isla>. */
export function renderizarPagina(pagina, { desarrollo = false, hojaDeEstilos = null, scriptCliente = null } = {}) {
  const islasUsadas = new Set();
  const { Componente } = pagina;
  const html = renderToStaticMarkup(
    <ContextoIslas.Provider value={islasUsadas}>
      <Sitio pagina={pagina}>
        <Componente ruta={pagina.ruta} idioma={pagina.idioma} />
      </Sitio>
    </ContextoIslas.Provider>
  );
  const usaIslas = islasUsadas.size > 0;
  return {
    archivo: pagina.archivo,
    usaIslas,
    html: documentoHtml({
      pagina,
      cuerpoHtml: quitarPrecargasAutomaticas(html),
      desarrollo,
      origenApi,
      hojaDeEstilos,
      scriptCliente: usaIslas ? scriptCliente : null,
    }),
  };
}

export function generarSitemap() {
  const entradas = paginas
    .filter((p) => !p.noindex && p.ruta !== "/404.html")
    .map(
      (p) =>
        `  <url>\n` +
        `    <loc>${sitio.url}${p.ruta}</loc>\n` +
        `    <xhtml:link rel="alternate" hreflang="${p.idioma}" href="${sitio.url}${p.ruta}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="${p.idioma === "en" ? "es" : "en"}" href="${sitio.url}${p.rutaAlternativa}"/>\n` +
        `  </url>`
    );
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${entradas.join("\n")}\n` +
    `</urlset>\n`
  );
}

export function generarRobots() {
  return `# tuaccesible.com
# Todo el sitio es publico y se puede indexar. Las dos paginas de
# confirmacion de formulario llevan noindex en su propio marcado y por eso
# no aparecen en el sitemap.
User-agent: *
Allow: /

Sitemap: ${sitio.url}/sitemap.xml
`;
}
