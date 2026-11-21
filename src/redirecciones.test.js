import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { redirecciones } from "./redirecciones.js";

/* La compilacion ya corta si una redireccion apunta a una pagina que no
   existe (ver src/renderizar.jsx). Estas pruebas lo revisan sin compilar,
   mirando directamente los archivos de src/paginas/. */

const carpetaPaginas = path.join(import.meta.dirname, "paginas");

// La misma regla que rutaDesdeArchivo en src/renderizar.jsx, al reves.
function archivoDeRuta(ruta) {
  const relativo = ruta.slice(1, -1);
  if (relativo === "") return path.join(carpetaPaginas, "index.jsx");
  if (relativo === "en") return path.join(carpetaPaginas, "en", "index.jsx");
  return path.join(carpetaPaginas, `${relativo}.jsx`);
}

const esIngles = (ruta) => ruta === "/en/" || ruta.startsWith("/en/");

for (const [desde, hacia] of Object.entries(redirecciones)) {
  test(`${desde} lleva a ${hacia}`, () => {
    assert.match(desde, /^\/.*\/$/, "la direccion vieja tiene que empezar y terminar con /");
    assert.match(hacia, /^\/.*\/$/, "la direccion nueva tiene que empezar y terminar con /");
    assert.ok(fs.existsSync(archivoDeRuta(hacia)), `falta la pagina ${path.relative(carpetaPaginas, archivoDeRuta(hacia))}`);
    assert.ok(
      !fs.existsSync(archivoDeRuta(desde)),
      `sigue existiendo ${path.relative(carpetaPaginas, archivoDeRuta(desde))}: la redireccion la taparia`
    );
    assert.equal(esIngles(desde), esIngles(hacia), "la redireccion no puede cambiar de idioma");
    assert.ok(!Object.hasOwn(redirecciones, hacia), "una redireccion no puede llevar a otra redireccion");
  });
}
