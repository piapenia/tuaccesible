/* Cliente de la API del servicio de testing (el backend de Fafa).

   Es logica pura: no lee import.meta.env ni nada propio de Vite, asi que se
   prueba en Node con un fetch falso (crear-cliente.test.js). Las islas no
   usan este archivo directo sino index.js, que ya trae la direccion del
   backend configurada.

     const api = crearClienteApi({ urlBase: "http://localhost:3000" });
     await api.comprobarDisponibilidad();  // { disponible: true, codigo: null }
     const sesion = await api.crearSesion({ analyzed_url: "misitio.com" });
     await api.actualizarSesion(sesion.id, { score: 9, comment: "Muy claro" });

   Y los de la propuesta para el analisis, la entrevista y el informe:

     const analisis = await api.analizarSesion(sesion.id, { idioma: "es" });
     const turno = await api.entrevistar(sesion.id, { idioma: "es", mensaje: null });  // empieza
     await api.entrevistar(sesion.id, { idioma: "es", mensaje: "Si, tiene un formulario" });
     api.urlInforme(sesion.id, "es");  // la direccion del PDF, para un enlace

   Los campos se llaman igual que las columnas de la tabla sessions, en
   snake_case, para no traducir nada entre el front, el back y la base.
   Si algo sale mal, la promesa se rechaza con un ErrorApi (ver errores.js).
   La excepcion es comprobarDisponibilidad, que nunca se rechaza: contesta
   si el servicio se puede usar y, si no, por que.
   Contrato completo: docs/contrato-api.md. */

import { ErrorApi } from "./errores.js";
import { comprobarAnalisis, comprobarTurno } from "./respuestas.js";
import { esUuid, limpiarMensaje, validarCambios, validarId, validarIdioma, validarSesionNueva } from "./validacion.js";

/* Lo maximo que espera cada pedido antes de rendirse. Cubre tambien la
   lectura de la respuesta: un servidor que manda las cabeceras y despues se
   queda callado no deja a la persona esperando para siempre. */
export const TIEMPO_LIMITE_MS = 10000;
/* El analisis abre la pagina en un navegador y corre axe, y la entrevista
   espera al LLM: los dos tardan bastante mas que un pedido comun. */
export const TIEMPO_LIMITE_LARGO_MS = 60000;

// Codigos que el backend puede mandar con un 400 o un 422 y que la
// interfaz ya sabe explicar. Cualquier otro queda en datos-invalidos.
const CODIGOS_DEL_BACKEND = [
  "url-invalida",
  "puntaje-invalido",
  "comentario-invalido",
  "mensaje-invalido",
  "id-invalido",
  "datos-invalidos",
  "sitio-inaccesible",
];

