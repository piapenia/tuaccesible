/* Componentes del sistema de diseno: que el HTML que dibujan sea el que
   promete cada uno (roles, etiquetas unidas, iconos ocultos al lector de
   pantalla) y que ninguno escriba un atributo style, que la politica de
   seguridad del sitio prohibe (style-src 'self').

   Los .jsx se cargan con Vite, igual que en Isla.test.js. */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const raiz = path.resolve(import.meta.dirname, "..", "..");
let vite;
let m = {};
let iconos;

before(async () => {
  vite = await createServer({
    root: raiz,
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  for (const nombre of ["Icono", "Boton", "Tarjetas", "Campo", "Aviso", "Desplegable", "Seccion", "Banda", "Credenciales", "Encabezado", "PieDePagina", "Indice", "Sitio", "PreferenciasVisualizacion"]) {
    Object.assign(m, await vite.ssrLoadModule(`/src/componentes/${nombre}.jsx`));
  }
  iconos = await import("lucide-react");
});

after(async () => {
  await vite?.close();
});

const dibujar = (elemento) => {
  const html = renderToStaticMarkup(elemento);
  assert.doesNotMatch(html, /\sstyle=/, "ningun componente puede escribir style=");
  return html;
};

test("Icono: oculto al lector de pantalla y del color del texto", () => {
  const html = dibujar(h(m.Icono, { de: iconos.Mail, className: "extra" }));
  assert.match(html, /^<svg[^>]* aria-hidden="true"/);
  assert.match(html, /class="lucide lucide-mail icono extra"/);
  assert.match(html, /stroke="currentColor"/);
  assert.throws(() => dibujar(h(m.Icono, {})), /falta de=/);
});

test("Boton: enlace con href, boton sin href", () => {
  const enlace = dibujar(h(m.Boton, { href: "/contactanos/" }, "Escribir"));
  assert.equal(enlace, '<a href="/contactanos/" class="boton boton--primario">Escribir</a>');

  const boton = dibujar(h(m.Boton, { variante: "secundario", chico: true, id: "x" }, "Cambiar"));
  assert.equal(boton, '<button type="button" class="boton boton--secundario boton--chico" id="x">Cambiar</button>');

  const enviar = dibujar(h(m.Boton, { tipo: "submit", icono: iconos.ArrowRight }, "Enviar"));
  assert.match(enviar, /^<button type="submit" class="boton boton--primario">Enviar<svg[^>]*class="lucide lucide-arrow-right icono boton__icono" aria-hidden="true"/);

  assert.throws(() => dibujar(h(m.Boton, { variante: "terciario" }, "x")), /variante/);
});

test("Tarjetas: una lista con un solo enlace por tarjeta, en el titulo", () => {
  const html = dibujar(
    h(
      m.Tarjetas,
      null,
      h(m.Tarjeta, { titulo: "Auditoría exprés", href: "/servicios/#auditoria-expres", icono: iconos.Zap }, "Un diagnóstico rápido."),
      h(m.Tarjeta, { titulo: "Taller", href: "/servicios/#taller", nivel: 2 }, "Para tu equipo.")
    )
  );
  assert.match(html, /^<ul class="tarjetas" role="list"><li class="tarjeta">/);
  assert.equal(html.match(/<li /g).length, 2);
  assert.equal(html.match(/<a /g).length, 2, "un enlace por tarjeta");
  assert.match(html, /<h3 class="tarjeta__titulo"><a href="\/servicios\/#auditoria-expres">Auditoría exprés<svg[^>]*aria-hidden="true"/);
  assert.match(html, /<h2 class="tarjeta__titulo"><a href="\/servicios\/#taller">Taller<svg/);
  assert.match(html, /<p class="tarjeta__texto">Un diagnóstico rápido.<\/p>/);
  // Todos los iconos (el del servicio y las flechas) ocultos.
  const svgs = html.match(/<svg[^>]*>/g);
  assert.equal(svgs.length, 3);
  for (const svg of svgs) assert.match(svg, /aria-hidden="true"/);
  assert.throws(() => dibujar(h(m.Tarjeta, { titulo: "Sin destino" }, "x")), /faltan titulo o href/);
});

test("Campo: etiqueta, ayuda y error unidos al control", () => {
  const simple = dibujar(h(m.Campo, { etiqueta: "Nombre (obligatorio)" }, h("input", { type: "text", id: "name", required: true })));
  assert.equal(
    simple,
    '<div class="campo"><label for="name" class="campo__etiqueta">Nombre (obligatorio)</label><input type="text" id="name" required=""/></div>'
  );

  const conAyuda = dibujar(h(m.Campo, { etiqueta: "Servicio", ayuda: "Si no sabes, déjalo así." }, h("select", { id: "service" })));
  assert.match(conAyuda, /<p id="service-ayuda" class="campo__ayuda">Si no sabes, déjalo así.<\/p><select id="service" aria-describedby="service-ayuda">/);
  assert.doesNotMatch(conAyuda, /aria-invalid/);

  const conError = dibujar(
    h(m.Campo, { etiqueta: "Correo", ayuda: "Te respondemos ahí.", error: "Falta la arroba." }, h("input", { type: "email", id: "email" }))
  );
  assert.match(conError, /<input type="email" id="email" aria-describedby="email-ayuda email-error" aria-invalid="true"\/>/);
  assert.match(conError, /<p id="email-error" class="campo__error"><svg[^>]*aria-hidden="true"[^>]*>.*<\/svg>Falta la arroba.<\/p>/);
  // Orden: etiqueta, ayuda, error, control.
  const orden = ["<label", 'id="email-ayuda"', 'id="email-error"', "<input"].map((x) => conError.indexOf(x));
  assert.deepEqual([...orden].sort((a, b) => a - b), orden);

  const casilla = dibujar(h(m.Campo, { etiqueta: "Autorizo (obligatorio)", casilla: true }, h("input", { type: "checkbox", id: "consent" })));
  assert.match(casilla, /^<div class="campo campo--casilla"><input type="checkbox" id="consent"\/> <label for="consent"/);

  assert.throws(() => dibujar(h(m.Campo, { etiqueta: "Sin id" }, h("input", { type: "text" }))), /necesita un id/);
});

test("Aviso: parrafo comun, sin rol de alerta", () => {
  const html = dibujar(h(m.Aviso, null, h("strong", null, "Todavía no hay reseñas."), " Las publicamos con permiso."));
  assert.match(html, /^<div class="aviso"><svg[^>]*class="lucide lucide-info icono aviso__icono" aria-hidden="true"/);
  assert.match(html, /<p class="aviso__texto"><strong>Todavía no hay reseñas.<\/strong> Las publicamos con permiso.<\/p><\/div>$/);
  assert.doesNotMatch(html, /role=|aria-live/);
});

test("Desplegable: details nativo con la flecha oculta", () => {
  const html = dibujar(h(m.Desplegable, { resumen: "Qué incluye" }, h("p", null, "Todo.")));
  assert.match(html, /^<details class="desplegable"><summary><span class="desplegable__resumen">Qué incluye<\/span><svg[^>]*aria-hidden="true"/);
  assert.match(html, /<\/summary><div class="desplegable__contenido"><p>Todo.<\/p><\/div><\/details>$/);
  assert.doesNotMatch(html, /aria-expanded/);
});

test("Seccion: section sin nombre, h2 y numero oculto al lector", () => {
  const html = dibujar(h(m.Seccion, { numero: "01", titulo: "Cuatro formas de empezar" }, h("p", null, "Texto.")));
  assert.equal(
    html,
    '<section class="seccion"><div class="seccion__cabeza"><span class="seccion__numero" aria-hidden="true">01</span><h2 class="seccion__titulo">Cuatro formas de empezar</h2></div><div class="seccion__cuerpo"><p>Texto.</p></div></section>'
  );
  // Sin nombre no es una region: no suma puntos de referencia en NVDA.
  assert.doesNotMatch(html, /aria-label|role=/);

  const sinNumero = dibujar(h(m.Seccion, { titulo: "Contacto", id: "contacto" }, "x"));
  assert.match(sinNumero, /^<section class="seccion" id="contacto"><div class="seccion__cabeza"><h2 /);
  assert.doesNotMatch(sinNumero, /seccion__numero/);

  assert.throws(() => dibujar(h(m.Seccion, {}, "x")), /falta titulo/);
});

test("Banda: un div comun, sin rol ni nombre", () => {
  const html = dibujar(h(m.Banda, null, h("p", null, h("a", { href: "/contactanos/" }, "Escribir"), " o leer.")));
  assert.equal(html, '<div class="banda"><p><a href="/contactanos/">Escribir</a> o leer.</p></div>');
});

test("Banda: con titulo, el titulo va como h2 al principio", () => {
  const html = dibujar(h(m.Banda, { titulo: "Hablemos" }, h("p", null, "Texto.")));
  assert.equal(html, '<div class="banda"><h2 class="banda__titulo">Hablemos</h2><p>Texto.</p></div>');
});

test("Credenciales: una lista con el valor y la explicacion de cada dato", () => {
  const html = dibujar(h(m.Credenciales, null, h(m.Credencial, { valor: "Desde 2021" }, "Auditorías")));
  assert.equal(html, '<ul class="credenciales" role="list"><li class="credencial"><span class="credencial__valor">Desde 2021</span> <span class="credencial__texto">Auditorías</span></li></ul>');
  assert.throws(() => dibujar(h(m.Credencial, null, "sin valor")), /falta valor/);
});

test("Encabezado: la franja de atajos va primero y el aviso de idioma queda dentro", () => {
  const html = dibujar(h(m.Encabezado, { idioma: "en", ruta: "/en/services/", rutaAlternativa: "/servicios/" }));
  assert.match(
    html,
    /^<header class="site-header"><div class="atajos"><div class="wrap atajos__fila"><a href="#contenido-principal">Skip to main content<\/a> <a href="#pie">Skip to footer<\/a> <div class="atajos__ajustes"><a class="atajos__preferencias" href="\/en\/preferences\/"><svg[^>]*class="lucide lucide-sliders-horizontal icono"[^>]*aria-hidden="true"[^>]*>.*?<\/svg>Display preferences<\/a> <a class="lang-switch"/
  );
  // Fuera de la pagina de preferencias, el enlace no es la pagina actual.
  assert.doesNotMatch(html, /class="atajos__preferencias"[^>]*aria-current/);
  const enPreferencias = dibujar(h(m.Encabezado, { idioma: "es", ruta: "/preferencias/", rutaAlternativa: "/en/preferences/" }));
  assert.match(enPreferencias, /<a class="atajos__preferencias" href="\/preferencias\/" aria-current="page"><svg[^>]*>.*?<\/svg>Preferencias de visualización<\/a>/);
  // El aviso va despues de la franja, todavia dentro de la cabecera.
  assert.ok(html.indexOf('id="lang-banner"') > html.indexOf('class="atajos__ajustes"'));
  assert.match(html, /<\/header>$/);
  for (const id of ["lang-banner-text", "lang-banner-switch", "lang-banner-dismiss", "lang-switch-link"]) {
    assert.match(html, new RegExp(`id="${id}"`), `lang.js busca #${id}`);
  }
  assert.match(html, /<button type="button" class="boton boton--secundario boton--chico" id="lang-banner-switch">/);
  assert.match(html, /<nav class="main-nav" aria-label="Main">/);
  assert.equal(html.match(/aria-current="page"/g).length, 1);
  assert.match(html, /<a href="\/en\/services\/" aria-current="page">/);
  assert.match(html, /<a class="lang-switch" id="lang-switch-link" href="\/servicios\/" lang="es"><svg[^>]*aria-hidden="true"[^>]*>.*<\/svg>Español<\/a>/);
});

test("Sitio: nada visible fuera de las regiones", () => {
  const pagina = { idioma: "es", ruta: "/", rutaAlternativa: "/en/" };
  const html = dibujar(h(m.Sitio, { pagina }, h("h1", null, "Inicio")));
  // Lo primero es la cabecera, y lo primero de la cabecera es el atajo al
  // contenido: sigue siendo la primera parada del tabulador.
  assert.match(html, /^<header class="site-header"><div class="atajos"><div class="wrap atajos__fila"><a href="#contenido-principal">Ir al contenido principal<\/a> <a href="#pie">Ir al pie de página<\/a>/);
  assert.doesNotMatch(html, /skip-link/);
  assert.ok(html.indexOf('id="lang-banner"') > html.indexOf("<header"));
  assert.match(html, /<main id="contenido-principal"><div class="wrap"><h1>Inicio<\/h1><\/div><\/main><footer class="site-footer" id="pie">/);
  // Los destinos de los dos atajos existen.
  for (const id of ["contenido-principal", "pie"]) {
    assert.equal(html.match(new RegExp(`id="${id}"`, "g")).length, 1, `un solo #${id}`);
  }
});

test("PieDePagina: Volver arriba es un enlace al body y lo ultimo del pie", () => {
  for (const [idioma, texto] of [["es", "Volver arriba"], ["en", "Back to top"]]) {
    const html = dibujar(h(m.PieDePagina, { idioma }));
    assert.match(html, /^<footer class="site-footer" id="pie">/);
    assert.match(
      html,
      new RegExp(`<a class="volver-arriba" href="#arriba"><svg[^>]*class="lucide lucide-arrow-up icono"[^>]*aria-hidden="true"[^>]*>.*</svg>${texto}</a></div></footer>$`)
    );
  }
  assert.match(dibujar(h(m.PieDePagina, { idioma: "es" })), /<p class="footer-links">.*<a href="\/preferencias\/">Preferencias de visualización<\/a><\/p>/);
  assert.match(dibujar(h(m.PieDePagina, { idioma: "en" })), /<p class="footer-links">.*<a href="\/en\/preferences\/">Display preferences<\/a><\/p>/);
});

/* Los nombres y valores que admite public/js/visualizacion.js. Si alguien
   agrega una opcion en el componente y no en el script (o al reves), la
   opcion no haria nada: esta prueba lo dice. */
test("PreferenciasVisualizacion: controles nativos ocultos hasta que el script los muestra", async () => {
  const fs = await import("node:fs");
  const script = fs.readFileSync(path.join(raiz, "public", "js", "visualizacion.js"), "utf8");
  const bloque = script.match(/var VALORES = (\{[^}]*\});/);
  assert.ok(bloque, "visualizacion.js define VALORES");
  const VALORES = Function(`return ${bloque[1]}`)();
  const SIN_ATRIBUTO = { tema: "sistema", contraste: "sistema", texto: "normal", grises: "no" };

  for (const idioma of ["es", "en"]) {
    const html = dibujar(h(m.PreferenciasVisualizacion, { idioma }));
    // Oculto con hidden y sin rol inventado: sin JavaScript no se ve.
    assert.match(html, /^<div id="preferencias-visualizacion" class="preferencias" hidden="">/);
    assert.doesNotMatch(html, /role=|aria-hidden="false"|tabindex/);
    // Un grupo con leyenda por atributo, en el orden del script.
    const grupos = [...html.matchAll(/<fieldset class="preferencias__grupo"><legend class="preferencias__leyenda">[^<]+<\/legend>(.*?)<\/fieldset>/g)];
    assert.equal(grupos.length, 4, "cuatro grupos");
    const nombres = [];
    for (const [, contenido] of grupos) {
      const radios = [...contenido.matchAll(/<label class="preferencias__opcion" for="([^"]+)"><input type="radio" id="([^"]+)" name="([^"]+)" value="([^"]+)"\/>[^<]+<\/label>/g)];
      assert.ok(radios.length >= 2, "cada grupo tiene al menos dos opciones");
      const nombre = radios[0][3];
      nombres.push(nombre);
      const valores = radios.map((r) => {
        assert.equal(r[1], r[2], "la etiqueta apunta a su boton");
        assert.equal(r[3], nombre, "un solo name por grupo");
        return r[4];
      });
      // La primera opcion es "sin atributo"; las demas, las del script.
      assert.deepEqual(valores, [SIN_ATRIBUTO[nombre], ...VALORES[nombre]]);
    }
    assert.deepEqual(nombres, Object.keys(VALORES));
    // Los mensajes estan en el HTML, en el idioma de la pagina.
    assert.match(html, /<button type="button" class="boton boton--secundario" id="preferencias-restablecer">[^<]+<\/button>/);
    assert.match(html, /<output id="preferencias-estado" class="preferencias__estado" data-guardado="[^"]+" data-sin-guardar="[^"]+" data-restablecido="[^"]+"><\/output><\/div><\/div>$/);
  }
  assert.throws(() => dibujar(h(m.PreferenciasVisualizacion, { idioma: "pt" })), /idioma/);
});

test("Documento: el body es el destino de Volver arriba", async () => {
  const { documentoHtml } = await vite.ssrLoadModule("/src/documento.js");
  const pagina = { idioma: "es", titulo: "Inicio", descripcion: "x", ruta: "/", rutaAlternativa: "/en/" };
  const html = documentoHtml({ pagina, cuerpoHtml: "<main></main>", desarrollo: false, hojaDeEstilos: "/estilos.css" });
  assert.equal(html.match(/<body[^>]*>/g).join(), '<body id="arriba">');
  assert.equal(html.match(/id="arriba"/g).length, 1);
});

test("Documento: las preferencias de visualizacion se aplican antes de la primera pintada", async () => {
  const { documentoHtml } = await vite.ssrLoadModule("/src/documento.js");
  const pagina = { idioma: "es", titulo: "Inicio", descripcion: "x", ruta: "/", rutaAlternativa: "/en/" };
  const html = documentoHtml({ pagina, cuerpoHtml: "<main></main>", desarrollo: false, hojaDeEstilos: "/estilos.css" });
  const cabeza = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
  // En el head, sin defer ni async, y antes de la hoja de estilos.
  assert.match(cabeza, /<script src="\/js\/visualizacion\.js"><\/script>/);
  assert.ok(cabeza.indexOf("/js/visualizacion.js") < cabeza.indexOf('rel="stylesheet"'));
  assert.equal(html.match(/visualizacion\.js/g).length, 1);
});

test("Indice: nav con el nombre del titulo visible y un enlace por entrada", () => {
  const html = dibujar(h(m.Indice, { idioma: "es", entradas: [["uno", "Primero"], ["dos", "Segundo"]] }));
  assert.equal(
    html,
    '<nav class="indice" aria-labelledby="indice-titulo"><p class="indice__titulo" id="indice-titulo">En esta página</p><ul><li><a href="#uno">Primero</a></li><li><a href="#dos">Segundo</a></li></ul></nav>'
  );
  assert.match(dibujar(h(m.Indice, { idioma: "en", entradas: [["a", "A"]] })), />On this page</);
  assert.throws(() => dibujar(h(m.Indice, { idioma: "es", entradas: [] })), /faltan entradas/);
});

/* Cada pagina con indice: cada enlace tiene destino, y el texto del enlace
   es el del titulo al que lleva. Si alguien cambia un titulo y no el
   indice (o al reves), esta prueba lo dice. */
const PAGINAS_CON_INDICE = [
  "privacidad", "en/privacy",
  "declaracion-accesibilidad", "en/accessibility-statement",
  "certificado-accesibilidad-web", "en/web-accessibility-certificate",
  "servicios", "en/services",
  "normativa-legal", "en/legal-requirements",
  "nuestros-auditores", "en/our-auditors",
];

test("Paginas de preferencias: un h1, los controles y el aviso sin JavaScript", async () => {
  for (const [nombre, idioma, privacidad] of [["preferencias", "es", "/privacidad/#en-tu-navegador"], ["en/preferences", "en", "/en/privacy/#in-your-browser"]]) {
    const modulo = await vite.ssrLoadModule(`/src/paginas/${nombre}.jsx`);
    assert.equal(modulo.pagina.idioma, idioma);
    const html = dibujar(h(modulo.default));
    assert.equal(html.match(/<h1>/g).length, 1);
    assert.equal(html.match(/id="preferencias-visualizacion"/g).length, 1);
    assert.match(html, /<noscript><p>[^<]+<\/p><\/noscript>/);
    assert.ok(html.indexOf("<noscript>") < html.indexOf('id="preferencias-visualizacion"'), "el aviso va antes de los controles");
    assert.match(html, new RegExp(`<a href="${privacidad}">`));
  }
});

const textoPlano = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();

for (const nombre of PAGINAS_CON_INDICE) {
  test(`Indice de ${nombre}: cada enlace lleva a su titulo`, async () => {
    const modulo = await vite.ssrLoadModule(`/src/paginas/${nombre}.jsx`);
    const html = dibujar(h(modulo.default));
    const indice = html.match(/<nav class="indice"[^>]*>.*?<\/nav>/s);
    assert.ok(indice, "la pagina tiene indice");
    assert.equal(html.match(/<nav class="indice"/g).length, 1, "un solo indice");
    const enlaces = [...indice[0].matchAll(/<a href="#([^"]+)">(.*?)<\/a>/g)];
    assert.ok(enlaces.length >= 4, "al menos cuatro entradas");
    for (const [, id, texto] of enlaces) {
      assert.equal(html.match(new RegExp(`id="${id}"`, "g"))?.length, 1, `#${id} existe una sola vez`);
      // El destino es un h2 con ese id, o una seccion con ese id que tiene
      // el h2 adentro.
      const h2 =
        html.match(new RegExp(`<h2[^>]* id="${id}"[^>]*>(.*?)</h2>`)) ||
        html.match(new RegExp(`<section[^>]* id="${id}"[^>]*>.*?<h2[^>]*>(.*?)</h2>`, "s"));
      assert.ok(h2, `#${id} es un h2 o una seccion con h2`);
      assert.equal(textoPlano(texto), textoPlano(h2[1]), `el enlace a #${id} dice lo mismo que su titulo`);
    }
  });
}

test("FormularioWeb3Forms: vuelve a la pagina de confirmacion pedida, del mismo idioma", async () => {
  const { FormularioWeb3Forms } = await vite.ssrLoadModule("/src/componentes/formularios/FormularioWeb3Forms.jsx");
  const { sitio } = await vite.ssrLoadModule("/src/sitio.js");
  const html = dibujar(h(FormularioWeb3Forms, { idioma: "es", asunto: "Prueba", confirmacion: "/gracias-por-tu-resena/" }));
  assert.match(html, new RegExp(`<input type="hidden" name="redirect" value="${sitio.url}/gracias-por-tu-resena/"/>`));
  assert.throws(() => renderToStaticMarkup(h(FormularioWeb3Forms, { idioma: "es", asunto: "Prueba" })), /confirmacion/);
  assert.throws(() => renderToStaticMarkup(h(FormularioWeb3Forms, { idioma: "en", asunto: "Prueba", confirmacion: "/gracias/" })), /idioma/);
});

test("Politica de seguridad: los formularios pueden volver al propio sitio", async () => {
  const { politicaDeSeguridad } = await vite.ssrLoadModule("/src/seguridad.js");
  for (const desarrollo of [false, true]) {
    // Sin 'self', Chrome y Edge bloquean la vuelta de Web3Forms a /gracias/.
    assert.match(politicaDeSeguridad({ desarrollo, origenApi: undefined }), /form-action 'self' https:\/\/api\.web3forms\.com(;|$)/);
  }
});
