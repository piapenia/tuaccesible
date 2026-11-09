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
 * Diferencias con lo publicado, todas a proposito y solo en este modo:
 *   - La politica de seguridad deja abrir el WebSocket de la recarga y no
 *     lleva upgrade-insecure-requests (ver src/seguridad.js).
 *   - Cada pagina carga /@vite/client, que es el que recarga la pestana.
 *   - Si hay islas, el JavaScript se sirve sin compilar desde src/.
 */

import http from "node:http";
import path from "node:path";
import { createServer } from "vite";

const raiz = path.resolve(import.meta.dirname, "..");
const puertoInicial = Number(process.env.PORT) || 5173;

const servidor = http.createServer();
const vite = await createServer({
  root: raiz,
  appType: "custom",
  logLevel: "info",
  server: { middlewareMode: true, hmr: { server: servidor } },
});

function responder(res, estado, tipo, cuerpo, extra = {}) {
  res.writeHead(estado, { "Content-Type": tipo, "Cache-Control": "no-store", ...extra });
  res.end(cuerpo);
}

async function atender(req, res) {
  const { pathname } = new URL(req.url, "http://localhost");
  const r = await vite.ssrLoadModule("/src/renderizar.jsx");

  if (pathname === "/sitemap.xml") return responder(res, 200, "application/xml; charset=utf-8", r.generarSitemap());
  if (pathname === "/robots.txt") return responder(res, 200, "text/plain; charset=utf-8", r.generarRobots());

  const pagina = r.buscarPagina(decodeURIComponent(pathname));
  if (pagina) {
    const { html } = r.renderizarPagina(pagina, { desarrollo: true, scriptCliente: "/src/cliente.jsx" });
    return responder(res, 200, "text/html; charset=utf-8", html);
  }

  // Igual que GitHub Pages: /servicios lleva a /servicios/.
  if (!pathname.endsWith("/") && r.buscarPagina(`${pathname}/`)) {
    return responder(res, 301, "text/plain; charset=utf-8", "", { Location: `${pathname}/` });
  }

  // Y cualquier otra direccion muestra la pagina 404 con su codigo.
  const noEncontrada = r.buscarPagina("/404.html");
  const { html } = r.renderizarPagina(noEncontrada, { desarrollo: true, scriptCliente: "/src/cliente.jsx" });
  return responder(res, 404, "text/html; charset=utf-8", html);
}

servidor.on("request", (req, res) => {
  // Primero Vite: archivos de public/ (CSS, imagenes, scripts) y modulos de src/.
  vite.middlewares(req, res, () => {
    atender(req, res).catch((error) => {
      vite.ssrFixStacktrace(error);
      console.error(error);
      responder(
        res,
        500,
        "text/plain; charset=utf-8",
        `Error al dibujar la pagina. El detalle tambien esta en la terminal.\n\n${error.stack ?? error}`
      );
    });
  });
});

// Vite ya invalida los modulos que cambian; esto le avisa a la pestana.
vite.watcher.on("change", (archivo) => {
  if (archivo.startsWith(path.join(raiz, "src") + path.sep) || archivo.startsWith(path.join(raiz, "public") + path.sep)) {
    vite.ws.send({ type: "full-reload", path: "*" });
  }
});

function escuchar(puerto) {
  servidor.once("error", (error) => {
    if (error.code === "EADDRINUSE" && puerto < puertoInicial + 20) {
      console.log(`El puerto ${puerto} esta ocupado, pruebo con ${puerto + 1}...`);
      escuchar(puerto + 1);
    } else {
      throw error;
    }
  });
  servidor.listen(puerto, () => {
    console.log(`\nSitio en http://localhost:${puerto}/  (Ctrl+C para apagar)\n`);
  });
}

escuchar(puertoInicial);
