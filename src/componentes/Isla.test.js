/* Islas: que dos en la misma pagina no repitan los id de useId.

   Isla.jsx es JSX y Node no lo lee solo, asi que se carga con Vite, igual
   que lo hace npm run dev. React no pasa por Vite (queda afuera, como en
   cualquier modulo de node_modules), asi que este archivo y Isla.jsx usan
   el mismo React. */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createElement, Fragment, useId } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const raiz = path.resolve(import.meta.dirname, "..", "..");
let vite;
let Isla;
let islas;

// Una isla de prueba con lo tipico de un formulario: una etiqueta unida a
// su campo por un id de useId.
function CampoDePrueba({ texto }) {
  const id = useId();
  return createElement(
    Fragment,
    null,
    createElement("label", { htmlFor: id }, texto),
    createElement("input", { id, type: "text" })
  );
}

before(async () => {
  vite = await createServer({
    root: raiz,
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  ({ Isla } = await vite.ssrLoadModule("/src/componentes/Isla.jsx"));
  ({ islas } = await vite.ssrLoadModule("/src/islas/registro.js"));
  islas.CampoDePrueba = CampoDePrueba;
});

after(async () => {
  if (islas) delete islas.CampoDePrueba;
  await vite?.close();
});

function dibujar(...textos) {
  return renderToStaticMarkup(
    createElement(
      "main",
      null,
      ...textos.map((texto) => createElement(Isla, { key: texto, nombre: "CampoDePrueba", props: { texto } }))
    )
  );
}

test("dos islas iguales en una pagina no repiten ningun id", () => {
  const html = dibujar("Nombre", "Correo");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1], `las dos islas usan el id "${ids[0]}"`);
});

test("cada etiqueta queda unida al campo de su propia isla", () => {
  const html = dibujar("Nombre", "Correo");
  const pares = [...html.matchAll(/<label for="([^"]+)">([^<]+)<\/label><input id="([^"]+)"/g)];
  assert.equal(pares.length, 2);
  for (const [, para, texto, id] of pares) assert.equal(para, id, `la etiqueta "${texto}" apunta a otro campo`);
});

test("el prefijo viaja en el HTML para que el navegador hidrate con el mismo", () => {
  const html = dibujar("Nombre", "Correo");
  const prefijos = [...html.matchAll(/data-isla-prefijo="([^"]+)"/g)].map((m) => m[1]);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(prefijos.length, 2);
  assert.notEqual(prefijos[0], prefijos[1]);
  prefijos.forEach((prefijo, i) => assert.ok(ids[i].includes(prefijo), `el id "${ids[i]}" no lleva el prefijo "${prefijo}"`));
});