export function crearClienteApi({
  urlBase = null,
  fetch: fetchPropio = null,
  tiempoLimiteMs = TIEMPO_LIMITE_MS,
  tiempoLimiteLargoMs = TIEMPO_LIMITE_LARGO_MS,
} = {}) {
  const base = urlBase ? String(urlBase).replace(/\/+$/, "") : null;
  // fetch se llama suelto, nunca como metodo de otro objeto: el del
  // navegador falla con "Illegal invocation" si no se lo llama sobre window.
  const llamarFetch = fetchPropio ?? ((...argumentos) => globalThis.fetch(...argumentos));

  function exigirConfiguracion() {
    if (!base) throw new ErrorApi("no-configurado");
  }

  async function pedir(metodo, ruta, cuerpo, limite = tiempoLimiteMs) {
    exigirConfiguracion();
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), limite);
    // El unico que aborta es el temporizador: si fetch falla despues de
    // abortar, fue por tiempo; si no, es que no hubo conexion.
    const errorDeRed = (causa, estado = null) =>
      new ErrorApi(controlador.signal.aborted ? "tiempo-agotado" : "sin-conexion", { estado, causa });
    try {
      let respuesta;
      try {
        respuesta = await llamarFetch(base + ruta, {
          method: metodo,
          headers: cuerpo === undefined ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
          body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
          // Sin cookies ni credenciales: el servicio no tiene usuarios.
          credentials: "omit",
          // Nada de lo que contesta la API queda guardado en el navegador.
          cache: "no-store",
          signal: controlador.signal,
        });
      } catch (error) {
        throw errorDeRed(error);
      }
      let texto;
      try {
        texto = await respuesta.text();
      } catch (error) {
        throw errorDeRed(error, respuesta.status);
      }
      const datos = leerJson(texto);
      if (!respuesta.ok) throw errorSegunEstado(respuesta.status, datos);
      return { estado: respuesta.status, datos };
    } finally {
      clearTimeout(temporizador);
    }
  }

  /* GET /api/health. Devuelve { disponible, codigo }: codigo es null si el
     servicio responde, o el motivo si no (no-configurado, sin-conexion...). */
  async function comprobarDisponibilidad() {
    try {
      const { datos } = await pedir("GET", "/api/health");
      if (datos?.status !== "ok") throw new ErrorApi("respuesta-invalida");
      return { disponible: true, codigo: null };
    } catch (error) {
      if (error instanceof ErrorApi) return { disponible: false, codigo: error.codigo };
      throw error;
    }
  }

  /* POST /api/sessions con { analyzed_url }. Devuelve la sesion creada,
     con su id, que la isla guarda en memoria para puntuar despues. */
  async function crearSesion(datos) {
    exigirConfiguracion();
    const cuerpo = validarSesionNueva(datos);
    const { datos: sesion } = await pedir("POST", "/api/sessions", cuerpo);
    return comprobarSesion(sesion);
  }

  /* PATCH /api/sessions/:id con uno o mas de score, comment y
     meeting_requested. Devuelve la sesion actualizada, o null si el backend
     contesta 204 (sin cuerpo). */
  async function actualizarSesion(id, cambios) {
    exigirConfiguracion();
    const idLimpio = validarId(id);
    const cuerpo = validarCambios(cambios);
    const { estado, datos: sesion } = await pedir("PATCH", `/api/sessions/${idLimpio}`, cuerpo);
    if (estado === 204) return null;
    return comprobarSesion(sesion, idLimpio);
  }

  /* POST /api/sessions/:id/analysis (propuesta). El backend corre axe sobre
     la direccion de la sesion; devuelve el resumen ya comprobado (ver
     respuestas.js). */
  async function analizarSesion(id, { idioma } = {}) {
    exigirConfiguracion();
    const idLimpio = validarId(id);
    const cuerpo = { language: validarIdioma(idioma) };
    const { datos } = await pedir("POST", `/api/sessions/${idLimpio}/analysis`, cuerpo, tiempoLimiteLargoMs);
    return comprobarAnalisis(datos);
  }

  /* POST /api/sessions/:id/interview (propuesta). mensaje en null empieza
     la entrevista; despues va cada respuesta de la persona. No hay valor
     por defecto a proposito: un mensaje que se perdio en el camino
     (undefined) es mensaje-invalido, no un "empezar de nuevo". Devuelve
     { reply, finished }. */
  async function entrevistar(id, { idioma, mensaje } = {}) {
    exigirConfiguracion();
    const idLimpio = validarId(id);
    const cuerpo = { language: validarIdioma(idioma), message: limpiarMensaje(mensaje) };
    const { datos } = await pedir("POST", `/api/sessions/${idLimpio}/interview`, cuerpo, tiempoLimiteLargoMs);
    return comprobarTurno(datos);
  }

  /* Direccion del informe en PDF (propuesta). No sale ningun pedido: la
     isla la pone en un enlace comun y la descarga la maneja el navegador. */
  function urlInforme(id, idioma) {
    exigirConfiguracion();
    return `${base}/api/sessions/${validarId(id)}/report?language=${validarIdioma(idioma)}`;
  }

  return Object.freeze({
    configurado: base !== null,
    comprobarDisponibilidad,
    crearSesion,
    actualizarSesion,
    analizarSesion,
    entrevistar,
    urlInforme,
  });
}

function leerJson(texto) {
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/* Del estado HTTP al codigo. Del cuerpo solo se mira "error", y solo si es
   uno de los codigos conocidos: cualquier otro texto del servidor se
   descarta, no llega a la pantalla. */
function errorSegunEstado(estado, datos) {
  if (estado === 404) return new ErrorApi("no-encontrada", { estado });
  if (estado === 429) return new ErrorApi("demasiados-pedidos", { estado });
  if (estado === 400 || estado === 422) {
    const codigo = datos?.error;
    return new ErrorApi(CODIGOS_DEL_BACKEND.includes(codigo) ? codigo : "datos-invalidos", { estado });
  }
  return new ErrorApi("servidor", { estado });
}

/* La respuesta tiene que traer la sesion con un id con forma de UUID, y al
   actualizar, el mismo id que se pidio. Un id 1, 2, 3 (columna SERIAL) es
   un error del contrato: deja adivinar y pisar sesiones ajenas. */
function comprobarSesion(sesion, idEsperado = null) {
  if (typeof sesion !== "object" || sesion === null || !esUuid(sesion.id)) throw new ErrorApi("respuesta-invalida");
  if (idEsperado && sesion.id.toLowerCase() !== idEsperado) throw new ErrorApi("respuesta-invalida");
  return sesion;
}
