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
  for (const nombre of ["Icono", "Boton", "Tarjetas", "Campo", "Aviso", "Desplegable", "Seccion", "Banda", "Encabezado", "Sitio"]) {
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
  const enlace = dibujar(h(m.Boton, { href: "/contacto/" }, "Escribir"));
  assert.equal(enlace, '<a href="/contacto/" class="boton boton--primario">Escribir</a>');

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
  const html = dibujar(h(m.Banda, null, h("p", null, h("a", { href: "/contacto/" }, "Escribir"), " o leer.")));
  assert.equal(html, '<div class="banda"><p><a href="/contacto/">Escribir</a> o leer.</p></div>');
});

test("Encabezado: el aviso de idioma queda dentro de la cabecera", () => {
  const html = dibujar(h(m.Encabezado, { idioma: "en", ruta: "/en/services/", rutaAlternativa: "/servicios/" }));
  assert.match(html, /^<header class="site-header"><div class="lang-banner" id="lang-banner">/);
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
  // Lo unico antes de la cabecera es el enlace de salto, que es la primera
  // parada del tabulador y lleva al contenido.
  assert.match(html, /^<a class="skip-link" href="#contenido-principal">Saltar al contenido principal<\/a><header /);
  assert.ok(html.indexOf('id="lang-banner"') > html.indexOf("<header"));
  assert.match(html, /<main id="contenido-principal"><div class="wrap"><h1>Inicio<\/h1><\/div><\/main><footer class="site-footer">/);
});
