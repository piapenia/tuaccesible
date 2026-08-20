#!/usr/bin/env node
/*
 * Generador de las tarjetas sociales de tuaccesible.com
 *
 * Produce src/img/og-tuaccesible.png y src/img/og-tuaccesible-en.png, que son
 * la imagen que se ve cuando alguien comparte el sitio en LinkedIn, WhatsApp o
 * Slack. Hay una por idioma porque la version inglesa mostraba el lema en
 * espanol, y esa es la primera impresion de todo el trafico anglohablante.
 *
 * NO corre en CI y no debe correr: reescribe dos binarios que ya estan
 * comiteados. Se ejecuta a mano, con "npm run generar:og", solo cuando cambia
 * el lema, el logotipo o la paleta. Despues hay que mirar las dos imagenes.
 *
 * Como funciona: monta un HTML de 1200 x 630 y lo captura con el Chrome que
 * ya trae puppeteer. No hace falta ningun programa de diseno.
 *
 * De donde salen los numeros de GEOMETRIA: se midio la tarjeta espanola
 * original pixel a pixel, y despues se calibro renderizando el texto espanol
 * con estos parametros y comparando contra la original hasta que el logotipo,
 * las dos lineas del lema y la direccion coincidieran. La diferencia quedo en
 * cero pixeles en las tres cajas de texto. Si alguien toca estos valores a
 * ojo, las dos tarjetas dejan de parecer el mismo sitio.
 *
 * El logotipo no se redibuja: se lee de src/img/logo-tuaccesible.svg, que ya
 * esta trazado a curvas, asi que el simbolo y el nombre son los mismos
 * vectores que en el resto de la marca y no dependen de ninguna fuente.
 *
 * El lema si depende de una fuente: Century Gothic, la primera de
 * --font-display en global.css. Si la maquina donde se corre esto no la tiene,
 * el texto sale con otra letra y la tarjeta no coincide con la publicada. Por
 * eso el script lo comprueba y aborta en vez de generar algo distinto en
 * silencio.
 *
 * Dependencia: puppeteer. No esta declarado en package.json porque ya viene
 * instalado como dependencia de pa11y-ci, que si lo esta. Si algun dia pa11y-ci
 * deja de traerlo, este script lo dice claramente y hay que anadirlo a mano.
 *
 * El archivo esta en UTF-8, como el resto del repositorio, porque el lema
 * espanol lleva acentos y se graban en la imagen tal cual. Los comentarios van
 * sin acentos por coherencia con el otro tool.
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const IMG = path.join(RAIZ, "src", "img");

/* Lo unico que se edita normalmente. Dos lineas por idioma. */
const LEMAS = {
  es: {
    salida: "og-tuaccesible.png",
    lineas: ["Consultoría en accesibilidad digital.", "Auditorías WCAG, EN 301 549 y EAA."]
  },
  en: {
    salida: "og-tuaccesible-en.png",
    /* ADA va delante de EN 301 549: es la norma que reconoce un comprador
       estadounidense, y es el orden que sigue el resto de la version inglesa. */
    lineas: ["Digital accessibility consulting.", "WCAG, ADA and EN 301 549 audits."]
  }
};

/* Medido, no estimado. Ver la nota de arriba antes de cambiar nada. */
const GEOMETRIA = {
  ancho: 1200,
  alto: 630,
  fondo: "#FFFFFF",
  franja: { alto: 16, color: "#0B4A57" },
  logo: { izquierda: 100.26, arriba: 122.4, ancho: 760.7 },
  margen: 100,
  lema: { tam: 44, interlineado: 57, arriba: 339, color: "#10181B" },
  url: { texto: "tuaccesible.com", tam: 30, arriba: 487, color: "#455055" }
};

const PILA_TIPOGRAFICA =
  '"Century Gothic","Avenir Next",Futura,"Segoe UI","Helvetica Neue",Arial,sans-serif';

function cargarPuppeteer() {
  try {
    return require("puppeteer");
  } catch (e) {
    console.error(
      "No se encontro puppeteer.\n" +
      "Viene instalado con pa11y-ci, asi que lo normal es que falte por no haber\n" +
      "corrido npm install. Si pa11y-ci ya no lo trae, anadelo:\n" +
      "  npm install --save-dev puppeteer"
    );
    process.exit(1);
  }
}

function leerLogo() {
  const svg = fs.readFileSync(path.join(IMG, "logo-tuaccesible.svg"), "utf8");
  return svg
    /* El archivo suelto trae medidas fijas; aqui lo dimensiona el contenedor. */
    .replace(/\swidth="\d+"\sheight="\d+"/, "")
    /* Dentro de la tarjeta el nombre ya esta en el lema, y el alt de la imagen
       lo transcribe entero, asi que el SVG no debe anunciarse por su cuenta. */
    .replace(/role="img" aria-labelledby="titulo"/, 'aria-hidden="true"');
}

