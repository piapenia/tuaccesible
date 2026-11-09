#!/usr/bin/env node
/*
 * Servidor local para trabajar en el sitio: npm run dev
 *
 * Dibuja cada pagina con React en el momento en que el navegador la pide,
 * asi que siempre muestra lo ultimo que se guardo. Cuando cambia un archivo
 * de src/, la pestana abierta se recarga sola.
 *
 * Abre en http://localhost:5173/. Si ese puerto esta ocupado, prueba el
 * siguiente (5174, 5175...) y avisa en la terminal cual quedo.
 * Para apagarlo: Ctrl+C.
 *
 * Solo atiende a esta misma computadora. Para abrir el sitio desde el
 * celular u otro equipo de la misma red, por ejemplo para probarlo con
 * TalkBack o VoiceOver: npm run dev -- --host
 * Asi lo ve cualquiera conectado a esa red, asi que conviene usarlo solo en
 * una red de confianza y apagarlo al terminar.
 *
 * Diferencias con lo publicado, todas a proposito y solo en este modo:
 *   - La politica de seguridad deja abrir el WebSocket de la recarga y no
 *     lleva upgrade-insecure-requests (ver src/seguridad.js).
 *   - Cada pagina carga /@vite/client, que es el que recarga la pestana.
 *   - Si hay islas, el JavaScript se sirve sin compilar desde src/.
 */

import http from "node:http";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createServer } from "vite";

const raiz = path.resolve(import.meta.dirname, "..");
const puertoInicial = Number(process.env.PORT) || 5173;

// 127.0.0.1 y no "localhost": segun el sistema, "localhost" puede quedar
// solo en IPv6 (::1) y entonces 127.0.0.1 no contesta. Con 127.0.0.1 el
// navegador igual llega escribiendo localhost.
const abiertoALaRed = process.argv.includes("--host");
const direccion = abiertoALaRed ? "0.0.0.0" : "127.0.0.1";

const servidor = http.createServer();
const vite = await createServer({
  root: raiz,
  appType: "custom",
  logLevel: "info",
  server: { middlewareMode: true, hmr: { server: servidor } },
});

function responder(res, estado, tipo, cuerpo, extra = {}) {
  if (res.headersSent) return res.end();
  res.writeHead(estado, { "Content-Type": tipo, "Cache-Control": "no-store", ...extra });
  res.end(cuerpo);
}

// Los mensajes de error suelen traer rutas completas del disco, con el
// nombre de usuario. Al navegador le llegan cortas: "./src/paginas/x.jsx".
// En Windows la letra de la unidad puede venir en mayuscula o minuscula.
function patronDeRuta(ruta) {
  const formas = [pathToFileURL(ruta).href, ruta, ruta.replaceAll("\\", "/")];
  const escapadas = formas.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(escapadas.join("|"), process.platform === "win32" ? "gi" : "g");
}
const rutaDelProyecto = patronDeRuta(raiz);
const rutaDelUsuario = patronDeRuta(os.homedir());
function sinRutasLocales(texto) {
  // Primero el proyecto, que suele estar dentro de la carpeta del usuario.
  return String(texto).replace(rutaDelProyecto, ".").replace(rutaDelUsuario, "~");
}

// Al navegador va solo el mensaje, sin la pila de llamadas: la pila completa
// queda en la terminal, que solo ve quien levanto el servidor.
function fallar(res, error) {
  vite.ssrFixStacktrace(error);
  console.error(error);
  responder(
    res,
    500,
    "text/plain; charset=utf-8",
    `Error al dibujar la pagina: ${sinRutasLocales(error?.message ?? error)}\n\nEl detalle completo esta en la terminal.`
  );
}

async function atender(req, res) {
  const { pathname } = new URL(req.url, "http://localhost");
  const r = await vite.ssrLoadModule("/src/renderizar.jsx");

  if (pathname === "/sitemap.xml") return responder(res, 200, "application/xml; charset=utf-8", r.generarSitemap());
  if (pathname === "/robots.txt") return responder(res, 200, "text/plain; charset=utf-8", r.generarRobots());

  // Una direccion con un % suelto o mal armado (/%E0%A4%A) no es un error
  // del sitio sino de quien la escribio.
  let ruta;
  try {
    ruta = decodeURIComponent(pathname);
  } catch {
    return responder(res, 400, "text/plain; charset=utf-8", "La direccion esta mal formada.");
  }

  const pagina = r.buscarPagina(ruta);
  if (pagina) {
    const { html } = r.renderizarPagina(pagina, { desarrollo: true, scriptCliente: "/src/cliente.jsx" });
    return responder(res, 200, "text/html; charset=utf-8", html);
  }

  // Igual que GitHub Pages: /servicios lleva a /servicios/.
  if (!pathname.endsWith("/") && r.buscarPagina(`${ruta}/`)) {
    return responder(res, 301, "text/plain; charset=utf-8", "", { Location: `${pathname}/` });
  }

  // Y cualquier otra direccion muestra la pagina 404 con su codigo.
  const noEncontrada = r.buscarPagina("/404.html");
  const { html } = r.renderizarPagina(noEncontrada, { desarrollo: true, scriptCliente: "/src/cliente.jsx" });
  return responder(res, 404, "text/html; charset=utf-8", html);
}

servidor.on("request", (req, res) => {
  // Primero Vite: archivos de public/ (CSS, imagenes, scripts) y modulos de
  // src/. Lo que Vite no atiende sigue aca. Sus propios errores (un modulo
  // con un error de sintaxis, por ejemplo) los anota en la terminal; si
  // alguno llegara hasta aca, se contesta igual que un error de pagina.
  vite.middlewares(req, res, (error) => {
    if (error) return fallar(res, error);
    atender(req, res).catch((e) => fallar(res, e));
  });
});

// Vite ya invalida los modulos que cambian; esto le avisa a la pestana.
vite.watcher.on("change", (archivo) => {
  if (archivo.startsWith(path.join(raiz, "src") + path.sep) || archivo.startsWith(path.join(raiz, "public") + path.sep)) {
    vite.ws.send({ type: "full-reload", path: "*" });
  }
});

function direccionesDeLaRed() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i.address);
}

// Un solo aviso, con el puerto que de verdad quedo: si el primero estaba
// ocupado, el intento fallido no tiene que anunciar nada.
let alFallar = null;
servidor.on("listening", () => {
  if (alFallar) servidor.off("error", alFallar);
  const puerto = servidor.address().port;
  console.log(`\nSitio en http://localhost:${puerto}/  (Ctrl+C para apagar)`);
  if (abiertoALaRed) {
    for (const ip of direccionesDeLaRed()) console.log(`Desde otro equipo de la red: http://${ip}:${puerto}/`);
    console.log("Atencion: lo puede abrir cualquiera conectado a esta red.");
  }
  console.log("");
});

function escuchar(puerto) {
  alFallar = (error) => {
    if (error.code === "EADDRINUSE" && puerto < puertoInicial + 20) {
      console.log(`El puerto ${puerto} esta ocupado, pruebo con ${puerto + 1}...`);
      escuchar(puerto + 1);
    } else {
      throw error;
    }
  };
  servidor.once("error", alFallar);
  servidor.listen(puerto, direccion);
}

escuchar(puertoInicial);
