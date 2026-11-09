/* Control de la carpeta de salida de la compilacion.

   scripts/construir.js vacia la carpeta de salida entera antes de escribir el
   sitio. Con --salida se puede elegir cualquiera, y un error de tipeo
   (--salida . o --salida ..) borraria el proyecto, o la carpeta del usuario.
   Antes de borrar nada se revisa que la carpeta sea una de estas:

   - dist/ del proyecto, o algo dentro de ella: es la salida de siempre y no
     se sube a GitHub.
   - Una carpeta que no existe o que esta vacia.
   - Una compilacion anterior de este sitio: se la reconoce porque tiene el
     mismo CNAME que public/, que es lo primero que se copia.

   Y nunca, aunque cumpla lo anterior, la carpeta del proyecto, una que la
   contenga, ni public/ o src/ (public/ tiene el CNAME, asi que pasaria por
   una compilacion vieja). */

import fs from "node:fs";
import path from "node:path";

// true si ruta es carpeta o esta dentro de ella. path.relative ya compara
// sin distinguir mayusculas en Windows, y entre unidades distintas devuelve
// una ruta absoluta.
function dentroDe(carpeta, ruta) {
  const relativa = path.relative(carpeta, ruta);
  return relativa === "" || (!relativa.startsWith("..") && !path.isAbsolute(relativa));
}

// Resuelve accesos directos y enlaces simbolicos de lo que ya existe, para
// que una carpeta enlazada al proyecto no pase por otra.
function rutaReal(ruta) {
  let actual = ruta;
  const resto = [];
  while (!fs.existsSync(actual)) {
    const padre = path.dirname(actual);
    if (padre === actual) return ruta;
    resto.unshift(path.basename(actual));
    actual = padre;
  }
  return path.join(fs.realpathSync.native(actual), ...resto);
}

function leer(archivo) {
  try {
    return fs.readFileSync(archivo, "utf8").trim();
  } catch {
    return null;
  }
}

/* Lanza un Error con la explicacion si no se puede vaciar salida.
   salida y raiz tienen que ser rutas absolutas. */
export function revisarSalida(salida, raiz) {
  const destino = rutaReal(salida);
  const proyecto = rutaReal(raiz);

  if (dentroDe(destino, proyecto)) {
    throw new Error(
      `La carpeta de salida (${salida}) es la del proyecto o una que la contiene. ` +
        "La compilacion la vacia antes de escribir, asi que borraria el proyecto entero. " +
        "Usa una carpeta propia, por ejemplo dist."
    );
  }
  for (const fuente of ["public", "src"]) {
    if (dentroDe(path.join(proyecto, fuente), destino)) {
      throw new Error(
        `La carpeta de salida (${salida}) es ${fuente}/ o una carpeta dentro de ella, y eso es codigo del sitio. ` +
          "La compilacion la vaciaria. Usa una carpeta propia, por ejemplo dist."
      );
    }
  }

  if (dentroDe(path.join(proyecto, "dist"), destino)) return;
  if (!fs.existsSync(destino)) return;
  if (!fs.statSync(destino).isDirectory()) {
    throw new Error(`La salida (${salida}) es un archivo, no una carpeta.`);
  }
  if (fs.readdirSync(destino).length === 0) return;

  const cname = leer(path.join(destino, "CNAME"));
  if (cname && cname === leer(path.join(proyecto, "public", "CNAME"))) return;

  throw new Error(
    `La carpeta de salida (${salida}) ya tiene archivos y no parece una compilacion anterior de este sitio ` +
      "(no tiene su archivo CNAME). La compilacion la vaciaria entera, asi que no la toco. " +
      "Elige una carpeta nueva o vacia, o borrala a mano si de verdad sobra."
  );
}