function construirHtml(idioma, logo) {
  const g = GEOMETRIA;
  const lema = LEMAS[idioma];
  return '<!doctype html><html lang="' + idioma + '"><head><meta charset="utf-8"><style>' +
    "html,body{margin:0;padding:0;width:" + g.ancho + "px;height:" + g.alto + "px;background:" + g.fondo + ";}" +
    ".franja{position:absolute;left:0;top:0;width:" + g.ancho + "px;height:" + g.franja.alto + "px;background:" + g.franja.color + ";}" +
    ".logo{position:absolute;left:" + g.logo.izquierda + "px;top:" + g.logo.arriba + "px;width:" + g.logo.ancho + "px;}" +
    ".logo svg{width:100%;height:auto;display:block;}" +
    ".lema,.url{position:absolute;left:" + g.margen + "px;font-family:" + PILA_TIPOGRAFICA + ";font-weight:400;white-space:pre;}" +
    ".lema{top:" + g.lema.arriba + "px;font-size:" + g.lema.tam + "px;line-height:" + g.lema.interlineado + "px;color:" + g.lema.color + ";}" +
    ".url{top:" + g.url.arriba + "px;font-size:" + g.url.tam + "px;color:" + g.url.color + ";}" +
    "</style></head><body>" +
    '<div class="franja"></div>' +
    '<div class="logo">' + logo + "</div>" +
    '<div class="lema">' + lema.lineas.join("\n") + "</div>" +
    '<div class="url">' + g.url.texto + "</div>" +
    "</body></html>";
}

/* Se ejecuta dentro del navegador: recibe el PNG ya escrito en disco y
   devuelve la caja de tinta de cada zona. El calculo va ahi y no aqui para no
   traer tres millones de valores por el puente; solo cruzan cuatro cajas. */
function medirCajasEnNavegador(b64) {
  return new Promise(function (resolver) {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    img.decode().then(function () {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      function caja(y0, y1) {
        let minX = Infinity, maxX = -1, minY = Infinity, maxY = -1;
        for (let y = y0; y < y1; y++) {
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4;
            const blanco = d[i] > 246 && d[i + 1] > 246 && d[i + 2] > 246;
            if (!blanco) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
      }
      resolver({ logo: caja(110, 290), linea1: caja(330, 400), linea2: caja(400, 465), url: caja(470, 545) });
    });
  });
}

function describir(c) {
  return c ? "x=" + c.x + " y=" + c.y + " " + c.w + "x" + c.h : "(vacia)";
}

async function main() {
  const puppeteer = cargarPuppeteer();
  const logo = leerLogo();
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: GEOMETRIA.ancho, height: GEOMETRIA.alto, deviceScaleFactor: 1 });

  const medidas = {};
  for (const idioma of Object.keys(LEMAS)) {
    const destino = path.join(IMG, LEMAS[idioma].salida);
    await pagina.setContent(construirHtml(idioma, logo), { waitUntil: "load" });

    /* Century Gothic o nada: si falta, el lema saldria con otra letra. */
    const hayCenturyGothic = await pagina.evaluate(function () {
      function ancho(familia) {
        const s = document.createElement("span");
        s.style.cssText = "position:absolute;font-size:100px;white-space:pre;font-family:" + familia;
        s.textContent = "Digital accessibility";
        document.body.appendChild(s);
        const w = s.getBoundingClientRect().width;
        s.remove();
        return Math.round(w);
      }
      return ancho('"Century Gothic", monospace') !== ancho("monospace");
    });
    if (!hayCenturyGothic) {
      console.error(
        "FALLA  Century Gothic no esta instalada en esta maquina.\n" +
        "       El lema saldria con otra letra y la tarjeta no coincidiria con la\n" +
        "       publicada. Instalala, o genera las tarjetas donde si este."
      );
      await navegador.close();
      process.exit(1);
    }

    await pagina.screenshot({ path: destino, type: "png" });

    /* Se mide sobre el PNG ya escrito, no sobre el DOM, para comprobar lo que
       de verdad queda en el archivo. */
    const base64 = fs.readFileSync(destino).toString("base64");
    medidas[idioma] = await pagina.evaluate(medirCajasEnNavegador, base64);
    console.log("  ok    " + LEMAS[idioma].salida + "  (" + fs.statSync(destino).size + " bytes)");
    console.log("        logo " + describir(medidas[idioma].logo) + "   url " + describir(medidas[idioma].url));
  }

  await navegador.close();

  /* El logotipo y la direccion son identicos en las dos tarjetas: si no caen en
     el mismo sitio, algo se ha desalineado y hay que mirarlo antes de publicar. */
  let fallos = 0;
  const TOLERANCIA = 2;
  ["logo", "url"].forEach(function (zona) {
    const a = medidas.es[zona], b = medidas.en[zona];
    const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
    const dw = Math.abs(a.w - b.w), dh = Math.abs(a.h - b.h);
    const ok = dx <= TOLERANCIA && dy <= TOLERANCIA && dw <= TOLERANCIA && dh <= TOLERANCIA;
    if (!ok) fallos++;
    console.log(
      (ok ? "  ok    " : "  FALLA ") + zona + " alineado entre las dos tarjetas  " +
      "(dx=" + dx + " dy=" + dy + " dw=" + dw + " dh=" + dh + ", max " + TOLERANCIA + ")"
    );
  });

  if (fallos > 0) {
    console.error("\nLas dos tarjetas no coinciden. No las publiques asi.");
    process.exit(1);
  }
  console.log("\nDos tarjetas generadas y alineadas entre si.");
  console.log("Miralas antes de comitear: el lema es texto grabado y aqui no hay quien lo revise.");
}

main();
