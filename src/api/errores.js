/* Errores de la API, con un codigo estable para cada caso.

   La interfaz nunca muestra lo que dice el servidor: mira error.codigo y
   elige su propio mensaje, en espanol o en ingles. error.message es para la
   consola de quien programa, no para la pagina.

   Que significa cada codigo y quien lo produce esta en
   docs/contrato-api.md, seccion "Formato de error". */

export const codigosDeError = Object.freeze([
  // Los produce el navegador: el pedido no salio, no llego o no volvio bien.
  "no-configurado", // el sitio se compilo sin VITE_API_URL (hoy, el publicado)
  "sin-conexion", // backend apagado, sin red, o CORS que no lo deja pasar
  "tiempo-agotado", // el backend no contesto dentro del tiempo limite
  "respuesta-invalida", // contesto, pero no lo que dice el contrato
  // Datos que no pasan la validacion, en el front o en el back.
  "url-invalida",
  "puntaje-invalido",
  "comentario-invalido",
  "mensaje-invalido", // la respuesta de la persona en la entrevista
  "id-invalido",
  "datos-invalidos", // cualquier otro dato mal armado
  // Respuestas del backend.
  "no-encontrada", // 404: esa sesion no existe
  "demasiados-pedidos", // 429: limite de pedidos
  "sitio-inaccesible", // 422: el backend no pudo abrir la pagina para analizarla
  "servidor", // 500 o cualquier otro estado que no esta en el contrato
]);

export class ErrorApi extends Error {
  /* estado: el codigo HTTP de la respuesta, o null si no hubo respuesta.
     causa: el error original, por ejemplo el TypeError de fetch. */
  constructor(codigo, { estado = null, causa } = {}) {
    if (!codigosDeError.includes(codigo)) {
      throw new TypeError(`ErrorApi: "${codigo}" no esta en codigosDeError (src/api/errores.js)`);
    }
    super(`API de tuaccesible: ${codigo}${estado ? ` (HTTP ${estado})` : ""}`, causa === undefined ? undefined : { cause: causa });
    this.name = "ErrorApi";
    this.codigo = codigo;
    this.estado = estado;
  }
}
