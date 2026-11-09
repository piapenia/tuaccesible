/* Arma el documento HTML completo de una pagina: <head> y los scripts del
   final del <body>. El cuerpo visible lo dibuja React (src/componentes/).

   Por que el <head> es texto y no un componente de React: React 19 reordena
   por su cuenta algunas etiquetas del <head>. Sube los <script async> por
   encima del resto (quedaban antes que la politica de seguridad, que tiene
   que ir primero para valer sobre todo lo que viene despues) y mueve las
   hojas de estilo. Escribiendolo como texto, el orden es exactamente este y
   no depende de la version de React. */

import { sitio } from "./sitio.js";
import { politicaDeSeguridad } from "./seguridad.js";
import { escapar } from "./utilidades/escapar.js";
import { serializarJsonLd } from "./utilidades/json-ld.js";

export function documentoHtml({ pagina, cuerpoHtml, desarrollo, origenApi, scriptCliente }) {
  const { idioma, titulo, descripcion, ruta, rutaAlternativa, noindex } = pagina;
  const en = idioma === "en";
  const url = sitio.url + ruta;
  const tituloCompleto = `${titulo} · tuaccesible.com`;

  /* Datos estructurados. Un bloque application/ld+json es un data block, no
     un script ejecutable: el navegador lo descarta en el paso 13 de "prepare
     the script element", antes de llegar a la comprobacion de CSP del paso
     21, asi que la politica script-src 'self' no lo bloquea. Verificado en el
     navegador, no solo en la especificacion.
     Deliberadamente Organization y no ProfessionalService ni LocalBusiness:
     esos dos esperan direccion postal y horarios, y aqui no hay oficina que
     declarar. Inventarla seria justo el humo que critica la pagina de
     certificados. */
  const organizacion = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "tuaccesible",
    url: `${sitio.url}/`,
    logo: `${sitio.url}/img/logo-tuaccesible.svg`,
    image: `${sitio.url}/img/og-tuaccesible.png`,
    email: sitio.correo,
    description: en
      ? "Digital accessibility consulting. Web accessibility audits against WCAG 2.2, EN 301 549, the ADA and Section 508."
      : "Consultoría en accesibilidad digital. Auditorías de accesibilidad web contra WCAG 2.2, EN 301 549, ADA y Section 508.",
    knowsLanguage: ["es", "en"],
    areaServed: ["US", "ES", "AR"],
  };

  /* Una tarjeta por idioma: quien comparte una pagina inglesa en LinkedIn
     tiene que ver el lema en ingles. Las dos son 1200x630 y comparten
     geometria; el alt transcribe el texto que cada una lleva grabado. */
  const imagenSocial = `${sitio.url}/img/og-tuaccesible${en ? "-en" : ""}.png`;
  const altImagenSocial = en
    ? "The tuaccesible logo, with the tagline: Digital accessibility consulting. WCAG, ADA and EN 301 549 audits."
    : "El logotipo de tuaccesible con el lema: Consultoría en accesibilidad digital. Auditorías WCAG, EN 301 549 y EAA.";

  const lineas = [
    "<!doctype html>",
    `<html lang="${escapar(idioma)}">`,
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <meta http-equiv="Content-Security-Policy" content="${escapar(politicaDeSeguridad({ desarrollo, origenApi }))}">`,
    '  <meta name="referrer" content="strict-origin-when-cross-origin">',
    "",
    `  <title>${escapar(tituloCompleto)}</title>`,
    `  <meta name="description" content="${escapar(descripcion)}">`,
    `  <link rel="canonical" href="${escapar(url)}">`,
    noindex ? '  <meta name="robots" content="noindex, follow">' : null,
    "",
    `  <link rel="alternate" hreflang="${escapar(idioma)}" href="${escapar(url)}">`,
    `  <link rel="alternate" hreflang="${en ? "es" : "en"}" href="${escapar(sitio.url + rutaAlternativa)}">`,
    `  <link rel="alternate" hreflang="x-default" href="${escapar(sitio.url)}/">`,
    "",
    '  <link rel="icon" href="/img/favicon.svg" type="image/svg+xml">',
    '  <link rel="apple-touch-icon" href="/img/icono-180.png">',
    "",
    '  <meta property="og:type" content="website">',
    '  <meta property="og:site_name" content="tuaccesible">',
    `  <meta property="og:title" content="${escapar(tituloCompleto)}">`,
    `  <meta property="og:description" content="${escapar(descripcion)}">`,
    `  <meta property="og:url" content="${escapar(url)}">`,
    `  <meta property="og:locale" content="${en ? "en_US" : "es_ES"}">`,
    `  <meta property="og:image" content="${escapar(imagenSocial)}">`,
    '  <meta property="og:image:width" content="1200">',
    '  <meta property="og:image:height" content="630">',
    `  <meta property="og:image:alt" content="${escapar(altImagenSocial)}">`,
    '  <meta name="twitter:card" content="summary_large_image">',
    "",
    '  <link rel="stylesheet" href="/css/global.css">',
    "",
    '  <script type="application/ld+json">',
    serializarJsonLd(organizacion),
    "  </script>",
    "</head>",
    "<body>",
    cuerpoHtml,
    "",
    '  <script src="/js/lang.js" defer></script>',
    "",
    /* Analitica sin cookies. El archivo se sirve desde este dominio y no desde
       un servidor ajeno, para no abrir script-src a terceros. El pixel de
       respaldo solo se dibuja cuando no hay JavaScript, asi que nunca cuenta
       dos veces la misma visita. */
    '  <script data-goatcounter="https://tuaccesible.goatcounter.com/count" async src="/js/count.js"></script>',
    `  <noscript><img src="https://tuaccesible.goatcounter.com/count?p=${escapar(ruta)}" alt="" width="1" height="1"></noscript>`,
    /* Solo las paginas con alguna <Isla> cargan React en el navegador. */
    scriptCliente ? `  <script type="module" src="${escapar(scriptCliente)}"></script>` : null,
    /* Recarga automatica mientras se edita. Solo existe en "npm run dev". */
    desarrollo ? '  <script type="module" src="/@vite/client"></script>' : null,
    "</body>",
    "</html>",
    "",
  ];

  return lineas.filter((linea) => linea !== null).join("\n");
}
