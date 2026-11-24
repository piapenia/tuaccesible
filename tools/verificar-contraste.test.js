/* El verificador de contraste lee las paletas de global.css simulando las
   24 combinaciones de sistema y /preferencias/. Estas pruebas confirman que
   lee bien el archivo real y que se da cuenta cuando una de las copias de
   una paleta deja de ser identica a las otras. */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { leerPaletas } from "./verificar-contraste.js";

const CSS = fs.readFileSync(path.join(import.meta.dirname, "..", "src", "estilos", "global.css"), "utf8");

// Reemplaza la primera aparicion de "buscar" despues de "ancla".
function cambiarDespuesDe(css, ancla, buscar, poner) {
  const i = css.indexOf(ancla);
  assert.notEqual(i, -1, "no encontre " + ancla);
  const j = css.indexOf(buscar, i);
  assert.notEqual(j, -1, "no encontre " + buscar + " despues de " + ancla);
  return css.slice(0, j) + poner + css.slice(j + buscar.length);
}

describe("verificador de contraste", () => {
  test("global.css: las 24 combinaciones caen en las cuatro paletas", () => {
    const { paletas, incoherencias } = leerPaletas(CSS);
    assert.deepEqual(incoherencias, []);
    assert.deepEqual(Object.keys(paletas).sort(), [
      "claro", "claro, alto contraste", "oscuro", "oscuro, alto contraste"
    ]);
    assert.equal(paletas["claro"].bg, "#FFFFFF");
    assert.equal(paletas["oscuro"].bg, "#0B0F11");
    assert.equal(paletas["claro, alto contraste"].brand, "#05333D");
    assert.equal(paletas["oscuro, alto contraste"].brand, "#BEE9F3");
    // La banda de cierre conserva el petroleo mas oscuro en las dos
    // versiones de mas contraste.
    assert.equal(paletas["oscuro, alto contraste"].banda, "#05252C");
  });

  test("detecta una copia del tema oscuro que no es identica", () => {
    const css = cambiarDespuesDe(CSS, ':root:where([data-tema="oscuro"]) {', "--bg: #0B0F11;", "--bg: #0B0F12;");
    const { incoherencias } = leerPaletas(css);
    assert.ok(incoherencias.length > 0);
    assert.ok(incoherencias.every((t) => t.includes("--bg")), incoherencias.join("\n"));
    assert.ok(incoherencias.some((t) => t.includes("elegido: tema oscuro")));
  });

  test("detecta una copia de oscuro con mas contraste que no es identica", () => {
    const css = cambiarDespuesDe(CSS, ':root:where([data-tema="oscuro"][data-contraste="mas"]) {', "--accent: #FFC894;", "--accent: #FFC895;");
    const { incoherencias } = leerPaletas(css);
    assert.ok(incoherencias.some((t) => t.includes("--accent") && t.includes("oscuro, alto contraste")));
  });

  test("detecta un tema claro forzado que deja los controles en oscuro", () => {
    const css = CSS.replace(':root[data-tema="claro"] { color-scheme: light; }', "");
    const { incoherencias } = leerPaletas(css);
    assert.ok(incoherencias.some((t) => t.includes("color-scheme")), incoherencias.join("\n"));
  });

  test("falla con un selector que no sabe evaluar", () => {
    const css = CSS + '\n:root:is([data-tema="oscuro"]) { --bg: #000000; }\n';
    assert.throws(() => leerPaletas(css), /no sabe evaluar/);
  });

  test("falla con una consulta @media que no sabe evaluar", () => {
    const css = CSS + "\n@media (min-width: 40rem) { :root { --bg: #000000; } }\n";
    assert.throws(() => leerPaletas(css), /no sabe evaluar/);
  });
});
