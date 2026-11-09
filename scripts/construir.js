#!/usr/bin/env node
/*
 * Compilacion de tuaccesible.com: de los componentes de src/ a HTML estatico.
 *
 *   npm run build                      escribe el sitio en dist/
 *   node scripts/construir.js --salida /otra/carpeta
 *
 * La carpeta de salida se vacia antes de escribir. Por eso tiene que ser
 * dist/, una carpeta nueva o vacia, o una compilacion anterior del sitio:
 * cualquier otra se rechaza sin tocarla (ver scripts/salida-segura.js).
 *
 * Pasos:
 *   1. Vite compila src/renderizar.jsx para Node (en una carpeta temporal).
 *   2. Se copia public/ tal cual: CSS, imagenes, los dos scripts chicos,
 *      CNAME y .well-known/security.txt.
 *   3. Se dibuja cada pagina con React y se escribe como index.html en su
 *      carpeta, mas 404.html, sitemap.xml y robots.txt.
 *   4. Solo si alguna pagina usa una <Isla>, Vite compila el JavaScript del
 *      navegador (src/cliente.jsx) en dist/assets/ y esas paginas se vuelven
 *      a dibujar con su <script>. Si ninguna la usa, no se publica nada de
 *      React para el navegador.
 *
 * El resultado no depende de ningun servidor: es lo mismo que publica
 * GitHub Pages.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { revisarSalida } from "./salida-segura.js";
import { revisarBackend } from "./backend-seguro.js";

const raiz = path.resolve(import.meta.dirname, "..");

function opcion(nombre) {
  const i = process.argv.indexOf(nombre);
  return i === -1 ? null : process.argv[i + 1];
}

const salida = path.resolve(raiz, opcion("--salida") ?? "dist");

// El paso 2 vacia la carpeta de salida: antes de llegar ahi, que no sea el
// proyecto ni otra carpeta con cosas (ver scripts/salida-segura.js). Y que
// un .env de esta computadora no afloje sin aviso la politica de seguridad
// (ver scripts/backend-seguro.js); el aviso sale al final, donde se lee.
let avisoDelBackend;
try {
  revisarSalida(salida, raiz);
  avisoDelBackend = revisarBackend(raiz);
} catch (error) {
  console.error(`\nNo se pudo compilar el sitio.\n${error.message}\n`);
  process.exit(1);
}

function escribir(relativo, contenido) {
  const destino = path.join(salida, relativo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, contenido);
}

const inicio = Date.now();
// La carpeta temporal va dentro de node_modules/.cache y no en la del
// sistema: el renderizador compilado importa react, y Node lo busca en el
// node_modules mas cercano al archivo. Cada compilacion usa una propia, asi
// que dos compilaciones a la vez no se pisan.
const cache = path.join(raiz, "node_modules", ".cache");
fs.mkdirSync(cache, { recursive: true });
const temporal = fs.mkdtempSync(path.join(cache, "tuaccesible-ssr-"));

try {
  // 1. El renderizador, compilado para Node.
  await build({
    root: raiz,
    mode: "production",
    logLevel: "warn",
    publicDir: false,
    build: {
      ssr: path.join(raiz, "src/renderizar.jsx"),
      outDir: temporal,
      emptyOutDir: true,
      minify: false,
      copyPublicDir: false,
    },
  });
  const compilado = fs.readdirSync(temporal).find((f) => /^renderizar\.(m?js)$/.test(f));
  if (!compilado) throw new Error(`Vite no genero renderizar.js en ${temporal}`);
  const { paginas, renderizarPagina, generarSitemap, generarRobots } = await import(
    pathToFileURL(path.join(temporal, compilado)).href
  );

  // 2. Lo estatico.
  fs.rmSync(salida, { recursive: true, force: true });
  fs.cpSync(path.join(raiz, "public"), salida, { recursive: true });

  // 3. Las paginas.
  let resultados = paginas.map((p) => renderizarPagina(p));

  // 4. El JavaScript del navegador, solo si hace falta.
  const conIslas = resultados.filter((r) => r.usaIslas).length;
  if (conIslas > 0) {
    await build({
      root: raiz,
      mode: "production",
      logLevel: "warn",
      publicDir: false,
      build: {
        outDir: salida,
        emptyOutDir: false,
        manifest: true,
        copyPublicDir: false,
        rolldownOptions: { input: path.join(raiz, "src/cliente.jsx") },
      },
    });
    const rutaManifiesto = path.join(salida, ".vite", "manifest.json");
    const manifiesto = JSON.parse(fs.readFileSync(rutaManifiesto, "utf8"));
    const entrada = manifiesto["src/cliente.jsx"];
    if (!entrada) throw new Error("El manifiesto de Vite no tiene la entrada src/cliente.jsx");
    const scriptCliente = `/${entrada.file}`;
    resultados = paginas.map((p) => renderizarPagina(p, { scriptCliente }));
    // El manifiesto solo sirve para esta compilacion: no se publica.
    fs.rmSync(path.join(salida, ".vite"), { recursive: true, force: true });
  }

  for (const r of resultados) escribir(r.archivo, r.html);
  escribir("sitemap.xml", generarSitemap());
  escribir("robots.txt", generarRobots());

  const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
  const islas = conIslas > 0 ? `, ${conIslas} con islas de React` : ", ninguna con JavaScript propio";
  const donde = path.relative(raiz, salida);
  const carpeta = !donde || donde.startsWith("..") ? salida : `${donde}/`;
  console.log(`Listo: ${resultados.length} paginas en ${carpeta}${islas} (${segundos} s).`);
  if (avisoDelBackend) console.log(`\n${avisoDelBackend}\n`);
} catch (error) {
  // Los errores que escribimos nosotros (una pagina sin titulo, dos paginas
  // que no se apuntan entre si) ya dicen que arreglar: se muestra solo el
  // mensaje, sin la pila de llamadas, que con lector de pantalla es una
  // pared de ruido. Para ver la pila: DEPURAR=1 npm run build
  console.error(`\nNo se pudo compilar el sitio.\n${error.message}\n`);
  if (process.env.DEPURAR) console.error(error.stack);
  process.exitCode = 1;
} finally {
  fs.rmSync(temporal, { recursive: true, force: true });
}
