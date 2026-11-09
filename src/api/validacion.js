/* Limpieza y validacion de lo que el front manda a la API.

   Se valida en el navegador para responder enseguida y para que ningun dato
   de mas salga de la computadora de la persona (por ejemplo, la parte de la
   direccion donde viajan correos o tokens). El backend vuelve a validar
   todo, porque a la API le puede escribir cualquiera, no solo este sitio.

   Cada funcion devuelve el valor limpio o tira un ErrorApi con su codigo.
   Los limites son una propuesta para charlar con Fafa (docs/contrato-api.md):
   si cambian, cambian aca, en el backend y en la tabla. */

import { ErrorApi } from "./errores.js";

export const LARGO_MAXIMO_URL = 2048;
export const LARGO_MAXIMO_COMENTARIO = 1000;
export const LARGO_MAXIMO_MENSAJE = 1000;
export const PUNTAJE_MINIMO = 1;
export const PUNTAJE_MAXIMO = 10;
// Los dos idiomas del sitio: el del analisis de axe y el de la entrevista.
export const IDIOMAS = Object.freeze(["es", "en"]);

const FORMA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// "algo://" al principio: la persona escribio el protocolo.
const CON_PROTOCOLO = /^[a-z][a-z0-9+.-]*:\/\//i;

/* Direccion del sitio a analizar. Queda solo protocolo, dominio, puerto y
   ruta. La query y el fragmento se descartan, porque ahi suelen viajar
   correos, tokens y codigos de acceso (?email=...&token=..., #access_token=...).
     "misitio.com"                              ->  "https://misitio.com/"
     " HTTPS://MiSitio.com:443/tienda?email=x " ->  "https://misitio.com/tienda"
     "ftp://misitio.com", "javascript:..."     ->  url-invalida
   Una direccion con usuario y contrasena (https://ana:clave@misitio.com)
   tambien es url-invalida: no se manda ni se guarda. */
export function limpiarUrl(texto) {
  if (typeof texto !== "string" || !texto.trim()) throw new ErrorApi("url-invalida");
  let valor = texto.trim();
  // Quien escribe "misitio.com" quiere decir https://misitio.com
  if (!CON_PROTOCOLO.test(valor)) valor = `https://${valor}`;
  let url;
  try {
    url = new URL(valor);
  } catch {
    throw new ErrorApi("url-invalida");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new ErrorApi("url-invalida");
  if (url.username || url.password) throw new ErrorApi("url-invalida");
  // Un dominio publico tiene al menos un punto. localhost se acepta para
  // probar en la propia computadora; si se analiza o no, lo decide el back.
  if (!url.hostname.includes(".") && url.hostname !== "localhost") throw new ErrorApi("url-invalida");
  url.search = "";
  url.hash = "";
  // El largo se mide ya limpia: una query larguisima no importa, se descarta.
  if (url.href.length > LARGO_MAXIMO_URL) throw new ErrorApi("url-invalida");
  return url.href;
}

/* Puntaje entero de 1 a 10. Un <select> o un grupo de botones de opcion
   entregan el valor como texto ("8"): se acepta y se convierte a numero. */
export function validarPuntaje(valor) {
  const numero = typeof valor === "string" && /^\d+$/.test(valor.trim()) ? Number(valor.trim()) : valor;
  if (!Number.isInteger(numero) || numero < PUNTAJE_MINIMO || numero > PUNTAJE_MAXIMO) {
    throw new ErrorApi("puntaje-invalido");
  }
  return numero;
}

/* Comentario opcional. Se quitan los espacios de las puntas y los
   caracteres de control, que no se ven (y el nulo PostgreSQL ni siquiera lo
   acepta en un texto); los saltos de linea y las tabulaciones se quedan.
   Si no queda nada, es null.
   El largo se cuenta en caracteres, como char_length de PostgreSQL, y no
   con .length de JavaScript, que cuenta un emoji como dos. */
export function limpiarComentario(valor) {
  return limpiarTexto(valor, LARGO_MAXIMO_COMENTARIO, "comentario-invalido");
}

/* Lo que la persona le contesta al asistente en la entrevista. Se limpia
   igual que el comentario, pero no puede quedar vacio. null no es un
   mensaje vacio: es el pedido para empezar la entrevista. */
export function limpiarMensaje(valor) {
  if (valor === null) return null;
  const limpio = limpiarTexto(valor, LARGO_MAXIMO_MENSAJE, "mensaje-invalido");
  if (limpio === null) throw new ErrorApi("mensaje-invalido");
  return limpio;
}

function limpiarTexto(valor, largoMaximo, codigo) {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== "string") throw new ErrorApi(codigo);
  const limpio = valor
    .normalize("NFC")
    .replace(/\p{Cc}/gu, (caracter) => (caracter === "\n" || caracter === "\t" ? caracter : ""))
    .trim();
  if (!limpio) return null;
  if ([...limpio].length > largoMaximo) throw new ErrorApi(codigo);
  return limpio;
}

/* "es" o "en". Otra cosa es un error de programacion de la isla, asi que
   es datos-invalidos y no tiene mensaje propio. */
export function validarIdioma(valor) {
  if (!IDIOMAS.includes(valor)) throw new ErrorApi("datos-invalidos");
  return valor;
}

export function esUuid(valor) {
  return typeof valor === "string" && FORMA_UUID.test(valor);
}

/* id de una sesion: el UUID que devolvio el backend al crearla. Se valida
   antes de armar la direccion del pedido, asi nunca viaja otra cosa ahi. */
export function validarId(valor) {
  if (!esUuid(valor)) throw new ErrorApi("id-invalido");
  return valor.toLowerCase();
}

/* Cuerpo de POST /api/sessions: solo analyzed_url. */
export function validarSesionNueva(datos) {
  if (!esObjetoSimple(datos) || !tieneSoloCampos(datos, ["analyzed_url"])) throw new ErrorApi("datos-invalidos");
  return { analyzed_url: limpiarUrl(datos.analyzed_url) };
}

/* Cuerpo de PATCH /api/sessions/:id: uno o mas de estos campos. Un campo
   que no esta en la lista es un error, no se ignora: asi un nombre mal
   escrito (puntaje, meetingRequested) salta enseguida en vez de perderse. */
const CAMPOS_ACTUALIZABLES = ["score", "comment", "meeting_requested"];

export function validarCambios(cambios) {
  if (!esObjetoSimple(cambios)) throw new ErrorApi("datos-invalidos");
  const campos = Object.keys(cambios);
  if (campos.length === 0 || !tieneSoloCampos(cambios, CAMPOS_ACTUALIZABLES)) throw new ErrorApi("datos-invalidos");
  const limpios = {};
  if (campos.includes("score")) limpios.score = validarPuntaje(cambios.score);
  if (campos.includes("comment")) limpios.comment = limpiarComentario(cambios.comment);
  if (campos.includes("meeting_requested")) {
    if (typeof cambios.meeting_requested !== "boolean") throw new ErrorApi("datos-invalidos");
    limpios.meeting_requested = cambios.meeting_requested;
  }
  return limpios;
}

function esObjetoSimple(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function tieneSoloCampos(objeto, permitidos) {
  return Object.keys(objeto).every((campo) => permitidos.includes(campo));
}
