#!/usr/bin/env node
/*
 * Verificador de contraste de tuaccesible.com
 *
 * Lee los colores directamente de src/css/global.css, no de una copia: si
 * alguien cambia un hex en la hoja de estilos, este chequeo se entera. Corre
 * en cada push, antes de construir el sitio, y corta el despliegue si algun
 * par baja del minimo.
 *
 * Minimos aplicados (WCAG 2.2):
 *   - Texto normal: 7:1, que es el nivel AAA del criterio 1.4.6.
 *   - Elementos no textuales (bordes de campo, indicador de foco, marcas
 *     decorativas): 3:1, criterio 1.4.11.
 *
 * Comprueba las cuatro combinaciones que el sitio puede mostrar: claro,
 * oscuro, y las dos versiones de alto contraste del sistema operativo.
 *
 * Nota de mantenimiento: el analizador asume que cada bloque :root de
 * global.css no tiene llaves anidadas y que, si esta dentro de un @media, es
 * el @media inmediatamente anterior. Si se reordena esa parte del CSS, hay
 * que revisar esta funcion.
 */

const fs = require("fs");
const path = require("path");

const CSS = path.join(__dirname, "..", "src", "css", "global.css");

function hexARgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
  return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
}

function luminancia(hex) {
  const s = hexARgb(hex).map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

function contraste(a, b) {
  const l1 = luminancia(a);
  const l2 = luminancia(b);
  const alto = Math.max(l1, l2);
  const bajo = Math.min(l1, l2);
  return (alto + 0.05) / (bajo + 0.05);
}

function leerPaletas(css) {
  const bloques = [];
  const re = /:root\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const antes = css.slice(0, m.index);
    const i = antes.lastIndexOf("@media");
    const consulta = i === -1 ? "" : antes.slice(i, antes.indexOf("{", i));
    const vars = {};
    m[1].replace(/--([\w-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g, function (_, k, v) {
      vars[k] = v;
      return "";
    });
    bloques.push({ consulta: consulta, vars: vars });
  }

  function buscar(prueba) {
    const b = bloques.find(function (x) { return prueba(x.consulta); });
    return b ? b.vars : null;
  }

  const base = buscar(function (c) { return c === ""; });
  const oscuro = buscar(function (c) { return /prefers-color-scheme:\s*dark/.test(c) && !/prefers-contrast/.test(c); });
  const masContraste = buscar(function (c) { return /prefers-contrast:\s*more/.test(c) && !/color-scheme/.test(c); });
  const oscuroMasContraste = buscar(function (c) { return /prefers-contrast:\s*more/.test(c) && /color-scheme:\s*dark/.test(c); });

  if (!base || !oscuro || !masContraste || !oscuroMasContraste) {
    console.error("No se pudieron leer las cuatro paletas de global.css.");
    process.exit(1);
  }

  return {
    "claro": Object.assign({}, base),
    "oscuro": Object.assign({}, base, oscuro),
    "claro, alto contraste": Object.assign({}, base, masContraste),
    "oscuro, alto contraste": Object.assign({}, base, oscuro, masContraste, oscuroMasContraste)
  };
}

// Texto sobre fondo oscuro que el CSS fija a mano (boton, salto de contenido
// y seleccion en modo oscuro), para que el chequeo cubra tambien esos casos.
const TEXTO_SOBRE_CLARO_EN_OSCURO = "#0B0F11";

function pares(p, modo) {
  const esOscuro = modo.indexOf("oscuro") === 0;
  const textoBoton = esOscuro ? TEXTO_SOBRE_CLARO_EN_OSCURO : p.bg;
  return [
    ["Texto de cuerpo sobre el fondo", p.text, p.bg, 7],
    ["Texto de cuerpo sobre tarjeta", p.text, p.surface, 7],
    ["Texto atenuado (entradilla, pie) sobre el fondo", p["text-muted"], p.bg, 7],
    ["Texto atenuado sobre tarjeta", p["text-muted"], p.surface, 7],
    ["Titulos sobre el fondo", p.ink, p.bg, 7],
    ["Titulos sobre tarjeta", p.ink, p.surface, 7],
    ["Enlaces y resumenes desplegables sobre el fondo", p.brand, p.bg, 7],
    ["Enlaces sobre tarjeta", p.brand, p.surface, 7],
    ["Texto del boton sobre el boton", textoBoton, p["brand-strong"], 7],
    ["Texto del salto al contenido sobre su fondo", textoBoton, p["brand-strong"], 7],
    ["Acento calido sobre el fondo (solo decorativo)", p.accent, p.bg, 3],
    ["Acento calido sobre tarjeta (solo decorativo)", p.accent, p.surface, 3],
    ["Indicador de foco sobre el fondo", p.focus, p.bg, 3],
    ["Indicador de foco sobre tarjeta", p.focus, p.surface, 3],
    ["Borde de los campos de formulario", p["text-muted"], p.bg, 3],
    ["Franja de marca de la cabecera sobre el fondo", p.brand, p.bg, 3]
  ];
}

// El icono de pantalla de inicio no sale del CSS: es un mosaico fijo.
const ICONO = [
  ["Icono: letra blanca sobre el mosaico", "#FFFFFF", "#0B4A57", 3],
  ["Icono: subrayado ambar sobre el mosaico", "#F0A868", "#0B4A57", 3]
];

function main() {
  const css = fs.readFileSync(CSS, "utf8");
  const paletas = leerPaletas(css);
  let fallos = 0;

  Object.keys(paletas).forEach(function (modo) {
    console.log("\n== Modo " + modo + " ==");
    pares(paletas[modo], modo).forEach(function (fila) {
      const desc = fila[0], fg = fila[1], bg = fila[2], min = fila[3];
      const r = contraste(fg, bg);
      const ok = r >= min;
      if (!ok) fallos++;
      console.log(
        (ok ? "  ok   " : "  FALLA") + " " + r.toFixed(2).padStart(6) + ":1  (min " +
        min + ":1)  " + desc + "  [" + fg + " sobre " + bg + "]"
      );
    });
  });

  console.log("\n== Icono de pantalla de inicio ==");
  ICONO.forEach(function (fila) {
    const r = contraste(fila[1], fila[2]);
    const ok = r >= fila[3];
    if (!ok) fallos++;
    console.log((ok ? "  ok   " : "  FALLA") + " " + r.toFixed(2).padStart(6) + ":1  (min " + fila[3] + ":1)  " + fila[0]);
  });

  if (fallos > 0) {
    console.error("\n" + fallos + " par(es) por debajo del minimo. No se despliega asi.");
    process.exit(1);
  }
  console.log("\nTodos los pares cumplen. Texto en AAA (7:1), elementos no textuales en 3:1.");
}

main();
