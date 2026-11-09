/* Analizador: lo que se puede probar sin navegador.

   El recorrido completo (pasos, foco, anuncios) se prueba en el navegador
   contra npm run backend:simulado. Aca, lo que no depende de eso: que los
   dos idiomas tengan los mismos textos, que el HTML de la compilacion sea
   el parrafo de respaldo y que dibujarla no pida nada al backend.

   Los .jsx se cargan con Vite, igual que en src/componentes/Isla.test.js. */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { textos, mensajeDeError } from "./textos.js";
import { codigosDeError, ErrorApi } from "../../api/errores.js";

const raiz = path.resolve(import.meta.dirname, "..", "..", "..");
let vite;
let Analizador;

before(async () => {
  vite = await createServer({
    root: raiz,
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  ({ Analizador } = await vite.ssrLoadModule("/src/islas/analizador/Analizador.jsx"));
});

after(async () => {
  await vite?.close();
});

// Las claves de un objeto de textos, con su camino ("final.agenda") y si
// es texto o funcion.
function claves(objeto, camino = "") {
  return Object.entries(objeto).flatMap(([clave, valor]) => {
    const nombre = camino ? `${camino}.${clave}` : clave;
    if (typeof valor === "object" && valor !== null) return claves(valor, nombre);
    return [`${nombre}:${typeof valor}`];
  });
}

test("el espanol y el ingles tienen los mismos textos", () => {
  assert.deepEqual(claves(textos.en).sort(), claves(textos.es).sort());
});

test("hay un mensaje para cada codigo de error de la API", () => {
  for (const idioma of ["es", "en"]) {
    for (const codigo of codigosDeError) {
      assert.ok(textos[idioma].errores[codigo], `falta el error "${codigo}" en ${idioma}`);
      const mensaje = mensajeDeError(textos[idioma], new ErrorApi(codigo), 1000);
      assert.equal(typeof mensaje, "string");
      assert.ok(mensaje.length > 0);
    }
  }
});

test("el espanol no usa voseo", () => {
  const todo = JSON.stringify(textos.es, (_, valor) => (typeof valor === "function" ? valor("X", "Y") : valor));
  // \b no sirve con tildes: "esperábamos" daria un falso positivo.
  const voseo = todo.match(/(?<!\p{L})(podés|tenés|escribí|elegí|querés|sabés|volvé|revisá|esperá|mirá|contá)(?!\p{L})/iu);
  assert.equal(voseo, null, `voseo: "${voseo?.[0]}"`);
});

for (const idioma of ["es", "en"]) {
  test(`al compilar, la isla en ${idioma} es el parrafo de respaldo con su enlace a contacto`, () => {
    const html = renderToStaticMarkup(createElement(Analizador, { idioma }));
    const t = textos[idioma];
    assert.match(html, /^<div class="analizador"><p class="analizador__respaldo">/);
    assert.ok(html.includes(`<a href="${t.contacto}">${t.respaldoEnlace}</a>`));
    assert.ok(!html.includes("<form"), "el formulario no tiene que estar en el HTML: sin JavaScript no funcionaria");
  });
}

test("dibujar la isla no pide nada al backend", () => {
  const original = globalThis.fetch;
  let pedidos = 0;
  globalThis.fetch = async () => {
    pedidos += 1;
    throw new Error("no deberia pedir nada");
  };
  try {
    renderToStaticMarkup(createElement(Analizador, { idioma: "es" }));
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(pedidos, 0);
});
