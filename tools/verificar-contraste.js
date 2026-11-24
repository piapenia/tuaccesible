#!/usr/bin/env node
/*
 * Verificador de contraste de tuaccesible.com
 *
 * Lee los colores directamente de src/estilos/global.css, no de una copia: si
 * alguien cambia un hex en la hoja de estilos, este chequeo se entera. Corre
 * en cada push, antes de construir el sitio, y corta el despliegue si algun
 * par baja del minimo.
 *
 * Minimos aplicados (WCAG 2.2):
 *   - Texto normal: 7:1, que es el nivel AAA del criterio 1.4.6.
 *   - Elementos no textuales (bordes de campo, indicador de foco, marcas
 *     decorativas): 3:1, criterio 1.4.11.
 *
 * Comprueba las cuatro paletas que el sitio puede mostrar: claro, oscuro, y
 * las dos versiones de mas contraste.
 *
 * Cada paleta se puede pedir desde el sistema operativo o desde la pagina
 * /preferencias/ (atributos data-tema y data-contraste en <html>), asi que
 * global.css la repite en varios bloques. Para no depender de que alguien
 * copie bien, el verificador no busca los bloques por su texto: simula las
 * 24 combinaciones posibles (sistema claro u oscuro, con o sin mas
 * contraste, y lo que se haya elegido en la pagina), aplica las reglas
 * :root en el orden de la cascada y exige dos cosas:
 *   - que cada combinacion de exactamente la misma paleta que el sistema
 *     daria por si solo para ese tema y ese contraste;
 *   - que color-scheme coincida con el tema, para que los controles nativos
 *     y las barras de desplazamiento no salgan claros en una pagina oscura.
 *
 * Nota de mantenimiento: el lector entiende @media con screen,
 * prefers-color-scheme y prefers-contrast unidos con "and", y selectores
 * hechos de :root, [atributo="valor"], :where() y :not(). Si una regla :root
 * con colores usa otra cosa, el verificador falla y dice cual: hay que
 * ensenarle la sintaxis nueva antes de publicar.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CSS = path.join(import.meta.dirname, "..", "src", "estilos", "global.css");

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

// Devuelve la posicion del cierre que corresponde a la apertura que esta
// justo antes de "desde".
function cierre(texto, desde, abre, cierra) {
  let nivel = 1;
  let j = desde;
  while (j < texto.length && nivel > 0) {
    if (texto[j] === abre) nivel++;
    else if (texto[j] === cierra) nivel--;
    j++;
  }
  if (nivel > 0) throw new Error("Falta un \"" + cierra + "\" en global.css.");
  return j - 1;
}

// Junta las reglas cuyo selector empieza con :root y que definen colores o
// color-scheme, cada una con los @media que la envuelven.
export function leerReglasRaiz(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const reglas = [];

  function recorrer(texto, medios) {
    let i = 0;
    while (true) {
      const abre = texto.indexOf("{", i);
      if (abre === -1) return;
      const fin = cierre(texto, abre + 1, "{", "}");
      const preludio = texto.slice(i, abre).split(";").pop().trim();
      const cuerpo = texto.slice(abre + 1, fin);
      i = fin + 1;

      if (/^@media\b/.test(preludio)) {
        recorrer(cuerpo, medios.concat(preludio.slice(6).trim()));
        continue;
      }
      if (preludio.startsWith("@")) {
        if (/:root/.test(cuerpo) && /--[\w-]+\s*:\s*#|color-scheme/.test(cuerpo)) {
          throw new Error("Hay colores de :root dentro de \"" + preludio + "\", que el verificador no sabe leer.");
        }
        continue;
      }

      const vars = {};
      cuerpo.replace(/--([\w-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g, function (_, k, v) {
        vars[k] = v.toUpperCase();
        return "";
      });
      const esquema = /(?:^|;)\s*color-scheme\s*:\s*([^;]+)/.exec(cuerpo);
      if (!Object.keys(vars).length && !esquema) continue;

      preludio.split(",").forEach(function (selector) {
        selector = selector.trim();
        if (!selector.startsWith(":root")) return;
        reglas.push({
          selector: selector,
          medios: medios,
          vars: vars,
          esquema: esquema ? esquema[1].trim() : null
        });
      });
    }
  }

  recorrer(css, []);
  return reglas;
}

// Un escenario: lo que pide el sistema y lo que se eligio en la pagina.
//   { esquema: "light" | "dark", contraste: "no-preference" | "more",
//     atributos: { "data-tema": ..., "data-contraste": ... } }
function cumpleMedio(consulta, s) {
  if (consulta.includes(",")) {
    throw new Error("@media " + consulta + ": el verificador no sabe evaluar listas con coma.");
  }
  return consulta.split(/\s+and\s+/).every(function (parte) {
    parte = parte.trim();
    if (parte === "screen" || parte === "all") return true;
    if (parte === "print") return false;
    let m = /^\(\s*prefers-color-scheme\s*:\s*(light|dark)\s*\)$/.exec(parte);
    if (m) return s.esquema === m[1];
    m = /^\(\s*prefers-contrast\s*:\s*([\w-]+)\s*\)$/.exec(parte);
    if (m) return s.contraste === m[1];
    throw new Error("@media " + consulta + ": el verificador no sabe evaluar \"" + parte + "\".");
  });
}

// Evalua una secuencia de [atributo="valor"], :where(...) y :not(...).
// Recorre todo el texto aunque ya sepa que no cumple, para que una sintaxis
// desconocida falle siempre y no solo en algunos escenarios.
function cumpleCompuesto(texto, s) {
  let cumple = true;
  let i = 0;
  while (i < texto.length) {
    const resto = texto.slice(i);
    let m = /^\[\s*([\w-]+)\s*=\s*"([^"]*)"\s*\]/.exec(resto);
    if (m) {
      if (s.atributos[m[1]] !== m[2]) cumple = false;
      i += m[0].length;
      continue;
    }
    m = /^:(where|not)\(/.exec(resto);
    if (m) {
      const fin = cierre(resto, m[0].length, "(", ")");
      const dentro = cumpleCompuesto(resto.slice(m[0].length, fin), s);
      if (m[1] === "where" ? !dentro : dentro) cumple = false;
      i += fin + 1;
      continue;
    }
    throw new Error("Selector que el verificador no sabe evaluar: \"" + texto + "\".");
  }
  return cumple;
}

function cumpleSelector(selector, s) {
  return cumpleCompuesto(selector.slice(":root".length), s);
}

// Especificidad de los selectores que entiende cumpleCompuesto: :root y
// cada [atributo] suman 1; lo que esta dentro de :where() no suma.
function especificidad(selector) {
  let sinWhere = selector;
  let k;
  while ((k = sinWhere.indexOf(":where(")) !== -1) {
    const fin = cierre(sinWhere, k + 7, "(", ")");
    sinWhere = sinWhere.slice(0, k) + sinWhere.slice(fin + 1);
  }
  return 1 + (sinWhere.match(/\[/g) || []).length;
}

// Aplica las reglas como la cascada: primero por especificidad y, a igual
// especificidad, en el orden del archivo. Todas estan en la misma capa y
// ninguna usa !important.
function calcular(reglas, s) {
  const vars = {};
  let esquema = "normal";
  reglas
    .map(function (r, i) { return { r: r, i: i, e: especificidad(r.selector) }; })
    .sort(function (a, b) { return a.e - b.e || a.i - b.i; })
    .forEach(function (x) {
      if (!x.r.medios.every(function (m) { return cumpleMedio(m, s); })) return;
      if (!cumpleSelector(x.r.selector, s)) return;
      Object.assign(vars, x.r.vars);
      if (x.r.esquema) esquema = x.r.esquema;
    });
  return { vars: vars, esquema: esquema };
}

// El tema con el que el navegador dibuja los controles nativos.
function esquemaUsado(valor, esquemaDelSistema) {
  const v = valor.split(/\s+/);
  if (v.includes("light") && v.includes("dark")) return esquemaDelSistema;
  if (v.includes("dark")) return "dark";
  return "light";
}

function nombrePaleta(tema, mas) {
  return tema + (mas ? ", alto contraste" : "");
}

// Las cuatro paletas, tal como las da el sistema sin nada elegido, y la
// lista de combinaciones que no caen exactamente en una de ellas.
export function leerPaletas(css) {
  const reglas = leerReglasRaiz(css);
  const paletas = {};
  const incoherencias = [];
  const escenarios = [];

  ["no-preference", "more"].forEach(function (contraste) {
    ["light", "dark"].forEach(function (esquema) {
      [undefined, "claro", "oscuro"].forEach(function (tema) {
        [undefined, "mas"].forEach(function (masElegido) {
          escenarios.push({
            esquema: esquema,
            contraste: contraste,
            atributos: { "data-tema": tema, "data-contraste": masElegido }
          });
        });
      });
    });
  });

  // Primero los escenarios sin nada elegido: son la referencia.
  escenarios.sort(function (a, b) {
    const sa = a.atributos["data-tema"] || a.atributos["data-contraste"] ? 1 : 0;
    const sb = b.atributos["data-tema"] || b.atributos["data-contraste"] ? 1 : 0;
    return sa - sb;
  });

  escenarios.forEach(function (s) {
    const tema = s.atributos["data-tema"] || (s.esquema === "dark" ? "oscuro" : "claro");
    const mas = s.atributos["data-contraste"] === "mas" || s.contraste === "more";
    const nombre = nombrePaleta(tema, mas);
    const descripcion =
      "sistema " + (s.esquema === "dark" ? "oscuro" : "claro") +
      (s.contraste === "more" ? " con mas contraste" : "") +
      ", elegido: tema " + (s.atributos["data-tema"] || "del sistema") +
      ", contraste " + (s.atributos["data-contraste"] || "del sistema");
    const r = calcular(reglas, s);

    const usado = esquemaUsado(r.esquema, s.esquema);
    if (usado !== (tema === "oscuro" ? "dark" : "light")) {
      incoherencias.push(descripcion + ": color-scheme \"" + r.esquema + "\" dibuja los controles en " + usado + " y la paleta es " + nombre + ".");
    }

    if (!paletas[nombre]) {
      paletas[nombre] = r.vars;
      return;
    }
    const ref = paletas[nombre];
    const claves = new Set(Object.keys(ref).concat(Object.keys(r.vars)));
    const distintas = [...claves].filter(function (k) { return ref[k] !== r.vars[k]; });
    if (distintas.length) {
      incoherencias.push(
        descripcion + ": deberia dar la paleta " + nombre + " y difiere en " +
        distintas.map(function (k) { return "--" + k + " (" + r.vars[k] + " en vez de " + ref[k] + ")"; }).join(", ") + "."
      );
    }
  });

  return { paletas: paletas, incoherencias: incoherencias };
}

// "Volver arriba" flota por encima de todo, tambien de la banda de cierre.
// Ahi lo despega su relleno o, si el relleno es del mismo color que la
// banda (modo claro), su borde, que es del color del texto del boton. Se
// mide el mejor de los dos.
function despegueSobreBanda(p) {
  const relleno = contraste(p["brand-strong"], p.banda);
  const borde = contraste(p["sobre-marca"], p.banda);
  return relleno >= borde ? p["brand-strong"] : p["sobre-marca"];
}

function pares(p) {
  const textoBoton = p["sobre-marca"];
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
    ["Texto del boton primario al pasar el mouse", textoBoton, p.brand, 7],
    ["Texto de Volver arriba y de la seleccion sobre su fondo", textoBoton, p["brand-strong"], 7],
    ["Volver arriba: relleno sobre el fondo", p["brand-strong"], p.bg, 3],
    ["Volver arriba: relleno sobre el pie", p["brand-strong"], p.surface, 3],
    ["Volver arriba sobre la banda de cierre (relleno o borde)", despegueSobreBanda(p), p.banda, 3],
    ["Enlaces de la franja de atajos sobre su fondo", p.brand, p.surface, 7],
    ["Borde de las casillas del menu en pantalla chica", p["text-muted"], p.bg, 3],
    ["Texto y enlaces de la banda de cierre sobre su fondo", p["sobre-banda"], p.banda, 7],
    ["Indicador de foco dentro de la banda de cierre", p["sobre-banda"], p.banda, 3],
    ["Indicador de foco: contorno sobre el anillo interior", p.focus, p.bg, 3],
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
  let leido;
  try {
    leido = leerPaletas(css);
  } catch (e) {
    console.error("No se pudieron leer las paletas de global.css: " + e.message);
    process.exit(1);
  }
  const paletas = leido.paletas;
  let fallos = 0;

  console.log("\n== Sistema y /preferencias/: 24 combinaciones ==");
  if (leido.incoherencias.length) {
    leido.incoherencias.forEach(function (texto) {
      fallos++;
      console.log("  FALLA  " + texto);
    });
  } else {
    console.log("  ok     Cada combinacion da una de las cuatro paletas, con el color-scheme que le corresponde.");
  }

  ["claro", "oscuro", "claro, alto contraste", "oscuro, alto contraste"].forEach(function (modo) {
    console.log("\n== Modo " + modo + " ==");
    pares(paletas[modo]).forEach(function (fila) {
      const desc = fila[0], fg = fila[1], bg = fila[2], min = fila[3];
      if (!fg || !bg) {
        fallos++;
        console.log("  FALLA  falta una variable de color para: " + desc);
        return;
      }
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
